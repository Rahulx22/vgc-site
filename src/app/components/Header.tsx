"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
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

  const openMenu = () => setMenuOpen(true);
  const closeMenu = () => {
    setMenuOpen(false);
    setServicesOpen(false);
  };

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
                <Image src="/images/logo.svg" alt="logo" width={200} height={109} style={{ filter: "none" }} />
              </Link>
            </div>

            {/* Mobile logo (small screens) */}
            <div className="mob-logo d-md-none" style={{ display: "flex", alignItems: "center" }}>
              <Link href="/" aria-label="Home (mobile)">
                <Image src="/images/logo.svg" alt="logo" width={120} height={60} style={{ filter: "none" }} />
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
                  <li className="nav-item active">
                    <Link href="/" className="nav-link">Home</Link>
                  </li>

                  <li className="nav-item">
                    <Link href="/about-us" className="nav-link">About Us</Link>
                  </li>

                  <li className="nav-item dropdown">
                    <Link href="/service" className="nav-link">Services</Link>
                  </li>

                  <li className="nav-item">
                    <Link href="/blog" className="nav-link">Blog</Link>
                  </li>

                  <li className="nav-item">
                    <Link href="/career" className="nav-link">Career</Link>
                  </li>
                </ul>
              </div>
            </nav>

            {/* Contact button (unchanged) */}
            <div style={{ marginLeft: 20 }}>
              <Link href="/contact-us" className="cont-btn">Contact Us</Link>
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
            <li>
              <Link href="/" onClick={closeMenu}>Home</Link>
            </li>
            <li>
              <Link href="/about-us" onClick={closeMenu}>About Us</Link>
            </li>
            <li>
              <button className="services-toggle" onClick={() => setServicesOpen((s) => !s)}>
                Services <span className={`chev ${servicesOpen ? "open" : ""}`}>▾</span>
              </button>
              <ul className={`sub-menu ${servicesOpen ? "open" : ""}`}>
                <li><Link href="/business-support" onClick={closeMenu}>Business Support</Link></li>
                <li><a href="#" onClick={closeMenu}>Direct Tax Services</a></li>
                <li><a href="#" onClick={closeMenu}>Indirect Tax Services</a></li>
              </ul>
            </li>
            <li>
              <Link href="/blog" onClick={closeMenu}>Blog</Link>
            </li>
            <li>
              <Link href="/career" onClick={closeMenu}>Career</Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Backdrop overlay */}
      <div className={`offcanvas-backdrop ${menuOpen ? "show" : ""}`} onClick={closeMenu} />
    </header>
  );
}
