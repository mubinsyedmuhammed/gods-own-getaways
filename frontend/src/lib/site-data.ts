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
  stats: [
    { label: "Happy travellers", value: "12k+" },
    { label: "Tailored journeys", value: "320" },
    { label: "Average rating", value: "4.9/5" },
    { label: "Destination partners", value: "48" },
  ],
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
  benefits: [
    "Tailor-made travel planning",
    "Trusted local expertise",
    "Luxury stays with seamless logistics",
    "24/7 trip support",
  ],
  testimonials: [
    {
      name: "Ananya & Dev",
      quote:
        "Every detail felt personal. We arrived relaxed, inspired, and already planning our next trip.",
      trip: "Munnar & Alleppey",
    },
    {
      name: "Rahul K.",
      quote:
        "A rare mix of premium service and heartwarming local touches. It felt like travelling with friends.",
      trip: "Wayanad getaway",
    },
  ],
  cta: {
    title: "Ready for a slower, richer kind of travel?",
    buttonText: "Book a consultation",
  },
  contact: {
    email: "hello@godsowngetaways.com",
    phone: "",
    address: "Kochi, Kerala",
  },
};
