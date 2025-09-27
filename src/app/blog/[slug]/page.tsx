import Image from "next/image";
import { notFound } from "next/navigation";
import { API_URL, fetchWithTimeout, ensureUrl, stripHtml } from "../../../lib/api";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const dynamicParams = true;

interface BlogSingleProps {
  params: {
    slug: string;
  };
}

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  long_description: string;
  featured_image: string;
  cover_image: string;
  created_at: string;
  updated_at: string;
}

function formatDate(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

// Parse HTML content into structured format
function parseHtmlContent(html: string) {
  if (!html) return [];
  
  // Split by headings and paragraphs
  const sections = html.split(/(<h[1-6][^>]*>.*?<\/h[1-6]>|<p[^>]*>.*?<\/p>)/g)
    .filter(section => section.trim())
    .map(section => {
      const headingMatch = section.match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/);
      const paragraphMatch = section.match(/<p[^>]*>(.*?)<\/p>/);
      
      if (headingMatch) {
        return {
          type: "heading",
          text: stripHtml(headingMatch[1])
        };
      } else if (paragraphMatch) {
        return {
          type: "paragraph", 
          text: stripHtml(paragraphMatch[1])
        };
      } else {
        // Handle plain text
        const cleanText = stripHtml(section);
        return cleanText ? {
          type: "paragraph",
          text: cleanText
        } : null;
      }
    })
    .filter(Boolean);
    
  return sections;
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const res = await fetchWithTimeout(API_URL, { cache: "no-store" });
    if (!res.ok) {
      console.error(`Blog API returned status ${res.status}`);
      return null;
    }
    
    const json = await res.json();
    const pages = Array.isArray(json?.data) ? json.data : [];
    const blogPage = pages.find((p: any) => p.type === "blog");
    
    if (!blogPage) {
      console.error('Blog page not found');
      return null;
    }
    
    const blogBlock = blogPage.blocks?.find((b: any) => b.type === "blog_section");
    const blogs = blogBlock?.data?.blogs || [];
    
    const blog = blogs.find((b: any) => b.slug === slug);
    return blog || null;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

export default async function BlogSinglePage({ params }: BlogSingleProps) {
  const { slug } = params;
  const blogPost = await getBlogPost(slug);
  
  if (!blogPost) {
    notFound();
  }
  
  const content = parseHtmlContent(blogPost.long_description);
  const image = ensureUrl(blogPost.featured_image || blogPost.cover_image);
  const date = formatDate(blogPost.created_at);

  return (
    <>
      <div className="blog-txt">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-md-12">
              <Image
                className="w-100"
                src={image}
                alt={blogPost.title}
                width={1920}
                height={400}
                loading="lazy"
              />
              <h1>{blogPost.title}</h1>
              <h5>{date}</h5>

              {content.map((item, index) => (
                <div key={blogPost.id + "-" + index}>
                  {item?.type === "heading" ? (
                    <h6>{item.text}</h6>
                  ) : (
                    <p>{item?.text}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function generateStaticParams() {
  try {
    const res = await fetchWithTimeout(API_URL, { cache: "no-store" });
    if (!res.ok) return [];
    
    const json = await res.json();
    const pages = Array.isArray(json?.data) ? json.data : [];
    const blogPage = pages.find((p: any) => p.type === "blog");
    
    if (!blogPage) return [];
    
    const blogBlock = blogPage.blocks?.find((b: any) => b.type === "blog_section");
    const blogs = blogBlock?.data?.blogs || [];
    
    return blogs.map((blog: any) => ({
      slug: blog.slug,
    }));
  } catch {
    return [];
  }
}
