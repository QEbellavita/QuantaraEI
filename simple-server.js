import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const server = http.createServer((req, res) => {
    console.log(`📡 Request: ${req.method} ${req.url}`);
    
    // Simple health check endpoint
    if (req.url === '/health') {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            message: 'AI Life Platform server is running'
        }, null, 2));
        return;
    }
    
    // Default HTML response
    let html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Life Platform</title>
    <style>
        body { 
            font-family: 'Inter', Arial, sans-serif; 
            background: linear-gradient(135deg, #000000 0%, #1a1a2e 50%, #0f0f23 100%);
            color: white; 
            text-align: center; 
            padding: 50px;
            min-height: 100vh;
            margin: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
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
        a { color: #00ffd4; text-decoration: none; }
        a:hover { text-decoration: underline; }
        .status {
            background: rgba(16, 185, 129, 0.2);
            padding: 20px;
            border-radius: 12px;
            margin: 20px 0;
            border: 1px solid rgba(16, 185, 129, 0.3);
        }
        .warning {
            background: rgba(245, 158, 11, 0.2);
            padding: 15px;
            border-radius: 12px;
            margin: 20px 0;
            border: 1px solid rgba(245, 158, 11, 0.3);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>⚛️ AI Life Platform</h1>
        <div class="status">
            <h2>🚀 Server Running Successfully!</h2>
            <p>Your AI Life Platform is ready to go!</p>
        </div>
        <div class="warning">
            <p><strong>⚠️ Using Default HTML</strong></p>
            <p>Place <code>ai_platform_complete.html</code> in the root folder for full features</p>
        </div>
        <p>Time: ${new Date().toLocaleString()}</p>
        <p><a href="/">🔄 Refresh</a> | <a href="/health">🏥 Health Check</a></p>
        <div style="margin-top: 30px; text-align: left;">
            <h3>🎯 Next Steps:</h3>
            <ol>
                <li>✅ Server is running (you're here!)</li>
                <li>📄 Add your ai_platform_complete.html file</li>
                <li>🚀 Access full AI features</li>
            </ol>
        </div>
    </div>
    <script>
        console.log('🚀 AI Life Platform server loaded');
        console.log('📊 Status: Default HTML served');
        setInterval(() => {
            console.log('💓 Server heartbeat:', new Date().toLocaleTimeString());
        }, 30000);
    </script>
</body>
</html>`;

    // Check for the main AI platform file
    const mainFile = path.join(__dirname, 'ai_platform_complete.html');
    if (fs.existsSync(mainFile)) {
        try {
            html = fs.readFileSync(mainFile, 'utf8');
            console.log('📄 ✅ Serving ai_platform_complete.html');
        } catch (error) {
            console.log('📄 ❌ Error reading ai_platform_complete.html:', error.message);
        }
    } else {
        console.log('📄 ⚠️  ai_platform_complete.html not found, using default HTML');
    }
    
    // Set proper headers for HTML content
    res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'
    });
    
    res.end(html);
});

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

server.listen(PORT, HOST, () => {
    console.log('🚀 AI Life Platform - Simple Server');
    console.log('─'.repeat(50));
    console.log(`📍 Local:    http://${HOST}:${PORT}`);
    console.log(`🏥 Health:   http://${HOST}:${PORT}/health`);
    console.log('─'.repeat(50));
    console.log('✅ Server ready! Open the URL above in your browser.');
    console.log('💡 Tip: Add ai_platform_complete.html for full features');
    console.log('🔍 Watch this console for request logs...');
});

server.on('error', (err) => {
    console.error('❌ Server error:', err.message);
    if (err.code === 'EADDRINUSE') {
        console.log(`💡 Port ${PORT} is busy. Try: PORT=8080 node simple-server.js`);
    }
});

process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server gracefully...');
    server.close(() => {
        console.log('👋 Server stopped. Goodbye!');
        process.exit(0);
    });
});
