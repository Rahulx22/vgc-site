"use client";

import Image from "next/image";
import { Hero } from "../../types/home";
import React from "react";

export default function HeroCarousel({ hero }: { hero: Hero }) {
  return (
    <div className="main">
      <div
        id="carouselExampleControls"
        className="carousel slide"
        data-bs-ride="carousel"
      >
        <div className="carousel-inner">
          {hero.banners.map((src, idx) => (
            <div
              key={idx}
              className={`carousel-item ${idx === 0 ? "active" : ""}`}
            >
              <Image
                className="w-100"
                src={src}
                alt={`banner-${idx}`}
                width={1920}
                height={600}
                loading="lazy"
              />

              <div className="carousel-caption">
                <div className="container">
                  <div className="row">
                    <div
                      className="col-xl-7 col-lg-9 col-md-12"
                      data-aos="fade-right"
                      data-aos-duration="1200"
                    >
                      <h1>{hero.title}</h1>

                      {hero.paragraphs.map((p, i) => (
                        <p key={i}>{p}</p>
                      ))}

                      <a className="call-btn" href={`tel:${hero.phone}`}>
                        Make a Call {hero.phone}
                      </a>

                      <ul className="count-list">
                        {hero.counters.map((c, i) => (
                          <li key={i}>
                            <h2>
                              <span className="counter-count">{c.value}</span>
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

        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleControls"
          data-bs-slide="prev"
          aria-label="Previous slide"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
        </button>

        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleControls"
          data-bs-slide="next"
          aria-label="Next slide"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
        </button>
      </div>
    </div>
  );
}
