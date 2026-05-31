# Road Trip Site — Requirements Document

**Project:** Phoenix → Taos EV Road Trip Companion
**Vehicle:** Hyundai Ioniq 5
**Route:** Route 2 — US-60 Scenic Path (Peoria → Mesa → Globe → Show Low → Socorro → Albuquerque → Santa Fe → Taos)
**Hosting:** GitHub Pages — public repo `jtaylor95664/Taos-travel`
**Travelers:** Jeff & Cecily (driving); picking up Julia at Albuquerque airport
**Departure:** 7:00 AM from Trilogy at Vistancia, Peoria, AZ
**Date:** Late May 2026

---

## 1. Overview

A single-page web app that serves as a live companion during a road trip from Trilogy at Vistancia (Peoria, AZ) to Taos, NM. The site displays the planned route, tracks the user's current GPS location, highlights EV charging stops with charger details, and surfaces points of interest and local history as the user travels through each area.

**Total Trip Distance:** ~575 miles
**Estimated Drive Time:** ~9 hours (excluding charging)
**Charging stops:** 5 stops × ~30–45 min each = ~2.5–3.75 hours additional
**Estimated total trip time:** ~11.5–13 hours → arrival in Taos approximately 6:30–8:00 PM

---

## 2. Layout & UI

The page is organized top-to-bottom into three stacked sections. Designed for a phone mounted in the car — key info is always visible without touching the map.

### Section 1 — Progress & Stage Metrics
Persistent header with two primary numbers always visible — everything else collapses behind a tap:

**Always visible:**
- **Miles to next charging stop**
- **Estimated arrival in Taos**

**Expandable on tap:**
- Trip progress bar — visual fill from Peoria to Taos (~575 mi total)
- Current stage — e.g. "Stage 3 of 7 — Show Low → Socorro"
- Miles driven / miles remaining for the full trip
- Departure time (7:00 AM) and elapsed time
- **Julia buffer** — time remaining before Julia's 5:00 PM landing vs. current pace (visible from departure until ABQ pickup)
- **Estimated battery % at next stop** — based on segment distance, elevation profile, and typical Ioniq 5 consumption; updates as GPS moves

**Socorro warning banner:** From the moment the car leaves Show Low until Socorro is confirmed passed, a persistent banner reads: "⚠️ Socorro charger unconfirmed — verify EA app. Top off at Show Low if uncertain." Displayed in Section 1, cannot be dismissed.

### Section 2 — Map
- **Collapsed by default** — shows as a slim preview bar (route thumbnail) to avoid driver distraction
- Cecily taps to expand to ~40% of the viewport
- Pre-drawn route: Peoria → Mesa (US-60) → Globe → Show Low → Socorro → Albuquerque → Santa Fe → Taos
- Live GPS dot tracking current location (browser Geolocation API)
- Charging stop markers and POI markers visible when expanded
- **Full-screen button** to go full-screen from expanded state; tap anywhere or press Escape to collapse back
- Map auto-centers on current location (can be toggled off)

### Section 3 — Current Stage Notes
Scrollable card below the map showing context for the active stage:
- **Stage name & segment distance**
- **Charging stop details** — address, network, stall count, max kW
- **Dining recommendations** — each entry includes: name, type, walking distance from charger, opening hours, and one-line note on service speed
- **History & context blurb** — displayed as a 2-sentence "quick blurb" by default; expandable to full 3–5 sentence version. Written conversationally, not encyclopedically — meant to be read aloud in a moving car.
- **POIs** along this segment with brief descriptions
- **Julia flight widget** (visible from departure until ABQ pickup): Flight UA2341, landing 5:00 PM ABQ. Shows live flight status, terminal/gate on arrival, baggage claim info. Pulls from a flight status API or links directly to United's flight tracker.

### Stage Navigation
- Stage Notes **automatically match the current GPS position** — no manual input needed while driving
- Clicking a charging stop marker on the map jumps the Stage Notes card to that stage (for preview / curiosity)
- **Previous / Next** buttons available to browse other stages manually; tapping the map dot or a "Back to Current" button snaps back to GPS-matched stage

---

## 3. EV Charging Stops

All stops are on the Electrify America network or EA-app-compatible (Electrify Commercial / APS). Stops marked as **Upcoming**, **Current**, or **Completed** based on GPS progress. Each marker popup shows address, stall count, max speed, and nearby amenities.

> **Note:** Start fully charged at home. The Ioniq 5's ~266-mile range means the first stop in Mesa is optional — you can comfortably reach Globe without it.

| # | Location | Address | Network | Stalls | Max kW | Segment Distance | Net Elev. Gain | Est. Cumul. Gain |
|---|----------|---------|---------|--------|--------|-----------------|---------------|-----------------|
| Start | Trilogy at Vistancia, Peoria, AZ | — | Home / Level 2 | — | — | — | — | — |
| 1 *(optional)* | Mesa, AZ | 554 W Baseline Rd, Mesa, AZ | Electrify America | — | 350 kW | ~25 mi | ~flat | ~100 ft |
| 2 | Globe, AZ | 902 E Ash St, Globe, AZ | Electrify Commercial / APS (EA app) | 3 | 350 kW | ~90 mi from Peoria | +2,424 ft | ~3,000 ft |
| 3 | Show Low, AZ | 180 N 9th St, Show Low, AZ | Electrify Commercial / APS (EA app) | 4 | 350 kW | ~85 mi | +2,835 ft | ~5,500 ft |
| 4 ⚠️ | Socorro, NM | ~116 Plaza St, Socorro, NM *(unconfirmed)* | Electrify America *(status uncertain)* | TBD | TBD | ~145 mi | -1,742 ft | ~1,000 ft |
| 5 | Albuquerque, NM | 2701 Claremont Ave NE, Albuquerque, NM | Electrify America | 11 | 350 kW | ~75 mi | +547 ft | ~700 ft |
| 6 | Santa Fe, NM | 5701 Herrera Dr, Santa Fe, NM | Electrify America | 8 | 350 kW | ~60 mi | +1,850 ft | ~2,100 ft |
| End | Taos, NM | — | — | — | — | ~80 mi | -31 ft | ~1,000 ft |

### ⚠️ Socorro Risk
The EA station in Socorro is planned but its operational status in May 2026 is unconfirmed. If it's not open, the gap from Show Low to Albuquerque is ~220 miles — manageable but tight after the energy-intensive White Mountain climbs. **Before the trip, verify Socorro station status on the EA app.** If it's down, consider topping off fully at Show Low and driving conservatively.

### Elevation Notes
- **Globe → Show Low (Stops 2–3):** The Salt River Canyon is the most demanding stretch — a steep ~2,000 ft descent followed immediately by a ~3,000 ft climb. Cumulative gain far exceeds net gain. Expect elevated energy consumption.
- **Regenerative braking** will recover meaningful energy on the Socorro descent and the Albuquerque approach.
- **Final leg (Santa Fe → Taos):** "The Low Road" follows the Rio Grande. Rolling terrain, net elevation near flat.

### App Setup
- EA stops + Globe + Show Low: **Electrify America app** (Globe/Show Low use EA app via Electrify Commercial partnership)
- Verify your EA account, payment method, and the EA Pass+ membership before departure

---

## 4. Trip Timing & Julia Pickup

| Milestone | Est. Arrival | Notes |
|-----------|-------------|-------|
| Depart Peoria | 7:00 AM | Start at 100% charge |
| Globe (Stop 2) | ~8:45 AM | ~1.5 hr drive; charge 30–45 min |
| Show Low (Stop 3) | ~11:00 AM | ~1.5 hr drive; charge 30–45 min |
| Socorro (Stop 4) | ~2:00 PM | ~2.5 hr drive; charge 30–45 min |
| Albuquerque (Stop 5) | ~3:45–4:15 PM | ~1.25 hr drive; charge + wait for Julia |
| Julia's flight lands | 5:00 PM | Albuquerque airport (ABQ) |
| Depart Albuquerque | ~5:30 PM | After Julia clears baggage claim |
| Santa Fe (Stop 6) | ~6:30 PM | ~1 hr drive; charge 30–45 min |
| **Arrive Taos** | **~8:00–8:30 PM** | ~1.5 hr drive from Santa Fe |

> **Buffer:** Jeff and Cecily should arrive at ABQ approximately 45–75 minutes before Julia's flight lands. The Albuquerque charging stop conveniently fills this wait time.

---

## 5. Points of Interest

POI markers appear along the route. Clicking opens an info card with a photo, short history blurb, and distance from current location.

| POI | Near | Notes |
|-----|------|-------|
| Salt River Canyon Overlook | Between Globe and Show Low, AZ | One of Arizona's most dramatic canyon views; 2,000 ft drop on US-60 |
| White Mountains | Show Low / Pinetop area, AZ | High-elevation ponderosa pine forest; Apache tribal lands |
| Very Large Array (VLA) | ~50 mi west of Socorro, NM | 27-dish radio telescope array; visible from US-60 approach |
| Socorro Historic Plaza | Socorro, NM | Spanish colonial town; San Miguel Mission (1598) |
| Albuquerque Old Town | Albuquerque, NM | Founded 1706; Spanish colonial plaza, adobe architecture |
| Sandia Mountains | Albuquerque, NM | 10,678 ft peak; tram visible from highway |
| Taos Pueblo | Taos, NM | UNESCO World Heritage Site; continuously inhabited 1,000+ years |
| Rio Grande Gorge Bridge | Just outside Taos, NM | 800-ft deep volcanic gorge; dramatic bridge crossing on US-64 |

---

## 6. Trip Progress Panel

Sidebar or bottom drawer showing:

- **Progress bar** — miles driven vs. total (~575 mi)
- **Current segment** — which leg of the trip is active
- **Miles to next charging stop**
- **Miles to destination** (Taos)
- **Estimated arrival** based on current pace
- **Next milestone** — e.g., "Julia pickup at ABQ airport — 5:00 PM"
- **Current area context** — brief description of the region currently being driven through

---

## 7. Charging Stop Dining & Spots

Mixed recommendations for the ~30–45 min wait at each charger. Each stop has a quick grab, sit-down, coffee, and/or historic option.

### Mesa, AZ — 554 W Baseline Rd *(optional stop)*
| Type | Spot | Walk from charger | Hours | Service |
|------|------|------------------|-------|---------|
| Quick grab | **Fry's Food & Drug** | At the charger | 6 AM – midnight | Immediate |
| Coffee | **Jarrod's Coffee, Tea & Gallery** | ~10 min drive, historic downtown | TBD | Cafe pace |
| Sit down (historic) | **The Nile Coffee Shop** | ~10 min drive | TBD | Relaxed |

---

### Globe, AZ — 902 E Ash St
| Type | Spot | Walk from charger | Hours | Service |
|------|------|------------------|-------|---------|
| Sit down (historic) | **Chalo's Casa Reynoso** | At the charger | TBD | Sit-down, ~20 min |
| Quick grab | **La Luz del Día** | ~5 min drive, historic downtown | TBD | ~3 min table to food |
| Coffee | **Copper Cities Coffee** — 1100 N Broad St | ~5 min drive | TBD | Cafe pace |

### Show Low, AZ — 180 N 9th St
| Type | Spot | Walk from charger | Hours | Service |
|------|------|------------------|-------|---------|
| Sit down (historic) | **Show Low Cafe** — 480 W Deuce of Clubs | ~5 min drive | TBD | Diner pace, ~15–20 min |
| Quick grab | **Mudslingers Drive Thru** | ~5 min drive | TBD | Drive-through, ~5 min |
| Coffee | **Arizona Mountain Coffee Co.** — 151 N White Mountain Rd | ~5 min drive | Opens 6 AM | Cafe pace |

### Socorro, NM — ~116 Plaza St
| Type | Spot | Walk from charger | Hours | Service |
|------|------|------------------|-------|---------|
| Sit down / Coffee / Historic | **El Camino Restaurant & Lounge** — 606 California St | ~5 min drive | Open 24 hrs | Fast diner service |
| Quick grab | **Los Mario's Mexican Food** | TBD | TBD | Quick, ~10 min |

### Albuquerque, NM — 2701 Claremont Ave NE *(longer stop — waiting for Julia)*
| Type | Spot | Walk from charger | Hours | Service |
|------|------|------------------|-------|---------|
| Sit down (historic) | **Church Street Cafe** — Old Town | ~15 min drive | TBD | Sit-down, ~25 min |
| Quick grab | **Old Town Cafe** — 206 San Felipe St NW | ~15 min drive | TBD | Fast, ~10 min |
| Coffee | **Black Bird Coffee House** — Old Town | ~15 min drive | TBD | Cafe pace |

> **Flow suggestion:** Charge at Claremont Ave NE → drive to Old Town (~15 min) → eat, explore, coffee → drive to ABQ airport (~20 min) to collect Julia at 5 PM.

### Santa Fe, NM — 5701 Herrera Dr
| Type | Spot | Walk from charger | Hours | Service |
|------|------|------------------|-------|---------|
| Coffee / Quick grab | **Tribes Coffee House** — 3470 Zafarano Dr | ~2 min walk | Opens 7 AM | Fast, ~5 min |
| Quick grab | **Plaza Cafe Southside** — 3466 Zafarano Dr | ~2 min walk | TBD | Fast, ~10 min |
| Sit down (historic) | **The Shed** — downtown Santa Fe | ~10 min drive | TBD | Sit-down, ~25 min |

> **Note:** Hours marked TBD should be verified before the trip and hardcoded into the site data.

---

## 8. Local History / Context Feed

As the user's GPS moves through different regions, the panel updates automatically with relevant historical or cultural context.

**Format rules:**
- **Quick blurb** (default): 2 sentences max — the hook, readable aloud in ~15 seconds
- **Full story** (tap to expand): 3–5 sentences — conversational tone, written to be read aloud in a moving car, not like a Wikipedia article
- No headers, no bullet points inside the blurbs — flowing prose only

| Region / Trigger | Content |
|-----------------|---------|
| Leaving Peoria / entering Phoenix metro | The Salt River Valley was irrigated by the Hohokam people over 1,000 years ago using a canal system stretching 500+ miles — one of the most sophisticated in the ancient world. Modern Phoenix essentially rebuilt those same canals in the 1860s and 70s, naming the city after the mythical bird reborn from ashes. |
| US-60 east of Mesa | The Superstition Mountains to your south are home to one of the American West's most enduring legends: the Lost Dutchman's Gold Mine. Since the 1800s, hundreds of treasure hunters have searched the range — and a handful have died trying. |
| Approaching Globe | Globe sits at the edge of the San Carlos Apache Reservation, homeland of the Western Apache people who fiercely resisted U.S. expansion into Arizona. The town itself boomed in the 1870s on silver, then copper — the Globe-Miami district became one of the richest copper mining regions in the world. Look for the Besh-Ba-Gowah ruins just north of town: 700-year-old Salado people cliff dwellings, well worth a visit if you have time. |
| Salt River Canyon | The Salt River Canyon is sometimes called "Arizona's Little Grand Canyon" — a dramatic 2,000-ft drop carved over millions of years by the Salt River. You're driving through the ancestral territory of the White Mountain Apache Tribe, who have lived in these mountains for centuries and still govern the surrounding reservation today. |
| Show Low area | Show Low's name comes from an 1875 poker game: two pioneers couldn't agree on who should buy out the other's homestead, so they played cards for it. The winner showed low — the two of clubs — and the town was named on the spot. You're now in the high country of the Mogollon Rim, a 200-mile escarpment marking the edge of the Colorado Plateau. |
| Fort Apache / White Mountains | Fort Apache, just east of Show Low, was a U.S. Army post established in 1870 during the Apache Wars. It's now a National Historic Landmark on the White Mountain Apache Tribe's reservation, operated by the tribe as a living history site. The ponderosa pine forests here look nothing like the desert you left this morning. |
| Crossing into New Mexico | Welcome to New Mexico — the "Land of Enchantment." You're descending from the Arizona high country into the Rio Grande corridor, one of the oldest continuously inhabited regions in North America. The landscape shifts dramatically: red rock, desert grassland, and the distant outline of the Datil and Magdalena mountain ranges. |
| Socorro | Socorro is one of New Mexico's oldest European settlements, founded by Spanish colonists in 1598 as a supply stop on El Camino Real — the Royal Road connecting Mexico City to Santa Fe, 1,600 miles of trail that predates the Oregon Trail by 200 years. About 50 miles west on US-60 is the Very Large Array, 27 radio telescope dishes arranged across the Plains of San Agustin — one of the world's premier astronomical observatories and a filming location for the movie Contact. The Bosque del Apache wildlife refuge just south of here hosts one of North America's great wildlife spectacles every winter: tens of thousands of sandhill cranes and snow geese. |
| Approaching Albuquerque | Albuquerque sits in the Rio Grande valley at 5,300 feet, flanked by the 10,678-ft Sandia Mountains to the east. The area has been home to Tiwa-speaking Pueblo people for over a thousand years; Spanish colonists founded the city in 1706. Historic Route 66 runs straight through Central Avenue downtown — the same road that brought Dust Bowl migrants west in the 1930s. |
| Albuquerque / Julia pickup | You're at the midpoint. Albuquerque's Sunport airport sits on the southern edge of the city. From here it's ~130 miles and about 2.5 hours (with the Santa Fe charge stop) to Taos. |
| Santa Fe | Santa Fe is the oldest state capital in the U.S., founded in 1610 — a decade before the Mayflower landed. The Palace of the Governors on the plaza is the oldest continuously occupied public building in America. Georgia O'Keeffe lived and worked in the NM high desert for decades; her museum is downtown. The city sits at 7,000 feet — you'll notice the air. |
| Low Road to Taos (NM-68) | NM-68, the "Low Road," follows the Rio Grande through a dramatic gorge carved by volcanic activity 5 million years ago. The Taos Pueblo, your destination, has been continuously inhabited for over 1,000 years and is one of the oldest living communities in North America. D.H. Lawrence lived near Taos in the 1920s and called it "the most beautiful place I have ever seen." The Taos Society of Artists — founded 1915 — put this remote mountain town on the international art map. |

---

## 8. Design Theme

- **Color scheme:** Air blue — clean, sky-toned palette. Primary UI elements (progress bar, stage header, active markers) in air blue. White card backgrounds. Neutral gray text.
- Typography: clean sans-serif; large enough to read from a phone mount
- Charging stop markers: air blue with bolt icon
- POI markers: white with colored category icon
- Current GPS dot: pulsing white ring on air blue fill

---

## 9. Gruet Winery Widget

A persistent Gruet button in the UI (small, unobtrusive — corner of the screen) opens a modal showing tasting room options. The modal is **GPS and timing aware** — it shows only realistic options based on where you are in the trip and what time it is.

### Locations

| Location | Address | Hours (Sun–Wed) | Hours (Thu–Sat) | Reservations |
|----------|---------|----------------|----------------|-------------|
| Albuquerque | 8400 Pan American Fwy NE | 11 AM – 7 PM | 11 AM – 9 PM | Recommended (Tock) |
| Santa Fe | 210 Don Gaspar Ave, Hotel St. Francis | 11 AM – 7 PM | 11 AM – 9 PM | Recommended (Tock) |

### Widget Logic — What Shows Based on Trip Stage

| Trip Stage | Widget Shows |
|-----------|-------------|
| Departure → ABQ | Both locations previewed; ABQ highlighted as "coming up." Note: visit feasible only if Julia buffer allows (~45 min window). |
| In Albuquerque (3:45–4:15 PM) | ABQ location shown as **NOW OPEN** with live distance from charger (~15 min). Feasibility note based on Julia pickup countdown — if buffer > 60 min, shows "Feasible for a quick visit"; if < 60 min, shows "Tight — consider Santa Fe instead." Tock link prominent. |
| ABQ → Santa Fe | Santa Fe location shown as primary upcoming option. Day-of-week aware: if Thu–Sat shows "Open until 9 PM — 2+ hrs on arrival"; if Sun–Wed shows "Open until 7 PM — 30-min window on arrival — consider reserving now." |
| In Santa Fe (~6:30 PM) | Santa Fe shown as **NOW OPEN** with live distance from charger (~10 min drive). Closes-at countdown displayed. Tock reservation link prominent. If closed or closing within 15 min, shows "Closed / closing soon" with a note to visit next time. |
| Past Santa Fe | Widget shows "Both locations behind you — next time!" |

### Modal Contents
- Location name, address, hours for today (day-aware)
- Distance from current position / next charger
- Feasibility note (see logic above)
- **What to try** — brief tasting note on 2–3 signature Gruet wines (Blanc de Noirs, Brut, Blanc de Blancs)
- Tock reservation link (opens in new tab)
- Phone number for walk-in availability

---

## 10. Technical Constraints

- **No backend** — all data hardcoded in JS or loaded from static JSON files
- **No build tools required** — plain HTML/CSS/JS; works directly from GitHub Pages
- **Mobile-first** — primary use is on a phone mounted in the car
- **Offline-friendly** — core UI loads even with weak GPS signal; map tiles degrade gracefully
- **API key** — Google Maps JavaScript API key lives in the source (public repo). Key is restricted to `jtaylor95664.github.io` domain in Google Cloud Console. Key will be deleted after the trip.
- **Route rendering** — Google Maps Directions API, called live on page load. Covered by $200/month free credit; cost is negligible for personal use.

---

## 11. Out of Scope

- Real-time charger availability (verify via EA app before each stop)
- Turn-by-turn navigation (use the car's built-in nav for that)
- Night mode
- User accounts or data persistence
