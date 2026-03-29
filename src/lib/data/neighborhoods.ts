export interface Neighborhood {
  name: string;
  slug: string;
  citySlug: string;
  zipCodes: string[];
  description: string;
}

export const neighborhoods: Neighborhood[] = [
  // Greensboro
  {
    name: "Downtown Greensboro",
    slug: "downtown",
    citySlug: "greensboro",
    zipCodes: ["27401"],
    description:
      "Downtown Greensboro is the heart of the city featuring restaurants, shops, and professional services along Elm Street and the surrounding blocks.",
  },
  {
    name: "Friendly Center Area",
    slug: "friendly-center",
    citySlug: "greensboro",
    zipCodes: ["27410"],
    description:
      "The Friendly Center area is Greensboro's premier shopping and dining district with excellent local services nearby.",
  },
  {
    name: "Lindley Park",
    slug: "lindley-park",
    citySlug: "greensboro",
    zipCodes: ["27403"],
    description:
      "Lindley Park is a charming residential neighborhood near UNCG with walkable access to local businesses and services.",
  },
  {
    name: "Lake Jeanette",
    slug: "lake-jeanette",
    citySlug: "greensboro",
    zipCodes: ["27455"],
    description:
      "Lake Jeanette is an upscale residential area in northern Greensboro with premium home services and professionals.",
  },
  // Winston-Salem
  {
    name: "Downtown Winston-Salem",
    slug: "downtown",
    citySlug: "winston-salem",
    zipCodes: ["27101"],
    description:
      "Downtown Winston-Salem features the Innovation Quarter, arts district, and a growing business community.",
  },
  {
    name: "Reynolda",
    slug: "reynolda",
    citySlug: "winston-salem",
    zipCodes: ["27106"],
    description:
      "The Reynolda area is home to Wake Forest University and features upscale residential neighborhoods with premium services.",
  },
  {
    name: "Ardmore",
    slug: "ardmore",
    citySlug: "winston-salem",
    zipCodes: ["27103"],
    description:
      "Ardmore is one of Winston-Salem's most walkable neighborhoods with local shops, restaurants, and service providers.",
  },
  // High Point
  {
    name: "Downtown High Point",
    slug: "downtown",
    citySlug: "high-point",
    zipCodes: ["27260"],
    description:
      "Downtown High Point is the center of the Furniture Capital featuring showrooms, restaurants, and local businesses.",
  },
  {
    name: "Emerywood",
    slug: "emerywood",
    citySlug: "high-point",
    zipCodes: ["27262"],
    description:
      "Emerywood is a well-established High Point neighborhood with excellent access to local services and trades.",
  },
  // Burlington
  {
    name: "Downtown Burlington",
    slug: "downtown",
    citySlug: "burlington",
    zipCodes: ["27215"],
    description:
      "Downtown Burlington offers a charming Main Street with local shops, dining, and professional services.",
  },
];

export function getNeighborhoodsByCity(citySlug: string): Neighborhood[] {
  return neighborhoods.filter((n) => n.citySlug === citySlug);
}
