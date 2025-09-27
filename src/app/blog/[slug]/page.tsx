import Image from "next/image";
import blogSingleData from "../../../data/blog-single.json";
import type { BlogSinglePage } from "../../../types/pages";

export default function BlogSinglePage() {
  const data: BlogSinglePage = blogSingleData

  return (
    <>

      <div className="blog-txt">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-md-12">
              <Image
                className="w-100"
                src={data.post.image}
                alt="blog-detail-img"
                width={1920}
                height={400}
                loading="lazy"
              />
              <h1>{data.post.title}</h1>
              <h5>{data.post.date}</h5>

              {data.post.content.map((item, index) => (
                <div key={index}>
                  {item.type === "heading" ? (
                    <h6>{item.text}</h6>
                  ) : (
                    <p>{item.text}</p>
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
