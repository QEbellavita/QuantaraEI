// ====================================
// SETTINGS OVERLAY COMPONENT
// ====================================

export class SettingsOverlay {
    constructor(notificationManager, storageManager, uiManager) {
        this.notificationManager = notificationManager;
        this.storageManager = storageManager;
        this.uiManager = uiManager;
        
        this.isVisible = false;
        this.activeCategory = 'general';
        this.pendingChanges = new Map();
        this.originalSettings = {};
        
        this.settings = {
            general: {
                theme: 'quantum-dark',
                language: 'en',
                animations: true,
                hapticFeedback: true,
                autoSave: true,
                autoSaveInterval: 30
            },
            notifications: {
                enabled: true,
                showQuantum: true,
                showProgress: true,
                showErrors: true,
                duration: 3000,
                position: 'top-right',
                sound: false
            },
            features: {
                quantumIntelligence: true,
                emotionalFusion: true,
                phoneSensors: true,
                biometricMonitoring: true,
                voiceInput: true,
                cameraAnalysis: true,
                labsInterface: true,
                advancedAnalytics: true
            },
            privacy: {
                dataRetention: 30,
                anonymizeData: true,
                encryptStorage: true,
                shareAnalytics: false,
                cloudSync: false,
                biometricConsent: true,
                voiceDataConsent: true,
                cameraDataConsent: true
            },
            performance: {
                maxConcurrentOperations: 5,
                cacheSize: 50,
                offlineMode: true,
                backgroundSync: true,
                lowPowerMode: false,
                reducedAnimations: false,
                dataCompression: true
            },
            integrations: {
                calendar: false,
                email: false,
                biometric: true,
                smarthome: false,
                financial: false,
                wearables: false
            },
            advanced: {
                debugMode: false,
                verboseLogging: false,
                experimentalFeatures: false,
                quantumOptimization: true,
                neuralEnhancement: true,
                fusionSensitivity: 0.7
            }
        };
        
        this.init();
    }

    init() {
        this.loadSettings();
        this.setupOverlay();
        this.setupEventListeners();
        console.log('⚙️ Settings Overlay initialized');
    }

    // ====================================
    // OVERLAY MANAGEMENT
    // ====================================

    show() {
        const overlay = document.getElementById('settingsOverlay');
        if (overlay) {
            overlay.classList.add('active');
            this.isVisible = true;
            this.storeOriginalSettings();
            this.refreshSettingsDisplay();
            this.notificationManager?.show('⚙️ Settings panel opened', 'info');
        }
    }

    hide() {
        const overlay = document.getElementById('settingsOverlay');
        if (overlay) {
            overlay.classList.remove('active');
            this.isVisible = false;
            this.checkForUnsavedChanges();
        }
    }

    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }

    // ====================================
    // OVERLAY SETUP
    // ====================================

    setupOverlay() {
        // Check if overlay already exists
        if (document.getElementById('settingsOverlay')) return;

        const overlayHTML = this.createOverlayHTML();
        document.body.insertAdjacentHTML('beforeend', overlayHTML);
        
        // Initialize with general settings
        this.switchCategory('general');
    }

    createOverlayHTML() {
        return `
            <div id="settingsOverlay" class="settings-overlay">
                <div class="overlay-content">
                    ${this.createHeader()}
                    ${this.createCategoryNav()}
                    ${this.createSettingsContent()}
                    ${this.createActionButtons()}
                </div>
            </div>
        `;
    }

    createHeader() {
        return `
            <div class="overlay-header">
                <div class="header-content">
                    <h2>⚙️ Settings & Preferences</h2>
                    <p>Customize your AI Life Platform experience</p>
                </div>
                <button class="close-btn" onclick="settingsOverlay.hide()">×</button>
            </div>
        `;
    }

    createCategoryNav() {
        const categories = [
            { id: 'general', name: 'General', icon: '⚙️' },
            { id: 'notifications', name: 'Notifications', icon: '🔔' },
            { id: 'features', name: 'Features', icon: '🎛️' },
            { id: 'privacy', name: 'Privacy', icon: '🔒' },
            { id: 'performance', name: 'Performance', icon: '⚡' },
            { id: 'integrations', name: 'Integrations', icon: '🔗' },
            { id: 'advanced', name: 'Advanced', icon: '🔬' }
        ];

        return `
            <div class="category-nav">
                ${categories.map(cat => `
                    <button class="category-btn ${cat.id === 'general' ? 'active' : ''}" 
                            data-category="${cat.id}" 
                            onclick="settingsOverlay.switchCategory('${cat.id}')">
                        <span class="category-icon">${cat.icon}</span>
                        <span class="category-name">${cat.name}</span>
                    </button>
                `).join('')}
            </div>
        `;
    }

    createSettingsContent() {
        return `
            <div class="settings-content">
                <div id="settingsPanel" class="settings-panel">
                    ${this.renderSettingsForCategory('general')}
                </div>
            </div>
        `;
    }

    createActionButtons() {
        return `
            <div class="action-buttons">
                <button class="btn secondary" onclick="settingsOverlay.resetToDefaults()">
                    🔄 Reset to Defaults
                </button>
                <button class="btn secondary" onclick="settingsOverlay.exportSettings()">
                    📁 Export Settings
                </button>
                <button class="btn secondary" onclick="settingsOverlay.importSettings()">
                    📂 Import Settings
                </button>
                <div class="primary-actions">
                    <button class="btn secondary" onclick="settingsOverlay.cancelChanges()">
                        Cancel
                    </button>
                    <button class="btn primary" onclick="settingsOverlay.saveSettings()">
                        💾 Save Changes
                    </button>
                </div>
            </div>
        `;
    }

    renderSettingsForCategory(category) {
        const settings = this.settings[category];
        if (!settings) return '<p>Category not found</p>';

        switch (category) {
            case 'general':
                return this.renderGeneralSettings(settings);
            case 'notifications':
                return this.renderNotificationSettings(settings);
            case 'features':
                return this.renderFeatureSettings(settings);
            case 'privacy':
                return this.renderPrivacySettings(settings);
            case 'performance':
                return this.renderPerformanceSettings(settings);
            case 'integrations':
                return this.renderIntegrationSettings(settings);
            case 'advanced':
                return this.renderAdvancedSettings(settings);
            default:
                return '<p>Unknown category</p>';
        }
    }

    renderGeneralSettings(settings) {
        return `
            <div class="settings-group">
                <h3>🎨 Appearance</h3>
                
                <div class="setting-item">
                    <label for="theme">Theme</label>
                    <select id="theme" data-setting="general.theme">
                        <option value="quantum-dark" ${settings.theme === 'quantum-dark' ? 'selected' : ''}>Quantum Dark</option>
                        <option value="quantum-light" ${settings.theme === 'quantum-light' ? 'selected' : ''}>Quantum Light</option>
                        <option value="neuron-blue" ${settings.theme === 'neuron-blue' ? 'selected' : ''}>Neuron Blue</option>
                        <option value="fusion-purple" ${settings.theme === 'fusion-purple' ? 'selected' : ''}>Fusion Purple</option>
                    </select>
                </div>

                <div class="setting-item">
                    <label for="language">Language</label>
                    <select id="language" data-setting="general.language">
                        <option value="en" ${settings.language === 'en' ? 'selected' : ''}>English</option>
                        <option value="es" ${settings.language === 'es' ? 'selected' : ''}>Español</option>
                        <option value="fr" ${settings.language === 'fr' ? 'selected' : ''}>Français</option>
                        <option value="de" ${settings.language === 'de' ? 'selected' : ''}>Deutsch</option>
                    </select>
                </div>
            </div>

            <div class="settings-group">
                <h3>✨ Interface</h3>
                
                <div class="setting-item">
                    <div class="setting-toggle">
                        <input type="checkbox" id="animations" data-setting="general.animations" ${settings.animations ? 'checked' : ''}>
                        <label for="animations">Enable Animations</label>
                    </div>
                    <p class="setting-description">Smooth transitions and visual effects</p>
                </div>

                <div class="setting-item">
                    <div class="setting-toggle">
                        <input type="checkbox" id="hapticFeedback" data-setting="general.hapticFeedback" ${settings.hapticFeedback ? 'checked' : ''}>
                        <label for="hapticFeedback">Haptic Feedback</label>
                    </div>
                    <p class="setting-description">Vibration feedback on interactions</p>
                </div>
            </div>

            <div class="settings-group">
                <h3>💾 Data</h3>
                
                <div class="setting-item">
                    <div class="setting-toggle">
                        <input type="checkbox" id="autoSave" data-setting="general.autoSave" ${settings.autoSave ? 'checked' : ''}>
                        <label for="autoSave">Auto Save</label>
                    </div>
                    <p class="setting-description">Automatically save your data</p>
                </div>

                <div class="setting-item">
                    <label for="autoSaveInterval">Auto Save Interval (seconds)</label>
                    <input type="range" id="autoSaveInterval" min="10" max="300" step="10" 
                           value="${settings.autoSaveInterval}" data-setting="general.autoSaveInterval">
                    <span class="range-value">${settings.autoSaveInterval}s</span>
                </div>
            </div>
        `;
    }

    renderNotificationSettings(settings) {
        return `
            <div class="settings-group">
                <h3>🔔 General Notifications</h3>
                
                <div class="setting-item">
                    <div class="setting-toggle">
                        <input type="checkbox" id="notificationsEnabled" data-setting="notifications.enabled" ${settings.enabled ? 'checked' : ''}>
                        <label for="notificationsEnabled">Enable Notifications</label>
                    </div>
                    <p class="setting-description">Show system notifications</p>
                </div>

                <div class="setting-item">
                    <label for="notificationDuration">Duration (milliseconds)</label>
                    <input type="range" id="notificationDuration" min="1000" max="10000" step="500" 
                           value="${settings.duration}" data-setting="notifications.duration">
                    <span class="range-value">${settings.duration}ms</span>
                </div>

                <div class="setting-item">
                    <label for="notificationPosition">Position</label>
                    <select id="notificationPosition" data-setting="notifications.position">
                        <option value="top-right" ${settings.position === 'top-right' ? 'selected' : ''}>Top Right</option>
                        <option value="top-left" ${settings.position === 'top-left' ? 'selected' : ''}>Top Left</option>
                        <option value="bottom-right" ${settings.position === 'bottom-right' ? 'selected' : ''}>Bottom Right</option>
                        <option value="bottom-left" ${settings.position === 'bottom-left' ? 'selected' : ''}>Bottom Left</option>
                    </select>
                </div>
            </div>

            <div class="settings-group">
                <h3>🎯 Notification Types</h3>
                
                <div class="setting-item">
                    <div class="setting-toggle">
                        <input type="checkbox" id="showQuantum" data-setting="notifications.showQuantum" ${settings.showQuantum ? 'checked' : ''}>
                        <label for="showQuantum">Quantum Notifications</label>
                    </div>
                    <p class="setting-description">Quantum processing updates</p>
                </div>

                <div class="setting-item">
                    <div class="setting-toggle">
                        <input type="checkbox" id="showProgress" data-setting="notifications.showProgress" ${settings.showProgress ? 'checked' : ''}>
                        <label for="showProgress">Progress Notifications</label>
                    </div>
                    <p class="setting-description">Analysis and task progress</p>
                </div>

                <div class="setting-item">
                    <div class="setting-toggle">
                        <input type="checkbox" id="showErrors" data-setting="notifications.showErrors" ${settings.showErrors ? 'checked' : ''}>
                        <label for="showErrors">Error Notifications</label>
                    </div>
                    <p class="setting-description">System errors and warnings</p>
                </div>

                <div class="setting-item">
                    <div class="setting-toggle">
                        <input type="checkbox" id="sound" data-setting="notifications.sound" ${settings.sound ? 'checked' : ''}>
                        <label for="sound">Sound Effects</label>
                    </div>
                    <p class="setting-description">Audio notification sounds</p>
                </div>
            </div>
        `;
    }

    renderFeatureSettings(settings) {
        const features = [
            { key: 'quantumIntelligence', name: 'Quantum Intelligence', desc: 'Advanced quantum-enhanced processing' },
            { key: 'emotionalFusion', name: 'Emotional Fusion Engine', desc: 'Multimodal emotion analysis' },
            { key: 'phoneSensors', name: 'Phone Sensors', desc: 'Accelerometer, light, and audio analysis' },
            { key: 'biometricMonitoring', name: 'Biometric Monitoring', desc: 'Health and vitals tracking' },
            { key: 'voiceInput', name: 'Voice Input', desc: 'Speech recognition and analysis' },
            { key: 'cameraAnalysis', name: 'Camera Analysis', desc: 'Facial emotion detection' },
            { key: 'labsInterface', name: 'Labs Interface', desc: 'Advanced analysis laboratories' },
            { key: 'advancedAnalytics', name: 'Advanced Analytics', desc: 'Deep insights and patterns' }
        ];

        return `
            <div class="settings-group">
                <h3>🎛️ Feature Toggles</h3>
                <p class="group-description">Enable or disable platform features</p>
                
                ${features.map(feature => `
                    <div class="setting-item">
                        <div class="setting-toggle">
                            <input type="checkbox" id="${feature.key}" 
                                   data-setting="features.${feature.key}" 
                                   ${settings[feature.key] ? 'checked' : ''}>
                            <label for="${feature.key}">${feature.name}</label>
                        </div>
                        <p class="setting-description">${feature.desc}</p>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderPrivacySettings(settings) {
        return `
            <div class="settings-group">
                <h3>🔒 Data Privacy</h3>
                
                <div class="setting-item">
                    <label for="dataRetention">Data Retention (days)</label>
                    <input type="range" id="dataRetention" min="7" max="365" step="1" 
                           value="${settings.dataRetention}" data-setting="privacy.dataRetention">
                    <span class="range-value">${settings.dataRetention} days</span>
                </div>

                <div class="setting-item">
                    <div class="setting-toggle">
                        <input type="checkbox" id="anonymizeData" data-setting="privacy.anonymizeData" ${settings.anonymizeData ? 'checked' : ''}>
                        <label for="anonymizeData">Anonymize Data</label>
                    </div>
                    <p class="setting-description">Remove personally identifiable information</p>
                </div>

                <div class="setting-item">
                    <div class="setting-toggle">
                        <input type="checkbox" id="encryptStorage" data-setting="privacy.encryptStorage" ${settings.encryptStorage ? 'checked' : ''}>
                        <label for="encryptStorage">Encrypt Local Storage</label>
                    </div>
                    <p class="setting-description">Encrypt data stored locally</p>
                </div>

                <div class="setting-item">
                    <div class="setting-toggle">
                        <input type="checkbox" id="shareAnalytics" data-setting="privacy.shareAnalytics" ${settings.shareAnalytics ? 'checked' : ''}>
                        <label for="shareAnalytics">Share Analytics</label>
                    </div>
                    <p class="setting-description">Help improve the platform</p>
                </div>
            </div>

            <div class="settings-group">
                <h3>📱 Data Consent</h3>
                
                <div class="setting-item">
                    <div class="setting-toggle">
                        <input type="checkbox" id="biometricConsent" data-setting="privacy.biometricConsent" ${settings.biometricConsent ? 'checked' : ''}>
                        <label for="biometricConsent">Biometric Data</label>
                    </div>
                    <p class="setting-description">Process heart rate, stress, and health data</p>
                </div>

                <div class="setting-item">
                    <div class="setting-toggle">
                        <input type="checkbox" id="voiceDataConsent" data-setting="privacy.voiceDataConsent" ${settings.voiceDataConsent ? 'checked' : ''}>
                        <label for="voiceDataConsent">Voice Data</label>
                    </div>
                    <p class="setting-description">Process voice recordings for analysis</p>
                </div>

                <div class="setting-item">
                    <div class="setting-toggle">
                        <input type="checkbox" id="cameraDataConsent" data-setting="privacy.cameraDataConsent" ${settings.cameraDataConsent ? 'checked' : ''}>
                        <label for="cameraDataConsent">Camera Data</label>
                    </div>
                    <p class="setting-description">Process camera images for emotion detection</p>
                </div>
            </div>
        `;
    }

    renderPerformanceSettings(settings) {
        return `
            <div class="settings-group">
                <h3>⚡ Performance</h3>
                
                <div class="setting-item">
                    <label for="maxConcurrentOperations">Max Concurrent Operations</label>
                    <input type="range" id="maxConcurrentOperations" min="1" max="10" step="1" 
                           value="${settings.maxConcurrentOperations}" data-setting="performance.maxConcurrentOperations">
                    <span class="range-value">${settings.maxConcurrentOperations}</span>
                </div>

                <div class="setting-item">
                    <label for="cacheSize">Cache Size (MB)</label>
                    <input type="range" id="cacheSize" min="10" max="200" step="10" 
                           value="${settings.cacheSize}" data-setting="performance.cacheSize">
                    <span class="range-value">${settings.cacheSize} MB</span>
                </div>

                <div class="setting-item">
                    <div class="setting-toggle">
                        <input type="checkbox" id="offlineMode" data-setting="performance.offlineMode" ${settings.offlineMode ? 'checked' : ''}>
                        <label for="offlineMode">Offline Mode</label>
                    </div>
                    <p class="setting-description">Work without internet connection</p>
                </div>

                <div class="setting-item">
                    <div class="setting-toggle">
                        <input type="checkbox" id="backgroundSync" data-setting="performance.backgroundSync" ${settings.backgroundSync ? 'checked' : ''}>
                        <label for="backgroundSync">Background Sync</label>
                    </div>
                    <p class="setting-description">Sync data in the background</p>
                </div>
            </div>

            <div class="settings-group">
                <h3>🔋 Power Management</h3>
                
                <div class="setting-item">
                    <div class="setting-toggle">
                        <input type="checkbox" id="lowPowerMode" data-setting="performance.lowPowerMode" ${settings.lowPowerMode ? 'checked' : ''}>
                        <label for="lowPowerMode">Low Power Mode</label>
                    </div>
                    <p class="setting-description">Reduce processing to save battery</p>
                </div>

                <div class="setting-item">
                    <div class="setting-toggle">
                        <input type="checkbox" id="reducedAnimations" data-setting="performance.reducedAnimations" ${settings.reducedAnimations ? 'checked' : ''}>
                        <label for="reducedAnimations">Reduced Animations</label>
                    </div>
                    <p class="setting-description">Minimize animations for performance</p>
                </div>

                <div class="setting-item">
                    <div class="setting-toggle">
                        <input type="checkbox" id="dataCompression" data-setting="performance.dataCompression" ${settings.dataCompression ? 'checked' : ''}>
                        <label for="dataCompression">Data Compression</label>
                    </div>
                    <p class="setting-description">Compress stored data</p>
                </div>
            </div>
        `;
    }

    renderIntegrationSettings(settings) {
        const integrations = [
            { key: 'calendar', name: 'Calendar', desc: 'Sync with calendar apps', icon: '📅' },
            { key: 'email', name: 'Email', desc: 'Email sentiment analysis', icon: '📧' },
            { key: 'biometric', name: 'Health Apps', desc: 'Connect to health platforms', icon: '💓' },
            { key: 'smarthome', name: 'Smart Home', desc: 'IoT device integration', icon: '🏠' },
            { key: 'financial', name: 'Financial', desc: 'Financial wellness tracking', icon: '💰' },
            { key: 'wearables', name: 'Wearables', desc: 'Smartwatch and fitness trackers', icon: '⌚' }
        ];

        return `
            <div class="settings-group">
                <h3>🔗 External Integrations</h3>
                <p class="group-description">Connect with external services and devices</p>
                
                ${integrations.map(integration => `
                    <div class="setting-item">
                        <div class="integration-item">
                            <div class="integration-info">
                                <span class="integration-icon">${integration.icon}</span>
                                <div>
                                    <div class="integration-name">${integration.name}</div>
                                    <div class="integration-desc">${integration.desc}</div>
                                </div>
                            </div>
                            <div class="setting-toggle">
                                <input type="checkbox" id="integration_${integration.key}" 
                                       data-setting="integrations.${integration.key}" 
                                       ${settings[integration.key] ? 'checked' : ''}>
                                <label for="integration_${integration.key}">Enable</label>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>

            <div class="settings-group">
                <h3>🌐 Cloud Services</h3>
                
                <div class="setting-item">
                    <div class="setting-toggle">
                        <input type="checkbox" id="cloudSync" data-setting="privacy.cloudSync" ${settings.cloudSync || false ? 'checked' : ''}>
                        <label for="cloudSync">Cloud Sync</label>
                    </div>
                    <p class="setting-description">Sync data across devices</p>
                </div>
            </div>
        `;
    }

    renderAdvancedSettings(settings) {
        return `
            <div class="settings-group">
                <h3>🔬 Developer Settings</h3>
                
                <div class="setting-item">
                    <div class="setting-toggle">
                        <input type="checkbox" id="debugMode" data-setting="advanced.debugMode" ${settings.debugMode ? 'checked' : ''}>
                        <label for="debugMode">Debug Mode</label>
                    </div>
                    <p class="setting-description">Show debug information</p>
                </div>

                <div class="setting-item">
                    <div class="setting-toggle">
                        <input type="checkbox" id="verboseLogging" data-setting="advanced.verboseLogging" ${settings.verboseLogging ? 'checked' : ''}>
                        <label for="verboseLogging">Verbose Logging</label>
                    </div>
                    <p class="setting-description">Detailed console logging</p>
                </div>

                <div class="setting-item">
                    <div class="setting-toggle">
                        <input type="checkbox" id="experimentalFeatures" data-setting="advanced.experimentalFeatures" ${settings.experimentalFeatures ? 'checked' : ''}>
                        <label for="experimentalFeatures">Experimental Features</label>
                    </div>
                    <p class="setting-description">Enable beta features</p>
                </div>
            </div>

            <div class="settings-group">
                <h3>⚛️ Quantum Settings</h3>
                
                <div class="setting-item">
                    <div class="setting-toggle">
                        <input type="checkbox" id="quantumOptimization" data-setting="advanced.quantumOptimization" ${settings.quantumOptimization ? 'checked' : ''}>
                        <label for="quantumOptimization">Quantum Optimization</label>
                    </div>
                    <p class="setting-description">Use quantum algorithms for optimization</p>
                </div>

                <div class="setting-item">
                    <div class="setting-toggle">
                        <input type="checkbox" id="neuralEnhancement" data-setting="advanced.neuralEnhancement" ${settings.neuralEnhancement ? 'checked' : ''}>
                        <label for="neuralEnhancement">Neural Enhancement</label>
                    </div>
                    <p class="setting-description">AI neural network optimizations</p>
                </div>

                <div class="setting-item">
                    <label for="fusionSensitivity">Fusion Sensitivity</label>
                    <input type="range" id="fusionSensitivity" min="0.1" max="1.0" step="0.1" 
                           value="${settings.fusionSensitivity}" data-setting="advanced.fusionSensitivity">
                    <span class="range-value">${settings.fusionSensitivity}</span>
                </div>
            </div>

            <div class="settings-group">
                <h3>🔧 System Actions</h3>
                
                <div class="setting-item">
                    <button class="btn secondary" onclick="settingsOverlay.clearCache()">
                        🗑️ Clear Cache
                    </button>
                    <p class="setting-description">Clear all cached data</p>
                </div>

                <div class="setting-item">
                    <button class="btn secondary" onclick="settingsOverlay.resetAnalytics()">
                        📊 Reset Analytics
                    </button>
                    <p class="setting-description">Clear all analytics data</p>
                </div>

                <div class="setting-item">
                    <button class="btn danger" onclick="settingsOverlay.factoryReset()">
                        ⚠️ Factory Reset
                    </button>
                    <p class="setting-description">Reset all data and settings</p>
                </div>
            </div>
        `;
    }

    // ====================================
    // CATEGORY MANAGEMENT
    // ====================================

    switchCategory(category) {
        // Update category buttons
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });

        // Update settings panel
        const settingsPanel = document.getElementById('settingsPanel');
        if (settingsPanel) {
            settingsPanel.innerHTML = this.renderSettingsForCategory(category);
            this.attachEventListeners();
        }

        this.activeCategory = category;
    }

    // ====================================
    // EVENT LISTENERS
    // ====================================

    setupEventListeners() {
        // Close overlay when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('settings-overlay')) {
                this.hide();
            }
        });

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isVisible) {
                this.hide();
            }
        });
    }

    attachEventListeners() {
        // Attach listeners to all setting inputs
        const inputs = document.querySelectorAll('[data-setting]');
        inputs.forEach(input => {
            const eventType = input.type === 'range' ? 'input' : 'change';
            input.addEventListener(eventType, (e) => {
                this.handleSettingChange(e);
            });
        });
    }

    handleSettingChange(event) {
        const input = event.target;
        const settingPath = input.dataset.setting;
        const value = input.type === 'checkbox' ? input.checked : 
                     input.type === 'range' ? parseFloat(input.value) : 
                     input.value;

        // Store pending change
        this.pendingChanges.set(settingPath, value);

        // Update range display if applicable
        if (input.type === 'range') {
            const rangeValue = input.parentNode.querySelector('.range-value');
            if (rangeValue) {
                const unit = settingPath.includes('Interval') ? 's' : 
                           settingPath.includes('Size') ? ' MB' : 
                           settingPath.includes('Retention') ? ' days' : 
                           settingPath.includes('duration') ? 'ms' : '';
                rangeValue.textContent = value + unit;
            }
        }

        // Apply some settings immediately for preview
        if (settingPath === 'general.theme') {
            this.previewTheme(value);
        }
    }

    // ====================================
    // SETTINGS MANAGEMENT
    // ====================================

    loadSettings() {
        if (this.storageManager) {
            const savedSettings = this.storageManager.getItem('appSettings');
            if (savedSettings) {
                this.settings = { ...this.settings, ...savedSettings };
            }
        }
    }

    storeOriginalSettings() {
        this.originalSettings = JSON.parse(JSON.stringify(this.settings));
    }

    saveSettings() {
        // Apply all pending changes
        this.pendingChanges.forEach((value, path) => {
            this.setNestedProperty(this.settings, path, value);
        });

        // Save to storage
        if (this.storageManager) {
            this.storageManager.setItem('appSettings', this.settings);
        }

        // Apply settings to the app
        this.applySettings();

        // Clear pending changes
        this.pendingChanges.clear();

        this.notificationManager?.show('✅ Settings saved successfully', 'success');
        this.hide();
    }

    cancelChanges() {
        // Restore original settings
        this.settings = JSON.parse(JSON.stringify(this.originalSettings));
        
        // Clear pending changes
        this.pendingChanges.clear();

        // Refresh display
        this.refreshSettingsDisplay();

        this.notificationManager?.show('❌ Changes cancelled', 'info');
        this.hide();
    }

    resetToDefaults() {
        if (confirm('Are you sure you want to reset all settings to defaults?')) {
            this.settings = this.getDefaultSettings();
            this.pendingChanges.clear();
            this.refreshSettingsDisplay();
            this.notificationManager?.show('🔄 Settings reset to defaults', 'info');
        }
    }

    applySettings() {
        // Apply theme
        if (this.uiManager && this.settings.general.theme) {
            this.uiManager.setTheme(this.settings.general.theme);
        }

        // Apply notification settings
        if (this.notificationManager) {
            // Update notification manager settings
        }

        // Apply other settings as needed
        this.applyFeatureToggles();
        this.applyPerformanceSettings();
    }

    applyFeatureToggles() {
        const features = this.settings.features;
        
        // Emit events for feature changes
        Object.entries(features).forEach(([feature, enabled]) => {
            if (window.aiLifePlatform) {
                window.aiLifePlatform.data?.updateContext({ 
                    [`feature_${feature}`]: enabled 
                });
            }
        });
    }

    applyPerformanceSettings() {
        const performance = this.settings.performance;
        
        // Apply performance settings
        if (performance.lowPowerMode) {
            document.body.classList.add('low-power-mode');
        } else {
            document.body.classList.remove('low-power-mode');
        }

        if (performance.reducedAnimations) {
            document.body.classList.add('reduced-animations');
        } else {
            document.body.classList.remove('reduced-animations');
        }
    }

    previewTheme(theme) {
        if (this.uiManager) {
            this.uiManager.setTheme(theme);
        }
    }

    refreshSettingsDisplay() {
        const settingsPanel = document.getElementById('settingsPanel');
        if (settingsPanel) {
            settingsPanel.innerHTML = this.renderSettingsForCategory(this.activeCategory);
            this.attachEventListeners();
        }
    }

    checkForUnsavedChanges() {
        if (this.pendingChanges.size > 0) {
            if (confirm('You have unsaved changes. Do you want to save them?')) {
                this.saveSettings();
            } else {
                this.cancelChanges();
            }
        }
    }

    // ====================================
    // IMPORT/EXPORT
    // ====================================

    exportSettings() {
        const exportData = {
            timestamp: new Date().toISOString(),
            version: '1.0.0',
            settings: this.settings
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ailife-settings-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);

        this.notificationManager?.show('📁 Settings exported', 'success');
    }

    importSettings() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const imported = JSON.parse(e.target.result);
                        if (imported.settings) {
                            this.settings = { ...this.getDefaultSettings(), ...imported.settings };
                            this.refreshSettingsDisplay();
                            this.notificationManager?.show('📂 Settings imported', 'success');
                        }
                    } catch (error) {
                        this.notificationManager?.show('❌ Invalid settings file', 'error');
                    }
                };
                reader.readAsText(file);
            }
        };
        
        input.click();
    }

    // ====================================
    // SYSTEM ACTIONS
    // ====================================

    clearCache() {
        if (confirm('Clear all cached data?')) {
            if (this.storageManager) {
                this.storageManager.clear('cache');
            }
            this.notificationManager?.show('🗑️ Cache cleared', 'success');
        }
    }

    resetAnalytics() {
        if (confirm('Reset all analytics data?')) {
            if (window.aiLifePlatform?.data) {
                window.aiLifePlatform.data.resetAnalytics();
            }
            this.notificationManager?.show('📊 Analytics reset', 'success');
        }
    }

    factoryReset() {
        if (confirm('⚠️ Factory reset will delete ALL data and settings. This cannot be undone. Continue?')) {
            if (confirm('Are you absolutely sure? This will delete everything!')) {
                localStorage.clear();
                sessionStorage.clear();
                location.reload();
            }
        }
    }

    // ====================================
    // UTILITY METHODS
    // ====================================

    setNestedProperty(obj, path, value) {
        const keys = path.split('.');
        let current = obj;
        
        for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) {
                current[keys[i]] = {};
            }
            current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = value;
    }

    getDefaultSettings() {
        return {
            general: {
                theme: 'quantum-dark',
                language: 'en',
                animations: true,
                hapticFeedback: true,
                autoSave: true,
                autoSaveInterval: 30
            },
            notifications: {
                enabled: true,
                showQuantum: true,
                showProgress: true,
                showErrors: true,
                duration: 3000,
                position: 'top-right',
                sound: false
            },
            features: {
                quantumIntelligence: true,
                emotionalFusion: true,
                phoneSensors: true,
                biometricMonitoring: true,
                voiceInput: true,
                cameraAnalysis: true,
                labsInterface: true,
                advancedAnalytics: true
            },
            privacy: {
                dataRetention: 30,
                anonymizeData: true,
                encryptStorage: true,
                shareAnalytics: false,
                cloudSync: false,
                biometricConsent: true,
                voiceDataConsent: true,
                cameraDataConsent: true
            },
            performance: {
                maxConcurrentOperations: 5,
                cacheSize: 50,
                offlineMode: true,
                backgroundSync: true,
                lowPowerMode: false,
                reducedAnimations: false,
                dataCompression: true
            },
            integrations: {
                calendar: false,
                email: false,
                biometric: true,
                smarthome: false,
                financial: false,
                wearables: false
            },
            advanced: {
                debugMode: false,
                verboseLogging: false,
                experimentalFeatures: false,
                quantumOptimization: true,
                neuralEnhancement: true,
                fusionSensitivity: 0.7
            }
        };
    }

    // ====================================
    // PUBLIC API
    // ====================================

    getSetting(path) {
        const keys = path.split('.');
        let current = this.settings;
        
        for (const key of keys) {
            if (current && current.hasOwnProperty(key)) {
                current = current[key];
            } else {
                return null;
            }
        }
        
        return current;
    }

    setSetting(path, value) {
        this.setNestedProperty(this.settings, path, value);
        if (this.storageManager) {
            this.storageManager.setItem('appSettings', this.settings);
        }
    }

    // ====================================
    // CLEANUP
    // ====================================

    destroy() {
        const overlay = document.getElementById('settingsOverlay');
        if (overlay) {
            overlay.remove();
        }
        
        this.pendingChanges.clear();
        console.log('⚙️ Settings Overlay destroyed');
    }
}

// Export for global access
export default SettingsOverlay;