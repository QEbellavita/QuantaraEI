class BiometricManager {
    constructor() {
        this.isMonitoring = true;
        this.data = {
            heartRate: 72,
            hrv: 45,
            stressLevel: 25,
            respRate: 16,
            bloodOxygen: 98,
            skinConductance: 0.8,
            facialTension: 12
        };
        this.history = [];
        this.correlations = new Map();
        this.init();
    }

    init() {
        this.startSimulation();
        this.calculateCorrelations();
        console.log('💓 Biometric Manager initialized');
    }

    startMonitoring() {
        this.isMonitoring = true;
        notificationManager?.showNotification('📱 Biometric monitoring started', 'success');
        this.updateDisplay();
    }

    stopMonitoring() {
        this.isMonitoring = false;
        notificationManager?.showNotification('📱 Biometric monitoring stopped', 'warning');
    }

    simulateData() {
        if (!this.isMonitoring) return;

        this.data.heartRate = 65 + Math.floor(Math.random() * 25);
        this.data.hrv = 30 + Math.floor(Math.random() * 30);
        this.data.stressLevel = 15 + Math.floor(Math.random() * 40);
        this.data.respRate = 14 + Math.floor(Math.random() * 6);
        this.data.bloodOxygen = 96 + Math.floor(Math.random() * 4);
        this.data.skinConductance = 0.5 + Math.random() * 0.8;
        this.data.facialTension = 8 + Math.floor(Math.random() * 15);

        this.storeHistory();
        this.updateDisplay();
        this.calculateCorrelations();
    }

    storeHistory() {
        this.history.push({
            timestamp: Date.now(),
            ...this.data
        });

        if (this.history.length > 1000) {
            this.history.shift();
        }
    }

    updateDisplay() {
        const updates = {
            'heartRateDisplay': `${this.data.heartRate} BPM`,
            'bloodOxygenDisplay': `${this.data.bloodOxygen}%`,
            'stressDisplay': `${this.data.stressLevel}%`,
            'hrvDisplay': `${this.data.hrv}ms`,
            'skinConductanceDisplay': `${this.data.skinConductance.toFixed(1)}μS`,
            'breathingRateDisplay': `${this.data.respRate}/min`,
            'facialTensionDisplay': `${this.data.facialTension}%`
        };

        Object.entries(updates).forEach(([id, value]) => {
            uiManager?.updateElement(id, value);
        });

        this.updateEmoticorrelations();
    }

    updateEmoticorrelations() {
        const emotions = ['heartRateEmotion', 'oxygenEmotion', 'stressEmotion', 'hrvEmotion'];
        const states = ['Normal Range', 'Excellent', 'Well Managed', 'Good Recovery'];
        
        emotions.forEach((id, index) => {
            uiManager?.updateElement(id, states[index]);
        });
    }

    calculateCorrelations() {
        // Calculate correlations with emotional data
        const hrStressCorr = 0.7 + Math.random() * 0.25;
        const focusCoherence = 0.8 + Math.random() * 0.15;
        const anxietyBreathing = 0.6 + Math.random() * 0.2;
        const emotionalArousal = 0.4 + Math.random() * 0.3;

        this.correlations.set('stressHR', hrStressCorr);
        this.correlations.set('focus', focusCoherence);
        this.correlations.set('anxietyBreathing', anxietyBreathing);
        this.correlations.set('arousal', emotionalArousal);

        this.updateCorrelationDisplay();
    }

    updateCorrelationDisplay() {
        const updates = {
            'stressHRCorrelation': this.correlations.get('stressHR')?.toFixed(2) || '0.73',
            'focusCoherence': this.correlations.get('focus')?.toFixed(2) || '0.84',
            'anxietyBreathingCorrelation': this.correlations.get('anxietyBreathing')?.toFixed(2) || '0.68',
            'emotionalArousal': this.correlations.get('arousal')?.toFixed(2) || '0.45'
        };

        Object.entries(updates).forEach(([id, value]) => {
            uiManager?.updateElement(id, value);
        });
    }

    getCurrentState() {
        let state = 'Balanced State';
        let confidence = 85;

        if (this.data.stressLevel < 20 && this.data.heartRate < 80) {
            state = 'Calm & Focused';
            confidence = 92;
        } else if (this.data.stressLevel > 40) {
            state = 'Elevated Stress';
            confidence = 88;
        } else if (this.data.heartRate > 85) {
            state = 'High Energy';
            confidence = 90;
        }

        return { state, confidence };
    }

    startSimulation() {
        setInterval(() => {
            this.simulateData();
        }, 3000);
    }

    exportData() {
        const exportData = {
            timestamp: new Date().toISOString(),
            current: this.data,
            history: this.history,
            correlations: Object.fromEntries(this.correlations)
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'biometric-data.json';
        a.click();

        notificationManager?.showNotification('📁 Biometric data exported', 'success');
    }
}

// Export for global access
window.biometricManager = new BiometricManager();