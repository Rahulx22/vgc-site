export interface Counter { label: string; value: string }
export interface Hero { title: string; paragraphs: string[]; phone: string; counters: Counter[]; banners: string[] }
export interface Service { title: string; desc: string; link: string }
export interface BlogItem { date: string; title: string; excerpt: string; image: string; link: string }
export interface ClientItem { title: string; icon: string }
export interface Testimonial { text: string; author: string; avatar: string }
export interface HomeData { hero: Hero; services: Service[]; blog: BlogItem[]; clients: ClientItem[]; testimonials: Testimonial[]; footer: any }