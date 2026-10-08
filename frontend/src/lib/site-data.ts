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
    id?: number;
    createdAt?: string | null;
    updatedAt?: string | null;
    slug: string;
    name: string;
    region: string;
    tag: string;
    shortDescription: string;
    description: string;
    price: string;
    imageUrl: string;
    imageAlt: string;
    highlights: string[];
    featured: boolean;
    active: boolean;
    sortOrder: number;
  }>;
  packages: Array<{
    id?: number;
    createdAt?: string | null;
    updatedAt?: string | null;
    slug: string;
    title: string;
    destinationId?: number | null;
    destinationSlug: string;
    duration: string;
    summary: string;
    shortDescription: string;
    description: string;
    price: string;
    currency: string;
    active: boolean;
    featured: boolean;
    sortOrder: number;
    imageUrl: string;
    imageAlt: string;
    galleryImages: string[];
    itinerary: string[];
    includedItems: string[];
    excludedItems: string[];
    highlights: string[];
  }>;
  services: Array<{
    id?: number;
    createdAt?: string | null;
    updatedAt?: string | null;
    title: string;
    slug: string;
    shortDescription: string;
    description: string;
    icon: string;
    image: string;
    featured: boolean;
    active: boolean;
    sortOrder: number;
  }>;
  gallery: Array<{
    id?: number;
    createdAt?: string | null;
    updatedAt?: string | null;
    imageUrl: string;
    title: string;
    alt: string;
    altText: string;
    caption: string;
    category: string;
    sortOrder: number;
    active: boolean;
  }>;
  about: {
    eyebrow: string;
    title: string;
    body: string;
    imageUrl: string;
    imageAlt: string;
  };
  benefits: string[];
  testimonials: Array<{
    id?: number;
    createdAt?: string | null;
    updatedAt?: string | null;
    name: string;
    quote: string;
    trip: string;
    customerName: string;
    customerLocation: string;
    content: string;
    rating: number;
    image: string;
    featured: boolean;
    active: boolean;
    sortOrder: number;
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
    googleMapsUrl: string;
  };
  settings: {
    logo: string;
    favicon: string;
    instagramUrl: string;
    facebookUrl: string;
    youtubeUrl: string;
    footerText: string;
  };
};

export const defaultContent: SiteContent = {
  name: "",
  tagline: "",
  description: "",
  hero: {
    eyebrow: "",
    title: "",
    subtitle: "",
    primaryCta: "",
    secondaryCta: "",
  },
  stats: [],
  destinations: [],
  packages: [],
  services: [],
  gallery: [],
  about: {
    eyebrow: "",
    title: "",
    body: "",
    imageUrl: "",
    imageAlt: "",
  },
  benefits: [],
  testimonials: [],
  cta: {
    title: "",
    buttonText: "",
  },
  contact: {
    email: "",
    phone: "",
    address: "",
    whatsappNumber: "",
    googleMapsUrl: "",
  },
  settings: {
    logo: "",
    favicon: "",
    instagramUrl: "",
    facebookUrl: "",
    youtubeUrl: "",
    footerText: "",
  },
};
