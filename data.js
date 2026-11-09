/* Gardens by the Bay — Bay South Explorer data */
window.GBTB = {
  categories: {
    attraction: { label: "Attractions", color: "#ff4fd8", icon: "spark" },
    nature:     { label: "Gardens & Nature", color: "#3ddc84", icon: "leaf" },
    dining:     { label: "Food & Drink", color: "#ffb02e", icon: "bowl" },
    essential:  { label: "Visitor Essentials", color: "#38c8e8", icon: "info" }
  },
  places: [
    {
      id: "flower-dome", name: "Flower Dome", cat: "attraction", x: 55.3, y: 21.5,
      tagline: "The world's largest glass greenhouse",
      desc: "Step into a cool, dry Mediterranean climate beneath a sweeping gridshell of glass — recognised by Guinness World Records as the largest glass greenhouse on Earth. Nine gardens, from baobabs to olive groves, surround the Flower Field, where spectacular displays change with the seasons.",
      highlights: ["Guinness-record glasshouse — 1.2 hectares under glass", "Seasonal Flower Field shows: tulips, cherry blossoms & more", "Ancient baobabs, olive groves and a succulent garden", "Dine among the blooms at Marguerite and Hortus"],
      hours: "Daily · 9:00 AM – 9:00 PM", duration: "1 – 1.5 hours", durationMin: 75,
      cost: "Ticketed · from S$12", best: "Late afternoon, stay for dusk", free: false,
      img: "assets/img/flower-dome.webp", keywords: "greenhouse conservatory tulips sakura cherry blossom baobab mediterranean"
    },
    {
      id: "cloud-forest", name: "Cloud Forest", cat: "attraction", x: 67.5, y: 29.5,
      tagline: "A mist-wrapped mountain with a roaring waterfall",
      desc: "A 35-metre mountain cloaked in lush vegetation, crowned by one of the world's tallest indoor waterfalls. Ride to the top, then drift down through the mist on aerial walkways, discovering rare orchids, pitcher plants and the secret life of tropical highlands.",
      highlights: ["30-metre indoor waterfall — feel the mist on your face", "Cloud Walk and Treetop Walk aerial trails", "The Lost World: rare carnivorous plants & orchids", "Glass Skywalk with views straight down"],
      hours: "Daily · 9:00 AM – 9:00 PM", duration: "1 – 1.5 hours", durationMin: 75,
      cost: "Ticketed · from S$12", best: "Morning, before the crowds", free: false,
      img: "assets/img/cloud-forest.webp", keywords: "waterfall mountain mist orchid walkway conservatory"
    },
    {
      id: "supertree-grove", name: "Supertree Grove", cat: "attraction", x: 45.5, y: 38.5,
      tagline: "The Gardens' iconic living sculptures",
      desc: "Twelve of the Gardens' eighteen Supertrees gather here — vertical gardens up to 50 metres tall that harvest solar energy, collect rainwater and help cool the conservatories. After dark they come alive in Garden Rhapsody, a free light-and-sound symphony.",
      highlights: ["Garden Rhapsody nightly · 7:45 & 8:45 PM", "Free to wander beneath the glowing canopies", "Over 162,000 plants of 200+ species on the trees", "Best photo ritual: lie back on the lawn at dusk"],
      hours: "Daily · 5:00 AM – 2:00 AM", duration: "30 – 45 min", durationMin: 40,
      cost: "Free", best: "Dusk, for Garden Rhapsody", free: true,
      img: "assets/img/supertree-grove.webp", keywords: "supertree avatar light show rhapsody night garden"
    },
    {
      id: "ocbc-skyway", name: "OCBC Skyway", cat: "attraction", x: 38.5, y: 28.5,
      tagline: "A 128-metre walk among the Supertrees",
      desc: "Suspended 22 metres above the gardens, this golden aerial walkway links two Supertrees and floats you through the grove's canopies. Time it for golden hour — or stay after dark and watch Garden Rhapsody from above.",
      highlights: ["128 metres long, 22 metres above ground", "Panoramic views of the grove and Marina Bay", "Magical during the evening light show", "Lift access up to the skyway deck"],
      hours: "Daily · 9:00 AM – 9:00 PM", duration: "20 – 30 min", durationMin: 25,
      cost: "Ticketed · from S$14", best: "Sunset or after dark", free: false,
      img: "assets/img/ocbc-skyway.webp", keywords: "skyway bridge walkway aerial supertree view"
    },
    {
      id: "supertree-observatory", name: "Supertree Observatory", cat: "attraction", x: 49.5, y: 26.5,
      tagline: "The highest view in the Gardens",
      desc: "Ride to the top of the tallest Supertree — 50 metres up — for an open-air, 360-degree panorama of the Gardens, the straits and the Marina Bay skyline. An indoor gallery and rooftop deck make it the Gardens' best-kept viewpoint.",
      highlights: ["360° views from 50 metres up", "Open-air rooftop deck and indoor gallery", "See the whole of Bay South at a glance", "Spectacular at golden hour"],
      hours: "Daily · 9:00 AM – 9:00 PM", duration: "30 min", durationMin: 30,
      cost: "Ticketed · from S$14", best: "Golden hour", free: false,
      img: "assets/img/supertree-observatory.webp", keywords: "observatory viewpoint tallest supertree panorama rooftop"
    },
    {
      id: "floral-fantasy", name: "Floral Fantasy", cat: "attraction", x: 23.5, y: 34.5,
      tagline: "A dreamscape of suspended blooms",
      desc: "Four themed landscapes — Dance, Drift, Float and Waltz — weave through a cave of hanging bouquets, a stream-side garden and a mirrored hall of floating flowers. Over 150 species of fresh and preserved blooms in ever-changing floral artistry.",
      highlights: ["Suspended garden of 100+ bouquet clusters", "Four immersive themed zones", "Seasonal floral artistry and installations", "Air-conditioned escape near Bayfront"],
      hours: "Daily · 10:00 AM – 7:00 PM", duration: "45 min – 1 hour", durationMin: 50,
      cost: "Ticketed · from S$20", best: "A midday cool-down", free: false,
      img: "assets/img/floral-fantasy.webp", keywords: "flowers suspended bouquets dance drift float waltz"
    },
    {
      id: "childrens-garden", name: "Children's Garden", cat: "attraction", x: 59.5, y: 50.5,
      tagline: "A rainforest playground with a splash zone",
      desc: "Little explorers climb through a rainforest treehouse, race along adventure trails and cool off in the splash fountain zone. A free, family-favourite garden designed for play in nature — bring a swimsuit and a towel.",
      highlights: ["Free water-play splash zone", "Rainforest treehouse and climbing trails", "Toddler-friendly play areas", "Shaded amphitheatre for family shows"],
      hours: "Tue – Sun · 9:00 AM – 6:00 PM", duration: "1 – 2 hours", durationMin: 90,
      cost: "Free", best: "Morning splash before lunch", free: true,
      img: "assets/img/childrens-garden.webp", keywords: "kids family water play splash treehouse playground far east"
    },
    {
      id: "kingfisher-wetlands", name: "Kingfisher Wetlands", cat: "nature", x: 80.5, y: 42.5,
      tagline: "A sanctuary for Singapore's wild jewel",
      desc: "A tranquil wetland of lotus ponds, cascades and boardwalks created as a haven for kingfishers and wetland birds. Spot collared and white-throated kingfishers from the viewing hides, with the city skyline shimmering beyond the reeds.",
      highlights: ["Kingfisher-watching hides and boardwalks", "Lotus ponds and gentle cascades", "Over 200 species of wetland plants", "Free, quiet and beautifully photogenic"],
      hours: "Daily · 5:00 AM – 2:00 AM", duration: "30 – 45 min", durationMin: 40,
      cost: "Free", best: "Early morning for birdlife", free: true,
      img: "assets/img/kingfisher-wetlands.webp", keywords: "birds kingfisher wetland boardwalk lotus nature wildlife"
    },
    {
      id: "dragonfly-lake", name: "Dragonfly Lake", cat: "nature", x: 37.5, y: 20.5,
      tagline: "The Gardens' mirror to the sky",
      desc: "The largest of the Gardens' lakes, shaped by dragonfly-friendly wetlands and planted islands. Its calm water doubles the Supertrees and conservatories in reflection — the classic postcard view of Bay South.",
      highlights: ["Iconic reflection views of the conservatories", "Dragonfly and damselfly habitats", "Lakeside promenade strolls", "Look for the silver floating sculptures"],
      hours: "Daily · 5:00 AM – 2:00 AM", duration: "20 – 30 min", durationMin: 25,
      cost: "Free", best: "Sunrise or blue hour", free: true,
      img: "assets/img/dragonfly-lake.webp", keywords: "lake water reflection dragonfly promenade"
    },
    {
      id: "heritage-gardens", name: "Heritage Gardens", cat: "nature", x: 87, y: 37.5,
      tagline: "Singapore's stories, told in plants",
      desc: "Four themed gardens — Malay, Chinese, Indian and Colonial — trace the plant heritage of Singapore's communities. Wander from a kampung-style Malay garden to a Chinese scholar's garden, an Indian courtyard of marigolds and a colonial planter's garden.",
      highlights: ["Four distinct cultural gardens in one", "Plants used in food, medicine and ritual", "Traditional pavilions and moon gates", "Free, and rarely crowded"],
      hours: "Daily · 5:00 AM – 2:00 AM", duration: "45 min – 1 hour", durationMin: 50,
      cost: "Free", best: "Late-afternoon shade", free: true,
      img: "assets/img/heritage-gardens.webp", keywords: "malay chinese indian colonial culture heritage pavilion"
    },
    {
      id: "sun-pavilion", name: "Sun Pavilion & World of Plants", cat: "nature", x: 82, y: 27.5,
      tagline: "A desert under glass",
      desc: "The Sun Pavilion shelters one of the region's largest collections of cacti and succulents — golden barrels, towering columnar cacti and strange desert forms. Around it, the World of Plants gardens explore how plants survive, from understorey shade to arid sand.",
      highlights: ["Giant golden barrel and columnar cacti", "World of Plants themed gardens", "Secret Life of Trees and Web of Life trails", "Free, shaded glasshouse"],
      hours: "Daily · 5:00 AM – 2:00 AM", duration: "30 – 45 min", durationMin: 40,
      cost: "Free", best: "Anytime — shaded and cool", free: true,
      img: "assets/img/sun-pavilion.webp", keywords: "cactus succulent desert glasshouse world of plants"
    },
    {
      id: "serene-garden", name: "Serene Garden", cat: "nature", x: 86, y: 22.5,
      tagline: "A Japanese-inspired moment of calm",
      desc: "Inspired by Japanese garden design, this quiet retreat layers maples, pines, gravel and stone around a still pond. A favourite spot for meditation, sketching and slow walks away from the main paths.",
      highlights: ["Japanese-inspired landscape design", "Koi pond and stone arrangements", "Quiet meditation corners", "Beautiful in soft morning light"],
      hours: "Daily · 5:00 AM – 2:00 AM", duration: "20 – 30 min", durationMin: 25,
      cost: "Free", best: "Early-morning quiet", free: true,
      img: "assets/img/serene-garden.webp", keywords: "japanese zen koi pond meditation calm maple"
    },
    {
      id: "the-meadow", name: "The Meadow", cat: "nature", x: 30.5, y: 63.5,
      tagline: "Bay South's great green lawn",
      desc: "The Gardens' largest open lawn — a rolling green stage for picnics, outdoor cinema, concerts and community festivals. On quiet days it's simply the best place to lie back and watch the Supertrees glow.",
      highlights: ["Largest outdoor lawn in the Gardens", "Picnic-perfect, with skyline views", "Hosts seasonal festivals and open-air shows", "Steps from Satay by the Bay"],
      hours: "Daily · 5:00 AM – 2:00 AM", duration: "30 min – 2 hours", durationMin: 45,
      cost: "Free", best: "Golden-hour picnics", free: true,
      img: "assets/img/the-meadow.webp", keywords: "lawn picnic concert festival outdoor events"
    },
    {
      id: "active-garden", name: "Active Garden", cat: "nature", x: 64.5, y: 49.5,
      tagline: "Move, play and gather outdoors",
      desc: "A community lawn with outdoor fitness stations, open space for tai chi, yoga and games, and a calendar of free wellness sessions. The Gardens at their most local — join a morning stretch or just watch the city move.",
      highlights: ["Outdoor fitness and wellness corner", "Free community exercise sessions", "Open lawn for games and picnics", "Right by the Children's Garden"],
      hours: "Daily · 5:00 AM – 2:00 AM", duration: "30 – 45 min", durationMin: 35,
      cost: "Free", best: "Cool mornings", free: true,
      img: null, keywords: "fitness yoga tai chi exercise community wellness"
    },
    {
      id: "golden-garden", name: "Golden Garden", cat: "nature", x: 18.5, y: 61.5,
      tagline: "A shimmering drift of gold",
      desc: "A themed garden celebrating plants with golden foliage — a living palette that glows in the late sun. Paired with the neighbouring Silver Garden, it makes a striking photo walk beside The Meadow.",
      highlights: ["Gold-foliage plant collections", "Striking in late-afternoon light", "Quiet paths beside The Meadow", "Free to explore"],
      hours: "Daily · 5:00 AM – 2:00 AM", duration: "15 – 20 min", durationMin: 20,
      cost: "Free", best: "Late-afternoon glow", free: true,
      img: null, keywords: "golden yellow foliage themed garden"
    },
    {
      id: "silver-garden", name: "Silver Garden", cat: "nature", x: 23.5, y: 66.5,
      tagline: "Moonlit tones in living grey",
      desc: "Silvery-leaved plants — from artemisia to dusty miller — create a cool, moonlit garden that contrasts with the tropical greens around it. A small, contemplative space best enjoyed slowly.",
      highlights: ["Silver-foliage plant collection", "Cool-toned contrast to the tropics", "Peaceful photo corners", "Free to explore"],
      hours: "Daily · 5:00 AM – 2:00 AM", duration: "15 – 20 min", durationMin: 20,
      cost: "Free", best: "Overcast days and dusk", free: true,
      img: null, keywords: "silver grey foliage artemisia dusty miller"
    },
    {
      id: "satay-by-the-bay", name: "Satay by the Bay", cat: "dining", x: 15.5, y: 45.5,
      tagline: "Hawker classics under the stars",
      desc: "An open-air hawker haven beside The Meadow, famous for smoky charcoal satay, BBQ stingray, Hokkien mee and ice-cold sugarcane. Grab a table under the trees and eat like a local after a day in the Gardens.",
      highlights: ["Legendary charcoal-grilled satay", "BBQ seafood and local hawker favourites", "Open-air tables under the trees", "Budget-friendly, family-style dining"],
      hours: "Daily · 10:30 AM – 11:00 PM", duration: "45 min – 1 hour", durationMin: 60,
      cost: "S$5 – 15 per person", best: "Dinner after Garden Rhapsody", free: true,
      img: "assets/img/satay-by-the-bay.webp", keywords: "food hawker satay bbq seafood dinner local"
    },
    {
      id: "mcdonalds", name: "McDonald's", cat: "dining", x: 56.5, y: 56.5,
      tagline: "A quick, familiar bite",
      desc: "A handy air-conditioned stop near the Main Entrance for families and groups who need a fast, familiar meal between gardens. Halal-certified.",
      highlights: ["Fast, familiar menu", "Air-conditioned seating", "Near the Main Entrance", "Halal-certified"],
      hours: "Daily · 7:00 AM – 10:00 PM", duration: "20 – 30 min", durationMin: 25,
      cost: "S$5 – 12 per person", best: "A quick refuel", free: true,
      img: null, keywords: "fast food burger fries halal quick meal"
    },
    {
      id: "starbucks", name: "Starbucks", cat: "dining", x: 27.5, y: 27.5,
      tagline: "Coffee with a garden view",
      desc: "Pick up a cold brew or frappuccino and take it to the lawns — a convenient caffeine stop on the Floral Fantasy side of the Gardens.",
      highlights: ["Coffee, teas and cold drinks", "Grab-and-go for picnics", "Air-conditioned break", "Near Floral Fantasy"],
      hours: "Daily · 8:00 AM – 9:00 PM", duration: "15 – 20 min", durationMin: 15,
      cost: "S$6 – 10 per person", best: "Morning pick-me-up", free: true,
      img: null, keywords: "coffee cafe latte cold brew drinks"
    },
    {
      id: "bayfront-plaza", name: "Bayfront Plaza", cat: "essential", x: 62.5, y: 42.5,
      tagline: "Your arrival hub at Bay South",
      desc: "The main arrival point from Bayfront MRT and the Marina Bay overpass. Find ticketing, the gift shop, visitor information and shuttle pick-ups here — everything you need to start your Gardens day.",
      highlights: ["Direct link from Bayfront MRT (CE1 / DT16)", "Ticketing hub and gift shop", "Visitor information counter", "Shuttle and taxi drop-off nearby"],
      hours: "Daily · 8:30 AM – 9:00 PM", duration: "10 – 15 min", durationMin: 15,
      cost: "Free", best: "Start your visit here", free: true,
      img: null, keywords: "mrt arrival entrance tickets information gift shop shuttle"
    }
  ]
};