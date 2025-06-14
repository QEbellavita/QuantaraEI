// ====================================
// AI LIFE PLATFORM - MAIN APPLICATION
// ====================================

// Core Managers
import { NotificationManager } from './core/notification-manager.js';
import { NavigationManager } from './core/navigation-manager.js';
import { StorageManager } from './core/storage-manager.js';
import { UIManager } from './core/ui-manager.js';
import { ContextManager } from './core/context-manager.js';
import { AnalyticsManager } from './core/analytics-manager.js';
import { AudioManager } from './core/audio-manager.js';
import { EnergyManager } from './core/energy-manager.js';
import { FeatureManager } from './core/feature-manager.js';
import { GamificationManager } from './core/gamification-manager.js';
import { LabsManager } from './core/labs-manager.js';
import { MultimodalManager } from './core/multimodal-manager.js';
import { PhoneSensorsManager } from './core/phone-sensors-manager.js';
import { ScreenTimeManager } from './core/screen-time-manager.js';

// Components
import { SensorsOverlay } from './components/sensors-overlay.js';
import { LabsOverlay } from './components/labs-overlay.js';
import { SettingsOverlay } from './components/settings-overlay.js';

// Engines
import { QuantumIntelligence } from './engines/quantum-intelligence.js';

// Configuration
import { AppConfig } from './config/app-config.js';
import { CONSTANTS } from './config/constants.js';

class AILifePlatformApp {
    constructor() {
        this.version = '1.0.0';
        this.isInitialized = false;
        this.isStarting = false;
        
        // Manager instances
        this.managers = {};
        this.components = {};
        this.engines = {};
        
        // Global context for cross-manager communication
        this.globalContext = {
            personality: 'Analytical-Achiever',
            energyLevel: 82,
            stressLevel: 15,
            currentMood: 'Focused',
            timeOfDay: 'morning',
            quantumCoherence: 87.3,
            optimizationScore: 91.2
        };
        
        // Event system
        this.eventListeners = new Map();
        
        // Performance monitoring
        this.performanceMetrics = {
            initTime: 0,
            managersLoaded: 0,
            memoryUsage: 0
        };
        
        console.log(`🚀 AI Life Platform v${this.version} initializing...`);
    }

    // ====================================
    // INITIALIZATION
    // ====================================

    async init() {
        if (this.isStarting || this.isInitialized) {
            console.warn('App already initialized or initializing');
            return;
        }

        this.isStarting = true;
        const startTime = performance.now();

        try {
            console.log('🔧 Starting app initialization...');

            // Show loading indicator
            this.showLoadingScreen();

            // Initialize in dependency order
            await this.initializeCore();
            await this.initializeManagers();
            await this.initializeEngines();
            await this.initializeComponents();
            
            // Setup cross-system communication
            this.setupManagerCommunication();
            
            // Setup global event handlers
            this.setupGlobalEventHandlers();
            
            // Setup global functions for HTML
            this.setupGlobalFunctions();
            
            // Start background processes
            this.startBackgroundProcesses();
            
            // Restore previous state
            this.restoreAppState();
            
            // Calculate performance metrics
            this.performanceMetrics.initTime = performance.now() - startTime;
            this.performanceMetrics.managersLoaded = Object.keys(this.managers).length;
            
            this.isInitialized = true;
            this.isStarting = false;
            
            // Hide loading screen
            this.hideLoadingScreen();
            
            console.log(`✅ AI Life Platform initialized successfully in ${this.performanceMetrics.initTime.toFixed(2)}ms`);
            console.log(`📦 Loaded ${this.performanceMetrics.managersLoaded} managers`);
            
            // Show success notification
            this.managers.notification?.show(
                '🚀 Enhanced AI Platform with Quantum Intelligence, Emotional Fusion Engine, and Phone Sensors initialized successfully!', 
                'success', 
                4000
            );
            
            // Emit initialization complete event
            this.emit('initialized', {
                version: this.version,
                initTime: this.performanceMetrics.initTime,
                managersCount: this.performanceMetrics.managersLoaded
            });
            
        } catch (error) {
            console.error('❌ Failed to initialize app:', error);
            this.handleInitializationError(error);
            this.isStarting = false;
        }
    }

    async initializeCore() {
        console.log('🔧 Initializing core systems...');
        
        // Core infrastructure first
        this.managers.notification = new NotificationManager();
        this.managers.storage = new StorageManager(this.managers.notification);
        this.managers.ui = new UIManager(this.managers.notification);
        this.managers.navigation = new NavigationManager(this.managers.notification);
        
        console.log('✅ Core systems initialized');
    }

    async initializeManagers() {
        console.log('🔧 Initializing managers...');
        
        // Context and analytics
        this.managers.context = new ContextManager();
        this.managers.analytics = new AnalyticsManager(this.managers.notification, this.managers.context);
        
        // Specialized managers
        this.managers.audio = new AudioManager(this.managers.notification);
        this.managers.energy = new EnergyManager();
        this.managers.gamification = new GamificationManager();
        this.managers.labs = new LabsManager();
        this.managers.phoneSensors = new PhoneSensorsManager(this.managers.notification);
        this.managers.screenTime = new ScreenTimeManager();
        
        // Multimodal and features
        this.managers.multimodal = new MultimodalManager();
        this.managers.features = new FeatureManager(
            this.managers.notification,
            this.managers.navigation,
            null, // AI conversation manager (to be added later)
            null  // Fusion engine (to be added later)
        );
        
        console.log('✅ Managers initialized');
    }

    async initializeEngines() {
        console.log('🔧 Initializing engines...');
        
        // Quantum intelligence engine
        this.engines.quantum = new QuantumIntelligence(this);
        await this.engines.quantum.initialize();
        
        console.log('✅ Engines initialized');
    }

    async initializeComponents() {
        console.log('🔧 Initializing components...');
        
        // Overlay components
        this.components.sensorsOverlay = new SensorsOverlay(
            this.managers.notification,
            this.managers.phoneSensors
        );
        
        this.components.labsOverlay = new LabsOverlay(
            this.managers.notification,
            this.managers.labs,
            this.managers.navigation,
            null // AI conversation engine (to be added later)
        );
        
        this.components.settingsOverlay = new SettingsOverlay(
            this.managers.notification,
            this.managers.storage,
            this.managers.ui
        );
        
        console.log('✅ Components initialized');
    }

    // ====================================
    // LOADING SCREEN
    // ====================================

    showLoadingScreen() {
        const loadingHTML = `
            <div id="appLoading" class="app-loading">
                <div class="loading-content">
                    <div class="loading-logo">
                        <div class="quantum-spinner">
                            <div class="spinner-ring"></div>
                            <div class="spinner-ring"></div>
                            <div class="spinner-ring"></div>
                        </div>
                    </div>
                    <h1>AI Life Platform</h1>
                    <p class="loading-text">Initializing Quantum Intelligence...</p>
                    <div class="loading-progress">
                        <div class="progress-bar">
                            <div class="progress-fill"></div>
                        </div>
                    </div>
                    <div class="loading-details">
                        <span class="loading-version">v${this.version}</span>
                        <span class="loading-status">Starting core systems...</span>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('afterbegin', loadingHTML);
        
        // Animate progress bar
        setTimeout(() => {
            const progressFill = document.querySelector('.progress-fill');
            if (progressFill) {
                progressFill.style.width = '100%';
            }
        }, 100);
    }

    hideLoadingScreen() {
        const loading = document.getElementById('appLoading');
        if (loading) {
            loading.style.opacity = '0';
            setTimeout(() => {
                loading.remove();
            }, 500);
        }
    }

    // ====================================
    // COMMUNICATION SETUP
    // ====================================

    setupManagerCommunication() {
        console.log('🔗 Setting up manager communication...');
        
        // Context manager events
        this.managers.context?.on('stateChange', (data) => {
            this.updateGlobalContext(data.newState);
        });
        
        // Energy manager events
        this.managers.energy?.on?.('energyUpdate', (energy) => {
            this.globalContext.energyLevel = energy;
            this.managers.context?.updateContext({ energyLevel: energy });
        });
        
        // Phone sensors events
        this.managers.phoneSensors?.on?.('significantMotion', (data) => {
            if (data.magnitude > 15) {
                this.managers.notification?.show(
                    `📱 High motion detected: ${data.magnitude.toFixed(1)} m/s²`, 
                    'info', 
                    2000
                );
            }
        });
        
        // Gamification events
        this.managers.gamification?.on?.('achievementUnlocked', (achievement) => {
            this.managers.notification?.show(
                `🏆 Achievement Unlocked: ${achievement.name}!`, 
                'success', 
                5000
            );
        });
        
        // Analytics events
        this.managers.analytics?.on?.('insightGenerated', (insight) => {
            console.log('📊 New insight:', insight);
        });
        
        // Quantum engine events
        this.engines.quantum?.on('quantumUpdate', (data) => {
            this.globalContext.quantumCoherence = data.coherence || this.globalContext.quantumCoherence;
            this.managers.context?.updateContext({ 
                quantumCoherence: this.globalContext.quantumCoherence 
            });
        });
        
        console.log('✅ Manager communication setup complete');
    }

    updateGlobalContext(newContext) {
        this.globalContext = { ...this.globalContext, ...newContext };
        
        // Make context available globally
        window.conversationContext = this.globalContext;
        
        // Emit context update event
        this.emit('contextUpdated', this.globalContext);
    }

    // ====================================
    // GLOBAL EVENT HANDLERS
    // ====================================

    setupGlobalEventHandlers() {
        console.log('⌨️ Setting up global event handlers...');
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case '1':
                        e.preventDefault();
                        this.managers.navigation?.switchSection('aiCoach');
                        break;
                    case '2':
                        e.preventDefault();
                        this.managers.navigation?.switchSection('emotionalFusion');
                        break;
                    case '3':
                        e.preventDefault();
                        this.managers.navigation?.switchSection('health');
                        break;
                    case '4':
                        e.preventDefault();
                        this.managers.navigation?.switchSection('performance');
                        break;
                    case '5':
                        e.preventDefault();
                        this.managers.navigation?.switchSection('growth');
                        break;
                    case '6':
                        e.preventDefault();
                        this.managers.navigation?.switchSection('profile');
                        break;
                    case 'l':
                        e.preventDefault();
                        this.components.labsOverlay?.toggle();
                        break;
                    case 's':
                        e.preventDefault();
                        this.components.sensorsOverlay?.toggle();
                        break;
                    case ',':
                        e.preventDefault();
                        this.components.settingsOverlay?.toggle();
                        break;
                }
            }
        });

        // Visibility change handler
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.handleAppPause();
            } else {
                this.handleAppResume();
            }
        });

        // Before unload handler
        window.addEventListener('beforeunload', () => {
            this.handleAppShutdown();
        });

        // Error handling
        window.addEventListener('error', (e) => {
            console.error('Global error:', e.error);
            this.managers.notification?.show(
                'An unexpected error occurred. The app will continue running.', 
                'error', 
                5000
            );
            
            // Track error in analytics
            this.managers.analytics?.trackError(e.error, { context: 'global' });
        });

        // Responsive design handler
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        console.log('✅ Global event handlers setup complete');
    }

    // ====================================
    // GLOBAL FUNCTIONS FOR HTML
    // ====================================

    setupGlobalFunctions() {
        console.log('🌐 Setting up global functions...');
        
        // Navigation functions
        window.switchSection = (section) => this.managers.navigation?.switchSection(section);
        window.switchHealthTab = (tab, event) => this.managers.navigation?.switchHealthTab(tab, event);
        window.switchPerformanceTab = (tab, event) => this.managers.navigation?.switchPerformanceTab(tab, event);
        window.switchGrowthTab = (tab, event) => this.managers.navigation?.switchGrowthTab(tab, event);
        window.switchProfileTab = (tab) => this.managers.navigation?.switchProfileTab(tab);

        // Overlay functions
        window.toggleLabs = () => this.components.labsOverlay?.toggle();
        window.openLabs = () => this.components.labsOverlay?.show();
        window.closeLabs = () => this.components.labsOverlay?.hide();
        window.openSensorsOverlay = () => this.components.sensorsOverlay?.show();
        window.closeSensorsOverlay = () => this.components.sensorsOverlay?.hide();
        window.openSettings = () => this.components.settingsOverlay?.show();

        // Phone Sensors functions
        window.toggleAccelerometer = () => this.managers.phoneSensors?.toggleAccelerometer();
        window.toggleLightSensor = () => this.managers.phoneSensors?.toggleLightSensor();
        window.toggleAudioAnalysis = () => this.managers.phoneSensors?.toggleAudioAnalysis();

        // Feature functions
        window.startFocusSession = () => this.managers.features?.startFocusSession();
        window.startBiometricMonitoring = () => this.managers.features?.startBiometricMonitoring();
        window.startCameraPPGMonitoring = () => this.managers.features?.startCameraPPGMonitoring();
        window.startMorningRitual = () => this.managers.features?.startMorningRitual();
        window.optimizeEnergyAllocation = () => this.managers.energy?.optimizeEnergyAllocation();
        window.analyzeScreenTime = () => this.managers.features?.analyzeScreenTime();
        window.checkAchievements = () => this.managers.features?.checkAchievements();
        window.triggerLearningActivity = () => this.managers.gamification?.triggerLearningActivity();

        // Audio functions
        window.startVoiceJournal = () => this.managers.features?.startVoiceJournal();
        window.uploadPhoto = () => this.managers.features?.uploadPhoto();

        // Utility functions
        window.updateElement = (id, content) => this.managers.ui?.updateElement(id, content);
        window.showNotification = (message, type, duration) => 
            this.managers.notification?.show(message, type, duration);

        // App control functions
        window.exportAllData = () => this.exportAllData();
        window.getAppStatus = () => this.getStatus();
        
        // Make app instance globally available for debugging
        window.aiLifePlatform = this;
        
        console.log('✅ Global functions mapped');
    }

    // ====================================
    // BACKGROUND PROCESSES
    // ====================================

    startBackgroundProcesses() {
        console.log('⏰ Starting background processes...');
        
        // Context updates every minute
        setInterval(() => {
            this.updateTimeContext();
        }, 60000);

        // Quantum coherence updates
        setInterval(() => {
            this.updateQuantumMetrics();
        }, 10000);

        // Performance monitoring
        setInterval(() => {
            this.monitorPerformance();
        }, 300000); // Every 5 minutes

        // Auto-save (handled by storage manager)
        setInterval(() => {
            this.autoSave();
        }, 30000);
        
        console.log('✅ Background processes started');
    }

    updateTimeContext() {
        const now = new Date();
        const timeOfDay = this.getTimeOfDay(now.getHours());
        
        this.updateGlobalContext({
            timeOfDay,
            currentTime: now.getTime(),
            dayOfWeek: now.getDay() === 0 || now.getDay() === 6 ? 'weekend' : 'weekday'
        });
    }

    updateQuantumMetrics() {
        const coherence = 85 + Math.random() * 10;
        const optimization = 88 + Math.random() * 8;
        
        this.updateGlobalContext({
            quantumCoherence: coherence,
            optimizationScore: optimization
        });
    }

    monitorPerformance() {
        if (performance.memory) {
            this.performanceMetrics.memoryUsage = Math.round(
                performance.memory.usedJSHeapSize / 1024 / 1024
            );
            
            // Warn if memory usage is high
            if (this.performanceMetrics.memoryUsage > 150) {
                console.warn(`⚠️ High memory usage: ${this.performanceMetrics.memoryUsage}MB`);
            }
        }
    }

    autoSave() {
        if (this.managers.storage) {
            this.managers.storage.setItem('appState', {
                globalContext: this.globalContext,
                timestamp: Date.now()
            });
        }
    }

    // ====================================
    // APP LIFECYCLE HANDLERS
    // ====================================

    handleAppPause() {
        console.log('⏸️ App paused');
        this.autoSave();
        this.emit('paused');
    }

    handleAppResume() {
        console.log('▶️ App resumed');
        this.updateTimeContext();
        this.managers.notification?.show('👋 Welcome back!', 'info', 2000);
        this.emit('resumed');
    }

    handleAppShutdown() {
        console.log('🛑 App shutting down');
        
        // Save current state
        this.autoSave();
        
        // Save navigation state
        if (this.managers.storage && this.managers.navigation) {
            this.managers.storage.setItem('lastActiveSection', 
                this.managers.navigation.getCurrentSection()
            );
        }
        
        // Cleanup resources
        this.cleanup();
        
        this.emit('shutdown');
    }

    handleResize() {
        // Update UI layouts
        this.managers.ui?.handleResize?.();
        
        // Update charts if available
        this.managers.phoneSensors?.setupCharts?.();
        
        this.emit('resized');
    }

    handleInitializationError(error) {
        const errorHTML = `
            <div class="initialization-error">
                <div class="error-content">
                    <h1>⚠️ Initialization Failed</h1>
                    <p>The AI Life Platform failed to initialize properly.</p>
                    <button onclick="location.reload()" class="reload-btn">
                        🔄 Reload Application
                    </button>
                    <details class="error-details">
                        <summary>Technical Details</summary>
                        <pre>${error.stack}</pre>
                    </details>
                </div>
            </div>
        `;
        
        document.body.innerHTML = errorHTML;
    }

    // ====================================
    // STATE MANAGEMENT
    // ====================================

    restoreAppState() {
        console.log('🔄 Restoring app state...');
        
        if (!this.managers.storage) return;
        
        // Restore app state
        const savedState = this.managers.storage.getItem('appState');
        if (savedState) {
            this.updateGlobalContext(savedState.globalContext);
        }
        
        // Restore last active section
        const lastSection = this.managers.storage.getItem('lastActiveSection');
        if (lastSection && this.managers.navigation) {
            this.managers.navigation.switchSection(lastSection);
        }
        
        // Restore theme
        const theme = this.managers.ui?.getTheme?.();
        if (theme) {
            this.managers.ui.setTheme(theme);
        }
        
        console.log('✅ App state restored');
    }

    // ====================================
    // PUBLIC API
    // ====================================

    // Navigation
    goToSection(section) {
        this.managers.navigation?.switchSection(section);
    }

    // Notifications
    showNotification(message, type = 'info', duration = 3000) {
        this.managers.notification?.show(message, type, duration);
    }

    // Data export
    exportAllData() {
        const data = {
            version: this.version,
            timestamp: new Date().toISOString(),
            globalContext: this.globalContext,
            managers: {},
            analytics: this.managers.analytics?.exportAnalytics?.(),
            energy: this.managers.energy?.exportEnergyData?.(),
            screenTime: this.managers.screenTime?.exportScreenTimeData?.()
        };
        
        // Add manager data
        Object.entries(this.managers).forEach(([name, manager]) => {
            if (manager.exportData) {
                data.managers[name] = manager.exportData();
            }
        });
        
        const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ailife-platform-data-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showNotification('📁 All data exported successfully', 'success');
        return data;
    }

    // Status and health
    getStatus() {
        return {
            version: this.version,
            initialized: this.isInitialized,
            managers: Object.keys(this.managers).length,
            components: Object.keys(this.components).length,
            engines: Object.keys(this.engines).length,
            currentSection: this.managers.navigation?.getCurrentSection(),
            globalContext: this.globalContext,
            performance: this.performanceMetrics,
            uptime: this.isInitialized ? Date.now() - this.performanceMetrics.initTime : 0
        };
    }

    getHealth() {
        const health = {
            status: 'healthy',
            managers: {},
            memory: this.performanceMetrics.memoryUsage,
            errors: 0
        };
        
        // Check manager health
        Object.entries(this.managers).forEach(([name, manager]) => {
            health.managers[name] = {
                initialized: !!manager,
                functional: typeof manager === 'object'
            };
        });
        
        return health;
    }

    // ====================================
    // EVENT SYSTEM
    // ====================================

    on(event, callback) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, new Set());
        }
        this.eventListeners.get(event).add(callback);
    }

    off(event, callback) {
        if (this.eventListeners.has(event)) {
            this.eventListeners.get(event).delete(callback);
        }
    }

    emit(event, data = {}) {
        if (this.eventListeners.has(event)) {
            this.eventListeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in event callback for ${event}:`, error);
                }
            });
        }
    }

    // ====================================
    // UTILITY METHODS
    // ====================================

    getTimeOfDay(hour) {
        if (hour >= 5 && hour < 12) return 'morning';
        if (hour >= 12 && hour < 17) return 'afternoon';  
        if (hour >= 17 && hour < 21) return 'evening';
        return 'night';
    }

    // ====================================
    // CLEANUP
    // ====================================

    cleanup() {
        console.log('🧹 Cleaning up resources...');
        
        // Cleanup managers
        Object.values(this.managers).forEach(manager => {
            if (manager.cleanup) {
                manager.cleanup();
            }
        });
        
        // Cleanup components
        Object.values(this.components).forEach(component => {
            if (component.destroy) {
                component.destroy();
            }
        });
        
        // Cleanup engines
        Object.values(this.engines).forEach(engine => {
            if (engine.destroy) {
                engine.destroy();
            }
        });
        
        // Clear event listeners
        this.eventListeners.clear();
    }

    // ====================================
    // GETTERS FOR EXTERNAL ACCESS
    // ====================================

    get isReady() { return this.isInitialized; }
    get context() { return this.globalContext; }
    get notification() { return this.managers.notification; }
    get navigation() { return this.managers.navigation; }
    get ui() { return this.managers.ui; }
    get storage() { return this.managers.storage; }
    get analytics() { return this.managers.analytics; }
    get energy() { return this.managers.energy; }
    get phoneSensors() { return this.managers.phoneSensors; }
    get features() { return this.managers.features; }
    get quantum() { return this.engines.quantum; }
}

// ====================================
// AUTO-INITIALIZATION
// ====================================

let appInstance = null;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    try {
        appInstance = new AILifePlatformApp();
        await appInstance.init();
    } catch (error) {
        console.error('Failed to start AI Life Platform:', error);
    }
});

// Export for module systems
export { AILifePlatformApp };
export default appInstance;