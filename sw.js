// Service Worker for Image Caching with 72-hour expiration
const CACHE_NAME = 'image-cache-v1';
const EXPIRATION_TIME = 72 * 60 * 60 * 1000; // 72 hours in milliseconds

// Helper function to check if a request is for an image
function isImageRequest(request) {
  const url = new URL(request.url);
  const pathname = url.pathname.toLowerCase();
  
  // Check file extension
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.ico'];
  const hasImageExtension = imageExtensions.some(ext => pathname.endsWith(ext));
  
  // Check Content-Type header if available
  const contentType = request.headers.get('content-type') || '';
  const isImageContentType = contentType.startsWith('image/');
  
  return hasImageExtension || isImageContentType;
}

// Helper function to get expiration timestamp
function getExpirationTimestamp() {
  return Date.now() + EXPIRATION_TIME;
}

// Helper function to check if cache entry is expired
function isExpired(timestamp) {
  return Date.now() > timestamp;
}

// Install event - prepare cache
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  self.skipWaiting(); // Activate immediately
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim(); // Take control of all pages immediately
});

// Fetch event - intercept image requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Only handle GET requests for images
  if (request.method !== 'GET' || !isImageRequest(request)) {
    return; // Let browser handle non-image requests normally
  }

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(request).then((cachedResponse) => {
        // Check if we have a cached response
        if (cachedResponse) {
          // Get the expiration timestamp from the response headers
          const expirationHeader = cachedResponse.headers.get('sw-cache-expires');
          
          if (expirationHeader) {
            const expirationTime = parseInt(expirationHeader, 10);
            
            // Check if cache is expired
            if (isExpired(expirationTime)) {
              console.log('[Service Worker] Cache expired for:', request.url);
              // Delete expired entry and fetch fresh
              cache.delete(request);
              return fetchAndCache(request, cache);
            } else {
              console.log('[Service Worker] Serving from cache:', request.url);
              return cachedResponse;
            }
          } else {
            // Old cache entry without expiration, treat as expired
            cache.delete(request);
            return fetchAndCache(request, cache);
          }
        } else {
          // No cache entry, fetch and cache
          console.log('[Service Worker] Caching new image:', request.url);
          return fetchAndCache(request, cache);
        }
      });
    })
  );
});

// Helper function to fetch and cache with expiration
async function fetchAndCache(request, cache) {
  try {
    const response = await fetch(request);
    
    // Only cache successful responses
    if (response.status === 200) {
      // Clone the response to modify headers
      const responseToCache = response.clone();
      
      // Create a new Response with expiration header
      const expirationTimestamp = getExpirationTimestamp();
      const headers = new Headers(responseToCache.headers);
      headers.set('sw-cache-expires', expirationTimestamp.toString());
      
      const modifiedResponse = new Response(responseToCache.body, {
        status: responseToCache.status,
        statusText: responseToCache.statusText,
        headers: headers
      });
      
      // Store in cache
      await cache.put(request, modifiedResponse);
      
      console.log('[Service Worker] Image cached with expiration:', new Date(expirationTimestamp).toLocaleString());
      
      return response;
    } else {
      // Don't cache failed responses
      return response;
    }
  } catch (error) {
    console.error('[Service Worker] Fetch failed:', error);
    // Return a fallback or let browser handle the error
    throw error;
  }
}

// Periodic cleanup of expired entries (runs when service worker wakes up)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEANUP_CACHE') {
    event.waitUntil(cleanupExpiredCache());
  }
});

// Cleanup function to remove expired cache entries
async function cleanupExpiredCache() {
  const cache = await caches.open(CACHE_NAME);
  const requests = await cache.keys();
  let cleanedCount = 0;
  
  for (const request of requests) {
    const response = await cache.match(request);
    if (response) {
      const expirationHeader = response.headers.get('sw-cache-expires');
      if (expirationHeader) {
        const expirationTime = parseInt(expirationHeader, 10);
        if (isExpired(expirationTime)) {
          await cache.delete(request);
          cleanedCount++;
        }
      }
    }
  }
  
  console.log(`[Service Worker] Cleaned up ${cleanedCount} expired cache entries`);
}
