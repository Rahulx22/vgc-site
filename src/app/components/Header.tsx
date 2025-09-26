"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

type NavigationItem = {
  label: string;
  url: string;
  is_external: boolean;
  order: number;
};

type HeaderData = {
  logo: string;
  navigation: NavigationItem[];
  button: {
    text: string;
    link: string;
  };
};

type HeaderProps = {
  data?: HeaderData | null;
};

export default function Header({ data }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);

  // scroll class behavior (unchanged)
useEffect(() => {
  const header = headerRef.current;

  function handleScroll() {
    if (!header) return; // check inside here
    if (window.scrollY > 50) {
      header.classList.add("smaller");
    } else {
      header.classList.remove("smaller");
    }
  }
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
  return () => window.removeEventListener("scroll", handleScroll);
}, []);

  // close on ESC
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  
  useEffect(() => {
    if (menuOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev || "";
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [menuOpen]);

  const closeMenu = () => {
    setMenuOpen(false);
    setServicesOpen(false);
  };

  // Default values
  const logoUrl = data?.logo ? `https://vgc.psofttechnologies.in/storage/builder/${data.logo}` : "/images/logo.svg";
  const navigation = data?.navigation || [
    { label: "Home", url: "/", is_external: false, order: 1 },
    { label: "About", url: "/about-us", is_external: false, order: 2 },
    { label: "Services", url: "/service", is_external: false, order: 3 },
    { label: "Blog", url: "/blog", is_external: false, order: 4 },
    { label: "Contact", url: "/contact-us", is_external: false, order: 5 }
  ];
  const buttonText = data?.button?.text || "Contact Us";
  const buttonLink = data?.button?.link || "/contact-us";

  return (
    <header ref={headerRef}>
      <div className="container">
        <div className="row">
          <div
            className="col-lg-12 col-md-12"
            style={{ alignItems: "center", display: "flex", justifyContent: "space-between" }}
          >
            <div className="d-none d-md-inline-flex" style={{ alignItems: "center" }}>
              <Link href="/" aria-label="Home">
                <Image src={logoUrl} alt="logo" width={200} height={109} style={{ filter: "none" }} />
              </Link>
            </div>

            {/* Mobile logo (small screens) */}
            <div className="mob-logo d-md-none" style={{ display: "flex", alignItems: "center" }}>
              <Link href="/" aria-label="Home (mobile)">
                <Image src={logoUrl} alt="logo" width={120} height={60} style={{ filter: "none" }} />
              </Link>
            </div>

            {/* Navbar: toggler + desktop nav */}
            <nav className="navbar navbar-expand-md" style={{ flex: 1, marginLeft: 20 }}>
              {/* Mobile toggler (animated to X when menuOpen) */}
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
                {/* three bars; CSS will animate them into X when .open */}
                <span className="icon-bar top" />
                <span className="icon-bar middle" />
                <span className="icon-bar bottom" />
              </button>

              {/* Desktop inline nav (md+) */}
              <div className="navbar-collapse collapse d-none d-md-flex" id="navbarCollapse" style={{ marginLeft: "auto" }}>
                <ul className="navbar-nav" style={{ display: "flex", gap: 12, alignItems: "center", marginLeft: "auto" }}>
                  {navigation
                    .sort((a, b) => a.order - b.order)
                    .map((item) => (
                      <li key={item.order} className="nav-item">
                        <Link href={item.url} className="nav-link">{item.label}</Link>
                      </li>
                    ))}
                </ul>
              </div>
            </nav>

            {/* Contact button */}
            <div style={{ marginLeft: 20 }}>
              <Link href={buttonLink} className="cont-btn">{buttonText}</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Offcanvas drawer for mobile */}
      <div className={`offcanvas-left ${menuOpen ? "open" : ""}`} role="dialog" aria-modal={menuOpen}>
        {/* We intentionally do NOT show logo inside drawer (CSS hides .offcanvas-logo) */}
        <div className="offcanvas-header">
          <div className="offcanvas-logo" aria-hidden="true" />
          {/* removed the duplicate close button here intentionally to avoid double icons */}
        </div>

        <nav className="offcanvas-nav">
          <ul>
            {navigation
              .sort((a, b) => a.order - b.order)
              .map((item) => (
                <li key={item.order}>
                  <Link href={item.url} onClick={closeMenu}>{item.label}</Link>
                </li>
              ))}
          </ul>
        </nav>
      </div>

      {/* Backdrop overlay */}
      <div className={`offcanvas-backdrop ${menuOpen ? "show" : ""}`} onClick={closeMenu} />
    </header>
  );
}
