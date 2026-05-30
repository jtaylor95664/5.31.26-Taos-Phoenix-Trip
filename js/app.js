/* ── STATE ────────────────────────────────────────────────────────────────── */
const state = {
  poiModalOpen: false,
  diningModalOpen: false,
  currentStage: 0,   // GPS-determined stage
  viewingStage: 0,   // displayed stage (may differ when user browses)
  isManualView: false,
  userLat: null,
  userLng: null,
  milesDriven: 0,
  map: null,
  userMarker: null,
  chargerMarkers: [],
  poiMarkers: [],
  routeLegs: [],      // populated after Directions API response
  actualTotalMiles: TRIP_DATA.totalMiles,
  mapExpanded: false,
  mapFullscreen: false,
  historyExpanded: false,
  geologyExpanded: false,
  metricsExpanded: false,
  gpsStarted: false,
  departureTime: null,
  firedMilestones: new Set(), // milestone ids already shown
};

/* ── HELPERS ──────────────────────────────────────────────────────────────── */
function haversine(lat1, lng1, lat2, lng2) {
  const R = 3958.8;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Project point P onto segment AB; return {t: 0..1, dist}
function projectOnSegment(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay;
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) return { t: 0, dist: Math.hypot(px - ax, py - ay) };
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len2));
  return { t, dist: Math.hypot(px - (ax + t * dx), py - (ay + t * dy)) };
}

function formatTime(date) {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function formatDuration(minutes) {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function el(id) { return document.getElementById(id); }

/* ── STAGE DETECTION ──────────────────────────────────────────────────────── */
function detectStage(lat, lng) {
  let minDist = Infinity, best = 0;
  TRIP_DATA.stages.forEach((stage, i) => {
    const { dist } = projectOnSegment(
      lng, lat,
      stage.startCoords.lng, stage.startCoords.lat,
      stage.endCoords.lng,   stage.endCoords.lat
    );
    if (dist < minDist) { minDist = dist; best = i; }
  });
  return best;
}

function getMilesDriven(lat, lng, stageIdx) {
  const stage = TRIP_DATA.stages[stageIdx];
  const { t } = projectOnSegment(
    lng, lat,
    stage.startCoords.lng, stage.startCoords.lat,
    stage.endCoords.lng,   stage.endCoords.lat
  );
  const stageMiles = state.routeLegs[stageIdx] || stage.distance;
  return stage.cumulativeStart + t * stageMiles;
}

function getRemainingChargeStops(stageIdx) {
  // Count charging stops not yet passed (stages after current)
  return TRIP_DATA.stages.slice(stageIdx + 1).filter(s => s.charging).length;
}

function getMilesToNextStop(lat, lng, stageIdx) {
  const stage = TRIP_DATA.stages[stageIdx];
  const { t } = projectOnSegment(
    lng, lat,
    stage.startCoords.lng, stage.startCoords.lat,
    stage.endCoords.lng,   stage.endCoords.lat
  );
  const stageMiles = state.routeLegs[stageIdx] || stage.distance;
  return (1 - t) * stageMiles;
}

/* ── GOOGLE MAPS ──────────────────────────────────────────────────────────── */
function initMap() {
  const center = { lat: 35.0, lng: -109.0 }; // rough center of Taos→Phoenix route

  state.map = new google.maps.Map(el('map'), {
    center,
    zoom: 7,
    mapTypeId: 'roadmap',
    disableDefaultUI: true,
    zoomControl: true,
    gestureHandling: 'greedy',
    styles: [
      { featureType: 'water',         stylers: [{ color: '#B8D4F5' }] },
      { featureType: 'landscape',     stylers: [{ color: '#F0F7FF' }] },
      // Tone highways down so they don't compete with the route overlay
      { featureType: 'road.highway',  stylers: [{ color: '#C5D9EF' }, { weight: 0.8 }] },
      { featureType: 'road.arterial', stylers: [{ color: '#DAE9F5' }] },
    ]
  });

  drawRoute();
  startGPS(); // Start GPS immediately — don't wait for the Directions API
}

function drawRoute() {
  const svc = new google.maps.DirectionsService();
  const wps = TRIP_DATA.routeWaypoints;

  svc.route({
    origin:      new google.maps.LatLng(wps[0].lat, wps[0].lng),
    destination: new google.maps.LatLng(wps[wps.length - 1].lat, wps[wps.length - 1].lng),
    waypoints:   wps.slice(1, -1).map(w => ({ location: new google.maps.LatLng(w.lat, w.lng), stopover: true })),
    travelMode:  google.maps.TravelMode.DRIVING,
    optimizeWaypoints: false,
  }, (result, status) => {
    if (status !== 'OK') { console.warn('Directions API:', status); return; }

    // Draw route — white halo behind, bright orange on top for maximum contrast
    const halo = new google.maps.DirectionsRenderer({
      map: state.map,
      suppressMarkers: true,
      polylineOptions: { strokeColor: '#FFFFFF', strokeWeight: 10, strokeOpacity: 0.9, zIndex: 1 }
    });
    halo.setDirections(result);

    const renderer = new google.maps.DirectionsRenderer({
      map: state.map,
      suppressMarkers: true,
      polylineOptions: { strokeColor: '#E8571A', strokeWeight: 6, strokeOpacity: 1.0, zIndex: 2 }
    });
    renderer.setDirections(result);

    // Store actual leg distances (meters → miles)
    state.routeLegs = result.routes[0].legs.map(leg => leg.distance.value / 1609.34);
    state.actualTotalMiles = state.routeLegs.reduce((a, b) => a + b, 0);

    // Update cumulative starts with real distances
    let cum = 0;
    state.routeLegs.forEach((miles, i) => {
      if (TRIP_DATA.stages[i]) {
        TRIP_DATA.stages[i].cumulativeStart = cum;
        cum += miles;
      }
    });

    addMapMarkers();
  });
}

function addMapMarkers() {
  const chargerIcon = {
    path: google.maps.SymbolPath.CIRCLE,
    scale: 9,
    fillColor: '#2C6FAC',
    fillOpacity: 1,
    strokeColor: '#FFFFFF',
    strokeWeight: 2.5,
  };

  const poiIcon = {
    path: google.maps.SymbolPath.CIRCLE,
    scale: 6,
    fillColor: '#7AB3E8',
    fillOpacity: 0.85,
    strokeColor: '#FFFFFF',
    strokeWeight: 2,
  };

  TRIP_DATA.stages.forEach((stage, i) => {
    if (stage.charging) {
      const marker = new google.maps.Marker({
        position: stage.endCoords,
        map: state.map,
        icon: chargerIcon,
        title: stage.charging.name,
        zIndex: 10,
      });

      const infoWin = new google.maps.InfoWindow({
        content: `<div style="font-family:sans-serif;font-size:13px;color:#1A2E4A;">
          <strong>⚡ ${stage.charging.name}</strong><br>
          ${stage.charging.address}
        </div>`
      });

      marker.addListener('click', () => {
        infoWin.open(state.map, marker);
        setViewingStage(i);
      });

      state.chargerMarkers.push(marker);
    }

    (stage.pois || []).forEach(poi => {
      const marker = new google.maps.Marker({
        position: poi.coords,
        map: state.map,
        icon: poiIcon,
        title: poi.name,
        zIndex: 5,
      });

      const infoWin = new google.maps.InfoWindow({
        content: `<div style="font-family:sans-serif;font-size:12px;color:#1A2E4A;max-width:180px;">
          <strong>📍 ${poi.name}</strong><br>
          <span style="color:#5A7A99;">${poi.description}</span>
        </div>`
      });

      marker.addListener('click', () => infoWin.open(state.map, marker));
      state.poiMarkers.push(marker);
    });
  });
}

function updateUserMarker(lat, lng) {
  if (!state.map) return;
  const pos = new google.maps.LatLng(lat, lng);
  if (!state.userMarker) {
    state.userMarker = new google.maps.Marker({
      position: pos,
      map: state.map,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 11,
        fillColor: '#4A90D9',
        fillOpacity: 1,
        strokeColor: '#FFFFFF',
        strokeWeight: 3,
      },
      title: 'Your location',
      zIndex: 100,
    });
  } else {
    state.userMarker.setPosition(pos);
  }
}

/* ── GPS ──────────────────────────────────────────────────────────────────── */
function startGPS() {
  if (!navigator.geolocation) {
    const s = el('gps-status');
    if (s) { s.textContent = 'GPS not available on this device.'; s.classList.remove('hidden'); }
    return;
  }
  navigator.geolocation.watchPosition(onGPSUpdate, onGPSError, {
    enableHighAccuracy: true,
    maximumAge: 20000,
    timeout: 15000,
  });
}

function onGPSUpdate(pos) {
  const lat = pos.coords.latitude;
  const lng = pos.coords.longitude;
  state.userLat = lat;
  state.userLng = lng;

  // Set departure time once on first fix
  if (!state.departureTime) {
    state.departureTime = new Date();
    state.departureTime.setHours(TRIP_DATA.departure.hour, TRIP_DATA.departure.minute, 0, 0);
    if (state.departureTime > new Date()) {
      // Before departure — show as not yet started
    }
  }

  const newStage = detectStage(lat, lng);
  const stageChanged = newStage !== state.currentStage;
  state.currentStage = newStage;
  state.milesDriven = getMilesDriven(lat, lng, newStage);

  updateUserMarker(lat, lng);

  if (!state.isManualView || stageChanged) {
    if (!state.isManualView) state.viewingStage = state.currentStage;
    renderStageNotes(state.viewingStage);
  }

  updateMetrics();
  updateSocorroWarning(state.currentStage);
  updateBackBar();
  checkMilestones(lat, lng);
}

function onGPSError(err) {
  console.warn('GPS error:', err.message);
  // Show static stage 0 info without GPS
  renderStageNotes(0);
  updateMetrics();
}

/* ── METRICS HEADER ───────────────────────────────────────────────────────── */
function updateMetrics() {
  const stage = TRIP_DATA.stages[state.currentStage];
  const totalMiles = state.actualTotalMiles;
  const driven = state.milesDriven;
  const remaining = Math.max(0, totalMiles - driven);
  const pct = Math.min(100, (driven / totalMiles) * 100);

  // Primary: miles to next stop
  let milesToNext = '--';
  if (state.userLat !== null) {
    const raw = getMilesToNextStop(state.userLat, state.userLng, state.currentStage);
    milesToNext = `${Math.round(raw)} mi`;
  }
  el('miles-to-next').textContent = milesToNext;

  // Stage badge
  el('stage-badge').textContent = `Stage ${state.currentStage + 1} of ${TRIP_DATA.stages.length}`;

  // Primary: ETA
  el('eta-taos').textContent = computeETA(remaining, state.currentStage);

  // Expanded
  el('progress-fill').style.width = pct.toFixed(1) + '%';
  el('progress-pct').textContent = Math.round(pct) + '%';
  el('miles-driven').textContent = Math.round(driven);
  el('miles-remaining').textContent = Math.round(remaining);
  el('elapsed-time').textContent = computeElapsed();

  // SOC at next stop
  el('soc-next').textContent = `~${stage.socAtEnd}%`;

  // Julia buffer
  updateJuliaBuffer();
}

function computeETA(milesRemaining, stageIdx) {
  const driveHours = milesRemaining / TRIP_DATA.avgSpeedMph;
  const chargeHours = getRemainingChargeStops(stageIdx) * (TRIP_DATA.avgChargeMinutes / 60);
  const totalHours = driveHours + chargeHours;
  const eta = new Date(Date.now() + totalHours * 3600000);
  return formatTime(eta);
}

function computeElapsed() {
  const dep = state.departureTime || (() => {
    const d = new Date();
    d.setHours(TRIP_DATA.departure.hour, TRIP_DATA.departure.minute, 0, 0);
    return d;
  })();
  const diffMs = Date.now() - dep.getTime();
  if (diffMs < 0) return 'Not started';
  const h = Math.floor(diffMs / 3600000);
  const m = Math.floor((diffMs % 3600000) / 60000);
  return `${h}h ${m}m`;
}

function updateJuliaBuffer() {
  // Return trip: show remaining charge stops count instead of Julia buffer
  el('julia-cell').classList.remove('hidden');
  const remaining = getRemainingChargeStops(state.currentStage);
  if (remaining === 0) {
    el('julia-buffer').textContent = 'Done!';
    el('julia-buffer').style.color = '#27AE60';
  } else {
    el('julia-buffer').textContent = `${remaining} left`;
    el('julia-buffer').style.color = '';
  }
}

/* ── SOCORRO WARNING ──────────────────────────────────────────────────────── */
function updateSocorroWarning(stageIdx) {
  const show = TRIP_DATA.stages[stageIdx] && TRIP_DATA.stages[stageIdx].socorroWarning;
  el('socorro-banner').classList.toggle('hidden', !show);
}

/* ── STAGE NOTES RENDER ───────────────────────────────────────────────────── */
function renderStageNotes(stageIdx) {
  const stage = TRIP_DATA.stages[stageIdx];
  if (!stage) return;

  el('stage-name-display').textContent = stage.name;
  el('stage-meta').textContent = `~${stage.distance} mi · Est. SOC on arrival: ~${stage.socAtEnd}%`;

  el('prev-stage-btn').disabled = stageIdx === 0;
  el('next-stage-btn').disabled = stageIdx === TRIP_DATA.stages.length - 1;

  renderChargingCard(stage);
  renderDiningCard(stage);
  renderHistoryCard(stage);
  renderGeologyCard(stage);
  renderPOICard(stage);
  renderTriviaCard(stage);
  renderScenicCard(stage);
  renderArrivalCard(stageIdx);

  state.historyExpanded = false;
  el('history-full-text').classList.add('hidden');
  el('history-expand-btn').textContent = 'Full story ▾';

  state.geologyExpanded = false;
  el('geology-full-text').classList.add('hidden');
  el('geology-expand-btn').textContent = 'Full geology ▾';
}

function renderChargingCard(stage) {
  const div = el('charging-content');
  if (!stage.charging) {
    div.innerHTML = `<p class="no-charge-note">No charging stop on this segment — you're heading to the finish line!</p>`;
    return;
  }
  const c = stage.charging;
  const stallsText = c.stalls ? `${c.stalls} stalls` : 'Stalls TBD';
  const kwText = c.maxKw ? `${c.maxKw} kW` : 'Speed TBD';
  div.innerHTML = `
    <div class="charging-name">${c.name}</div>
    <div class="charging-address">${c.address}</div>
    <div class="charging-specs">
      <span class="spec-badge">⚡ ${kwText}</span>
      <span class="spec-badge">🔌 ${stallsText}</span>
      <span class="spec-badge">${c.network}</span>
    </div>
    ${c.note ? `<div class="charging-note">${c.note}</div>` : ''}
  `;
}

function renderDiningCard(stage) {
  const div = el('dining-content');
  const allDining = [
    ...(stage.dining || []),
    ...(stage.dining_extra || []),
  ];
  if (allDining.length === 0) {
    div.innerHTML = `<p class="no-dining-note">Almost there — dinner when you get home!</p>`;
    return;
  }
  div.innerHTML = allDining.map((d, i) => `
    <button class="dining-item-btn" data-dining-idx="${i}" aria-label="Details for ${d.name}">
      <span class="dining-type">${d.type}</span>
      <div class="dining-name">${d.name}</div>
      <div class="dining-meta">
        <span>${d.walk}</span>
        <span>${d.hours}</span>
        <span>Service: ${d.service}</span>
      </div>
      ${d.note ? `<div class="dining-note">${d.note}</div>` : ''}
      <div class="dining-tap-hint">Tap for details →</div>
    </button>
  `).join('');

  // Wire tap handlers — capture allDining in closure via data attribute lookup
  div.querySelectorAll('.dining-item-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.diningIdx, 10);
      openDiningModal(allDining[idx]);
    });
  });
}

function renderHistoryCard(stage) {
  el('history-quick-text').textContent = stage.history.quick;
  el('history-full-text').textContent = stage.history.full;
}

function renderGeologyCard(stage) {
  const card = el('geology-card');
  if (!stage.geology) {
    card.classList.add('hidden');
    return;
  }
  card.classList.remove('hidden');
  el('geology-quick-text').textContent = stage.geology.quick;
  el('geology-full-text').textContent = stage.geology.full;
}

function renderPOICard(stage) {
  const div = el('poi-content');
  if (!stage.pois || stage.pois.length === 0) {
    div.innerHTML = `<p class="no-dining-note">No major POIs on this segment.</p>`;
    return;
  }
  div.innerHTML = stage.pois.map((p, i) => `
    <button class="poi-item-btn" data-poi-idx="${i}" aria-label="Details for ${p.name}">
      <div class="poi-name">${p.name}</div>
      <div class="poi-desc">${p.description}</div>
      ${p.hook ? `<div class="poi-tap-hint">Tap to learn more →</div>` : `<div class="poi-tap-hint">Tap for details →</div>`}
    </button>
  `).join('');

  div.querySelectorAll('.poi-item-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.poiIdx, 10);
      openPOIModal(stage.pois[idx]);
    });
  });
}

/* ── TRIVIA CARD ──────────────────────────────────────────────────────────── */
function renderTriviaCard(stage) {
  const card = el('trivia-card');
  const div  = el('trivia-content');

  if (!stage.trivia || stage.trivia.length === 0) {
    card.classList.add('hidden');
    return;
  }

  card.classList.remove('hidden');
  div.innerHTML = stage.trivia.map((item, i) => {
    // item can be a plain string or { fact, detail }
    const fact   = typeof item === 'string' ? item : item.fact;
    const detail = typeof item === 'object' && item.detail ? item.detail : null;
    return `
      <div class="trivia-item" id="trivia-item-${i}">
        <button class="trivia-item-btn"
                aria-expanded="false"
                aria-controls="trivia-exp-${i}"
                data-trivia-idx="${i}">
          <span class="trivia-number">${i + 1}</span>
          <span class="trivia-text">${fact}</span>
          ${detail ? `<span class="trivia-chevron">▾</span>` : ''}
        </button>
        ${detail ? `<div class="trivia-expanded" id="trivia-exp-${i}" role="region">${detail}</div>` : ''}
      </div>
    `;
  }).join('');

  div.querySelectorAll('.trivia-item-btn').forEach(btn => {
    if (!btn.querySelector('.trivia-chevron')) return; // no detail — nothing to expand
    btn.addEventListener('click', () => {
      const item = btn.closest('.trivia-item');
      const isOpen = item.classList.toggle('open');
      btn.setAttribute('aria-expanded', isOpen);
    });
  });
}

/* ── SCENIC MOMENTS CARD ─────────────────────────────────────────────────── */
function renderScenicCard(stage) {
  const card = el('scenic-card');
  const div  = el('scenic-content');

  if (!stage.scenic || stage.scenic.length === 0) {
    card.classList.add('hidden');
    return;
  }

  card.classList.remove('hidden');

  // icon cycle: mountain, water, field, general eye icons
  const icons = ['⛰', '🌊', '🌾', '🌵', '🏜', '🌄'];

  div.innerHTML = `<ul class="scenic-list">${
    stage.scenic.map((s, i) => {
      // item can be a plain string or { label, detail }
      const label  = typeof s === 'string' ? s : s.label;
      const detail = typeof s === 'object' && s.detail ? s.detail : null;
      const icon   = (typeof s === 'object' && s.icon) ? s.icon : icons[i % icons.length];
      return `
        <li class="scenic-item">
          <span class="scenic-icon" aria-hidden="true">${icon}</span>
          <div class="scenic-body">
            <div class="scenic-label">${label}</div>
            ${detail ? `<div class="scenic-detail">${detail}</div>` : ''}
          </div>
        </li>
      `;
    }).join('')
  }</ul>`;
}

/* ── BOTTOM-SHEET MODAL HELPERS ───────────────────────────────────────────── */

/**
 * Generic open for a .bottom-sheet element.
 * Shows the shared overlay and removes the .hidden class so the CSS
 * transform slides the sheet up.
 */
function openBottomSheet(sheetId, stateKey) {
  el('modal-overlay').classList.remove('hidden');
  el(sheetId).classList.remove('hidden');
  state[stateKey] = true;
  attachSwipeDismiss(el(sheetId), () => closeBottomSheet(sheetId, stateKey));
}

function closeBottomSheet(sheetId, stateKey) {
  el(sheetId).classList.add('hidden');
  state[stateKey] = false;
  // Only hide overlay if every modal is now closed
  if (!state.poiModalOpen && !state.diningModalOpen) {
    el('modal-overlay').classList.add('hidden');
  }
}

/* ── POI DETAIL MODAL ──────────────────────────────────────────────────────── */

/**
 * openPOIModal(poi)
 *
 * poi shape:
 *   { name, description, hook?, coords? }
 *   coords: { lat, lng } — used to build the Maps URL
 */
function openPOIModal(poi) {
  el('poi-modal-name').textContent = poi.name;
  el('poi-modal-hook').textContent = poi.hook || '';
  el('poi-modal-desc').textContent = poi.description;

  const mapsUrl = poi.coords
    ? `https://maps.google.com/?q=${poi.coords.lat},${poi.coords.lng}&z=16`
    : `https://maps.google.com/?q=${encodeURIComponent(poi.name)}`;
  el('poi-modal-maps').href = mapsUrl;

  openBottomSheet('poi-modal', 'poiModalOpen');
}

function closePOIModal() {
  closeBottomSheet('poi-modal', 'poiModalOpen');
}

/* ── DINING DETAIL MODAL ───────────────────────────────────────────────────── */

/**
 * openDiningModal(item)
 *
 * item shape:
 *   { name, type, address?, walk, hours, service, note? }
 */
function openDiningModal(item) {
  el('dining-modal-name').textContent = item.name;
  el('dining-modal-type').textContent = item.type;
  el('dining-modal-address').textContent = item.address || '—';
  el('dining-modal-walk').textContent    = item.walk    || '—';
  el('dining-modal-hours').textContent   = item.hours   || '—';
  el('dining-modal-service').textContent = item.service || '—';
  el('dining-modal-note').textContent    = item.note    || '';

  const query = item.address
    ? encodeURIComponent(item.address)
    : encodeURIComponent(item.name);
  el('dining-modal-maps').href = `https://maps.google.com/?q=${query}`;

  openBottomSheet('dining-modal', 'diningModalOpen');
}

function closeDiningModal() {
  closeBottomSheet('dining-modal', 'diningModalOpen');
}

/* ── SWIPE-DOWN TO DISMISS ─────────────────────────────────────────────────── */

/**
 * attachSwipeDismiss(sheetEl, onDismiss)
 *
 * Tracks a single touch gesture on the sheet.
 * If the user drags down >= 72px and releases, calls onDismiss().
 * If they release earlier the sheet snaps back.
 * Re-attaches each time a sheet opens (so stale refs don't accumulate).
 */
function attachSwipeDismiss(sheetEl, onDismiss) {
  // Remove any previous listeners by replacing the element's swipe handler
  // via a single named function stored on the element.
  if (sheetEl._swipeCleanup) sheetEl._swipeCleanup();

  let startY = 0;
  let currentY = 0;
  let dragging = false;
  const DISMISS_THRESHOLD = 72; // px

  function onTouchStart(e) {
    // Only start drag if touch begins on the handle or near the top 60px
    const touchY = e.touches[0].clientY;
    const rect = sheetEl.getBoundingClientRect();
    if (touchY - rect.top > 60) return; // too far down — let content scroll
    startY   = touchY;
    currentY = touchY;
    dragging = true;
    sheetEl.style.transition = 'none';
  }

  function onTouchMove(e) {
    if (!dragging) return;
    currentY = e.touches[0].clientY;
    const delta = Math.max(0, currentY - startY); // only downward
    sheetEl.style.transform = `translateY(${delta}px)`;
    if (delta > 8) e.preventDefault(); // prevent page scroll while swiping
  }

  function onTouchEnd() {
    if (!dragging) return;
    dragging = false;
    sheetEl.style.transition = '';
    sheetEl.style.transform  = '';
    const delta = currentY - startY;
    if (delta >= DISMISS_THRESHOLD) {
      onDismiss();
    }
  }

  sheetEl.addEventListener('touchstart',  onTouchStart, { passive: true });
  sheetEl.addEventListener('touchmove',   onTouchMove,  { passive: false });
  sheetEl.addEventListener('touchend',    onTouchEnd,   { passive: true });
  sheetEl.addEventListener('touchcancel', onTouchEnd,   { passive: true });

  // Store cleanup so we can detach on next open
  sheetEl._swipeCleanup = () => {
    sheetEl.removeEventListener('touchstart',  onTouchStart);
    sheetEl.removeEventListener('touchmove',   onTouchMove);
    sheetEl.removeEventListener('touchend',    onTouchEnd);
    sheetEl.removeEventListener('touchcancel', onTouchEnd);
  };
}

/* ── MILESTONE TOASTS ─────────────────────────────────────────────────────── */

/**
 * checkMilestones(lat, lng)
 * Called on every GPS update. Fires each milestone at most once per session.
 */
function checkMilestones(lat, lng) {
  if (!TRIP_DATA.milestones) return;

  TRIP_DATA.milestones.forEach(m => {
    if (state.firedMilestones.has(m.id)) return; // already shown

    let shouldFire = false;

    if (m.type === 'stage') {
      shouldFire = state.currentStage >= m.stage;
    } else if (m.type === 'miles') {
      shouldFire = state.milesDriven >= m.miles;
    } else if (m.type === 'proximity') {
      const d = haversine(lat, lng, m.coords.lat, m.coords.lng);
      shouldFire = d <= m.radiusMiles;
    }

    if (shouldFire) {
      state.firedMilestones.add(m.id);
      showToast(m.icon, m.title, m.detail);
    }
  });
}

/**
 * showToast(icon, title, detail, duration)
 * Creates a slide-in notification that auto-dismisses.
 */
function showToast(icon, title, detail, duration = 5500) {
  const container = el('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span class="toast-icon" aria-hidden="true">${icon}</span>
    <div class="toast-body">
      <div class="toast-title">${title}</div>
      ${detail ? `<div class="toast-detail">${detail}</div>` : ''}
    </div>
  `;
  container.appendChild(toast);

  // Auto-dismiss
  setTimeout(() => {
    toast.classList.add('toast-exit');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
    // Fallback remove in case animationend doesn't fire
    setTimeout(() => { if (toast.parentNode) toast.remove(); }, 500);
  }, duration);
}

/* ── ARRIVAL CARD ─────────────────────────────────────────────────────────── */

/**
 * renderArrivalCard(stageIdx)
 * Shows only on the final stage (4 = Flagstaff → Peoria).
 * Displays live trip stats + arrival dining + Trilogy info.
 */
function renderArrivalCard(stageIdx) {
  const card = el('arrival-card');
  if (stageIdx !== TRIP_DATA.stages.length - 1) {
    card.classList.add('hidden');
    return;
  }
  card.classList.remove('hidden');

  // ── Trip stats ──
  const driven   = Math.round(state.milesDriven);
  const totalMi  = Math.round(state.actualTotalMiles);
  const chargesDone = TRIP_DATA.stages
    .filter((s, i) => i < stageIdx && s.charging).length;

  let elapsed = '—';
  if (state.departureTime) {
    const mins = Math.round((Date.now() - state.departureTime.getTime()) / 60000);
    elapsed = formatDuration(mins);
  }

  el('arrival-stats').innerHTML = `
    <div class="arrival-stat">
      <div class="arrival-stat-value">${driven}</div>
      <div class="arrival-stat-label">miles driven</div>
    </div>
    <div class="arrival-stat">
      <div class="arrival-stat-value">${elapsed}</div>
      <div class="arrival-stat-label">time elapsed</div>
    </div>
    <div class="arrival-stat">
      <div class="arrival-stat-value">${chargesDone}</div>
      <div class="arrival-stat-label">charge stops</div>
    </div>
  `;

  // ── Arrival dining ──
  const diningDiv = el('arrival-dining');
  if (TRIP_DATA.destination && TRIP_DATA.destination.dining) {
    diningDiv.innerHTML = TRIP_DATA.destination.dining.map((d, i) => `
      <button class="dining-item-btn" data-arrival-idx="${i}" aria-label="Details for ${d.name}">
        <span class="dining-type">${d.type}</span>
        <div class="dining-name">${d.name}</div>
        <div class="dining-meta">
          <span>${d.walk}</span>
          <span>${d.hours}</span>
        </div>
        ${d.note ? `<div class="dining-note">${d.note}</div>` : ''}
        <div class="dining-tap-hint">Tap for details →</div>
      </button>
    `).join('');

    diningDiv.querySelectorAll('.dining-item-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.arrivalIdx, 10);
        openDiningModal(TRIP_DATA.destination.dining[idx]);
      });
    });
  }

  // ── Trilogy info ──
  const dest = TRIP_DATA.destination;
  if (dest && dest.trilogy) {
    el('arrival-pueblo').innerHTML =
      `${dest.trilogy.text}<br><br>` +
      `<a href="${dest.trilogy.url}" target="_blank" rel="noopener" style="color:var(--blue);text-decoration:underline;font-size:.78rem;">Trilogy at Vistancia →</a>`;
  }
}

/* ── STAGE NAV ────────────────────────────────────────────────────────────── */
function setViewingStage(idx) {
  idx = Math.max(0, Math.min(idx, TRIP_DATA.stages.length - 1));
  state.viewingStage = idx;
  state.isManualView = idx !== state.currentStage;
  renderStageNotes(idx);
  updateBackBar();
}

function updateBackBar() {
  el('back-to-current-bar').classList.toggle('hidden', !state.isManualView);
}

/* ── MAP CONTROLS ──────────────────────────────────────────────────────────── */
function expandMap() {
  el('map-container').classList.add('expanded');
  el('map-toggle-btn').textContent = 'Hide Map ▴';
  state.mapExpanded = true;
  if (state.map) {
    google.maps.event.trigger(state.map, 'resize');
    if (state.userLat !== null) {
      state.map.panTo({ lat: state.userLat, lng: state.userLng });
    }
  }
}

function collapseMap() {
  el('map-container').classList.remove('expanded', 'fullscreen');
  el('map-toggle-btn').textContent = 'Show Map ▾';
  state.mapExpanded = false;
  state.mapFullscreen = false;
}

function goFullscreen() {
  el('map-container').classList.add('fullscreen');
  state.mapFullscreen = true;
  if (state.map) google.maps.event.trigger(state.map, 'resize');
}

function exitFullscreen() {
  el('map-container').classList.remove('fullscreen');
  state.mapFullscreen = false;
  if (state.map) google.maps.event.trigger(state.map, 'resize');
}

function centerMap() {
  if (state.map && state.userLat !== null) {
    state.map.panTo({ lat: state.userLat, lng: state.userLng });
    state.map.setZoom(12);
  }
}

/* ── METRICS TOGGLE ──────────────────────────────────────────────────────── */
function toggleMetrics() {
  state.metricsExpanded = !state.metricsExpanded;
  el('metrics-expanded').classList.toggle('hidden', !state.metricsExpanded);
  el('metrics-toggle').classList.toggle('open', state.metricsExpanded);
}

/* ── HISTORY EXPAND ──────────────────────────────────────────────────────── */
function toggleHistory() {
  state.historyExpanded = !state.historyExpanded;
  el('history-full-text').classList.toggle('hidden', !state.historyExpanded);
  el('history-expand-btn').textContent = state.historyExpanded ? 'Less ▴' : 'Full story ▾';
}

/* ── GEOLOGY EXPAND ──────────────────────────────────────────────────────── */
function toggleGeology() {
  state.geologyExpanded = !state.geologyExpanded;
  el('geology-full-text').classList.toggle('hidden', !state.geologyExpanded);
  el('geology-expand-btn').textContent = state.geologyExpanded ? 'Less ▴' : 'Full geology ▾';
}

/* ── CLOCK TICK ──────────────────────────────────────────────────────────── */
function tick() {
  if (state.metricsExpanded) {
    el('elapsed-time').textContent = computeElapsed();
  }
}

/* ── EVENT LISTENERS ─────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Initial render
  renderStageNotes(0);
  updateMetrics();
  updateSocorroWarning(0);

  // Metrics
  el('metrics-toggle').addEventListener('click', toggleMetrics);

  // Map
  el('map-toggle-btn').addEventListener('click', () => {
    state.mapExpanded ? collapseMap() : expandMap();
  });
  el('map-collapse-btn').addEventListener('click', collapseMap);
  el('map-center-btn').addEventListener('click', centerMap);
  el('map-fullscreen-btn').addEventListener('click', () => {
    state.mapFullscreen ? exitFullscreen() : goFullscreen();
  });

  // Stage nav
  el('prev-stage-btn').addEventListener('click', () => setViewingStage(state.viewingStage - 1));
  el('next-stage-btn').addEventListener('click', () => setViewingStage(state.viewingStage + 1));

  el('back-to-current-btn').addEventListener('click', () => {
    state.isManualView = false;
    state.viewingStage = state.currentStage;
    renderStageNotes(state.currentStage);
    updateBackBar();
  });

  // History
  el('history-expand-btn').addEventListener('click', toggleHistory);

  // Geology
  el('geology-expand-btn').addEventListener('click', toggleGeology);

  // Modal close buttons
  el('poi-close-btn').addEventListener('click', closePOIModal);
  el('dining-close-btn').addEventListener('click', closeDiningModal);

  // Overlay — closes whichever modal is open
  el('modal-overlay').addEventListener('click', () => {
    if (state.poiModalOpen)    closePOIModal();
    if (state.diningModalOpen) closeDiningModal();
  });

  // Escape to exit fullscreen or close any modal
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (state.mapFullscreen)   exitFullscreen();
      if (state.poiModalOpen)    closePOIModal();
      if (state.diningModalOpen) closeDiningModal();
    }
  });

  // Clock tick every minute
  setInterval(tick, 60000);
});
