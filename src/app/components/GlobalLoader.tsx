"use client";

import { useState, useEffect } from "react";
import { waitForContentLoad } from "../../lib/performance";
import "./GlobalLoader.css";

export default function GlobalLoader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait for all content to load
    waitForContentLoad()
      .then(() => {
        // Add small delay for better user experience
        setTimeout(() => {
          setLoading(false);
        }, 200);
      })
      .catch(() => {
        // In case of any errors, still hide loader after a delay
        setTimeout(() => {
          setLoading(false);
        }, 500);
      });

    // Fallback timeout to ensure loader doesn't stay forever
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  if (!loading) return null;

  return (
    <div className="global-loader">
      <div className="loader-content">
        <div className="spinner"></div>
        <p>Getting you to the best consulting firm</p>
      </div>
    </div>
  );
}