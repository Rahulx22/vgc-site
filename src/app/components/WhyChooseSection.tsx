import Image from "next/image";
import React from "react";

interface Feature {
  icon?: string | null;
  title: string;
  description: string;
}

interface WhyChooseSectionProps {
  title: string;
  features?: Feature[] | null;
}

export default function WhyChooseSection({ title, features }: WhyChooseSectionProps) {
  if (!Array.isArray(features) || features.length === 0) {
    console.warn("WhyChooseSection: no features provided or invalid features", { features });
    return null;
  }

  const fallback = "/images/abt-icon.webp"; 

  return (
    <div className="why-sec">
      <h2 data-aos="fade-up" data-aos-duration="1200">
        <strong>Why Choose</strong> {title}
      </h2>
      <div className="container">
        <div className="row">
          {features.map((feature, index) => (
            <div
              key={index}
              className="col-lg-3 col-md-6"
              data-aos={index % 2 === 0 ? "fade-down" : "fade-up"}
              data-aos-duration="1200"
            >
              <Image
                src={feature.icon || fallback}
                alt={`${feature.title} icon`}
                width={150}
                height={150}
                loading="lazy"
                unoptimized
              />
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
