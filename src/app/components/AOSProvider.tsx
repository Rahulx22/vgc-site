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
      duration: 600, // Reduced from 900
      once: true,
      easing: "ease-out",
      offset: 100, // Reduced offset to trigger animations sooner
      delay: 0, // Remove delay for better perceived performance
    });
  }, []);

  useEffect(() => {
    // Only refresh on route changes, not on every render
    const timeout = setTimeout(() => {
      AOS.refreshHard();
    }, 100);
    
    return () => clearTimeout(timeout);
  }, [pathname]);

  return children as React.ReactElement;
}