"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";

type NavigationItem = {
  label: string;
  url: string;
  is_external: boolean;
  order: number;
};

type HeaderData = {
  logo: string; // "builder/header/xxx.png"
  navigation: NavigationItem[];
  button: { text: string; link: string };
};

type ApiShape = {
  success: boolean;
  data: { header: HeaderData };
};

type HeaderProps = { data?: HeaderData | ApiShape | null };

export default function Header({ data }: HeaderProps) {
  // ---- extract header from either shape
  const header: HeaderData | null = useMemo(() => {
    const maybeApi = data as ApiShape | undefined;
    const maybeHeader = data as HeaderData | undefined;
    if (maybeHeader?.navigation && Array.isArray(maybeHeader.navigation)) return maybeHeader;
    if (maybeApi?.data?.header?.navigation) return maybeApi.data.header;
    return null;
  }, [data]);

  const [menuOpen, setMenuOpen] = useState(false);
  const [logoSrc, setLogoSrc] = useState<string>("/images/logo.svg");
  const headerRef = useRef<HTMLElement | null>(null);

  const STORAGE_BASE = "https://vgc.psofttechnologies.in/storage/";

  // ---- helpers
  const normalizeUrl = (raw?: string) => {
    if (!raw) return "/";
    let url = raw.trim().replace(/\\/g, "");
    // external absolute
    if (/^https?:\/\//i.test(url)) return url;
    // internal
    if (!url.startsWith("/")) url = `/${url}`;
    // map /home -> /
    if (url === "/home") return "/";
    // DO NOT touch slugs like '/about-us'
    return url;
  };

  const isExternal = (item: NavigationItem) =>
    item.is_external || /^https?:\/\//i.test(item.url || "");

  // ---- derive data
  const navigation: NavigationItem[] = useMemo(() => {
    if (header?.navigation?.length) {
      // sort + filter invalid
      const sorted = [...header.navigation]
        .filter((n) => !!n?.label && !!n?.url)
        .sort((a, b) => a.order - b.order);
      // debug: verify what we render
      
      return sorted;
    }
    // fallback ONLY if header missing
    return [
      { label: "Home", url: "/", is_external: false, order: 1 },
      { label: "About", url: "/", is_external: false, order: 2 },
      { label: "Services", url: "/services", is_external: false, order: 3 },
      { label: "Blog", url: "/blog", is_external: false, order: 4 },
      { label: "Contact", url: "/contact", is_external: false, order: 5 },
    ];
  }, [header?.navigation]);

  const buttonText = header?.button?.text ?? "Get Quote";
  const buttonHref = normalizeUrl(header?.button?.link ?? "/contact-us");

  // ---- set logo safely
  useEffect(() => {
    if (header?.logo) {
      setLogoSrc(`${STORAGE_BASE}${header.logo}`);
    } else {
      setLogoSrc("/images/logo.svg");
    }
  }, [header?.logo]);

  // ---- shrink on scroll
  useEffect(() => {
    const node = headerRef.current;
    function onScroll() {
      if (!node) return;
      if (window.scrollY > 50) node.classList.add("smaller");
      else node.classList.remove("smaller");
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ---- ESC to close
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // ---- lock body scroll on menu
  useEffect(() => {
    if (!menuOpen) {
      document.body.style.overflow = "";
      return;
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header ref={headerRef}>
      <div className="container">
        <div className="row">
          <div
            className="col-lg-12 col-md-12"
            style={{ alignItems: "center", display: "flex", justifyContent: "space-between" }}
          >
            {/* Desktop logo (clamped height) */}
            <div className="d-none d-md-inline-flex" style={{ alignItems: "center" }}>
              <Link href="/" aria-label="Home">
                <Image
                  src={logoSrc}
                  alt="logo"
                  width={200}
                  height={80}
                  priority
                  unoptimized
                  style={{
                    height: "56px",
                    width: "auto",
                    objectFit: "contain",
                  }}
                  onError={() => setLogoSrc("/images/logo.svg")}
                />
              </Link>
            </div>

            {/* Mobile logo (tighter clamp) */}
            <div className="mob-logo d-md-none" style={{ display: "flex", alignItems: "center" }}>
              <Link href="/" aria-label="Home (mobile)">
                <Image
                  src={logoSrc}
                  alt="logo"
                  width={140}
                  height={44}
                  priority
                  unoptimized
                  style={{
                    height: "44px",
                    width: "auto",
                    objectFit: "contain",
                  }}
                  onError={() => setLogoSrc("/images/logo.svg")}
                />
              </Link>
            </div>

            {/* Navbar */}
            <nav className="navbar navbar-expand-md" style={{ flex: 1, marginLeft: 20 }}>
              <button
                className={`navbar-toggler ${menuOpen ? "open" : "collapsed"}`}
                type="button"
                aria-controls="navbarCollapse"
                aria-expanded={menuOpen}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                onClick={() => setMenuOpen((s) => !s)}
                style={{ border: "none", background: "transparent" }}
              >
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar top" />
                <span className="icon-bar middle" />
                <span className="icon-bar bottom" />
              </button>

              {/* Desktop inline nav */}
              <div className="navbar-collapse collapse d-none d-md-flex" id="navbarCollapse" style={{ marginLeft: "auto" }}>
                <ul className="navbar-nav" style={{ display: "flex", gap: 12, alignItems: "center", marginLeft: "auto" }}>
                  {navigation.map((item) => {
                    const href = normalizeUrl(item.url);
                    const key = `${item.order}-${item.label}`;
                    if (!href) return null;
                    return (
                      <li key={key} className="nav-item">
                        {isExternal(item) ? (
                          <a className="nav-link" href={href} target="_blank" rel="noopener noreferrer">
                            {item.label}
                          </a>
                        ) : (
                          <Link href={href} className="nav-link">
                            {item.label}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </nav>

            {/* CTA Button */}
            <div style={{ marginLeft: 20 }}>
              <Link href={buttonHref} className="cont-btn">
                {buttonText}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Offcanvas drawer for mobile */}
      <div className={`offcanvas-left ${menuOpen ? "open" : ""}`} role="dialog" aria-modal={menuOpen}>
        <div className="offcanvas-header">
          <div className="offcanvas-logo" aria-hidden="true" />
        </div>
        <nav className="offcanvas-nav">
          <ul>
            {navigation.map((item) => {
              const href = normalizeUrl(item.url);
              const key = `m-${item.order}-${item.label}`;
              if (!href) return null;
              return (
                <li key={key}>
                  {isExternal(item) ? (
                    <a href={href} target="_blank" rel="noopener noreferrer" onClick={closeMenu}>
                      {item.label}
                    </a>
                  ) : (
                    <Link href={href} onClick={closeMenu}>
                      {item.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Backdrop */}
      <div className={`offcanvas-backdrop ${menuOpen ? "show" : ""}`} onClick={closeMenu} />
    </header>
  );
}
