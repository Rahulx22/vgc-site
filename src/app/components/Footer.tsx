"use client";

import Link from "next/link";
import Image from "next/image";
import React from "react";

type NavigationItem = {
  label: string;
  url: string;
  is_external: boolean;
  order: number;
};

type SocialLink = {
  platform: string;
  url: string;
  icon: string | null;
};

type FooterData = {
  column_1: {
    logo: string;
    description: string;
    phone: string;
    email: string;
  };
  column_2: {
    show_navigation: boolean;
    navigation: NavigationItem[];
  };
  column_3: {
    social_links: SocialLink[];
    newsletter: {
      enabled: boolean;
      heading: string;
      subtext: string;
    };
  };
  bottom_bar: {
    left_text: string;
    right_text: string;
  };
};

type FooterProps = {
  data?: FooterData | null;
};

function normalizePhoneToHref(raw?: string) {
  if (!raw) return "tel:+123456789100";
  const trimmed = raw.trim();
  if (trimmed.startsWith("tel:")) return trimmed;
  const digits = trimmed.replace(/\s+/g, "");
  return `tel:${digits}`;
}

export default function Footer({ data }: FooterProps) {
  // Default values
  const logoUrl = data?.column_1?.logo ? `https://vgc.psofttechnologies.in/storage/builder/${data.column_1.logo}` : "/images/logo.svg";
  const description = data?.column_1?.description ?? "Don't let finance and tax problems hold you back. At VGC Advisors, we are committed to empowering your business with expert financial advice and tailored solutions. Contact us today to learn how we can help you thrive.";
  const displayPhone = data?.column_1?.phone ?? "+123 456 789 100";
  const phoneHref = normalizePhoneToHref(displayPhone);
  const email = data?.column_1?.email ?? "hi@vgc@gmail.com";
  
  const navigation = data?.column_2?.navigation || [
    { label: "Home", url: "/", is_external: false, order: 1 },
    { label: "About", url: "/about-us", is_external: false, order: 2 },
    { label: "Services", url: "/service", is_external: false, order: 3 },
    { label: "Blog", url: "/blog", is_external: false, order: 4 },
    { label: "Contact", url: "/contact-us", is_external: false, order: 5 }
  ];
  
  const socialLinks = data?.column_3?.social_links || [];
  const newsletter = data?.column_3?.newsletter;
  const leftText = data?.bottom_bar?.left_text ?? "VGC Consulting Pvt. Ltd.";
  const rightText = data?.bottom_bar?.right_text ?? "Copyright © 2025. All rights reserved.";

  const defaultIcons = ["fb.svg", "pint.svg", "link.svg", "ins.svg", "tw.svg"];
  const pickIcon = (platform: string) => {
    const iconMap: { [key: string]: string } = {
      facebook: "fb.svg",
      twitter: "tw.svg", 
      linkedin: "link.svg",
      instagram: "ins.svg",
      pinterest: "pint.svg"
    };
    return `/images/${iconMap[platform] ?? "link.svg"}`;
  };

  function handleSubscribe(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const target = e.currentTarget;
    const input = target.querySelector<HTMLInputElement>(".box");
    const emailVal = input?.value?.trim();
    if (!emailVal) {
      alert("Please enter your email");
    } else {
      alert(`Subscribed: ${emailVal}`);
      if (input) input.value = "";
    }
  }

  return (
    <footer>
      <div className="container">
        <div className="row">
          <div className="col-xl-4 col-lg-4 col-md-4">
            <Link href="/" aria-label="Home">
              <Image src={logoUrl} alt="logo" width={150} height={50} loading="lazy" />
            </Link>

            <p>{description}</p>

            <ul className="info-list">
              <li>
                <a href={phoneHref} style={{ display: "inline-flex", alignItems: "center" }}>
                  <Image src="/images/ph.svg" alt="phone icon" width={15} height={15} loading="lazy" />
                  <span style={{ paddingLeft: "6px" }}>{displayPhone}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${email}`} style={{ display: "inline-flex", alignItems: "center" }}>
                  <Image src="/images/ms.svg" alt="email icon" width={15} height={15} loading="lazy" />
                  <span style={{ paddingLeft: "6px" }}>{email}</span>
                </a>
              </li>
            </ul>
          </div>

          {/* navigation */}
          <div className="col-xl-3 col-lg-3 col-md-2 offset-xl-1">
            <h2>Navigation</h2>
            <ul>
              {navigation
                .sort((a, b) => a.order - b.order)
                .map((item) => (
                  <li key={item.order}>
                    <Link href={item.url}>{item.label}</Link>
                  </li>
                ))}
            </ul>
          </div>

          {/* social + newsletter */}
          <div className="col-xl-4 col-lg-5 col-md-6">
            <ul className="social-icon">
              {socialLinks.map((social, idx) => (
                <li key={idx}>
                  <a
                    href={social.url && social.url.trim() !== "" ? social.url : "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${social.platform} social link`}
                  >
                    <Image src={pickIcon(social.platform)} alt={`${social.platform} icon`} width={30} height={30} loading="lazy" />
                  </a>
                </li>
              ))}
            </ul>

            {newsletter?.enabled && (
              <>
                <h2>{newsletter.heading}</h2>
                <p>{newsletter.subtext}</p>

                <form onSubmit={handleSubscribe}>
                  <input className="box" type="text" placeholder="Your Email" />
                  <input type="submit" className="call-btn" value="Subscribe" />
                </form>
              </>
            )}
          </div>

          <div className="col-lg-12 col-md-12">
            <div className="copy-txt">
              <h6>{leftText}</h6>
              <center><h6>{rightText}</h6></center>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
