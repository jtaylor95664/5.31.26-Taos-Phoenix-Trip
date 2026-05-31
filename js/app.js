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
  natureExpanded: false,
  metricsExpanded: false,
  gpsStarted: false,
  departureTime: null,
  firedMilestones: new Set(),
  // Fun features
  bingoGrid: null,
  bingoCount: 0,
  spotCounts: {},
  challengeIdx: 0,
  challengesDone: new Set(),
  triviaRevealed: new Set(),  // keys like "s0-2"
  triviaReactions: {},         // key → 'knew'|'new'
  elevation: null,
  weather: null,
  phoenixWeather: null,
  photos: [],
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
    if (status !== 'OK') {
      console.warn('Directions API:', status, '— drawing fallback waypoint polyline');
      drawFallbackRoute();
      return;
    }

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

/* Fallback: draw a straight-segment polyline from the hardcoded waypoints
   when the Directions API is unavailable (disabled on key, REQUEST_DENIED, etc).
   Stage distance values (stage.distance) already serve as fallback for mileage. */
function drawFallbackRoute() {
  const path = TRIP_DATA.routeWaypoints.map(w => new google.maps.LatLng(w.lat, w.lng));
  new google.maps.Polyline({ path, map: state.map, strokeColor: '#FFFFFF', strokeWeight: 10, strokeOpacity: 0.9, zIndex: 1 });
  new google.maps.Polyline({ path, map: state.map, strokeColor: '#E8571A', strokeWeight: 6,  strokeOpacity: 1.0, zIndex: 2 });
  addMapMarkers();
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
  if (state.gpsStarted) return; // guard against double-init
  state.gpsStarted = true;
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
  updateElevation(pos);
  fetchWeather(lat, lng);

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

  // Stage badge — shows the stage the user is currently viewing, not the GPS stage
  el('stage-badge').textContent = `Stage ${state.viewingStage + 1} of ${TRIP_DATA.stages.length}`;

  // Primary: ETA
  el('eta-phoenix').textContent = computeETA(remaining, state.currentStage);

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

  renderSoundtrackCard(stage);
  renderChargingCard(stage);
  renderDiningCard(stage);
  renderHistoryCard(stage);
  renderGeologyCard(stage);
  renderNatureCard(stage);
  renderPOICard(stage);
  renderTriviaCard(stage);
  renderScenicCard(stage);
  renderChallengeCard();
  renderWeatherCard();
  renderArrivalCard(stageIdx);

  state.historyExpanded = false;
  el('history-full-text').classList.add('hidden');
  el('history-expand-btn').textContent = 'Full story ▾';

  state.geologyExpanded = false;
  el('geology-full-text').classList.add('hidden');
  el('geology-expand-btn').textContent = 'Full geology ▾';

  state.natureExpanded = false;
  el('nature-full-content').classList.add('hidden');
  el('nature-expand-btn').textContent = 'More details ▾';
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
  const card = el('dining-card');
  const div = el('dining-content');

  // On the final (arrival) stage the arrival card handles dining — hide duplicate
  if (stage.id === TRIP_DATA.stages.length - 1) {
    card.classList.add('hidden');
    return;
  }
  card.classList.remove('hidden');

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

function renderNatureCard(stage) {
  const card = el('nature-card');
  if (!stage.nature) {
    card.classList.add('hidden');
    return;
  }
  card.classList.remove('hidden');
  el('nature-quick-text').textContent = stage.nature.quick;
  el('nature-full-text').textContent = stage.nature.full;

  const typeIcons = { plant: '🌱', bird: '🐦', mammal: '🐾', reptile: '🦎', other: '🐟' };
  const speciesList = el('nature-species-list');
  if (stage.nature.species && stage.nature.species.length) {
    speciesList.innerHTML = stage.nature.species.map(s => `
      <div class="species-item">
        <div class="species-header">
          <span class="species-icon">${typeIcons[s.type] || '•'}</span>
          <span class="species-name">${s.name}</span>
        </div>
        <div class="species-note">${s.note}</div>
      </div>
    `).join('');
  } else {
    speciesList.innerHTML = '';
  }
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
function updateTriviaScoreBadge() {
  const newCount = Object.values(state.triviaReactions).filter(r => r === 'new').length;
  const knewCount = Object.values(state.triviaReactions).filter(r => r === 'knew').length;
  const badge = el('trivia-score-badge');
  if (badge && (newCount + knewCount) > 0) {
    badge.textContent = `🧠 ${knewCount} · 😮 ${newCount}`;
  }
}

function renderTriviaCard(stage) {
  const card = el('trivia-card');
  const div  = el('trivia-content');

  if (!stage.trivia || stage.trivia.length === 0) {
    card.classList.add('hidden');
    return;
  }
  card.classList.remove('hidden');

  div.innerHTML = stage.trivia.map((item, i) => {
    const fact    = typeof item === 'string' ? item : item.fact;
    const key     = `s${stage.id}-${i}`;
    const revealed  = state.triviaRevealed.has(key);
    const reaction  = state.triviaReactions[key];
    return `
      <div class="trivia-item${revealed ? ' revealed' : ''}" id="trivia-item-${i}" data-key="${key}">
        <span class="trivia-number">${i + 1}</span>
        <div class="trivia-body">
          <div class="trivia-text">${fact}</div>
          ${!revealed ? `<div class="trivia-reveal-overlay">👁 Tap to reveal</div>` : `
            <div class="trivia-reactions">
              <button class="trivia-rx-btn${reaction === 'knew' ? ' active' : ''}" data-key="${key}" data-rx="knew">🧠 Knew it</button>
              <button class="trivia-rx-btn${reaction === 'new'  ? ' active' : ''}" data-key="${key}" data-rx="new">😮 New to me!</button>
            </div>
          `}
        </div>
      </div>
    `;
  }).join('');

  div.querySelectorAll('.trivia-item:not(.revealed)').forEach(item => {
    item.addEventListener('click', () => {
      const key = item.dataset.key;
      state.triviaRevealed.add(key);
      item.classList.add('revealed');
      item.querySelector('.trivia-reveal-overlay').outerHTML = `
        <div class="trivia-reactions">
          <button class="trivia-rx-btn" data-key="${key}" data-rx="knew">🧠 Knew it</button>
          <button class="trivia-rx-btn" data-key="${key}" data-rx="new">😮 New to me!</button>
        </div>
      `;
      // re-wire for this item only
      item.querySelectorAll('.trivia-rx-btn').forEach(b => b.addEventListener('click', handleTriviaReaction));
    });
  });

  div.querySelectorAll('.trivia-rx-btn').forEach(b => b.addEventListener('click', handleTriviaReaction));
}

function handleTriviaReaction(e) {
  e.stopPropagation();
  const btn = e.currentTarget;
  const key = btn.dataset.key;
  const rx  = btn.dataset.rx;
  state.triviaReactions[key] = rx;
  btn.closest('.trivia-reactions').querySelectorAll('.trivia-rx-btn')
     .forEach(b => b.classList.toggle('active', b.dataset.rx === rx));
  updateTriviaScoreBadge();
  if (rx === 'new') showToast('😮', 'New to you!', 'One more fun fact filed away.', 2500);
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

/* ── SOUNDTRACK CARD ─────────────────────────────────────────────────────── */
function renderSoundtrackCard(stage) {
  const card = el('soundtrack-card');
  if (!stage.soundtrack) { card.classList.add('hidden'); return; }
  card.classList.remove('hidden');
  const s = stage.soundtrack;
  const q = encodeURIComponent(s.query);
  el('soundtrack-content').innerHTML = `
    <div class="soundtrack-vibe">${s.vibe}</div>
    <div class="soundtrack-songs">${s.songs.map(song =>
      `<div class="soundtrack-song">
         <span class="song-title">${song.title}</span>
         <span class="song-artist">${song.artist}</span>
       </div>`).join('')}</div>
    <div class="soundtrack-links">
      <a class="soundtrack-btn" href="https://open.spotify.com/search/${q}" target="_blank" rel="noopener">▶ Spotify</a>
      <a class="soundtrack-btn" href="https://music.apple.com/us/search?term=${q}" target="_blank" rel="noopener">♪ Apple Music</a>
    </div>`;
}

/* ── CHALLENGES CARD ─────────────────────────────────────────────────────── */
function renderChallengeCard() {
  if (!TRIP_DATA.challenges || !TRIP_DATA.challenges.length) return;
  const idx = state.challengeIdx % TRIP_DATA.challenges.length;
  el('challenge-text').textContent = TRIP_DATA.challenges[idx];
  el('challenge-num').textContent  = `${idx + 1}/${TRIP_DATA.challenges.length}`;
  const done = state.challengesDone.has(state.challengeIdx);
  const btn = el('challenge-done-btn');
  btn.textContent = done ? '✓ Done!' : 'Done ✓';
  btn.classList.toggle('done', done);
}

/* ── WEATHER ─────────────────────────────────────────────────────────────── */
let _weatherTimer = null;
function fetchWeather(lat, lng) {
  clearTimeout(_weatherTimer);
  _weatherTimer = setTimeout(async () => {
    try {
      const ptRes = await fetch(`https://api.weather.gov/points/${lat.toFixed(4)},${lng.toFixed(4)}`);
      if (!ptRes.ok) return;
      const pt = await ptRes.json();
      const fcRes = await fetch(pt.properties.forecastHourly);
      if (!fcRes.ok) return;
      const fc = await fcRes.json();
      const cur = fc.properties.periods[0];
      state.weather = { temp: cur.temperature, unit: cur.temperatureUnit, desc: cur.shortForecast, wind: cur.windSpeed };
      renderWeatherCard();
    } catch(e) { /* silently skip if offline or outside US */ }
  }, 3000);
}

function fetchPhoenixWeather() {
  fetch('https://api.weather.gov/points/33.4484,-112.0740')
    .then(r => r.json()).then(d => fetch(d.properties.forecast))
    .then(r => r.json()).then(d => {
      const today = d.properties.periods.find(p => p.isDaytime) || d.properties.periods[0];
      state.phoenixWeather = { high: today.temperature, unit: today.temperatureUnit, desc: today.shortForecast };
      renderWeatherCard();
    }).catch(() => {});
}

function renderWeatherCard() {
  const card = el('weather-card');
  if (!state.weather && !state.phoenixWeather) { card.classList.add('hidden'); return; }
  card.classList.remove('hidden');
  let html = '';
  if (state.weather) html += `
    <div class="weather-item">
      <span class="weather-where">Right now</span>
      <span class="weather-temp">${state.weather.temp}°${state.weather.unit}</span>
      <span class="weather-desc">${state.weather.desc}${state.weather.wind ? ' · 💨 ' + state.weather.wind : ''}</span>
    </div>`;
  if (state.phoenixWeather) html += `
    <div class="weather-item weather-item-phx">
      <span class="weather-where">Phoenix today</span>
      <span class="weather-temp">${state.phoenixWeather.high}°${state.phoenixWeather.unit}</span>
      <span class="weather-desc">${state.phoenixWeather.desc}</span>
    </div>`;
  el('weather-content').innerHTML = html;
}

/* ── ELEVATION ───────────────────────────────────────────────────────────── */
function updateElevation(pos) {
  const alt = pos.coords.altitude;
  if (alt == null) return;
  const ft = Math.round(alt * 3.28084);
  state.elevation = ft;
  const cell = el('elevation-cell'), val = el('elevation-value');
  if (cell && val) { cell.classList.remove('hidden'); val.textContent = ft.toLocaleString() + ' ft'; }
}

/* ── BINGO ───────────────────────────────────────────────────────────────── */
function initBingo() {
  const items = [...TRIP_DATA.bingo];
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  const grid = items.slice(0, 24);
  grid.splice(12, 0, { label: 'FREE', icon: '⭐', free: true });
  state.bingoGrid  = grid.map((item, idx) => ({ ...item, idx, marked: !!item.free }));
  state.bingoCount = 0;
}

function renderBingoGrid() {
  if (!state.bingoGrid) initBingo();
  el('bingo-grid').innerHTML = state.bingoGrid.map((cell, i) => `
    <button class="bingo-cell${cell.marked ? ' marked' : ''}${cell.free ? ' free' : ''}"
            data-bi="${i}" aria-pressed="${cell.marked}" ${cell.free ? 'disabled' : ''}>
      <span class="bingo-cell-icon">${cell.icon}</span>
      <span class="bingo-cell-label">${cell.label}</span>
    </button>`).join('');
  el('bingo-grid').querySelectorAll('.bingo-cell:not(.free)').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = parseInt(btn.dataset.bi, 10);
      state.bingoGrid[i].marked = !state.bingoGrid[i].marked;
      btn.classList.toggle('marked', state.bingoGrid[i].marked);
      btn.setAttribute('aria-pressed', state.bingoGrid[i].marked);
      checkBingo();
    });
  });
  updateBingoStatus();
}

const BINGO_LINES = [
  [0,1,2,3,4],[5,6,7,8,9],[10,11,12,13,14],[15,16,17,18,19],[20,21,22,23,24],
  [0,5,10,15,20],[1,6,11,16,21],[2,7,12,17,22],[3,8,13,18,23],[4,9,14,19,24],
  [0,6,12,18,24],[4,8,12,16,20]
];
function checkBingo() {
  const g = state.bingoGrid;
  const wins = BINGO_LINES.filter(l => l.every(i => g[i].marked)).length;
  if (wins > state.bingoCount) {
    state.bingoCount = wins;
    showToast('🎉', 'BINGO!', `${wins} line${wins > 1 ? 's' : ''} completed — road trip bingo!`, 6000);
  }
  updateBingoStatus();
}
function updateBingoStatus() {
  const marked = state.bingoGrid ? state.bingoGrid.filter(c => c.marked && !c.free).length : 0;
  el('bingo-status').textContent = `${marked} / 24 spotted`;
}

/* ── SPOT COUNTER ────────────────────────────────────────────────────────── */
const SPOT_ITEMS = [
  { id: 'pronghorn',  icon: '🦌', label: 'Pronghorn'  },
  { id: 'eagle',      icon: '🦅', label: 'Eagle'       },
  { id: 'deer',       icon: '🦌', label: 'Deer'        },
  { id: 'hawk',       icon: '🪶', label: 'Hawk'        },
  { id: 'roadrunner', icon: '🐦', label: 'Roadrunner'  },
  { id: 'coyote',     icon: '🐺', label: 'Coyote'      },
  { id: 'bighorn',    icon: '🐏', label: 'Bighorn'     },
  { id: 'raven',      icon: '⬛', label: 'Ravens'      },
  { id: 'saguaro',    icon: '🌵', label: 'Saguaro'     },
];
function renderSpotPanel() {
  el('spot-grid').innerHTML = SPOT_ITEMS.map(item => `
    <div class="spot-item">
      <button class="spot-tap-btn" data-spot="${item.id}" aria-label="Tap to count ${item.label}">
        <span class="spot-icon">${item.icon}</span>
        <span class="spot-lbl">${item.label}</span>
      </button>
      <span class="spot-count" id="spot-count-${item.id}">${state.spotCounts[item.id] || 0}</span>
    </div>`).join('');
  el('spot-grid').querySelectorAll('.spot-tap-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.spot;
      state.spotCounts[id] = (state.spotCounts[id] || 0) + 1;
      el(`spot-count-${id}`).textContent = state.spotCounts[id];
      btn.classList.add('spot-pulse');
      setTimeout(() => btn.classList.remove('spot-pulse'), 300);
      const item = SPOT_ITEMS.find(s => s.id === id);
      if (state.spotCounts[id] === 1 && item) showToast(item.icon, `First ${item.label}!`, 'Spotted!', 2500);
    });
  });
}

/* ── PHOTO CAPTURE ───────────────────────────────────────────────────────── */
function handlePhotoCapture(e) {
  const file = e.target.files[0];
  if (!file) return;
  const stage = TRIP_DATA.stages[state.viewingStage];
  const ts    = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const reader = new FileReader();
  reader.onload = ev => {
    state.photos.push({ dataUrl: ev.target.result, label: `${stage.shortName} · ${ts}` });
    const badge = el('photo-badge');
    if (badge) { badge.textContent = state.photos.length; badge.classList.remove('hidden'); }
    showToast('📸', 'Photo saved!', `${stage.shortName} · ${ts}`, 3000);
  };
  reader.readAsDataURL(file);
  e.target.value = '';
}

/* ── ARRIVAL SCORECARD ───────────────────────────────────────────────────── */
function showArrivalScore() {
  const overlay = el('score-overlay');
  if (!overlay) return;

  const totalSpots = Object.values(state.spotCounts).reduce((a, b) => a + b, 0);
  const spotLine   = Object.entries(state.spotCounts).filter(([,v]) => v > 0)
    .map(([k, v]) => { const s = SPOT_ITEMS.find(x => x.id === k); return `${s ? s.icon : ''} ${v} ${s ? s.label : k}`; })
    .join(' · ') || 'None logged';

  const driveTime = state.departureTime
    ? (() => { const m = Math.round((Date.now() - state.departureTime) / 60000); return `${Math.floor(m/60)}h ${m%60}m`; })()
    : '—';

  const bingoSq = state.bingoGrid ? state.bingoGrid.filter(c => c.marked && !c.free).length : 0;
  const triviaNew  = Object.values(state.triviaReactions).filter(r => r === 'new').length;
  const triviaKnew = Object.values(state.triviaReactions).filter(r => r === 'knew').length;

  el('score-content').innerHTML = `
    <div class="score-header">🏠 You Made It!</div>
    <div class="score-subtitle">Taos → Trilogy · May 31, 2026</div>
    <div class="score-stats">
      <div class="score-stat"><div class="score-val">${Math.round(state.milesDriven)}</div><div class="score-lbl">Miles</div></div>
      <div class="score-stat"><div class="score-val">${driveTime}</div><div class="score-lbl">Drive time</div></div>
      <div class="score-stat"><div class="score-val">2</div><div class="score-lbl">States</div></div>
      <div class="score-stat"><div class="score-val">~5,900 ft</div><div class="score-lbl">Elev. drop</div></div>
      <div class="score-stat"><div class="score-val">${state.photos.length}</div><div class="score-lbl">Photos</div></div>
      <div class="score-stat"><div class="score-val">${totalSpots}</div><div class="score-lbl">Animals spotted</div></div>
    </div>
    ${totalSpots > 0 ? `<div class="score-wildlife">${spotLine}</div>` : ''}
    ${(triviaNew + triviaKnew) > 0 ? `<div class="score-trivia">🧠 Knew it: ${triviaKnew} · 😮 New: ${triviaNew}</div>` : ''}
    ${bingoSq > 0 ? `<div class="score-bingo">🎴 Bingo: ${bingoSq} / 24 squares</div>` : ''}
    <div class="score-note">Taos to Trilogy — not bad for a Sunday. Welcome home. 🌵</div>
    <button class="score-close-btn" id="score-close-btn">Close ✕</button>`;

  overlay.classList.remove('hidden');
  el('score-close-btn').addEventListener('click', () => overlay.classList.add('hidden'));
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
      showToast(m.icon, m.title, m.detail, m.special === 'winslow' ? 8000 : 5500);
      if (m.special === 'arrival') setTimeout(showArrivalScore, 2000);
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
  updateMetrics(); // keep stage badge and header in sync with viewed stage
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

/* ── NATURE EXPAND ───────────────────────────────────────────────────────── */
function toggleNature() {
  state.natureExpanded = !state.natureExpanded;
  el('nature-full-content').classList.toggle('hidden', !state.natureExpanded);
  el('nature-expand-btn').textContent = state.natureExpanded ? 'Less ▴' : 'More details ▾';
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

  // Nature
  el('nature-expand-btn').addEventListener('click', toggleNature);

  // Bingo
  el('bingo-fab-btn').addEventListener('click', () => {
    if (!state.bingoGrid) initBingo();
    renderBingoGrid();
    el('bingo-overlay').classList.remove('hidden');
  });
  el('bingo-close-btn').addEventListener('click', () => el('bingo-overlay').classList.add('hidden'));
  el('bingo-reset-btn').addEventListener('click', () => { initBingo(); renderBingoGrid(); });

  // Spot counter
  renderSpotPanel();
  el('spot-fab-btn').addEventListener('click', () => el('spot-panel').classList.toggle('hidden'));
  el('spot-close-btn').addEventListener('click', () => el('spot-panel').classList.add('hidden'));

  // Photo
  el('photo-fab-btn').addEventListener('click', () => el('photo-input').click());
  el('photo-input').addEventListener('change', handlePhotoCapture);

  // Challenges
  renderChallengeCard();
  el('challenge-next-btn').addEventListener('click', () => {
    state.challengeIdx++;
    renderChallengeCard();
  });
  el('challenge-done-btn').addEventListener('click', () => {
    state.challengesDone.add(state.challengeIdx);
    renderChallengeCard();
    showToast('🎯', 'Challenge complete!', TRIP_DATA.challenges[state.challengeIdx % TRIP_DATA.challenges.length].substring(0, 50) + '…', 3000);
  });

  // Phoenix weather on load
  fetchPhoenixWeather();

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
