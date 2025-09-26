// app/page.tsx
import Header from "./components/Header";
import HeroCarousel from "./components/HeroCarousel";
import Services from "./components/Services";
import Blog from "./components/Blog";
import Clients from "./components/Clients";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";

import type { HomeData } from "../types/home";
import { fetchWithTimeout, ensureUrl, stripHtml, API_URL, fetchSettings } from "../lib/api";
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
    phone: (firstBanner?.cta_link || "").replace(/^tel:/, ""),
    counters: [], 
    banners: bannersRaw.map((b: any) => ensureUrl(b?.image)),
  };

  // Services
  const servicesBlock = blocks.find((b: any) => b.type === "services_section");
  const services = (servicesBlock?.data?.services || []).map((s: any) => ({
    title: s.title || "",
    desc: stripHtml(s.short_description || s.long_description || ""),
    link: s.slug ? `/service/${s.slug}` : s.link ? s.link : "/service",
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

  // Testimonials
  const testimonialsBlock = blocks.find((b: any) => b.type === "testimonials_section");
  const testimonials = (testimonialsBlock?.data?.items || []).map((t: any) => ({
    text: t.quote || "",
    author: t.author || t.item_author || "",
    avatar: ensureUrl(t.avatar),
  }));

  // CTA Section
  const ctaBlock = blocks.find((b: any) => b.type === "cta_section");
  const cta = {
    topHeading: ctaBlock?.data?.top_heading || "",
    mainHeading: ctaBlock?.data?.main_heading || "",
    subtext: ctaBlock?.data?.subtext || "",
    ctaLink: ctaBlock?.data?.cta_link || "",
    ctaText: ctaBlock?.data?.cta_text || "",
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
    cta,
    footer,
  } as HomeData;
}

export default async function Page() {
  // Fetch both pages and settings data
  let json: any;
  let settings: any;
  
  try {
    const [pagesRes, settingsRes] = await Promise.all([
      fetchWithTimeout(API_URL, { cache: 'force-cache' }, 10000),
      fetchSettings()
    ]);
    
    if (!pagesRes.ok) {
      const text = await pagesRes.text().catch(() => "<no body>");
      throw new Error(`Pages API returned non-OK status ${pagesRes.status} - ${pagesRes.statusText}. Body: ${text}`);
    }
    
    json = await pagesRes.json();
    settings = settingsRes;
  } catch (err) {
    console.error("[Home] API fetch failed:", err);
    throw err;
  }

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
      <Header data={settings?.data?.header} />
      <HeroCarousel hero={data.hero} />
      <Services services={data.services} />
      <Blog items={data.blog} />
      <Clients items={data.clients} title={data.clientsTitle} subtitle={data.clientsSubtitle} />
      <Testimonials items={data.testimonials} />

      <div className="ready-sec">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-md-12" data-aos="fade-left" data-aos-duration="1200">
              <h3>{data.cta.topHeading}</h3>
              <h2>{data.cta.mainHeading}</h2>
              <p>{data.cta.subtext}</p>
              <a href={data.cta.ctaLink}>{data.cta.ctaText}</a>
            </div>
          </div>
        </div>
      </div>

      <Footer data={settings?.data?.footer} />
    </>
  );
}
