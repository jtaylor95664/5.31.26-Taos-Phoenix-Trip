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

    /* ── STAGE 0: Peoria → Globe ───────────────────────────────────────────── */
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
        {
          type: 'Sit-down · Historic',
          name: "Chalo's Casa Reynoso",
          address: '902 E Ash St, Globe, AZ',
          walk: 'At the charger',
          hours: 'Check locally',
          service: '~20 min',
          note: "Long-running local institution at the exact charger address. Famous adobada and green chile. A Globe institution for generations."
        },
        {
          type: 'Quick grab',
          name: 'La Luz del Día',
          address: 'Historic downtown Globe (~5 min drive)',
          walk: '~5 min drive',
          hours: 'Check locally',
          service: '~3 min',
          note: 'Burritos, quesadillas, Mexican bread — food on the table almost instantly.'
        },
        {
          type: 'Coffee',
          name: 'Copper Cities Coffee',
          address: '1100 N Broad St, Globe, AZ',
          walk: '~5 min drive',
          hours: 'Check locally',
          service: 'Café pace',
          note: "Rustic interior inspired by Globe's mining heritage. Good espresso and a relaxed vibe."
        }
      ],

      dining_extra: [
        {
          type: 'Sit-down',
          name: "Guayo's on the Trail",
          address: '2251 AZ-188, Globe, AZ 85501',
          walk: '~1 mile south of downtown off US-60',
          hours: 'Wed–Sun 10:30 AM – 8:00 PM; closed Mon–Tue',
          service: 'Full table service',
          note: "A Globe institution open since the 1930s. Order the butterflied ribeye topped with roasted chiles and cheese, or the green chili burro. Portions are generous and prices are excellent. Slightly out-of-town on AZ-188 toward Roosevelt Lake — punch the address into nav before leaving US-60."
        }
      ],

      history: {
        quick: 'Globe sits at the edge of the San Carlos Apache Reservation, and its 1870s copper boom made it one of the richest mining districts in the American West.',
        full: "Globe sits at the edge of the San Carlos Apache Reservation, homeland of the Western Apache people who fiercely resisted U.S. expansion into Arizona. The town boomed in the 1870s on silver, then copper — the Globe-Miami district became one of the richest mining regions in the world. Back along US-60, the Superstition Mountains hid one of the West's great legends: the Lost Dutchman's Gold Mine, which has drawn treasure hunters — and claimed a few lives — since the 1800s. The Hohokam people irrigated this entire valley 1,000 years ago with 500+ miles of canals; Phoenix rebuilt those same canals in the 1860s and named itself after the bird reborn from ashes."
      },

      trivia: [
        "The Superstition Mountains are named for the Apache belief that the mountain held the entrance to the underworld — 'Thunder God's Home.' Jacob Waltz allegedly took the location of his fabulously rich 'Lost Dutchman' gold mine to his grave in 1891, and searchers have died looking for it ever since.",
        "Bloody Tanks Wash, which US-60 follows into Miami, is named for a skirmish in 1864 where Arizona Volunteers ambushed an Apache war party at a water source. The wash drains quietly alongside the highway today — the name is the only evidence anything happened here.",
        "The Pinto Wash steel arch bridge (just east of Superior, completed 1949) was voted Most Beautiful Steel Bridge of the Year by the American Institute of Steel Construction — beating out far larger spans. Look for it as the highway crosses a side canyon before the Queen Creek Tunnel."
      ],

      scenic: [
        { label: 'Picketpost Mountain', detail: 'Around mile marker 223, west of Superior. The craggy 4,375-ft volcanic plug shoots straight up from the desert floor on the left (north). It looks photoshopped against the sky. Best in morning light when the east face is fully lit.', icon: '⛰' },
        { label: 'Queen Creek Canyon descent', detail: 'Just east of Superior, after the tunnel, the road drops steeply into a narrow red-rock gorge. The canyon walls close in on both sides — passengers get a genuine slot-canyon moment from the car.', icon: '🏔' },
        { label: 'Miami smelter panorama', detail: 'The enormous red-and-white-banded Freeport-McMoRan smokestack and terracotta waste-rock mountains create an almost cinematic industrial panorama against the Pinal Mountains — one of the stranger beautiful views on the whole route.', icon: '🏭' }
      ],

      pois: [
        {
          name: 'Superstition Mountains',
          coords: { lat: 33.4700, lng: -111.3700 },
          description: "Home of the legendary Lost Dutchman's Gold Mine. Jagged volcanic peaks visible from US-60 for miles before Apache Junction.",
          hook: "Searchers have died in these mountains chasing gold that may not exist — the legend has outlasted every attempt to disprove it."
        },
        {
          name: 'Goldfield Ghost Town',
          coords: { lat: 33.4565, lng: -111.4920 },
          description: "A resurrected 1890s gold-mining camp on the flanks of the Superstition Mountains. Features a working narrow-gauge train, gold-mine tours, gunfight reenactments, and gold panning. The original camp boomed after an 1892 strike and was abandoned by 1897 when the ore ran out.",
          hook: "One of the few Arizona ghost towns that never fully died — locals rebuilt it into a living attraction rather than let the desert swallow it."
        },
        {
          name: 'Boyce Thompson Arboretum',
          coords: { lat: 33.2800, lng: -111.1589 },
          description: "Arizona's oldest and largest botanical garden, founded 1924 as a desert-plant research station. Sits on 392 acres beneath volcanic Picketpost Mountain along Queen Creek, with over 2,600 arid-land plant species from deserts on five continents.",
          hook: "Even from the highway you can spot the saguaro forests and dramatic volcanic cliffs — but 20 minutes on the loop trail reveals a riparian canyon where bobcats, Gila monsters, and 270 bird species have been recorded."
        },
        {
          name: 'Queen Creek Tunnel',
          coords: { lat: 33.2950, lng: -111.1050 },
          description: "A 1,217-foot tunnel blasted through solid volcanic rock east of Superior, opened in 1953 at a then-staggering cost of $550,000. It replaced a much-narrower 1926 tunnel and became Arizona's first road tunnel to receive an LED lighting system.",
          hook: "The abandoned original tunnel and the old alignment of US-60 are hikeable via the Legends of Superior Trail just south of the highway — an eerie parallel world frozen in 1926."
        },
        {
          name: 'Besh-Ba-Gowah Ruins',
          coords: { lat: 33.4192, lng: -110.7853 },
          description: "700-year-old Salado people dwellings just north of Globe. One of Arizona's hidden archaeological gems with a small museum on site.",
          hook: "The Salado culture built here between 1225 and 1400 AD, then vanished — leaving behind a remarkably intact pueblo that most tourists drive right past."
        },
        {
          name: 'Miami Open-Pit Mine',
          coords: { lat: 33.3983, lng: -110.8678 },
          description: "One of the largest open-pit copper operations visible from a US highway. The Freeport-McMoRan Miami Mine and its towering smelter stack dominate the hillside. The Inspiration Mine here began in 1911 and once supplied nearly 4% of America's entire copper output.",
          hook: "US-60 literally threads between the waste dumps and the smelter — the mine pit has been scooped out of an entire mountain range and the scale is genuinely shocking."
        }
      ]
    },

    /* ── STAGE 1: Globe → Show Low ─────────────────────────────────────────── */
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
        {
          type: 'Sit-down · Historic',
          name: 'Show Low Cafe',
          address: '480 W Deuce of Clubs, Show Low, AZ',
          walk: '~5 min drive',
          hours: 'Check locally',
          service: '~15–20 min',
          note: "Classic small-town diner. The street name tells the whole story — see the history card."
        },
        {
          type: 'Quick grab',
          name: 'Mudslingers Drive Thru',
          address: 'Show Low, AZ',
          walk: '~5 min drive',
          hours: 'Check locally',
          service: '~5 min drive-through',
          note: 'Local family-run drive-through. Fastest option if the clock is ticking.'
        },
        {
          type: 'Coffee',
          name: 'Arizona Mountain Coffee Co.',
          address: '151 N White Mountain Rd, Show Low, AZ',
          walk: '~5 min drive',
          hours: 'Opens 6 AM',
          service: 'Café pace',
          note: 'Good high-country fuel stop. Sandwiches, pastries, bagels.'
        }
      ],

      dining_extra: [
        {
          type: 'Sit-down · Steakhouse',
          name: "Cattlemen's Steakhouse & Lounge",
          address: '1231 E Deuce of Clubs, Show Low, AZ 85901',
          walk: 'On the main drag, easy highway access',
          hours: 'Mon–Sat 4:00 PM – 9:00 PM; closed Sunday',
          service: 'Full table service; reservations recommended weekends',
          note: "The local go-to for a proper dinner after canyon driving. Known for slow-roasted prime rib and hand-cut steaks. The attached CL Lounge serves craft cocktails. Dinner-only hours make it a great end-of-day option if you arrive in Show Low by late afternoon."
        }
      ],

      history: {
        quick: "Show Low got its name from an 1875 poker game — two pioneers played cards for the homestead, and the winner \"showed low.\" You're now atop the Mogollon Rim, the dramatic edge of the Colorado Plateau.",
        full: "Show Low's name comes from an 1875 poker game: two pioneers couldn't agree on who should buy out the other's homestead, so they played cards for it. The winner showed low — the two of clubs — and the town was named on the spot. You climbed through the Salt River Canyon to get here, one of Arizona's most dramatic stretches of road: a 2,000-ft descent into the canyon followed immediately by a 3,000-ft climb back out through White Mountain Apache territory. Fort Apache, just east of here, was a U.S. Army post from 1870 — now a National Historic Landmark operated by the White Mountain Apache Tribe. The ponderosa pine forests up here look nothing like the desert you left this morning."
      },

      trivia: [
        "US-60 drops approximately 2,000 feet as it descends into Salt River Canyon — nearly the same vertical relief as the South Rim of the Grand Canyon — then climbs all of it back out within about 5 miles. The switchbacks were carved into canyon walls beginning in January 1933 as a Depression-era public works project.",
        "Show Low's main street is literally named 'Deuce of Clubs' after the card that won the town its name. In 1876, two ranchers played a marathon hand of Seven-Up to decide who'd keep their shared 100,000-acre ranch. The winner turned up the deuce of clubs — and kept everything.",
        "The White Mountain Apache Reservation contains Sunrise Park Resort, Arizona's largest ski area, at over 11,000 feet elevation. You drive through Arizona's most visited ski destination on this very corridor — in the same state where Phoenix bakes at 110°F just 150 miles away."
      ],

      scenic: [
        { label: 'Canyon rim approach', detail: 'About 5 miles before the descent, the high plateau suddenly ends and the entire Salt River Canyon opens 2,000 feet below with zero warning. One moment you\'re on flat ponderosa-pine mesa, the next there\'s a void. Passengers should have cameras ready around mile marker 295.', icon: '⛰' },
        { label: 'Looking back at the 1934 bridge', detail: 'After crossing the river and climbing the north wall, look back south — the full depth of the canyon and both bridges (1934 and 1996) are visible side by side in a single frame. The best rearward view on the entire drive.', icon: '🌉' },
        { label: 'Vegetation flip up the canyon wall', detail: 'Halfway up the north wall, the vegetation swaps almost instantly from Sonoran desert (saguaro, palo verde) to Transition Zone (pinyon, juniper). You can watch the plant communities change through the windshield — a 1,500-foot ecological telescope in about 3 miles of road.', icon: '🌲' }
      ],

      pois: [
        {
          name: 'Salt River Canyon Overlook',
          coords: { lat: 33.8300, lng: -110.6900 },
          description: "Arizona's 'Little Grand Canyon' — 2,000 ft of dramatic drop on US-60. White Mountain Apache ancestral territory. Pull-off on both sides of the highway at the rim.",
          hook: "Most drivers stop at the top — almost no one walks down to the 1934 historic bridge at river level, which puts you at the bottom looking straight up 2,000 feet of layered canyon wall."
        },
        {
          name: 'Salt River Canyon 1934 Historic Bridge',
          coords: { lat: 33.8231, lng: -110.7089 },
          description: "At the canyon bottom, a rest area leads down to the original 1934 PWA-funded steel arch bridge (now pedestrian-only), standing alongside the 1996 replacement. Features decorative towers and hand-crafted stone railings designed by architect Lee Moor.",
          hook: "Walk down from the rest area and you're suddenly at river level, looking straight up at 2,000 feet of canyon. On hot days the microclimate at the bottom is noticeably cooler than the mesa above."
        },
        {
          name: 'Salt River Canyon Petroglyphs',
          coords: { lat: 33.8240, lng: -110.7095 },
          description: "Boulders at the canyon-bottom rest area bear pre-Columbian petroglyphs dating back roughly 3,000 years, predating the Apache by centuries. This point also marks the tribal boundary between San Carlos Apache (south) and White Mountain Apache (north).",
          hook: "Easy to miss if you only stop at the upper overlook — the petroglyphs are right next to the picnic tables at the canyon floor, and most drivers pass without knowing they're there."
        },
        {
          name: 'Seneca Lake Recreation Area',
          coords: { lat: 33.7623, lng: -110.5118 },
          description: "A 27-acre high-desert lake at 4,787 feet on the San Carlos Apache Reservation, stocked with trout, catfish, and largemouth bass. The ruins of an ambitious 1970s Apache-built resort — trading post, restaurant, cabins — stand in photogenic decay beside the working lake.",
          hook: "The abandoned resort gives this fishing lake an eerie, evocative quality. The juxtaposition of a pretty trout lake and crumbling 1970s concrete in the middle of nowhere makes it a great photo stop."
        },
        {
          name: 'Mogollon Rim',
          coords: { lat: 34.1500, lng: -110.4000 },
          description: "200-mile volcanic escarpment marking the southern edge of the Colorado Plateau. Elevation jumps sharply as you climb out of the canyon. Ponderosa pine forests replace desert cactus almost instantly.",
          hook: "You're crossing one of the great geological boundaries of North America — the abrupt edge where the high Colorado Plateau drops away to the Basin and Range desert below."
        },
        {
          name: 'Fort Apache Historic Park',
          coords: { lat: 33.7948, lng: -109.9839 },
          description: "A National Historic Landmark preserving nearly 30 original Army buildings from the 1870s–1930s on the White Mountain Apache Reservation. Includes the Apache Cultural Center (Nohwike' Bágowa / House of Our Footprints). Admission also covers 14th-century Kinishba Pueblo ruins 4 miles away.",
          hook: "Unlike reconstructed frontier forts, these buildings are the real thing — same adobe walls, same parade ground where Geronimo's scouts once mustered. A 25-minute detour off US-60 via AZ-73 through Whiteriver."
        }
      ]
    },

    /* ── STAGE 2: Show Low → Socorro ───────────────────────────────────────── */
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
        {
          type: 'Sit-down · Coffee · Historic',
          name: 'El Camino Restaurant & Lounge',
          address: '606 California St, Socorro, NM',
          walk: '~5 min drive',
          hours: 'Open 24 hours',
          service: 'Fast diner',
          note: "Open since 1963. Voted Socorro's best coffee and best breakfast every year. The platonic ideal of a US-60 highway diner."
        },
        {
          type: 'Quick grab',
          name: "Los Mario's Mexican Food",
          address: 'Socorro, NM',
          walk: 'Check locally',
          hours: 'Check locally',
          service: '~10 min',
          note: 'Highly rated local spot. Shredded beef tacos are the standout.'
        }
      ],

      dining_extra: [
        {
          type: 'Casual American / New Mexican',
          name: "Yo Mama's Grill",
          address: '913 N California St, Socorro, NM 87801',
          walk: '~5 min drive from I-25 interchange',
          hours: 'Mon 11am–8:30pm, Tue closed, Wed–Fri 11am–8:30pm, Sat 3–8:30pm, Sun 11am–8pm',
          service: 'Dine-in',
          note: "A beloved local spot with an eclectic menu spanning burgers, steaks, and Southwest platters (tamale + chile relleno + cheese enchilada combo). Solid green chile and good value — a step up from chains without the wait of Socorro's more famous spots."
        }
      ],

      history: {
        quick: "Socorro is one of New Mexico's oldest settlements, founded in 1598 as a stop on El Camino Real — the Royal Road from Mexico City to Santa Fe that predates the Oregon Trail by 200 years.",
        full: "Socorro is one of New Mexico's oldest European settlements, founded by Spanish colonists in 1598 as a supply stop on El Camino Real — the 1,600-mile Royal Road connecting Mexico City to Santa Fe, predating the Oregon Trail by two centuries. You crossed into New Mexico through high-desert grassland, with the Datil and Magdalena Mountains on the horizon. About 50 miles west on US-60 sits the Very Large Array: 27 radio telescope dishes on the Plains of San Agustin, one of the world's premier astronomical observatories and the filming location for the movie Contact. The Bosque del Apache refuge just south hosts tens of thousands of sandhill cranes and snow geese each winter — one of North America's great wildlife spectacles."
      },

      trivia: [
        "US-60 crosses the Continental Divide east of Pie Town at 7,796 feet — higher than any point in the Appalachian Mountains. Rain falling on the west side of the road is Pacific-bound; on the east side, it heads for the Gulf of Mexico.",
        "The Magdalena Livestock Driveway — nicknamed the 'Hoof Highway' — was the last working long cattle drive trail in the United States, stretching 125 miles from Springerville to the Magdalena railroad spur. At its 1919 peak, 150,000 sheep passed through in a single season. Cowboys kept it alive until trucking finally killed it in 1971.",
        "Datil gets its name from the Spanish word for 'date' — early settlers thought the seedpods of local yucca plants looked like dates. And Casa Malpais, back in Springerville, translates to 'House of the Badlands' — so this stretch of US-60 is literally the road between the House of the Badlands and the Town of Dates."
      ],

      scenic: [
        { label: 'Plains of San Agustín', detail: 'The vast, flat ancient lake bed east of Datil where the Very Large Array sits. On a clear day you can see the white dish antennas from the highway 15–20 miles before you reach them — the scale only becomes apparent when you get close and realize each dish is 82 feet across.', icon: '📡' },
        { label: 'Datil Mountains descent into Socorro', detail: 'As US-60 drops off the high plateau, the Magdalena Mountains (rising to 10,500 ft) dominate the eastern skyline and the Rio Grande valley opens up ahead — a dramatic reveal after 100+ miles of high desert grassland.', icon: '⛰' },
        { label: 'Pie Town Continental Divide marker', detail: 'A weathered roadside sign and informal pull-off. In late May the surrounding meadows are green from spring rains, and the Continental Divide Trail crosses the highway right here. Watch for long-distance hikers with enormous packs.', icon: '🥾' }
      ],

      pois: [
        {
          name: 'Casa Malpais Archaeological Park',
          coords: { lat: 34.1324, lng: -109.2817 },
          description: "A National Historic Landmark pueblo built by the Mogollon culture between 1260 and 1350 AD on the rim of an ancient shield volcano near Springerville. Features a great kiva, a solar calendar, and a catacomb network of lava-tube rooms beneath the 50–60-room pueblo — unique in Arizona.",
          hook: "This 700-year-old pueblo is riddled with lava-tube catacombs used as burial chambers. Tours depart from the Heritage Museum at 418 E Main St in Springerville."
        },
        {
          name: 'Pie Town & Continental Divide',
          coords: { lat: 34.2997, lng: -108.1330 },
          description: "A tiny community (pop. ~166) perched right at the Continental Divide at 7,796 feet on US-60. WWI vet Clyde Norman opened a gas-stop general store in the 1920s, started baking dried-apple pies, and the name stuck. The Pie-O-Neer café still serves pie to road-trippers and Continental Divide Trail hikers.",
          hook: "You cross the Continental Divide right here — water west of this point flows to the Pacific; east of it flows to the Gulf of Mexico."
        },
        {
          name: 'Very Large Array (VLA)',
          coords: { lat: 34.0789, lng: -107.6183 },
          description: "27-dish radio telescope array on the Plains of San Agustin. Each dish is 82 feet across. Featured in the film Contact. One of the world's premier astronomical observatories, visible from US-60 miles before you reach it.",
          hook: "The VLA was used to discover that the Milky Way's central region contains a massive black hole — and you can tour it for free on weekends."
        },
        {
          name: 'Datil Well Recreation Area',
          coords: { lat: 34.1536, lng: -107.8579 },
          description: "A BLM site preserving one of 15 hand-dug water wells along the old Magdalena Livestock Driveway. At peak, more than 150,000 sheep and 21,600 cattle passed this very well in a single year (1919) on the way from Springerville to the Magdalena railhead.",
          hook: "This is the Hoof Highway — the last working cattle drive trail in the American West, still in active use until 1971."
        },
        {
          name: 'Kelly Ghost Town',
          coords: { lat: 34.0792, lng: -107.2200 },
          description: "Two and a half miles south of Magdalena, the ruins of Kelly once housed nearly 3,000 souls during the silver, lead, and zinc mining boom of the late 1800s. The Kelly Mine opened in 1883; the last residents left in 1947. Crumbling stone buildings and mine shaft headframes remain on open BLM land.",
          hook: "At its peak, tiny Kelly had more people than Magdalena does today — then the ore ran out and everyone just walked away."
        },
        {
          name: 'Bosque del Apache NWR',
          coords: { lat: 33.7700, lng: -106.9000 },
          description: "World-class bird sanctuary south of Socorro. Tens of thousands of sandhill cranes and snow geese winter here in one of North America's great wildlife spectacles.",
          hook: "In late May the cranes are gone, but the bosque cottonwood forest along the Rio Grande is in full leaf — a vivid green ribbon through the brown desert."
        },
        {
          name: 'San Miguel Mission',
          coords: { lat: 34.0584, lng: -106.8925 },
          description: "Historic Spanish colonial mission in Socorro's plaza, dating to 1598. One of the oldest churches in the United States, built when Shakespeare was still alive.",
          hook: "The current church was rebuilt in 1819 on the foundations of the original 1598 structure — the walls contain materials laid by the first Spanish colonists."
        }
      ]
    },

    /* ── STAGE 3: Socorro → Albuquerque ────────────────────────────────────── */
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
        {
          type: 'Sit-down · Historic',
          name: 'Church Street Cafe',
          address: 'Old Town Albuquerque, NM',
          walk: '~15 min drive',
          hours: 'Check locally',
          service: '~25 min',
          note: "One of ABQ's oldest restaurants in a 300-year-old adobe building. Traditional NM green chile dishes in a gorgeous historic courtyard."
        },
        {
          type: 'Quick grab',
          name: 'Old Town Cafe',
          address: '206 San Felipe St NW, Albuquerque, NM',
          walk: '~15 min drive',
          hours: 'Check locally',
          service: '~10 min',
          note: "Casual and fast. Local art on the walls. Frito pie if you're feeling New Mexican."
        },
        {
          type: 'Coffee',
          name: 'Black Bird Coffee House',
          address: 'Old Town, Albuquerque, NM',
          walk: '~15 min drive',
          hours: 'Check locally',
          service: 'Café pace',
          note: 'Shady hacienda patio. Good espresso and a calm spot to collect yourself before the airport run.'
        }
      ],

      dining_extra: [
        {
          type: 'Food Hall · Eclectic',
          name: 'Sawmill Market',
          address: '1909 Bellamah Ave NW, Albuquerque, NM 87104',
          walk: '~10 min drive from charger; 0.7 mi from Old Town Plaza',
          hours: 'Sun–Thu 8am–9pm, Fri–Sat 8am–10pm',
          service: 'Counter service, communal seating, outdoor patio',
          note: "New Mexico's first food hall, in a remodeled 1920s lumber warehouse just north of Old Town. A dozen vendors under one roof — great when your group wants different things. Local craft beer, NM green chile, diverse cuisines."
        }
      ],

      history: {
        quick: 'Albuquerque sits in the Rio Grande valley at 5,300 feet, founded by Spanish colonists in 1706 — but Tiwa-speaking Pueblo people have lived here for over a thousand years before that.',
        full: "Albuquerque sits in the Rio Grande valley at 5,300 feet, flanked by the 10,678-ft Sandia Mountains to the east. The area has been home to Tiwa-speaking Pueblo people for over a thousand years; Spanish colonists founded the city in 1706. Historic Route 66 runs straight through Central Avenue downtown — the same road that carried Dust Bowl migrants west in the 1930s. The Sandia Mountains catch the last light of the day in a phenomenon locals call 'the watermelon' — the pink-orange glow that gives the range its name (sandia means watermelon in Spanish)."
      },

      trivia: [
        "The stretch of I-25 between Socorro and Albuquerque follows the Camino Real de Tierra Adentro — the 'Royal Road of the Interior Land' — a 1,600-mile trade route from Mexico City to Santa Fe active from 1598 until the mid-1800s. It is the oldest continuously used European road in North America.",
        "The Rio Grande you're paralleling has been running dry in summer more frequently in recent decades — but in late May, snowmelt from the Colorado Rockies has it running full and muddy brown. The cottonwood bosque on both banks glows bright green: the largest cottonwood forest in the American Southwest.",
        "Albuquerque is the world capital of hot air ballooning because of the 'Albuquerque Box' — a meteorological quirk where low-altitude winds blow south while higher winds blow north, letting pilots return almost exactly to their launch point. No other major city has this natural flight pattern. The Balloon Fiesta (October) draws 500–900 balloons — the world's largest."
      ],

      scenic: [
        { label: 'Rio Grande bosque corridor', detail: 'Between Belen and Albuquerque, the cottonwood canopy is fully leafed out in bright green in late May — a striking color contrast against the buff-colored desert. Keep an eye left (west) as you pass through Los Lunas and Belen.', icon: '🌳' },
        { label: 'Sandia Mountains growing as you approach ABQ', detail: 'Northbound on I-25, the Sandias appear gradually as you clear the Socorro basin, growing from a distant pink stripe to a dramatic 10,000-foot wall. At sunset the east face turns the deep watermelon-red that gave the mountains their Spanish name.', icon: '🌄' },
        { label: 'Albuquerque basin reveal', detail: 'As I-25 crests the south mesa, the city spreads below in the Rio Grande rift valley at 5,312 feet, framed by the Sandias to the east and West Mesa volcanoes to the west — a classic high-desert basin view that appears suddenly as you top the grade.', icon: '🏙' }
      ],

      pois: [
        {
          name: 'Albuquerque Old Town',
          coords: { lat: 35.0958, lng: -106.6692 },
          description: "Founded 1706. Spanish colonial plaza, San Felipe de Neri Church, adobe architecture. 15 min drive from charger. Some of the best green chile in New Mexico within a few blocks.",
          hook: "The plaza has been continuously occupied since 1706 — the adobe church in the corner has been in continuous use longer than the United States has existed."
        },
        {
          name: 'Petroglyph National Monument',
          coords: { lat: 35.1281, lng: -106.7507 },
          description: "On Albuquerque's west mesa, more than 24,000 images — animals, geometric designs, human figures, Spanish colonial crosses — are pecked into dark volcanic basalt. Most were made by ancestral Puebloans between 1300 and 1650 AD.",
          hook: "The black color is 'desert varnish' — a manganese-iron crust built up over millennia — and the petroglyph makers scraped through it to the lighter rock beneath, like carving into a chalkboard."
        },
        {
          name: 'Belen Harvey House Museum',
          coords: { lat: 34.6617, lng: -106.7765 },
          description: "A beautifully restored 1910 Fred Harvey railroad restaurant in Belen, 34 miles south of ABQ. Harvey Houses were the first national restaurant chain, staffed by the famously professional 'Harvey Girls.' This one operated 1910–1939 and now houses a museum on Route 66 and the Santa Fe Railway.",
          hook: "Fred Harvey's chain was so successful it reportedly 'civilized the West.' John Ford's 1946 film 'The Harvey Girls,' starring Judy Garland, was partly a tribute."
        },
        {
          name: 'Los Lunas Decalogue Stone',
          coords: { lat: 34.7862, lng: -106.7330 },
          description: "On the slopes of Hidden Mountain near Los Lunas, a large boulder bears a nine-line inscription of the Ten Commandments in ancient Hebrew script — with a few Greek letters mixed in. First recorded in 1933. Fierce debate: pre-Columbian Semitic contact, or a clever 19th-century forgery?",
          hook: "The Ten Commandments, in ancient Hebrew, are carved into a rock just off the interstate. Nobody can fully agree whether it's 2,000 years old or 150."
        },
        {
          name: 'Sandia Mountains',
          coords: { lat: 35.2100, lng: -106.4500 },
          description: "10,678-ft peak flanking Albuquerque to the east. Famous watermelon-pink glow at sunset. Aerial tram (the longest in North America) rises 2.7 miles to the summit — visible from the highway.",
          hook: "The granite core of the Sandias is 1.45 billion years old — some of the oldest exposed rock in New Mexico, worn smooth by a billion years of erosion."
        }
      ]
    },

    /* ── STAGE 4: Albuquerque → Santa Fe ───────────────────────────────────── */
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
        {
          type: 'Coffee · Quick grab',
          name: 'Tribes Coffee House',
          address: '3470 Zafarano Dr, Santa Fe, NM',
          walk: '~2 min walk',
          hours: 'Opens 7 AM',
          service: '~5 min',
          note: 'Around the corner from the charger. All-day breakfast burritos and benedicts.'
        },
        {
          type: 'Quick grab',
          name: 'Plaza Cafe Southside',
          address: '3466 Zafarano Dr, Santa Fe, NM',
          walk: '~2 min walk',
          hours: 'Check locally',
          service: '~10 min',
          note: 'Also right next to the charger. Santa Fe neighborhood staple, traditional NM dishes.'
        },
        {
          type: 'Sit-down · Historic',
          name: 'The Shed',
          address: 'Downtown Santa Fe, NM',
          walk: '~10 min drive',
          hours: 'Check locally',
          service: '~25 min',
          note: 'Santa Fe institution since 1953. Legendary red chile enchiladas. Worth the short drive if you have time.'
        }
      ],

      dining_extra: [
        {
          type: 'BBQ / New Mexican',
          name: 'Cowgirl BBQ',
          address: '319 S Guadalupe St, Santa Fe, NM 87501',
          walk: '~0.4 miles / 8-min walk from the EA charger (both in the Guadalupe/Railyard district)',
          hours: 'Mon–Fri 11:30am–9pm; Sat–Sun 11:30am–10pm',
          service: 'Full service, bar, live music most nights',
          note: "A Santa Fe institution voted 'Best of Santa Fe' for 20+ years. Famous for 'The Mother of All Green Chile Cheeseburgers' (buffalo-beef blend, brie, truffled green chile, chipotle). 24 regional craft beers on tap. Outdoor patio with kiva fireplaces."
        }
      ],

      history: {
        quick: "Santa Fe is the oldest state capital in the U.S., founded in 1610 — a decade before the Mayflower landed. The Palace of the Governors is the oldest continuously occupied public building in America.",
        full: "Santa Fe is the oldest state capital in the U.S., founded in 1610 — a full decade before the Mayflower landed. The Palace of the Governors on the plaza is the oldest continuously occupied public building in America. Georgia O'Keeffe lived and worked in the New Mexico high desert for decades; her museum is downtown. The city sits at 7,000 feet — you'll notice the air. Julia's along for the final leg, and you're approaching one of the most beautiful descents in the Southwest: the Low Road to Taos. O'Keeffe once wrote: 'When I got to New Mexico, that was mine. As soon as I saw it, that was my country.'"
      },

      trivia: [
        "I-25 from Albuquerque to Santa Fe traces almost exactly the route of El Camino Real de Tierra Adentro — the royal road blazed by Spanish colonists in 1598. Supply caravans once took a year and a half to make the round trip from Mexico City to Santa Fe, making this corridor the lifeline of a colony for over 200 years.",
        "The ghost town of Waldo, NM — whose name still appears on an I-25 exit sign near Cerrillos — was a railroad siding named after NM territorial judge Henry L. Waldo. It briefly had a school, hotel, and post office after 1883, then died entirely when the Madrid coal mines closed in 1954.",
        "Georgia O'Keeffe first visited New Mexico in 1917 and said: 'When I got to New Mexico, that was mine. As soon as I saw it, that was my country.' She purchased Ghost Ranch near Abiquiú in 1940 and lived in the New Mexico high desert for the rest of her life, signing letters 'from the faraway nearby.'"
      ],

      scenic: [
        { label: "Sangre de Cristo first glimpse", detail: "Cresting La Bajada mesa on I-25, the Sangre de Cristo Mountains appear suddenly to the northeast — a long, snow-streaked ridgeline at 13,000 feet framing the final approach to Santa Fe. The name means 'Blood of Christ,' for the crimson alpenglow at dusk.", icon: '🏔' },
        { label: 'La Bajada escarpment', detail: 'As I-25 climbs toward Santa Fe, the black volcanic cliffs of La Bajada rise ahead — the geologic boundary between the lower Rio Grande basin and the high Santa Fe plateau. Every trader, conquistador, and Route 66 driver has faced this climb for 400 years.', icon: '⛰' },
        { label: 'Sandia sunset wall', detail: "Northbound on I-25 as you leave ABQ, the entire east face of the Sandia range hangs to your right — granite cliffs shifting from dusty pink to deep crimson to purple as the sun drops, with a thin green conifer line along the crest completing the 'watermelon' effect.", icon: '🌄' }
      ],

      pois: [
        {
          name: 'Palace of the Governors',
          coords: { lat: 35.6870, lng: -105.9378 },
          description: "Oldest continuously occupied public building in America, on the Santa Fe Plaza. Native vendors sell handmade jewelry under the portal daily — a tradition that's been ongoing for over a century.",
          hook: "This building was under construction when the Pilgrims were still in Holland. The portal out front has been a trading spot continuously since the Spanish colonial era."
        },
        {
          name: "Georgia O'Keeffe Museum",
          coords: { lat: 35.6893, lng: -105.9395 },
          description: "Dedicated to the artist who defined the visual language of the American Southwest. Features over 3,000 O'Keeffe works plus the archives of her extraordinary New Mexico life.",
          hook: "O'Keeffe painted the same New Mexico landscapes for decades — not from repetition but from obsession. Ghost Ranch and her Abiquiú home (55 miles northwest) are still visitable by reservation."
        },
        {
          name: 'Coronado Historic Site (Kuaua Pueblo)',
          coords: { lat: 35.3294, lng: -106.5575 },
          description: "On the west bank of the Rio Grande in Bernalillo (Exit 242 off I-25), Kuaua Pueblo was occupied from around 1300 AD until the late 1500s. Coronado and 500 soldiers camped near here in 1540. A reconstructed kiva preserves extraordinary Pre-Columbian murals — among the finest indigenous North American art ever found.",
          hook: "The kiva murals were buried under 17 successive layers of painted plaster — each layer a new ceremonial repaint, like an ancient art palimpsest."
        },
        {
          name: 'Kasha-Katuwe Tent Rocks',
          coords: { lat: 35.6584, lng: -106.4230 },
          description: "Cone-shaped pumice-and-tuff rock formations — some over 90 feet tall — created by volcanic eruptions 6–7 million years ago, about 40 miles southwest of Santa Fe. 'Kasha-Katuwe' means 'white cliffs' in Keresan. The slot canyon trail is a standout hike.",
          hook: "These eerily perfect cones look computer-generated — they form when a hard capstone protects softer pumice underneath from erosion. Nature's version of a hat rack."
        },
        {
          name: 'La Bajada Mesa Escarpment',
          coords: { lat: 35.5100, lng: -106.1700 },
          description: "A dramatic 600-foot volcanic escarpment visible from I-25 about 10 miles southwest of Santa Fe. For 400 years, every traveler between ABQ and Santa Fe had to climb this cliff. The original Route 66 had 23 switchbacks over it between 1926 and 1932.",
          hook: "The 23-hairpin Route 66 climb up La Bajada was notorious for boiling radiators and overturned wagons — the engineering challenge that prompted building the modern I-25 bypass."
        },
        {
          name: 'Cerrillos Hills State Park',
          coords: { lat: 35.4450, lng: -106.1270 },
          description: "1,116 acres atop a collapsed ancient volcano with 1,100+ years of continuous turquoise and lead mining history. The same mines supplied Native Puebloans, Spanish colonists, and 19th-century prospectors. Panoramic views of the Sandia, Ortiz, Jemez, and Sangre de Cristo ranges.",
          hook: "Cerrillos turquoise was traded as far as Chaco Canyon and the Gulf of Mexico long before Spanish contact — it was New Mexico's first 'export economy.'"
        }
      ]
    },

    /* ── STAGE 5: Santa Fe → Taos ──────────────────────────────────────────── */
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
        full: "NM-68, the 'Low Road,' follows the Rio Grande through a dramatic gorge carved by volcanic activity 5 million years ago. The Taos Pueblo, your destination, has been continuously inhabited for over 1,000 years — a UNESCO World Heritage Site and one of the oldest living communities in North America. D.H. Lawrence lived near Taos in the 1920s and called it 'the most beautiful place I have ever seen.' He's buried at his Kiowa Ranch about 18 miles north of town — his ashes are mixed into the concrete of a small memorial chapel that still stands. The Española valley you pass through was the site of the first Spanish capital of New Mexico in 1598, predating both Santa Fe and Jamestown."
      },

      trivia: [
        "NM-68 follows the Rio Grande Gorge, carved by the Rio Grande Rift — a crack in the Earth's crust that's still actively widening at about 1–2mm per year. Taos and Albuquerque are, geologically speaking, slowly drifting further apart.",
        "Española, the small city you pass through, sits near where Don Juan de Oñate established the first permanent Spanish capital of New Mexico in 1598 — at Ohkay Owingeh Pueblo. New Mexico's colonial capital predates Santa Fe by a decade and Jamestown, Virginia (1607) by nine years.",
        "D.H. Lawrence was given his Kiowa Ranch near Taos in 1924 in exchange for the manuscript of 'Sons and Lovers.' He died in France in 1930, and his wife Frieda had his ashes mixed into concrete in a chapel on the property. She later bequeathed the ranch to the University of New Mexico, where it still stands."
      ],

      scenic: [
        { label: 'Rio Grande Gorge canyon entrance', detail: 'About 8 miles south of Taos, NM-68 drops off the mesa and the canyon walls close in — the river appears below on the left, basalt walls rise on both sides, and the road hugs the cliff face. Pull-offs on the east side offer sheer drop views into the gorge.', icon: '🏔' },
        { label: 'Velarde valley orchards', detail: 'Between Rinconada and Velarde, the highway is lined with apple and peach orchards. In late May the trees are green and flowering. The gorge walls close around the orchards, creating a lush microclimate completely at odds with the surrounding high desert.', icon: '🍎' },
        { label: 'San Francisco de Asís Church buttresses', detail: 'Right on NM-68 in Ranchos de Taos, about 4 miles south of the Plaza. The massive rear adobe buttresses have been painted by O\'Keeffe and photographed by Ansel Adams. O\'Keeffe said the back of this church was "one of the most beautiful buildings left in the United States by the early Spaniards."', icon: '⛪' }
      ],

      pois: [
        {
          name: 'Rio Grande Gorge Bridge',
          coords: { lat: 36.4358, lng: -105.7225 },
          description: "800-ft volcanic gorge with one of the highest bridges in the U.S. highway system on US-64 — unmissable. The bridge deck sits 650 feet above the river. Short walk to the center and back.",
          hook: "The gorge was formed by the same Rio Grande Rift that's slowly pulling New Mexico apart — and the bridge, when it opened in 1965, was the highest in the U.S. highway system."
        },
        {
          name: 'Taos Pueblo',
          coords: { lat: 36.4425, lng: -105.5464 },
          description: "UNESCO World Heritage Site. Continuously inhabited for 1,000+ years. Multi-story adobe dwellings built between 1000–1450 AD still in active use. About 150 people live full-time inside the Pueblo without running water or electricity, by choice. Tours led by tribal members daily.",
          hook: "The only UNESCO World Heritage Site in the U.S. cited primarily for living Native American culture — these aren't ruins, they're homes. The same families have been here for a thousand years."
        },
        {
          name: 'San Francisco de Asís Church',
          coords: { lat: 36.3614, lng: -105.6180 },
          description: "An 18th-century adobe mission church (completed ~1815) whose massive rear buttresses have been painted by Georgia O'Keeffe and photographed by Ansel Adams — arguably the most-photographed church in the United States. Still an active parish. Community re-plasters the adobe by hand each year.",
          hook: "O'Keeffe painted this church's back wall multiple times, saying it was 'one of the most beautiful buildings left in the United States by the early Spaniards.' It's right on NM-68 — don't drive past it."
        },
        {
          name: 'Nambé Falls Recreation Area',
          coords: { lat: 35.8433, lng: -105.9045 },
          description: "A 175-ft multi-tiered waterfall set in the foothills of the Sangre de Cristo Mountains on the Nambé Pueblo Reservation, about 18 miles north of Santa Fe off US-84/285 and NM-503. Open Thu–Sun; $20/vehicle. Short quarter-mile trails to the falls.",
          hook: "The Pueblo of Nambé has been continuously inhabited since around 1300 CE — the falls have been a sacred site for over 700 years, and the tribe only opened them to outside visitors relatively recently."
        },
        {
          name: 'Velarde Orchards & Rio Grande Fruit Stands',
          coords: { lat: 36.1750, lng: -105.9700 },
          description: "Fourth-generation family fruit stands strung along NM-68 between Rinconada and Velarde, selling apples, peaches, pears, ristras, and cider from orchards planted in the late 1920s. The Velarde valley is where NM-68 first enters the Rio Grande Gorge.",
          hook: "Before paved roads, Velarde farmers loaded mules and walked produce to the narrow-gauge railroad at Embudo Station — the same gorge route NM-68 now follows."
        },
        {
          name: "D.H. Lawrence Ranch (Kiowa Ranch)",
          coords: { lat: 36.6200, lng: -105.5800 },
          description: "The 160-acre ranch given to Lawrence in 1924 (in exchange for the manuscript of 'Sons and Lovers') where he wrote 'St. Mawr' and parts of 'The Plumed Serpent.' His ashes are embedded in a small memorial chapel on the property. The University of New Mexico owns and operates it. About 18 miles north of Taos off NM-522.",
          hook: "Lawrence called Taos 'the most beautiful place I have ever seen.' He died in France in 1930, but his wife Frieda made sure he ended up here — mixed into concrete, looking out at the mountains forever."
        }
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
  ],

  // ── TAOS DESTINATION ─────────────────────────────────────────────────────
  taos: {
    coords: { lat: 36.4072, lng: -105.5731 },
    pueblo: {
      hours: '9:00 AM – 4:00 PM daily (check taospueblo.com — closes for ceremonies)',
      admission: '~$25/adult · guided tours led by tribal members',
      url: 'https://taospueblo.com',
      tip: 'Arrive early — the morning light on the north house adobe is extraordinary, and crowds thin toward midday.'
    },
    dining: [
      {
        type: 'Sit-down · Historic',
        name: "Doc Martin's",
        address: '125 Paseo del Pueblo Norte (Historic Taos Inn)',
        walk: 'On the Plaza',
        hours: 'Dinner from 5:30 PM',
        service: 'Full service',
        note: "Inside the legendary 1936 Historic Taos Inn. New Mexican fine dining — the green chile stew and posole are benchmarks. Order the Taos margarita. Reservations strongly recommended."
      },
      {
        type: 'Casual · New Mexican',
        name: "Orlando's New Mexican Café",
        address: '1114 Don Juan Valdez Ln',
        walk: '5 min drive north of Plaza',
        hours: 'Lunch & dinner, closed Mon',
        service: '~20 min',
        note: "Local favorite for decades. Best red chile in Taos — unpretentious, cash-friendly, always packed. The Christmas plate (red and green) is the move."
      },
      {
        type: 'Craft beer · Casual',
        name: 'Taos Mesa Brewing',
        address: '20 ABC Mesa Rd (West Mesa location)',
        walk: '10 min drive',
        hours: 'Daily 11 AM – 9 PM',
        service: 'Bar & kitchen',
        note: "Award-winning New Mexico craft brewery with a massive outdoor mesa patio and live music most nights. Perfect for a relaxed end to a long day — flights of local beer, good burgers, big sky views."
      },
      {
        type: 'Upscale · Patio',
        name: "Lambert's of Taos",
        address: '123 Bent St',
        walk: '2 min from Plaza',
        hours: 'Dinner from 5:30 PM',
        service: 'Full service',
        note: "Taos's most celebrated restaurant for 30+ years. Contemporary American with strong NM influences. The duck confit and green chile mac & cheese are standouts. Excellent wine list."
      }
    ]
  },

  // ── MILESTONES ─────────────────────────────────────────────────────────────
  // Fired once each via GPS proximity or stage change. id must be unique.
  milestones: [
    {
      id: 'white-mountains',
      type: 'stage',
      stage: 1,
      icon: '🌲',
      title: 'White Mountains',
      detail: 'Salt River Canyon coming up — Arizona\'s most dramatic 5 miles of road.'
    },
    {
      id: 'new-mexico',
      type: 'proximity',
      coords: { lat: 34.00, lng: -109.05 },
      radiusMiles: 4,
      icon: '🌵',
      title: 'Welcome to New Mexico!',
      detail: 'Land of Enchantment. The whole vibe just changed.'
    },
    {
      id: 'halfway',
      type: 'miles',
      miles: 287,
      icon: '🎉',
      title: 'Halfway to Taos!',
      detail: 'You\'ve crossed 287 miles. The hard climbs are behind you.'
    },
    {
      id: 'continental-divide',
      type: 'proximity',
      coords: { lat: 34.2997, lng: -108.1330 },
      radiusMiles: 4,
      icon: '⛰',
      title: 'Continental Divide!',
      detail: 'Rain east of here flows to the Gulf of Mexico.'
    },
    {
      id: 'rio-grande',
      type: 'stage',
      stage: 3,
      icon: '🌊',
      title: 'Rio Grande Valley',
      detail: 'Following the river north — Albuquerque in ~75 miles.'
    },
    {
      id: 'julia-incoming',
      type: 'proximity',
      coords: { lat: 35.1340, lng: -106.5760 },
      radiusMiles: 8,
      icon: '✈️',
      title: 'ABQ ahead!',
      detail: 'Julia lands at 5:00 PM · ABQ Sunport is ~10 miles from the charger.'
    },
    {
      id: 'final-leg',
      type: 'stage',
      stage: 5,
      icon: '🏁',
      title: 'Final leg!',
      detail: 'Santa Fe → Taos on the Low Road. Rio Grande Gorge in ~40 miles.'
    },
    {
      id: 'taos-arrival',
      type: 'proximity',
      coords: { lat: 36.4072, lng: -105.5731 },
      radiusMiles: 4,
      icon: '🎊',
      title: 'Welcome to Taos!',
      detail: 'You drove 575 miles through the American Southwest. Well done.'
    }
  ]
};
