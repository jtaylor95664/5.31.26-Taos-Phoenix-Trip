// ── TRIP DATA ──────────────────────────────────────────────────────────────
const TRIP_DATA = {
  title: 'Peoria → Taos',
  tripDate: '2026-05-28', // YYYY-MM-DD trip date — used for Julia landing time calc
  totalMiles: 575,
  departure: { hour: 7, minute: 0 },
  avgSpeedMph: 55,
  avgChargeMinutes: 37.5,

  julia: {
    flight: 'UA2341',
    landingHour: 17,
    landingMinute: 0,
    airport: 'ABQ Sunport',
    trackerUrl: 'https://flightaware.com/live/flight/UAL2341'
  },

  // Ordered waypoints for route drawing (Origin, 5 waypoints, Destination)
  routeWaypoints: [
    { lat: 33.7179, lng: -112.3284 }, // Peoria
    { lat: 33.3961, lng: -110.7816 }, // Globe
    { lat: 34.2538, lng: -110.0286 }, // Show Low
    { lat: 34.0584, lng: -106.8914 }, // Socorro
    { lat: 35.1340, lng: -106.5760 }, // Albuquerque
    { lat: 35.6272, lng: -105.9910 }, // Santa Fe
    { lat: 36.4072, lng: -105.5731 }  // Taos
  ],

  stages: [
    {
      id: 0,
      name: 'Peoria → Globe',
      shortName: 'To Globe',
      distance: 90,
      cumulativeStart: 0,
      startCoords: { lat: 33.7179, lng: -112.3284 },
      endCoords:   { lat: 33.3961, lng: -110.7816 },
      socAtStart: 100,
      socAtEnd: 60,
      socorroWarning: false,
      juliaVisible: true,

      charging: {
        name: 'Electrify America – Globe',
        address: '902 E Ash St, Globe, AZ 85501',
        network: 'Electrify Commercial / APS (EA app)',
        stalls: 3,
        maxKw: 350,
        note: 'Optional Mesa stop at 554 W Baseline Rd (~25 mi) if you need a top-off before the climb. Leaving fully charged from Peoria you should reach Globe comfortably.'
      },

      dining: [
        { type: 'Sit-down · Historic', name: "Chalo's Casa Reynoso", address: '902 E Ash St', walk: 'At the charger', hours: 'Check locally', service: '~20 min', note: "Long-running local institution at the exact charger address. Famous adobada and green chile." },
        { type: 'Quick grab', name: 'La Luz del Día', address: 'Historic downtown (~5 min drive)', walk: '~5 min drive', hours: 'Check locally', service: '~3 min', note: 'Burritos, quesadillas, Mexican bread — food on the table almost instantly.' },
        { type: 'Coffee', name: 'Copper Cities Coffee', address: '1100 N Broad St', walk: '~5 min drive', hours: 'Check locally', service: 'Café pace', note: "Rustic interior inspired by Globe's mining heritage. Good espresso." }
      ],

      history: {
        quick: 'Globe sits at the edge of the San Carlos Apache Reservation, and its 1870s copper boom made it one of the richest mining districts in the American West.',
        full: "Globe sits at the edge of the San Carlos Apache Reservation, homeland of the Western Apache people who fiercely resisted U.S. expansion into Arizona. The town boomed in the 1870s on silver, then copper — the Globe-Miami district became one of the richest mining regions in the world. Back along US-60, the Superstition Mountains hid one of the West's great legends: the Lost Dutchman's Gold Mine, which has drawn treasure hunters — and claimed a few lives — since the 1800s. The Hohokam people irrigated this entire valley 1,000 years ago with 500+ miles of canals; Phoenix rebuilt those same canals in the 1860s and named itself after the bird reborn from ashes."
      },

      pois: [
        { name: 'Superstition Mountains', coords: { lat: 33.4700, lng: -111.3700 }, description: "Home of the legendary Lost Dutchman's Gold Mine. Jagged volcanic peaks visible from US-60." },
        { name: 'Besh-Ba-Gowah Ruins', coords: { lat: 33.4192, lng: -110.7853 }, description: '700-year-old Salado people dwellings just north of Globe. One of Arizona\'s hidden archaeological gems.' }
      ]
    },

    {
      id: 1,
      name: 'Globe → Show Low',
      shortName: 'To Show Low',
      distance: 85,
      cumulativeStart: 90,
      startCoords: { lat: 33.3961, lng: -110.7816 },
      endCoords:   { lat: 34.2538, lng: -110.0286 },
      socAtStart: 90,
      socAtEnd: 48,
      socorroWarning: false,
      juliaVisible: true,

      charging: {
        name: 'Electrify America – Show Low',
        address: '180 N 9th St, Show Low, AZ 85901',
        network: 'Electrify Commercial / APS (EA app)',
        stalls: 4,
        maxKw: 350,
        note: 'Most demanding segment — Salt River Canyon causes heavy energy use. Charge as full as practical here. ⚠️ Verify Socorro charger status in the EA app before leaving.'
      },

      dining: [
        { type: 'Sit-down · Historic', name: 'Show Low Cafe', address: '480 W Deuce of Clubs', walk: '~5 min drive', hours: 'Check locally', service: '~15–20 min', note: "Classic small-town diner. The street name tells the whole story — see history card." },
        { type: 'Quick grab', name: 'Mudslingers Drive Thru', address: 'Show Low', walk: '~5 min drive', hours: 'Check locally', service: '~5 min drive-through', note: 'Local family-run drive-through. Fastest option if the clock is ticking.' },
        { type: 'Coffee', name: 'Arizona Mountain Coffee Co.', address: '151 N White Mountain Rd', walk: '~5 min drive', hours: 'Opens 6 AM', service: 'Café pace', note: 'Good high-country fuel stop. Sandwiches, pastries, bagels.' }
      ],

      history: {
        quick: "Show Low got its name from an 1875 poker game — two pioneers played cards for the homestead, and the winner \"showed low.\" You're now atop the Mogollon Rim, the dramatic edge of the Colorado Plateau.",
        full: "Show Low's name comes from an 1875 poker game: two pioneers couldn't agree on who should buy out the other's homestead, so they played cards for it. The winner showed low — the two of clubs — and the town was named on the spot. You climbed through the Salt River Canyon to get here, one of Arizona's most dramatic stretches of road: a 2,000-ft descent into the canyon followed immediately by a 3,000-ft climb back out through White Mountain Apache territory. Fort Apache, just east of here, was a U.S. Army post from 1870 — now a National Historic Landmark operated by the White Mountain Apache Tribe. The ponderosa pine forests up here look nothing like the desert you left this morning."
      },

      pois: [
        { name: 'Salt River Canyon Overlook', coords: { lat: 33.8300, lng: -110.6900 }, description: "Arizona's \"Little Grand Canyon\" — 2,000 ft of dramatic drop on US-60. White Mountain Apache ancestral territory." },
        { name: 'Mogollon Rim', coords: { lat: 34.1500, lng: -110.4000 }, description: '200-mile volcanic escarpment marking the southern edge of the Colorado Plateau. Elevation jumps sharply as you climb out of the canyon.' }
      ]
    },

    {
      id: 2,
      name: 'Show Low → Socorro',
      shortName: 'To Socorro',
      distance: 145,
      cumulativeStart: 175,
      startCoords: { lat: 34.2538, lng: -110.0286 },
      endCoords:   { lat: 34.0584, lng: -106.8914 },
      socAtStart: 90,
      socAtEnd: 44,
      socorroWarning: true,
      juliaVisible: true,

      charging: {
        name: 'Electrify America – Socorro ⚠️',
        address: '~116 Plaza St, Socorro, NM 87801',
        network: 'Electrify America (status unconfirmed)',
        stalls: null,
        maxKw: null,
        note: '⚠️ Verify this station in the EA app before leaving Show Low. If down, the gap to Albuquerque is ~220 miles — tight after the White Mountain climbs. Top off fully at Show Low and drive conservatively if uncertain.'
      },

      dining: [
        { type: 'Sit-down · Coffee · Historic', name: 'El Camino Restaurant & Lounge', address: '606 California St', walk: '~5 min drive', hours: 'Open 24 hours', service: 'Fast diner', note: "Open since 1963. Voted Socorro's best coffee and best breakfast every year. The platonic ideal of a US-60 highway diner." },
        { type: 'Quick grab', name: "Los Mario's Mexican Food", address: 'Socorro', walk: 'Check locally', hours: 'Check locally', service: '~10 min', note: 'Highly rated local spot. Shredded beef tacos are the standout.' }
      ],

      history: {
        quick: "Socorro is one of New Mexico's oldest settlements, founded in 1598 as a stop on El Camino Real — the Royal Road from Mexico City to Santa Fe that predates the Oregon Trail by 200 years.",
        full: "Socorro is one of New Mexico's oldest European settlements, founded by Spanish colonists in 1598 as a supply stop on El Camino Real — the 1,600-mile Royal Road connecting Mexico City to Santa Fe, predating the Oregon Trail by two centuries. You crossed into New Mexico through high-desert grassland, with the Datil and Magdalena Mountains on the horizon. About 50 miles west on US-60 sits the Very Large Array: 27 radio telescope dishes on the Plains of San Agustin, one of the world's premier astronomical observatories and the filming location for the movie Contact. The Bosque del Apache refuge just south hosts tens of thousands of sandhill cranes and snow geese each winter — one of North America's great wildlife spectacles."
      },

      pois: [
        { name: 'Very Large Array (VLA)', coords: { lat: 34.0789, lng: -107.6183 }, description: '27-dish radio telescope array on the Plains of San Agustin. Featured in the film Contact. Visible ~50 mi west on US-60.' },
        { name: 'Bosque del Apache NWR', coords: { lat: 33.7700, lng: -106.9000 }, description: 'World-class bird sanctuary south of Socorro. Tens of thousands of sandhill cranes and snow geese winter here.' },
        { name: 'San Miguel Mission', coords: { lat: 34.0584, lng: -106.8925 }, description: 'Historic Spanish colonial mission in Socorro\'s plaza, dating to 1598. One of the oldest churches in the U.S.' }
      ]
    },

    {
      id: 3,
      name: 'Socorro → Albuquerque',
      shortName: 'To Albuquerque',
      distance: 75,
      cumulativeStart: 320,
      startCoords: { lat: 34.0584, lng: -106.8914 },
      endCoords:   { lat: 35.1340, lng: -106.5760 },
      socAtStart: 90,
      socAtEnd: 64,
      socorroWarning: false,
      juliaVisible: true,

      charging: {
        name: 'Electrify America – Albuquerque',
        address: '2701 Claremont Ave NE, Albuquerque, NM 87107',
        network: 'Electrify America',
        stalls: 11,
        maxKw: 350,
        note: 'Longer stop — charge while you explore Old Town (~15 min drive) before picking up Julia at 5 PM. ABQ airport is ~10 miles from the charger.'
      },

      dining: [
        { type: 'Sit-down · Historic', name: 'Church Street Cafe', address: 'Old Town Albuquerque', walk: '~15 min drive', hours: 'Check locally', service: '~25 min', note: "One of ABQ's oldest restaurants in a 300-year-old adobe building. Traditional NM green chile dishes." },
        { type: 'Quick grab', name: 'Old Town Cafe', address: '206 San Felipe St NW', walk: '~15 min drive', hours: 'Check locally', service: '~10 min', note: 'Casual and fast. Local art on the walls. Frito pie if you\'re feeling New Mexican.' },
        { type: 'Coffee', name: 'Black Bird Coffee House', address: 'Old Town', walk: '~15 min drive', hours: 'Check locally', service: 'Café pace', note: 'Shady hacienda patio. Good espresso.' }
      ],

      history: {
        quick: 'Albuquerque sits in the Rio Grande valley at 5,300 feet, founded by Spanish colonists in 1706 — but Tiwa-speaking Pueblo people have lived here for over a thousand years before that.',
        full: "Albuquerque sits in the Rio Grande valley at 5,300 feet, flanked by the 10,678-ft Sandia Mountains to the east. The area has been home to Tiwa-speaking Pueblo people for over a thousand years; Spanish colonists founded the city in 1706. Historic Route 66 runs straight through Central Avenue downtown — the same road that carried Dust Bowl migrants west in the 1930s. The Sandia Mountains catch the last light of the day in a phenomenon locals call \"the watermelon\" — the pink-orange glow that gives the range its name (sandia means watermelon in Spanish)."
      },

      pois: [
        { name: 'Albuquerque Old Town', coords: { lat: 35.0958, lng: -106.6692 }, description: 'Founded 1706. Spanish colonial plaza, San Felipe de Neri Church, adobe architecture. 15 min drive from charger.' },
        { name: 'Sandia Mountains', coords: { lat: 35.2100, lng: -106.4500 }, description: '10,678 ft peak. Famous watermelon-pink glow at sunset. Aerial tram visible from the highway.' }
      ]
    },

    {
      id: 4,
      name: 'Albuquerque → Santa Fe',
      shortName: 'To Santa Fe',
      distance: 60,
      cumulativeStart: 395,
      startCoords: { lat: 35.1340, lng: -106.5760 },
      endCoords:   { lat: 35.6272, lng: -105.9910 },
      socAtStart: 90,
      socAtEnd: 68,
      socorroWarning: false,
      juliaVisible: false,

      charging: {
        name: 'Electrify America – Santa Fe',
        address: '5701 Herrera Dr, Santa Fe, NM 87507',
        network: 'Electrify America',
        stalls: 8,
        maxKw: 350,
        note: 'Tribes Coffee House and Plaza Cafe are literally around the corner. Downtown Santa Fe is a 10-min drive — check Gruet Winery hours!'
      },

      dining: [
        { type: 'Coffee · Quick grab', name: 'Tribes Coffee House', address: '3470 Zafarano Dr', walk: '~2 min walk', hours: 'Opens 7 AM', service: '~5 min', note: 'Around the corner from the charger. All-day breakfast burritos and benedicts.' },
        { type: 'Quick grab', name: 'Plaza Cafe Southside', address: '3466 Zafarano Dr', walk: '~2 min walk', hours: 'Check locally', service: '~10 min', note: 'Also right next to the charger. Santa Fe neighborhood staple, traditional NM dishes.' },
        { type: 'Sit-down · Historic', name: 'The Shed', address: 'Downtown Santa Fe', walk: '~10 min drive', hours: 'Check locally', service: '~25 min', note: 'Santa Fe institution since 1953. Legendary red chile enchiladas. Worth the short drive.' }
      ],

      history: {
        quick: "Santa Fe is the oldest state capital in the U.S., founded in 1610 — a decade before the Mayflower landed. The Palace of the Governors is the oldest continuously occupied public building in America.",
        full: "Santa Fe is the oldest state capital in the U.S., founded in 1610 — a full decade before the Mayflower landed. The Palace of the Governors on the plaza is the oldest continuously occupied public building in America. Georgia O'Keeffe lived and worked in the New Mexico high desert for decades; her museum is downtown. The city sits at 7,000 feet — you'll notice the air. Julia's along for the final leg, and you're approaching one of the most beautiful descents in the Southwest: the Low Road to Taos."
      },

      pois: [
        { name: 'Palace of the Governors', coords: { lat: 35.6870, lng: -105.9378 }, description: 'Oldest continuously occupied public building in America. Native vendors sell jewelry under the portal daily.' },
        { name: "Georgia O'Keeffe Museum", coords: { lat: 35.6893, lng: -105.9395 }, description: 'Dedicated to the artist who defined the visual language of the American Southwest.' }
      ]
    },

    {
      id: 5,
      name: 'Santa Fe → Taos',
      shortName: 'To Taos',
      distance: 80,
      cumulativeStart: 455,
      startCoords: { lat: 35.6272, lng: -105.9910 },
      endCoords:   { lat: 36.4072, lng: -105.5731 },
      socAtStart: 90,
      socAtEnd: 58,
      socorroWarning: false,
      juliaVisible: false,

      charging: null,

      dining: [],

      history: {
        quick: "NM-68, the Low Road, follows the Rio Grande through a gorge carved by volcanic eruptions 5 million years ago — your final run into Taos, one of the oldest continuously inhabited communities on Earth.",
        full: "NM-68, the \"Low Road,\" follows the Rio Grande through a dramatic gorge carved by volcanic activity 5 million years ago. The Taos Pueblo, your destination, has been continuously inhabited for over 1,000 years — a UNESCO World Heritage Site and one of the oldest living communities in North America. D.H. Lawrence lived near Taos in the 1920s and called it \"the most beautiful place I have ever seen.\" The Taos Society of Artists, founded 1915, put this remote mountain town on the international art map — and it has never really left."
      },

      pois: [
        { name: 'Rio Grande Gorge Bridge', coords: { lat: 36.4358, lng: -105.7225 }, description: '800-ft volcanic gorge with one of the highest bridges in the U.S. on US-64 — unmissable.' },
        { name: 'Taos Pueblo', coords: { lat: 36.4425, lng: -105.5464 }, description: 'UNESCO World Heritage Site. Continuously inhabited for 1,000+ years. Multi-story adobe dwellings still in active use.' }
      ]
    }
  ],

  gruet: [
    {
      city: 'Albuquerque',
      address: '8400 Pan American Fwy NE, Albuquerque, NM 87113',
      phone: '(505) 821-0055 ext. 2',
      // closeHour indexed by day: 0=Sun,1=Mon,...,6=Sat
      openHour: 11,
      closeHour: [19, 19, 19, 19, 21, 21, 21],
      tockUrl: 'https://www.exploretock.com/gruet-winery-albuquerque',
      distanceNote: '~15 min drive from EA charger',
      tripArrivalNote: 'You arrive ~3:45–4:15 PM',
      wines: 'Blanc de Noirs, Brut, Blanc de Blancs, Demi-Sec',
      note: 'The original winery tasting room. Tight window given Julia pickup at 5 PM — call ahead or reserve on Tock.',
      stageAvailable: [3] // visible when on stage 3 (Socorro→ABQ) or at ABQ
    },
    {
      city: 'Santa Fe',
      address: '210 Don Gaspar Ave, Hotel St. Francis, Santa Fe, NM 87501',
      phone: 'See website',
      openHour: 11,
      closeHour: [19, 19, 19, 19, 21, 21, 21],
      tockUrl: 'https://www.exploretock.com/gruet-winery-santafe',
      distanceNote: '~10 min drive from EA charger',
      tripArrivalNote: 'You arrive ~6:30 PM',
      wines: 'Blanc de Noirs, Brut, Rosé, Blanc de Blancs',
      note: 'In the gorgeous Hotel St. Francis downtown. Thu–Sat open until 9 PM — ideal if your trip falls on a weekend.',
      stageAvailable: [4, 5] // visible from ABQ→Santa Fe stage onward
    }
  ]
};
