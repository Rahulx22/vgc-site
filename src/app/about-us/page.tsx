// app/about/page.tsx
import React from "react";
import Header from "./../components/Header";
import Footer from "./../components/Footer";
import InnerBanner from "./../components/InnerBanner";
import AboutSection from "./../components/AboutSection";
import WhyChooseSection from "./../components/WhyChooseSection";
import TeamSection from "./../components/TeamSection";
import { ensureUrl } from "../../lib/api";

type ApiResponse = {
  success: boolean;
  message: string;
  data: Array<{
    id: number;
    title: string;
    slug: string;
    type: string;
    blocks: Array<{ type: string; data: any }>;
  }>;
};

const API_URL = "https://vgc.psofttechnologies.in/api/v1/pages";

function splitParagraphs(text?: string | null) {
  if (!text) return [];
  return text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}

async function fetchAboutPage() {
  const res = await fetch(API_URL, { next: { revalidate: 60 } });
  if (!res.ok) {
    return null;
  }
  const payload = (await res.json()) as ApiResponse;

  // Look for about page with different possible identifiers
  // First try to find any page that has the blocks we need
  let aboutPage = payload.data.find((p) => 
    p.type === "about" || 
    p.slug === "about" || 
    p.slug === "about-us" ||
    p.title?.toLowerCase().includes("about")
  );
  
  // If no specific about page found, try to find any page with about_section block
  if (!aboutPage) {
    aboutPage = payload.data.find((p) => 
      Array.isArray(p.blocks) && p.blocks.some((b: any) => b.type === "about_section")
    );
  }
  
  // If still not found, use the first page with blocks
  if (!aboutPage && payload.data.length > 0) {
    aboutPage = payload.data.find((p) => Array.isArray(p.blocks) && p.blocks.length > 0);
  }
  
  if (!aboutPage) {
    return null;
  }

  const getBlock = (type: string) => {
    const block = aboutPage.blocks.find((b) => b.type === type);
    return block?.data ?? null;
  };

  const bannerBlock = getBlock("banner_slider_section");
  const banner = (bannerBlock?.banners && bannerBlock.banners[0]) || null;
  const bannerData = {
    title: banner?.title ?? "About Us",
    subtitle: banner?.subtitle ?? "",
    ctaText: banner?.cta_text ?? null,
    ctaLink: banner?.cta_link ?? null,
    image: (banner?.image ?? bannerBlock?.image) ? ensureUrl(banner?.image ?? bannerBlock?.image) : null,
  };

  const aboutBlock = getBlock("about_section");
  const about = {
    title: aboutBlock?.left_heading ?? aboutBlock?.heading ?? "About Us",
    paragraphs: splitParagraphs(aboutBlock?.left_description ?? aboutBlock?.description),
    image: aboutBlock?.right_image ? ensureUrl(aboutBlock?.right_image) : null,
  };

  const whyBlock = getBlock("why_choose_us_section");
  const whyChoose = {
    title: whyBlock?.heading ?? "Why Choose",
    subtitle: whyBlock?.subtext ?? "VGC Advisors",
    features:
      Array.isArray(whyBlock?.items) ?
      whyBlock.items.map((it: any) => {
        // Use proper fallback logic as per memory
        const iconUrl = it.icon ? ensureUrl(it.icon) : "/images/icon.webp";
        return {
          icon: iconUrl,
          title: it.title || 'Untitled',
          description: it.description || '',
        };
      }) : [],
  };

  const believeBlock = getBlock("what_we_believe_section");
  const beliefs = {
    title: believeBlock?.right_title ?? "What We Believe In",
    paragraphs: splitParagraphs(believeBlock?.right_description),
    image: (believeBlock?.left_image ?? believeBlock?.right_image) ? ensureUrl(believeBlock?.left_image ?? believeBlock?.right_image) : null,
    ctaText: believeBlock?.right_cta_text ?? null,
    ctaLink: believeBlock?.right_cta_link ?? null,
  };

  const teamBlock = getBlock("team_section");
  const team = {
    title: "Our Team",
    members:
      Array.isArray(teamBlock?.members) &&
      teamBlock.members.map((m: any) => ({
        name: m.name,
        image: (m.photo ?? m.image) ? ensureUrl(m.photo ?? m.image) : "/images/team-img.webp",
        bio: m.description ?? m.bio ?? "",
      })) || [],
  };

  const globalBlock = getBlock("global_presence_section");
  const globalPresence = {
    title: globalBlock?.left_title ?? "Global Presence",
    paragraphs: splitParagraphs(globalBlock?.left_description),
    image: globalBlock?.right_image ? ensureUrl(globalBlock?.right_image) : null,
  };

  const ctaBlock = getBlock("cta_section");
  const cta = {
    title: ctaBlock?.top_heading ?? "Get Started Today!",
    subtitle: ctaBlock?.main_heading ?? "Let's Build Your Business Success Story — Together",
    description: ctaBlock?.subtext ?? "",
    phone: ctaBlock?.cta_link ?? "tel:+1234567891",
    ctaText: ctaBlock?.cta_text ?? "Contact Us Today",
  };

  return {
    banner: bannerData,
    about,
    whyChoose,
    beliefs,
    team,
    globalPresence,
    cta,
  };
}

export default async function AboutPage() {
  const data = await fetchAboutPage();

  if (!data) {
    return (
      <>
        <Header />
        <main className="container py-8">
          <h1>About</h1>
          <p>Sorry — about page content is currently unavailable.</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <InnerBanner
        title={data.banner.title}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: data.banner.title, href: "/about" },
        ]}
        image={data.banner.image || "/images/about-banner.webp"}
        alt="about-banner"
      />

      <AboutSection
        title={data.about.title}
        paragraphs={data.about.paragraphs}
        image={data.about.image || "/images/about-img.webp"}
        imageAlt="about-img"
      />

      <WhyChooseSection title={data.whyChoose.subtitle ?? "Why Choose"} features={data.whyChoose.features} />

      <AboutSection
        title={data.beliefs.title}
        paragraphs={data.beliefs.paragraphs}
        image={data.beliefs.image || "/images/about-img1.webp"}
        imageAlt="about-img1"
        reverse={true}
        className="dd"
      />

      <TeamSection title={data.team.title} members={data.team.members} />

      <AboutSection
        title={data.globalPresence.title}
        paragraphs={data.globalPresence.paragraphs}
        image={data.globalPresence.image || "/images/about-img.webp"}
        imageAlt="about-img"
      />

      <div className="ready-sec">
        <div className="container">
          <div className="row">
            <div className="col-xl-10 col-lg-12 col-md-12 offset-xl-1" data-aos="fade-left" data-aos-duration="1200">
              <h3>{data.cta.title}</h3>
              <h2>{data.cta.subtitle}</h2>
              <p>{data.cta.description}</p>
              <a href={data.cta.phone ?? "tel:+1234567891"}>{data.cta.ctaText ?? "Contact Us Today"}</a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
