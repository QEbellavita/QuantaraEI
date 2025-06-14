#!/usr/bin/env node

/**
 * AI Life Platform - Quantum-Enhanced Development Server
 * Advanced development server with hot reload, API simulation, and quantum debugging
 */

import express from 'express';
import { createServer } from 'http';
import { Server as SocketIO } from 'socket.io';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import chokidar from 'chokidar';
import chalk from 'chalk';
import ora from 'ora';
import cors from 'cors';
import compression from 'compression';
import { WebSocketServer } from 'ws';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Development Configuration
const DEV_CONFIG = {
  port: process.env.PORT || 3000,
  host: process.env.HOST || 'localhost',
  ssl: process.env.SSL === 'true',
  
  // Paths
  root: __dirname,
  publicDir: path.join(__dirname, 'public'),
  assetsDir: path.join(__dirname, 'src/assets'),
  
  // Features
  hotReload: true,
  quantumSimulation: true,
  biometricSimulation: true,
  sensorSimulation: true,
  
  // API endpoints
  apiPrefix: '/api',
  
  // File watching
  watchFiles: ['*.html', 'src/**/*', 'assets/**/*'],
  ignoreFiles: ['node_modules/**', 'dist/**', '.git/**']
};

class QuantumLogger {
  static info(message) {
    console.log(chalk.blue('ℹ️'), chalk.white(message));
  }
  
  static success(message) {
    console.log(chalk.green('✅'), chalk.white(message));
  }
  
  static warning(message) {
    console.log(chalk.yellow('⚠️'), chalk.white(message));
  }
  
  static error(message) {
    console.log(chalk.red('❌'), chalk.white(message));
  }
  
  static quantum(message) {
    console.log(chalk.magenta('⚛️'), chalk.white(message));
  }
  
  static server(message) {
    console.log(chalk.cyan('🚀'), chalk.white(message));
  }
  
  static fusion(message) {
    console.log(chalk.blue('🧠💓'), chalk.white(message));
  }
  
  static sensor(message) {
    console.log(chalk.green('📱'), chalk.white(message));
  }
}

class AIDevServer {
  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.io = new SocketIO(this.server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });
    
    // Simulation data
    this.biometricData = this.initBiometricData();
    this.sensorData = this.initSensorData();
    this.quantumState = this.initQuantumState();
    this.emotionalState = this.initEmotionalState();
    
    // Client connections
    this.clients = new Set();
    
    this.setupMiddleware();
    this.setupRoutes();
    this.setupWebSockets();
    this.setupFileWatcher();
    this.setupSimulations();
  }

  setupMiddleware() {
    // CORS and compression
    this.app.use(cors());
    this.app.use(compression());
    
    // Parse JSON
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    
    // Request logging
    this.app.use((req, res, next) => {
      const timestamp = new Date().toLocaleTimeString();
      QuantumLogger.server(`${timestamp} ${req.method} ${req.url}`);
      next();
    });
    
    // Serve static files
    this.app.use('/assets', express.static(DEV_CONFIG.assetsDir));
    this.app.use(express.static(DEV_CONFIG.root));
  }

  setupRoutes() {
    // Main HTML file
    this.app.get('/', async (req, res) => {
      try {
        let html = await this.getMainHTML();
        
        // Inject development features
        html = this.injectDevFeatures(html);
        
        res.setHeader('Content-Type', 'text/html');
        res.send(html);
      } catch (error) {
        QuantumLogger.error(`Failed to serve HTML: ${error.message}`);
        res.status(500).send('Development server error');
      }
    });

    // API Routes
    this.setupAPIRoutes();
    
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'quantum_active',
        timestamp: new Date().toISOString(),
        version: this.getVersion(),
        features: {
          hotReload: DEV_CONFIG.hotReload,
          quantumSimulation: DEV_CONFIG.quantumSimulation,
          biometricSimulation: DEV_CONFIG.biometricSimulation,
          sensorSimulation: DEV_CONFIG.sensorSimulation
        }
      });
    });
  }

  setupAPIRoutes() {
    const api = express.Router();
    
    // Biometric data endpoints
    api.get('/biometric/current', (req, res) => {
      res.json({
        success: true,
        data: this.biometricData,
        timestamp: Date.now()
      });
    });
    
    api.get('/biometric/history', (req, res) => {
      const hours = parseInt(req.query.hours) || 24;
      const history = this.generateBiometricHistory(hours);
      
      res.json({
        success: true,
        data: history,
        timeRange: `${hours}h`
      });
    });
    
    // Emotional fusion endpoints
    api.get('/fusion/state', (req, res) => {
      res.json({
        success: true,
        data: this.emotionalState,
        correlations: this.calculateEmotionalCorrelations(),
        confidence: 94.7
      });
    });
    
    api.post('/fusion/calibrate', (req, res) => {
      QuantumLogger.fusion('Fusion engine calibration requested');
      
      // Simulate calibration
      setTimeout(() => {
        this.emotionalState.calibrated = true;
        this.broadcast('fusion:calibrated', this.emotionalState);
        
        res.json({
          success: true,
          message: 'Fusion engine calibrated',
          newState: this.emotionalState
        });
      }, 2000);
    });
    
    // Sensor simulation endpoints
    api.get('/sensors/status', (req, res) => {
      res.json({
        success: true,
        data: this.sensorData,
        active: Object.values(this.sensorData).filter(s => s.active).length
      });
    });
    
    api.post('/sensors/:type/toggle', (req, res) => {
      const { type } = req.params;
      
      if (this.sensorData[type]) {
        this.sensorData[type].active = !this.sensorData[type].active;
        
        QuantumLogger.sensor(`${type} sensor ${this.sensorData[type].active ? 'activated' : 'deactivated'}`);
        
        this.broadcast('sensor:toggle', {
          type,
          active: this.sensorData[type].active,
          data: this.sensorData[type]
        });
        
        res.json({
          success: true,
          sensor: type,
          active: this.sensorData[type].active
        });
      } else {
        res.status(404).json({
          success: false,
          error: 'Sensor not found'
        });
      }
    });
    
    // Quantum state endpoints
    api.get('/quantum/state', (req, res) => {
      res.json({
        success: true,
        data: this.quantumState,
        coherence: this.quantumState.coherence.toFixed(2) + '%',
        pathways: this.quantumState.parallelPathways
      });
    });
    
    api.post('/quantum/optimize', (req, res) => {
      QuantumLogger.quantum('Quantum optimization requested');
      
      // Simulate quantum optimization
      this.quantumState.optimizing = true;
      this.broadcast('quantum:optimizing', true);
      
      setTimeout(() => {
        this.quantumState.optimizing = false;
        this.quantumState.coherence = Math.min(99.9, this.quantumState.coherence + Math.random() * 5);
        this.quantumState.optimizationScore += Math.random() * 3;
        
        this.broadcast('quantum:optimized', this.quantumState);
        
        res.json({
          success: true,
          message: 'Quantum optimization complete',
          newState: this.quantumState
        });
      }, 3000);
    });
    
    // Development tools
    api.post('/dev/reload', (req, res) => {
      QuantumLogger.info('Manual reload triggered');
      this.broadcast('dev:reload');
      res.json({ success: true, message: 'Reload triggered' });
    });
    
    api.get('/dev/logs', (req, res) => {
      res.json({
        success: true,
        logs: this.getRecentLogs()
      });
    });
    
    this.app.use(DEV_CONFIG.apiPrefix, api);
  }

  setupWebSockets() {
    this.io.on('connection', (socket) => {
      this.clients.add(socket);
      QuantumLogger.success(`Client connected (${this.clients.size} total)`);
      
      // Send initial state
      socket.emit('init', {
        biometric: this.biometricData,
        sensors: this.sensorData,
        quantum: this.quantumState,
        emotional: this.emotionalState
      });
      
      // Handle client events
      socket.on('request:biometric', () => {
        socket.emit('biometric:update', this.biometricData);
      });
      
      socket.on('request:quantum', () => {
        socket.emit('quantum:update', this.quantumState);
      });
      
      socket.on('sensor:activate', (type) => {
        if (this.sensorData[type]) {
          this.sensorData[type].active = true;
          this.broadcast('sensor:activated', { type, data: this.sensorData[type] });
        }
      });
      
      socket.on('disconnect', () => {
        this.clients.delete(socket);
        QuantumLogger.warning(`Client disconnected (${this.clients.size} total)`);
      });
    });
  }

  setupFileWatcher() {
    if (!DEV_CONFIG.hotReload) return;
    
    const watcher = chokidar.watch(DEV_CONFIG.watchFiles, {
      ignored: DEV_CONFIG.ignoreFiles,
      persistent: true,
      ignoreInitial: true
    });
    
    let reloadTimeout;
    
    watcher.on('change', (filePath) => {
      QuantumLogger.info(`File changed: ${path.relative(__dirname, filePath)}`);
      
      // Debounce reloads
      clearTimeout(reloadTimeout);
      reloadTimeout = setTimeout(() => {
        this.broadcast('dev:reload');
        QuantumLogger.quantum('Hot reload triggered');
      }, 250);
    });
    
    watcher.on('add', (filePath) => {
      QuantumLogger.success(`File added: ${path.relative(__dirname, filePath)}`);
    });
    
    QuantumLogger.success('File watcher initialized - Hot reload active');
  }

  setupSimulations() {
    // Biometric simulation
    if (DEV_CONFIG.biometricSimulation) {
      setInterval(() => {
        this.updateBiometricSimulation();
        this.broadcast('biometric:update', this.biometricData);
      }, 2000);
    }
    
    // Sensor simulation
    if (DEV_CONFIG.sensorSimulation) {
      setInterval(() => {
        this.updateSensorSimulation();
        this.broadcast('sensors:update', this.sensorData);
      }, 1000);
    }
    
    // Quantum state updates
    if (DEV_CONFIG.quantumSimulation) {
      setInterval(() => {
        this.updateQuantumSimulation();
        this.broadcast('quantum:update', this.quantumState);
      }, 5000);
    }
    
    // Emotional state updates
    setInterval(() => {
      this.updateEmotionalSimulation();
      this.broadcast('emotional:update', this.emotionalState);
    }, 3000);
  }

  async getMainHTML() {
    // Try to find the main HTML file
    const possibleFiles = [
      'index.html',
      'fixed_ai_platform (4).html',
      'src/index.html',
      'public/index.html'
    ];
    
    for (const file of possibleFiles) {
      const filePath = path.join(__dirname, file);
      if (await fs.pathExists(filePath)) {
        return await fs.readFile(filePath, 'utf8');
      }
    }
    
    // Return a default HTML if no file found
    return this.getDefaultHTML();
  }

  injectDevFeatures(html) {
    const devScript = `
    <script>
      // AI Platform Development Features
      window.AI_DEV_MODE = true;
      window.AI_DEV_CONFIG = ${JSON.stringify(DEV_CONFIG)};
      
      // Socket.io connection
      const socket = io();
      
      // Hot reload
      socket.on('dev:reload', () => {
        console.log('🔄 Hot reload triggered');
        window.location.reload();
      });
      
      // Real-time data updates
      socket.on('biometric:update', (data) => {
        window.dispatchEvent(new CustomEvent('ai:biometric', { detail: data }));
      });
      
      socket.on('sensors:update', (data) => {
        window.dispatchEvent(new CustomEvent('ai:sensors', { detail: data }));
      });
      
      socket.on('quantum:update', (data) => {
        window.dispatchEvent(new CustomEvent('ai:quantum', { detail: data }));
      });
      
      socket.on('emotional:update', (data) => {
        window.dispatchEvent(new CustomEvent('ai:emotional', { detail: data }));
      });
      
      // Development helpers
      window.aiDev = {
        reload: () => fetch('/api/dev/reload', { method: 'POST' }),
        biometric: () => fetch('/api/biometric/current').then(r => r.json()),
        quantum: () => fetch('/api/quantum/state').then(r => r.json()),
        sensors: () => fetch('/api/sensors/status').then(r => r.json()),
        optimize: () => fetch('/api/quantum/optimize', { method: 'POST' }).then(r => r.json())
      };
      
      console.log('⚛️ AI Development Mode Active');
      console.log('📱 Use window.aiDev for debugging tools');
    </script>
    <script src="/socket.io/socket.io.js"></script>
    `;
    
    const devStyles = `
    <style>
      /* Development mode indicators */
      body::before {
        content: '🔧 DEV MODE';
        position: fixed;
        top: 10px;
        right: 10px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 10px;
        font-weight: bold;
        z-index: 10000;
        opacity: 0.7;
      }
      
      /* Quantum debug panel */
      .ai-dev-panel {
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: rgba(0, 0, 0, 0.9);
        color: #00ff88;
        padding: 10px;
        border-radius: 8px;
        font-family: monospace;
        font-size: 11px;
        max-width: 300px;
        z-index: 9999;
        display: none;
      }
      
      .ai-dev-panel.show {
        display: block;
      }
    </style>
    `;
    
    // Inject before closing head tag
    html = html.replace('</head>', `${devStyles}\n${devScript}\n</head>`);
    
    return html;
  }

  getDefaultHTML() {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AI Life Platform - Development</title>
        <style>
            body {
                font-family: 'Inter', sans-serif;
                background: linear-gradient(135deg, #000000 0%, #0a0a14 25%, #12122b 50%, #1a1a2e 75%, #0f0f23 100%);
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
            }
            h1 {
                background: linear-gradient(135deg, #667eea 0%, #a855f7 50%, #00ffd4 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                font-size: 3rem;
                margin-bottom: 20px;
            }
            .status {
                background: rgba(255, 255, 255, 0.1);
                padding: 20px;
                border-radius: 12px;
                margin: 20px 0;
            }
            .feature {
                display: inline-block;
                background: rgba(102, 126, 234, 0.2);
                padding: 8px 16px;
                border-radius: 20px;
                margin: 4px;
                font-size: 14px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>⚛️ AI Life Platform</h1>
            <div class="status">
                <h2>🚀 Development Server Active</h2>
                <p>No main HTML file found. Please add your HTML file to the project root.</p>
                <div>
                    <div class="feature">🔄 Hot Reload</div>
                    <div class="feature">⚛️ Quantum Simulation</div>
                    <div class="feature">🧠💓 Emotional Fusion</div>
                    <div class="feature">📱 Sensor Simulation</div>
                </div>
            </div>
            <p>Server running on <code>http://${DEV_CONFIG.host}:${DEV_CONFIG.port}</code></p>
        </div>
    </body>
    </html>
    `;
  }

  // Simulation methods
  initBiometricData() {
    return {
      heartRate: 72,
      hrv: 45,
      stressLevel: 25,
      bloodOxygen: 98,
      respiratoryRate: 16,
      skinConductance: 0.8,
      bodyTemperature: 98.6,
      timestamp: Date.now()
    };
  }

  initSensorData() {
    return {
      accelerometer: {
        active: false,
        x: 0, y: 0, z: 9.8,
        magnitude: 9.8
      },
      gyroscope: {
        active: false,
        alpha: 0, beta: 0, gamma: 0
      },
      light: {
        active: false,
        level: 450,
        condition: 'Indoor'
      },
      audio: {
        active: false,
        volume: -60,
        frequency: 440,
        activity: 'Quiet'
      },
      proximity: {
        active: false,
        distance: 5
      }
    };
  }

  initQuantumState() {
    return {
      coherence: 87.3,
      optimizationScore: 91.2,
      parallelPathways: 5,
      entanglementStrength: 0.84,
      superpositionActive: true,
      quantumAnnealing: true,
      optimizing: false
    };
  }

  initEmotionalState() {
    return {
      primary: 'focused',
      confidence: 94.7,
      emotions: {
        happy: 65,
        focused: 82,
        calm: 78,
        energetic: 71,
        stressed: 15,
        anxious: 8
      },
      calibrated: true
    };
  }

  updateBiometricSimulation() {
    const variation = () => (Math.random() - 0.5) * 0.1;
    
    this.biometricData.heartRate += Math.round(variation() * 5);
    this.biometricData.heartRate = Math.max(60, Math.min(100, this.biometricData.heartRate));
    
    this.biometricData.hrv += Math.round(variation() * 3);
    this.biometricData.hrv = Math.max(20, Math.min(60, this.biometricData.hrv));
    
    this.biometricData.stressLevel += Math.round(variation() * 2);
    this.biometricData.stressLevel = Math.max(0, Math.min(100, this.biometricData.stressLevel));
    
    this.biometricData.timestamp = Date.now();
  }

  updateSensorSimulation() {
    Object.values(this.sensorData).forEach(sensor => {
      if (!sensor.active) return;
      
      if (sensor.hasOwnProperty('x')) {
        // Accelerometer
        sensor.x = (Math.random() - 0.5) * 2;
        sensor.y = (Math.random() - 0.5) * 2;
        sensor.z = 9.8 + (Math.random() - 0.5) * 0.5;
        sensor.magnitude = Math.sqrt(sensor.x**2 + sensor.y**2 + sensor.z**2);
      }
      
      if (sensor.hasOwnProperty('level')) {
        // Light sensor
        sensor.level = 200 + Math.random() * 600;
        sensor.condition = sensor.level < 100 ? 'Dark' : 
                          sensor.level < 300 ? 'Dim' :
                          sensor.level < 600 ? 'Indoor' : 'Bright';
      }
      
      if (sensor.hasOwnProperty('volume')) {
        // Audio sensor
        sensor.volume = -70 + Math.random() * 40;
        sensor.frequency = 200 + Math.random() * 2000;
        sensor.activity = sensor.volume > -40 ? 'Loud' :
                         sensor.volume > -55 ? 'Moderate' : 'Quiet';
      }
    });
  }

  updateQuantumSimulation() {
    const drift = () => (Math.random() - 0.5) * 0.1;
    
    this.quantumState.coherence += drift();
    this.quantumState.coherence = Math.max(75, Math.min(99.9, this.quantumState.coherence));
    
    this.quantumState.optimizationScore += drift() * 0.5;
    this.quantumState.optimizationScore = Math.max(80, Math.min(100, this.quantumState.optimizationScore));
    
    this.quantumState.entanglementStrength += drift() * 0.05;
    this.quantumState.entanglementStrength = Math.max(0.5, Math.min(1.0, this.quantumState.entanglementStrength));
  }

  updateEmotionalSimulation() {
    const emotions = this.emotionalState.emotions;
    
    Object.keys(emotions).forEach(emotion => {
      const change = (Math.random() - 0.5) * 2;
      emotions[emotion] += change;
      emotions[emotion] = Math.max(0, Math.min(100, emotions[emotion]));
    });
    
    // Determine primary emotion
    const primary = Object.entries(emotions).reduce((a, b) => 
      emotions[a[0]] > emotions[b[0]] ? a : b
    )[0];
    
    this.emotionalState.primary = primary;
    this.emotionalState.confidence = 90 + Math.random() * 8;
  }

  generateBiometricHistory(hours) {
    const history = [];
    const now = Date.now();
    const interval = (hours * 60 * 60 * 1000) / 100; // 100 data points
    
    for (let i = 0; i < 100; i++) {
      const timestamp = now - (hours * 60 * 60 * 1000) + (i * interval);
      history.push({
        timestamp,
        heartRate: 65 + Math.random() * 25,
        hrv: 30 + Math.random() * 30,
        stressLevel: 10 + Math.random() * 40
      });
    }
    
    return history;
  }

  calculateEmotionalCorrelations() {
    return {
      heartRate: 0.73 + Math.random() * 0.15,
      stress: 0.81 + Math.random() * 0.15,
      hrv: 0.67 + Math.random() * 0.15,
      overall: 0.74 + Math.random() * 0.15
    };
  }

  broadcast(event, data) {
    this.io.emit(event, data);
  }

  getRecentLogs() {
    // Mock implementation - in real app, store actual logs
    return [
      { timestamp: Date.now(), level: 'info', message: 'Biometric simulation updated' },
      { timestamp: Date.now() - 1000, level: 'success', message: 'Client connected' },
      { timestamp: Date.now() - 2000, level: 'quantum', message: 'Quantum state synchronized' }
    ];
  }

  getVersion() {
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      return packageJson.version || '1.0.0';
    } catch {
      return '1.0.0';
    }
  }

  async start() {
    const spinner = ora('Starting Quantum-Enhanced Development Server...').start();
    
    try {
      // Ensure directories exist
      await fs.ensureDir(DEV_CONFIG.assetsDir);
      
      this.server.listen(DEV_CONFIG.port, DEV_CONFIG.host, () => {
        spinner.succeed('Development server started');
        
        console.log(chalk.cyan.bold('\n⚛️ AI Life Platform - Development Server\n'));
        console.log(chalk.green('🚀 Server Info:'));
        console.log(`   Local:   http://${DEV_CONFIG.host}:${DEV_CONFIG.port}`);
        console.log(`   Network: http://localhost:${DEV_CONFIG.port}`);
        
        console.log(chalk.blue('\n🔧 Development Features:'));
        console.log(`   Hot Reload: ${DEV_CONFIG.hotReload ? '✅' : '❌'}`);
        console.log(`   Quantum Simulation: ${DEV_CONFIG.quantumSimulation ? '✅' : '❌'}`);
        console.log(`   Biometric Simulation: ${DEV_CONFIG.biometricSimulation ? '✅' : '❌'}`);
        console.log(`   Sensor Simulation: ${DEV_CONFIG.sensorSimulation ? '✅' : '❌'}`);
        
        console.log(chalk.magenta('\n⚛️ API Endpoints:'));
        console.log(`   Health: http://${DEV_CONFIG.host}:${DEV_CONFIG.port}/health`);
        console.log(`   Biometric: http://${DEV_CONFIG.host}:${DEV_CONFIG.port}/api/biometric/current`);
        console.log(`   Quantum: http://${DEV_CONFIG.host}:${DEV_CONFIG.port}/api/quantum/state`);
        console.log(`   Sensors: http://${DEV_CONFIG.host}:${DEV_CONFIG.port}/api/sensors/status`);
        
        console.log(chalk.yellow('\n💡 Pro Tips:'));
        console.log('   • Use window.aiDev in browser console for debugging');
        console.log('   • Files are watched for hot reload');
        console.log('   • Real-time data streams via WebSocket');
        console.log('   • Press Ctrl+C to stop\n');
        
        QuantumLogger.quantum('Quantum-Enhanced Development Server fully operational! 🚀');
      });
      
    } catch (error) {
      spinner.fail(`Failed to start server: ${error.message}`);
      process.exit(1);
    }
  }

  async stop() {
    QuantumLogger.warning('Shutting down development server...');
    
    this.server.close(() => {
      QuantumLogger.success('Development server stopped');
      process.exit(0);
    });
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n');
  QuantumLogger.warning('Received SIGINT, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  QuantumLogger.warning('Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

// CLI Interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const server = new AIDevServer();
  server.start().catch(error => {
    QuantumLogger.error(`Fatal error: ${error.message}`);
    process.exit(1);
  });
}

export default AIDevServer;