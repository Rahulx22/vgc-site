import Header from "../components/Header";
import Footer from "../components/Footer";
import InnerBanner from "../components/InnerBanner";
import BlogCard from "../components/BlogCard";
import blogData from "../../data/blog.json";
import type { BlogPage } from "../../types/pages";

export default function BlogPage() {
  const data: BlogPage = blogData;

  return (
    <>
      <Header />
      
      <InnerBanner
        title={data.banner.title}
        breadcrumb={data.banner.breadcrumb}
        image="/images/blog-banner.webp"
        alt="blog-banner"
      />

      <div className="blog-sec dd">
        <h2 data-aos="fade-up" data-aos-duration="1200">{data.banner.title}</h2>
        <div className="container">
          <div className="row">
            {data.blogs.map((blog) => (
              <BlogCard
                key={blog.id}
                id={blog.id}
                title={blog.title}
                excerpt={blog.excerpt}
                image={blog.image}
                date={blog.date}
                slug={blog.slug}
              />
            ))}
          </div>
        </div>
      </div>

      <Footer footer={{
        phone: "+123 456 789 100",
        email: "hi@vGC@gmail.com",
        social: ["#", "#", "#", "#", "#"],
        copyright: "Copyright © 2025. All rights reserved."
      }} />
    </>
  );
}
