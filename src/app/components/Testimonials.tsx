"use client";

import Image from "next/image";
import { Testimonial } from "../../types/home";
import { useEffect, useRef } from "react";

type TestimonialsProps = {
  items: Testimonial[];
  leftText?: string;
  rightText?: string;
  rightSubtext?: string;
};

export default function Testimonials({
  items,
  leftText = "Building Trust Through Results",
  rightText = "Testimonials",
  rightSubtext = "Client Success Stories: Hear What They Say",
}: TestimonialsProps) {
  const ref = useRef<HTMLDivElement>(null);

  // (Re)initialize Owl on mount / items change
  useEffect(() => {
    const w = window as any;
    const $ = w?.jQuery;
    if (!ref.current || !w || !$ || typeof $.fn?.owlCarousel !== "function") {
      // Owl not loaded - just render static list
      return;
    }

    const $el = $(ref.current);

    // destroy existing (route back case)
    try {
      $el.trigger("destroy.owl.carousel");
    } catch {}

    // init
    $el.owlCarousel({
      items: 1,
      loop: true,
      autoplay: true,
      dots: true,
      margin: 10,
    });

    // refresh AOS if present
    try {
      w.AOS?.refresh?.();
    } catch {}

    // cleanup
    return () => {
      try {
        $el.trigger("destroy.owl.carousel");
      } catch {}
    };
  }, [items?.length]);

  return (
    <div className="testimonial-sec">
      <div className="container">
        <div className="row">
          <div className="col-xl-5 col-lg-6 col-md-10">
            <h2 data-aos="fade-up" data-aos-duration="1200">
              {leftText}
            </h2>
          </div>
          <div className="col-xl-5 col-lg-6 col-md-12 offset-xl-2">
            <h4>{rightText}</h4>
            <h3>{rightSubtext}</h3>
            <div className="comma-icon">
              <strong>
                <Image src="/images/comma.svg" alt="comma" width={30} height={30} loading="lazy" />
              </strong>
            </div>

            {/* Owl root */}
            <div id="testimonial-sec" className="owl-carousel" ref={ref}>
              {items.map((t, i) => (
                <div className="item" key={i}>
                  <p>{t.text}</p>
                  <div className="client-img">
                    <h5>
                      <strong>{"★".repeat(parseInt(t.rating || "5", 10))}</strong> {t.author}
                    </h5>
                    <Image src={t.avatar} alt={t.author} width={56} height={56} loading="lazy" />
                  </div>
                </div>
              ))}
            </div>
            {/* If Owl absent, the static markup above still shows items vertically */}
          </div>
        </div>
      </div>
    </div>
  );
}
