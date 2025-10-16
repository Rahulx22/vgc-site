// Cache configuration utilities for consistent 5-minute caching across the application

/**
 * Default cache options for API calls (5 minutes)
 */
export const DEFAULT_CACHE_OPTIONS = {
  cache: 'force-cache' as const,
  next: { 
    revalidate: 300 // 5 minutes in seconds
  }
};

/**
 * Cache options for static assets (1 year)
 */
export const STATIC_ASSET_CACHE_OPTIONS = {
  cache: 'force-cache' as const,
  next: { 
    revalidate: 31536000 // 1 year in seconds
  }
};

/**
 * Cache options for no cache
 */
export const NO_CACHE_OPTIONS = {
  cache: 'no-store' as const,
  next: { 
    revalidate: 0
  }
};

/**
 * Get cache options based on content type
 * @param contentType - Type of content (dynamic, static, never)
 * @returns Cache options object
 */
export function getCacheOptions(contentType: 'dynamic' | 'static' | 'never' = 'dynamic') {
  switch (contentType) {
    case 'static':
      return STATIC_ASSET_CACHE_OPTIONS;
    case 'never':
      return NO_CACHE_OPTIONS;
    case 'dynamic':
    default:
      return DEFAULT_CACHE_OPTIONS;
  }
}