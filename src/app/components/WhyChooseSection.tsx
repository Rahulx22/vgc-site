// components/WhyChooseSection.tsx
import Image from "next/image";
import React from "react";

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface WhyChooseSectionProps {
  title: string;
  features?: Feature[] | null;
}

export default function WhyChooseSection({ title, features }: WhyChooseSectionProps) {
  // Defensive: if features is not an array, don't try to map and avoid server crash
  if (!Array.isArray(features) || features.length === 0) {
    // Optional: render nothing or a fallback markup
    console.warn("WhyChooseSection: no features provided or features is not an array", { features });
    return null;
  }

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
              {/* Image requires a valid src. If feature.icon is missing, show nothing */}
              {feature.icon ? (
                <Image
                  src={feature.icon}
                  alt={`${feature.title} icon`}
                  width={150}
                  height={150}
                  loading="lazy"
                />
              ) : null}
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
