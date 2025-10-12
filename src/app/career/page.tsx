"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { API_URL, fetchWithTimeout, ensureUrl, stripHtml } from "../../lib/api";
import type { CareerApiResponse, CareerHeaderBlock, CareerSectionBlock, CareerSection, CareerJob } from "../../types/pages";
import type { Metadata } from "next";

// Add static metadata
export const metadata: Metadata = {
  title: "Career Opportunities | VGC Consulting",
  description: "Join VGC Consulting and be part of a team dedicated to empowering businesses with expert financial and tax solutions.",
  keywords: "career opportunities, job openings, work with us, employment, VGC team",
};

// Helper function to parse HTML list items
function parseHtmlList(html: string): string[] {
  const items: string[] = [];
  const regex = /<li[^>]*>\s*<p[^>]*>([^<]+)<\/p>\s*<\/li>/g;
  let match;
  
  while ((match = regex.exec(html)) !== null) {
    items.push(match[1].trim());
  }
  
  return items;
}

// Helper function to parse job responsibilities and ideal for sections
function parseJobDescription(longDescription: string) {
  const responsibilities: string[] = [];
  const idealFor: string[] = [];
  
  // Split by h5 tags to get sections
  const sections = longDescription.split(/<h5[^>]*>([^<]+)<\/h5>/);
  
  for (let i = 1; i < sections.length; i += 2) {
    const title = sections[i].trim();
    const content = sections[i + 1] || '';
    
    const items = parseHtmlList(content);
    
    if (title.toLowerCase().includes('responsibilities')) {
      responsibilities.push(...items);
    } else if (title.toLowerCase().includes('ideal')) {
      idealFor.push(...items);
    }
  }
  
  return { responsibilities, idealFor };
}

export default function CareerPage() {
  const [careerData, setCareerData] = useState<CareerApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
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

  useEffect(() => {
    const fetchCareerData = async () => {
      try {
        setLoading(true);
        // Fetch all pages from API
        const response = await fetchWithTimeout(API_URL, { cache: 'no-store' });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch pages data: ${response.status}`);
        }
        
        const apiResponse = await response.json();
        const pages = Array.isArray(apiResponse?.data) ? apiResponse.data : [];
        
        // Find the career page from all pages
        const careerPage = pages.find((page: any) => 
          page.type === 'career' || page.slug === 'career'
        );
        
        if (!careerPage) {
          throw new Error('Career page not found in API response');
        }
        
        setCareerData(careerPage);
      } catch (err) {
        console.error('Error fetching career data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load career data');
      } finally {
        setLoading(false);
      }
    };

    fetchCareerData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    
    try {
      // Prepare the data to match API expected format
      const submitData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        position: formData.position,
        linkedin_url: formData.linkedin,
        degree: formData.degree,
        personal_note: formData.personalNote
      };

      const response = await fetch("https://vgc.psofttechnologies.in/api/v1/resume-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        throw new Error(`Failed to submit form: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Form submitted successfully:", result);
      setSubmitSuccess(true);
      
      // Reset form after successful submission
      setFormData({
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
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (err) {
      console.error("Error submitting form:", err);
      setSubmitError(err instanceof Error ? err.message : "Failed to submit form. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '50px 0' }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  if (error || !careerData) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '50px 0' }}>
        <h2>Error: {error || 'Failed to load career data'}</h2>
      </div>
    );
  }

  // Extract data from API response
  const headerBlock = careerData.blocks.find(block => block.type === 'career_header') as CareerHeaderBlock;
  const sectionBlock = careerData.blocks.find(block => block.type === 'career_section') as CareerSectionBlock;
  
  if (!headerBlock || !sectionBlock) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '50px 0' }}>
        <h2>Error: Invalid career data structure</h2>
      </div>
    );
  }

  const headerData = headerBlock.data;
  const sectionData = sectionBlock.data;

  return (
    <>     
      <div className="business-banner dd">
        <div className="container-fluid">
          <div className="row">
            <div className="col-xl-5 col-lg-6 col-md-12 offset-xl-1" 
                 data-aos="fade-right" 
                 data-aos-duration="1200">
              <nav>
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="/">Home</a>
                  </li>
                  <li className="breadcrumb-item active">
                    Career
                  </li>
                </ol>
              </nav>
              <h1>{headerData.left_title}</h1>
              <p>{headerData.left_description}</p>
            </div>
            
            <div className="col-xl-6 col-lg-6 col-md-12">
              <Image 
                className="w-100" 
                src={ensureUrl(headerData.right_image_main)} 
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
                <h3>Ready to make an impact?</h3>
                <h2>Join Our Team</h2>
                {submitSuccess && (
                  <div className="alert alert-success">
                    Thank you for your application! We'll get back to you soon.
                  </div>
                )}
                {submitError && (
                  <div className="alert alert-danger">
                    {submitError}
                  </div>
                )}
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
                          {sectionData.jobs && sectionData.jobs.map((job) => (
                            <option key={job.id} value={job.slug}>{job.roles || job.title}</option>
                          ))}
                          <option value="other">Other</option>
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
                  <input 
                    type="submit" 
                    className="call-btn" 
                    value={submitting ? "Submitting..." : "Submit →"} 
                    disabled={submitting}
                  />
                </form>
              </div>
            </div>
            
            <div className="col-xl-12 col-lg-12 col-md-12">
              <Image className="filter-img" src="/images/filter.png" alt="filter" width={1200} height={200} />
            </div>
            
            <div className="col-xl-6 col-lg-6 col-md-12">
              {sectionData.left_section.map((section, index) => (
                <div key={index} className="career-box">
                  <h3>{section.title}</h3>
                  <div dangerouslySetInnerHTML={{ __html: section.description }} />
                </div>
              ))}
            </div>
            
            <div className="col-xl-6 col-lg-6 col-md-12">
              {/* Show job openings if available */}
              {sectionData.jobs && sectionData.jobs.length > 0 && (
                <div className="career-box">
                  <h3>Current Openings</h3>
                  {sectionData.jobs.map((job, index) => {
                    const parsedJob = parseJobDescription(job.long_description);
                    return (
                      <div key={job.id}>
                        <h4>
                          {job.title} 
                          <a className="call-btn" href={`#job-${job.id}`}>Learn More</a>
                        </h4>
                        {parsedJob.responsibilities.length > 0 && (
                          <>
                            <h5>Responsibilities:</h5>
                            <ul>
                              {parsedJob.responsibilities.map((resp, respIndex) => (
                                <li key={respIndex}>{resp}</li>
                              ))}
                            </ul>
                          </>
                        )}
                        {parsedJob.idealFor.length > 0 && (
                          <>
                            <h5>Ideal For:</h5>
                            <ul>
                              {parsedJob.idealFor.map((ideal, idealIndex) => (
                                <li key={idealIndex}>{ideal}</li>
                              ))}
                            </ul>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              
              {sectionData.right_section.map((section, index) => (
                <div key={index} className="career-box">
                  <h3>{section.title}</h3>
                  <div dangerouslySetInnerHTML={{ __html: section.description }} />
                </div>
              ))}
                
              <div className="career-box">
                <h6>{sectionData.main_text}</h6>
                <div className="btn-sec">
                  {sectionData.left_button_text && (
                    <a className="call-btn" href={sectionData.left_button_url}>
                      {sectionData.left_button_text}
                    </a>
                  )}
                  {sectionData.right_button_text && (
                    <a className="up-btn" href={sectionData.right_button_url}>
                      {sectionData.right_button_text}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
