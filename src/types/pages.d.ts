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
