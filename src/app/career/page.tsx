"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { API_URL, fetchWithTimeout, ensureUrl, stripHtml } from "../../lib/api";
import type { CareerApiResponse, CareerHeaderBlock, CareerSectionBlock, CareerSection, CareerJob } from "../../types/pages";
import type { Metadata } from "next";

// Add static metadata
// Note: Metadata cannot be exported from client components
// Move to a separate metadata file or remove "use client" directive if metadata is needed

// Helper function to decode HTML entities
function decodeHtmlEntities(text: string): string {
  const textArea = document.createElement('textarea');
  textArea.innerHTML = text;
  return textArea.value;
}

// Helper function to parse HTML list items
function parseHtmlList(html: string): string[] {
  const items: string[] = [];
  
  // Try multiple parsing approaches
  if (!html) return items;
  
  // Approach 1: Look for <li> tags with <p> inside
  const regex1 = /<li[^>]*>\s*<p[^>]*>([^<]+)<\/p>\s*<\/li>/g;
  let match1;
  while ((match1 = regex1.exec(html)) !== null) {
    items.push(decodeHtmlEntities(match1[1].trim()));
  }
  
  // If no items found, try <li> tags with direct text content
  if (items.length === 0) {
    const regex2 = /<li[^>]*>(?:\s*<[^>]*>)*([^<]+)(?:<[^>]*>\s*)*<\/li>/g;
    let match2;
    while ((match2 = regex2.exec(html)) !== null) {
      const cleanText = match2[1].trim();
      if (cleanText && !cleanText.startsWith('<')) {
        items.push(decodeHtmlEntities(cleanText));
      }
    }
  }
  
  // If still no items, try a simpler approach
  if (items.length === 0) {
    const regex3 = /<li[^>]*>(.*?)<\/li>/g;
    let match3;
    while ((match3 = regex3.exec(html)) !== null) {
      // Remove any remaining HTML tags from the content
      const cleanText = match3[1].replace(/<[^>]*>/g, '').trim();
      if (cleanText) {
        items.push(decodeHtmlEntities(cleanText));
      }
    }
  }
  
  return items;
}

// Helper function to parse job responsibilities and ideal for sections
function parseJobDescription(longDescription: string) {
  const responsibilities: string[] = [];
  const idealFor: string[] = [];
  
  // Debug: Log the raw long description
  console.log('Raw long description:', longDescription);
  
  // Split by h5 tags to get sections
  const sections = longDescription.split(/<h5[^>]*>([^<]+)<\/h5>/);
  
  // Debug: Log the sections
  console.log('Sections:', sections);
  
  for (let i = 1; i < sections.length; i += 2) {
    const title = sections[i].trim();
    const content = sections[i + 1] || '';
    
    // Debug: Log each section
    console.log('Section title:', title);
    console.log('Section content:', content);
    
    const items = parseHtmlList(content);
    
    // Debug: Log parsed items
    console.log('Parsed items:', items);
    
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
  const [resume, setResume] = useState<File | null>(null);
  const [resumePreview, setResumePreview] = useState<string | null>(null);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setResume(file);
      
      // Create preview for image files
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setResumePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setResumePreview(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    
    try {
      // Prepare the data to match API expected format
      const submitData = new FormData();
      submitData.append('first_name', formData.firstName);
      submitData.append('last_name', formData.lastName);
      submitData.append('email', formData.email);
      submitData.append('phone', formData.phone);
      submitData.append('city', formData.city);
      submitData.append('position', formData.position);
      submitData.append('linkedin_url', formData.linkedin);
      submitData.append('degree', formData.degree);
      submitData.append('personal_note', formData.personalNote);
      
      // Add resume file if selected
      if (resume) {
        submitData.append('resume', resume);
      }

      const response = await fetch("https://vgc.psofttechnologies.in/api/v1/resume-form", {
        method: "POST",
        body: submitData,
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
      setResume(null);
      setResumePreview(null);
      
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
                          <option value="">Select Position</option>
                          {sectionData.jobs && sectionData.jobs.map((job) => (
                            <option key={job.id} value={job.title}>{job.title}</option>
                          ))}
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-4">
                      <div className="in-box">
                        <label>LinkedIn Profile URL</label>
                        <input 
                          className="box" 
                          type="url" 
                          name="linkedin"
                          placeholder="https://linkedin.com/in/username"
                          value={formData.linkedin}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-4">
                      <div className="in-box">
                        <label>Bachelor&apos;s Degree</label>
                        <select className="box" name="degree" value={formData.degree} onChange={handleChange}>
                          <option value="">Select Degree</option>
                          <option value="commerce">Commerce</option>
                          <option value="accounting">Accounting</option>
                          <option value="finance">Finance</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-12">
                      <div className="in-box">
                        <label>Upload Resume</label>
                        <input 
                          className="box" 
                          type="file" 
                          name="resume"
                          accept=".pdf,.doc,.docx,.txt,.rtf,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
                          onChange={handleFileChange}
                        />
                        {resumePreview && (
                          <div className="mt-2">
                            <small>Selected file: {resume?.name}</small>
                            {resume?.type.startsWith('image/') && (
                              <img src={resumePreview} alt="Resume preview" style={{ maxWidth: '200px', maxHeight: '200px' }} />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="in-box">
                    <label>Personal Note</label>
                    <textarea 
                      className="box" 
                      name="personalNote"
                      placeholder="Tell us why you're interested in joining our team..." 
                      rows={5}
                      value={formData.personalNote}
                      onChange={handleChange}
                    />
                  </div>
                  <input 
                    type="submit" 
                    className="call-btn" 
                    value={submitting ? "Submitting..." : "Submit Application →"} 
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
                  {/* Filter jobs to show only active ones and sort them */}
                  {sectionData.jobs
                    .filter(job => job.status === 'active' || job.status === 'Active' || job.status === 'ACTIVE')
                    .sort((a, b) => {
                      // Define custom order - more specific matching
                      const getOrder = (title: string) => {
                        const lowerTitle = title.toLowerCase();
                        if (lowerTitle.includes('senior consultant')) return 0;
                        if (lowerTitle.includes('developer') && !lowerTitle.includes('senior consultant')) return 1;
                        return 2; // All other jobs
                      };
                      
                      return getOrder(a.title) - getOrder(b.title);
                    })
                    .map((job, index) => {
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
                              <ul className="with-bullets">
                                {parsedJob.responsibilities.map((resp, respIndex) => (
                                  <li key={respIndex} dangerouslySetInnerHTML={{ __html: resp }}></li>
                                ))}
                              </ul>
                            </>
                          )}
                          {parsedJob.idealFor.length > 0 && (
                            <>
                              <h5>Ideal For:</h5>
                              <ul className="with-bullets">
                                {parsedJob.idealFor.map((ideal, idealIndex) => (
                                  <li key={idealIndex} dangerouslySetInnerHTML={{ __html: ideal }}></li>
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
