import { notFound } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Image from "next/image";
import { fetchWithTimeout, ensureUrl, stripHtml, API_URL } from "../../../lib/api";

interface ServiceDetailProps {
  params: {
    slug: string;
  };
}

// Fetch service data from API and parse offerings
async function getServiceData(slug: string) {
  try {
    const res = await fetchWithTimeout(API_URL, { cache: 'force-cache' }, 10000);
    if (!res.ok) {
      throw new Error(`API returned status ${res.status}`);
    }
    
    const json = await res.json();
    const pages = Array.isArray(json?.data) ? json.data : [];
    const homePage = pages.find((p: any) => p.slug === "homepage");
    
    if (!homePage) {
      throw new Error("Homepage not found");
    }

    const blocks = Array.isArray(homePage.blocks) ? homePage.blocks : [];
    const servicesBlock = blocks.find((b: any) => b.type === "services_section");
    const services = servicesBlock?.data?.services || [];
    
    // Find the specific service by slug
    const service = services.find((s: any) => s.slug === slug);
    
    if (!service) {
      return null;
    }

    // Parse the long_description to extract structured offerings
    const longDesc = service.long_description || "";
    const offerings: any[] = [];
    
    // Extract main sections (h2 tags)
    const sectionRegex = /<h2[^>]*><strong[^>]*>([^<]+)<\/strong[^>]*><\/h2>/g;
    const sections = [];
    let match;
    
    while ((match = sectionRegex.exec(longDesc)) !== null) {
      sections.push({
        title: match[1].trim(),
        start: match.index + match[0].length
      });
    }
    
    // Process each section
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const nextSection = sections[i + 1];
      const sectionContent = longDesc.substring(
        section.start, 
        nextSection ? nextSection.start - nextSection.title.length - 20 : longDesc.length
      );
      
      // Extract items from this section
      const items: { title: string; description: string }[] = [];
      const itemRegex = /<li[^>]*><p[^>]*><strong[^>]*>([^<]+)<\/strong[^>]*>\s*([^<]*)<\/p[^>]*><\/li>/g;
      let itemMatch;
      
      while ((itemMatch = itemRegex.exec(sectionContent)) !== null) {
        items.push({
          title: itemMatch[1].trim(),
          description: itemMatch[2].trim().replace(/^[\s–-]+/, '')
        });
      }
      
      // Extract subtitle (h3 after h2)
      const subtitleRegex = /<h3[^>]*><strong[^>]*>([^<]+)<\/strong[^>]*><\/h3>/;
      const subtitleMatch = subtitleRegex.exec(sectionContent);
      
      offerings.push({
        title: section.title,
        subtitle: subtitleMatch ? subtitleMatch[1].trim() : null,
        description: stripHtml(service.short_description || ""),
        items: items
      });
    }
    
    return {
      ...service,
      offerings: offerings.length > 0 ? offerings : [
        {
          title: service.title,
          subtitle: "Our Services",
          description: stripHtml(service.short_description || service.long_description || ""),
          items: []
        }
      ]
    };
  } catch (error) {
    console.error("Failed to fetch service data:", error);
    return null;
  }
}

export default async function ServiceDetailPage({ params }: ServiceDetailProps) {
  const { slug } = await params;
  const service = await getServiceData(slug);

  if (!service) {
    notFound();
  }

  const bannerData = {
    title: service.title,
    description: stripHtml(service.short_description || ""),
    breadcrumb: [
      { label: "Home", href: "/" },
      { label: "Services", href: "/service" },
      { label: service.title, href: "#" }
    ],
    image: ensureUrl(service.featured_image || service.mobile_featured_image) || "/images/service-banner.jpg"
  };

  return (
    <>
      <Header />
      
      <div className="business-banner">
        <div className="container-fluid">
          <div className="row">
            <div className="col-xl-5 col-lg-6 col-md-12 offset-xl-1" 
                 data-aos="fade-right" 
                 data-aos-duration="1200">
              <nav>
                <ol className="breadcrumb">
                  {bannerData.breadcrumb.map((item, index) => (
                    <li key={index} className={`breadcrumb-item ${index === bannerData.breadcrumb.length - 1 ? 'active' : ''}`}>
                      {index === bannerData.breadcrumb.length - 1 ? (
                        item.label
                      ) : (
                        <a href={item.href}>{item.label}</a>
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
              <h1>{bannerData.title}</h1>
              <p>{bannerData.description}</p>
            </div>
            
            <div className="col-xl-6 col-lg-6 col-md-12">
              <Image 
                className="w-100" 
                src={bannerData.image} 
                alt={service.title}
                width={800} 
                height={600} 
                loading="lazy" 
              />
            </div>
          </div>
        </div>
      </div>

      <div className="business-txt">
        <div className="container">
          <div className="row">
            <div className="col-xl-10 col-lg-12 col-md-12 offset-xl-1">
              <div className="business-box" data-aos="fade-up" data-aos-duration="1200">
                {service.offerings.map((offering: any, index: number) => (
                  <div key={index}>
                    {offering.title && <h2>{offering.title}</h2>}
                    {offering.subtitle && <h3>{offering.subtitle}</h3>}
                    {offering.description && <p>{offering.description}</p>}
                    {offering.items.length > 0 && (
                      <ul>
                        {offering.items.map((item: any, itemIndex: number) => (
                          <li key={itemIndex}>
                            <strong>{item.title}</strong> {item.description}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer 
        footer={{
          phone: "+123 456 789 100",
          email: "hi@vGC@gmail.com", 
          social: ["#", "#", "#", "#", "#"],
          copyright: "Copyright © 2025. All rights reserved."
        }}
      />
    </>
  );
}

export async function generateStaticParams() {
  try {
    const res = await fetchWithTimeout(API_URL, { cache: 'force-cache' }, 10000);
    if (!res.ok) return [];
    
    const json = await res.json();
    const pages = Array.isArray(json?.data) ? json.data : [];
    const homePage = pages.find((p: any) => p.slug === "homepage");
    
    if (!homePage) return [];

    const blocks = Array.isArray(homePage.blocks) ? homePage.blocks : [];
    const servicesBlock = blocks.find((b: any) => b.type === "services_section");
    const services = servicesBlock?.data?.services || [];
    
    return services.map((service: any) => ({
      slug: service.slug,
    }));
  } catch {
    return [];
  }
}