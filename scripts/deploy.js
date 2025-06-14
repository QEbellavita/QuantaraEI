#!/usr/bin/env node

/**
 * AI Life Platform - Advanced Deployment Script
 * Handles building, optimization, and deployment of the Quantum-Enhanced AI Platform
 */

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import compression from 'compression';
import express from 'express';
import { minify } from 'html-minifier-terser';
import { optimize } from 'svgo';
import imagemin from 'imagemin';
import imageminWebp from 'imagemin-webp';
import imageminPngquant from 'imagemin-pngquant';
import imageminMozjpeg from 'imagemin-mozjpeg';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configuration
const CONFIG = {
  src: path.join(__dirname, 'src'),
  dist: path.join(__dirname, 'dist'),
  assets: path.join(__dirname, 'src/assets'),
  environments: {
    development: {
      name: 'Development',
      url: 'http://localhost:3000',
      optimize: false
    },
    staging: {
      name: 'Staging',
      url: 'https://staging-ai-platform.netlify.app',
      optimize: true
    },
    production: {
      name: 'Production',
      url: 'https://ai-life-platform.app',
      optimize: true,
      pwa: true
    }
  },
  deployment: {
    netlify: {
      siteName: 'ai-life-platform',
      buildCommand: 'npm run build',
      publishDir: 'dist'
    },
    vercel: {
      projectName: 'ai-life-platform'
    },
    github: {
      repo: 'ai-life-platform',
      branch: 'main'
    }
  }
};

class AILogger {
  static info(message) {
    console.log(chalk.blue('ℹ'), message);
  }
  
  static success(message) {
    console.log(chalk.green('✅'), message);
  }
  
  static warning(message) {
    console.log(chalk.yellow('⚠️'), message);
  }
  
  static error(message) {
    console.log(chalk.red('❌'), message);
  }
  
  static quantum(message) {
    console.log(chalk.magenta('⚛️'), message);
  }
}

class AIDeployer {
  constructor() {
    this.environment = 'production';
    this.target = 'netlify';
    this.startTime = Date.now();
  }

  async init() {
    console.log(chalk.cyan.bold('\n🤖 AI Life Platform - Quantum-Enhanced Deployment\n'));
    
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'environment',
        message: 'Select deployment environment:',
        choices: Object.entries(CONFIG.environments).map(([key, env]) => ({
          name: `${env.name} - ${env.url}`,
          value: key
        }))
      },
      {
        type: 'list',
        name: 'target',
        message: 'Select deployment target:',
        choices: [
          { name: '🌐 Netlify (Recommended)', value: 'netlify' },
          { name: '▲ Vercel', value: 'vercel' },
          { name: '📂 GitHub Pages', value: 'github' },
          { name: '🏠 Local Build Only', value: 'local' }
        ]
      },
      {
        type: 'confirm',
        name: 'optimize',
        message: 'Enable quantum optimization? (AI-powered asset optimization)',
        default: true,
        when: (answers) => CONFIG.environments[answers.environment].optimize
      }
    ]);

    this.environment = answers.environment;
    this.target = answers.target;
    this.optimize = answers.optimize !== false;

    await this.deploy();
  }

  async deploy() {
    try {
      AILogger.quantum('Initializing quantum deployment sequence...');
      
      // Clean and prepare
      await this.clean();
      await this.prepare();
      
      // Build process
      await this.buildHTML();
      await this.processAssets();
      
      if (this.optimize) {
        await this.quantumOptimization();
      }
      
      // PWA features
      if (CONFIG.environments[this.environment].pwa) {
        await this.generatePWA();
      }
      
      // Deploy to target
      if (this.target !== 'local') {
        await this.deployToTarget();
      }
      
      await this.complete();
      
    } catch (error) {
      AILogger.error(`Deployment failed: ${error.message}`);
      process.exit(1);
    }
  }

  async clean() {
    const spinner = ora('🧹 Cleaning previous builds...').start();
    
    try {
      await fs.remove(CONFIG.dist);
      await fs.ensureDir(CONFIG.dist);
      await fs.ensureDir(path.join(CONFIG.dist, 'assets'));
      
      spinner.succeed('Build directory cleaned');
    } catch (error) {
      spinner.fail('Failed to clean build directory');
      throw error;
    }
  }

  async prepare() {
    const spinner = ora('📋 Preparing build environment...').start();
    
    try {
      // Copy source files
      if (await fs.pathExists(CONFIG.src)) {
        await fs.copy(CONFIG.src, CONFIG.dist);
      }
      
      // Copy main HTML file if it exists in root
      const htmlFiles = ['index.html', 'fixed_ai_platform (4).html'];
      for (const file of htmlFiles) {
        if (await fs.pathExists(file)) {
          await fs.copy(file, path.join(CONFIG.dist, 'index.html'));
          break;
        }
      }
      
      spinner.succeed('Environment prepared');
    } catch (error) {
      spinner.fail('Failed to prepare environment');
      throw error;
    }
  }

  async buildHTML() {
    const spinner = ora('🏗️ Building optimized HTML...').start();
    
    try {
      const htmlPath = path.join(CONFIG.dist, 'index.html');
      
      if (!await fs.pathExists(htmlPath)) {
        spinner.fail('No HTML file found');
        throw new Error('index.html not found in dist directory');
      }
      
      let html = await fs.readFile(htmlPath, 'utf8');
      
      // Environment-specific optimizations
      if (this.environment === 'production') {
        html = html.replace(/console\.log\([^)]*\);?/g, ''); // Remove console.logs
        html = html.replace(/\/\*[\s\S]*?\*\//g, ''); // Remove CSS comments
      }
      
      // Inject environment config
      const envConfig = `
        <script>
          window.AI_PLATFORM_CONFIG = {
            environment: '${this.environment}',
            apiUrl: '${CONFIG.environments[this.environment].url}',
            version: '${this.getVersion()}',
            buildTime: '${new Date().toISOString()}',
            quantumOptimized: ${this.optimize}
          };
        </script>
      `;
      
      html = html.replace('</head>', `${envConfig}\n</head>`);
      
      // Minify HTML for production
      if (this.optimize) {
        html = await minify(html, {
          removeComments: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true,
          collapseWhitespace: true,
          minifyCSS: true,
          minifyJS: true
        });
      }
      
      await fs.writeFile(htmlPath, html);
      spinner.succeed('HTML optimized and built');
      
    } catch (error) {
      spinner.fail('HTML build failed');
      throw error;
    }
  }

  async processAssets() {
    const spinner = ora('📦 Processing assets...').start();
    
    try {
      const assetsDir = path.join(CONFIG.dist, 'assets');
      await fs.ensureDir(assetsDir);
      
      // Copy assets if they exist
      if (await fs.pathExists(CONFIG.assets)) {
        await fs.copy(CONFIG.assets, assetsDir);
      }
      
      // Process different asset types
      if (this.optimize) {
        await this.optimizeImages(assetsDir);
        await this.optimizeSVGs(assetsDir);
      }
      
      spinner.succeed('Assets processed');
      
    } catch (error) {
      spinner.fail('Asset processing failed');
      throw error;
    }
  }

  async optimizeImages(assetsDir) {
    const imageDir = path.join(assetsDir, 'images');
    
    if (!await fs.pathExists(imageDir)) {
      return;
    }
    
    const spinner = ora('🖼️ Quantum image optimization...').start();
    
    try {
      await imagemin([`${imageDir}/**/*.{jpg,jpeg,png}`], {
        destination: imageDir,
        plugins: [
          imageminMozjpeg({ quality: 85 }),
          imageminPngquant({ quality: [0.8, 0.9] }),
          imageminWebp({ quality: 85 })
        ]
      });
      
      spinner.succeed('Images quantum-optimized');
    } catch (error) {
      spinner.warn('Image optimization skipped');
    }
  }

  async optimizeSVGs(assetsDir) {
    const svgFiles = await this.findFiles(assetsDir, '.svg');
    
    if (svgFiles.length === 0) return;
    
    const spinner = ora('⚛️ Optimizing SVG files...').start();
    
    try {
      for (const file of svgFiles) {
        const data = await fs.readFile(file, 'utf8');
        const result = optimize(data, {
          path: file,
          plugins: ['preset-default']
        });
        
        if (!result.error) {
          await fs.writeFile(file, result.data);
        }
      }
      
      spinner.succeed(`${svgFiles.length} SVG files optimized`);
    } catch (error) {
      spinner.warn('SVG optimization skipped');
    }
  }

  async quantumOptimization() {
    const spinner = ora('⚛️ Applying quantum optimization algorithms...').start();
    
    try {
      // Simulate quantum optimization with advanced compression
      const files = await this.findFiles(CONFIG.dist, ['.html', '.css', '.js']);
      
      for (const file of files) {
        const stats = await fs.stat(file);
        const originalSize = stats.size;
        
        // Apply quantum compression (simulated with gzip-like optimization)
        let content = await fs.readFile(file, 'utf8');
        
        // Remove unnecessary whitespace and optimize patterns
        content = content
          .replace(/\s+/g, ' ')
          .replace(/;\s*}/g, '}')
          .replace(/\s*{\s*/g, '{')
          .replace(/,\s*/g, ',');
        
        await fs.writeFile(file, content);
        
        const newStats = await fs.stat(file);
        const compression = ((originalSize - newStats.size) / originalSize * 100).toFixed(1);
        
        if (compression > 0) {
          AILogger.info(`  ${path.basename(file)}: ${compression}% reduction`);
        }
      }
      
      spinner.succeed('Quantum optimization complete');
      
    } catch (error) {
      spinner.warn('Quantum optimization partially applied');
    }
  }

  async generatePWA() {
    const spinner = ora('📱 Generating PWA manifest...').start();
    
    try {
      const manifest = {
        name: 'AI Life Platform - Quantum Enhanced',
        short_name: 'AI Life',
        description: 'Quantum-Enhanced AI Life Optimization Platform with Emotional Fusion Engine',
        start_url: '/',
        display: 'standalone',
        background_color: '#000000',
        theme_color: '#667eea',
        icons: [
          {
            src: '/assets/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/assets/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ],
        categories: ['productivity', 'health', 'lifestyle'],
        features: [
          'Quantum AI optimization',
          'Emotional fusion engine',
          'Biometric monitoring',
          'Phone sensors integration'
        ]
      };
      
      await fs.writeFile(
        path.join(CONFIG.dist, 'manifest.json'),
        JSON.stringify(manifest, null, 2)
      );
      
      // Generate service worker
      const serviceWorker = this.generateServiceWorker();
      await fs.writeFile(
        path.join(CONFIG.dist, 'sw.js'),
        serviceWorker
      );
      
      spinner.succeed('PWA features generated');
      
    } catch (error) {
      spinner.fail('PWA generation failed');
      throw error;
    }
  }

  generateServiceWorker() {
    return `
// AI Life Platform - Quantum Service Worker
const CACHE_NAME = 'ai-platform-v${this.getVersion()}';
const QUANTUM_CACHE = 'quantum-cache-v1';

const CORE_FILES = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Quantum-enhanced caching strategy
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CORE_FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME && cacheName !== QUANTUM_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Quantum fetch with AI-powered caching
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  
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
          caches.open(QUANTUM_CACHE)
            .then(cache => cache.put(event.request, responseToCache));
          
          return response;
        });
      })
  );
});
    `.trim();
  }

  async deployToTarget() {
    const spinner = ora(`🚀 Deploying to ${this.target}...`).start();
    
    try {
      switch (this.target) {
        case 'netlify':
          await this.deployToNetlify();
          break;
        case 'vercel':
          await this.deployToVercel();
          break;
        case 'github':
          await this.deployToGitHub();
          break;
        default:
          throw new Error(`Unknown deployment target: ${this.target}`);
      }
      
      spinner.succeed(`Deployed to ${this.target}`);
      
    } catch (error) {
      spinner.fail(`Deployment to ${this.target} failed`);
      throw error;
    }
  }

  async deployToNetlify() {
    try {
      // Check if Netlify CLI is installed
      execSync('netlify --version', { stdio: 'ignore' });
      
      // Deploy to Netlify
      const deployCommand = this.environment === 'production' 
        ? `netlify deploy --prod --dir=${CONFIG.dist}`
        : `netlify deploy --dir=${CONFIG.dist}`;
      
      execSync(deployCommand, { stdio: 'inherit' });
      
    } catch (error) {
      if (error.message.includes('netlify')) {
        AILogger.warning('Netlify CLI not found. Installing...');
        execSync('npm install -g netlify-cli', { stdio: 'inherit' });
        await this.deployToNetlify();
      } else {
        throw error;
      }
    }
  }

  async deployToVercel() {
    try {
      execSync('vercel --version', { stdio: 'ignore' });
      
      const deployCommand = this.environment === 'production'
        ? `vercel --prod`
        : `vercel`;
      
      execSync(deployCommand, { stdio: 'inherit' });
      
    } catch (error) {
      if (error.message.includes('vercel')) {
        AILogger.warning('Vercel CLI not found. Installing...');
        execSync('npm install -g vercel', { stdio: 'inherit' });
        await this.deployToVercel();
      } else {
        throw error;
      }
    }
  }

  async deployToGitHub() {
    try {
      // Create GitHub Pages deployment
      execSync('git add dist/', { stdio: 'inherit' });
      execSync(`git commit -m "Deploy AI Platform v${this.getVersion()}"`, { stdio: 'inherit' });
      execSync('git subtree push --prefix dist origin gh-pages', { stdio: 'inherit' });
      
    } catch (error) {
      AILogger.warning('GitHub deployment requires manual setup of gh-pages branch');
      throw error;
    }
  }

  async complete() {
    const duration = ((Date.now() - this.startTime) / 1000).toFixed(2);
    
    console.log(chalk.green.bold('\n🎉 Quantum Deployment Complete!\n'));
    
    const stats = await this.getBuildStats();
    
    console.log(chalk.cyan('📊 Build Statistics:'));
    console.log(`   Duration: ${duration}s`);
    console.log(`   Environment: ${CONFIG.environments[this.environment].name}`);
    console.log(`   Target: ${this.target}`);
    console.log(`   Files: ${stats.files}`);
    console.log(`   Size: ${stats.size}`);
    console.log(`   Quantum Optimized: ${this.optimize ? 'Yes' : 'No'}\n`);
    
    if (this.target !== 'local') {
      console.log(chalk.yellow('🔗 Deployment URL:'));
      console.log(`   ${CONFIG.environments[this.environment].url}\n`);
    }
    
    AILogger.quantum('AI Life Platform deployment quantum-entangled successfully! ⚛️');
  }

  async getBuildStats() {
    const files = await this.findFiles(CONFIG.dist);
    let totalSize = 0;
    
    for (const file of files) {
      const stats = await fs.stat(file);
      totalSize += stats.size;
    }
    
    return {
      files: files.length,
      size: this.formatBytes(totalSize)
    };
  }

  async findFiles(dir, extensions = []) {
    if (!await fs.pathExists(dir)) return [];
    
    const files = [];
    const items = await fs.readdir(dir, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      
      if (item.isDirectory()) {
        files.push(...await this.findFiles(fullPath, extensions));
      } else if (extensions.length === 0 || extensions.some(ext => item.name.endsWith(ext))) {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getVersion() {
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      return packageJson.version || '1.0.0';
    } catch {
      return '1.0.0';
    }
  }
}

// CLI Interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const deployer = new AIDeployer();
  deployer.init().catch(error => {
    AILogger.error(`Fatal error: ${error.message}`);
    process.exit(1);
  });
}

export default AIDeployer;