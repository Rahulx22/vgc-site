import HeroCarousel from "./components/HeroCarousel";
import Services from "./components/Services";
import Blog from "./components/Blog";
import Clients from "./components/Clients";
import Testimonials from "./components/Testimonials";

import type { HomeData } from "../types/home";
import { fetchWithTimeout, ensureUrl, stripHtml } from "../lib/api";
import * as NextCache from "next/cache";
import { headers } from "next/headers";

export const revalidate = 0;
export const dynamic = "force-dynamic";

const noStoreCompat =
  (NextCache as any).noStore ??
  (NextCache as any).unstable_noStore ??
  (() => {});

function splitCount(raw: any) {
  const str = String(raw ?? "").trim();
  const m = str.match(/^(\d+(?:\.\d+)?)(.*)$/);
  return { value: m ? Number(m[1]) : null, suffix: m ? m[2].trim() : "", display: str };
}

function mapApiToHomeDataStrict(apiJson: any): HomeData {
  const pages = Array.isArray(apiJson?.data) ? apiJson.data : [];
  const homePage = pages.find((p: any) => p.slug === "homepage");
  if (!homePage) throw new Error("API shape unexpected: no page with slug 'homepage' found");

  const blocks = Array.isArray(homePage.blocks) ? homePage.blocks : [];

  const bannerBlock = blocks.find((b: any) => b.type === "banner_slider_section");
  const bannersRaw = bannerBlock?.data?.banners || [];
  const firstBanner = bannersRaw[0] || {};

  const countersRaw = Array.isArray(firstBanner?.statics) ? firstBanner.statics : [];
  const counters = countersRaw
    .map((s: any) => {
      const { value, suffix, display } = splitCount(s?.count_percent);
      return { label: String(s?.text ?? "").trim(), value, suffix, display };
    })
    .filter((c) => c.label && (c.value !== null || c.display));

  const hero = {
    title: firstBanner?.title ?? "",
    paragraphs: firstBanner?.subtitle
      ? String(firstBanner.subtitle)
          .split(/\n{2,}/)
          .map((s: string) => s.trim())
          .filter(Boolean)
      : [],
    phone: (firstBanner?.cta_link || "").replace(/^tel:/, ""),
    counters,
    banners: bannersRaw.map((b: any) => ensureUrl(b?.image)),
  };

  const servicesBlock = blocks.find((b: any) => b.type === "services_section");
  const services = (servicesBlock?.data?.services || []).map((s: any) => ({
    title: s.title || "",
    desc: stripHtml(s.short_description || s.long_description || ""),
    link: s.slug ? `/service/${s.slug}` : s.link ? s.link : "/service",
  }));

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

  const clientsBlock = blocks.find((b: any) => b.type === "clients_logo_section");
  const clients = (clientsBlock?.data?.logos || []).map((c: any) => ({
    title: c.title || "",
    icon: ensureUrl(c.logo),
  }));
  const clientsTitle = clientsBlock?.data?.title || "";
  const clientsSubtitle = clientsBlock?.data?.subtitle || "";

  const testimonialsBlock = blocks.find((b: any) => b.type === "testimonials_section");
  const testimonials = (testimonialsBlock?.data?.items || []).map((t: any) => ({
    text: t.quote || "",
    author: t.author || t.item_author || "",
    rating: String(t.rating ?? "5"),
    avatar: ensureUrl(t.avatar),
  }));
  const testimonialsLeftText = testimonialsBlock?.data?.left_text || "Building Trust Through Results";
  const testimonialsRightText = testimonialsBlock?.data?.right_text || "Testimonials";
  const testimonialsRightSubtext = testimonialsBlock?.data?.right_subtext || "Client Success Stories: Hear What They Say";

  const ctaBlock = blocks.find((b: any) => b.type === "cta_section");
  const cta = {
    topHeading: ctaBlock?.data?.top_heading || "",
    mainHeading: ctaBlock?.data?.main_heading || "",
    subtext: ctaBlock?.data?.subtext || "",
    ctaLink: ctaBlock?.data?.cta_link || "",
    ctaText: ctaBlock?.data?.cta_text || "",
  };

  const footer = { phone: "", email: "", social: [], copyright: "" };

  return {
    hero,
    services,
    blog,
    clients,
    clientsTitle,
    clientsSubtitle,
    testimonials,
    testimonialsLeftText,
    testimonialsRightText,
    testimonialsRightSubtext,
    cta,
    footer,
  } as HomeData;
}

export default async function Page() {
  noStoreCompat(); 

  const h = headers();
  const host = h.get("x-forwarded-host") || h.get("host");
  const proto = h.get("x-forwarded-proto") || "http";
  const base = `${proto}://${host}`;

  const pagesRes = await fetchWithTimeout(`${base}/api/pages`, { cache: "no-store" });
  if (!pagesRes.ok) {
    const text = await pagesRes.text().catch(() => "<no body>");
    throw new Error(`Pages API returned non-OK ${pagesRes.status} - ${pagesRes.statusText}. Body: ${text}`);
  }

  const json = await pagesRes.json();
  const data = mapApiToHomeDataStrict(json);

  return (
    <>
      <HeroCarousel hero={data.hero} />
      <Services services={data.services} />
      <Blog items={data.blog} />
      <Clients items={data.clients} title={data.clientsTitle} subtitle={data.clientsSubtitle} />
      <Testimonials
        items={data.testimonials}
        leftText={data.testimonialsLeftText}
        rightText={data.testimonialsRightText}
        rightSubtext={data.testimonialsRightSubtext}
      />
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
    </>
  );
}
