// app/about/page.tsx  (or pages/about.tsx) — replace file content with this
"use client";

import React, { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import InnerBanner from "../components/InnerBanner";
import AboutSection from "../components/AboutSection";
import WhyChooseSection from "../components/WhyChooseSection";
import TeamSection from "../components/TeamSection";
import aboutData from "../../data/about.json";
import { AboutPage } from "../../types/pages";

export default function AboutUsPage() {
  // cast safe
  const data = aboutData as unknown as AboutPage;

  // debug to see what data contains on first render
  useEffect(() => {
    // remove this console.log after verifying
    console.log("ABOUT PAGE DATA:", data);
  }, [data]);

  return (
    <>
      <Header />

      {/* Banner */}
      <InnerBanner
        title={data.banner.title}
        breadcrumb={data.banner.breadcrumb}
        image="/images/about-banner.webp"
        alt="about-banner"
      />

      {/* 1) ABOUT (must be the real about text) */}
      <AboutSection
        title={data.about.title}
        paragraphs={data.about.paragraphs}
        image={data.about.image}
        imageAlt="about-img"
      />

      {/* 2) WHY CHOOSE */}
      <WhyChooseSection title="VGC Advisors" features={data.whyChoose.features} />

      {/* 3) WHAT WE BELIEVE IN (beliefs) - only once, reversed layout */}
      <AboutSection
        title={data.beliefs.title}
        paragraphs={data.beliefs.paragraphs}
        image={data.beliefs.image}
        imageAlt="about-img1"
        reverse={true}
        className="dd"
      />

      {/* 4) TEAM */}
      <TeamSection title={data.team.title} members={data.team.members} />

      {/* 5) GLOBAL PRESENCE */}
      <AboutSection
        title={data.globalPresence.title}
        paragraphs={data.globalPresence.paragraphs}
        image={data.globalPresence.image}
        imageAlt="about-img"
      />

      {/* CTA */}
      <div className="ready-sec">
        <div className="container">
          <div className="row">
            <div
              className="col-xl-10 col-lg-12 col-md-12 offset-xl-1"
              data-aos="fade-left"
              data-aos-duration="1200"
            >
              <h3>{data.cta.title}</h3>
              <h2>{data.cta.subtitle}</h2>
              <p>{data.cta.description}</p>
              <a href={`tel:${data.cta.phone}`}>Contact Us Today</a>
            </div>
          </div>
        </div>
      </div>

      <Footer
        footer={{
          phone: "+123 456 789 100",
          email: "hi@vGC@gmail.com",
          social: ["#", "#", "#", "#", "#"],
          copyright: "Copyright © 2025. All rights reserved.",
        }}
      />
    </>
  );
}
