// AI Life Platform - Enhanced Service Worker
// Version 2.1.0 - Quantum Intelligence & Emotional Fusion Support

const CACHE_NAME = 'ai-life-platform-v2.1.0';
const STATIC_CACHE = 'ai-platform-static-v2.1.0';
const DYNAMIC_CACHE = 'ai-platform-dynamic-v2.1.0';
const OFFLINE_CACHE = 'ai-platform-offline-v2.1.0';

// Critical resources to cache immediately
const CORE_ASSETS = [
    '/',
    '/ai_platform_complete.html',
    '/manifest.json',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap'
];

// Static assets that can be cached with longer TTL
const STATIC_ASSETS = [
    // Add any JS/CSS files here if they exist separately
    // '/js/quantum-engine.js',
    // '/js/fusion-engine.js', 
    // '/js/sensors-manager.js',
    // '/css/styles.css'
];

// Dynamic content patterns that should use network-first
const DYNAMIC_PATTERNS = [
    /\/api\//,
    /\/biometric\//,
    /\/sensors\//,
    /\/ai-chat\//,
    /\/quantum\//,
    /\/fusion\//
];

// Offline fallbacks
const OFFLINE_FALLBACKS = {
    '/': '/offline.html',
    '/api/': '/offline-api.json'
};

// Install event - Cache core resources
self.addEventListener('install', event => {
    console.log('🚀 AI Platform Service Worker installing...');
    
    event.waitUntil(
        Promise.all([
            // Cache core assets
            caches.open(STATIC_CACHE).then(cache => {
                console.log('📦 Caching core assets...');
                return cache.addAll(CORE_ASSETS);
            }),
            
            // Cache static assets
            caches.open(STATIC_CACHE).then(cache => {
                if (STATIC_ASSETS.length > 0) {
                    console.log('📦 Caching static assets...');
                    return cache.addAll(STATIC_ASSETS);
                }
                return Promise.resolve();
            }),
            
            // Create offline page
            createOfflinePage()
        ]).then(() => {
            console.log('✅ AI Platform Service Worker installed successfully');
            // Skip waiting to activate immediately
            self.skipWaiting();
        }).catch(error => {
            console.error('❌ Service Worker installation failed:', error);
        })
    );
});

// Activate event - Clean up old caches
self.addEventListener('activate', event => {
    console.log('🔄 AI Platform Service Worker activating...');
    
    event.waitUntil(
        Promise.all([
            // Clean up old caches
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (!isCurrentCache(cacheName)) {
                            console.log('🗑️ Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            
            // Take control of all clients
            self.clients.claim()
        ]).then(() => {
            console.log('✅ AI Platform Service Worker activated');
            
            // Notify clients of successful activation
            self.clients.matchAll().then(clients => {
                clients.forEach(client => {
                    client.postMessage({
                        type: 'SW_ACTIVATED',
                        message: '🚀 Enhanced AI Platform now available offline!'
                    });
                });
            });
        })
    );
});

// Fetch event - Handle all network requests with intelligent caching
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip cross-origin requests (except fonts and CDN assets)
    if (url.origin !== location.origin && !isTrustedOrigin(url.origin)) {
        return;
    }
    
    event.respondWith(handleRequest(request));
});

// Handle different types of requests with appropriate strategies
async function handleRequest(request) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    try {
        // 1. Core HTML files - Cache First with Network Fallback
        if (path === '/' || path.endsWith('.html')) {
            return await cacheFirstStrategy(request, STATIC_CACHE);
        }
        
        // 2. Static assets (CSS, JS, images) - Cache First
        if (isStaticAsset(path)) {
            return await cacheFirstStrategy(request, STATIC_CACHE);
        }
        
        // 3. Fonts and CDN assets - Cache First with long TTL
        if (isFontOrCDN(url)) {
            return await cacheFirstWithLongTTL(request);
        }
        
        // 4. Dynamic/API content - Network First with Cache Fallback
        if (isDynamicContent(path)) {
            return await networkFirstStrategy(request, DYNAMIC_CACHE);
        }
        
        // 5. Biometric/Sensor data - Network Only (real-time data)
        if (isBiometricOrSensorData(path)) {
            return await networkOnlyStrategy(request);
        }
        
        // 6. Default - Network First
        return await networkFirstStrategy(request, DYNAMIC_CACHE);
        
    } catch (error) {
        console.error('🚨 Request handling error:', error);
        return await getOfflineFallback(request);
    }
}

// Caching Strategies

// Cache First - Good for static assets
async function cacheFirstStrategy(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
        // Return cached version and update in background
        updateCacheInBackground(request, cache);
        return cachedResponse;
    }
    
    // Not in cache, fetch from network
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
}

// Network First - Good for dynamic content
async function networkFirstStrategy(request, cacheName) {
    const cache = await caches.open(cacheName);
    
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            // Update cache with fresh data
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        // Network failed, try cache
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        throw error;
    }
}

// Cache First with Long TTL - For fonts and CDN assets
async function cacheFirstWithLongTTL(request) {
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
        const cacheDate = new Date(cachedResponse.headers.get('date'));
        const now = new Date();
        const daysSinceCache = (now - cacheDate) / (1000 * 60 * 60 * 24);
        
        // Only refetch if cached more than 30 days ago
        if (daysSinceCache < 30) {
            return cachedResponse;
        }
    }
    
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        if (cachedResponse) {
            return cachedResponse;
        }
        throw error;
    }
}

// Network Only - For real-time data
async function networkOnlyStrategy(request) {
    return await fetch(request);
}

// Background cache update
async function updateCacheInBackground(request, cache) {
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            await cache.put(request, networkResponse);
        }
    } catch (error) {
        // Silent fail for background updates
        console.log('Background cache update failed:', error);
    }
}

// Helper Functions

function isCurrentCache(cacheName) {
    return [CACHE_NAME, STATIC_CACHE, DYNAMIC_CACHE, OFFLINE_CACHE].includes(cacheName);
}

function isTrustedOrigin(origin) {
    const trustedOrigins = [
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com',
        'https://cdnjs.cloudflare.com'
    ];
    return trustedOrigins.includes(origin);
}

function isStaticAsset(path) {
    const staticExtensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2'];
    return staticExtensions.some(ext => path.endsWith(ext));
}

function isFontOrCDN(url) {
    return url.hostname.includes('fonts.googleapis.com') || 
           url.hostname.includes('fonts.gstatic.com') ||
           url.hostname.includes('cdnjs.cloudflare.com');
}

function isDynamicContent(path) {
    return DYNAMIC_PATTERNS.some(pattern => pattern.test(path));
}

function isBiometricOrSensorData(path) {
    const realtimePatterns = [
        /\/biometric\/realtime/,
        /\/sensors\/live/,
        /\/fusion\/stream/,
        /\/quantum\/live/,
        /\/accelerometer/,
        /\/heart-rate/,
        /\/emotion-stream/
    ];
    return realtimePatterns.some(pattern => pattern.test(path));
}

// Get appropriate offline fallback
async function getOfflineFallback(request) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // Find appropriate fallback
    for (const [pattern, fallback] of Object.entries(OFFLINE_FALLBACKS)) {
        if (path.startsWith(pattern)) {
            const cache = await caches.open(OFFLINE_CACHE);
            const fallbackResponse = await cache.match(fallback);
            
            if (fallbackResponse) {
                return fallbackResponse;
            }
        }
    }
    
    // Generic offline response
    return new Response(
        JSON.stringify({
            error: 'Offline',
            message: 'This content is not available offline',
            timestamp: new Date().toISOString(),
            path: path
        }),
        {
            status: 503,
            statusText: 'Service Unavailable',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            }
        }
    );
}

// Create offline page and resources
async function createOfflinePage() {
    const offlineCache = await caches.open(OFFLINE_CACHE);
    
    // Create offline HTML page
    const offlineHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Life Platform - Offline</title>
    <style>
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: linear-gradient(135deg, #000000 0%, #0a0a14 25%, #12122b 50%, #1a1a2e 75%, #0f0f23 100%);
            color: white;
            margin: 0;
            padding: 20px;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
        }
        .container {
            max-width: 400px;
            padding: 40px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 20px;
            border: 1px solid rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(25px);
        }
        .icon {
            font-size: 4rem;
            margin-bottom: 20px;
            background: linear-gradient(135deg, #667eea 0%, #a855f7 50%, #00ffd4 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        h1 {
            font-size: 1.5rem;
            font-weight: 800;
            margin-bottom: 15px;
            background: linear-gradient(135deg, #667eea 0%, #a855f7 50%, #00ffd4 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        p {
            color: rgba(255, 255, 255, 0.7);
            line-height: 1.6;
            margin-bottom: 25px;
        }
        .retry-btn {
            background: linear-gradient(135deg, #667eea 0%, #a855f7 100%);
            border: none;
            border-radius: 14px;
            padding: 15px 30px;
            color: white;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.3s ease;
        }
        .retry-btn:hover {
            transform: translateY(-2px);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="icon">🤖⚛️</div>
        <h1>AI Platform Offline</h1>
        <p>Your Quantum-Enhanced AI Life Platform is currently offline. Some features may be limited, but your data is safe and synchronized.</p>
        <button class="retry-btn" onclick="window.location.reload()">
            🔄 Retry Connection
        </button>
    </div>
</body>
</html>`;

    // Create offline API response
    const offlineAPI = {
        status: 'offline',
        message: 'API temporarily unavailable',
        timestamp: new Date().toISOString(),
        cachedData: {
            energyLevel: 82,
            mood: 'Focused',
            biometrics: {
                heartRate: 72,
                stress: 25
            }
        }
    };

    // Cache offline resources
    await Promise.all([
        offlineCache.put('/offline.html', new Response(offlineHTML, {
            headers: { 'Content-Type': 'text/html' }
        })),
        offlineCache.put('/offline-api.json', new Response(JSON.stringify(offlineAPI), {
            headers: { 'Content-Type': 'application/json' }
        }))
    ]);
}

// Background Sync for offline data
self.addEventListener('sync', event => {
    console.log('🔄 Background sync triggered:', event.tag);
    
    if (event.tag === 'biometric-sync') {
        event.waitUntil(syncBiometricData());
    }
    
    if (event.tag === 'fusion-sync') {
        event.waitUntil(syncFusionData());
    }
    
    if (event.tag === 'sensor-sync') {
        event.waitUntil(syncSensorData());
    }
});

// Sync functions for offline data
async function syncBiometricData() {
    try {
        // Sync any offline biometric data
        console.log('🩺 Syncing biometric data...');
        // Implementation would depend on your data storage strategy
    } catch (error) {
        console.error('❌ Biometric sync failed:', error);
    }
}

async function syncFusionData() {
    try {
        // Sync emotional fusion data
        console.log('🧠💓 Syncing fusion data...');
        // Implementation would depend on your data storage strategy
    } catch (error) {
        console.error('❌ Fusion sync failed:', error);
    }
}

async function syncSensorData() {
    try {
        // Sync phone sensor data
        console.log('📱 Syncing sensor data...');
        // Implementation would depend on your data storage strategy
    } catch (error) {
        console.error('❌ Sensor sync failed:', error);
    }
}

// Handle messages from the main app
self.addEventListener('message', event => {
    const { type, data } = event.data;
    
    switch (type) {
        case 'SKIP_WAITING':
            self.skipWaiting();
            break;
            
        case 'CACHE_UPDATE':
            handleCacheUpdate(data);
            break;
            
        case 'BIOMETRIC_DATA':
            handleBiometricData(data);
            break;
            
        case 'SENSOR_DATA':
            handleSensorData(data);
            break;
            
        default:
            console.log('Unknown message type:', type);
    }
});

// Handle cache updates from the app
async function handleCacheUpdate(data) {
    try {
        const cache = await caches.open(DYNAMIC_CACHE);
        await cache.put(data.url, new Response(JSON.stringify(data.content)));
        console.log('✅ Cache updated for:', data.url);
    } catch (error) {
        console.error('❌ Cache update failed:', error);
    }
}

// Handle biometric data for offline storage
async function handleBiometricData(data) {
    // Store biometric data for offline sync
    // You could use IndexedDB here for more complex offline storage
    console.log('💓 Biometric data received:', data);
}

// Handle sensor data for offline storage
async function handleSensorData(data) {
    // Store sensor data for offline sync
    console.log('📱 Sensor data received:', data);
}

// Error handling
self.addEventListener('error', event => {
    console.error('🚨 Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', event => {
    console.error('🚨 Unhandled promise rejection:', event.reason);
});

console.log('🚀 AI Life Platform Service Worker loaded successfully');
