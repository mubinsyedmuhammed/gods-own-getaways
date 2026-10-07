export type SiteContent = {
  name: string;
  tagline: string;
  description: string;
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
  };
  stats: Array<{ label: string; value: string }>;
  destinations: Array<{
    name: string;
    region: string;
    tag: string;
    description: string;
    price: string;
  }>;
  journeys: Array<{
    title: string;
    duration: string;
    summary: string;
  }>;
  services: Array<{ title: string; description: string }>;
  gallery: Array<{ imageUrl: string; alt: string; caption: string }>;
  about: {
    eyebrow: string;
    title: string;
    body: string;
    imageUrl: string;
    imageAlt: string;
  };
  benefits: string[];
  testimonials: Array<{
    name: string;
    quote: string;
    trip: string;
  }>;
  cta: {
    title: string;
    buttonText: string;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
    whatsappNumber: string;
  };
};

export const defaultContent: SiteContent = {
  name: "God's Own Getaways",
  tagline: "Handcrafted journeys across Kerala and beyond",
  description:
    "Luxury travel experiences designed for meaningful escapes across Kerala and beyond.",
  hero: {
    eyebrow: "Curated escapes in God's Own Country",
    title: "Travel beautifully. Feel deeply.",
    subtitle:
      "Slow down, wander deeper, and discover stays and experiences designed for memory-making.",
    primaryCta: "Plan my escape",
    secondaryCta: "Explore itineraries",
  },
  stats: [],
  destinations: [
    {
      name: "Munnar",
      region: "Hill country",
      tag: "Tea Valley",
      description: "Misty hills, sunrise walks, and aromatic estates wrapped in serenity.",
      price: "",
    },
    {
      name: "Alleppey",
      region: "Backwaters",
      tag: "Houseboat luxury",
      description: "Cruise through calm waters, swaying palms, and slow local culture.",
      price: "",
    },
    {
      name: "Wayanad",
      region: "Forest retreats",
      tag: "Nature escape",
      description: "Waterfalls, canopy trails, and eco-luxury stays in the green heart of Kerala.",
      price: "",
    },
  ],
  journeys: [],
  services: [
    { title: "Bespoke itineraries", description: "Thoughtful trip planning shaped around your interests and pace." },
    { title: "Handpicked stays", description: "A considered selection of places to stay, from quiet retreats to characterful hotels." },
    { title: "Local experiences", description: "Meaningful ways to connect with the landscapes, food, and people of each place." },
    { title: "On-trip support", description: "A helpful point of contact while you are away, so the details feel easy." },
  ],
  gallery: [
    { imageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80", alt: "Mountain valley at sunrise", caption: "First light over the hills" },
    { imageUrl: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1400&q=80", alt: "Quiet tropical coastline", caption: "A slower day by the water" },
    { imageUrl: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1400&q=80", alt: "Lake among forested mountains", caption: "Room to breathe" },
    { imageUrl: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1400&q=80", alt: "Waves rolling toward a beach", caption: "The coast, unhurried" },
  ],
  about: {
    eyebrow: "A little about us",
    title: "Travel with care, curiosity, and a local point of view.",
    body: "We bring together thoughtful planning and a deep appreciation for the places we visit. Tell us what matters to you, and we will help shape a journey that feels like your own.",
    imageUrl: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Green mountain landscape beneath a wide sky",
  },
  benefits: [
    "Tailor-made travel planning",
    "Trusted local expertise",
    "Luxury stays with seamless logistics",
    "24/7 trip support",
  ],
  testimonials: [],
  cta: {
    title: "Ready for a slower, richer kind of travel?",
    buttonText: "Book a consultation",
  },
  contact: {
    email: "",
    phone: "",
    address: "",
    whatsappNumber: "",
  },
};
