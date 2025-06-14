// ====================================
// UI MANAGER
// ====================================

export class UIManager {
    constructor(notificationManager) {
        this.notificationManager = notificationManager;
        this.init();
    }

    init() {
        this.setupProgressRings();
        this.setupEnergyForecast();
        this.setupScreenTimeBars();
        this.startBiometricSimulation();
        console.log('🎨 UI Manager initialized');
    }

    // ====================================
    // PROGRESS RINGS SETUP
    // ====================================

    setupProgressRings() {
        const progressRings = document.querySelectorAll('.progress-ring .progress');
        progressRings.forEach(ring => {
            const percentage = 89;
            const offset = 251 - (251 * percentage / 100);
            ring.style.strokeDashoffset = offset;
        });
    }

    updateProgressRing(ringSelector, percentage) {
        const ring = document.querySelector(`${ringSelector} .progress`);
        if (ring) {
            const offset = 251 - (251 * percentage / 100);
            ring.style.strokeDashoffset = offset;
        }
    }

    // ====================================
    // ENERGY FORECAST CHART
    // ====================================

    setupEnergyForecast() {
        const forecastChart = document.getElementById('energyForecast');
        if (forecastChart) {
            const hours = 24;
            const bars = Array.from({ length: hours }, (_, i) => {
                let className = 'forecast-bar';
                if (i >= 9 && i <= 11) className += ' peak';
                else if (i >= 14 && i <= 15) className += ' low';
                return `<div class="${className}"></div>`;
            });
            forecastChart.innerHTML = bars.join('');
        }
    }

    updateEnergyForecast(energyData) {
        const forecastChart = document.getElementById('energyForecast');
        if (forecastChart && energyData && energyData.length === 24) {
            const bars = energyData.map((energy, i) => {
                let className = 'forecast-bar';
                if (energy > 80) className += ' peak';
                else if (energy < 40) className += ' low';
                
                const height = Math.max(10, energy);
                return `<div class="${className}" style="height: ${height}%;"></div>`;
            });
            forecastChart.innerHTML = bars.join('');
        }
    }

    // ====================================
    // SCREEN TIME VISUALIZATION
    // ====================================

    setupScreenTimeBars() {
        const screenBars = document.getElementById('screenBars');
        if (screenBars) {
            const hours = 24;
            const bars = Array.from({ length: hours }, (_, i) => {
                let className = 'screen-bar';
                let height = Math.random() * 100; // Random height for demo
                
                // Add activity type based on time
                if (i >= 9 && i <= 17) { // Work hours - more productive
                    className += ' productive';
                    height = Math.max(height, 60);
                } else if (i >= 18 && i <= 22) { // Evening - social
                    className += ' social';
                    height = Math.max(height, 40);
                } else if (i >= 23 || i <= 6) { // Night/early morning - low activity
                    className += ' distraction';
                    height = Math.min(height, 20);
                } else {
                    className += ' productive';
                }
                
                return `<div class="${className}" style="height: ${height}%;"></div>`;
            });
            screenBars.innerHTML = bars.join('');
        }
    }

    updateScreenTimeBars(screenTimeData) {
        const screenBars = document.getElementById('screenBars');
        if (screenBars && screenTimeData && screenTimeData.length === 24) {
            const bars = screenTimeData.map((data, i) => {
                let className = 'screen-bar';
                
                // Determine activity type
                if (data.type === 'productive') className += ' productive';
                else if (data.type === 'social') className += ' social';
                else className += ' distraction';
                
                const height = Math.max(5, data.usage * 100);
                return `<div class="${className}" style="height: ${height}%;"></div>`;
            });
            screenBars.innerHTML = bars.join('');
        }
    }

    // ====================================
    // BIOMETRIC SIMULATION & DISPLAY
    // ====================================

    startBiometricSimulation() {
        setInterval(() => {
            this.updateBiometricData();
        }, 3000);
    }

    updateBiometricData() {
        // Generate realistic biometric data
        const heartRate = 65 + Math.floor(Math.random() * 25);
        const hrv = 30 + Math.floor(Math.random() * 30);
        const stressLevel = 15 + Math.floor(Math.random() * 40);
        const respRate = 14 + Math.floor(Math.random() * 6);
        const oxygenLevel = 96 + Math.floor(Math.random() * 4);

        // Update display elements
        this.updateElement('heartRateDisplay', `${heartRate} BPM`);
        this.updateElement('bloodOxygenDisplay', `${oxygenLevel}%`);
        this.updateElement('stressDisplay', `${stressLevel}%`);
        this.updateElement('hrvDisplay', `${hrv}ms`);
        this.updateElement('breathingRateDisplay', `${respRate}/min`);

        // Update emotional interpretations
        this.updateElement('heartRateEmotion', this.interpretHeartRate(heartRate));
        this.updateElement('oxygenEmotion', this.interpretOxygen(oxygenLevel));
        this.updateElement('stressEmotion', this.interpretStress(stressLevel));
        this.updateElement('hrvEmotion', this.interpretHRV(hrv));

        // Update correlations
        this.updateCorrelationDisplay(heartRate, stressLevel, hrv);
    }

    interpretHeartRate(hr) {
        if (hr < 60) return 'Resting';
        if (hr < 70) return 'Relaxed';
        if (hr < 80) return 'Normal Range';
        if (hr < 90) return 'Elevated';
        return 'High';
    }

    interpretOxygen(oxygen) {
        if (oxygen >= 98) return 'Excellent';
        if (oxygen >= 96) return 'Good';
        if (oxygen >= 94) return 'Fair';
        return 'Low';
    }

    interpretStress(stress) {
        if (stress < 20) return 'Very Low';
        if (stress < 40) return 'Well Managed';
        if (stress < 60) return 'Moderate';
        if (stress < 80) return 'High';
        return 'Very High';
    }

    interpretHRV(hrv) {
        if (hrv > 50) return 'Excellent Recovery';
        if (hrv > 40) return 'Good Recovery';
        if (hrv > 30) return 'Fair Recovery';
        return 'Need Rest';
    }

    updateCorrelationDisplay(hr, stress, hrv) {
        // Calculate dynamic correlations
        const hrStressCorr = (0.7 + Math.random() * 0.25).toFixed(2);
        const focusCoherence = (0.8 + Math.random() * 0.15).toFixed(2);
        const anxietyBreathing = (0.6 + Math.random() * 0.25).toFixed(2);
        const emotionalArousal = (0.4 + Math.random() * 0.3).toFixed(2);

        this.updateElement('stressHRCorrelation', hrStressCorr);
        this.updateElement('focusCoherence', focusCoherence);
        this.updateElement('anxietyBreathingCorrelation', anxietyBreathing);
        this.updateElement('emotionalArousal', emotionalArousal);
    }

    // ====================================
    // DYNAMIC CONTENT UPDATES
    // ====================================

    updateElement(id, content) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = content;
        }
    }

    updateElementHTML(id, html) {
        const element = document.getElementById(id);
        if (element) {
            element.innerHTML = html;
        }
    }

    updateProgress(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.style.width = value + '%';
        }
    }

    // ====================================
    // ANIMATED COUNTERS
    // ====================================

    animateCounter(elementId, targetValue, duration = 1000, suffix = '') {
        const element = document.getElementById(elementId);
        if (!element) return;

        const startValue = parseInt(element.textContent) || 0;
        const difference = targetValue - startValue;
        const stepTime = duration / Math.abs(difference);
        
        let currentValue = startValue;
        const timer = setInterval(() => {
            currentValue += difference > 0 ? 1 : -1;
            element.textContent = currentValue + suffix;
            
            if (currentValue === targetValue) {
                clearInterval(timer);
            }
        }, stepTime);
    }

    // ====================================
    // LOADING STATES
    // ====================================

    showLoadingState(containerId, message = 'Loading...') {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="loading-state" style="
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem;
                    color: var(--text-muted);
                ">
                    <div class="loading-spinner" style="
                        width: 32px;
                        height: 32px;
                        border: 3px solid var(--glass-border);
                        border-top: 3px solid var(--primary);
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                        margin-bottom: 1rem;
                    "></div>
                    <div>${message}</div>
                </div>
            `;
        }
    }

    hideLoadingState(containerId, content = '') {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = content;
        }
    }

    // ====================================
    // THEME MANAGEMENT
    // ====================================

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('app-theme', theme);
    }

    getTheme() {
        return localStorage.getItem('app-theme') || 'dark';
    }

    toggleTheme() {
        const currentTheme = this.getTheme();
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
        
        if (this.notificationManager) {
            this.notificationManager.show(`🎨 Switched to ${newTheme} theme`, 'info');
        }
    }

    // ====================================
    // RESPONSIVE UTILITIES
    // ====================================

    isMobile() {
        return window.innerWidth <= 768;
    }

    isTablet() {
        return window.innerWidth > 768 && window.innerWidth <= 1024;
    }

    isDesktop() {
        return window.innerWidth > 1024;
    }

    onResize(callback) {
        let timeoutId;
        window.addEventListener('resize', () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(callback, 150);
        });
    }

    // ====================================
    // ACCESSIBILITY UTILITIES
    // ====================================

    announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.style.cssText = `
            position: absolute;
            left: -10000px;
            width: 1px;
            height: 1px;
            overflow: hidden;
        `;
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    setFocusTo(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.focus();
        }
    }

    // ====================================
    // SMOOTH SCROLLING
    // ====================================

    scrollToElement(elementId, behavior = 'smooth') {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({ behavior, block: 'start' });
        }
    }

    scrollToTop(containerId = null) {
        if (containerId) {
            const container = document.getElementById(containerId);
            if (container) {
                container.scrollTop = 0;
            }
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    // ====================================
    // ANIMATION UTILITIES
    // ====================================

    fadeIn(elementId, duration = 300) {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.opacity = '0';
            element.style.transition = `opacity ${duration}ms ease`;
            
            requestAnimationFrame(() => {
                element.style.opacity = '1';
            });
        }
    }

    fadeOut(elementId, duration = 300) {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.transition = `opacity ${duration}ms ease`;
            element.style.opacity = '0';
            
            setTimeout(() => {
                element.style.display = 'none';
            }, duration);
        }
    }

    slideIn(elementId, direction = 'down', duration = 300) {
        const element = document.getElementById(elementId);
        if (element) {
            const transforms = {
                'down': 'translateY(-20px)',
                'up': 'translateY(20px)',
                'left': 'translateX(20px)',
                'right': 'translateX(-20px)'
            };
            
            element.style.transform = transforms[direction];
            element.style.opacity = '0';
            element.style.transition = `all ${duration}ms ease`;
            
            requestAnimationFrame(() => {
                element.style.transform = 'translate(0)';
                element.style.opacity = '1';
            });
        }
    }

    // ====================================
    // DATA VISUALIZATION HELPERS
    // ====================================

    createMiniChart(containerId, data, type = 'line') {
        const container = document.getElementById(containerId);
        if (!container || !data.length) return;

        const canvas = document.createElement('canvas');
        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;
        container.innerHTML = '';
        container.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        
        if (type === 'line') {
            this.drawLineChart(ctx, data, canvas.width, canvas.height);
        } else if (type === 'bar') {
            this.drawBarChart(ctx, data, canvas.width, canvas.height);
        }
    }

    drawLineChart(ctx, data, width, height) {
        const maxValue = Math.max(...data);
        const minValue = Math.min(...data);
        const range = maxValue - minValue || 1;

        ctx.strokeStyle = '#667eea';
        ctx.lineWidth = 2;
        ctx.beginPath();

        data.forEach((value, index) => {
            const x = (index / (data.length - 1)) * width;
            const y = height - ((value - minValue) / range) * height;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.stroke();
    }

    drawBarChart(ctx, data, width, height) {
        const maxValue = Math.max(...data);
        const barWidth = width / data.length;

        ctx.fillStyle = '#667eea';
        
        data.forEach((value, index) => {
            const barHeight = (value / maxValue) * height;
            const x = index * barWidth;
            const y = height - barHeight;
            
            ctx.fillRect(x, y, barWidth - 1, barHeight);
        });
    }

    // ====================================
    // UTILITY METHODS
    // ====================================

    formatNumber(num, decimals = 0) {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(num);
    }

    formatPercentage(value, decimals = 0) {
        return `${this.formatNumber(value, decimals)}%`;
    }

    formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
    }

    // ====================================
    // CSS UTILITIES
    // ====================================

    addClass(elementId, className) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.add(className);
        }
    }

    removeClass(elementId, className) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.remove(className);
        }
    }

    toggleClass(elementId, className) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.toggle(className);
        }
    }

    setStyle(elementId, property, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.style[property] = value;
        }
    }
}