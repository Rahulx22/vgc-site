export interface AboutPage {
  banner: {
    title: string;
    breadcrumb: Array<{ label: string; href: string }>;
  };
  about: {
    title: string;
    paragraphs: string[];
    image: string;
  };
  whyChoose: {
    title: string;
    features: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  };
  beliefs: {
    title: string;
    subtitle: string;
    subtitle2: string;
    paragraphs: string[];
    image: string;
    ctaText: string;
    ctaLink: string;
  };
  team: {
    title: string;
    members: Array<{
      name: string;
      image: string;
      bio: string;
    }>;
  };
  globalPresence: {
    title: string;
    paragraphs: string[];
    image: string;
  };
  cta: {
    title: string;
    subtitle: string;
    description: string;
    phone: string;
  };
}

export interface BlogPage {
  banner: {
    title: string;
    breadcrumb: Array<{ label: string; href: string }>;
  };
  blogs: Array<{
    id: string;
    title: string;
    excerpt: string;
    image: string;
    date: string;
    slug: string;
  }>;
}

export interface BlogSinglePage {
  post: {
    title: string;
    date: string;
    image: string;
    content: Array<{
      type: string;
      text: string;
    }>;
  };
}

export interface BusinessSupportPage {
  banner: {
    title: string;
    description: string;
    breadcrumb: Array<{ label: string; href: string }>;
    image: string;
  };
  offerings: Array<{
    title: string;
    subtitle: string;
    description: string;
    items: Array<{
      title: string;
      description: string;
    }>;
  }>;
}

export interface CareerPage {
  banner: {
    title: string;
    description: string;
    breadcrumb: Array<{ label: string; href: string }>;
    image: string;
  };
  applicationForm: {
    title: string;
    subtitle: string;
  };
  whyWorkWithUs: {
    title: string;
    items: string[];
  };
  whatWeOffer: {
    title: string;
    items: string[];
  };
  culture: {
    title: string;
    items: string[];
  };
  notForYou: {
    title: string;
    items: string[];
  };
  nonNegotiables: {
    title: string;
    items: string[];
  };
  lifeAtVGC: {
    title: string;
    items: string[];
  };
  currentOpenings: {
    title: string;
    positions: Array<{
      title: string;
      responsibilities: string[];
      idealFor?: string[];
    }>;
  };
  hiringProcess: {
    title: string;
    steps: string[];
  };
  benefits: {
    title: string;
    items: string[];
  };
  cta: {
    title: string;
    buttons: Array<{
      text: string;
      link: string;
      type: string;
    }>;
  };
}

// API response types for career page
export interface CareerJob {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  roles: string;
  long_description: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface CareerSection {
  title: string;
  description: string;
}

export interface CareerHeaderBlock {
  type: 'career_header';
  data: {
    left_title: string;
    left_description: string;
    right_image_main: string;
    right_image_main_mobile: string;
  };
}

export interface CareerSectionBlock {
  type: 'career_section';
  data: {
    jobs_ids: number[];
    main_text: string;
    left_section: CareerSection[];
    right_section: CareerSection[];
    left_button_url: string;
    left_button_text: string;
    right_button_url: string;
    right_button_text: string;
    show_jobs_latest: boolean;
    jobs: CareerJob[];
  };
}

export interface CareerApiResponse {
  id: number;
  title: string;
  slug: string;
  type: string;
  blocks: (CareerHeaderBlock | CareerSectionBlock)[];
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ContactPage {
  form: {
    title: string;
  };
  addresses: Array<{
    title: string;
    icon: string;
    details: Array<{
      label: string;
      value: string;
      link?: string;
    }>;
  }>;
  locations: Array<{
    name: string;
    link: string;
  }>;
}

// API response types for contact page
export interface ContactAddress {
  email: string;
  phone: string;
  map_url: string | null;
  whatsapp: string;
  full_address: string;
  short_address: string;
}

export interface ContactAddressBlock {
  type: 'address_section';
  data: {
    addresses: ContactAddress[];
    map_image: string;
  };
}

export interface ContactApiResponse {
  id: number;
  title: string;
  slug: string;
  type: string;
  blocks: ContactAddressBlock[];
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}
