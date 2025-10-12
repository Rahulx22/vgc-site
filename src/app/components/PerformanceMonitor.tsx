"use client";

import { useEffect } from "react";

export default function PerformanceMonitor() {
  useEffect(() => {
    // Only run in development or for specific users
    if (process.env.NODE_ENV === 'development' || 
        (typeof window !== 'undefined' && window.location.search.includes('performance=1'))) {
      
      // Log performance metrics
      const logPerformance = () => {
        if ('performance' in window) {
          const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          if (perfData) {
            console.log('Page Load Metrics:', {
              'DNS Lookup': `${Math.round(perfData.domainLookupEnd - perfData.domainLookupStart)}ms`,
              'TCP Connection': `${Math.round(perfData.connectEnd - perfData.connectStart)}ms`,
              'Request Time': `${Math.round(perfData.responseEnd - perfData.requestStart)}ms`,
              'Response Time': `${Math.round(perfData.responseStart - perfData.requestStart)}ms`,
              'DOM Loading': `${Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart)}ms`,
              'Window Load': `${Math.round(perfData.loadEventEnd - perfData.loadEventStart)}ms`,
              'Total Time': `${Math.round(perfData.loadEventEnd - perfData.fetchStart)}ms`
            });
          }
        }
      };

      // Log after page is fully loaded
      if (document.readyState === 'complete') {
        logPerformance();
      } else {
        window.addEventListener('load', logPerformance);
      }

      // Cleanup
      return () => {
        window.removeEventListener('load', logPerformance);
      };
    }
  }, []);

  return null; // This component doesn't render anything
}