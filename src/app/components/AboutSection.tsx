import Image from "next/image";

interface AboutSectionProps {
  title: string;
  paragraphs: string[];
  image: string;
  imageAlt: string;
  reverse?: boolean;
  className?: string;
  subtitle?: string;
  subtitle2?: string;
  ctaText?: string;
  ctaLink?: string;
}

export default function AboutSection({ 
  title, 
  paragraphs, 
  image, 
  imageAlt, 
  reverse = false,
  className = "",
  subtitle,
  subtitle2,
  ctaText,
  ctaLink
}: AboutSectionProps) {
  return (
    <div className={`about-sec ${className}`}>
      <div className="container">
        <div className="row">
          <div 
            className={`col-lg-6 col-md-12 ${reverse ? 'order-lg-2' : ''}`} 
            data-aos={reverse ? "fade-left" : "fade-right"} 
            data-aos-duration="1200"
          >
            <h2>{title}</h2>
            
            {subtitle && <h3>{subtitle}</h3>}
            {subtitle2 && <h3>{subtitle2}</h3>}

            {paragraphs.map((paragraph, index) => (
              paragraph.startsWith("<em>") ? (
                <p key={index}><em>{paragraph.replace(/<\/?em>/g, "")}</em></p>
              ) : (
                <p key={index}>{paragraph}</p>
              )
            ))}

            {ctaText && ctaLink && (
              <a className="see-btn" href={ctaLink}>{ctaText}</a>
            )}
          </div>
          
          <div 
            className={`col-lg-6 col-md-12 ${reverse ? 'order-lg-1' : ''}`} 
            data-aos={reverse ? "fade-right" : "fade-left"} 
            data-aos-duration="1200"
          >
            <Image 
              className="w-100" 
              src={image} 
              alt={imageAlt} 
              width={700} 
              height={400} 
              loading="lazy"
              unoptimized
            />
          </div>
        </div>
      </div>
    </div>
  );
}
