// ====================================
// DATA MANAGER
// ====================================

export class DataManager {
    constructor() {
        this.data = {
            user: {
                id: null,
                name: 'Belinda',
                personality: 'Analytical-Achiever',
                preferences: {
                    communicationStyle: 'data-driven',
                    learningPreference: 'structured',
                    notificationFrequency: 'moderate'
                },
                profile: {
                    level: 15,
                    totalXP: 8534,
                    streaks: {
                        meditation: 7,
                        exercise: 12,
                        learning: 5
                    }
                }
            },
            
            context: {
                currentMood: 'Focused',
                energyLevel: 82,
                timeOfDay: 'morning',
                recentActivities: ['meditation', 'planning'],
                goalContext: 'productivity',
                quantumCoherence: 87.3,
                optimizationScore: 91.2
            },
            
            biometrics: {
                current: {
                    heartRate: 72,
                    hrv: 45,
                    stressLevel: 25,
                    respRate: 16,
                    bloodOxygen: 98,
                    skinConductance: 0.8
                },
                history: [],
                correlations: {
                    hrEmotion: 0.87,
                    stressEmotion: 0.91,
                    hrvEmotion: 0.73
                }
            },
            
            emotions: {
                current: {
                    happy: 0,
                    sad: 0,
                    angry: 0,
                    fearful: 0,
                    surprised: 0,
                    neutral: 0
                },
                history: [],
                patterns: []
            },
            
            activity: {
                screenTime: {
                    productive: 4.2,
                    social: 1.8,
                    distraction: 0.3,
                    breakdown: Array(24).fill(null).map(() => ({
                        productive: Math.random() * 0.8,
                        social: Math.random() * 0.5,
                        distraction: Math.random() * 0.2
                    }))
                },
                
                energy: {
                    forecast: Array(24).fill(null).map((_, i) => {
                        if (i >= 9 && i <= 11) return 85 + Math.random() * 10; // Peak
                        if (i >= 14 && i <= 15) return 30 + Math.random() * 20; // Dip
                        return 50 + Math.random() * 30; // Normal
                    }),
                    allocation: {
                        deepWork: 45,
                        social: 25,
                        learning: 20,
                        admin: 10
                    }
                },
                
                habits: {
                    meditation: { streak: 7, completed: true, xpBonus: 2.0 },
                    exercise: { streak: 12, completed: true, xpBonus: 1.5 },
                    learning: { streak: 5, completed: false, xpBonus: 1.0 },
                    nutrition: { streak: 3, completed: true, xpBonus: 1.2 }
                }
            },
            
            integrations: {
                calendar: { connected: true, lastSync: Date.now() },
                email: { connected: true, lastSync: Date.now() },
                biometric: { connected: true, lastSync: Date.now() },
                smarthome: { connected: false, lastSync: null },
                financial: { connected: false, lastSync: null },
                wearables: { connected: false, lastSync: null }
            },
            
            achievements: [
                { id: 'health_guardian', name: 'Health Guardian', unlocked: true, date: '2025-06-10' },
                { id: 'focus_master', name: 'Focus Master', unlocked: true, date: '2025-06-08' },
                { id: 'social_butterfly', name: 'Social Butterfly', unlocked: true, date: '2025-06-05' },
                { id: 'biometric_master', name: 'Biometric Master', unlocked: true, date: '2025-06-12' },
                { id: 'quantum_pioneer', name: 'Quantum Pioneer', unlocked: true, date: '2025-06-12' },
                { id: 'vital_signs_guru', name: 'Vital Signs Guru', unlocked: false, date: null },
                { id: 'life_optimizer', name: 'Life Optimizer', unlocked: false, date: null }
            ],
            
            analytics: {
                optimizations: 156,
                accuracyScore: 91,
                dataPoints: 1247,
                interventions: 23,
                crashesPrevented: 15,
                timeSaved: 127 // minutes this week
            }
        };
        
        this.changeListeners = new Map();
        this.autosaveInterval = null;
        
        this.init();
    }

    init() {
        this.loadFromStorage();
        this.startAutosave();
        console.log('💾 Data Manager initialized');
    }

    // ====================================
    // STORAGE MANAGEMENT
    // ====================================

    loadFromStorage() {
        try {
            const stored = localStorage.getItem('aiLifePlatformData');
            if (stored) {
                const parsedData = JSON.parse(stored);
                this.data = { ...this.data, ...parsedData };
                console.log('💾 Data loaded from storage');
            }
        } catch (error) {
            console.warn('⚠️ Failed to load data from storage:', error);
        }
    }

    saveToStorage() {
        try {
            localStorage.setItem('aiLifePlatformData', JSON.stringify(this.data));
        } catch (error) {
            console.warn('⚠️ Failed to save data to storage:', error);
        }
    }

    startAutosave() {
        this.autosaveInterval = setInterval(() => {
            this.saveToStorage();
        }, 30000); // Save every 30 seconds
    }

    stopAutosave() {
        if (this.autosaveInterval) {
            clearInterval(this.autosaveInterval);
            this.autosaveInterval = null;
        }
    }

    // ====================================
    // USER DATA MANAGEMENT
    // ====================================

    updateUser(updates) {
        this.data.user = { ...this.data.user, ...updates };
        this.notifyListeners('user', this.data.user);
        return this.data.user;
    }

    updateUserProfile(updates) {
        this.data.user.profile = { ...this.data.user.profile, ...updates };
        this.notifyListeners('userProfile', this.data.user.profile);
        return this.data.user.profile;
    }

    updateUserPreferences(updates) {
        this.data.user.preferences = { ...this.data.user.preferences, ...updates };
        this.notifyListeners('userPreferences', this.data.user.preferences);
        return this.data.user.preferences;
    }

    // ====================================
    // CONTEXT MANAGEMENT
    // ====================================

    updateContext(updates) {
        this.data.context = { ...this.data.context, ...updates };
        this.notifyListeners('context', this.data.context);
        return this.data.context;
    }

    getContext() {
        return { ...this.data.context };
    }

    updateTimeContext() {
        const hour = new Date().getHours();
        let timeOfDay;
        
        if (hour < 6) timeOfDay = 'late-night';
        else if (hour < 12) timeOfDay = 'morning';
        else if (hour < 17) timeOfDay = 'afternoon';
        else if (hour < 21) timeOfDay = 'evening';
        else timeOfDay = 'night';
        
        this.updateContext({ timeOfDay });
        return timeOfDay;
    }

    // ====================================
    // BIOMETRIC DATA MANAGEMENT
    // ====================================

    updateBiometrics(updates) {
        this.data.biometrics.current = { ...this.data.biometrics.current, ...updates };
        
        // Add to history
        this.addBiometricHistory(this.data.biometrics.current);
        
        this.notifyListeners('biometrics', this.data.biometrics.current);
        return this.data.biometrics.current;
    }

    addBiometricHistory(reading) {
        const historyEntry = {
            ...reading,
            timestamp: Date.now()
        };
        
        this.data.biometrics.history.push(historyEntry);
        
        // Keep only last 1000 readings
        if (this.data.biometrics.history.length > 1000) {
            this.data.biometrics.history = this.data.biometrics.history.slice(-1000);
        }
    }

    getBiometricHistory(timeframe = '24h') {
        const now = Date.now();
        const timeframes = {
            '1h': 60 * 60 * 1000,
            '6h': 6 * 60 * 60 * 1000,
            '24h': 24 * 60 * 60 * 1000,
            '7d': 7 * 24 * 60 * 60 * 1000
        };
        
        const cutoff = now - (timeframes[timeframe] || timeframes['24h']);
        return this.data.biometrics.history.filter(entry => entry.timestamp > cutoff);
    }

    updateBiometricCorrelations(correlations) {
        this.data.biometrics.correlations = { ...this.data.biometrics.correlations, ...correlations };
        this.notifyListeners('biometricCorrelations', this.data.biometrics.correlations);
    }

    // ====================================
    // EMOTION DATA MANAGEMENT
    // ====================================

    updateEmotions(emotions) {
        this.data.emotions.current = { ...emotions };
        
        // Add to history
        this.addEmotionHistory(emotions);
        
        this.notifyListeners('emotions', this.data.emotions.current);
        return this.data.emotions.current;
    }

    addEmotionHistory(emotions) {
        const historyEntry = {
            ...emotions,
            timestamp: Date.now()
        };
        
        this.data.emotions.history.push(historyEntry);
        
        // Keep only last 500 readings
        if (this.data.emotions.history.length > 500) {
            this.data.emotions.history = this.data.emotions.history.slice(-500);
        }
    }

    getEmotionHistory(timeframe = '24h') {
        const now = Date.now();
        const timeframes = {
            '1h': 60 * 60 * 1000,
            '6h': 6 * 60 * 60 * 1000,
            '24h': 24 * 60 * 60 * 1000,
            '7d': 7 * 24 * 60 * 60 * 1000
        };
        
        const cutoff = now - (timeframes[timeframe] || timeframes['24h']);
        return this.data.emotions.history.filter(entry => entry.timestamp > cutoff);
    }

    // ====================================
    // ACTIVITY DATA MANAGEMENT
    // ====================================

    updateScreenTime(data) {
        this.data.activity.screenTime = { ...this.data.activity.screenTime, ...data };
        this.notifyListeners('screenTime', this.data.activity.screenTime);
    }

    updateEnergyForecast(forecast) {
        this.data.activity.energy.forecast = [...forecast];
        this.notifyListeners('energyForecast', this.data.activity.energy.forecast);
    }

    updateEnergyAllocation(allocation) {
        this.data.activity.energy.allocation = { ...this.data.activity.energy.allocation, ...allocation };
        this.notifyListeners('energyAllocation', this.data.activity.energy.allocation);
    }

    updateHabit(habitName, updates) {
        if (this.data.activity.habits[habitName]) {
            this.data.activity.habits[habitName] = { ...this.data.activity.habits[habitName], ...updates };
            this.notifyListeners('habits', this.data.activity.habits);
        }
    }

    completeHabit(habitName) {
        if (this.data.activity.habits[habitName]) {
            this.data.activity.habits[habitName].completed = true;
            this.data.activity.habits[habitName].streak += 1;
            
            // Calculate XP bonus based on streak
            const streak = this.data.activity.habits[habitName].streak;
            let xpBonus = 1.0;
            if (streak >= 30) xpBonus = 3.0;
            else if (streak >= 14) xpBonus = 2.5;
            else if (streak >= 7) xpBonus = 2.0;
            else if (streak >= 3) xpBonus = 1.5;
            
            this.data.activity.habits[habitName].xpBonus = xpBonus;
            
            this.notifyListeners('habitCompleted', { habit: habitName, streak, xpBonus });
        }
    }

    // ====================================
    // INTEGRATION MANAGEMENT
    // ====================================

    updateIntegration(integrationName, status) {
        if (this.data.integrations[integrationName]) {
            this.data.integrations[integrationName] = {
                ...this.data.integrations[integrationName],
                ...status,
                lastSync: status.connected ? Date.now() : this.data.integrations[integrationName].lastSync
            };
            this.notifyListeners('integrations', this.data.integrations);
        }
    }

    getConnectedIntegrations() {
        return Object.entries(this.data.integrations)
            .filter(([, integration]) => integration.connected)
            .map(([name]) => name);
    }

    getIntegrationStats() {
        const total = Object.keys(this.data.integrations).length;
        const connected = this.getConnectedIntegrations().length;
        const lastSync = Math.max(...Object.values(this.data.integrations)
            .filter(i => i.lastSync)
            .map(i => i.lastSync));
        
        return { total, connected, lastSync };
    }

    // ====================================
    // ACHIEVEMENT MANAGEMENT
    // ====================================

    unlockAchievement(achievementId) {
        const achievement = this.data.achievements.find(a => a.id === achievementId);
        if (achievement && !achievement.unlocked) {
            achievement.unlocked = true;
            achievement.date = new Date().toISOString().split('T')[0];
            this.notifyListeners('achievementUnlocked', achievement);
            return achievement;
        }
        return null;
    }

    getUnlockedAchievements() {
        return this.data.achievements.filter(a => a.unlocked);
    }

    getLockedAchievements() {
        return this.data.achievements.filter(a => !a.unlocked);
    }

    // ====================================
    // ANALYTICS MANAGEMENT
    // ====================================

    updateAnalytics(updates) {
        this.data.analytics = { ...this.data.analytics, ...updates };
        this.notifyListeners('analytics', this.data.analytics);
    }

    incrementAnalytic(metric, amount = 1) {
        if (this.data.analytics.hasOwnProperty(metric)) {
            this.data.analytics[metric] += amount;
            this.notifyListeners('analytics', this.data.analytics);
        }
    }

    // ====================================
    // EXPORT/IMPORT
    // ====================================

    exportData() {
        const exportData = {
            version: '1.0',
            timestamp: new Date().toISOString(),
            data: this.data
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ai-life-platform-data-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        return exportData;
    }

    importData(jsonData) {
        try {
            const imported = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
            
            if (imported.version && imported.data) {
                this.data = { ...this.data, ...imported.data };
                this.saveToStorage();
                this.notifyListeners('dataImported', this.data);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Failed to import data:', error);
            return false;
        }
    }

    // ====================================
    // EVENT SYSTEM
    // ====================================

    on(event, callback) {
        if (!this.changeListeners.has(event)) {
            this.changeListeners.set(event, new Set());
        }
        this.changeListeners.get(event).add(callback);
    }

    off(event, callback) {
        if (this.changeListeners.has(event)) {
            this.changeListeners.get(event).delete(callback);
        }
    }

    notifyListeners(event, data) {
        if (this.changeListeners.has(event)) {
            this.changeListeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in event listener for ${event}:`, error);
                }
            });
        }
    }

    // ====================================
    // UTILITY METHODS
    // ====================================

    resetData() {
        // Keep user preferences but reset everything else
        const userPreferences = this.data.user.preferences;
        this.data = this.getDefaultData();
        this.data.user.preferences = userPreferences;
        this.saveToStorage();
        this.notifyListeners('dataReset', this.data);
    }

    getDefaultData() {
        // Return a fresh copy of default data structure
        return {
            user: {
                id: null,
                name: 'User',
                personality: 'Analytical-Achiever',
                preferences: {
                    communicationStyle: 'data-driven',
                    learningPreference: 'structured',
                    notificationFrequency: 'moderate'
                },
                profile: {
                    level: 1,
                    totalXP: 0,
                    streaks: {
                        meditation: 0,
                        exercise: 0,
                        learning: 0
                    }
                }
            },
            context: {
                currentMood: 'Neutral',
                energyLevel: 50,
                timeOfDay: 'morning',
                recentActivities: [],
                goalContext: 'general',
                quantumCoherence: 50,
                optimizationScore: 50
            },
            // ... other default data structures
        };
    }

    // Getters for easy access
    get userData() { return this.data.user; }
    get contextData() { return this.data.context; }
    get biometricData() { return this.data.biometrics; }
    get emotionData() { return this.data.emotions; }
    get activityData() { return this.data.activity; }
    get integrationData() { return this.data.integrations; }
    get achievementData() { return this.data.achievements; }
    get analyticsData() { return this.data.analytics; }

    // Full data getter
    get allData() { return this.data; }
}