"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import serviceData from "../../data/service.json";

export default function ServicePage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service: "",
    message: ""
  });

  useEffect(() => {
    // AOS init (client-only)
    (async () => {
      const mod = await import("aos");
      await import("aos/dist/aos.css");
      mod.default.init({ once: true, duration: 900 });
    })();
  }, []);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("form", formData);
  };

  return (
    <>
      <Header />

      <div className="service-banner">
        <div className="container">
          <div className="row">
            <div
              className="col-xl-6 col-lg-9 col-md-12"
              data-aos="fade-right"
              data-aos-duration="1200"
            >
              <h1>{serviceData.banner.title}</h1>
              <p>{serviceData.banner.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="service-form">
        <div className="container">
          <div className="row align-items-start">
            <div className="col-xl-6 col-lg-6 col-md-12">
              <div className="serv-form" data-aos="fade-up" data-aos-duration="1200">
                <div className="serv-head">
                  <h3>{serviceData.form.title}</h3>
                  <p>{serviceData.form.description}</p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="in-box">
                    <input
                      className="box"
                      name="name"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="in-box">
                    <input
                      className="box"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="in-box">
                    <select
                      className="box"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Service</option>
                      {serviceData.services.items.map((s, i) => (
                        <option key={i} value={s.title}>
                          {s.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="in-box">
                    <textarea
                      className="box"
                      name="message"
                      rows={4}
                      placeholder="Message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <input type="submit" className="call-btn" value="Request a Consultation" />
                </form>
              </div>
            </div>

            <div className="col-xl-5 col-lg-6 col-md-12 offset-xl-1">
              <h2>{serviceData.founderNote.title}</h2>
              <p>{serviceData.founderNote.description}</p>
              <div style={{ margin: "14px 0" }}>
                <Image src={serviceData.founderNote.signature} alt="sign" width={100} height={30} />
              </div>
              <p>{serviceData.founderNote.name}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="service-sec dd">
        <div className="container">
          <div className="row">
            <div className="col-xl-10 col-lg-12 col-md-12 offset-xl-1">
              <h5>{serviceData.services.title}</h5>

              <div className="row services-grid">
                {serviceData.services.items.map((svc, idx) => (
                  <div key={idx} className="col-lg-6 col-md-6">
                    <article className="serv-box" data-aos="zoom-in" data-aos-duration="1200">
                      <strong className="check-wrap">
                        <Image src="/images/check.svg" alt="check" width={20} height={20} />
                      </strong>

                      <h3>{svc.title}</h3>

                      <div className="serv-desc">
                        {svc.description.map((d, di) => (
                          <p key={di}>{d}</p>
                        ))}
                      </div>

                      <Link href={svc.link} className="read-btn">
                        Learn More
                      </Link>
                    </article>
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

      {/* small page-scoped css for exact grid spacing */}
      <style jsx>{`
  .services-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(8, auto);
    gap: 32px; /* gap thoda zyada */
    margin-top: 40px;
  }

  .serv-box {
    background: #f6f6f6;
    border: 1px solid #e8e8e9;
    border-radius: 10px;
    padding: 32px;          /* pehle 24px tha, ab bada */
    min-height: 240px;      /* pehle 190px tha */
    margin-bottom: 24px;
    box-shadow: 0 8px 20px rgba(3,11,27,0.06);
  }

  .serv-box h3 {
    font-size: 18px; /* thoda bada */
    margin: 12px 0 10px;
    color: #1f2b44;
    font-weight: 700;
  }

  .serv-box .serv-desc p {
    font-size: 14px; /* pehle 13px tha */
    color: #6b7280;
    margin: 8px 0;
    line-height: 1.4;
  }

  .read-btn {
    display: inline-block;
    margin-top: 16px;
    color: #1f2b44;
    text-decoration: underline;
    font-weight: 500;
  }

  .check-wrap {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: #eef6fb;
    border-radius: 50%;
    width: 100px;  /* pehle 36px tha */
    height: 42px;
    font-size: 18px;
  }

  @media (max-width: 991px) {
    .services-grid {
      grid-template-columns: 1fr;
      grid-template-rows: auto;
    }
    .serv-box {
      min-height: 200px;
      padding: 28px;
    }
  }
`}</style>

    </>
  );
}
