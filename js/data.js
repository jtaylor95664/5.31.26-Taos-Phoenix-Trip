// ── TRIP DATA ──────────────────────────────────────────────────────────────
const TRIP_DATA = {
  title: 'Taos → Phoenix',
  tripDate: '2026-05-31',
  totalMiles: 620,
  departure: { hour: 8, minute: 0 },
  avgSpeedMph: 55,
  avgChargeMinutes: 35,

  // No Julia on return trip
  julia: null,

  // Ordered waypoints for route drawing
  routeWaypoints: [
    { lat: 36.4072, lng: -105.5731 }, // Taos
    { lat: 35.6272, lng: -105.9910 }, // Santa Fe
    { lat: 35.1340, lng: -106.5760 }, // Albuquerque
    { lat: 35.5281, lng: -108.7426 }, // Gallup
    { lat: 35.1983, lng: -111.6513 }, // Flagstaff
    { lat: 33.7179, lng: -112.3284 }  // Peoria / Trilogy
  ],

  stages: [

    /* ── STAGE 0: Taos → Santa Fe (NM-68 Low Road) ──────────────────────────── */
    {
      id: 0,
      name: 'Taos → Santa Fe',
      shortName: 'To Santa Fe',
      distance: 90,
      cumulativeStart: 0,
      startCoords: { lat: 36.4072, lng: -105.5731 },
      endCoords:   { lat: 35.6272, lng: -105.9910 },
      socAtStart: 80,
      socAtEnd: 55,
      socorroWarning: false,
      juliaVisible: false,

      charging: {
        name: 'Electrify America – Santa Fe Railyard',
        address: '5701 Herrera Dr, Santa Fe, NM 87507',
        network: 'Electrify America',
        stalls: 8,
        maxKw: 350,
        note: 'In the Railyard/Guadalupe district — Cowgirl BBQ and Second Street Brewery are a short walk. Downtown Santa Fe is 10 min away. Check Gruet Santa Fe hours before you arrive!'
      },

      dining: [
        {
          type: 'Casual Southwest · BBQ',
          name: 'Cowgirl BBQ',
          address: '319 S Guadalupe St, Santa Fe, NM 87501',
          walk: '~6 min walk from EA charger',
          hours: 'Mon–Fri 11:30 AM – 9/10 PM; Sat–Sun 11:30 AM – 10 PM',
          service: 'Full table service, lively patio',
          note: "A Railyard/Guadalupe district institution. Big patio, Southwestern BBQ and comfort food, strong margaritas, and a billiard parlor. Good bet if you want to sit outside and feel the Santa Fe vibe without the Plaza price tag."
        },
        {
          type: 'Brewpub',
          name: 'Second Street Brewery at the Railyard',
          address: '1607 Paseo de Peralta #10, Santa Fe, NM 87501',
          walk: '~8 min walk from EA charger',
          hours: 'Mon–Sat 11 AM – 10 PM; Sun 12 PM – 9 PM',
          service: 'Counter order / table service',
          note: "Opens onto Railyard Plaza in the same building as the Farmer's Market Hall. New Mexican craft beer, green-chile cheeseburgers (won the Smackdown critics' choice), and a covered patio. Fast service makes it a solid charge-stop lunch."
        },
        {
          type: 'Pan-Asian · Bar',
          name: 'Jinja Bar & Bistro',
          address: '510 N Guadalupe St, Santa Fe, NM 87501',
          walk: '~10 min walk from EA charger',
          hours: 'Daily 11 AM – 9 PM',
          service: 'Full table service',
          note: "Pacific Rim fusion in the Guadalupe corridor — inventive Asian menu alongside a cocktail bar with vintage 1930s–40s drinks. A different flavor profile if you're Santa Fe'd-out on green chile."
        }
      ],

      history: {
        quick: "The NM-68 Low Road traces the Rio Grande through a basalt gorge carved over the last 1–2 million years by snowmelt cutting through 29-million-year-old Taos Plateau lava flows. The corridor was the spine of colonial New Mexico: Ohkay Owingeh Pueblo near Española was the first Spanish capital of New Mexico, established by Juan de Oñate in 1598.",
        full: "The Rio Grande Gorge that NM-68 follows south from Taos was born of two overlapping forces: continental rifting that began pulling the earth's crust apart roughly 29 million years ago, and a series of volcanic eruptions — the Servilleta basalt flows of the Taos Plateau volcanic field — that poured lava across the landscape. When the Rio Grande established itself as a major river 1–2 million years ago, it sawed straight down through those layered lavas, eventually cutting a trench up to 800 feet deep. The human story is equally deep: the Tewa-speaking people of Ohkay Owingeh (formerly San Juan Pueblo) have lived near the confluence of the Rio Grande and Rio Chama since the 1200s. In July 1598, conquistador Juan de Oñate arrived here, renamed the pueblo San Juan de los Caballeros, and declared it the first capital of the Province of New Mexico — making this stretch of river the original European beachhead in what is now the American Southwest. The Embudo Valley downstream was later threaded by the Denver and Rio Grande's narrow-gauge 'Chili Line' (1881–1941), which carried chile, wool, and passengers through the gorge and gave the roadside community of Embudo its name — 'funnel' in Spanish, for the narrows where the Rio Embudo joins the Rio Grande."
      },

      trivia: [
        "NASA geologically trained Apollo astronauts at the Rio Grande Gorge in 1971 — the basalt canyon was considered the closest Earth analogue to the Apollo 15 lunar landing site. David Scott, James Irwin, John Young, Charlie Duke, and Jack Schmitt all practiced geology here before walking on the Moon.",
        "The Denver and Rio Grande's narrow-gauge 'Chili Line' ran through this gorge from 1881 to 1941, carrying northern New Mexico's famous red chile to markets in Colorado. At Embudo station, northbound and southbound trains met mid-day so passengers could eat lunch — the schedule was built around the meal, not the other way around.",
        "The Rio Grande Gorge is not carved into the Rocky Mountains — it's cut through a flat basalt plateau. The river saws downward through lava flows faster than the surrounding land rises, meaning the gorge gets slightly deeper every year."
      ],

      scenic: [
        {
          label: 'Gorge First Reveal',
          detail: "About 8 miles south of Ranchos de Taos, NM-68 crests a low rise and the eastern rim of the Rio Grande Gorge suddenly appears on the right. The basalt walls plunge out of sight — there's no warning, the flat lava plateau just ends. Pull into the east-side picnic area for the full view down to the river 600 feet below.",
          icon: '🏜'
        },
        {
          label: 'Pilar River Beach',
          detail: "As NM-68 drops into the Pilar area, the gorge walls step back and the Rio Grande widens into a series of green river-beach campsites. On late-May mornings the cottonwoods are fully leafed in brilliant green against the dark basalt — a jarring color shift after miles of volcanic rock and juniper.",
          icon: '🌿'
        },
        {
          label: 'Embudo Vineyard Valley',
          detail: "Between Embudo and Dixon the gorge mellows into a wide agricultural valley. Look for hand-watered acequia fields, apple orchards, and high-altitude vineyards terraced into the hillside — a genuinely unexpected pastoral scene inside what was a sheer canyon 10 miles north.",
          icon: '🍇'
        }
      ],

      pois: [
        {
          name: 'Rio Grande Gorge Overlook (NM-68 Pullout)',
          coords: { lat: 36.33, lng: -105.733 },
          description: "A roadside pullout on NM-68 about 8 miles south of Ranchos de Taos offers a dramatic view down into the Rio Grande Gorge. The gash in the Servilleta basalt can be seen clearly from the east-side picnic area, the river 600 feet below.",
          hook: "You're standing on a lava flow that erupted roughly 3 million years ago; the river below has since sawed 600 feet straight down through solid basalt — a process still ongoing today."
        },
        {
          name: 'Pilar Whitewater Area / Orilla Verde Recreation Area',
          coords: { lat: 36.269, lng: -105.782 },
          description: "At Pilar the gorge opens slightly and the Rio Grande's famous Racecourse rapid run — New Mexico's most popular whitewater stretch — ends just downstream. On a May morning you'll often see a fleet of rafts beaching right below the highway.",
          hook: "The Racecourse is 5 miles of Class III–IV whitewater — pull over and watch the take-out chaos as rafters haul boats up the bank right below the road."
        },
        {
          name: 'Vivác Winery Tasting Room',
          coords: { lat: 36.21, lng: -105.794 },
          description: "Perched at 6,200 feet at the NM-68/NM-75 junction in the village of Dixon, Vivác Winery is among the highest-altitude wineries in the world. Brothers Jesse and Chris Padberg planted French varietals here in 1998; the tasting room at 2075 NM-68 sits right on the Low Road southbound.",
          hook: "One of the world's highest-altitude commercial wineries — and it's right on the highway. Zero detour required for a quick tasting stop."
        },
        {
          name: 'Ohkay Owingeh Pueblo',
          coords: { lat: 36.052, lng: -106.071 },
          description: "Located 4 miles northeast of Española off NM-68, Ohkay Owingeh is where Oñate established the first Spanish capital of New Mexico in 1598 — before Santa Fe even existed. The pueblo's Tewa name means 'Place of the Strong People'; it was known as San Juan Pueblo for four centuries before the community reclaimed its original name in 2005.",
          hook: "Santa Fe gets all the colonial tourism, but this is actually where New Mexico's European history began — 12 years before the Palace of the Governors was built."
        }
      ]
    },

    /* ── STAGE 1: Santa Fe → Albuquerque (I-25 south) ────────────────────────── */
    {
      id: 1,
      name: 'Santa Fe → Albuquerque',
      shortName: 'To Albuquerque',
      distance: 65,
      cumulativeStart: 90,
      startCoords: { lat: 35.6272, lng: -105.9910 },
      endCoords:   { lat: 35.1340, lng: -106.5760 },
      socAtStart: 90,
      socAtEnd: 68,
      socorroWarning: false,
      juliaVisible: false,

      charging: {
        name: 'Electrify America – Albuquerque Uptown',
        address: 'Uptown Loop Rd NE, Albuquerque, NM 87110',
        network: 'Electrify America',
        stalls: 6,
        maxKw: 350,
        note: "Fork & Fig (5 min drive) is the closest quality option near the Uptown charger. Frontier Restaurant near UNM is the ABQ institution if you want the full local experience. Alt charger: EA @ Coal/Yale Blvd SE if Uptown is busy."
      },

      dining: [
        {
          type: 'New Mexican Diner · Iconic',
          name: 'Frontier Restaurant',
          address: '2400 Central Ave SE, Albuquerque, NM 87106',
          walk: '~10 min drive from EA Uptown; 5 min from Coal/Yale EA',
          hours: 'Daily 5 AM – 12 AM',
          service: 'Counter order, very fast',
          note: "Open since 1971, across from UNM — an ABQ institution. Famous for green-chile breakfast burritos, house-made cinnamon rolls, and generous plates. The John Wayne memorabilia and circa-1971 murals are half the experience."
        },
        {
          type: 'New American · Lunch/Dinner',
          name: 'Fork & Fig',
          address: '6904 Menaul Blvd NE, Albuquerque, NM 87110',
          walk: '~5 min drive from EA Uptown',
          hours: 'Mon–Thu 11 AM – 8 PM; Fri–Sat 11 AM – 9 PM; closed Sun',
          service: 'Fast-casual counter, no freezers or fryers',
          note: "Fresh creative sandwiches and plates made entirely without freezers or fryers — everything prepped daily. Closest quality option to the Uptown EA charger. Light enough to eat before the long I-40 push to Gallup."
        },
        {
          type: 'French-inspired · Upscale Casual',
          name: 'frenchish',
          address: '3509 Central Ave NE, Albuquerque, NM 87106',
          walk: '~12 min drive from EA Uptown',
          hours: 'Wed–Sat 4:30 PM – 8:30 PM',
          service: 'Full table service; reservations recommended',
          note: "Chef Jennifer James's acclaimed bistro in Nob Hill. French-influenced New American with locally sourced seasonal ingredients — one of ABQ's best fine-dining options. Dinner-only, Wed–Sat."
        }
      ],

      history: {
        quick: "The 65-mile I-25 corridor from Santa Fe to Albuquerque crosses El Camino Real de Tierra Adentro — Spain's 1,800-mile royal road from Mexico City — and bisects the ancient turquoise trade network anchored by Kewa (Santo Domingo) Pueblo, whose people mined the Cerrillos Hills for 6,000 years. La Bajada escarpment, a 600-foot basalt cliff 17 miles south of Santa Fe, was the most feared obstacle on the entire Camino Real for three centuries.",
        full: "This stretch of I-25 runs through one of North America's most consequential trade corridors. The Cerrillos Hills just east of the freeway contain turquoise mines worked continuously for roughly 6,000 years — first by Ancestral Puebloans, then by the Kewa people of Santo Domingo Pueblo, whose heishi shell-and-turquoise beadwork traded as far west as the California coast and as far south as central Mexico. When Spanish settlers arrived in 1598 they named their supply route El Camino Real de Tierra Adentro ('Royal Road of the Interior'), and for 300 years every soldier, colonist, and merchant traveling between Mexico City and Santa Fe crossed La Bajada — the volcanic basalt escarpment that drops 600 feet from the Caja del Río plateau to the Santo Domingo Basin. The old road descended via 23 switchbacks with grades up to 28%; it was abandoned in 1932 when a modern alignment was cut. Today I-25 climbs the escarpment on a gentle grade that would have been unimaginable to the muleteers who pushed carts up the old bajada by hand. As the freeway descends toward Albuquerque the Sandia Mountains rise on the left — a billion-year-old granite and limestone fault block uplifted in the last 10 million years as the Rio Grande Rift pulled the Colorado Plateau apart. The pink color that gives the Sandias their name (sandia = watermelon) comes from potassium-feldspar crystals in the 1.45-billion-year-old Sandia granite."
      },

      trivia: [
        "La Bajada means 'The Descent' in Spanish — and the old road lived up to the name. The Camino Real switchbacks here had a 28% grade; fully loaded wagons had to be partially unloaded, lowered by rope, and reloaded at the bottom. The modern I-25 bypass grade is under 5%.",
        "The Cerrillos turquoise mines just east of I-25 have been worked for roughly 6,000 years — making them among the oldest known mines in North America. Aztec artisans in Tenochtitlán used turquoise from these exact hills in their ceremonial mosaics.",
        "The Sandia Mountains are uplifting along the Sandia fault at roughly one millimeter per year — measurably taller today than when the first Spanish colonists saw them in 1540. The fossils at the summit once sat on the floor of a 300-million-year-old tropical sea."
      ],

      scenic: [
        {
          label: 'La Bajada Black Wall',
          detail: "About 17 miles south of Santa Fe, watch the right (west) side of I-25 for the sudden appearance of a jagged black basalt cliff cutting across the horizon. The Caja del Río plateau ends here in a clean volcanic scarp — the old switchback road scar is faintly visible on the face. The view opens southward all the way to the Sandias 50 miles away.",
          icon: '🌋'
        },
        {
          label: 'Sandia Mountain First Full View',
          detail: "Approximately 30 miles south of Santa Fe, as I-25 crosses the Santo Domingo Basin, the full 25-mile face of the Sandia Mountains appears on the left (east). The near-vertical west escarpment rises from the Rio Grande valley floor to 10,678 feet — one of the most dramatic mountain faces visible from any interstate in the Southwest.",
          icon: '⛰'
        },
        {
          label: 'Bosque Green Ribbon',
          detail: "As the freeway drops toward Albuquerque near Bernalillo, look west for the sudden band of brilliant green cottonwood forest lining the Rio Grande. In late May the bosque is at peak leaf — a glowing emerald stripe sandwiched between tan desert on both sides.",
          icon: '🌿'
        }
      ],

      pois: [
        {
          name: 'La Bajada Escarpment Viewpoint',
          coords: { lat: 35.27, lng: -106.195 },
          description: "Roughly 17 miles south of Santa Fe, I-25 crests the Caja del Río plateau and begins its descent over the La Bajada escarpment — a jagged black wall of columnar basalt visible for 20 miles to the south. The old Camino Real switchbacks are still faintly visible on the cliff face just east of the freeway.",
          hook: "For 300 years every wheeled vehicle, mule train, and marching column between Mexico City and Santa Fe had to wrestle their way up 600 feet of 28%-grade switchbacks here — the modern freeway grade makes it almost laughably easy."
        },
        {
          name: 'Kewa (Santo Domingo) Pueblo',
          coords: { lat: 35.512, lng: -106.373 },
          description: "Visible from I-25 at the Santo Domingo exit, Kewa Pueblo has been a center of turquoise jewelry and heishi bead-making for millennia. The nearby Cerrillos Hills contain the oldest continuously mined turquoise deposits in North America — 6,000 years of extraction that supplied trade networks stretching to the Gulf of California.",
          hook: "The turquoise in pre-Columbian artifacts found as far away as Chaco Canyon and Aztec temples almost certainly came from mines within 30 miles of where you're driving right now."
        },
        {
          name: 'Sandia Mountains East Face',
          coords: { lat: 35.21, lng: -106.447 },
          description: "The 10,678-foot Sandia Crest looms over Albuquerque's eastern edge — a nearly vertical 5,000-foot west face of billion-year-old pink granite topped by Pennsylvanian limestone full of marine fossils. The mountains turn a vivid watermelon-pink in the hour after sunset.",
          hook: "The limestone cap on top of the Sandias formed on the floor of a shallow sea 300 million years ago — you can find intact crinoids and brachiopods embedded in the rock at Sandia Crest, thousands of feet above sea level."
        },
        {
          name: 'Old Town Albuquerque',
          coords: { lat: 35.0958, lng: -106.6692 },
          description: "Founded 1706. Spanish colonial plaza, San Felipe de Neri Church, adobe architecture. ~10 min drive from the EA charger. Some of the best green chile in New Mexico within a few blocks.",
          hook: "The plaza has been continuously occupied since 1706 — the adobe church in the corner has been in continuous use longer than the United States has existed."
        }
      ]
    },

    /* ── STAGE 2: Albuquerque → Gallup (I-40 west) ───────────────────────────── */
    {
      id: 2,
      name: 'Albuquerque → Gallup',
      shortName: 'To Gallup',
      distance: 140,
      cumulativeStart: 155,
      startCoords: { lat: 35.1340, lng: -106.5760 },
      endCoords:   { lat: 35.5281, lng: -108.7426 },
      socAtStart: 90,
      socAtEnd: 44,
      socorroWarning: false,
      juliaVisible: false,

      charging: {
        name: 'Electrify America – Gallup',
        address: '1650 W Maloney Ave, Gallup, NM 87301',
        network: 'Electrify America',
        stalls: 4,
        maxKw: 350,
        note: "Earl's Family Restaurant is a few minutes from the charger and has been an I-40 institution for generations. Top off fully here — the Gallup→Flagstaff leg is 175 miles and the longest single stretch on the trip."
      },

      dining: [
        {
          type: 'New Mexican Diner · Historic',
          name: "Earl's Family Restaurant",
          address: '1400 E Historic Hwy 66, Gallup, NM 87301',
          walk: '~5 min drive from EA charger',
          hours: 'Daily 7 AM – 9 PM',
          service: 'Full table service',
          note: "A Gallup institution since 1947, directly on Historic Route 66. Known for New Mexican plates, green chile, generous portions, and Navajo fry bread. Beloved by generations of I-40 road-trippers."
        },
        {
          type: 'Mediterranean · Casual',
          name: 'Oasis Restaurant',
          address: '1280 W Maloney Ave, Gallup, NM 87301',
          walk: '~2 min drive from EA charger',
          hours: 'Mon–Sat 11 AM – 9 PM',
          service: 'Dine-in, takeout',
          note: "Closest sit-down option to the charger. Mediterranean and American menu — good shawarma and gyros alongside New Mexican fare. Something different after days of green chile."
        },
        {
          type: 'American Grill',
          name: "Applebee's Grill + Bar",
          address: '1560 W Maloney Ave, Gallup, NM 87301',
          walk: '~2 min drive from EA charger',
          hours: 'Daily 11 AM – 12 AM',
          service: 'Full table service',
          note: "Reliable chain option adjacent to the charger area. Fast and predictable if you want a quick meal before the long run to Flagstaff."
        }
      ],

      history: {
        quick: "The 140-mile stretch of I-40 west from ABQ to Gallup traces Route 66 through ancient pueblo lands, volcanic badlands, and the trading crossroads of the American Southwest.",
        full: "When U.S. Route 66 was commissioned in 1926, it was largely stitched together from existing dirt roads that had themselves followed older wagon trails — which had followed even older Native American trading paths. This corridor west of Albuquerque was no exception: the Laguna and Acoma Pueblos along the route were established trade centers centuries before the Spanish arrived. The Laguna people have lived continuously at their pueblo since at least 1699; Acoma, perched on its 367-foot mesa, has been occupied since at least 1150 AD and is considered the oldest continuously inhabited community in the United States. The volcanic badlands of El Malpais — 'the badlands' in Spanish — mark where massive lava flows erupted as recently as 3,000 years ago, creating a landscape of jagged basalt and lava tubes that Ancestral Puebloans used for winter shelter. Gallup itself grew as a railroad town in 1881 when the Atlantic & Pacific Railroad reached the area, and the coal mining and trading industries that followed made it a commercial hub for the surrounding Navajo and Zuni nations. Richardson's Trading Post, open since 1913, is still one of the Southwest's preeminent dealers of Navajo rugs and jewelry."
      },

      trivia: [
        "In 1950, a Navajo prospector named Paddy Martinez noticed a yellow stain on a rock near Haystack Mountain, just north of Grants — it turned out to be uranium, the largest deposit in the country at the time. New Mexico became America's top uranium producer, and Grants briefly marketed itself as the 'Uranium Capital of the World.'",
        "El Malpais contains the longest known ice cave in the contiguous United States — Candelaria Ice Cave stays below freezing year-round because cold air sinks into the lava tube in winter and is trapped there by the rock's insulating mass. The ice is estimated to be at least 3,400 years old.",
        "The original 1937 realignment of Route 66 through this stretch largely coincides with the current I-40 corridor — meaning much of what is now I-40 between Albuquerque and Gallup IS the old Route 66 pavement, just widened. The ghost of the 'Mother Road' is literally under your tires."
      ],

      scenic: [
        {
          label: 'Laguna Mission on the Mesa',
          detail: "About 45 miles west of Albuquerque at Exit 114, look north — the white San José Mission church of Laguna Pueblo sits on a low sandstone mesa above the freeway, visible for miles. Built in 1699, it's one of the oldest Spanish mission churches in the U.S. still in continuous use.",
          icon: '⛪'
        },
        {
          label: 'The Black Sea of El Malpais',
          detail: "Around Exit 89, I-40 skirts the northern edge of El Malpais — a massive field of jet-black basalt lava that erupted as recently as 3,000 years ago. The contrast of the dark, churned-up lava against the red-rock mesas beyond is visually striking and completely unlike anything else on this corridor.",
          icon: '🌋'
        },
        {
          label: 'Red Rock Country Into Gallup',
          detail: "The last 20 miles into Gallup the landscape shifts dramatically — tan sandstone gives way to vivid red and orange mesa walls that crowd the highway. This is the edge of Navajo Nation country, and the iron-oxide-rich rock formations signal you're entering a completely different geological and cultural zone.",
          icon: '🏜️'
        }
      ],

      pois: [
        {
          name: 'Rio Puerco Historic Route 66 Bridge',
          coords: { lat: 35.0337, lng: -106.9421 },
          description: "A 1933 Pratt through-truss bridge on Historic Route 66, now preserved as a pedestrian span over the Rio Puerco. One of the few surviving examples of New Deal-era highway bridge design in New Mexico, accessible via a short detour from Exit 140 off I-40.",
          hook: "Built the same year FDR took office — this bridge carried Route 66 traffic for over 50 years before I-40 bypassed it, and it's now a quiet piece of living history on the old alignment."
        },
        {
          name: 'Laguna Pueblo — San José Mission',
          coords: { lat: 35.0391, lng: -107.2543 },
          description: "The white-washed San José de Laguna Mission, built in 1699 on a sandstone mesa above Laguna Pueblo, is one of the oldest continuously active Spanish mission churches in the United States. Visible from I-40 at Exit 114; tribal visitor protocols apply.",
          hook: "The interior murals are among the finest surviving examples of colonial mission art in the American Southwest — and the building has been in continuous liturgical use for over 325 years."
        },
        {
          name: 'Acoma Pueblo — Sky City',
          coords: { lat: 34.8963, lng: -107.5829 },
          description: "Perched 367 feet above the Acoma Plains on a mesa occupied since at least 1150 AD, Acoma is widely considered the oldest continuously inhabited community in the United States. The Sky City tour (from the Acoma Cultural Center at Exit 96 off I-40) is a 30-min detour into one of the most extraordinary places in North America.",
          hook: "People have lived on top of this mesa — hauling water, food, and building materials up by hand — for at least 900 years. The current residents chose to stay."
        },
        {
          name: 'El Malpais National Monument',
          coords: { lat: 34.8842, lng: -107.9951 },
          description: "Vast lava flows, ice caves, and natural arches created by volcanic eruptions spanning 3 million to 3,000 years ago. Contains one of the longest known lava tube systems in North America. The visitor center is at Exit 89 off I-40.",
          hook: "The ice inside Candelaria Ice Cave is at least 3,400 years old, maintained year-round by cold air trapped in the lava tube — you can walk down to it in t-shirt weather outside."
        },
        {
          name: "Richardson's Trading Post — Gallup",
          coords: { lat: 35.5281, lng: -108.7476 },
          description: "One of the oldest and largest trading posts in the Southwest, open since 1913 at 222 W Historic Hwy 66. Still operating as a genuine trader in Navajo rugs, Zuni jewelry, and Pueblo pottery — the inventory of pawn jewelry and handmade goods is staggering.",
          hook: "Unlike tourist gift shops, Richardson's still operates as an active trading post — local Navajo and Zuni artisans bring work here directly, and the back rooms contain museum-quality pieces on working consignment."
        }
      ]
    },

    /* ── STAGE 3: Gallup → Flagstaff (I-40 west) ─────────────────────────────── */
    {
      id: 3,
      name: 'Gallup → Flagstaff',
      shortName: 'To Flagstaff',
      distance: 175,
      cumulativeStart: 295,
      startCoords: { lat: 35.5281, lng: -108.7426 },
      endCoords:   { lat: 35.1983, lng: -111.6513 },
      socAtStart: 90,
      socAtEnd: 22,
      socorroWarning: false,
      juliaVisible: false,

      charging: {
        name: 'Electrify America – Flagstaff',
        address: '2601 E Huntington Dr, Flagstaff, AZ 86004',
        network: 'Electrify America',
        stalls: 6,
        maxKw: 350,
        note: "Black Bart's Steakhouse is 0.6 mi from this charger at the same I-40 interchange — closest full dinner option. Beaver Street Brewery and Macy's Coffee are both ~2.5 miles west in downtown. Charge well here — I-17 to Peoria is still 150 miles, though mostly downhill."
      },

      dining: [
        {
          type: 'Steakhouse · Entertainment',
          name: "Black Bart's Steakhouse & Musical Revue",
          address: '2760 E Butler Ave, Flagstaff, AZ 86004',
          walk: '~0.6 miles from the EA charger (2 min drive or 12 min walk)',
          hours: 'Mon–Sun 5:00 PM – 9:00 PM',
          service: 'Full table service; musical revue begins 5:30 PM',
          note: "The closest full-service restaurant to the EA charger. Server/singers perform Broadway and country numbers tableside while you eat steaks, prime rib, and burgers. Cheesy? Absolutely. Fun? Also yes. Right off I-40 Exit 198."
        },
        {
          type: 'Brewpub · Casual',
          name: 'Beaver Street Brewery',
          address: '11 S Beaver St, Flagstaff, AZ 86001',
          walk: '~2.5 miles west (5 min drive into downtown)',
          hours: 'Mon–Thu 11:30 AM – 9:00 PM; Fri–Sat 11:00 AM – 10:00 PM; Sun 11:00 AM – 9:00 PM',
          service: 'Full table service',
          note: "Flagstaff's anchor brewpub — wood-fired pizzas, hearty sandwiches, and house-brewed ales in a relaxed warehouse space one block from the historic train depot. Good for a longer charging stop."
        },
        {
          type: 'Café · Vegetarian',
          name: "Macy's European Coffeehouse & Bakery",
          address: '14 S Beaver St, Flagstaff, AZ 86001',
          walk: '~2.5 miles west (5 min drive into downtown)',
          hours: 'Mon–Thu 6:00 AM – 2:00 PM; Fri–Sun 6:00 AM – 4:00 PM',
          service: 'Counter order; café pace',
          note: "A Flagstaff institution for 30+ years. Entirely vegetarian menu with excellent espresso, house-baked pastries, and filling grain bowls. If you're rolling through in the morning, this is the move."
        }
      ],

      history: {
        quick: "This 175-mile corridor traces the original spine of Route 66 through the Navajo and Hopi heartland — a stretch geologists call a 'living textbook,' where 225-million-year-old petrified logs, meteorite craters, painted badlands, and sky-high ponderosa pine forests stack up in a single afternoon's drive.",
        full: "The Gallup-to-Flagstaff corridor follows what is arguably the most geologically and culturally dense segment of the old Mother Road. Route 66 was designated here in 1926, threading a trading-post economy that had sustained the Navajo and Puebloan peoples for centuries before the railroad arrived in the 1880s. Window Rock became the administrative seat of the Navajo Nation in 1936 under Commissioner John Collier, giving the largest Native American nation in the U.S. its modern governmental home. Petrified Forest and the Painted Desert had been protected since 1906, when Theodore Roosevelt made them a National Monument; Congress doubled the park's size in 2004. The highway towns of Holbrook and Winslow thrived as Route 66 pit-stops — Holbrook's iconic Wigwam Motel opened in 1950 and is now a National Register landmark — while Two Guns, a murder-riddled tourist trap near Canyon Diablo, peaked in the 1940s and burned out by 1971. Jackson Browne's broken-down car in Winslow inspired 'Take It Easy,' the Eagles' debut single (1972), and put the town on a map it has never left. Flagstaff, perched at 7,000 feet in the world's largest ponderosa pine forest, was Route 66's highest-elevation city and became a science outpost — Clyde Tombaugh discovered Pluto at Lowell Observatory in 1930. I-40 fully replaced Route 66 through Arizona in 1984, but the old highway's ghost is visible at nearly every exit."
      },

      trivia: [
        "Petrified Forest is the only national park that preserves a driveable section of Historic Route 66 — and it's also the only park where theft directly threatens the resource: roughly 12 tons of petrified wood are stolen each year, prompting the park to run a 'Conscience Wood' program where repentant thieves mail stolen pieces back from around the world, often with notes saying the 'bad luck wood' cursed them.",
        "Flagstaff became the world's first International Dark Sky City in 2001, thanks largely to Lowell Observatory's century-old lobbying. In 1930, astronomer Clyde Tombaugh discovered Pluto from Flagstaff using a 13-inch telescope — and when the New Horizons probe flew past Pluto in 2015, a portion of Tombaugh's ashes were aboard.",
        "Meteor Crater is so geometrically perfect that for 50 years after its discovery scientists assumed it was a collapsed volcanic dome — mining entrepreneur Daniel Barringer spent 26 years and his personal fortune trying to drill down to the iron meteorite, not realizing that 90 percent of the impactor vaporized on impact. NASA later used the crater to teach Apollo crews what impact geology looks like from ground level."
      ],

      scenic: [
        {
          label: 'Painted Desert Sunrise Colors',
          detail: "At I-40 Exit 311, the northbound pull-off at the Painted Desert Visitor Center faces a 50-mile sweep of Chinle Formation badlands. In morning light the purples and crimsons are almost unreal — the iron oxide in the mudstones literally glows. Give it five minutes out of the car.",
          icon: '🌅'
        },
        {
          label: 'Petrified Logs in the Desert',
          detail: "Stop at the Crystal Forest pull-off inside Petrified Forest National Park (no fee required to drive through). Gemstone-quality petrified logs — some 100 feet long — lie scattered across open desert exactly where they fell 225 million years ago. The cross-sections of quartz crystal glint in any direction.",
          icon: '💎'
        },
        {
          label: 'San Francisco Peaks Above Flagstaff',
          detail: "As you descend into Flagstaff on I-40 west, the San Francisco Peaks — a collapsed stratovolcano holding Arizona's highest point (Humphreys Peak, 12,633 ft) — appear dead ahead, often snow-capped well into June. The contrast of the high-desert city against genuine alpine peaks is one of the more visually surprising moments on the drive.",
          icon: '🏔️'
        }
      ],

      pois: [
        {
          name: 'Window Rock — Navajo Nation Capital',
          coords: { lat: 35.6703, lng: -109.0573 },
          description: "The seat of the Navajo Nation government, named for a massive 200-foot sandstone arch sacred in Navajo Water Way ceremonies for centuries. The Navajo Nation Museum and the outdoor Veterans Memorial honoring Navajo Code Talkers are both here. 23 miles north of I-40 on AZ-264.",
          hook: "A 23-mile detour north of Gallup lands you at the capital of the largest Native American nation in the U.S. — governed from beneath a stone window that Navajo medicine men have visited for rain ceremonies for generations."
        },
        {
          name: 'Painted Desert — North Entrance Overlook',
          coords: { lat: 35.0835, lng: -109.7886 },
          description: "A sweeping badlands panorama of red, purple, and orange Chinle Formation mudstones, visible from the Painted Desert Visitor Center right off I-40 Exit 311. The colors shift dramatically with the angle of the sun.",
          hook: "The badlands here aren't painted — those hues are real iron oxides, manganese, and carbon baked into 225-million-year-old sediment from a tropical floodplain that once covered Arizona."
        },
        {
          name: 'Petrified Forest National Park',
          coords: { lat: 34.9099, lng: -109.8069 },
          description: "The only national park in the U.S. that contains a preserved section of Historic Route 66, and home to the world's largest concentration of petrified wood. Ancient Triassic-era logs — silica-replaced cell by cell over 225 million years — lie scattered across the desert in rainbow-crystal cross-sections.",
          hook: "These aren't wood anymore — they're quartz. Each 'log' is essentially a giant gemstone, cut open by erosion to reveal rings of amethyst, jasper, and agate."
        },
        {
          name: "Winslow — Standin' on the Corner Park",
          coords: { lat: 35.0242, lng: -110.6973 },
          description: "A compact public park at the corner of Kinsley Ave and 2nd Street commemorating the Eagles' 1972 smash 'Take It Easy,' co-written by Jackson Browne after his car broke down here. Features a bronze troubadour statue, a trompe-l'œil mural, and a 2016-added statue of Glenn Frey.",
          hook: "Winslow installs musical rumble strips on the approach roads that play 'Take It Easy' as you drive over them — the town has fully committed to the bit."
        },
        {
          name: 'Meteor Crater (Barringer Crater)',
          coords: { lat: 35.0281, lng: -111.0232 },
          description: "The best-preserved meteorite impact crater on Earth — 3,900 feet wide and 560 feet deep — formed about 50,000 years ago when a 150-foot iron meteorite traveling 26,000 mph struck the Colorado Plateau. Privately owned, with a rim-top observation deck and interactive museum. Exit 233 off I-40.",
          hook: "NASA trained Apollo astronauts here in the 1960s because this is the closest thing on Earth to a lunar surface — and the crater is so perfectly preserved you can see the uplifted rim layers like a geologic sandwich."
        },
        {
          name: 'Two Guns Ghost Town',
          coords: { lat: 35.3905, lng: -111.4069 },
          description: "A Route 66 roadside ruin perched on the rim of Canyon Diablo. What remains are the burned stone walls of a 1920s zoo, trading post, and fake 'Apache Death Cave' tourist attraction cobbled together by a con man who called himself Chief Two Gun White Calf.",
          hook: "The original owner staged at least one murder on the property, ran a zoo of rattlesnakes and mountain lions, and was eventually run off by a land dispute — the most lawless stretch of 66."
        }
      ]
    },

    /* ── STAGE 4: Flagstaff → Peoria (I-17 south) ────────────────────────────── */
    {
      id: 4,
      name: 'Flagstaff → Peoria',
      shortName: 'To Peoria',
      distance: 150,
      cumulativeStart: 470,
      startCoords: { lat: 35.1983, lng: -111.6513 },
      endCoords:   { lat: 33.7179, lng: -112.3284 },
      socAtStart: 90,
      socAtEnd: 50,
      socorroWarning: false,
      juliaVisible: false,

      charging: {
        name: 'Electrify America – Phoenix Bell Rd (optional top-off)',
        address: '3246 E Bell Rd, Phoenix, AZ 85032',
        network: 'Electrify America',
        stalls: 8,
        maxKw: 350,
        note: "Optional stop ~35 miles before Trilogy. If your SOC is above 35% leaving Flagstaff, you may also skip this and charge at EA @ 5010 N 95th Ave, Glendale (right next to Ric's On 95th bar & grill, ~8 miles from Trilogy)."
      },

      dining: [
        {
          type: 'Italian · Modern Casual',
          name: 'The Sicilian Butcher',
          address: '9780 W Northern Ave #1100, Peoria, AZ 85345',
          walk: '~3 miles from EA @ 5010 N 95th Ave, Glendale',
          hours: 'Sun–Thu 11am–10pm, Fri–Sat 11am–10:30pm',
          service: 'Dine-in, takeout, catering',
          note: "Chef Joey Maggiore's modern-casual Sicilian concept — handmade pasta, charcuterie boards, and a choose-your-own-meatball experience. The most convenient upscale option near Trilogy at Vistancia. Your 'welcome home' dinner."
        },
        {
          type: 'Sports Bar & Grill',
          name: "Ric's On 95th",
          address: '5134 N 95th Ave, Glendale, AZ 85305',
          walk: '~0.1 miles from EA @ 5010 N 95th Ave, Glendale',
          hours: 'Mon–Sat 11am–12am, Sun 10am–12am',
          service: 'Dine-in, takeout, delivery',
          note: "Practically next door to the Glendale EA charger — the plug-in-and-eat option. Local Glendale sports bar with 40+ TVs, handmade pizzas, wings, and burgers. Not a chain, very convenient."
        },
        {
          type: 'Mexican',
          name: 'Corazon de Agave',
          address: '4010 E Bell Rd #102, Phoenix, AZ 85032',
          walk: '~0.8 miles from EA @ 3246 E Bell Rd',
          hours: 'Mon–Thu 11am–10pm, Fri–Sat 11am–11pm, Sun 12pm–7pm',
          service: 'Dine-in, takeout',
          note: "Locally owned 2024 newcomer with a serious following for its carne asada. A genuinely independent spot in a sea of chains along Bell Road — convenient if you stopped at the Bell Rd charger."
        }
      ],

      history: {
        quick: "Interstate 17 plunges nearly 6,000 feet from Flagstaff's ponderosa-pine plateau down through the ancient cliffs of the Mogollon Rim to the Sonoran Desert floor — one of the most dramatic single-highway elevation changes in the lower 48. The road largely follows a stagecoach trail blazed in the 1870s that once took 30 bone-jarring hours to cover the same 150 miles.",
        full: "The corridor linking the Colorado Plateau to the Valley of the Sun has been a travel artery for millennia, used by Sinagua traders, Spanish explorers, and Anglo settlers alike. In March 1878 the first stagecoach line began operating on a rough dirt road between what is now Black Canyon City and Prescott, a journey plagued by Agua Fria River crossings and the occasional highwayman. Construction of what ADOT calls the Black Canyon Freeway began in 1956, but the last 5.4-mile stretch near Camp Verde didn't open until August 1978, completing the route. The highway descends through Carboniferous and Permian limestone and sandstone laid down when this region sat beneath shallow inland seas, slicing past the Mogollon Rim — a 200-mile escarpment that forms the southern edge of the Colorado Plateau — before dropping into the basin-and-range terrain of metropolitan Phoenix. The biological transition is equally dramatic: at roughly mile marker 249 near Black Canyon City, the first giant saguaros appear on the hillsides, announcing the edge of the Sonoran Desert and one of the most biodiverse arid ecosystems on Earth."
      },

      trivia: [
        "The 6,000-foot elevation drop from Flagstaff to Phoenix along I-17 is roughly equivalent to stacking four Empire State Buildings on top of each other — and you drive it in under two hours at freeway speed.",
        "The Mogollon Rim's limestone cliffs were formed from sediments deposited when central Arizona lay beneath a shallow inland sea during the Carboniferous and Permian periods, more than 250 million years ago — long before the dinosaurs.",
        "Before I-17 opened, the stagecoach journey from Phoenix to Prescott via Black Canyon took a grueling 30 hours on a road that crossed the Agua Fria River multiple times; today the same stretch takes about 90 minutes."
      ],

      scenic: [
        {
          label: 'Mogollon Rim Break — The Big Drop Begins',
          detail: "Leaving Flagstaff's ponderosa pine forest, the highway suddenly tilts southward and the Colorado Plateau simply ends — vertical walls of cream-colored Kaibab Limestone frame both sides of the road as the Verde Valley unfolds thousands of feet below. On a clear day you can see 60 miles to the south.",
          icon: '🏔️'
        },
        {
          label: 'Verde Valley Panorama near Camp Verde',
          detail: "After the long descent, the Verde River valley spreads wide and lush around Exit 289 — a rare ribbon of cottonwood green threading through red-rock canyon country. The vivid contrast of red sandstone cliffs, green riparian corridor, and distant blue sky is the Verde Valley at its most cinematic.",
          icon: '🌄'
        },
        {
          label: 'First Saguaros at Black Canyon City',
          detail: "Around mile marker 249, the iconic silhouettes of giant saguaro cacti begin appearing on the rocky hillsides — arms raised as if greeting travelers descending into the desert. This is the Sonoran Desert's calling card, and it means you're less than 40 miles from home.",
          icon: '🌵'
        }
      ],

      pois: [
        {
          name: 'Montezuma Castle National Monument',
          coords: { lat: 34.6116, lng: -111.835 },
          description: "A 20-room, five-story cliff dwelling built by the Southern Sinagua people between roughly 1125 and 1395 AD, perched 90 feet up a sheer limestone cliff above Beaver Creek. One of the first four National Monuments designated by President Theodore Roosevelt in 1906.",
          hook: "One of the best-preserved prehistoric cliff dwellings in North America — and the Aztec emperor it's named for had absolutely nothing to do with it."
        },
        {
          name: 'Montezuma Well',
          coords: { lat: 34.6492, lng: -111.7522 },
          description: "A natural limestone sinkhole 386 feet across that pumps 1.5 million gallons of spring water daily regardless of drought — and harbors five species of aquatic life found nowhere else on Earth. The Sinagua people channeled its outflow for irrigation as far back as the 8th century.",
          hook: "A desert spring so chemically unique — highly carbonated, laced with arsenic — that five animals evolved here and only here, in this one pool."
        },
        {
          name: 'Arcosanti',
          coords: { lat: 34.3639, lng: -112.0986 },
          description: "Paolo Soleri began building this experimental 'arcology' — a fusion of architecture and ecology — on a basaltic mesa near Cordes Junction in 1970, imagining a pedestrian city for 5,000 residents. More than 50 years later, it is roughly 5% complete and remains one of the most thought-provoking built arguments for rethinking how humans inhabit the planet.",
          hook: "Paolo Soleri's half-finished utopia has been under construction for over 50 years — and the incompleteness is part of the point."
        },
        {
          name: 'Mogollon Rim Overlook (~MP 322–290)',
          coords: { lat: 34.7833, lng: -111.650 },
          description: "Driving south from Flagstaff, the highway crests the Mogollon Rim and begins a sustained 6,000-foot plunge through layers of Kaibab Limestone, Coconino Sandstone, and Permian-era rock. The Verde Valley opens below in shades of red, ochre, and green.",
          hook: "You're driving down through 300 million years of geological time — each cliff band is a different chapter."
        },
        {
          name: 'Black Canyon City Saguaro Threshold (~MP 249)',
          coords: { lat: 34.0583, lng: -112.145 },
          description: "Just past the Bumble Bee/Crown King exit, giant saguaro cacti begin dotting the hillsides — the unmistakable biological announcement that you've crossed into the Lower Sonoran Desert. The landscape transforms from piñon-juniper scrub to the iconic Sonoran palette of saguaro, palo verde, and brittlebush.",
          hook: "Watch the exact moment the saguaros appear — it's the desert's way of saying 'welcome to Phoenix's backyard.'"
        }
      ]
    }

  ],

  gruet: [
    {
      city: 'Santa Fe',
      address: '210 Don Gaspar Ave, Hotel St. Francis, Santa Fe, NM 87501',
      phone: 'See website',
      openHour: 11,
      closeHour: [19, 19, 19, 19, 21, 21, 21],
      tockUrl: 'https://www.exploretock.com/gruet-winery-santafe',
      distanceNote: '~10 min drive from EA charger at Herrera Dr',
      tripArrivalNote: 'You stop here ~9:30–10:00 AM',
      wines: 'Blanc de Noirs, Brut, Rosé, Blanc de Blancs',
      note: "In the gorgeous Hotel St. Francis downtown. Opens at 11 AM — you'll be there right around opening if you left Taos at 8. Thu–Sat open until 9 PM on weekends.",
      stageAvailable: [0, 1]
    },
    {
      city: 'Albuquerque',
      address: '8400 Pan American Fwy NE, Albuquerque, NM 87113',
      phone: '(505) 821-0055 ext. 2',
      openHour: 11,
      closeHour: [19, 19, 19, 19, 21, 21, 21],
      tockUrl: 'https://www.exploretock.com/gruet-winery-albuquerque',
      distanceNote: '~15 min drive from EA Uptown charger',
      tripArrivalNote: 'You arrive ABQ ~11:00 AM–12:00 PM',
      wines: 'Blanc de Noirs, Brut, Blanc de Blancs, Demi-Sec',
      note: 'The original winery and tasting room. Good timing — you should arrive ABQ right around opening. Reserve on Tock or call ahead on weekends.',
      stageAvailable: [1, 2]
    }
  ],

  // ── DESTINATION: Peoria / Trilogy at Vistancia ────────────────────────────
  destination: {
    coords: { lat: 33.7179, lng: -112.3284 },
    trilogy: {
      text: "Trilogy at Vistancia — 27980 N Trilogy Blvd, Peoria, AZ 85383. You're home. Taos to Trilogy: 620 miles through the Rio Grande Gorge, the ancient pueblos, Route 66, I-40, and the Mogollon Rim. Not bad for a single day.",
      url: 'https://www.trilogylife.com/communities/vistancia'
    },
    dining: [
      {
        type: 'Italian · Modern Casual',
        name: 'The Sicilian Butcher',
        address: '9780 W Northern Ave #1100, Peoria, AZ 85345',
        walk: '~10 min drive from Trilogy',
        hours: 'Sun–Thu 11am–10pm, Fri–Sat 11am–10:30pm',
        service: 'Dine-in, takeout',
        note: "The welcome-home dinner. Chef Joey Maggiore's Sicilian concept — handmade pasta, charcuterie, and a choose-your-own-meatball experience. The most convenient upscale option near Trilogy at Vistancia."
      },
      {
        type: 'Sports Bar & Grill',
        name: "Ric's On 95th",
        address: '5134 N 95th Ave, Glendale, AZ 85305',
        walk: '~15 min drive from Trilogy',
        hours: 'Mon–Sat 11am–12am, Sun 10am–12am',
        service: 'Dine-in, takeout',
        note: "Local Glendale sports bar practically next door to the Glendale EA charger. 40+ TVs, handmade pizzas, wings, and burgers. If you charged at Glendale, dinner is already sorted."
      },
      {
        type: 'Mexican',
        name: 'Corazon de Agave',
        address: '4010 E Bell Rd #102, Phoenix, AZ 85032',
        walk: '~12 min drive from Trilogy',
        hours: 'Mon–Thu 11am–10pm, Fri–Sat 11am–11pm, Sun 12pm–7pm',
        service: 'Dine-in, takeout',
        note: "Locally owned 2024 newcomer with a serious following for its carne asada. Near the Bell Rd EA charger — convenient if you stopped there on the way in."
      }
    ]
  },

  // ── MILESTONES ─────────────────────────────────────────────────────────────
  milestones: [
    {
      id: 'low-road-gorge',
      type: 'proximity',
      coords: { lat: 36.269, lng: -105.782 },
      radiusMiles: 4,
      icon: '🏜',
      title: 'Rio Grande Gorge',
      detail: "You're in it — 600 feet of basalt carved by a river that's been at this for 2 million years."
    },
    {
      id: 'santa-fe',
      type: 'stage',
      stage: 1,
      icon: '🌵',
      title: 'Santa Fe Charging Stop',
      detail: 'Oldest state capital in the U.S. Gruet tasting room opens at 11 AM downtown.'
    },
    {
      id: 'albuquerque',
      type: 'stage',
      stage: 2,
      icon: '🎈',
      title: 'Albuquerque!',
      detail: 'Hot air balloon capital of the world. The long I-40 push west begins here.'
    },
    {
      id: 'halfway',
      type: 'miles',
      miles: 310,
      icon: '🎉',
      title: 'Halfway Home!',
      detail: '310 miles down. Gallup ahead — charge up for the big I-40 push to Flagstaff.'
    },
    {
      id: 'arizona-border',
      type: 'proximity',
      coords: { lat: 35.0, lng: -109.05 },
      radiusMiles: 4,
      icon: '🌵',
      title: 'Welcome to Arizona!',
      detail: "Petrified Forest and Painted Desert ahead. You're in the home state."
    },
    {
      id: 'meteor-crater',
      type: 'proximity',
      coords: { lat: 35.0281, lng: -111.0232 },
      radiusMiles: 5,
      icon: '☄️',
      title: 'Meteor Crater ahead!',
      detail: 'Exit 233 — the best-preserved impact crater on Earth. 3,900 feet wide. Apollo training ground.'
    },
    {
      id: 'flagstaff',
      type: 'stage',
      stage: 4,
      icon: '🏔️',
      title: 'Flagstaff — Final Charge!',
      detail: "7,000 feet in the world's largest ponderosa pine forest. One big descent left."
    },
    {
      id: 'saguaros',
      type: 'proximity',
      coords: { lat: 34.0583, lng: -112.145 },
      radiusMiles: 3,
      icon: '🌵',
      title: 'First Saguaros!',
      detail: "The Sonoran Desert is welcoming you home. Trilogy is less than 40 miles away."
    },
    {
      id: 'home-arrival',
      type: 'proximity',
      coords: { lat: 33.7179, lng: -112.3284 },
      radiusMiles: 4,
      icon: '🏠',
      title: 'Welcome Home!',
      detail: 'Taos to Trilogy. You made it.'
    }
  ]
};
