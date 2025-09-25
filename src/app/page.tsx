// app/page.tsx
import Header from "./components/Header";
import HeroCarousel from "./components/HeroCarousel";
import Services from "./components/Services";
import Blog from "./components/Blog";
import Clients from "./components/Clients";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";

import type { HomeData } from "../types/home";
import { fetchWithTimeout, ensureUrl, stripHtml, API_URL } from "../lib/api";

/**
 * Map API response -> HomeData
 * Throws if shape is unexpected so dev can see the error.
 */
function mapApiToHomeDataStrict(apiJson: any): HomeData {
  const pages = Array.isArray(apiJson?.data) ? apiJson.data : [];
  const homePage = pages.find((p: any) => p.slug === "homepage");
  if (!homePage) {
    throw new Error("API shape unexpected: no page with slug 'homepage' found");
  }

  const blocks = Array.isArray(homePage.blocks) ? homePage.blocks : [];

  // Hero / banners
  const bannerBlock = blocks.find((b: any) => b.type === "banner_slider_section");
  const bannersRaw = bannerBlock?.data?.banners || [];
  const firstBanner = bannersRaw[0] || {};
  const hero = {
    title: firstBanner?.title ?? "",
    paragraphs: firstBanner?.subtitle
      ? String(firstBanner.subtitle).split(/\n{2,}/).map((s: string) => s.trim()).filter(Boolean)
      : [],
    phone: (firstBanner?.cta_text || "").replace(/^tel:/, ""),
    cta_link: (firstBanner?.cta_link || "").replace(/^tel:/, ""),

    counters: [], 
    banners: bannersRaw.map((b: any) => ensureUrl(b?.image)),
  };
  // Services
  const servicesBlock = blocks.find((b: any) => b.type === "services_section");
  const services = (servicesBlock?.data?.services || []).map((s: any) => ({
    id: s.id || "",
    title: s.title || "",
    desc: stripHtml(s.short_description || s.long_description || ""),
    link: s.slug ? `/service/${s.slug}` : s.link ? s.link : "/service",
    image: ensureUrl(s.featured_image || s.mobile_featured_image),
  }));

  // Blog
  const blogBlock = blocks.find((b: any) => b.type === "blog_section");
  const blog = (blogBlock?.data?.blogs || []).map((b: any) => ({
    date: b.created_at
      ? new Date(b.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })
      : "",
    title: b.title || "",
    excerpt: stripHtml(b.short_description || ""),
    image: ensureUrl(b.featured_image || b.cover_image),
    link: b.slug ? `/blog/${b.slug}` : "/blog",
  }));

  // Clients
  const clientsBlock = blocks.find((b: any) => b.type === "clients_logo_section");
  const clients = (clientsBlock?.data?.logos || []).map((c: any) => ({
    title: c.title || "",
    icon: ensureUrl(c.logo),
  }));
  const clientsTitle = clientsBlock?.data?.title || "";
  const clientsSubtitle = clientsBlock?.data?.subtitle || "";

  // Testimonials with section data
  const testimonialsBlock = blocks.find((b: any) => b.type === "testimonials_section");
  const testimonials = {
    items: (testimonialsBlock?.data?.items || []).map((t: any) => ({
      text: t.quote || "",
      author: t.author || t.item_author || "",
      avatar: ensureUrl(t.avatar),
      rating: t.rating || "5",
    })),
    left_text: testimonialsBlock?.data?.left_text || "Building Trust Through Results",
    right_text: testimonialsBlock?.data?.right_text || "Testimonials",
    right_subtext: testimonialsBlock?.data?.right_subtext || "Client Success Stories: Hear What They Say",
  };

  // CTA Section - try to get from cta_section first, fallback to banner data
  const ctaBlock = blocks.find((b: any) => b.type === "cta_section");
  const cta = {
    subtext: ctaBlock?.data?.subtext || "Don't let finance and tax problems hold you back. At VGC Advisors, we are committed to empowering your business with expert financial advice and tailored solutions. Contact us today to learn how we can help you thrive.",
    cta_link: ctaBlock?.data?.cta_link || firstBanner?.cta_link || "tel:+1234567891",
    cta_text: ctaBlock?.data?.cta_text || firstBanner?.cta_text || "Make a Call +123 456 7891",
    top_heading: ctaBlock?.data?.top_heading || "Get Started Today!",
    main_heading: ctaBlock?.data?.main_heading || "Ready to Take Your Business to the Next Level?",
  };

  const footer = {
    phone: "", 
    email: "",
    social: [],
    copyright: "",
  };

  return {
    hero,
    services,
    blog,
    clients,
    clientsTitle,
    clientsSubtitle,
    testimonials,
    footer,
    cta,
  } as HomeData;
}

export default async function Page() {
  // 1) fetch API (server-side)
  let json: any;
  try {
    const res = await fetchWithTimeout(API_URL, { cache: "no-store" }, 10000);
    if (!res.ok) {
      // throw an error including the status so dev can see it
      const text = await res.text().catch(() => "<no body>");
      throw new Error(`API returned non-OK status ${res.status} - ${res.statusText}. Body: ${text}`);
    }
    json = await res.json();
  } catch (err) {
    // Rethrow with helpful message so the error shows during dev render (Turbopack/Next).
    // In production, this will cause a 500 page — which is desired if you want to ensure data correctness.
    // If you prefer graceful fallback, see my previous file.
    // eslint-disable-next-line no-console
    console.error("[Home] API fetch failed:", err);
    throw err;
  }

  // 2) map to HomeData (strict)
  let data: HomeData;
  try {
    data = mapApiToHomeDataStrict(json);
  } catch (err) {
    // mapping failure — include the raw JSON in the thrown error (stringified safely)
    const safeJson = (() => {
      try {
        return JSON.stringify(json).slice(0, 2000); // limit length to avoid huge logs
      } catch {
        return "<could not stringify json>";
      }
    })();
    // eslint-disable-next-line no-console
    console.error("[Home] mapping failed:", err, safeJson);
    throw new Error(`Mapping failed: ${(err as Error).message}. Raw API (truncated): ${safeJson}`);
  }

  // 3) render using the mapped data
  return (
    <>
      <Header />
      <HeroCarousel hero={data.hero} />
      <Services services={data.services} />
      <Blog items={data.blog} />
      <Clients items={data.clients} title={data.clientsTitle} subtitle={data.clientsSubtitle} />
      <Testimonials testimonials={data.testimonials} />

      <div className="ready-sec">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-md-12" data-aos="fade-left" data-aos-duration="1200">
              <h3>{data.cta.top_heading}</h3>
              <h2>{data.cta.main_heading}</h2>
              <p>
                {data.cta.subtext}
              </p>
              <a href={data.cta.cta_link}>{data.cta.cta_text}</a>
            </div>
          </div>
        </div>
      </div>

      <Footer footer={data.footer} />
    </>
  );
}
