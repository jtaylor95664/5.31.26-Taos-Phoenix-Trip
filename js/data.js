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
        "The Rio Grande Gorge is not carved into the Rocky Mountains — it's cut through a flat basalt plateau. The river saws downward through lava flows faster than the surrounding land rises, meaning the gorge gets slightly deeper every year.",
        "The Rio Grande doesn't carve its gorge at a steady rate — it cuts in pulses tied to glacial cycles. During ice ages, glacial meltwater loaded with coarse Rocky Mountain grit acted like liquid sandpaper, carving deeper; during warm interglacials the reduced sediment load allowed vertical cutting to pause. The gorge's deepest sections record the most intense glacial cycles of the last 800,000 years.",
        "The Servilleta basalt forming the Taos Plateau is tholeiitic — a low-silica, low-viscosity volcanic rock chemically identical to lava erupting at mid-ocean ridges today. Its fluidity when molten let it spread in flat sheets across the plateau rather than piling into steep cones. The result was a lava plain so flat that early Spanish settlers didn't realize they were crossing an ancient volcanic field.",
        "The Embudo Fault running through the valley near Dixon accumulates seismic strain at roughly 0.15 millimeters per year — slower than fingernails grow. But multiplied across 5 million years of rift activity, that rate represents the cumulative displacement that dropped the Española Basin floor thousands of feet below the surrounding plateau."
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
        },
        {
          name: 'Pilar Cliffs Pullout',
          coords: { lat: 36.1381, lng: -105.8247 },
          description: "The stretch of NM-68 through Pilar sits at the base of some of the gorge's most dramatic basalt walls, where multiple stacked Servilleta lava flows are visible as distinct horizontal bands. Each band is a separate eruption separated by thousands of years; the lighter recesses between them are ancient soil horizons — briefly colonized by plants between flows before the next eruption buried everything.",
          hook: "You're reading a 3-million-year volcanic diary in the cliff wall — each dark stripe is a different lava flow, each lighter layer between them was once a ground surface where something actually grew."
        },
        {
          name: 'Velarde Landslide Reach',
          coords: { lat: 36.1705, lng: -105.9012 },
          description: "Between Velarde and Embudo the gorge walls display multiple large landslide scars where blocks of basalt broke free from the gorge rim and tumbled to the river below. The fan-shaped debris piles at the cliff bases are geologically fresh — many slides occurred within the last 10,000 years as post-glacial warming destabilized cliff bases saturated by higher river levels.",
          hook: "Those smooth curved scars above the highway aren't erosion — entire cliff sections broke loose and slid into the river. Several of these collapses happened within the last few thousand years."
        },
        {
          name: 'Black Mesa Overlook',
          coords: { lat: 35.9895, lng: -106.0741 },
          description: "Black Mesa is a lava-capped highland southwest of Española, visible from NM-68/I-84 near the valley. It's a geological remnant — the surrounding land has been lowered by erosion while the hard basalt cap preserved this section at its original elevation. The mesa's dark profile against lighter sedimentary terrain marks the spatial extent of an ancient Cerros del Rio lava flow.",
          hook: "That flat-topped dark mesa is what the whole valley floor used to look like before 3 million years of erosion lowered everything around it — it's a geological island stranded at its original elevation."
        }
      ],

      geology: {
        quick: "You're driving down through 5 million years of volcanic lava and a live rift tearing the continent apart.",
        full: "The landscape visible from NM-68 is the surface expression of one of the largest active continental rifts in the world. The Rio Grande Rift — a zone where the North American plate is being pulled apart along a north-south axis — extends 1,000 miles from central Colorado to El Paso, and the gorge you're descending into is its most photogenic scar. Rifting began roughly 29 million years ago as Basin and Range extension propagated northward. The Taos Plateau volcanic field, which poured the Servilleta basalt across the surrounding landscape between 5 and 2 million years ago, is a direct consequence of this rifting: as the crust thinned and stretched, mantle-derived magma punched through along fault zones, flooding the plateau with lava flows stacked hundreds of feet thick. The basalt is tholeiitic — low in silica, highly fluid when erupted — which is why the flows spread as flat, extensive sheets rather than piling up as steep cones.\n\nThe gorge itself began forming in earnest about 1–2 million years ago when the ancestral Rio Grande integrated into a single connected river system. Before that, drainage was broken into disconnected basins; once connected, the river had the hydraulic energy to slice through the basalt at a measurable rate. Incision is not steady — it occurs in pulses tied to glacial cycles in the upstream Rockies. During ice ages, glacial outwash loaded the river with coarse sediment that acted as an abrasive slurry; between ice ages, reduced sediment loads allowed vertical cutting to pause. The current gorge depth of up to 800 feet reflects roughly 1 million years of this pulsed cutting.\n\nThe Pilar Cliffs expose nearly the full stratigraphic column of Servilleta basalt flows — each discrete flow visible as a slightly different band of rock separated by ancient soil horizons, each horizon representing a pause in volcanic activity long enough for weathering and plant growth to occur. The Embudo Fault, which runs parallel to the Rio Grande through the valley, is part of the rift's active fault system, accumulating strain at roughly 0.15 millimeters per year. The terraces visible above the current river level near Velarde and Embudo are abandoned floodplains, stranded at successively higher elevations as the river cut downward — each terrace a former valley floor, the river's incision history written in alluvium and basalt."
      },

      nature: {
        quick: "Desert bighorn sheep cling to 800-foot basalt cliffs while cottonwoods explode green along the Rio Grande below.",
        full: "Leaving Taos, NM-68 descends from a sagebrush-covered volcanic plateau near 6,900 feet before plunging into the Rio Grande Gorge — an 800-foot-deep gash through ancient basalt flows. The plateau's dominant plant community is big sagebrush (Artemisia tridentata), a cold-adapted shrub that carpets millions of acres wherever soils are deep and winters are freezing. As the road drops into the gorge near Pilar, the ecology pivots dramatically: you're now in a sheltered riparian corridor where temperature, soil moisture, and wind exposure are entirely different from the rim above. Fremont cottonwoods (Populus fremontii) crowd the riverbanks, their roots tapping perennial water, and in late May they're releasing enormous clouds of cottony seed — a seasonal 'blizzard' visible from the road. Canyon walls above support sparse piñon pine and one-seed juniper clinging to basalt ledges.\n\nThe gorge from Pilar south to Embudo is prime wildlife habitat precisely because of its inaccessibility. Desert bighorn sheep — reintroduced in 2006–2007 and now numbering around 400 animals — are regularly seen on the cliff faces directly from NM-68. Early morning is best, before the animals retreat into shadow. Peregrine falcons nest in the vertical basalt walls; late May is when adults are actively provisioning newly hatched chicks — watch for fast, stooping silhouettes over the river. The American dipper, North America's only truly aquatic songbird, bobs perpetually on mid-river rocks, walking underwater to forage. Golden eagles soar the rim thermals. By Embudo the canyon opens and fruit orchards — apple, peach, and plum — appear alongside the river, many still holding late blooms in the cool valley air.\n\nThis segment is biologically distinct from the Santa Fe–Albuquerque I-25 corridor: the Rio Grande Gorge is a deep, sheltered rift that creates its own microclimate, concentrating riparian biodiversity in a narrow ribbon surrounded by high-desert upland. The I-25 corridor south of Santa Fe follows the broader Middle Rio Grande valley — lower elevation, hotter, drier, dominated by saltbush scrub and creosote. The gorge near Pilar supports bighorn sheep and American dippers that simply don't occur in the flatter southern valley.\n\nIn late May the gorge is at peak biological activity. Canyon wrens sing cascading songs from the cliff faces — their descending trill is the voice of the gorge. Bullock's orioles, newly arrived from Mexican wintering grounds, flash brilliant orange against the cottonwood canopy at Orilla Verde and Pilar. Collared lizards emerge from basalt crevices to bask on sun-warmed rocks mid-morning. Above Dixon and Rinconada the road climbs back into piñon-juniper woodland — the scent of juniper and sage signaling the transition out of the gorge ecosystem and into the upland plateau toward Santa Fe.",
        species: [
          { name: "Desert Bighorn Sheep (Ovis canadensis)", type: "mammal", note: "Look for them on the sheer basalt cliffs above NM-68 between Pilar and Orilla Verde, most visible before 9 a.m. when they descend to lower ledges." },
          { name: "Fremont Cottonwood (Populus fremontii)", type: "plant", note: "First appears as a dense green corridor at Pilar and lines the river through Embudo — late May brings peak cottony seed release visible as drifting white clouds." },
          { name: "Peregrine Falcon (Falco peregrinus)", type: "bird", note: "Nests on vertical basalt walls between Pilar and Orilla Verde; late May is active chick-feeding season — watch for fast, direct flight low over the river." },
          { name: "American Dipper (Cinclus mexicanus)", type: "bird", note: "Year-round resident; spot them bobbing on exposed rocks or plunging into the Rio Grande current at any wide, shallow section between Pilar and Embudo." },
          { name: "Canyon Wren (Catherpes mexicanus)", type: "bird", note: "Heard more than seen — its cascading, descending trill is the signature sound of the basalt cliffs from Pilar through Rinconada." },
          { name: "Bullock's Oriole (Icterus bullockii)", type: "bird", note: "Newly arrived from Mexico by late May; brilliant orange males flash against cottonwood canopy at Orilla Verde and riverside groves near Embudo and Dixon." },
          { name: "Big Sagebrush (Artemisia tridentata)", type: "plant", note: "Dominates the Taos Plateau before the road drops into the gorge — smell the resinous fragrance through open windows in the morning." },
          { name: "Collared Lizard (Crotaphytus collaris)", type: "reptile", note: "Active basker on sun-warmed basalt boulders in the gorge from mid-morning onward; look for them near Pilar and south of Orilla Verde." },
          { name: "Golden Eagle (Aquila chrysaetos)", type: "bird", note: "Soars thermal columns above the canyon walls — scan the sky above the cliffs between the Taos Junction Bridge and Pilar." }
        ]
      }
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
        "The Sandia Mountains are uplifting along the Sandia fault at roughly one millimeter per year — measurably taller today than when the first Spanish colonists saw them in 1540. The fossils at the summit once sat on the floor of a 300-million-year-old tropical sea.",
        "The Albuquerque Basin contains up to 14,000 feet of Cenozoic sediment. If you drilled straight down from Albuquerque's downtown you wouldn't hit Precambrian basement rock for nearly three miles. The city is built on its own eroded debris, compacted over 25 million years.",
        "The Sandia summit spans 1.1 billion years of Earth history in a single cliff face: the pink granite base is 1.45 billion years old, and the Pennsylvanian limestone resting directly on it is just 310 million years old — with over a billion years of geological record simply missing between them. This gap is one of the most dramatic unconformities in North America.",
        "The La Bajada basalt escarpment was quarried for building stone from colonial times through the 20th century — the dark volcanic rock in the walls of several Santa Fe historic buildings came from the cliff face you're driving past. The quarry scars are still visible on the escarpment's northern end if you know where to look."
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
        },
        {
          name: 'La Bajada Escarpment — South Viewpoint',
          coords: { lat: 35.5452, lng: -106.1312 },
          description: "A southbound pullout at the base of the La Bajada escarpment provides a different perspective than the rim viewpoint — looking back up at the full 600-foot black basalt wall, with the breadth of the Santo Domingo Basin visible ahead all the way to the Sandia Mountains. The full scale of this geological barrier is most apparent from this lower vantage.",
          hook: "Look back north from here and you can see the full wall that stopped El Camino Real traffic for 300 years — from this angle it's clear why carts had to be partially dismantled and lowered by rope."
        },
        {
          name: 'Tetilla Peak',
          coords: { lat: 35.6271, lng: -106.1589 },
          description: "Tetilla Peak (6,700 ft) is an isolated volcanic neck visible west of I-25 near La Bajada — the eroded remnant of a magmatic intrusion that punched through basin sediments. The surrounding softer rock has been stripped away over millions of years, leaving the harder volcanic core standing alone as a distinctive cone-shaped summit.",
          hook: "That conical peak rising from the flat basin to the west is a volcanic plug — the solidified interior of a vent whose surrounding material eroded away, leaving the hardest part standing alone like a geological tombstone."
        },
        {
          name: 'Albuquerque Volcanoes (West Mesa Cinder Cones)',
          coords: { lat: 35.1581, lng: -106.7341 },
          description: "Five cinder cones on Albuquerque's West Mesa, part of Petroglyph National Monument, erupted between 156,000 and 40,000 years ago — geologically contemporaneous with early Homo sapiens in Africa. They're classified dormant (not extinct) by the USGS. More than 20,000 Ancestral Puebloan petroglyphs are incised into the volcanic boulders at their base.",
          hook: "Albuquerque has its own volcanic field on the city's western edge — and 20,000 ancient rock art petroglyphs at the base of the cones suggest people watched and contemplated these volcanoes very carefully."
        }
      ],

      geology: {
        quick: "A fault-bounded ancient lake basin, a volcanic clifftop, and mountains that rose a mile in ten million years flank every mile of I-25.",
        full: "The 65-mile I-25 corridor from Santa Fe to Albuquerque passes through the central section of the Albuquerque Basin — the largest and best-studied of the many fault-bounded basins making up the Rio Grande Rift. The basin is invisible as a surface feature; most of it lies buried under 14,000 feet of Cenozoic sediment accumulated as the rift subsided over 25 million years. This sediment is the detritus of the surrounding mountains — alluvial fans of sand, gravel, and silt shed off the Sandia, Manzano, and Jemez ranges as the basins dropped and the ranges rose. The pile is so thick that the actual basement rock lies nearly three miles below Albuquerque's streets. The city is built on its own sedimentary debris.\n\nLa Bajada escarpment, about 17 miles south of Santa Fe, marks the boundary between the Española Basin and the Albuquerque Basin — a distinct rift step controlled by a northeast-trending transfer fault system. The basalt cap of the Caja del Río plateau, erupted 3–2.5 million years ago from vents to the west, is responsible for the escarpment's sheer dark face: harder than the underlying sediment, it breaks off in columnar slabs as softer rocks below erode. La Bajada was historically quarried for building stone — dark volcanic rock in the walls of several Santa Fe historic buildings came from this escarpment.\n\nThe Sandia Mountains, dominating the eastern skyline as you approach Albuquerque, are the most dramatic expression of rift-related uplift in New Mexico. The Sandia fault on their western flank has lifted the range for roughly 10 million years while the Albuquerque Basin dropped to the west — a see-saw motion driven by crustal extension. Total displacement is roughly 25,000 feet. The pink color of the granite — sandia means watermelon — comes from potassium-feldspar crystals in the 1.45-billion-year-old core. The Pennsylvanian limestone cap at the summit, full of marine fossils from a 300-million-year-old tropical sea, rests directly on Precambrian granite with 1.1 billion years of geological record missing between them. This unconformity is one of the most dramatic time gaps in exposed rock in North America. West Mesa's five cinder cones, visible on the left as the freeway approaches Albuquerque, erupted as recently as 40,000 years ago — the rift's most recent volcanic expression in this area, contemporaneous with early humans elsewhere on the planet."
      },

      nature: {
        quick: "Late May cottonwood fluff drifts like snow through the Rio Grande bosque as you descend into Albuquerque.",
        full: "Leaving Santa Fe around mile marker 271, the highway immediately enters classic piñon-juniper woodland — two-needle piñon pine (Pinus edulis) and one-seed juniper (Juniperus monosperma), the signature trees of the Colorado Plateau's lower montane skirts at 6,500–7,000 feet. This woodland persists on rocky bajadas flanking the Caja del Rio plateau because the soils are thin and stony, supporting just enough winter moisture for these slow-growing conifers. Scattered shrubs of Apache plume (Fallugia paradoxa) bloom white here in late May, their feathery seed plumes already forming.\n\nNear mile marker 259, the highway crests and plunges down the La Bajada escarpment — a 600-foot volcanic basalt drop that marks one of the sharpest vegetational fault lines in central New Mexico. Below the escarpment, roughly from mile 255 south through the Santo Domingo Basin, the piñon-juniper suddenly gives way to Chihuahuan Desert grassland. The reason is stark: lower elevation (5,500–5,800 ft), coarser sandy alluvial soils, and a rain-shadow effect off the Jemez Mountains. Black grama and blue grama become the matrix grasses, with scattered cholla cactus, soaptree yucca, four-wing saltbush, and rabbitbrush. Brilliant orange globe mallow (Sphaeralcea incana) blooms prolifically along roadsides through this zone in late May — look for it between exits 259 and 248.\n\nApproaching Bernalillo near mile 240, the terrain transitions again as I-25 bends toward the Rio Grande floodplain. The bosque — the 300-mile ribbonwood of Fremont cottonwood and Gooding's willow along the river — becomes visible from the highway. In late May this is peak cottonwood seed release: white cottony fluff fills the air and drifts across the road in visible clouds, a phenomenon locals liken to a summer snowstorm. The cottonwoods are fully leafed in bright green, the most lush, vivid band in the landscape.\n\nThis segment compresses more elevational variety than any other stage — from piñon forest through desert grassland to riparian bosque in 65 miles — making it ecologically the most complex of the New Mexico stages. The shift at La Bajada is as abrupt as a switch being thrown: one mile you're in a conifer woodland, the next you're in desert scrub. Look back at the escarpment from below and you can see the vegetation boundary running along the rock — piñon-juniper on top, grassland immediately below.",
        species: [
          { name: "Piñon Pine (Pinus edulis)", type: "plant", note: "Dominant on both sides of I-25 from Santa Fe south to roughly mile 260, just before the La Bajada descent; look for its compact, round crown and short paired needles." },
          { name: "Apache Plume (Fallugia paradoxa)", type: "plant", note: "Blooms white in late May on rocky slopes of the La Bajada escarpment around mile 259; by June its feathery pink seed plumes become equally showy." },
          { name: "Scarlet Globe Mallow (Sphaeralcea incana)", type: "plant", note: "Brilliant orange-red blooms line highway shoulders through the Santo Domingo Basin grassland between exits 259 and 248, peaking in late May." },
          { name: "Fremont Cottonwood (Populus fremontii)", type: "plant", note: "The bright green bosque ribbon becomes visible near Bernalillo (exit 242); in late May cotton-white seed fluff drifts visibly across the highway." },
          { name: "Western Meadowlark (Sturnella neglecta)", type: "bird", note: "Watch for this yellow-breasted songbird on fence posts through the Santo Domingo Basin grassland between miles 248 and 255; breeding males sing loudly in late May." },
          { name: "Greater Roadrunner (Geococcyx californianus)", type: "bird", note: "New Mexico's state bird; look for it sprinting across open ground in the grassland zone south of La Bajada, roughly miles 240–258." },
          { name: "Soaptree Yucca (Yucca elata)", type: "plant", note: "Tall cream-colored flower stalks rise 5–10 feet from the sandy basin floor in the Santo Domingo area near exit 252; blooms peak in late May through June." },
          { name: "Great Blue Heron (Ardea herodias)", type: "bird", note: "Stands motionless in Rio Grande shallows near Bernalillo (exit 242) and the Albuquerque bridge crossings; easily spotted from the highway." },
          { name: "Red-tailed Hawk (Buteo jamaicensis)", type: "bird", note: "Year-round resident soaring above both piñon-juniper and desert grassland zones along the entire corridor; most visible over open grassland updrafts in the Santo Domingo Basin." }
        ]
      }
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
        "The original 1937 realignment of Route 66 through this stretch largely coincides with the current I-40 corridor — meaning much of what is now I-40 between Albuquerque and Gallup IS the old Route 66 pavement, just widened. The ghost of the 'Mother Road' is literally under your tires.",
        "The McCarty's lava flow near Grants is the youngest lava flow in New Mexico, erupted approximately 3,000 years ago — within human memory. Ancestral Puebloan peoples witnessed the eruption; oral traditions among several Pueblo tribes describe it. The flow's surface is so fresh it still retains the ropy texture of pahoehoe lava, without enough time to develop significant soil cover.",
        "Mount Taylor (Navajo: Tsoodził) erupted between 3.3 and 1.6 million years ago — recent enough that the mountain would have been recognizable to the first humans entering the Southwest. Its 11,301-foot summit rises from a plateau already 6,500 feet high, making it one of the dominant landmarks visible for over 100 miles in any direction.",
        "The Continental Divide at Exit 53 near Thoreau separates the world's two largest ocean drainage basins. A raindrop falling one inch east travels roughly 2,000 miles to the Gulf of Mexico via the Puerco, Rio Grande, and Mississippi. One inch west, that same drop heads to the Little Colorado, the Colorado River, and the Gulf of California — a completely different 1,500-mile journey. The entire continent's hydrology pivots on a gentle ridge in the Zuni Mountains."
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
        },
        {
          name: 'Mount Taylor (Tsoodził)',
          coords: { lat: 35.2724, lng: -107.6158 },
          description: "At 11,301 feet, Mount Taylor is one of the four sacred mountains defining the boundaries of the Navajo homeland (Dinétah) and active as a stratovolcano between 3.3 and 1.6 million years ago. Its symmetrical cone is visible from I-40 for nearly 60 miles. The 1950 uranium discovery north of here briefly made the Grants area the 'Uranium Capital of the World.'",
          hook: "Sacred to the Navajo as the southern directional mountain of their homeland — and 50 years ago, the surrounding area was the center of America's uranium mining industry after the largest domestic uranium deposit was found just north of here."
        },
        {
          name: 'Continental Divide — Exit 53, Thoreau NM',
          coords: { lat: 35.4031, lng: -108.3390 },
          description: "At Exit 53 near Thoreau, I-40 crosses the Continental Divide at 7,275 feet in the Zuni Mountains — a gentle saddle that is hydrologically absolute. Everything east of this point drains to the Gulf of Mexico; everything west drains to the Gulf of California. The Zuni Mountains here expose Precambrian basement rocks arching to the surface through younger sedimentary layers.",
          hook: "One raindrop landing here has two entirely different 2,000-mile ocean journeys available depending on which side of the road it hits. The whole continent's hydrology pivots on this quiet Zuni Mountains ridge."
        },
        {
          name: 'Acoma Mesa Geology Viewpoint',
          coords: { lat: 34.9500, lng: -107.5700 },
          description: "Acoma Mesa is a classic Colorado Plateau butte: a hard Cretaceous Mesa Verde sandstone cap protecting softer Triassic and Jurassic rocks below from erosion. The 367-foot cliff faces expose 200 million years of Colorado Plateau stratigraphy in one vertical wall — Mesa Verde Sandstone, Morrison Formation shales, Entrada Sandstone, and Chinle Formation reading top to bottom.",
          hook: "The Acoma people chose this mesa's top around 1150 AD because its geology made it a natural fortress. The same erosion-resistant caprock that's kept the cliffs vertical for millions of years has been protecting its residents for nearly 900 years."
        },
        {
          name: 'Grants Lava Flow Viewpoint (McCarty\'s Flow)',
          coords: { lat: 35.1760, lng: -107.9800 },
          description: "North of I-40 east of Grants, the McCarty's lava flow — the youngest lava flow in New Mexico at approximately 3,000 years old — stretches across the desert with glassy pahoehoe textures still intact. A BLM pullout near Grants provides a close view of jet-black basalt that erupted while ancient Puebloans watched.",
          hook: "This lava erupted roughly 3,000 years ago — contemporaneous with Tutankhamun's Egypt. It's so fresh it hasn't developed soil cover, and the ropy lava-surface texture looks like it cooled last week."
        },
        {
          name: 'Zuni Mountains — Ancient Basement Roadcuts',
          coords: { lat: 35.2000, lng: -108.5000 },
          description: "I-40 cuts through the Zuni Mountains near Thoreau, exposing roadcuts of 1.6–1.7-billion-year-old Precambrian granite and metamorphic basement — some of the oldest visible rock on the entire trip. The Zuni Mountains are an anticlinal arch in the Colorado Plateau where the ancient basement has arched upward through its sedimentary cover.",
          hook: "The roadcuts through the Zuni Mountains expose rock that was already ancient before the Cambrian — before complex multicellular life existed. You're cutting through the foundation that everything else in the Southwest was built on top of."
        }
      ],

      geology: {
        quick: "I-40 west from ABQ to Gallup is 140 miles of tectonic boundary-crossing — from a rift valley through ancient volcanic badlands into the tabletop mesa world of the Colorado Plateau.",
        full: "The drive west from Albuquerque on I-40 is one of the great geological transects in North America, crossing the boundary between two fundamentally different tectonic provinces within the first 50 miles. Near Albuquerque you're in the Rio Grande Rift — continental crust being actively stretched, faulted, and thinned. By the Rio Puerco bridge (Exit 140) you're crossing onto the Colorado Plateau — a roughly Texas-sized block of crust that has remained tectonically stable for 600 million years, resisting the faulting and stretching that has fragmented everything around it. The boundary is a 20–30-mile-wide transitional zone; from the car you'll notice the mesas getting taller, flatter, and more regular, the valleys less chaotic, and the rock layers increasingly horizontal.\n\nThe first major geological landmark west of Albuquerque is Mount Taylor — a stratovolcano active 3.3 to 1.6 million years ago, rising to 11,301 feet on a plateau already 6,000 feet high. Its lava flows reached I-40; the dark volcanic rock in roadcuts west of the Rio Puerco is partly Mount Taylor's product. South of I-40, the Acoma Plateau is capped by Cretaceous Mesa Verde sandstones creating the distinctive flat-topped mesa geometry. Acoma Pueblo's 367-foot mesa is this geology exactly — harder sandstone protecting softer Triassic and Jurassic layers below, creating a natural fortress occupied for nearly 900 years.\n\nThe El Malpais volcanic field around Grants covers 1,300 square miles with eruption ages spanning from 3 million to just 3,000 years ago. The McCarty's Flow north of I-40 is the youngest lava in New Mexico — so fresh it still has glassy pahoehoe surface texture with no soil development. Ancient Puebloans witnessed this eruption and oral traditions describe it.\n\nThe Continental Divide crosses I-40 at Exit 53 near Thoreau at 7,275 feet — geographically unspectacular but hydrologically absolute. A raindrop falling east of the divide will eventually reach the Gulf of Mexico; one inch west, the Gulf of California. The Zuni Mountains here are an anticlinal arch in the plateau where 1.7-billion-year-old Precambrian basement arches to the surface through its sedimentary cover — some of the oldest rock visible on the entire trip. The vivid red and orange iron-oxide hues of the Chinle and Mesaverde formations in the final 40 miles into Gallup signal the decisive transition: you are now fully on the Colorado Plateau, about to drive across its interior."
      },

      nature: {
        quick: "Black lava fields near Grants erupt with claret cup cactus blooms in late May — fire-red flowers on jet-black rock.",
        full: "Leaving Albuquerque, the Rio Grande bosque and Basin and Range scrub give way almost immediately to a rising plateau. West of the city, I-40 climbs from roughly 5,300 feet into the 6,000-foot range, and the shift is visible through the windshield: sparse creosote-saltbush flats of the Rio Grande Rift are replaced by a thickening mosaic of two-needle piñon pine and one-seed juniper — the signature canopy of the Colorado Plateau. The change is driven by three factors: elevation gain, a shift from the rain-shadow interior of the rift to the slightly better-watered plateau, and the change in substrate from alluvial fans to volcanic and sedimentary bedrock. By Laguna Pueblo the landscape has an unmistakably plateau quality: gray-green trees spaced across ruddy mesas, with blue grama and galleta grass filling the gaps. North of the highway, the pale cone of Mount Taylor (11,306 ft) presides over the scene, its lower flanks cloaked in ponderosa pine and Gambel oak, its upper reaches in spruce-fir.\n\nThe biological high point of this segment is the El Malpais lava field. In late May the black basalt is far from lifeless: prickly pear, claret cup cactus, and cane cholla colonize every crack where volcanic soil has accumulated, and claret cup blooms — vivid scarlet tubes — are among the most striking sights of any New Mexico spring drive. More remarkable are the kipukas: isolated patches of pre-lava soil surrounded by the youngest flows, acting as ecological islands preserving old-growth Rocky Mountain Douglas fir. The lava tubes shelter bats, and above ground the rough terrain is prime habitat for golden eagles, prairie falcons, and American kestrels, all actively nesting in late May. Greater roadrunners dash along the highway shoulders, especially in warmer mid-morning hours.\n\nThe Continental Divide crossing near Thoreau (elevation 7,275 ft) marks a subtle but real biological seam: west of the Divide, the sagebrush component increases noticeably — big sagebrush and sand sage become visible in the juniper understory as Pacific moisture patterns begin to dominate. Pronghorn, largely absent in the volcanic badlands, reappear in the open flats west of Thoreau as the terrain flattens toward Gallup. Does may have fawns hidden nearby in late May.\n\nThis corridor is ecologically distinct from I-25 south (hotter, lower, Chihuahuan Desert) and from the next Gallup–Flagstaff segment, which drops into the true Colorado Plateau canyon world where Utah juniper largely replaces one-seed juniper. This middle segment uniquely combines volcanic drama, a sky-island mountain, and a genuine transition forest in a single 140-mile drive — and the kipukas of El Malpais are among the most fascinating ecological features on the entire route.",
        species: [
          { name: "Two-needle Piñon (Pinus edulis)", type: "plant", note: "The defining tree of the entire segment; becomes dense and continuous just west of Albuquerque, filling every mesa slope from the Rio Puerco valley to Gallup." },
          { name: "Claret Cup Cactus (Echinocereus triglochidiatus)", type: "plant", note: "Peak bloom in late May; the most vivid roadside color on this segment, especially on the black lava edges of El Malpais south of Grants near mileposts 85–100." },
          { name: "Golden Eagle (Aquila chrysaetos)", type: "bird", note: "Actively nesting adults soar over the El Malpais lava fields and sandstone mesa edges near Grants; watch for them riding thermals mid-morning." },
          { name: "Swainson's Hawk (Buteo swainsoni)", type: "bird", note: "A late-May arrival back from South America; scan open grassland flats between Albuquerque and Laguna and again west of the Continental Divide near Thoreau." },
          { name: "Pinyon Jay (Gymnorhinus cyanocephalus)", type: "bird", note: "Raucous flocks move through the piñon-juniper canopy throughout the segment; listen for nasal calls at rest stops and look for cobalt-blue birds flying low over treetops." },
          { name: "Pronghorn (Antilocapra americana)", type: "mammal", note: "Small bands appear in open flats west of Thoreau as sagebrush grassland opens up approaching Gallup; does may have fawns hidden nearby in late May." },
          { name: "Narrow-leaf Yucca (Yucca angustissima)", type: "plant", note: "Tall creamy flower stalks conspicuous throughout the lower piñon-juniper zone in late May, visible from the highway shoulder between Laguna and Grants." },
          { name: "Western Meadowlark (Sturnella neglecta)", type: "bird", note: "Singing from fence posts along virtually every open mile in late May; its bright yellow breast and flute-like call are the sonic signature of this stretch of I-40." },
          { name: "Mule Deer (Odocoileus hemionus)", type: "mammal", note: "Most reliably spotted at dawn or dusk grazing piñon-juniper edges along the Rio Puerco valley west of Albuquerque and mesa benches south of Mount Taylor." }
        ]
      }
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

      geology: {
        quick: "One corridor, 300 million years of stacked rock: Triassic badlands, petrified gemstone logs, a meteorite scar, and a volcanic field still waking up.",
        full: "The Gallup-to-Flagstaff corridor sits almost entirely on the Colorado Plateau — a roughly Texas-sized block of continental crust that has resisted the stretching and faulting that warped most of the surrounding West. About 600 million years ago, the basement rocks here were welded into a stable craton; ever since, sediment has accumulated on top in near-horizontal layers, like a stack of pancakes. Tectonic uplift — driven by the same forces that opened the Rio Grande Rift to the east — raised the whole platform roughly a mile above sea level over the last 10–20 million years without tilting or folding the layers significantly. The result is the landscape you see through the windshield: flat-topped mesas, ruler-straight rock bands in the canyon walls, and a sense that you're driving across a tilted dinner plate rather than through a mountain range. Every cliff face along I-40 is essentially a cross-section of that plate, reading from oldest (bottom) to youngest (top).\n\nThe most visually dominant rocks between Gallup and Holbrook are the reds, purples, oranges, and grays of the Chinle Formation — Triassic sediment, roughly 200–225 million years old, laid down when Arizona sat at roughly 10 degrees north latitude, straddling the equator. Think monsoon-drenched tropical floodplain: wide, meandering rivers dropping sediment across a broad coastal plain as Pangaea was beginning to rift apart. The color palette is a chemistry lesson. Red and orange tones come from hematite (Fe₂O₃) — iron in its fully oxidized, rust-red form — indicating sediment deposited in dry, well-oxygenated conditions. Purple and lavender shades signal a mix of hematite and goethite, suggesting waterlogged reducing conditions where iron partially re-reduced. The gray and green layers record ancient pond and swamp environments where organic carbon stripped oxygen from the iron, leaving it as greenish iron silicates. Manganese dioxide produces the near-black streaks. The Painted Desert is not painted with pigments applied later — those colors are the original geochemistry of Triassic mud, preserved 225 million years in place.\n\nThe Petrified Forest's logs are that same Chinle Formation's most spectacular product. In the Late Triassic, towering conifers — primarily Araucarioxylon arizonicum, a relative of today's Norfolk Island pine, some reaching 200 feet tall — fell into the river channels and were buried in volcaniclastic sediment. Silica-rich groundwater, sourced largely from volcanic ash raining down from eruptions to the west, slowly replaced each cellulose cell wall with quartz, jasper, amethyst, or carnelian — a process called silicification or permineralization. It wasn't instantaneous: the replacement happened cell-by-cell over millions of years. The logs didn't 'turn to stone' all at once; they were incrementally replaced from the outside in, sometimes preserving the growth rings, the cellular structure, even the tree's original chemistry in mineral form. The logs you see scattered on the surface aren't emerging from the ground — they're being exhumed by erosion of the soft Chinle mudstone around them, and they're getting shorter every year as the exposed ends fracture and crumble.\n\nAt Exit 233, Meteor Crater announces itself only indirectly — a small rise in the otherwise flat plain is the only topographic warning. The impactor that created it was a nickel-iron asteroid roughly 150 feet across traveling at approximately 26,000 mph (40 times the speed of sound) when it struck the Kaibab Limestone surface about 50,000 years ago. Impact duration: milliseconds. The energy released was equivalent to roughly 10 megatons of TNT — about 600 times the Hiroshima bomb. The initial shock wave vaporized and melted more than 90% of the impactor itself; the remaining fragments scattered as iron meteorites (Canyon Diablo irons) across a 100-square-mile radius. The crater rim was thrown outward and upward, creating an overturned stratigraphy — the rim layers are literally inverted, with the oldest rocks now on top, flipped like a pancake by the ejecta blast. Meteor Crater's extraordinary preservation is explained by two factors: its youth (50,000 years is a geological eyeblink) and the hyper-arid Colorado Plateau climate, which has suppressed the erosion that has degraded most other craters to near-invisibility.\n\nFlastaff's landscape is dominated by an entirely different geological engine: the San Francisco Volcanic Field, one of the most active volcanic fields in the lower 48 states. More than 600 individual volcanic vents are scattered across roughly 1,800 square miles, with eruptions spanning the last 6 million years. The field's products include cinder cones, lava flows, and the eroded remnant of a large stratovolcano — the San Francisco Peaks — whose collapse left the jagged cluster of summits visible north of the city, with Humphreys Peak at 12,633 feet as Arizona's highest point. Most recently, Sunset Crater erupted in approximately 1085 AD (dated by tree-ring evidence from buried forests), blanketing the region in volcanic ash that paradoxically improved soil water retention and briefly triggered a population boom among the local Sinagua people. The volcanic field is not extinct — geologists classify it as dormant, and the USGS monitors it for seismicity. The ponderosa pine forest carpeting the Flagstaff plateau grows in volcanic soil atop Quaternary lava flows; the dark rock outcrops visible in roadcuts around the city are those flows, erupted within the last few hundred thousand years.\n\nThe rock capping much of the Colorado Plateau surface near Flagstaff — and everywhere along the Mogollon Rim and the Grand Canyon's South Rim — is the Kaibab Limestone. It formed roughly 270 million years ago in a warm, shallow tropical sea full of brachiopods, crinoids, corals, and sponges. When you drive I-40 near Flagstaff and see cream-colored cliff outcrops with slightly rubbly surfaces, you're looking at Kaibab. It's the same formation you'd see if you drove to the South Rim tomorrow — the canyon exposes everything below it, and the Kaibab is always on top. The landscape transition you experience on this drive — red Chinle mudstones near Holbrook, dark volcanic rock near Flagstaff — represents the top surface of the Colorado Plateau reading its own geological history: Triassic badlands where the Chinle hasn't been stripped away, underlying Permian Kaibab Limestone emerging near the plateau's western and southern edges as the younger rocks have been removed by erosion."
      },

      nature: {
        quick: "The Painted Desert's toxic, swelling clay soils create a near-lifeless moonscape before ponderosa pines suddenly wall the highway near Flagstaff.",
        full: "For most of the drive west from Gallup, the road crosses the heart of the Colorado Plateau at 5,500–6,500 feet — a landscape that looks sparse not from lack of effort but from ancient chemistry and thin rainfall. Big sagebrush, four-wing saltbush, and scattered one-seed juniper dominate the open flats of Navajo and Hopi land, while Indian ricegrass and blue grama stitch the sandy swales together. These plants are extraordinarily well adapted: sagebrush's silver-green leaves reflect heat and conserve moisture, while junipers push taproots deep toward groundwater. Rainfall here averages only 8–10 inches a year, most of it delivered in brief monsoon bursts in July and August — in late May the plateau is at its driest.\n\nThe most arresting wildlife from the car window is the pronghorn — the fastest land mammal in North America, built to outrun long-extinct Pleistocene predators. In late May does are nursing fawns hidden in the brush, while bachelor groups of bucks sometimes trot parallel to the fence line. Common ravens are a constant presence, their glossy black silhouettes riding thermals above every mesa edge. Red-tailed hawks perch on power poles from Gallup to Winslow, and near Holbrook, Gunnison's prairie dogs pop upright at burrow entrances in the grassland patches just north of the interstate.\n\nThe biological centerpiece is the Painted Desert badlands corridor between mile markers 300 and 320, where the landscape becomes almost entirely barren. This is the Chinle Formation — 225-million-year-old Triassic mudstones rich in bentonite clay. Bentonite is a geologic plant-killer: it swells dramatically when wet, then contracts and cracks as it dries, physically shredding any root system that tries to establish. The soil is also highly saline and loaded with selenium toxic to most plants at elevated concentrations. The result is a rolling canvas of lavender, rust, gray, and white hills with almost nothing growing — a genuine biological near-void that looks extraterrestrial. The contrast makes what comes next all the more stunning.\n\nSomewhere around milepost 185–190 east of Flagstaff, the ponderosa pines arrive — not gradually but almost like a curtain being drawn. The elevation climbs through 6,500 feet onto the Coconino Plateau and suddenly the roadside is walled with tall, straight pines with orange-plated bark. Flagstaff sits within the largest contiguous ponderosa pine forest in North America; the trees thrive because volcanic soils of the San Francisco Peaks region hold more moisture and organic matter, and orographic lift wrings additional precipitation from passing storms. Steller's jays flash blue through the understory and Abert's squirrels with dramatic ear tufts bound between trees — species utterly absent just 30 miles east in the badlands.",
        species: [
          { name: "Pronghorn (Antilocapra americana)", type: "mammal", note: "Watch the open sagebrush flats between Gallup and Holbrook, especially near fence lines; does with hidden fawns and small bachelor groups are common in late May." },
          { name: "Common Raven (Corvus corax)", type: "bird", note: "Present the entire route — look for them riding thermals above mesa rims and perching on overpass structures and highway signs throughout." },
          { name: "Big Sagebrush (Artemisia tridentata)", type: "plant", note: "The dominant silver-gray shrub blanketing Navajo land flats from Gallup to the Painted Desert; its sharp, herbal scent is strongest after any light rain." },
          { name: "Indian Paintbrush (Castilleja angustifolia)", type: "plant", note: "Flaming orange-red spikes at peak bloom in late May; most visible in roadside cuts between Gallup and Sanders." },
          { name: "Gunnison's Prairie Dog (Cynomys gunnisoni)", type: "mammal", note: "Look for their towns in the short-grass flats near Holbrook and just north of I-40 around the Petrified Forest entrance; they stand upright and bark in May." },
          { name: "Collared Lizard (Crotaphytus collaris)", type: "reptile", note: "Active on warm rocky outcrops through the Painted Desert zone during mid-morning; males show vivid green-yellow coloring in late May breeding season." },
          { name: "Western Meadowlark (Sturnella neglecta)", type: "bird", note: "Heard before seen — its rich, bubbling song carries across the open grassland sections; perches on fence posts along the entire plateau crossing." },
          { name: "Ponderosa Pine (Pinus ponderosa)", type: "plant", note: "Appears almost abruptly around milepost 185–190 as the highway climbs onto the Coconino Plateau; the orange-barked trunks and vanilla scent announce you've arrived at a completely different world." },
          { name: "Abert's Squirrel (Sciurus aberti)", type: "mammal", note: "Found only in ponderosa pine forest — these large squirrels with tufted ears become visible as soon as the pines appear on the western approach to Flagstaff." },
          { name: "Red-tailed Hawk (Buteo jamaicensis)", type: "bird", note: "The most reliably seen raptor on this stretch; scan power poles and fence posts continuously from Gallup to Winslow." }
        ]
      },

      history: {
        quick: "This 175-mile corridor traces the original spine of Route 66 through the Navajo and Hopi heartland — a stretch geologists call a 'living textbook,' where 225-million-year-old petrified logs, meteorite craters, painted badlands, and sky-high ponderosa pine forests stack up in a single afternoon's drive.",
        full: "The Gallup-to-Flagstaff corridor follows what is arguably the most geologically and culturally dense segment of the old Mother Road. Route 66 was designated here in 1926, threading a trading-post economy that had sustained the Navajo and Puebloan peoples for centuries before the railroad arrived in the 1880s. Window Rock became the administrative seat of the Navajo Nation in 1936 under Commissioner John Collier, giving the largest Native American nation in the U.S. its modern governmental home. Petrified Forest and the Painted Desert had been protected since 1906, when Theodore Roosevelt made them a National Monument; Congress doubled the park's size in 2004. The highway towns of Holbrook and Winslow thrived as Route 66 pit-stops — Holbrook's iconic Wigwam Motel opened in 1950 and is now a National Register landmark — while Two Guns, a murder-riddled tourist trap near Canyon Diablo, peaked in the 1940s and burned out by 1971. Jackson Browne's broken-down car in Winslow inspired 'Take It Easy,' the Eagles' debut single (1972), and put the town on a map it has never left. Flagstaff, perched at 7,000 feet in the world's largest ponderosa pine forest, was Route 66's highest-elevation city and became a science outpost — Clyde Tombaugh discovered Pluto at Lowell Observatory in 1930. I-40 fully replaced Route 66 through Arizona in 1984, but the old highway's ghost is visible at nearly every exit."
      },

      trivia: [
        "Petrified Forest is the only national park that preserves a driveable section of Historic Route 66 — and it's also the only park where theft directly threatens the resource: roughly 12 tons of petrified wood are stolen each year, prompting the park to run a 'Conscience Wood' program where repentant thieves mail stolen pieces back from around the world, often with notes saying the 'bad luck wood' cursed them.",
        "Flagstaff became the world's first International Dark Sky City in 2001, thanks largely to Lowell Observatory's century-old lobbying. In 1930, astronomer Clyde Tombaugh discovered Pluto from Flagstaff using a 13-inch telescope — and when the New Horizons probe flew past Pluto in 2015, a portion of Tombaugh's ashes were aboard.",
        "Meteor Crater is so geometrically perfect that for 50 years after its discovery scientists assumed it was a collapsed volcanic dome — mining entrepreneur Daniel Barringer spent 26 years and his personal fortune trying to drill down to the iron meteorite, not realizing that 90 percent of the impactor vaporized on impact. NASA later used the crater to teach Apollo crews what impact geology looks like from ground level.",
        "The iron meteorites scattered around Meteor Crater are classified as Canyon Diablo irons — named for the gorge where railroad workers first found them in the 1880s. Studying their crystal structure (Widmanstätten patterns) requires millions of years of slow cooling — proving they crystallized inside a planetesimal that formed in the early solar system.",
        "The petrified logs in Petrified Forest aren't randomly scattered — they're aligned. Most point northwest to southeast, indicating they were swept by Triassic river currents flowing in that direction 225 million years ago. The current is frozen in stone: you can read the ancient river's flow direction from the orientation of the logs.",
        "Humphreys Peak at 12,633 feet — Arizona's highest point, visible from I-40 near Flagstaff — is the eroded remnant of a stratovolcano that may have once topped 16,000 feet before its summit collapsed inward. The current peaks are the hardened inner core of the original volcano's conduit system; everything else has been stripped away by 2 million years of erosion and glaciation."
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
        },
        {
          name: 'Hubbell Trading Post National Historic Site',
          coords: { lat: 35.7078, lng: -109.5613 },
          description: "The oldest continuously operating trading post on the Navajo Nation, founded by John Lorenzo Hubbell in 1878 and still stocked with Navajo rugs, silver jewelry, and traditional goods. A National Historic Site — the original adobe buildings, barn, and bull pen are intact. Off AZ-264, 55 miles west of Gallup.",
          hook: "Hubbell learned Navajo, hosted delegations of federal commissioners, and brokered a century of cultural exchange from this compound — and it's still open for business, still run as a genuine trading post."
        },
        {
          name: 'Canyon Diablo Gorge',
          coords: { lat: 35.3683, lng: -111.4400 },
          description: "A 225-foot-deep gash in the Kaibab Limestone plateau, carved by the now-dry Canyon Diablo wash near Two Guns. The Atlantic & Pacific Railroad bridge over this gorge (1881) famously halted construction for months — too wide for a temporary trestle. Its depth and geometry visually preview the Grand Canyon 60 miles north.",
          hook: "The iron meteorites scattered around Meteor Crater were first found by railroad workers near this canyon in the 1880s — the gorge and the crater are linked by the same impact event 50,000 years ago."
        },
        {
          name: 'Homolovi State Park',
          coords: { lat: 35.0233, lng: -110.6150 },
          description: "Four Ancestral Hopi pueblo sites, occupied 1200–1400 AD, on a low bluff above the Little Colorado River just north of Winslow off AZ-87. The Hopi consider these waypoints on their ancestral migration route and maintain active ties to the site. The ruins sit on Moenkopi Formation sandstone with panoramic Painted Desert views.",
          hook: "The Hopi don't call these ruins — they're waypoints on an ongoing migration story that connects these abandoned pueblos to occupied Hopi villages on the mesas 60 miles north."
        },
        {
          name: 'Wupatki National Monument',
          coords: { lat: 35.5617, lng: -111.3692 },
          description: "A multi-room pueblo built by the Sinagua around 1182 AD — within a century of Sunset Crater's eruption — on a sandstone ridge overlooking a volcanic plain. The blowhole at the ruin base is a natural pressure vent connected to underground passages; air rushes in or out with barometric pressure changes. 35 miles north of Flagstaff off US-89.",
          hook: "Sunset Crater's ash fall improved the soil so dramatically that population density here spiked immediately after the eruption — what looked like a catastrophe triggered a building boom."
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
        "Before I-17 opened, the stagecoach journey from Phoenix to Prescott via Black Canyon took a grueling 30 hours on a road that crossed the Agua Fria River multiple times; today the same stretch takes about 90 minutes.",
        "The cream-colored cliff rock visible as I-17 descends the Mogollon Rim is the Kaibab Limestone — the same formation capping the Grand Canyon's south rim 80 miles to the north. It was deposited as a flat seafloor layer 270 million years ago; it now forms the surface of the entire southern Colorado Plateau. If you drove from here to the canyon and looked over the edge, you'd be standing on the exact same rock layer you're driving through right now.",
        "Montezuma Well discharges 1.5 million gallons of spring water per day — water that fell as rain on the Colorado Plateau 30 to 50 years ago and traveled slowly through the karst limestone aquifer before emerging here. The spring has never gone dry through multiple historic droughts. Its water is too carbonated and arsenic-rich for most life, but five aquatic species evolved specifically for its chemistry and exist nowhere else on Earth.",
        "Metropolitan Phoenix sits on 1,000 to 2,000 feet of Quaternary alluvial sediment — sand, gravel, and boulders washed down from surrounding ranges over the last 1–2 million years. The actual bedrock is Precambrian granite, the same 1.7-billion-year-old rock forming South Mountain and the White Tank Mountains. The Salt River Project's reservoirs work because this structural basin is the natural collection point for runoff from 14,000 square miles of upstream terrain."
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
        },
        {
          name: 'Verde Valley Graben Overlook',
          coords: { lat: 34.743, lng: -111.752 },
          description: "As I-17 descends the Mogollon Rim south of Flagstaff, pullouts near the rim crest overlook the Verde Valley — a structural graben (down-dropped fault block) formed by Basin and Range extension starting 15 million years ago. The Verde River threading through the valley floor is visible as a cottonwood-lined green ribbon against red-rock canyon country.",
          hook: "That flat valley floor 2,000 feet below dropped along faults while the Colorado Plateau stayed elevated — the Verde Valley is the Basin and Range's northernmost finger poking under the plateau's edge."
        },
        {
          name: 'Tuzigoot National Monument',
          coords: { lat: 34.7727, lng: -112.0286 },
          description: "A Sinagua pueblo of 110 rooms perched on a narrow limestone ridge above the Verde River, occupied roughly 1125–1400 AD. Unlike Montezuma Castle, visitors can walk through Tuzigoot's room blocks directly. The site commands sweeping views across the Verde Valley Graben and surrounding red-rock formations.",
          hook: "The Sinagua built on every defensible hilltop in the Verde Valley — Tuzigoot is the largest, siting its pueblo on a narrow limestone spine that required attackers to approach single-file up the only access route."
        },
        {
          name: 'Dead Horse Ranch State Park',
          coords: { lat: 34.7655, lng: -112.0138 },
          description: "A 423-acre state park on the Verde River floodplain near Cottonwood, preserving one of the last extensive cottonwood-willow riparian corridors in Arizona. The Verde is one of only two perennially flowing rivers in Arizona and the park's bird count exceeds 200 species — a biological oasis in the surrounding Sonoran Desert.",
          hook: "The Verde flows year-round only because it taps the deep aquifer feeding Montezuma Well — the park's lush riverbank is liquid geology, the karst aquifer made visible."
        },
        {
          name: 'Agua Fria National Monument',
          coords: { lat: 34.2167, lng: -112.0833 },
          description: "A 71,100-acre monument in the Agua Fria River canyon north of Phoenix, protecting over 450 prehistoric pueblo sites from the Perry Mesa tradition (1250–1450 AD) and some of the most geologically complex canyon country in the Phoenix metro area. The canyon cuts through Tertiary volcanic rocks and basin sediments visible in dramatic cliff walls.",
          hook: "Less than 45 minutes from Phoenix, this canyon contains more than 450 ancient pueblo sites on isolated mesa tops — a lost civilization hiding in plain sight at the edge of the metro area."
        }
      ],

      geology: {
        quick: "I-17 south is a 150-mile drive through 300 million years of time — from Permian seafloor at the Mogollon Rim to Precambrian granite in Phoenix.",
        full: "The Mogollon Rim — the dramatic escarpment visible as I-17 leaves Flagstaff's plateau — marks the structural and topographic edge of the Colorado Plateau. This 200-mile-long cliff, averaging 2,000 feet tall, separates the plateau's stable horizontal sedimentary layers from the more chaotic basin-and-range terrain to the south. The escarpment is not a fault scarp — it was not created by a single rupture — but rather a retreat cliff: the plateau's edge has been gradually eroding southward as rivers carry material away, at an estimated rate of 10–20 miles over the last 15 million years.\n\nThe rock in the dramatic cliff walls as I-17 begins its descent is the Kaibab Limestone — the same cream-colored marine limestone capping the Grand Canyon's south rim 80 miles north. It formed roughly 270 million years ago in a warm shallow tropical sea full of brachiopods, crinoids, and corals. Below the Kaibab comes the Toroweap Formation (similar marine limestone), then the Coconino Sandstone (Permian desert dunes, cemented into cream-colored cliffs), then the Hermit Formation (red shales from a Permian river system). Each band is a chapter in a 50-million-year story of advancing and retreating seas, deserts, and rivers across ancient Arizona.\n\nThe Verde Valley, opening below the rim around Exit 289, is a structural graben — a down-dropped fault block formed by Basin and Range extension pulling the crust apart south of the plateau boundary beginning 15 million years ago. The basin filled with sediment and a freshwater lake (Lake Verde) between 5 and 2 million years ago. Montezuma Well is a collapsed limestone sinkhole fed by a spring discharging 1.5 million gallons per day — water that fell on the Colorado Plateau 30–50 years ago and traveled through the karst aquifer before emerging here. Its chemistry is so unique — highly carbonated, laced with arsenic — that five aquatic species evolved here and nowhere else on Earth.\n\nBetween Camp Verde and Black Canyon City, I-17 cuts through progressively older rock units as the highway descends through basin-and-range terrain. The volcanic mesas visible to the west are lava-capped remnants preserving Tertiary sediments from erosion. At mile marker 249 near Black Canyon City, the first giant saguaro cacti appear — the biological announcement of the Sonoran Desert's lower elevation zone, as definitive as a geological contact. Phoenix sits on 1,000–2,000 feet of Quaternary alluvial sediment shed from the surrounding ranges over the last 1–2 million years. The Salt River reservoirs that made the modern city possible exist because this structural basin is the natural collection point for runoff from 14,000 square miles of upstream desert and mountain terrain. The Precambrian granite of South Mountain and the White Tank Mountains — visible on the city's edge — is the actual basement, the oldest rock in the Phoenix area at 1.7 billion years old, island ranges rising through the alluvial plain like the backs of half-buried mountains."
      },

      nature: {
        quick: "In two hours you'll drop 6,000 feet through five ecological zones, finishing where saguaros stand 40 feet tall in full white bloom.",
        full: "Leave Flagstaff through a cathedral of ponderosa pines — the tallest pines in North America's interior West — growing at 6,500–7,000 feet where 20-plus inches of annual precipitation and cool summers let conifers dominate. This is Merriam's Transition Zone, named for the 19th-century naturalist who noticed that climbing a mountain in Arizona mirrors traveling north toward Canada. The trees smell faintly of vanilla and butterscotch on warm days; in late May they're packed with nesting Steller's jays and elk that calved only weeks ago graze forest meadows at dawn.\n\nAs I-17 begins its descent, the pines thin and give way to Gambel oaks, alligator junipers, and piñon pines at 4,500–5,500 feet — the Upper Sonoran Zone. This zone exists because the air is drier and warmer than the pine belt above: roughly 14–18 inches of rain, with soil too thin and rocky to sustain tall conifers. The dense scrub is full of wildlife: pronghorn appear in open grassland patches between Cordes Junction and Camp Verde, and Gambel's quail scuttle along roadcuts.\n\nAround Black Canyon City at roughly 3,500–4,000 feet, something extraordinary happens: the first giant saguaros appear. This is not a gradual fade-in — it is nearly a hard biological line. Saguaros cannot survive more than a day or two of hard freeze; temperatures below 28°F for several hours can kill a mature plant. The 3,000–4,000-foot elevation band marks where winter temperatures stay just warm enough. Above this threshold saguaros simply cannot persist; below it they announce the Lower Sonoran Zone like columns of a living cathedral. The hillsides around Black Canyon City are dense with them, arms outstretched, and in late May every tip is crowned with enormous white flowers — Arizona's state flower, open at night but still visible until mid-morning. Each bloom lasts just 24 hours, but a single cactus may carry hundreds, rotating through a month-long bloom that peaks right around Memorial Day.\n\nBy Peoria you are deep in the Sonoran Desert at 1,100 feet — one of the hottest and most biologically rich deserts on Earth. Gila woodpeckers drill nest cavities into saguaro flesh; old holes become apartments for tiny elf owls, ash-throated flycatchers, and cactus wrens. The cactus wren — Arizona's state bird — defends nesting territories with harsh, low-frequency chatter. White-winged doves, the primary pollinators of saguaro flowers, fill the air in clouds moving between blooming cacti. The drive down I-17 is a time machine: you begin in a Rocky Mountain forest and arrive, 150 miles later, in a subtropical desert in full late-spring crescendo.",
        species: [
          { name: "Ponderosa Pine (Pinus ponderosa)", type: "plant", note: "Dominates the first 20 miles south of Flagstaff at 6,000–7,000 ft; the orange-plated trunks and vanilla scent are unmistakable — they disappear almost completely by Munds Park." },
          { name: "Rocky Mountain Elk (Cervus canadensis)", type: "mammal", note: "May calving season; cows with very young calves use forest meadows near Flagstaff — scan grassy openings along I-17 just after leaving town, especially at dawn." },
          { name: "Steller's Jay (Cyanocitta stelleri)", type: "bird", note: "Deep-blue crested jay of the pine forest; most visible at rest stops near Flagstaff at 6,500–7,000 ft, nesting and foraging noisily through the ponderosas in late May." },
          { name: "Alligator Juniper (Juniperus deppeana)", type: "plant", note: "Named for its distinctive checkered bark; becomes the dominant tree in the 4,500–5,500 ft oak-juniper zone near Mayer and Cordes Junction as ponderosas disappear." },
          { name: "Pronghorn (Antilocapra americana)", type: "mammal", note: "Look for tan-and-white flashes in open grassland patches between Cordes Junction and Camp Verde, roughly 3,500–4,500 ft, especially in the morning." },
          { name: "Gambel's Quail (Callipepla gambelii)", type: "bird", note: "Plump, topknot-wearing quail found from chaparral into the Sonoran Desert; easiest in family coveys crossing roadcuts in the 2,500–4,500 ft range around Black Canyon City." },
          { name: "Saguaro (Carnegiea gigantea)", type: "plant", note: "The biological threshold moment of the whole trip: first appears just north of Black Canyon City around 3,500–4,000 ft, and by late May every arm tip carries large white flowers still visible well into morning." },
          { name: "Gila Woodpecker (Melanerpes uropygialis)", type: "bird", note: "Zebra-backed woodpecker that excavates nest holes directly into living saguaro; common from Black Canyon City south into the Phoenix basin at 1,100–3,500 ft, vocal in late May nesting." },
          { name: "Cactus Wren (Campylorhynchus brunneicapillus)", type: "bird", note: "Arizona's state bird — loud and conspicuous in the lower Sonoran Desert below 3,000 ft from Black Canyon City south into Peoria, aggressively territorial in May." },
          { name: "White-winged Dove (Zenaida asiatica)", type: "bird", note: "The primary pollinator of saguaro flowers; abundant throughout the Sonoran Desert below 3,500 ft by late May, following the saguaro bloom northward." },
          { name: "Velvet Mesquite (Prosopis velutina)", type: "plant", note: "Thorny desert tree appearing in washes below 3,000 ft; forms dense stands by the Phoenix metro, with yellow catkin flowers out in late May attracting clouds of pollinators." }
        ]
      }
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
