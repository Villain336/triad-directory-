export interface City {
  name: string;
  slug: string;
  county: string;
  region: string;
  description: string;
  population: number;
  latitude: number;
  longitude: number;
  featured: boolean;
}

export const cities: City[] = [
  // Major Cities
  {
    name: "Greensboro",
    slug: "greensboro",
    county: "Guilford",
    region: "triad",
    description:
      "Greensboro is the largest city in the Triad and a hub for business, education, and culture. Find top-rated local services and businesses in Greensboro, NC.",
    population: 299035,
    latitude: 36.0726,
    longitude: -79.792,
    featured: true,
  },
  {
    name: "Winston-Salem",
    slug: "winston-salem",
    county: "Forsyth",
    region: "triad",
    description:
      "Winston-Salem is known for its arts scene, innovation district, and thriving local business community. Discover trusted services in Winston-Salem, NC.",
    population: 249877,
    latitude: 36.0999,
    longitude: -80.2442,
    featured: true,
  },
  {
    name: "High Point",
    slug: "high-point",
    county: "Guilford",
    region: "triad",
    description:
      "High Point is the Furniture Capital of the World and home to a diverse business community. Find reliable local services in High Point, NC.",
    population: 114059,
    latitude: 35.9557,
    longitude: -80.0053,
    featured: true,
  },
  {
    name: "Burlington",
    slug: "burlington",
    county: "Alamance",
    region: "triad",
    description:
      "Burlington is a growing city in the eastern Triad with a strong business community and rich history. Browse local services in Burlington, NC.",
    population: 57303,
    latitude: 36.0957,
    longitude: -79.4378,
    featured: true,
  },
  // Secondary Cities
  {
    name: "Thomasville",
    slug: "thomasville",
    county: "Davidson",
    region: "triad",
    description:
      "Thomasville, the Chair City, offers a tight-knit community with excellent local businesses and services.",
    population: 27124,
    latitude: 35.8826,
    longitude: -80.0817,
    featured: false,
  },
  {
    name: "Lexington",
    slug: "lexington",
    county: "Davidson",
    region: "triad",
    description:
      "Lexington is the Barbecue Capital of the World and a growing hub for small businesses in Davidson County.",
    population: 19644,
    latitude: 35.824,
    longitude: -80.2534,
    featured: false,
  },
  {
    name: "Asheboro",
    slug: "asheboro",
    county: "Randolph",
    region: "triad",
    description:
      "Asheboro is home to the NC Zoo and a vibrant local business scene. Find services and trades in Asheboro, NC.",
    population: 25695,
    latitude: 35.7079,
    longitude: -79.8136,
    featured: false,
  },
  {
    name: "Kernersville",
    slug: "kernersville",
    county: "Forsyth",
    region: "triad",
    description:
      "Kernersville sits between Greensboro and Winston-Salem, offering convenient access to top local businesses and trades.",
    population: 24991,
    latitude: 36.1198,
    longitude: -80.0737,
    featured: false,
  },
  {
    name: "Clemmons",
    slug: "clemmons",
    county: "Forsyth",
    region: "triad",
    description:
      "Clemmons is a thriving community west of Winston-Salem with excellent local service providers and businesses.",
    population: 20914,
    latitude: 36.0218,
    longitude: -80.3821,
    featured: false,
  },
  {
    name: "Lewisville",
    slug: "lewisville",
    county: "Forsyth",
    region: "triad",
    description:
      "Lewisville is a charming town in Forsyth County with a growing business community and family-friendly atmosphere.",
    population: 13282,
    latitude: 36.097,
    longitude: -80.4191,
    featured: false,
  },
  {
    name: "Archdale",
    slug: "archdale",
    county: "Randolph",
    region: "triad",
    description:
      "Archdale is a welcoming community between High Point and Asheboro with reliable local service providers.",
    population: 11889,
    latitude: 35.9146,
    longitude: -79.9719,
    featured: false,
  },
  {
    name: "Trinity",
    slug: "trinity",
    county: "Randolph",
    region: "triad",
    description:
      "Trinity is a small but growing community in Randolph County with dedicated local businesses serving the area.",
    population: 6874,
    latitude: 35.8926,
    longitude: -79.9883,
    featured: false,
  },
  {
    name: "Randleman",
    slug: "randleman",
    county: "Randolph",
    region: "triad",
    description:
      "Randleman is a charming town in Randolph County, home of NASCAR legend Richard Petty and quality local services.",
    population: 4681,
    latitude: 35.8182,
    longitude: -79.8028,
    featured: false,
  },
  {
    name: "Jamestown",
    slug: "jamestown",
    county: "Guilford",
    region: "triad",
    description:
      "Jamestown is a historic community in Guilford County offering excellent local businesses and personalized service.",
    population: 3677,
    latitude: 35.9921,
    longitude: -79.9353,
    featured: false,
  },
  {
    name: "Oak Ridge",
    slug: "oak-ridge",
    county: "Guilford",
    region: "triad",
    description:
      "Oak Ridge is a growing community in northern Guilford County with top-notch local businesses and services.",
    population: 6785,
    latitude: 36.1735,
    longitude: -79.9886,
    featured: false,
  },
  {
    name: "Summerfield",
    slug: "summerfield",
    county: "Guilford",
    region: "triad",
    description:
      "Summerfield is an upscale community north of Greensboro with premium local service providers.",
    population: 11228,
    latitude: 36.2063,
    longitude: -79.9003,
    featured: false,
  },
  {
    name: "Pleasant Garden",
    slug: "pleasant-garden",
    county: "Guilford",
    region: "triad",
    description:
      "Pleasant Garden is a peaceful community south of Greensboro with trusted local businesses and trades.",
    population: 4709,
    latitude: 35.9621,
    longitude: -79.7622,
    featured: false,
  },
  {
    name: "Reidsville",
    slug: "reidsville",
    county: "Rockingham",
    region: "triad",
    description:
      "Reidsville is the largest city in Rockingham County with a solid local business community serving the northern Triad.",
    population: 14153,
    latitude: 36.3546,
    longitude: -79.6642,
    featured: false,
  },
  {
    name: "Eden",
    slug: "eden",
    county: "Rockingham",
    region: "triad",
    description:
      "Eden is a scenic city in Rockingham County where the Dan and Smith Rivers meet, home to dedicated local businesses.",
    population: 15039,
    latitude: 36.4888,
    longitude: -79.7667,
    featured: false,
  },
  {
    name: "Madison",
    slug: "madison",
    county: "Rockingham",
    region: "triad",
    description:
      "Madison is a historic community in Rockingham County with reliable local service providers and small businesses.",
    population: 2173,
    latitude: 36.3857,
    longitude: -79.9594,
    featured: false,
  },
  {
    name: "Mebane",
    slug: "mebane",
    county: "Alamance",
    region: "triad",
    description:
      "Mebane is one of the fastest-growing cities in the Triad, located along I-40/85 with excellent local businesses.",
    population: 17234,
    latitude: 36.0959,
    longitude: -79.2667,
    featured: false,
  },
  {
    name: "Graham",
    slug: "graham",
    county: "Alamance",
    region: "triad",
    description:
      "Graham is the county seat of Alamance County with a charming downtown and quality local service providers.",
    population: 16651,
    latitude: 36.0688,
    longitude: -79.4006,
    featured: false,
  },
  {
    name: "Elon",
    slug: "elon",
    county: "Alamance",
    region: "triad",
    description:
      "Elon is a vibrant college town in Alamance County home to Elon University and a growing business community.",
    population: 11731,
    latitude: 36.1032,
    longitude: -79.5068,
    featured: false,
  },
  {
    name: "Gibsonville",
    slug: "gibsonville",
    county: "Guilford",
    region: "triad",
    description:
      "Gibsonville sits at the crossroads of Guilford and Alamance counties with convenient access to local businesses.",
    population: 7706,
    latitude: 36.1057,
    longitude: -79.5422,
    featured: false,
  },
  {
    name: "Whitsett",
    slug: "whitsett",
    county: "Guilford",
    region: "triad",
    description:
      "Whitsett is a small community in eastern Guilford County with dedicated local service providers.",
    population: 876,
    latitude: 36.0674,
    longitude: -79.5667,
    featured: false,
  },
  {
    name: "Wallburg",
    slug: "wallburg",
    county: "Davidson",
    region: "triad",
    description:
      "Wallburg is a community in Davidson County between Winston-Salem and Thomasville with quality local businesses.",
    population: 3239,
    latitude: 35.9451,
    longitude: -80.1384,
    featured: false,
  },
  {
    name: "Mocksville",
    slug: "mocksville",
    county: "Davie",
    region: "triad",
    description:
      "Mocksville is the county seat of Davie County with a welcoming community and reliable local services.",
    population: 5313,
    latitude: 35.8943,
    longitude: -80.5615,
    featured: false,
  },
  {
    name: "King",
    slug: "king",
    county: "Stokes",
    region: "triad",
    description:
      "King is a growing community at the foothills of the Sauratown Mountains with excellent local businesses.",
    population: 7338,
    latitude: 36.2807,
    longitude: -80.3592,
    featured: false,
  },
  {
    name: "Rural Hall",
    slug: "rural-hall",
    county: "Forsyth",
    region: "triad",
    description:
      "Rural Hall is a charming town in northern Forsyth County with dedicated local businesses and service providers.",
    population: 3195,
    latitude: 36.2382,
    longitude: -80.2931,
    featured: false,
  },
  {
    name: "Bermuda Run",
    slug: "bermuda-run",
    county: "Davie",
    region: "triad",
    description:
      "Bermuda Run is an upscale community in Davie County with premium businesses and professional services.",
    population: 3311,
    latitude: 36.0013,
    longitude: -80.4218,
    featured: false,
  },
  {
    name: "Advance",
    slug: "advance",
    county: "Davie",
    region: "triad",
    description:
      "Advance is a growing community in Davie County with local businesses serving the western Triad area.",
    population: 1418,
    latitude: 35.9435,
    longitude: -80.4094,
    featured: false,
  },
  // ===== RESEARCH TRIANGLE =====
  { name: "Raleigh", slug: "raleigh", county: "Wake", region: "triangle", description: "Raleigh is the capital of North Carolina and the heart of the Research Triangle. Find top-rated service businesses, contractors, and professionals in Raleigh.", population: 467665, latitude: 35.7796, longitude: -78.6382, featured: true },
  { name: "Durham", slug: "durham", county: "Durham", region: "triangle", description: "Durham is a vibrant city known for Duke University, Research Triangle Park, and a thriving local business community.", population: 283506, latitude: 35.994, longitude: -78.8986, featured: true },
  { name: "Cary", slug: "cary", county: "Wake", region: "triangle", description: "Cary is one of the fastest-growing cities in NC with excellent services, top-rated schools, and a strong business community.", population: 174721, latitude: 35.7915, longitude: -78.7811, featured: true },
  { name: "Chapel Hill", slug: "chapel-hill", county: "Orange", region: "triangle", description: "Chapel Hill is home to UNC and offers a vibrant mix of local businesses, restaurants, and professional services.", population: 61960, latitude: 35.9132, longitude: -79.0558, featured: false },
  { name: "Apex", slug: "apex", county: "Wake", region: "triangle", description: "Apex is the Peak of Good Living — a fast-growing town with excellent local services and a charming downtown.", population: 73890, latitude: 35.7327, longitude: -78.8503, featured: false },
  { name: "Morrisville", slug: "morrisville", county: "Wake", region: "triangle", description: "Morrisville is centrally located in the Triangle near RDU Airport with a diverse and growing business community.", population: 30475, latitude: 35.8235, longitude: -78.8256, featured: false },
  { name: "Holly Springs", slug: "holly-springs", county: "Wake", region: "triangle", description: "Holly Springs is one of Wake County's fastest-growing towns with excellent local services and new development.", population: 42276, latitude: 35.6513, longitude: -78.8336, featured: false },
  { name: "Fuquay-Varina", slug: "fuquay-varina", county: "Wake", region: "triangle", description: "Fuquay-Varina is a charming southern Wake County town with a growing business community and family-friendly atmosphere.", population: 35710, latitude: 35.5843, longitude: -78.7999, featured: false },
  { name: "Wake Forest", slug: "wake-forest", county: "Wake", region: "triangle", description: "Wake Forest is a historic town in northern Wake County with excellent schools and reliable local service providers.", population: 51846, latitude: 35.9799, longitude: -78.5097, featured: false },
  { name: "Garner", slug: "garner", county: "Wake", region: "triangle", description: "Garner is a growing community south of Raleigh with convenient access to Triangle businesses and services.", population: 33543, latitude: 35.7113, longitude: -78.614, featured: false },
  { name: "Clayton", slug: "clayton", county: "Johnston", region: "triangle", description: "Clayton is one of the fastest-growing towns in the Triangle area with a booming housing market and local services.", population: 26889, latitude: 35.6507, longitude: -78.4564, featured: false },
  { name: "Knightdale", slug: "knightdale", county: "Wake", region: "triangle", description: "Knightdale is a growing eastern Wake County town with quality local businesses and services.", population: 19053, latitude: 35.7968, longitude: -78.4897, featured: false },
  { name: "Wendell", slug: "wendell", county: "Wake", region: "triangle", description: "Wendell is a small-town community east of Raleigh with dedicated local service providers.", population: 10228, latitude: 35.7813, longitude: -78.3697, featured: false },
  { name: "Zebulon", slug: "zebulon", county: "Wake", region: "triangle", description: "Zebulon is a growing eastern Wake County community with friendly local businesses.", population: 6802, latitude: 35.8243, longitude: -78.3147, featured: false },
  { name: "Youngsville", slug: "youngsville", county: "Franklin", region: "triangle", description: "Youngsville is a rapidly growing community in Franklin County with convenient access to Triangle services.", population: 2834, latitude: 36.0246, longitude: -78.4747, featured: false },
  { name: "Rolesville", slug: "rolesville", county: "Wake", region: "triangle", description: "Rolesville is a fast-growing town in northeastern Wake County with excellent local service providers.", population: 9338, latitude: 35.9224, longitude: -78.4575, featured: false },
];

export function getCityBySlug(slug: string): City | undefined {
  return cities.find((c) => c.slug === slug);
}

export function getFeaturedCities(): City[] {
  return cities.filter((c) => c.featured);
}

export function getCitiesByCounty(county: string): City[] {
  return cities.filter((c) => c.county === county);
}

export function getCitiesByRegion(region: string): City[] {
  return cities.filter((c) => c.region === region);
}

export const triadCounties = [
  "Guilford",
  "Forsyth",
  "Davidson",
  "Randolph",
  "Alamance",
  "Rockingham",
  "Davie",
  "Stokes",
];

export const triangleCounties = [
  "Wake",
  "Durham",
  "Orange",
  "Johnston",
  "Franklin",
];
