"use client";

import Image from "next/image";
import { ClientItem } from "../../types/home";

export default function Clients({
  items,
  title,
  subtitle,
}: {
  items: ClientItem[];
  title?: string;
  subtitle?: string;
}) {
  return (
    <div className="client-sec">
      <div className="container">
        <div className="row">
          <div className="col-xl-6 col-lg-8 col-md-10 offset-xl-3 offset-lg-2 offset-md-1">
            <h2 data-aos="fade-up" data-aos-duration="1200">{title || "Our Clients"}</h2>
            {subtitle ? (
              <p>{subtitle}</p>
            ) : (
              <p>
                Wisdom new and valley answer. Contented it so is discourse recommend. Man
                its upon him call mile. An pasture he himself believe ferrars besides cottage.
              </p>
            )}
          </div>
        </div>

        <div className="row" data-aos="fade-down" data-aos-duration="1200">
          {items.map((c, i) => (
            <div key={i} className="col-lg-2 col-md-4 text-center">
              <figure>
                <Image
                  src={c.icon}
                  alt={c.title}
                  width={70}
                  height={70}
                  loading="lazy"
                />
                <figcaption>
                  <h3>{c.title}</h3>
                </figcaption>
              </figure>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
