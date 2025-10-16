// Performance optimization utilities for loading images and text simultaneously

/**
 * Preload images to ensure they load before being displayed
 * @param imageUrls - Array of image URLs to preload
 * @returns Promise that resolves when all images are loaded or rejected on error
 */
export function preloadImages(imageUrls: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    if (imageUrls.length === 0) {
      resolve();
      return;
    }

    let loadedCount = 0;
    let errorCount = 0;
    const total = imageUrls.length;

    const onLoad = () => {
      loadedCount++;
      if (loadedCount + errorCount === total) {
        if (errorCount === total) {
          reject(new Error('All images failed to load'));
        } else {
          resolve();
        }
      }
    };

    const onError = () => {
      errorCount++;
      if (loadedCount + errorCount === total) {
        if (errorCount === total) {
          reject(new Error('All images failed to load'));
        } else {
          resolve();
        }
      }
    };

    imageUrls.forEach(url => {
      const img = new Image();
      img.onload = onLoad;
      img.onerror = onError;
      img.src = url;
    });
  });
}

/**
 * Check if all critical content (images and text) is loaded
 * @returns Promise that resolves when content is ready
 */
export function waitForContentLoad(): Promise<void> {
  return new Promise((resolve) => {
    // Wait for document to be ready
    if (document.readyState === 'complete') {
      // Add small delay to ensure rendering is complete
      setTimeout(resolve, 100);
    } else {
      window.addEventListener('load', () => {
        // Add small delay to ensure rendering is complete
        setTimeout(resolve, 100);
      });
    }
  });
}

/**
 * Optimize image loading by setting appropriate attributes
 * @param imgElement - The image element to optimize
 * @param priority - Whether this is a priority image
 */
export function optimizeImageLoading(imgElement: HTMLImageElement, priority: boolean = false): void {
  if (priority) {
    imgElement.loading = 'eager';
    imgElement.setAttribute('fetchpriority', 'high');
  } else {
    imgElement.loading = 'lazy';
  }
  
  // Set decoding to async for better performance
  imgElement.decoding = 'async';
}

/**
 * Preload critical fonts
 * @param fontUrls - Array of font URLs to preload
 */
export function preloadFonts(fontUrls: string[]): void {
  fontUrls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
    link.href = url;
    document.head.appendChild(link);
  });
}

/**
 * Track resource loading performance
 */
export function trackResourcePerformance(): void {
  if ('performance' in window) {
    // Log image loading performance
    setTimeout(() => {
      const images = performance.getEntriesByType('resource')
        .filter(entry => entry.name.includes('.jpg') || entry.name.includes('.png') || entry.name.includes('.webp') || entry.name.includes('.svg'));
      
      console.log('Image loading performance:', images.map(img => ({
        name: img.name,
        duration: img.duration,
        startTime: img.startTime
      })));
    }, 3000); // Wait for images to load
  }
}