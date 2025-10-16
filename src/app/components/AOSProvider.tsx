"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import AOS from "aos";
import "aos/dist/aos.css";

export default function AOSProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Initialize AOS with optimized settings
    AOS.init({
      duration: 400, // Reduced from 600 for better performance
      once: true,
      easing: "ease-out",
      offset: 80, // Reduced offset to trigger animations sooner
      delay: 0, // Remove delay for better perceived performance
      disable: function() {
        // Disable AOS on low-end devices or when prefers-reduced-motion is enabled
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches || 
               window.innerWidth < 768; // Disable on mobile for better performance
      }
    });
  }, []);

  useEffect(() => {
    // Only refresh on route changes, not on every render
    const timeout = setTimeout(() => {
      AOS.refreshHard();
    }, 50);
    
    return () => clearTimeout(timeout);
  }, [pathname]);

  return children as React.ReactElement;
}