import InnerBanner from "../components/InnerBanner";
import BlogCard from "../components/BlogCard";
import { API_URL, fetchWithTimeout, ensureUrl, stripHtml } from "../../lib/api";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Add dynamic metadata
export const metadata: Metadata = {
  title: "Blog | VGC Consulting",
  description: "Stay updated with the latest insights on business, tax, and compliance solutions from VGC Consulting experts.",
  keywords: "business blog, tax insights, compliance updates, financial advice, industry news",
};

type ApiResponse = {
  success: boolean;
  data: ApiPage[];
};

type ApiPage = {
  id: number;
  slug: string;
  type: string; 
  blocks: Array<{
    type: string; 
    data: any;
  }>;
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
};

function formatDate(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

async function getBlogPage(): Promise<ApiPage | null> {
  try {
    const res = await fetchWithTimeout(API_URL, { cache: "no-store" });
    if (!res.ok) {
      console.error(`Blog API returned status ${res.status}`);
      return null;
    }
    const json: ApiResponse = await res.json();
    const pages = json?.data ?? [];
    return pages.find((p) => p.type === "blog") ?? null;
  } catch (error) {
    console.error('Error fetching blog page:', error);
    return null;
  }
}

export default async function BlogPage() {
  const page = await getBlogPage();

  // Fallbacks if something goes wrong
  const bannerBlock = page?.blocks.find((b) => b.type === "banner_slider_section");
  const blogBlock = page?.blocks.find((b) => b.type === "blog_section");

  const banner = Array.isArray(bannerBlock?.data?.banners) && bannerBlock!.data.banners.length
    ? bannerBlock!.data.banners[0]
    : null;

  const blogs: Array<{
    id: string | number;
    title: string;
    excerpt: string;
    image: string;
    date: string;
    slug: string;
  }> = Array.isArray(blogBlock?.data?.blogs)
    ? blogBlock!.data.blogs
        .filter((b: any) => !b.status || b.status === 'active' || b.status === 'Active' || b.status === 'ACTIVE')
        .map((b: any) => ({
          id: b.id,
          title: b.title,
          excerpt: stripHtml(b.short_description),
          image: ensureUrl(b.featured_image || b.cover_image),
          date: formatDate(b.created_at),
          slug: b.slug,
        }))
    : [];

  const pageTitle = blogBlock?.data?.title || banner?.title || "Our Blog";
  const bannerImg = ensureUrl(banner?.image);
  const breadcrumb = [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
  ];

  return (
    <>
      <InnerBanner
        title={pageTitle}
        breadcrumb={breadcrumb}
        image={bannerImg}
        alt="Blog banner"
      />

      <div className="blog-sec dd">
        <h2 data-aos="fade-up" data-aos-duration="1200">{pageTitle}</h2>
        <div className="container">
          <div className="row">
            {blogs.map((blog) => (
              <BlogCard
                key={blog.id}
                id={String(blog.id)}
                title={blog.title}
                excerpt={blog.excerpt}
                image={blog.image}
                date={blog.date}
                slug={blog.slug}
              />
            ))}

            {/* Optional: graceful empty state */}
            {blogs.length === 0 && (
              <div className="col-12">
                <p>No blog posts available right now.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}