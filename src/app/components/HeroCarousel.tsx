"use client";

import Image from "next/image";
import { Hero } from "../../types/home";
import React from "react";

export default function HeroCarousel({ hero }: { hero: Hero }) {
  return (
    <div className="main">
      <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          {hero.banners.map((src, idx) => (
            <div key={idx} className={`carousel-item ${idx === 0 ? "active" : ""}`}>
              <Image 
                className="w-100" 
                src={src} 
                alt={`banner-${idx}`} 
                width={1920} 
                height={600} 
                loading="eager" 
                priority={idx === 0}
                quality={85}
                sizes="100vw"
                style={{
                  width: '100%',
                  height: 'auto'
                }}
              />
              <div className="carousel-caption">
                <div className="container">
                  <div className="row">
                    <div className="col-xl-7 col-lg-9 col-md-12" data-aos="fade-right" data-aos-duration="1200">
                      <h1>{hero.title}</h1>

                      {hero.paragraphs.map((p, i) => (
                        <p key={i}>{p}</p>
                      ))}

                      {/* CORRECT: tel uses hero.phone */}
                      {hero.phone && (
                        <a className="call-btn" href={`tel:${hero.phone}`}>
                          {hero.phone}
                        </a>
                      )}

                      <ul className="count-list">
                        {hero.counters.map((c, i) => (
                          <li key={i} data-aos="fade-up" data-aos-duration="1000" data-aos-delay={i * 200}>
                            <h2>
                              <span className="counter-count">{c.value}</span>
                              {c.suffix || (c.label.includes('Rate') ? '%' : '')}
                            </h2>
                            {c.label}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev" aria-label="Previous slide">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        </button>

        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next" aria-label="Next slide">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
        </button>
      </div>
    </div>
  );
}