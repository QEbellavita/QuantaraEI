// ====================================
// NAVIGATION MANAGER
// ====================================

export class NavigationManager {
    constructor(notificationManager) {
        this.notificationManager = notificationManager;
        
        this.currentSection = 'aiCoach';
        this.currentHealthTab = 'overview';
        this.currentPerformanceTab = 'productivity';
        this.currentGrowthTab = 'learning';
        this.currentProfileTab = 'achievements';
        
        this.overlayStates = {
            labs: false,
            sensors: false
        };
        
        this.init();
    }

    init() {
        this.setupDefaultSections();
        console.log('🧭 Navigation Manager initialized');
    }

    setupDefaultSections() {
        // Set initial section visibility
        this.switchSection('aiCoach');
        
        // Initialize default tabs with delay to ensure DOM is ready
        setTimeout(() => {
            this.switchHealthTab('overview');
            this.switchPerformanceTab('productivity');
            this.switchGrowthTab('learning');
            this.switchProfileTab('achievements');
        }, 100);
    }

    // Main section navigation
    switchSection(section) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        
        // Show target section
        const targetSection = document.getElementById(section);
        if (targetSection) {
            targetSection.classList.add('active');
        }
        
        // Update navigation highlighting
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.section === section);
        });
        
        this.currentSection = section;
        
        // Optional notification for section changes
        const sectionNames = {
            'aiCoach': 'AI Coach',
            'emotionalFusion': 'Emotional Fusion',
            'health': 'Health',
            'performance': 'Performance',
            'growth': 'Growth',
            'profile': 'Profile'
        };
        
        if (this.notificationManager && sectionNames[section]) {
            // Only show notification for non-default sections
            if (section !== 'aiCoach') {
                this.notificationManager.show(`📍 Switched to ${sectionNames[section]}`, 'info', 1500);
            }
        }
    }

    // Health section tab navigation
    switchHealthTab(tabId, event = null) {
        // Remove active from all health tabs
        document.querySelectorAll('.health-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('#health .sub-nav-item').forEach(item => item.classList.remove('active'));
        
        // Show target tab
        const targetTab = document.getElementById(`health${this.capitalize(tabId)}`);
        if (targetTab) {
            targetTab.classList.add('active');
        }
        
        // Update sub navigation
        if (event && event.target) {
            event.target.classList.add('active');
        } else {
            // Find and activate the corresponding nav item
            const navItems = document.querySelectorAll('#health .sub-nav-item');
            navItems.forEach(item => {
                if (item.textContent.toLowerCase() === tabId.toLowerCase()) {
                    item.classList.add('active');
                }
            });
        }
        
        this.currentHealthTab = tabId;
    }

    // Performance section tab navigation
    switchPerformanceTab(tabId, event = null) {
        document.querySelectorAll('.performance-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('#performance .sub-nav-item').forEach(item => item.classList.remove('active'));
        
        const targetTab = document.getElementById(`performance${this.capitalize(tabId)}`);
        if (targetTab) {
            targetTab.classList.add('active');
        }
        
        if (event && event.target) {
            event.target.classList.add('active');
        } else {
            const navItems = document.querySelectorAll('#performance .sub-nav-item');
            navItems.forEach(item => {
                if (item.textContent.toLowerCase() === tabId.toLowerCase()) {
                    item.classList.add('active');
                }
            });
        }
        
        this.currentPerformanceTab = tabId;
    }

    // Growth section tab navigation
    switchGrowthTab(tabId, event = null) {
        document.querySelectorAll('.growth-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('#growth .sub-nav-item').forEach(item => item.classList.remove('active'));
        
        const targetTab = document.getElementById(`growth${this.capitalize(tabId)}`);
        if (targetTab) {
            targetTab.classList.add('active');
        }
        
        if (event && event.target) {
            event.target.classList.add('active');
        } else {
            const navItems = document.querySelectorAll('#growth .sub-nav-item');
            navItems.forEach(item => {
                if (item.textContent.toLowerCase() === tabId.toLowerCase()) {
                    item.classList.add('active');
                }
            });
        }
        
        this.currentGrowthTab = tabId;
    }

    // Profile section tab navigation
    switchProfileTab(tabId) {
        if (!['achievements', 'integrations', 'labs', 'analytics'].includes(tabId)) {
            return;
        }
        
        document.querySelectorAll('.profile-tab').forEach(tab => {
            tab.classList.remove('active');
            tab.style.display = 'none';
        });
        
        const targetTab = document.getElementById(`profile${this.capitalize(tabId)}`);
        if (targetTab) {
            targetTab.classList.add('active');
            targetTab.style.display = 'block';
        }
        
        this.currentProfileTab = tabId;
    }

    // Overlay management
    toggleLabs() {
        const overlay = document.getElementById('labsOverlay');
        
        if (overlay && overlay.classList.contains('active')) {
            this.closeLabs();
        } else {
            this.openLabs();
        }
    }

    openLabs() {
        const overlay = document.getElementById('labsOverlay');
        
        if (overlay) {
            overlay.classList.add('active');
            this.overlayStates.labs = true;
        }
        
        if (this.notificationManager) {
            this.notificationManager.show('⚛️ Quantum AI Labs interface opened', 'quantum');
        }
    }

    closeLabs() {
        const overlay = document.getElementById('labsOverlay');
        
        if (overlay) {
            overlay.classList.remove('active');
            this.overlayStates.labs = false;
        }
    }

    toggleSensorsOverlay() {
        const overlay = document.getElementById('sensorsOverlay');
        
        if (overlay && overlay.classList.contains('active')) {
            this.closeSensorsOverlay();
        } else {
            this.openSensorsOverlay();
        }
    }

    openSensorsOverlay() {
        const overlay = document.getElementById('sensorsOverlay');
        
        if (overlay) {
            overlay.classList.add('active');
            this.overlayStates.sensors = true;
        }
        
        if (this.notificationManager) {
            this.notificationManager.show('📱 Phone Sensors Manager opened', 'success');
        }
    }

    closeSensorsOverlay() {
        const overlay = document.getElementById('sensorsOverlay');
        
        if (overlay) {
            overlay.classList.remove('active');
            this.overlayStates.sensors = false;
        }
    }

    // Navigation shortcuts
    openAICoach() {
        this.switchSection('aiCoach');
    }

    openFusionEngine() {
        this.switchSection('emotionalFusion');
        if (this.notificationManager) {
            this.notificationManager.show('🧠💓 Emotional Fusion Engine opened', 'success');
        }
    }

    openHealthBiometrics() {
        this.switchSection('health');
        this.switchHealthTab('biometrics');
    }

    openHealthSensors() {
        this.switchSection('health');
        this.switchHealthTab('sensors');
    }

    // Lab navigation
    openLab(labType) {
        if (labType === 'emotional-fusion') {
            this.closeLabs();
            this.openFusionEngine();
            return;
        }
        
        const labNames = {
            'deep-emotion': 'Deep Emotion Analysis',
            'personality': 'Personality Testing',
            'predictive': 'Predictive Intelligence',
            'multimodal': 'Multimodal Fusion',
            'quantum': 'Quantum Analysis',
            'biometric': 'Biometric Integration'
        };
        
        const labName = labNames[labType] || labType;
        
        if (this.notificationManager) {
            this.notificationManager.show(`⚛️ Initializing ${labName}...`, 'quantum');
        }
        
        setTimeout(() => {
            this.closeLabs();
            this.openAICoach();
            
            if (this.notificationManager) {
                this.notificationManager.show(`🧪 ${labName} analysis started`, 'success');
            }
        }, 1500);
    }

    // Utility methods
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // State getters
    getCurrentSection() {
        return this.currentSection;
    }

    getCurrentHealthTab() {
        return this.currentHealthTab;
    }

    getCurrentPerformanceTab() {
        return this.currentPerformanceTab;
    }

    getCurrentGrowthTab() {
        return this.currentGrowthTab;
    }

    getCurrentProfileTab() {
        return this.currentProfileTab;
    }

    getOverlayStates() {
        return { ...this.overlayStates };
    }

    // Navigation history (for potential back/forward functionality)
    navigationHistory = [];
    currentHistoryIndex = -1;

    addToHistory(section, tab = null) {
        const entry = { section, tab, timestamp: Date.now() };
        
        // Remove any entries after current index (for forward navigation)
        this.navigationHistory = this.navigationHistory.slice(0, this.currentHistoryIndex + 1);
        
        // Add new entry
        this.navigationHistory.push(entry);
        this.currentHistoryIndex = this.navigationHistory.length - 1;
        
        // Limit history size
        if (this.navigationHistory.length > 50) {
            this.navigationHistory.shift();
            this.currentHistoryIndex--;
        }
    }

    canGoBack() {
        return this.currentHistoryIndex > 0;
    }

    canGoForward() {
        return this.currentHistoryIndex < this.navigationHistory.length - 1;
    }

    goBack() {
        if (this.canGoBack()) {
            this.currentHistoryIndex--;
            const entry = this.navigationHistory[this.currentHistoryIndex];
            this.switchSection(entry.section);
            if (entry.tab) {
                this.switchHealthTab(entry.tab);
            }
        }
    }

    goForward() {
        if (this.canGoForward()) {
            this.currentHistoryIndex++;
            const entry = this.navigationHistory[this.currentHistoryIndex];
            this.switchSection(entry.section);
            if (entry.tab) {
                this.switchHealthTab(entry.tab);
            }
        }
    }
}