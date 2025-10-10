"use client";

import { useState } from "react";

interface ContactFormProps {
  title: string;
}

type ContactFormData = {
  name: string;
  email: string;
  message: string;
};

export default function ContactForm({ title }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    message: ""
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    
    try {
      // Prepare the data to match API expected format
      const submitData = {
        name: formData.name,
        email: formData.email,
        message: formData.message
      };

      const response = await fetch("https://vgc.psofttechnologies.in/api/v1/contact-form", {
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
        name: "",
        email: "",
        message: ""
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="cont-form">
      <h2>{title}</h2>
      {submitSuccess && (
        <div className="alert alert-success">
          Thank you for your message! We'll get back to you soon.
        </div>
      )}
      {submitError && (
        <div className="alert alert-danger">
          {submitError}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="in-box">
          <label>Your Name</label>
          <input 
            className="box" 
            type="text" 
            name="name"
            placeholder="Write your name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="in-box">
          <label>Your Email</label>
          <input 
            className="box" 
            type="email" 
            name="email"
            placeholder="Sample@gmail.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="in-box">
          <label>Message</label>
          <textarea 
            className="box" 
            name="message"
            placeholder="Write here..........." 
            rows={7}
            value={formData.message}
            onChange={handleChange}
            required
          />
        </div>
        <input 
          type="submit" 
          className="call-btn" 
          value={submitting ? "Sending..." : "Send"} 
          disabled={submitting}
        />
      </form>
    </div>
  );
}