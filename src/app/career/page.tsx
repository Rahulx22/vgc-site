"use client";

import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Image from "next/image";
import careerData from "../../data/career.json";
import type { CareerPage } from "../../types/pages";

export default function CareerPage() {
  const data: CareerPage = careerData;
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    position: "",
    linkedin: "",
    degree: "",
    personalNote: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <Header />
      
      <div className="business-banner dd">
        <div className="container-fluid">
          <div className="row">
            <div className="col-xl-5 col-lg-6 col-md-12 offset-xl-1" 
                 data-aos="fade-right" 
                 data-aos-duration="1200">
              <nav>
                <ol className="breadcrumb">
                  {data.banner.breadcrumb.map((item, index) => (
                    <li key={index} className={`breadcrumb-item ${index === data.banner.breadcrumb.length - 1 ? 'active' : ''}`}>
                      {index === data.banner.breadcrumb.length - 1 ? (
                        item.label
                      ) : (
                        <a href={item.href}>{item.label}</a>
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
              <h1>{data.banner.title}</h1>
              <p>{data.banner.description}</p>
            </div>
            
            <div className="col-xl-6 col-lg-6 col-md-12">
              <Image 
                className="w-100" 
                src={data.banner.image} 
                alt="career-banner" 
                width={800} 
                height={600} 
                loading="lazy" 
              />
            </div>
          </div>
        </div>
      </div>

      <div className="contact-sec dd">
        <div className="container">
          <div className="row">
            <div className="col-xl-10 col-lg-12 col-md-12 offset-xl-1">
              <div className="cont-form">
                <h3>{data.applicationForm.title}</h3>
                <h2>{data.applicationForm.subtitle}</h2>
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-lg-3 col-md-4">
                      <div className="in-box">
                        <label>First Name</label>
                        <input 
                          className="box" 
                          type="text" 
                          name="firstName"
                          placeholder="First Name"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-4">
                      <div className="in-box">
                        <label>Last Name</label>
                        <input 
                          className="box" 
                          type="text" 
                          name="lastName"
                          placeholder="Last Name"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-4">
                      <div className="in-box">
                        <label>Email</label>
                        <input 
                          className="box" 
                          type="email" 
                          name="email"
                          placeholder="Email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-4">
                      <div className="in-box">
                        <label>Phone</label>
                        <input 
                          className="box" 
                          type="tel" 
                          name="phone"
                          placeholder="Phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-4">
                      <div className="in-box">
                        <label>City</label>
                        <input 
                          className="box" 
                          type="text" 
                          name="city"
                          placeholder="City"
                          value={formData.city}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-4">
                      <div className="in-box">
                        <label>Position</label>
                        <select className="box" name="position" value={formData.position} onChange={handleChange} required>
                          <option value="">Position</option>
                          <option value="senior-accountant">Senior Accountant</option>
                          <option value="account-manager">Account Manager</option>
                          <option value="junior-accountant">Junior Accountant</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-4">
                      <div className="in-box">
                        <label>Linkedin Profile URL</label>
                        <input 
                          className="box" 
                          type="url" 
                          name="linkedin"
                          placeholder="rahul-goyal-87a69a1aa/"
                          value={formData.linkedin}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-4">
                      <div className="in-box">
                        <label>Bachelor&apos;s Degree</label>
                        <select className="box" name="degree" value={formData.degree} onChange={handleChange}>
                          <option value="">Bachelor&apos;s Degree</option>
                          <option value="commerce">Commerce</option>
                          <option value="accounting">Accounting</option>
                          <option value="finance">Finance</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="in-box">
                    <label>Personal Note</label>
                    <textarea 
                      className="box" 
                      name="personalNote"
                      placeholder="Personal Note" 
                      rows={5}
                      value={formData.personalNote}
                      onChange={handleChange}
                    />
                  </div>
                  <input type="submit" className="call-btn" value="Submit →" />
                </form>
              </div>
            </div>
            
            <div className="col-xl-12 col-lg-12 col-md-12">
              <Image className="filter-img" src="/images/filter.png" alt="filter" width={1200} height={200} />
            </div>
            
            <div className="col-xl-6 col-lg-6 col-md-12">
              <div className="career-box">
                <h3>{data.whyWorkWithUs.title}</h3>
                <ul>
                  {data.whyWorkWithUs.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              
              <div className="career-box">
                <h3>{data.whatWeOffer.title}</h3>
                <ul>
                  {data.whatWeOffer.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              
              <div className="career-box">
                <h3>{data.culture.title}</h3>
                <ul>
                  {data.culture.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              
              <div className="career-box">
                <h3>{data.notForYou.title}</h3>
                <ul>
                  {data.notForYou.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              
              <div className="career-box">
                <h3>{data.nonNegotiables.title}</h3>
                <ul>
                  {data.nonNegotiables.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              
              <div className="career-box">
                <h3>{data.lifeAtVGC.title}</h3>
                <ul>
                  {data.lifeAtVGC.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="col-xl-6 col-lg-6 col-md-12">
              <div className="career-box">
                <h3>{data.currentOpenings.title}</h3>
                {data.currentOpenings.positions.map((position, index) => (
                  <div key={index}>
                    <h4>
                      {index + 1}. {position.title} 
                      <a className="call-btn" href="#">Learn More</a>
                    </h4>
                    <h5>Responsibilities:</h5>
                    <ul>
                      {position.responsibilities.map((resp, respIndex) => (
                        <li key={respIndex}>{resp}</li>
                      ))}
                    </ul>
                    {position.idealFor && (
                      <>
                        <h5>Ideal For:</h5>
                        <ul>
                          {position.idealFor.map((ideal, idealIndex) => (
                            <li key={idealIndex}>{ideal}</li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="career-box">
                <h3>{data.hiringProcess.title}</h3>
                <ul>
                  {data.hiringProcess.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ul>
                
                <h3>{data.benefits.title}</h3>
                <ul>
                  {data.benefits.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
                
                <h6>{data.cta.title}</h6>
                <div className="btn-sec">
                  {data.cta.buttons.map((button, index) => (
                    <a key={index} className={button.type === 'primary' ? 'call-btn' : 'up-btn'} href={button.link}>
                      {button.text}
                    </a>
                  ))}
                </div>
              </div>
            </div>
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
