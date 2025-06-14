// ====================================
// MAIN APP CONTROLLER
// ====================================

import { NotificationManager } from './notificationManager.js';
import { NavigationManager } from './navigationManager.js';
import { DataManager } from './dataManager.js';
import { UIManager } from './uiManager.js';
import { PhoneSensorsManager } from './phoneSensorsManager.js';
import { EmotionalFusionEngine } from './emotionalFusionEngine.js';
import { AIConversationEngine } from './aiConversationEngine.js';
import { FeatureManager } from './featureManager.js';

export class AILifePlatformApp {
    constructor() {
        this.isInitialized = false;
        this.managers = {};
        
        this.init();
    }

    async init() {
        try {
            console.log('🚀 Initializing Enhanced AI Life Platform...');
            
            // Initialize core managers in dependency order
            await this.initializeManagers();
            
            // Setup cross-manager communication
            this.setupManagerCommunication();
            
            // Setup global event handlers
            this.setupGlobalEventHandlers();
            
            // Start background processes
            this.startBackgroundProcesses();
            
            // Setup app state restoration
            this.restoreAppState();
            
            this.isInitialized = true;
            console.log('✅ Enhanced AI Life Platform initialized successfully');
            
            // Show initialization complete notification
            this.managers.notification.showSuccess('🚀 Enhanced AI Platform with Quantum Intelligence, Emotional Fusion Engine, and Phone Sensors initialized successfully!', 4000);
            
        } catch (error) {
            console.error('❌ Failed to initialize app:', error);
            this.handleInitializationError(error);
        }
    }

    async initializeManagers() {
        // Core infrastructure managers first
        this.managers.notification = new NotificationManager();
        this.managers.data = new DataManager();
        this.managers.ui = new UIManager(this.managers.notification);
        this.managers.navigation = new NavigationManager(this.managers.notification);
        
        // Specialized engines
        this.managers.phoneSensors = new PhoneSensorsManager(this.managers.notification);
        this.managers.fusionEngine = new EmotionalFusionEngine(this.managers.notification);
        
        // AI and conversation
        this.managers.aiConversation = new AIConversationEngine(
            this.managers.notification,
            this.managers.fusionEngine,
            this.managers.phoneSensors
        );
        
        // Feature orchestration
        this.managers.features = new FeatureManager(
            this.managers.notification,
            this.managers.navigation,
            this.managers.aiConversation,
            this.managers.fusionEngine
        );
        
        console.log('📦 All managers initialized');
    }

    setupManagerCommunication() {
        // Data manager events
        this.managers.data.on('biometrics', (data) => {
            this.managers.features.updateBiometricDisplay();
        });

        this.managers.data.on('context', (context) => {
            this.managers.aiConversation.updateContext(context);
        });

        this.managers.data.on('achievementUnlocked', (achievement) => {
            this.managers.notification.showSuccess(`🏆 Achievement Unlocked: ${achievement.name}!`, 5000);
        });

        this.managers.data.on('habitCompleted', (data) => {
            this.managers.notification.showSuccess(`🔥 ${data.habit} streak: ${data.streak} days! (+${Math.round(data.xpBonus * 30)} XP)`, 4000);
        });

        // Fusion engine events
        if (this.managers.fusionEngine.on) {
            this.managers.fusionEngine.on('emotionalStateChange', (state) => {
                this.managers.data.updateEmotions(state.emotions);
            });

            this.managers.fusionEngine.on('biometricUpdate', (biometrics) => {
                this.managers.data.updateBiometrics(biometrics);
            });
        }

        // Phone sensors events
        if (this.managers.phoneSensors.on) {
            this.managers.phoneSensors.on('significantMotion', (data) => {
                if (data.magnitude > 15) {
                    this.managers.notification.show(`📱 High motion detected: ${data.magnitude.toFixed(1)} m/s²`, 'info', 2000);
                }
            });

            this.managers.phoneSensors.on('environmentChange', (data) => {
                this.managers.data.updateContext({ environment: data.condition });
            });
        }

        console.log('🔗 Manager communication setup complete');
    }

    setupGlobalEventHandlers() {
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case '1':
                        e.preventDefault();
                        this.managers.navigation.switchSection('aiCoach');
                        break;
                    case '2':
                        e.preventDefault();
                        this.managers.navigation.switchSection('emotionalFusion');
                        break;
                    case '3':
                        e.preventDefault();
                        this.managers.navigation.switchSection('health');
                        break;
                    case '4':
                        e.preventDefault();
                        this.managers.navigation.switchSection('performance');
                        break;
                    case '5':
                        e.preventDefault();
                        this.managers.navigation.switchSection('growth');
                        break;
                    case '6':
                        e.preventDefault();
                        this.managers.navigation.switchSection('profile');
                        break;
                    case 'l':
                        e.preventDefault();
                        this.managers.navigation.toggleLabs();
                        break;
                    case 's':
                        e.preventDefault();
                        this.managers.navigation.toggleSensorsOverlay();
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
            this.managers.notification.showError('An unexpected error occurred. The app will continue running.', 5000);
        });

        // Responsive design handler
        this.managers.ui.onResize(() => {
            this.handleResize();
        });

        console.log('⌨️ Global event handlers setup complete');
    }

    startBackgroundProcesses() {
        // Context updates every minute
        setInterval(() => {
            this.managers.data.updateTimeContext();
        }, 60000);

        // Auto-save every 30 seconds (handled by DataManager)
        // Periodic health checks every 5 minutes
        setInterval(() => {
            this.performHealthCheck();
        }, 5 * 60 * 1000);

        // Update quantum coherence periodically
        setInterval(() => {
            const coherence = 85 + Math.random() * 10;
            const optimization = 88 + Math.random() * 8;
            this.managers.data.updateContext({ 
                quantumCoherence: coherence,
                optimizationScore: optimization 
            });
        }, 10000);

        console.log('⏰ Background processes started');
    }

    restoreAppState() {
        // Restore last active section
        const lastSection = localStorage.getItem('lastActiveSection');
        if (lastSection) {
            this.managers.navigation.switchSection(lastSection);
        }

        // Restore theme
        const theme = this.managers.ui.getTheme();
        this.managers.ui.setTheme(theme);

        // Restore any active overlays
        const overlayStates = JSON.parse(localStorage.getItem('overlayStates') || '{}');
        if (overlayStates.labs) {
            this.managers.navigation.openLabs();
        }
        if (overlayStates.sensors) {
            this.managers.navigation.openSensorsOverlay();
        }

        console.log('🔄 App state restored');
    }

    // ====================================
    // EVENT HANDLERS
    // ====================================

    handleAppPause() {
        console.log('⏸️ App paused');
        this.managers.data.saveToStorage();
        
        // Pause non-essential background processes
        if (this.managers.phoneSensors?.sensors?.audio?.active) {
            // Don't pause audio analysis as it might be needed
        }
    }

    handleAppResume() {
        console.log('▶️ App resumed');
        this.managers.data.updateTimeContext();
        this.managers.notification.show('👋 Welcome back!', 'info', 2000);
    }

    handleAppShutdown() {
        console.log('🛑 App shutting down');
        
        // Save current state
        localStorage.setItem('lastActiveSection', this.managers.navigation.getCurrentSection());
        localStorage.setItem('overlayStates', JSON.stringify(this.managers.navigation.getOverlayStates()));
        
        // Force save data
        this.managers.data.saveToStorage();
        
        // Stop autosave
        this.managers.data.stopAutosave();
        
        // Clean up media streams
        if (this.managers.fusionEngine) {
            this.managers.fusionEngine.stopFacialEmotion();
            this.managers.fusionEngine.stopVoiceEmotion();
        }
        
        if (this.managers.phoneSensors) {
            this.managers.phoneSensors.stopAudioAnalysis();
        }
    }

    handleResize() {
        // Update charts and visualizations
        this.managers.ui.setupProgressRings();
        
        // Recalculate any dynamic layouts
        if (this.managers.phoneSensors) {
            this.managers.phoneSensors.setupCharts();
        }
    }

    handleInitializationError(error) {
        document.body.innerHTML = `
            <div style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100vh;
                padding: 2rem;
                text-align: center;
                background: linear-gradient(135deg, #000000 0%, #0a0a14 25%, #12122b 50%, #1a1a2e 75%, #0f0f23 100%);
                color: white;
                font-family: 'Inter', sans-serif;
            ">
                <h1 style="font-size: 2rem; margin-bottom: 1rem; color: #ff4757;">⚠️ Initialization Failed</h1>
                <p style="margin-bottom: 2rem; color: #ccc;">The AI Life Platform failed to initialize properly.</p>
                <button onclick="location.reload()" style="
                    background: #667eea;
                    color: white;
                    border: none;
                    padding: 1rem 2rem;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 1rem;
                    font-weight: 600;
                ">🔄 Reload Application</button>
                <details style="margin-top: 2rem; color: #999;">
                    <summary>Technical Details</summary>
                    <pre style="text-align: left; margin-top: 1rem; padding: 1rem; background: rgba(255,255,255,0.1); border-radius: 4px;">${error.stack}</pre>
                </details>
            </div>
        `;
    }

    performHealthCheck() {
        const health = {
            managers: Object.keys(this.managers).length,
            dataIntegrity: this.managers.data ? true : false,
            activeFeatures: this.managers.features ? this.managers.features.getFeatureStatus() : {},
            memoryUsage: performance.memory ? {
                used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
                total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024)
            } : null
        };

        console.log('💊 Health check:', health);

        // Alert if memory usage is high
        if (health.memoryUsage && health.memoryUsage.used > 100) {
            console.warn('⚠️ High memory usage detected');
        }
    }

    // ====================================
    // PUBLIC API METHODS
    // ====================================

    // Navigation shortcuts
    goToSection(section) {
        this.managers.navigation.switchSection(section);
    }

    goToHealthTab(tab) {
        this.managers.navigation.switchSection('health');
        this.managers.navigation.switchHealthTab(tab);
    }

    // Feature shortcuts
    startFocusSession() {
        this.managers.features.startFocusSession();
    }

    startBiometricMonitoring() {
        this.managers.features.startBiometricMonitoring();
    }

    openLabs() {
        this.managers.navigation.openLabs();
    }

    openSensors() {
        this.managers.navigation.openSensorsOverlay();
    }

    // AI interaction
    sendAIMessage(message) {
        this.managers.aiConversation.sendQuickMessage(message);
    }

    // Data access
    exportAllData() {
        return this.managers.data.exportData();
    }

    importData(jsonData) {
        return this.managers.data.importData(jsonData);
    }

    // Sensor control
    toggleAccelerometer() {
        this.managers.phoneSensors.toggleAccelerometer();
    }

    toggleLightSensor() {
        this.managers.phoneSensors.toggleLightSensor();
    }

    toggleAudioAnalysis() {
        this.managers.phoneSensors.toggleAudioAnalysis();
    }

    // Fusion engine control
    startFacialEmotion() {
        this.managers.fusionEngine.startFacialEmotion();
    }

    startVoiceEmotion() {
        this.managers.fusionEngine.startVoiceEmotion();
    }

    // UI control
    showNotification(message, type = 'info', duration = 3000) {
        this.managers.notification.show(message, type, duration);
    }

    updateContext(updates) {
        this.managers.data.updateContext(updates);
    }

    // ====================================
    // GETTERS FOR EXTERNAL ACCESS
    // ====================================

    get notification() { return this.managers.notification; }
    get navigation() { return this.managers.navigation; }
    get data() { return this.managers.data; }
    get ui() { return this.managers.ui; }
    get phoneSensors() { return this.managers.phoneSensors; }
    get fusionEngine() { return this.managers.fusionEngine; }
    get aiConversation() { return this.managers.aiConversation; }
    get features() { return this.managers.features; }

    // Status getters
    get isReady() { return this.isInitialized; }
    
    get status() {
        return {
            initialized: this.isInitialized,
            managers: Object.keys(this.managers).length,
            currentSection: this.managers.navigation?.getCurrentSection(),
            activeFeatures: this.managers.features?.getFeatureStatus(),
            dataStats: {
                biometricHistory: this.managers.data?.biometricData.history.length || 0,
                emotionHistory: this.managers.data?.emotionData.history.length || 0,
                achievements: this.managers.data?.getUnlockedAchievements().length || 0
            }
        };
    }
}

// ====================================
// GLOBAL APP INSTANCE AND FUNCTIONS
// ====================================

let appInstance = null;

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', async function() {
    appInstance = new AILifePlatformApp();
    
    // Make app instance globally available for debugging
    window.aiLifePlatform = appInstance;
    
    // Setup global function mappings for HTML onclick handlers
    setupGlobalFunctions();
});

function setupGlobalFunctions() {
    // Navigation functions
    window.switchSection = (section) => appInstance?.goToSection(section);
    window.switchHealthTab = (tab, event) => appInstance?.managers.navigation.switchHealthTab(tab, event);
    window.switchPerformanceTab = (tab, event) => appInstance?.managers.navigation.switchPerformanceTab(tab, event);
    window.switchGrowthTab = (tab, event) => appInstance?.managers.navigation.switchGrowthTab(tab, event);
    window.switchProfileTab = (tab) => appInstance?.managers.navigation.switchProfileTab(tab);

    // Overlay functions
    window.toggleLabs = () => appInstance?.managers.navigation.toggleLabs();
    window.openLabs = () => appInstance?.managers.navigation.openLabs();
    window.closeLabs = () => appInstance?.managers.navigation.closeLabs();
    window.openLab = (labType) => appInstance?.managers.navigation.openLab(labType);
    
    window.openSensorsOverlay = () => appInstance?.managers.navigation.openSensorsOverlay();
    window.closeSensorsOverlay = () => appInstance?.managers.navigation.closeSensorsOverlay();

    // AI Conversation functions
    window.sendMessage = () => appInstance?.managers.aiConversation.sendMessage();
    window.sendQuickMessage = (message) => appInstance?.managers.aiConversation.sendQuickMessage(message);
    window.toggleVoiceInput = () => appInstance?.managers.aiConversation.toggleVoiceInput();
    window.handleInputKeyDown = (event) => appInstance?.managers.aiConversation.handleInputKeyDown(event);
    window.adjustTextareaHeight = (textarea) => appInstance?.managers.aiConversation.adjustTextareaHeight(textarea);

    // Phone Sensors functions
    window.toggleAccelerometer = () => appInstance?.managers.phoneSensors.toggleAccelerometer();
    window.toggleLightSensor = () => appInstance?.managers.phoneSensors.toggleLightSensor();
    window.toggleAudioAnalysis = () => appInstance?.managers.phoneSensors.toggleAudioAnalysis();

    // Fusion Engine functions
    window.startFacialEmotion = () => appInstance?.managers.fusionEngine.startFacialEmotion();
    window.stopFacialEmotion = () => appInstance?.managers.fusionEngine.stopFacialEmotion();
    window.startVoiceEmotion = () => appInstance?.managers.fusionEngine.startVoiceEmotion();
    window.stopVoiceEmotion = () => appInstance?.managers.fusionEngine.stopVoiceEmotion();
    window.initializeFusion = () => appInstance?.managers.fusionEngine.initializeFusion();
    window.calibrateSensors = () => appInstance?.managers.fusionEngine.calibrateSensors();
    window.startRealTimeFusion = () => appInstance?.managers.fusionEngine.startRealTimeFusion();
    window.exportFusionData = () => appInstance?.managers.fusionEngine.exportFusionData();

    // Feature functions
    window.startFocusSession = () => appInstance?.managers.features.startFocusSession();
    window.startBiometricMonitoring = () => appInstance?.managers.features.startBiometricMonitoring();
    window.startCameraPPGMonitoring = () => appInstance?.managers.features.startCameraPPGMonitoring();
    window.startMorningRitual = () => appInstance?.managers.features.startMorningRitual();
    window.startPersonalizedStack = () => appInstance?.managers.features.startPersonalizedStack();
    window.optimizeEnergyAllocation = () => appInstance?.managers.features.optimizeEnergyAllocation();
    window.optimizeProductivity = () => appInstance?.managers.features.optimizeProductivity();
    window.energyOptimization = () => appInstance?.managers.features.energyOptimization();
    window.obstacleAnticipation = () => appInstance?.managers.features.obstacleAnticipation();
    window.analyzeScreenTime = () => appInstance?.managers.features.analyzeScreenTime();
    window.triggerEveningReflection = () => appInstance?.managers.features.triggerEveningReflection();
    window.adaptToPersonality = () => appInstance?.managers.features.adaptToPersonality();
    window.checkAchievements = () => appInstance?.managers.features.checkAchievements();
    window.viewInterventionStats = () => appInstance?.managers.features.viewInterventionStats();
    window.triggerLearningActivity = () => appInstance?.managers.features.triggerLearningActivity();
    window.runAdvancedAnalysis = () => appInstance?.managers.features.runAdvancedAnalysis();
    
    // Multimodal functions
    window.startVoiceJournal = () => appInstance?.managers.features.startVoiceJournal();
    window.startCameraMood = () => appInstance?.managers.features.startCameraMood();
    window.uploadPhoto = () => appInstance?.managers.features.uploadPhoto();
    window.uploadHealthPhoto = () => appInstance?.managers.features.uploadHealthPhoto();
    window.optimizeWorkout = () => appInstance?.managers.features.optimizeWorkout();

    // Integration functions
    window.toggleIntegration = (name) => appInstance?.managers.features.toggleIntegration(name);
    window.runQuantumIntegrationAnalysis = () => appInstance?.managers.features.runQuantumIntegrationAnalysis();

    // Utility functions
    window.updateElement = (id, content) => appInstance?.managers.ui.updateElement(id, content);
    window.showNotification = (message, type) => appInstance?.managers.notification.show(message, type);

    console.log('🌐 Global functions mapped to window');
}

// Export for module systems
export { AILifePlatformApp };