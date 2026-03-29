export interface City {
  name: string;
  slug: string;
  county: string;
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
    description:
      "Advance is a growing community in Davie County with local businesses serving the western Triad area.",
    population: 1418,
    latitude: 35.9435,
    longitude: -80.4094,
    featured: false,
  },
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
