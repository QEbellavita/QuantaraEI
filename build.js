#!/usr/bin/env node

/**
 * AI Life Platform - Advanced Build System
 * Handles Quantum Intelligence, Emotional Fusion Engine, and Phone Sensors
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');
const crypto = require('crypto');

class AILifePlatformBuilder {
    constructor() {
        this.srcDir = path.join(__dirname, 'src');
        this.distDir = path.join(__dirname, 'dist');
        this.assetsDir = path.join(this.srcDir, 'assets');
        this.distAssetsDir = path.join(this.distDir, 'assets');
        
        this.config = {
            production: process.env.NODE_ENV === 'production',
            version: this.generateVersion(),
            buildTime: new Date().toISOString(),
            features: {
                quantumAI: true,
                emotionalFusion: true,
                phoneSensors: true,
                biometricMonitoring: true,
                voiceAnalysis: true,
                pwa: true
            }
        };

        this.log('🚀 AI Life Platform Builder initialized');
        this.log(`📦 Build mode: ${this.config.production ? 'PRODUCTION' : 'DEVELOPMENT'}`);
        this.log(`⚛️ Version: ${this.config.version}`);
    }

    async build() {
        try {
            await this.setupDirectories();
            await this.copyAssets();
            await this.processHTML();
            await this.generatePWAManifest();
            await this.generateServiceWorker();
            await this.optimizeForProduction();
            await this.generateBuildInfo();
            
            this.log('✅ Build completed successfully!');
            this.printBuildSummary();
            
        } catch (error) {
            this.error('❌ Build failed:', error.message);
            process.exit(1);
        }
    }

    async setupDirectories() {
        this.log('📁 Setting up directories...');
        
        try {
            await fs.rmdir(this.distDir, { recursive: true });
        } catch (e) {
            // Directory doesn't exist, ignore
        }
        
        await fs.mkdir(this.distDir, { recursive: true });
        await fs.mkdir(this.distAssetsDir, { recursive: true });
        await fs.mkdir(path.join(this.distAssetsDir, 'images'), { recursive: true });
        await fs.mkdir(path.join(this.distAssetsDir, 'icons'), { recursive: true });
        await fs.mkdir(path.join(this.distAssetsDir, 'fonts'), { recursive: true });
        await fs.mkdir(path.join(this.distAssetsDir, 'audio'), { recursive: true });
        await fs.mkdir(path.join(this.distAssetsDir, 'data'), { recursive: true });
    }

    async copyAssets() {
        this.log('📋 Copying assets...');
        
        try {
            const assetsExist = await fs.access(this.assetsDir).then(() => true).catch(() => false);
            if (assetsExist) {
                await this.copyDirectory(this.assetsDir, this.distAssetsDir);
            } else {
                this.log('📁 No assets directory found, creating default assets...');
                await this.createDefaultAssets();
            }
        } catch (error) {
            this.log('⚠️ Assets not found, creating defaults...');
            await this.createDefaultAssets();
        }
    }

    async createDefaultAssets() {
        // Create default PWA icons
        const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];
        const iconDir = path.join(this.distAssetsDir, 'icons');
        
        for (const size of iconSizes) {
            const iconContent = this.generateSVGIcon(size);
            await fs.writeFile(
                path.join(iconDir, `icon-${size}x${size}.png`),
                iconContent
            );
        }

        // Create favicon
        const faviconSVG = this.generateFaviconSVG();
        await fs.writeFile(path.join(this.distDir, 'favicon.svg'), faviconSVG);

        // Create default notification sounds
        await this.createDefaultAudio();

        // Create default config files
        await this.createDefaultConfig();
    }

    generateSVGIcon(size) {
        // For demo purposes, return a simple placeholder
        // In production, you'd generate actual PNG files
        return `<!-- ${size}x${size} icon placeholder -->`;
    }

    generateFaviconSVG() {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
            <defs>
                <linearGradient id="quantum" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                    <stop offset="50%" style="stop-color:#a855f7;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#00ffd4;stop-opacity:1" />
                </linearGradient>
            </defs>
            <circle cx="16" cy="16" r="14" fill="url(#quantum)" stroke="#fff" stroke-width="2"/>
            <path d="M10 16 L14 20 L22 12" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>
            <circle cx="16" cy="8" r="2" fill="#fff" opacity="0.8"/>
            <circle cx="24" cy="16" r="1.5" fill="#fff" opacity="0.6"/>
            <circle cx="8" cy="24" r="1" fill="#fff" opacity="0.4"/>
        </svg>`;
    }

    async createDefaultAudio() {
        const audioDir = path.join(this.distAssetsDir, 'audio');
        
        // Create notification sound placeholders
        const sounds = ['notification.mp3', 'achievement.wav', 'quantum-alert.ogg'];
        for (const sound of sounds) {
            await fs.writeFile(
                path.join(audioDir, sound),
                '<!-- Audio placeholder -->'
            );
        }
    }

    async createDefaultConfig() {
        const dataDir = path.join(this.distAssetsDir, 'data');
        
        const defaultConfig = {
            version: this.config.version,
            features: this.config.features,
            quantumAI: {
                coherenceThreshold: 0.85,
                optimizationLevels: 5,
                parallelPathways: 8
            },
            emotionalFusion: {
                biometricWeight: 0.4,
                facialWeight: 0.3,
                voiceWeight: 0.3,
                confidenceThreshold: 0.8
            },
            phoneSensors: {
                accelerometerSensitivity: 0.1,
                lightSensorInterval: 1000,
                audioAnalysisWindow: 256
            },
            personalization: {
                defaultPersonality: 'Analytical-Achiever',
                adaptationRate: 0.05,
                learningEnabled: true
            }
        };
        
        await fs.writeFile(
            path.join(dataDir, 'config.json'),
            JSON.stringify(defaultConfig, null, 2)
        );
    }

    async processHTML() {
        this.log('🔧 Processing HTML...');
        
        const htmlContent = await fs.readFile(
            path.join(__dirname, 'fixed_ai_platform (4).html'),
            'utf-8'
        );
        
        let processedHTML = htmlContent;
        
        // Inject build info
        processedHTML = this.injectBuildInfo(processedHTML);
        
        // Optimize CSS if production
        if (this.config.production) {
            processedHTML = await this.optimizeCSS(processedHTML);
            processedHTML = await this.optimizeJavaScript(processedHTML);
        }
        
        // Add PWA features
        processedHTML = this.addPWAFeatures(processedHTML);
        
        await fs.writeFile(path.join(this.distDir, 'index.html'), processedHTML);
    }

    injectBuildInfo(html) {
        const buildInfo = `
        <script>
            window.AI_PLATFORM_BUILD = {
                version: '${this.config.version}',
                buildTime: '${this.config.buildTime}',
                production: ${this.config.production},
                features: ${JSON.stringify(this.config.features)},
                quantumIntelligence: true,
                emotionalFusion: true,
                phoneSensors: true
            };
            console.log('🚀 AI Life Platform v${this.config.version}');
            console.log('⚛️ Quantum Intelligence: Active');
            console.log('🧠💓 Emotional Fusion Engine: Active');
            console.log('📱 Phone Sensors Manager: Active');
        </script>`;
        
        return html.replace('</head>', `${buildInfo}\n</head>`);
    }

    addPWAFeatures(html) {
        const pwaFeatures = `
        <!-- PWA Features -->
        <link rel="manifest" href="/manifest.json">
        <link rel="icon" type="image/svg+xml" href="/favicon.svg">
        <link rel="apple-touch-icon" sizes="180x180" href="/assets/icons/icon-180x180.png">
        <meta name="theme-color" content="#667eea">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
        <meta name="apple-mobile-web-app-title" content="AI Life Platform">
        
        <!-- Service Worker Registration -->
        <script>
            if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
                window.addEventListener('load', () => {
                    navigator.serviceWorker.register('/sw.js')
                        .then(registration => {
                            console.log('🔧 Service Worker registered:', registration.scope);
                        })
                        .catch(error => {
                            console.log('❌ Service Worker registration failed:', error);
                        });
                });
            }
        </script>`;
        
        return html.replace('</head>', `${pwaFeatures}\n</head>`);
    }

    async optimizeCSS(html) {
        // Extract CSS and minify
        const cssRegex = /<style>([\s\S]*?)<\/style>/g;
        let match;
        let optimizedCSS = '';
        
        while ((match = cssRegex.exec(html)) !== null) {
            const css = match[1];
            // Simple CSS minification
            const minified = css
                .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
                .replace(/\s+/g, ' ') // Collapse whitespace
                .replace(/;\s*}/g, '}') // Remove last semicolon
                .replace(/\s*{\s*/g, '{') // Clean braces
                .replace(/\s*}\s*/g, '}')
                .replace(/\s*,\s*/g, ',') // Clean commas
                .replace(/\s*:\s*/g, ':') // Clean colons
                .replace(/\s*;\s*/g, ';') // Clean semicolons
                .trim();
            
            optimizedCSS += minified;
        }
        
        // Replace all style blocks with optimized version
        return html.replace(/<style>[\s\S]*?<\/style>/g, `<style>${optimizedCSS}</style>`);
    }

    async optimizeJavaScript(html) {
        // Extract JavaScript and apply basic optimizations
        const jsRegex = /<script>([\s\S]*?)<\/script>/g;
        let match;
        let optimizedJS = '';
        
        while ((match = jsRegex.exec(html)) !== null) {
            const js = match[1];
            // Basic JS optimization (remove comments and excess whitespace)
            const minified = js
                .replace(/\/\/.*$/gm, '') // Remove single line comments
                .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
                .replace(/\s+/g, ' ') // Collapse whitespace
                .replace(/;\s*}/g, ';}') // Clean up
                .trim();
            
            optimizedJS += minified;
        }
        
        // Replace script content
        return html.replace(/<script>([\s\S]*?)<\/script>/g, `<script>${optimizedJS}</script>`);
    }

    async generatePWAManifest() {
        this.log('📱 Generating PWA manifest...');
        
        const manifest = {
            name: "AI Life Platform - Quantum Enhanced",
            short_name: "AI Life",
            description: "Advanced AI Life Optimization with Quantum Intelligence, Emotional Fusion Engine, and Phone Sensors",
            start_url: "/",
            display: "standalone",
            orientation: "portrait-primary",
            theme_color: "#667eea",
            background_color: "#000000",
            categories: ["lifestyle", "health", "productivity", "utilities"],
            icons: [
                {
                    "src": "/assets/icons/icon-72x72.png",
                    "sizes": "72x72",
                    "type": "image/png",
                    "purpose": "any maskable"
                },
                {
                    "src": "/assets/icons/icon-96x96.png",
                    "sizes": "96x96",
                    "type": "image/png",
                    "purpose": "any"
                },
                {
                    "src": "/assets/icons/icon-128x128.png",
                    "sizes": "128x128",
                    "type": "image/png",
                    "purpose": "any"
                },
                {
                    "src": "/assets/icons/icon-144x144.png",
                    "sizes": "144x144",
                    "type": "image/png",
                    "purpose": "any"
                },
                {
                    "src": "/assets/icons/icon-152x152.png",
                    "sizes": "152x152",
                    "type": "image/png",
                    "purpose": "any"
                },
                {
                    "src": "/assets/icons/icon-192x192.png",
                    "sizes": "192x192",
                    "type": "image/png",
                    "purpose": "any maskable"
                },
                {
                    "src": "/assets/icons/icon-384x384.png",
                    "sizes": "384x384",
                    "type": "image/png",
                    "purpose": "any"
                },
                {
                    "src": "/assets/icons/icon-512x512.png",
                    "sizes": "512x512",
                    "type": "image/png",
                    "purpose": "any maskable"
                }
            ],
            features: [
                "quantum-ai-optimization",
                "emotional-fusion-engine", 
                "phone-sensors-integration",
                "biometric-monitoring",
                "voice-analysis",
                "camera-emotion-detection",
                "real-time-fusion",
                "predictive-intelligence"
            ],
            screenshots: [
                {
                    "src": "/assets/images/screenshot-mobile.png",
                    "sizes": "390x844",
                    "type": "image/png",
                    "form_factor": "narrow"
                },
                {
                    "src": "/assets/images/screenshot-desktop.png",
                    "sizes": "1280x720",
                    "type": "image/png",
                    "form_factor": "wide"
                }
            ]
        };
        
        await fs.writeFile(
            path.join(this.distDir, 'manifest.json'),
            JSON.stringify(manifest, null, 2)
        );
    }

    async generateServiceWorker() {
        this.log('🔧 Generating Service Worker...');
        
        const swContent = `
// AI Life Platform Service Worker v${this.config.version}
// Quantum Intelligence, Emotional Fusion Engine, Phone Sensors

const CACHE_NAME = 'ai-life-platform-v${this.config.version}';
const QUANTUM_CACHE = 'quantum-intelligence-v${this.config.version}';
const FUSION_CACHE = 'emotional-fusion-v${this.config.version}';
const SENSORS_CACHE = 'phone-sensors-v${this.config.version}';

const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/favicon.svg',
    '/assets/icons/icon-192x192.png',
    '/assets/icons/icon-512x512.png',
    '/assets/data/config.json'
];

const DYNAMIC_PATTERNS = [
    /^\\/assets\\//,
    /^\\/api\\//,
    /^\\/quantum\\//,
    /^\\/fusion\\//,
    /^\\/sensors\\//
];

self.addEventListener('install', event => {
    console.log('🔧 Service Worker installing v${this.config.version}');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('📦 Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    console.log('✅ Service Worker activating v${this.config.version}');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME && 
                        cacheName !== QUANTUM_CACHE && 
                        cacheName !== FUSION_CACHE && 
                        cacheName !== SENSORS_CACHE) {
                        console.log('🗑️ Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    
    // Handle quantum AI requests
    if (url.pathname.includes('/quantum/')) {
        event.respondWith(handleQuantumRequest(event.request));
        return;
    }
    
    // Handle fusion engine requests
    if (url.pathname.includes('/fusion/')) {
        event.respondWith(handleFusionRequest(event.request));
        return;
    }
    
    // Handle sensors requests
    if (url.pathname.includes('/sensors/')) {
        event.respondWith(handleSensorsRequest(event.request));
        return;
    }
    
    // Default cache strategy
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                
                return fetch(event.request).then(response => {
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });
                    
                    return response;
                });
            })
    );
});

async function handleQuantumRequest(request) {
    const cache = await caches.open(QUANTUM_CACHE);
    let response = await cache.match(request);
    
    if (!response) {
        response = await fetch(request);
        if (response.status === 200) {
            cache.put(request, response.clone());
        }
    }
    
    return response;
}

async function handleFusionRequest(request) {
    const cache = await caches.open(FUSION_CACHE);
    let response = await cache.match(request);
    
    if (!response) {
        response = await fetch(request);
        if (response.status === 200) {
            cache.put(request, response.clone());
        }
    }
    
    return response;
}

async function handleSensorsRequest(request) {
    const cache = await caches.open(SENSORS_CACHE);
    let response = await cache.match(request);
    
    if (!response) {
        response = await fetch(request);
        if (response.status === 200) {
            cache.put(request, response.clone());
        }
    }
    
    return response;
}

// Background sync for offline data
self.addEventListener('sync', event => {
    if (event.tag === 'quantum-sync') {
        event.waitUntil(syncQuantumData());
    } else if (event.tag === 'fusion-sync') {
        event.waitUntil(syncFusionData());
    } else if (event.tag === 'sensors-sync') {
        event.waitUntil(syncSensorsData());
    }
});

async function syncQuantumData() {
    console.log('⚛️ Syncing quantum intelligence data');
    // Implement quantum data sync
}

async function syncFusionData() {
    console.log('🧠💓 Syncing emotional fusion data');
    // Implement fusion data sync
}

async function syncSensorsData() {
    console.log('📱 Syncing phone sensors data');
    // Implement sensors data sync
}

// Push notifications
self.addEventListener('push', event => {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: '/assets/icons/icon-192x192.png',
            badge: '/assets/icons/badge-72x72.png',
            data: data,
            actions: [
                {
                    action: 'open',
                    title: 'Open App'
                },
                {
                    action: 'dismiss',
                    title: 'Dismiss'
                }
            ]
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title || 'AI Life Platform', options)
        );
    }
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    if (event.action === 'open') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});
`;
        
        await fs.writeFile(path.join(this.distDir, 'sw.js'), swContent);
    }

    async optimizeForProduction() {
        if (!this.config.production) {
            return;
        }
        
        this.log('⚡ Applying production optimizations...');
        
        // Compress images if ImageOptim is available
        try {
            execSync('which imageoptim-cli', { stdio: 'ignore' });
            execSync(`imageoptim-cli ${this.distAssetsDir}/icons/*.png`, { stdio: 'ignore' });
            this.log('🖼️ Images optimized');
        } catch (e) {
            this.log('⚠️ ImageOptim not found, skipping image optimization');
        }
        
        // Generate integrity hashes for assets
        await this.generateIntegrityHashes();
        
        // Create production robots.txt
        await this.createRobotsTxt();
        
        // Generate sitemap
        await this.generateSitemap();
    }

    async generateIntegrityHashes() {
        const files = ['index.html', 'manifest.json', 'sw.js'];
        const hashes = {};
        
        for (const file of files) {
            const filePath = path.join(this.distDir, file);
            try {
                const content = await fs.readFile(filePath);
                const hash = crypto.createHash('sha384').update(content).digest('base64');
                hashes[file] = `sha384-${hash}`;
            } catch (e) {
                // File doesn't exist, skip
            }
        }
        
        await fs.writeFile(
            path.join(this.distDir, 'integrity.json'),
            JSON.stringify(hashes, null, 2)
        );
    }

    async createRobotsTxt() {
        const robotsContent = `User-agent: *
Allow: /
Disallow: /assets/data/

Sitemap: https://your-domain.com/sitemap.xml

# AI Life Platform with Quantum Intelligence
# Features: Emotional Fusion Engine, Phone Sensors, Biometric Monitoring
`;
        
        await fs.writeFile(path.join(this.distDir, 'robots.txt'), robotsContent);
    }

    async generateSitemap() {
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://your-domain.com/</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
</urlset>`;
        
        await fs.writeFile(path.join(this.distDir, 'sitemap.xml'), sitemap);
    }

    async generateBuildInfo() {
        const buildInfo = {
            version: this.config.version,
            buildTime: this.config.buildTime,
            production: this.config.production,
            features: this.config.features,
            files: await this.getFileList(),
            size: await this.calculateTotalSize()
        };
        
        await fs.writeFile(
            path.join(this.distDir, 'build-info.json'),
            JSON.stringify(buildInfo, null, 2)
        );
    }

    async getFileList() {
        const files = [];
        
        async function walkDir(dir, relativePath = '') {
            const items = await fs.readdir(dir);
            
            for (const item of items) {
                const fullPath = path.join(dir, item);
                const relPath = path.join(relativePath, item);
                const stat = await fs.stat(fullPath);
                
                if (stat.isDirectory()) {
                    await walkDir(fullPath, relPath);
                } else {
                    files.push({
                        path: relPath,
                        size: stat.size,
                        modified: stat.mtime.toISOString()
                    });
                }
            }
        }
        
        await walkDir(this.distDir);
        return files;
    }

    async calculateTotalSize() {
        const files = await this.getFileList();
        return files.reduce((total, file) => total + file.size, 0);
    }

    async copyDirectory(src, dest) {
        const items = await fs.readdir(src);
        
        for (const item of items) {
            const srcPath = path.join(src, item);
            const destPath = path.join(dest, item);
            const stat = await fs.stat(srcPath);
            
            if (stat.isDirectory()) {
                await fs.mkdir(destPath, { recursive: true });
                await this.copyDirectory(srcPath, destPath);
            } else {
                await fs.copyFile(srcPath, destPath);
            }
        }
    }

    generateVersion() {
        const date = new Date();
        const major = 1;
        const minor = date.getFullYear() - 2023;
        const patch = (date.getMonth() + 1) * 100 + date.getDate();
        return `${major}.${minor}.${patch}`;
    }

    printBuildSummary() {
        console.log('\n🎉 Build Summary:');
        console.log('================');
        console.log(`📦 Version: ${this.config.version}`);
        console.log(`🏗️ Mode: ${this.config.production ? 'PRODUCTION' : 'DEVELOPMENT'}`);
        console.log(`📁 Output: ${this.distDir}`);
        console.log('\n🚀 Features Enabled:');
        console.log('⚛️ Quantum Intelligence: ✅');
        console.log('🧠💓 Emotional Fusion Engine: ✅');
        console.log('📱 Phone Sensors Manager: ✅');
        console.log('💓 Biometric Monitoring: ✅');
        console.log('🎤 Voice Analysis: ✅');
        console.log('📷 Camera Emotion Detection: ✅');
        console.log('📱 PWA Support: ✅');
        console.log('🔧 Service Worker: ✅');
        console.log('\n🌐 Ready to deploy!');
    }

    log(message) {
        console.log(`[${new Date().toLocaleTimeString()}] ${message}`);
    }

    error(message, error) {
        console.error(`[${new Date().toLocaleTimeString()}] ${message}`, error);
    }
}

// Development server
class DevServer {
    constructor(builder) {
        this.builder = builder;
        this.port = process.env.PORT || 3000;
    }

    async start() {
        this.builder.log('🌐 Starting development server...');
        
        // Build first
        await this.builder.build();
        
        // Start simple HTTP server
        const http = require('http');
        const url = require('url');
        const mimeTypes = {
            '.html': 'text/html',
            '.js': 'text/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
            '.wav': 'audio/wav',
            '.mp3': 'audio/mpeg',
            '.woff': 'font/woff',
            '.woff2': 'font/woff2'
        };
        
        const server = http.createServer(async (req, res) => {
            const parsedUrl = url.parse(req.url);
            let pathname = parsedUrl.pathname;
            
            // Default to index.html
            if (pathname === '/') {
                pathname = '/index.html';
            }
            
            const filePath = path.join(this.builder.distDir, pathname);
            
            try {
                const data = await fs.readFile(filePath);
                const ext = path.extname(filePath);
                const contentType = mimeTypes[ext] || 'application/octet-stream';
                
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(data);
            } catch (error) {
                res.writeHead(404);
                res.end('Not Found');
            }
        });
        
        server.listen(this.port, () => {
            this.builder.log(`🌐 Dev server running at http://localhost:${this.port}`);
            this.builder.log('🚀 AI Life Platform ready!');
            this.builder.log('⚛️ Quantum Intelligence enabled');
            this.builder.log('🧠💓 Emotional Fusion Engine active');
            this.builder.log('📱 Phone Sensors Manager available');
        });
    }
}

// CLI Interface
async function main() {
    const args = process.argv.slice(2);
    const command = args[0] || 'build';
    
    const builder = new AILifePlatformBuilder();
    
    switch (command) {
        case 'build':
            await builder.build();
            break;
            
        case 'dev':
        case 'serve':
            const server = new DevServer(builder);
            await server.start();
            break;
            
        case 'clean':
            try {
                await fs.rmdir(builder.distDir, { recursive: true });
                builder.log('🧹 Cleaned dist directory');
            } catch (e) {
                builder.log('⚠️ Nothing to clean');
            }
            break;
            
        default:
            console.log('Usage: node build.js [command]');
            console.log('Commands:');
            console.log('  build    Build for production');
            console.log('  dev      Start development server');
            console.log('  clean    Clean dist directory');
            break;
    }
}

if (require.main === module) {
    main().catch(error => {
        console.error('❌ Build script failed:', error);
        process.exit(1);
    });
}

module.exports = { AILifePlatformBuilder, DevServer };