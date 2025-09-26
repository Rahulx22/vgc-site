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
    logo: string;           // e.g. "builder/footer/01K6....png"
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

type FooterProps = { data?: FooterData | null };

const STORAGE_BASE = "https://vgc.psofttechnologies.in/storage/";

function normalizeUrl(raw?: string) {
  if (!raw) return "/";
  let url = raw.trim().replace(/\\/g, "");
  if (/^https?:\/\//i.test(url)) return url;   // absolute/external
  if (!url.startsWith("/")) url = `/${url}`;
  if (url === "/home") return "/";
  return url; // keep /about-us, /services as-is
}

function normalizePhoneToHref(raw?: string) {
  if (!raw) return "tel:+123456789100";
  const trimmed = raw.trim();
  if (trimmed.startsWith("tel:")) return trimmed;
  const digits = trimmed.replace(/\s+/g, "");
  return `tel:${digits}`;
}

const iconMap: Record<string, string> = {
  facebook: "fb.svg",
  twitter: "tw.svg",
  linkedin: "link.svg",
  instagram: "ins.svg",
  pinterest: "pint.svg",
};

function pickIcon(platform: string, explicit?: string | null) {
  if (explicit && explicit.trim()) {
    // if backend ever sends relative path like "builder/icons/xyz.svg"
    return /^https?:\/\//i.test(explicit)
      ? explicit
      : `${STORAGE_BASE}${explicit.replace(/^\/+/, "")}`;
  }
  const local = iconMap[(platform || "").toLowerCase()] ?? "link.svg";
  return `/images/${local}`;
}

export default function Footer({ data }: FooterProps) {
  // --- Column 1 (branding)
  const logoPath = data?.column_1?.logo?.trim() || "";
  const logoUrl = logoPath
    ? `${STORAGE_BASE}${logoPath.replace(/^\/+/, "")}` // ✅ no extra "builder/"
    : "/images/logo.svg";

  const description =
    data?.column_1?.description ??
    "Don't let finance and tax problems hold you back. At VGC Advisors, we are committed to empowering your business with expert financial advice and tailored solutions.";

  const displayPhone = data?.column_1?.phone ?? "+123 456 789 100";
  const phoneHref = normalizePhoneToHref(displayPhone);
  const email = data?.column_1?.email ?? "hi@vgc@gmail.com";

  // --- Column 2 (navigation)
  const navItems: NavigationItem[] =
    data?.column_2?.navigation?.length
      ? [...data.column_2.navigation].sort((a, b) => a.order - b.order)
      : [
          { label: "Home", url: "/", is_external: false, order: 1 },
          { label: "About", url: "/about-us", is_external: false, order: 2 },
          { label: "Services", url: "/services", is_external: false, order: 3 },
          { label: "Blog", url: "/blog", is_external: false, order: 4 },
          { label: "Contact", url: "/contact", is_external: false, order: 5 },
        ];
  const showNav = data?.column_2?.show_navigation ?? true;

  // --- Column 3 (social + newsletter)
  const socialLinks = data?.column_3?.social_links || [];
  const newsletter = data?.column_3?.newsletter;

  // --- Bottom bar
  const leftText = data?.bottom_bar?.left_text || "VGC Consulting Pvt. Ltd.";
  const rightText = data?.bottom_bar?.right_text || "Copyright © 2025. All rights reserved.";

  return (
    <footer>
      <div className="container">
        <div className="row" style={{ alignItems: "flex-start" }}>
          {/* Branding */}
          <div className="col-xl-4 col-lg-4 col-md-4" style={{ minWidth: 0 }}>
            <Link href="/" aria-label="Home">
              <Image
                src={logoUrl}
                alt="logo"
                width={220}
                height={64}
                loading="lazy"
                unoptimized
                // Clamp the visual height to avoid layout break
                style={{
                  height: "clamp(32px, 6vw, 56px)",
                  width: "auto",
                  maxWidth: "100%",
                  objectFit: "contain",
                  display: "block",
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/images/logo.svg";
                }}
              />
            </Link>

            <p style={{ marginTop: 12 }}>{description}</p>

            <ul className="info-list">
              <li>
                <a href={phoneHref} style={{ display: "inline-flex", alignItems: "center" }}>
                  <Image src="/images/ph.svg" alt="phone icon" width={15} height={15} loading="lazy" />
                  <span style={{ paddingLeft: 6, wordBreak: "break-word" }}>{displayPhone}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${email}`} style={{ display: "inline-flex", alignItems: "center" }}>
                  <Image src="/images/ms.svg" alt="email icon" width={15} height={15} loading="lazy" />
                  <span style={{ paddingLeft: 6, wordBreak: "break-word" }}>{email}</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Navigation */}
          <div className="col-xl-3 col-lg-3 col-md-2 offset-xl-1" style={{ minWidth: 0 }}>
            <h2>Navigation</h2>
            {showNav && (
              <ul>
                {navItems.map((item) => {
                  const href = normalizeUrl(item.url);
                  const external = item.is_external || /^https?:\/\//i.test(item.url || "");
                  return (
                    <li key={`${item.order}-${item.label}`}>
                      {external ? (
                        <a href={href} target="_blank" rel="noopener noreferrer">
                          {item.label}
                        </a>
                      ) : (
                        <Link href={href}>{item.label}</Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Social + Newsletter */}
          <div className="col-xl-4 col-lg-5 col-md-6" style={{ minWidth: 0 }}>
            <ul className="social-icon" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {socialLinks.map((social, idx) => {
                const iconSrc = pickIcon(social.platform, social.icon || undefined);
                const href = social.url?.trim() ? social.url : "#";
                const label = (social.platform || "social").toLowerCase();
                const external = /^https?:\/\//i.test(href);
                return (
                  <li key={idx} style={{ listStyle: "none" }}>
                    <a
                      href={href}
                      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      aria-label={`${label} social link`}
                    >
                      <Image
                        src={iconSrc}
                        alt={`${label} icon`}
                        width={30}
                        height={30}
                        loading="lazy"
                        unoptimized
                        style={{ display: "block", objectFit: "contain" }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/images/link.svg";
                        }}
                      />
                    </a>
                  </li>
                );
              })}
            </ul>

            {newsletter?.enabled && (
              <>
                <h2>{newsletter.heading}</h2>
                <p>{newsletter.subtext}</p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const input = (e.currentTarget.querySelector(".box") as HTMLInputElement) || null;
                    const emailVal = input?.value?.trim();
                    if (!emailVal) alert("Please enter your email");
                    else {
                      alert(`Subscribed: ${emailVal}`);
                      if (input) input.value = "";
                    }
                  }}
                >
                  <input className="box" type="text" placeholder="Your Email" />
                  <input type="submit" className="call-btn" value="Subscribe" />
                </form>
              </>
            )}
          </div>

          {/* Bottom bar */}
          <div className="col-lg-12 col-md-12">
            <div className="copy-txt" style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <h6 style={{ margin: 0 }}>{leftText}</h6>
              <h6 style={{ margin: 0, textAlign: "center", flex: "1 1 auto" }}>{rightText}</h6>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
