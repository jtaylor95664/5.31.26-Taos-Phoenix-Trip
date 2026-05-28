/* ── STATE ────────────────────────────────────────────────────────────────── */
const state = {
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
  metricsExpanded: false,
  gruetOpen: false,
  gpsStarted: false,
  departureTime: null,
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
  const center = { lat: 34.6, lng: -108.9 }; // rough center of route

  state.map = new google.maps.Map(el('map'), {
    center,
    zoom: 7,
    mapTypeId: 'roadmap',
    disableDefaultUI: true,
    zoomControl: true,
    gestureHandling: 'greedy',
    styles: [
      { featureType: 'water', stylers: [{ color: '#B8D4F5' }] },
      { featureType: 'landscape', stylers: [{ color: '#F0F7FF' }] },
      { featureType: 'road.highway', stylers: [{ color: '#4A90D9' }, { weight: 1.5 }] },
    ]
  });

  drawRoute();
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

    // Draw the route
    const renderer = new google.maps.DirectionsRenderer({
      map: state.map,
      suppressMarkers: true,
      polylineOptions: { strokeColor: '#2C6FAC', strokeWeight: 4, strokeOpacity: 0.85 }
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
    startGPS();
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
  updateJuliaWidget(state.currentStage);
  updateBackBar();
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
  const juliaStageIdx = 3; // After ABQ stage
  if (state.currentStage > juliaStageIdx) {
    el('julia-cell').classList.add('hidden');
    return;
  }
  el('julia-cell').classList.remove('hidden');

  // Remaining drive time to ABQ from current position
  let milestoABQ = 0;
  if (state.currentStage === juliaStageIdx) {
    // On the Socorro→ABQ leg itself — use remaining miles on this leg
    if (state.userLat !== null) {
      milestoABQ = getMilesToNextStop(state.userLat, state.userLng, state.currentStage);
    }
  } else {
    for (let i = state.currentStage; i < juliaStageIdx; i++) {
      const legMiles = state.routeLegs[i] || TRIP_DATA.stages[i].distance;
      if (i === state.currentStage && state.userLat !== null) {
        milestoABQ += getMilesToNextStop(state.userLat, state.userLng, i);
      } else {
        milestoABQ += legMiles;
      }
    }
  }

  // Add charging stops en route to ABQ
  const chargeStopsToABQ = TRIP_DATA.stages.slice(state.currentStage, juliaStageIdx)
    .filter(s => s.charging).length;
  const driveMinutes = (milestoABQ / TRIP_DATA.avgSpeedMph) * 60;
  const chargeMinutes = chargeStopsToABQ * TRIP_DATA.avgChargeMinutes;
  const etaABQ = new Date(Date.now() + (driveMinutes + chargeMinutes) * 60000);

  const juliaLanding = new Date(TRIP_DATA.tripDate + 'T00:00:00');
  juliaLanding.setHours(TRIP_DATA.julia.landingHour, TRIP_DATA.julia.landingMinute, 0, 0);

  const bufferMs = juliaLanding - etaABQ;
  const bufferMin = Math.round(bufferMs / 60000);

  if (bufferMin > 0) {
    el('julia-buffer').textContent = `+${formatDuration(bufferMin)}`;
    el('julia-buffer').style.color = '#27AE60';
  } else {
    el('julia-buffer').textContent = `${formatDuration(Math.abs(bufferMin))} tight`;
    el('julia-buffer').style.color = '#E67E22';
  }
}

/* ── SOCORRO WARNING ──────────────────────────────────────────────────────── */
function updateSocorroWarning(stageIdx) {
  const show = TRIP_DATA.stages[stageIdx] && TRIP_DATA.stages[stageIdx].socorroWarning;
  el('socorro-banner').classList.toggle('hidden', !show);
}

/* ── JULIA WIDGET ──────────────────────────────────────────────────────────── */
function updateJuliaWidget(stageIdx) {
  const stage = TRIP_DATA.stages[stageIdx];
  const show = stage && stage.juliaVisible;
  el('julia-widget').classList.toggle('hidden', !show);
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
  renderPOICard(stage);

  state.historyExpanded = false;
  el('history-full-text').classList.add('hidden');
  el('history-expand-btn').textContent = 'Full story ▾';
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
  if (!stage.dining || stage.dining.length === 0) {
    div.innerHTML = `<p class="no-dining-note">Almost there — dining when you arrive in Taos!</p>`;
    return;
  }
  div.innerHTML = stage.dining.map(d => `
    <div class="dining-item">
      <span class="dining-type">${d.type}</span>
      <div class="dining-name">${d.name}</div>
      <div class="dining-meta">
        <span>${d.walk}</span>
        <span>${d.hours}</span>
        <span>Service: ${d.service}</span>
      </div>
      ${d.note ? `<div class="dining-note">${d.note}</div>` : ''}
    </div>
  `).join('');
}

function renderHistoryCard(stage) {
  el('history-quick-text').textContent = stage.history.quick;
  el('history-full-text').textContent = stage.history.full;
}

function renderPOICard(stage) {
  const div = el('poi-content');
  if (!stage.pois || stage.pois.length === 0) {
    div.innerHTML = `<p class="no-dining-note">No major POIs on this segment.</p>`;
    return;
  }
  div.innerHTML = stage.pois.map(p => `
    <div class="poi-item">
      <div class="poi-name">${p.name}</div>
      <div class="poi-desc">${p.description}</div>
    </div>
  `).join('');
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

/* ── GRUET MODAL ──────────────────────────────────────────────────────────── */
function renderGruetModal() {
  const now = new Date();
  const dow = now.getDay(); // 0=Sun ... 6=Sat
  const nowHour = now.getHours() + now.getMinutes() / 60;

  let html = `<p class="gruet-intro">New Mexico's premier sparkling wine producer. Two tasting rooms along your route — here's what's realistic today.</p>`;

  TRIP_DATA.gruet.forEach(loc => {
    const closeHour = loc.closeHour[dow];
    const isOpen = nowHour >= loc.openHour && nowHour < closeHour;
    const isBehind = state.currentStage >= Math.max(...loc.stageAvailable);
    const isUpcoming = !isBehind && !isOpen && nowHour < loc.openHour;
    const closesIn = closeHour - nowHour; // hours until close
    const isTight = isOpen && closesIn < 1;

    let statusClass = 'coming';
    let badgeClass = 'badge-coming';
    let badgeText = 'Coming up';

    if (isBehind) { statusClass = 'behind'; badgeClass = 'badge-behind'; badgeText = 'Passed'; }
    else if (isTight) { statusClass = 'tight'; badgeClass = 'badge-tight'; badgeText = `Closes in ${Math.round(closesIn * 60)} min`; }
    else if (isOpen) { statusClass = 'available'; badgeClass = 'badge-open'; badgeText = `Open until ${closeHour === 21 ? '9:00 PM' : '7:00 PM'}`; }
    else if (!isUpcoming && !isBehind) { statusClass = 'closed'; badgeClass = 'badge-closed'; badgeText = 'Closed now'; }

    const closeLabel = closeHour === 21 ? '9:00 PM' : '7:00 PM';
    const openLabel = '11:00 AM';
    const todayHours = `${openLabel} – ${closeLabel}`;

    html += `
      <div class="gruet-location ${statusClass}">
        <div class="gruet-city">📍 ${loc.city}</div>
        <span class="status-badge ${badgeClass}">${badgeText}</span>
        <div class="gruet-address">${loc.address}</div>
        <div class="gruet-hours-line">Today: ${todayHours}</div>
        <div class="gruet-distance">${loc.distanceNote}</div>
        <div class="gruet-arrival">${loc.tripArrivalNote}</div>
        <div class="gruet-note">${loc.note}</div>
        <div class="gruet-wines"><strong>What to try:</strong> ${loc.wines}</div>
        <a href="${loc.tockUrl}" target="_blank" class="gruet-reserve-btn">
          ${isBehind ? 'Already passed' : 'Reserve on Tock →'}
        </a>
      </div>
    `;
  });

  el('gruet-modal-content').innerHTML = html;
}

function openGruetModal() {
  renderGruetModal();
  el('modal-overlay').classList.remove('hidden');
  el('gruet-modal').classList.remove('hidden');
  state.gruetOpen = true;
}

function closeGruetModal() {
  el('modal-overlay').classList.add('hidden');
  el('gruet-modal').classList.add('hidden');
  state.gruetOpen = false;
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

/* ── CLOCK TICK ──────────────────────────────────────────────────────────── */
function tick() {
  if (state.metricsExpanded) {
    el('elapsed-time').textContent = computeElapsed();
  }
  // Re-render Gruet modal if open (hours may change)
  if (state.gruetOpen) renderGruetModal();
}

/* ── EVENT LISTENERS ─────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Initial render
  renderStageNotes(0);
  updateMetrics();
  updateSocorroWarning(0);
  updateJuliaWidget(0);

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

  // Gruet
  el('gruet-fab').addEventListener('click', openGruetModal);
  el('gruet-close-btn').addEventListener('click', closeGruetModal);
  el('modal-overlay').addEventListener('click', closeGruetModal);

  // Escape to exit fullscreen
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (state.mapFullscreen) exitFullscreen();
      if (state.gruetOpen) closeGruetModal();
    }
  });

  // Clock tick every minute
  setInterval(tick, 60000);
});
