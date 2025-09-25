// types/home.ts
export type Banner = {
  image?: string | null;
  title?: string | null;
  cta_link?: string | null;
  cta_text?: string | null;
  subtitle?: string | null;
};

export type Hero = {
  title: string;
  paragraphs: string[];
  phone: string;
  counters: { label: string; value: string }[];
  banners: string[]; // absolute URLs
};

export type Service = {
  id: string;
  title: string;
  desc: string;
  link: string;
  image: string;
};

export type BlogItem = {
  date: string;
  title: string;
  excerpt: string;
  image: string;
  link: string;
};

export type ClientItem = {
  title: string;
  icon: string;
};

export type Testimonial = {
  text: string;
  author: string;
  avatar: string;
  rating?: string;
};

export type TestimonialsSection = {
  items: Testimonial[];
  left_text: string;
  right_text: string;
  right_subtext: string;
};

export type FooterData = {
  phone: string;
  email: string;
  social: string[];
  copyright?: string;
};

export type CtaSection = {
  subtext: string;
  cta_link: string;
  cta_text: string;
  top_heading: string;
  main_heading: string;
};

export type HomeData = {
  hero: Hero;
  services: Service[];
  serviceOfferings?: {
    title?: string;
    subtitle?: string;
    description?: string;
    items: {
      title: string;
      description: string;
    }[];
  }[];
  blog: BlogItem[];
  clients: ClientItem[];
  clientsTitle?: string;
  clientsSubtitle?: string;
  testimonials: TestimonialsSection;
  footer: FooterData;
  cta: CtaSection;
};
