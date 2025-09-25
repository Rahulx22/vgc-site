"use client";

import { useState } from "react";
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

// AOS globally initialized in AOSProvider


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

      <div
        className="service-banner"
        style={{
          backgroundImage: `url(${serviceData.banner.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
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

              <div className="row">
                {serviceData.services.items.map((svc, idx) => (
                  <div key={idx} className="col-lg-6 col-md-6">
                    <article className="serv-box" data-aos="zoom-in" data-aos-duration="1200">
                      <strong>
                        <Image src="/images/check.svg" alt="check" width={20} height={20} />
                      </strong>

                      <h3>{svc.title}</h3>

                      {svc.description.map((d, di) => (
                        <p key={di}>{d}</p>
                      ))}

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

      

    </>
  );
}
