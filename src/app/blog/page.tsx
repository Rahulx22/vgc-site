import InnerBanner from "../components/InnerBanner";
import BlogCard from "../components/BlogCard";

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
};

const API_BASE = "https://vgc.psofttechnologies.in";
const MEDIA_BASE = `${API_BASE}/storage`;

function mediaUrl(path?: string | null) {
  if (!path) return "/images/placeholder.webp";
  const clean = path.replace(/^\/+/, "");
  if (/^https?:\/\//i.test(clean)) return clean;
  return `${MEDIA_BASE}/${clean}`;
}

function stripHtml(html?: string | null, maxLen = 180) {
  if (!html) return "";
  const text = html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  return text.length > maxLen ? `${text.slice(0, maxLen)}…` : text;
}

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
  const res = await fetch(`${API_BASE}/api/v1/pages`, {
    next: { revalidate: 0 },
  });
  if (!res.ok) return null;
  const json: ApiResponse = await res.json();
  const pages = json?.data ?? [];
  return pages.find((p) => p.type === "blog") ?? null;
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
    ? blogBlock!.data.blogs.map((b: any) => ({
        id: b.id,
        title: b.title,
        excerpt: stripHtml(b.short_description),
        image: mediaUrl(b.featured_image),
        date: formatDate(b.created_at),
        slug: b.slug,
      }))
    : [];

  const pageTitle = banner?.title || "Our Blog";
  const bannerImg = mediaUrl(banner?.image);
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
