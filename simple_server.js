#!/usr/bin/env node

/**
 * Simple backup server for AI Life Platform
 * Use this if the main dev.js server has issues
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

// Try to find the main HTML file
function findMainHTML() {
    const possibleFiles = [
        'ai_platform_complete.html',
        'index.html',
        'fixed_ai_platform (4).html',
        'src/index.html',
        'public/index.html'
    ];
    
    for (const file of possibleFiles) {
        const filePath = path.join(__dirname, file);
        if (fs.existsSync(filePath)) {
            console.log(`📄 Found HTML file: ${file}`);
            return fs.readFileSync(filePath, 'utf8');
        }
    }
    
    console.log('⚠️  No HTML file found, using default');
    return getDefaultHTML();
}

function getDefaultHTML() {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Life Platform - Simple Server</title>
    <style>
        body {
            font-family: 'Inter', -apple-system, sans-serif;
            background: linear-gradient(135deg, #000000 0%, #1a1a2e 50%, #0f0f23 100%);
            color: white;
            margin: 0;
            padding: 40px;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
        }
        .container {
            max-width: 600px;
            background: rgba(255, 255, 255, 0.1);
            padding: 40px;
            border-radius: 20px;
            backdrop-filter: blur(25px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        h1 {
            background: linear-gradient(135deg, #667eea 0%, #a855f7 50%, #00ffd4 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            font-size: 3rem;
            margin-bottom: 20px;
        }
        .status {
            background: rgba(16, 185, 129, 0.2);
            padding: 20px;
            border-radius: 12px;
            margin: 20px 0;
            border: 1px solid rgba(16, 185, 129, 0.3);
        }
        .feature {
            display: inline-block;
            background: rgba(102, 126, 234, 0.2);
            padding: 8px 16px;
            border-radius: 20px;
            margin: 4px;
            font-size: 14px;
        }
        .button {
            background: linear-gradient(135deg, #667eea 0%, #a855f7 100%);
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            color: white;
            text-decoration: none;
            display: inline-block;
            margin: 10px;
            font-weight: 600;
            transition: transform 0.2s ease;
        }
        .button:hover {
            transform: translateY(-2px);
        }
        code {
            background: rgba(0, 0, 0, 0.3);
            padding: 4px 8px;
            border-radius: 4px;
            font-family: monospace;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>⚛️ AI Life Platform</h1>
        <div class="status">
            <h2>🚀 Simple Server Active</h2>
            <p>Basic server is running! Your AI platform is ready.</p>
            <div>
                <div class="feature">🔄 Static Serving</div>
                <div class="feature">📱 Mobile Ready</div>
                <div class="feature">⚡ Fast Loading</div>
            </div>
        </div>
        
        <div style="text-align: left; margin: 20px 0;">
            <h3>🔧 Next Steps:</h3>
            <ol>
                <li>Place your <code>ai_platform_complete.html</code> file in the root directory</li>
                <li>Restart the server: <code>node simple-server.js</code></li>
                <li>Or upgrade to full dev server: <code>node dev.js</code></li>
            </ol>
        </div>
        
        <div style="text-align: left; margin: 20px 0;">
            <h3>📱 Features Available:</h3>
            <ul>
                <li>⚛️ Quantum-Enhanced AI Coach</li>
                <li>🧠💓 Emotional Fusion Engine</li>
                <li>📱 Phone Sensors Integration</li>
                <li>💗 Biometric Monitoring</li>
                <li>📊 Performance Analytics</li>
            </ul>
        </div>
        
        <p>Server running on <code>http://${HOST}:${PORT}</code></p>
        <p>Time: <span id="time"></span></p>
        
        <a href="#" class="button" onclick="location.reload()">🔄 Refresh</a>
        <a href="/health" class="button">🏥 Health Check</a>
    </div>
    
    <script>
        // Update time every second
        function updateTime() {
            document.getElementById('time').textContent = new Date().toLocaleString();
        }
        updateTime();
        setInterval(updateTime, 1000);
        
        // Simple feature detection
        console.log('🚀 AI Life Platform Simple Server');
        console.log('📱 Features: Static serving, mobile ready');
        
        // Check for full platform features
        if (window.DeviceMotionEvent) {
            console.log('📱 Motion sensors supported');
        }
        if (navigator.mediaDevices) {
            console.log('📷 Camera/microphone access available');
        }
    </script>
</body>
</html>
    `;
}

const server = http.createServer((req, res) => {
    // Simple routing
    if (req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'healthy',
            server: 'simple-server',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            version: process.version
        }, null, 2));
        return;
    }
    
    // Serve main HTML for all other routes
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(findMainHTML());
});

server.listen(PORT, HOST, () => {
    console.log('🚀 AI Life Platform - Simple Server');
    console.log('─'.repeat(50));
    console.log(`📍 Local:    http://${HOST}:${PORT}`);
    console.log(`🌐 Network:  http://localhost:${PORT}`);
    console.log(`🏥 Health:   http://${HOST}:${PORT}/health`);
    console.log('─'.repeat(50));
    console.log('✅ Server ready for AI Life Platform!');
    console.log('💡 Tip: Place ai_platform_complete.html in root for full features');
});

server.on('error', (err) => {
    console.error('❌ Server error:', err.message);
    if (err.code === 'EADDRINUSE') {
        console.log(`💡 Port ${PORT} is busy. Try: PORT=8080 node simple-server.js`);
    }
});

process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    server.close(() => {
        console.log('👋 Server stopped');
        process.exit(0);
    });
});
