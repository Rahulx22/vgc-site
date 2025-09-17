"use client";

import { useState } from "react";

interface ContactFormProps {
  title: string;
  onSubmit?: (data: FormData) => void;
}

export default function ContactForm({ title, onSubmit }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData as any);
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
        <input type="submit" className="call-btn" value="Send" />
      </form>
    </div>
  );
}
