"use client";

import Link from "next/link";
import Image from "next/image";
import React from "react";

type FooterData = {
  phone?: string;
  email?: string;
  social?: string[]; 
  copyright?: string;
};

type FooterProps = {
  footer?: FooterData | null;
};

function normalizePhoneToHref(raw?: string) {
  if (!raw) return "tel:+123456789100";
  const trimmed = raw.trim();
  if (trimmed.startsWith("tel:")) return trimmed;
  const digits = trimmed.replace(/\s+/g, "");
  return `tel:${digits}`;
}

export default function Footer({ footer }: FooterProps) {
  const displayPhone = footer?.phone ?? "+123 456 789 100";
  const phoneHref = normalizePhoneToHref(footer?.phone ?? displayPhone);

  const email = footer?.email ?? "hi@vgc@gmail.com";
  const social = Array.isArray(footer?.social) && footer!.social.length ? footer!.social : ["#", "#", "#", "#", "#"];
  const copyright = footer?.copyright ?? "Copyright © 2025. All rights reserved.";

  const defaultIcons = ["fb.svg", "pint.svg", "link.svg", "ins.svg", "tw.svg"];
  const pickIcon = (i: number) => `/images/${defaultIcons[i] ?? "link.svg"}`;

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
              <Image src="/images/logo.svg" alt="logo" width={150} height={50} loading="lazy" />
            </Link>

            <p>
              Don&apos;t let finance and tax problems hold you back. At VGC Advisors, we are committed to empowering your business with expert financial advice and tailored solutions. Contact us today to learn how we can help you thrive.
            </p>

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
              <li><Link href="/">Home</Link></li>
              <li><Link href="/about-us">About Us</Link></li>
              <li><Link href="/career">Careers</Link></li>
              <li><Link href="/service">Services</Link></li>
              <li><Link href="/blog">Blogs</Link></li>
            </ul>
          </div>

          {/* social + newsletter */}
          <div className="col-xl-4 col-lg-5 col-md-6">
            <ul className="social-icon">
              {social.map((sUrl, idx) => (
                <li key={idx}>
                  <a
                    href={sUrl && sUrl.trim() !== "" ? sUrl : "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Social ${idx + 1}`}
                  >
                    <Image src={pickIcon(idx)} alt={`social-${idx + 1}`} width={30} height={30} loading="lazy" />
                  </a>
                </li>
              ))}
            </ul>

            <h2>Subscribe Our Newsletter</h2>
            <p>Egestas tempus neque amet suspendisse ornare nibh elit morbi. Leo iaculis proin orci sed.</p>

            <form onSubmit={handleSubscribe}>
              <input className="box" type="text" placeholder="Your Email" />
              <input type="submit" className="call-btn" value="Subscribe" />
            </form>
          </div>

          <div className="col-lg-12 col-md-12">
            <div className="copy-txt">
              <h6>VGC Consulting Opt.</h6>
              <center><h6>{copyright}</h6></center>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
