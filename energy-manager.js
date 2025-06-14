class EnergyManager {
    constructor() {
        this.currentEnergy = 82;
        this.maxEnergy = 100;
        this.energyPoints = 100; // Daily allocation points
        
        this.forecast = {
            hourly: Array.from({ length: 24 }, () => ({ 
                hour: 0, 
                predicted: 0, 
                actual: 0, 
                confidence: 0,
                factors: []
            })),
            peaks: [],
            dips: [],
            optimal: null
        };

        this.allocation = {
            deepWork: { allocated: 45, used: 0, efficiency: 0 },
            social: { allocated: 25, used: 0, efficiency: 0 },
            learning: { allocated: 20, used: 0, efficiency: 0 },
            admin: { allocated: 10, used: 0, efficiency: 0 }
        };

        this.patterns = {
            chronotype: 'analytical-morning', // morning, evening, flexible
            peakWindow: { start: 9, end: 11, confidence: 94 },
            energyDip: { time: 14.3, severity: 'moderate', duration: 1.5 },
            recoveryRate: 0.85, // How quickly energy recovers
            personalityFactors: new Map(),
            correlations: new Map()
        };

        this.interventions = {
            preventive: [],
            reactive: [],
            success_rate: 91,
            triggers: new Map()
        };

        this.history = {
            daily: [],
            weekly: [],
            patterns: [],
            learnings: []
        };

        this.realTimeFactors = {
            biometric: { weight: 0.3, current: 0 },
            activity: { weight: 0.25, current: 0 },
            environment: { weight: 0.2, current: 0 },
            nutrition: { weight: 0.15, current: 0 },
            sleep: { weight: 0.1, current: 0 }
        };

        this.init();
    }

    init() {
        this.generateEnergyForecast();
        this.calculatePersonalityFactors();
        this.setupRealTimeTracking();
        this.identifyPeaksAndDips();
        this.planOptimalAllocation();
        this.startEnergySimulation();
        this.updateDisplay();
        console.log('⚡ Energy Manager initialized');
    }

    generateEnergyForecast() {
        const basePattern = this.getChronotypePattern();
        
        for (let hour = 0; hour < 24; hour++) {
            const baseEnergy = basePattern[hour] || 50;
            const personalityBoost = this.getPersonalityEnergyBoost(hour);
            const environmentalFactor = this.getEnvironmentalFactor(hour);
            const variability = (Math.random() - 0.5) * 10; // ±5% variability
            
            const predicted = Math.max(10, Math.min(100, 
                baseEnergy + personalityBoost + environmentalFactor + variability
            ));

            this.forecast.hourly[hour] = {
                hour,
                predicted,
                actual: hour <= new Date().getHours() ? predicted + (Math.random() - 0.5) * 5 : null,
                confidence: 85 + Math.random() * 10,
                factors: this.getEnergyFactors(hour)
            };
        }
    }

    getChronotypePattern() {
        // Energy patterns based on chronotype
        const patterns = {
            'analytical-morning': {
                6: 40, 7: 55, 8: 70, 9: 85, 10: 92, 11: 90, 12: 80,
                13: 70, 14: 45, 15: 50, 16: 65, 17: 70, 18: 75,
                19: 65, 20: 55, 21: 45, 22: 35, 23: 25, 0: 15,
                1: 10, 2: 10, 3: 10, 4: 15, 5: 25
            },
            'creative-evening': {
                6: 25, 7: 30, 8: 45, 9: 60, 10: 70, 11: 75, 12: 80,
                13: 75, 14: 70, 15: 75, 16: 80, 17: 85, 18: 90,
                19: 92, 20: 88, 21: 80, 22: 70, 23: 55, 0: 40,
                1: 30, 2: 20, 3: 15, 4: 15, 5: 20
            },
            'flexible': {
                6: 45, 7: 60, 8: 75, 9: 80, 10: 85, 11: 82, 12: 78,
                13: 75, 14: 60, 15: 65, 16: 72, 17: 75, 18: 78,
                19: 75, 20: 68, 21: 60, 22: 50, 23: 40, 0: 30,
                1: 25, 2: 20, 3: 20, 4: 25, 5: 35
            }
        };

        return patterns[this.patterns.chronotype] || patterns['analytical-morning'];
    }

    getPersonalityEnergyBoost(hour) {
        const personality = window.conversationContext?.personality || 'Analytical-Achiever';
        
        if (personality === 'Analytical-Achiever') {
            // Boost during logical thinking hours
            if (hour >= 9 && hour <= 11) return 8;
            if (hour >= 14 && hour <= 16) return -5; // Analytical fatigue
            if (hour >= 19 && hour <= 20) return 5; // Planning boost
        }
        
        return 0;
    }

    getEnvironmentalFactor(hour) {
        let factor = 0;
        
        // Light exposure boost
        if (hour >= 7 && hour <= 18) factor += 5;
        
        // Weather simulation (placeholder)
        const weatherBoost = Math.random() > 0.7 ? 3 : 0;
        factor += weatherBoost;
        
        // Weekend vs weekday
        const isWeekend = new Date().getDay() % 6 === 0;
        if (isWeekend && hour >= 8 && hour <= 10) factor += 5;
        
        return factor;
    }

    getEnergyFactors(hour) {
        const factors = [];
        
        if (hour >= 9 && hour <= 11) {
            factors.push('Peak cognitive window', 'Natural circadian boost', 'Optimal cortisol levels');
        } else if (hour >= 14 && hour <= 15) {
            factors.push('Post-lunch dip', 'Circadian low point', 'Attention fatigue');
        } else if (hour >= 18 && hour <= 20) {
            factors.push('Second wind activation', 'Social energy boost', 'Planning mindset');
        }
        
        return factors;
    }

    identifyPeaksAndDips() {
        const hourlyEnergy = this.forecast.hourly.map(h => h.predicted);
        
        // Find peaks (local maxima above threshold)
        this.forecast.peaks = [];
        for (let i = 1; i < hourlyEnergy.length - 1; i++) {
            if (hourlyEnergy[i] > hourlyEnergy[i-1] && 
                hourlyEnergy[i] > hourlyEnergy[i+1] && 
                hourlyEnergy[i] > 75) {
                this.forecast.peaks.push({
                    hour: i,
                    energy: hourlyEnergy[i],
                    duration: this.calculatePeakDuration(i, hourlyEnergy),
                    type: this.classifyPeak(i, hourlyEnergy[i])
                });
            }
        }

        // Find dips (local minima below threshold)
        this.forecast.dips = [];
        for (let i = 1; i < hourlyEnergy.length - 1; i++) {
            if (hourlyEnergy[i] < hourlyEnergy[i-1] && 
                hourlyEnergy[i] < hourlyEnergy[i+1] && 
                hourlyEnergy[i] < 60) {
                this.forecast.dips.push({
                    hour: i,
                    energy: hourlyEnergy[i],
                    severity: this.classifyDipSeverity(hourlyEnergy[i]),
                    duration: this.calculateDipDuration(i, hourlyEnergy),
                    interventions: this.getDipInterventions(i, hourlyEnergy[i])
                });
            }
        }

        // Set next major dip for alerts
        const currentHour = new Date().getHours();
        const nextDip = this.forecast.dips.find(dip => dip.hour > currentHour);
        if (nextDip) {
            this.patterns.energyDip = {
                time: nextDip.hour + (nextDip.duration / 2),
                severity: nextDip.severity,
                duration: nextDip.duration
            };
        }
    }

    calculatePeakDuration(peakHour, energyData) {
        let duration = 1;
        const peakEnergy = energyData[peakHour];
        const threshold = peakEnergy * 0.9; // 90% of peak
        
        // Look backward
        for (let i = peakHour - 1; i >= 0 && energyData[i] >= threshold; i--) {
            duration++;
        }
        
        // Look forward
        for (let i = peakHour + 1; i < energyData.length && energyData[i] >= threshold; i++) {
            duration++;
        }
        
        return Math.min(duration, 4); // Cap at 4 hours
    }

    calculateDipDuration(dipHour, energyData) {
        let duration = 1;
        const dipEnergy = energyData[dipHour];
        const threshold = dipEnergy * 1.1; // 110% of dip
        
        // Look backward
        for (let i = dipHour - 1; i >= 0 && energyData[i] <= threshold; i--) {
            duration++;
        }
        
        // Look forward
        for (let i = dipHour + 1; i < energyData.length && energyData[i] <= threshold; i++) {
            duration++;
        }
        
        return Math.min(duration, 3); // Cap at 3 hours
    }

    classifyPeak(hour, energy) {
        if (energy > 90) return 'major';
        if (energy > 80) return 'strong';
        return 'moderate';
    }

    classifyDipSeverity(energy) {
        if (energy < 40) return 'severe';
        if (energy < 55) return 'moderate';
        return 'mild';
    }

    getDipInterventions(hour, energy) {
        const interventions = [];
        
        if (energy < 50) {
            interventions.push('Hydration boost', 'Light movement', 'Breathing exercise');
        }
        
        if (hour >= 13 && hour <= 15) {
            interventions.push('Power nap (10-15 min)', 'Protein snack', 'Natural light exposure');
        }
        
        interventions.push('Task switching', 'Social interaction');
        
        return interventions;
    }

    calculatePersonalityFactors() {
        const personality = window.conversationContext?.personality || 'Analytical-Achiever';
        
        if (personality === 'Analytical-Achiever') {
            this.patterns.personalityFactors.set('morning_boost', 15);
            this.patterns.personalityFactors.set('complexity_preference', 10);
            this.patterns.personalityFactors.set('structure_bonus', 8);
            this.patterns.personalityFactors.set('interruption_penalty', -12);
        }
        
        // Add other personality types as needed
    }

    planOptimalAllocation() {
        const totalPoints = this.energyPoints;
        const peaks = this.forecast.peaks;
        
        if (peaks.length === 0) {
            // Default allocation if no clear peaks
            return;
        }

        // Allocate based on peak timing and energy requirements
        const majorPeak = peaks.find(p => p.type === 'major') || peaks[0];
        
        if (majorPeak && majorPeak.hour >= 9 && majorPeak.hour <= 12) {
            // Morning peak - favor deep work
            this.allocation.deepWork.allocated = 50;
            this.allocation.social.allocated = 20;
            this.allocation.learning.allocated = 20;
            this.allocation.admin.allocated = 10;
        } else if (majorPeak && majorPeak.hour >= 14 && majorPeak.hour <= 17) {
            // Afternoon peak - balance work and social
            this.allocation.deepWork.allocated = 35;
            this.allocation.social.allocated = 35;
            this.allocation.learning.allocated = 20;
            this.allocation.admin.allocated = 10;
        }

        this.calculateAllocationEfficiency();
    }

    calculateAllocationEfficiency() {
        Object.keys(this.allocation).forEach(category => {
            const allocated = this.allocation[category].allocated;
            const personalityMatch = this.getPersonalityMatchScore(category);
            const timingMatch = this.getTimingMatchScore(category);
            
            this.allocation[category].efficiency = Math.round(
                (personalityMatch * 0.6 + timingMatch * 0.4) * (allocated / 100) * 100
            );
        });
    }

    getPersonalityMatchScore(category) {
        const personality = window.conversationContext?.personality || 'Analytical-Achiever';
        
        const scores = {
            'Analytical-Achiever': {
                deepWork: 0.95,
                learning: 0.85,
                admin: 0.80,
                social: 0.70
            }
        };

        return scores[personality]?.[category] || 0.75;
    }

    getTimingMatchScore(category) {
        const currentHour = new Date().getHours();
        const currentEnergy = this.getCurrentEnergyEstimate();
        
        const optimalRanges = {
            deepWork: { min: 75, optimal: 90 },
            learning: { min: 65, optimal: 80 },
            social: { min: 55, optimal: 75 },
            admin: { min: 45, optimal: 65 }
        };

        const range = optimalRanges[category];
        if (currentEnergy >= range.optimal) return 1.0;
        if (currentEnergy >= range.min) return 0.8;
        return 0.5;
    }

    getCurrentEnergyEstimate() {
        const currentHour = new Date().getHours();
        const minute = new Date().getMinutes();
        const hourProgress = minute / 60;
        
        const currentHourData = this.forecast.hourly[currentHour];
        const nextHourData = this.forecast.hourly[(currentHour + 1) % 24];
        
        // Interpolate between current and next hour
        return currentHourData.predicted + 
               (nextHourData.predicted - currentHourData.predicted) * hourProgress;
    }

    optimizeEnergyAllocation() {
        notificationManager?.showNotification('⚛️ Quantum optimizing energy allocation...', 'quantum');
        
        setTimeout(() => {
            // Quantum-inspired optimization
            const optimization = this.runQuantumEnergyOptimization();
            this.applyOptimization(optimization);
            
            notificationManager?.showNotification('⚡ Energy allocation optimized!', 'success');
            this.updateDisplay();
        }, 2000);
    }

    runQuantumEnergyOptimization() {
        // Simulate quantum annealing for energy allocation
        const constraints = {
            totalPoints: this.energyPoints,
            minimums: { deepWork: 30, social: 15, learning: 15, admin: 5 },
            maximums: { deepWork: 60, social: 40, learning: 35, admin: 20 }
        };

        const solutions = [];
        
        // Generate multiple solutions
        for (let i = 0; i < 10; i++) {
            const solution = this.generateRandomAllocation(constraints);
            solution.score = this.scoreAllocation(solution);
            solutions.push(solution);
        }

        // Return best solution
        return solutions.sort((a, b) => b.score - a.score)[0];
    }

    generateRandomAllocation(constraints) {
        const { totalPoints, minimums, maximums } = constraints;
        let remaining = totalPoints;
        const allocation = {};

        // Allocate minimums first
        Object.keys(minimums).forEach(category => {
            allocation[category] = minimums[category];
            remaining -= minimums[category];
        });

        // Distribute remaining points
        Object.keys(allocation).forEach(category => {
            const maxAdditional = maximums[category] - allocation[category];
            const additional = Math.floor(Math.random() * Math.min(maxAdditional, remaining));
            allocation[category] += additional;
            remaining -= additional;
        });

        // Distribute any remaining points randomly
        while (remaining > 0) {
            const category = Object.keys(allocation)[Math.floor(Math.random() * Object.keys(allocation).length)];
            if (allocation[category] < maximums[category]) {
                allocation[category]++;
                remaining--;
            }
        }

        return allocation;
    }

    scoreAllocation(allocation) {
        let score = 0;
        
        // Score based on personality match
        Object.keys(allocation).forEach(category => {
            const personalityScore = this.getPersonalityMatchScore(category);
            const allocationRatio = allocation[category] / this.energyPoints;
            score += personalityScore * allocationRatio * 100;
        });

        // Bonus for balanced allocation
        const variance = this.calculateAllocationVariance(allocation);
        score += Math.max(0, 20 - variance);

        return score;
    }

    calculateAllocationVariance(allocation) {
        const values = Object.values(allocation);
        const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
        const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
        return Math.sqrt(variance);
    }

    applyOptimization(optimization) {
        Object.keys(optimization).forEach(category => {
            if (this.allocation[category]) {
                this.allocation[category].allocated = optimization[category];
            }
        });
        
        this.calculateAllocationEfficiency();
    }

    setupRealTimeTracking() {
        setInterval(() => {
            this.updateRealTimeFactors();
            this.updateCurrentEnergy();
            this.checkForInterventions();
        }, 60000); // Update every minute
    }

    updateRealTimeFactors() {
        // Update biometric factor
        if (biometricManager) {
            const stress = biometricManager.data.stressLevel;
            const hrv = biometricManager.data.hrv;
            this.realTimeFactors.biometric.current = this.calculateBiometricEnergyImpact(stress, hrv);
        }

        // Update activity factor
        if (screenTimeManager) {
            const efficiency = screenTimeManager.calculateOverallEfficiency();
            this.realTimeFactors.activity.current = (efficiency - 50) * 0.5; // Convert to -25 to +25 range
        }

        // Update environmental factor (placeholder)
        this.realTimeFactors.environment.current = this.calculateEnvironmentalImpact();
    }

    calculateBiometricEnergyImpact(stress, hrv) {
        // Lower stress and higher HRV = higher energy
        const stressImpact = (100 - stress) * 0.3; // 0-30 range
        const hrvImpact = (hrv - 20) * 0.5; // Assuming 20-60 HRV range
        return Math.max(-20, Math.min(20, stressImpact + hrvImpact - 25));
    }

    calculateEnvironmentalImpact() {
        const hour = new Date().getHours();
        let impact = 0;
        
        // Natural light boost
        if (hour >= 8 && hour <= 17) impact += 5;
        
        // Temperature comfort (simulated)
        impact += (Math.random() - 0.5) * 10;
        
        return Math.max(-10, Math.min(10, impact));
    }

    updateCurrentEnergy() {
        const baseEnergy = this.getCurrentEnergyEstimate();
        let adjustedEnergy = baseEnergy;

        // Apply real-time factors
        Object.values(this.realTimeFactors).forEach(factor => {
            adjustedEnergy += factor.current * factor.weight;
        });

        this.currentEnergy = Math.max(10, Math.min(100, adjustedEnergy));
        
        // Store for history
        this.recordEnergyReading();
    }

    recordEnergyReading() {
        const reading = {
            timestamp: Date.now(),
            energy: this.currentEnergy,
            factors: { ...this.realTimeFactors },
            hour: new Date().getHours(),
            activities: this.getCurrentActivities()
        };

        this.history.daily.push(reading);
        
        // Keep only last 24 hours
        const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
        this.history.daily = this.history.daily.filter(r => r.timestamp > oneDayAgo);
    }

    getCurrentActivities() {
        // Placeholder for current activity detection
        const hour = new Date().getHours();
        if (hour >= 9 && hour <= 12) return ['focused_work'];
        if (hour >= 14 && hour <= 17) return ['meetings', 'collaboration'];
        if (hour >= 18 && hour <= 20) return ['planning', 'reflection'];
        return ['general'];
    }

    checkForInterventions() {
        const currentHour = new Date().getHours();
        const currentMinute = new Date().getMinutes();
        const currentTime = currentHour + currentMinute / 60;

        // Check for upcoming dip
        if (this.patterns.energyDip && 
            Math.abs(currentTime - this.patterns.energyDip.time) < 0.5 && // Within 30 minutes
            this.currentEnergy > 60) {
            this.triggerPreventiveIntervention();
        }

        // Check for current low energy
        if (this.currentEnergy < 45) {
            this.triggerReactiveIntervention();
        }

        // Check for optimal windows
        if (this.isInOptimalWindow() && this.currentEnergy > 80) {
            this.suggestHighValueActivity();
        }
    }

    triggerPreventiveIntervention() {
        const interventions = [
            'Hydrate before energy dip (preventive intervention)',
            'Light protein snack recommended',
            'Consider short break before dip arrives',
            'Prepare for 2:17 PM energy dip with breathing exercise'
        ];

        const intervention = interventions[Math.floor(Math.random() * interventions.length)];
        notificationManager?.showNotification(`🛡️ ${intervention}`, 'warning');
        
        this.interventions.preventive.push({
            timestamp: Date.now(),
            type: 'energy_dip_prevention',
            action: intervention,
            success: null // Will be updated later
        });
    }

    triggerReactiveIntervention() {
        const interventions = [
            'Energy boost recommended: 5-minute walk',
            'Quick hydration break needed',
            'Consider switching to lighter tasks',
            'Breathing exercise for energy recovery'
        ];

        const intervention = interventions[Math.floor(Math.random() * interventions.length)];
        notificationManager?.showNotification(`⚡ ${intervention}`, 'info');
        
        this.interventions.reactive.push({
            timestamp: Date.now(),
            type: 'low_energy_recovery',
            action: intervention,
            energyBefore: this.currentEnergy
        });
    }

    suggestHighValueActivity() {
        const suggestions = [
            'Peak energy detected - perfect for complex analysis',
            'Optimal window for deep work on important projects',
            'High energy state - tackle your most challenging task',
            'Peak cognitive performance - focus on priority work'
        ];

        const suggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
        notificationManager?.showNotification(`🎯 ${suggestion}`, 'success');
    }

    isInOptimalWindow() {
        const currentHour = new Date().getHours();
        return currentHour >= this.patterns.peakWindow.start && 
               currentHour <= this.patterns.peakWindow.end;
    }

    startEnergySimulation() {
        // Simulate energy changes throughout the day
        setInterval(() => {
            this.simulateEnergyFluctuation();
        }, 30000); // Update every 30 seconds for demo
    }

    simulateEnergyFluctuation() {
        // Small random fluctuations
        const fluctuation = (Math.random() - 0.5) * 2; // ±1 energy point
        this.currentEnergy = Math.max(10, Math.min(100, this.currentEnergy + fluctuation));
        
        this.updateDisplay();
    }

    updateDisplay() {
        // Update main energy display
        const updates = {
            'currentEnergy': `${Math.round(this.currentEnergy)}%`,
            'energyForecast': `${Math.round(this.getCurrentEnergyEstimate())}%`,
            'nextEnergyDip': this.formatTimeFromHour(this.patterns.energyDip.time),
            'peakWindow': this.formatTimeRange(this.patterns.peakWindow.start, this.patterns.peakWindow.end),
            'energyPoints': `${this.energyPoints} points available`
        };

        Object.entries(updates).forEach(([id, value]) => {
            uiManager?.updateElement(id, value);
        });

        // Update context
        if (window.conversationContext) {
            window.conversationContext.energyLevel = Math.round(this.currentEnergy);
        }

        this.updateEnergyForecastChart();
        this.updateAllocationDisplay();
    }

    updateEnergyForecastChart() {
        const forecastChart = document.getElementById('energyForecast');
        if (!forecastChart) return;

        const bars = this.forecast.hourly.map(hour => {
            let className = 'forecast-bar';
            if (hour.predicted > 85) className += ' peak';
            else if (hour.predicted < 55) className += ' low';
            
            const height = Math.max(10, hour.predicted);
            return `<div class="${className}" style="height: ${height}%" title="Hour ${hour.hour}: ${Math.round(hour.predicted)}% energy"></div>`;
        });

        forecastChart.innerHTML = bars.join('');
    }

    updateAllocationDisplay() {
        Object.entries(this.allocation).forEach(([category, data]) => {
            const percentage = (data.allocated / this.energyPoints) * 100;
            
            // Update allocation bar
            const bar = document.querySelector(`[data-category="${category}"] .allocation-fill`);
            if (bar) {
                bar.style.width = `${percentage}%`;
            }

            // Update allocation text
            const pointsElement = document.querySelector(`[data-category="${category}"] .category-allocation`);
            if (pointsElement) {
                pointsElement.textContent = `${data.allocated} points`;
            }

            // Update efficiency indicator
            const efficiencyElement = document.querySelector(`[data-category="${category}"] .efficiency-indicator`);
            if (efficiencyElement) {
                efficiencyElement.textContent = `${data.efficiency}% efficiency`;
            }
        });
    }

    formatTimeFromHour(hourFloat) {
        const hour = Math.floor(hourFloat);
        const minute = Math.round((hourFloat - hour) * 60);
        return `${hour}:${minute.toString().padStart(2, '0')}`;
    }

    formatTimeRange(startHour, endHour) {
        return `${startHour}:00-${endHour}:00`;
    }

    // Public API methods
    getEnergyBriefing() {
        return {
            current: Math.round(this.currentEnergy),
            forecast: this.forecast.hourly.slice(new Date().getHours(), new Date().getHours() + 6),
            nextPeak: this.getNextPeak(),
            nextDip: this.getNextDip(),
            recommendations: this.getEnergyRecommendations(),
            allocation: this.allocation
        };
    }

    getNextPeak() {
        const currentHour = new Date().getHours();
        return this.forecast.peaks.find(peak => peak.hour > currentHour) || this.forecast.peaks[0];
    }

    getNextDip() {
        const currentHour = new Date().getHours();
        return this.forecast.dips.find(dip => dip.hour > currentHour) || this.forecast.dips[0];
    }

    getEnergyRecommendations() {
        const recommendations = [];
        const currentEnergy = this.currentEnergy;
        const currentHour = new Date().getHours();

        if (currentEnergy > 80) {
            recommendations.push('Perfect time for deep analytical work');
            recommendations.push('Tackle your most challenging tasks now');
        } else if (currentEnergy < 50) {
            recommendations.push('Consider lighter administrative tasks');
            recommendations.push('Take a short energizing break');
        } else {
            recommendations.push('Good time for collaborative work');
            recommendations.push('Balance focused work with communication');
        }

        if (this.isInOptimalWindow()) {
            recommendations.push('You\'re in your peak performance window');
        }

        return recommendations;
    }

    spendEnergyPoints(category, amount) {
        if (this.allocation[category] && this.allocation[category].allocated >= amount) {
            this.allocation[category].used += amount;
            this.allocation[category].allocated -= amount;
            this.updateDisplay();
            return true;
        }
        return false;
    }

    resetDailyAllocation() {
        Object.keys(this.allocation).forEach(category => {
            this.allocation[category].used = 0;
            this.allocation[category].allocated = this.getDefaultAllocation(category);
        });
        
        this.energyPoints = 100;
        this.updateDisplay();
        notificationManager?.showNotification('⚡ Daily energy allocation reset', 'info');
    }

    getDefaultAllocation(category) {
        const defaults = { deepWork: 45, social: 25, learning: 20, admin: 10 };
        return defaults[category] || 0;
    }

    exportEnergyData() {
        const exportData = {
            timestamp: new Date().toISOString(),
            currentEnergy: this.currentEnergy,
            forecast: this.forecast,
            allocation: this.allocation,
            patterns: this.patterns,
            history: this.history,
            interventions: this.interventions
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'energy-data.json';
        a.click();

        notificationManager?.showNotification('⚡ Energy data exported', 'success');
    }

    // Integration methods
    integrateWithQuantum() {
        if (quantumEngine) {
            const quantumOptimization = quantumEngine.runQuantumAnnealing('energy_optimization');
            return quantumOptimization;
        }
        return null;
    }

    integrateWithBiometrics() {
        if (biometricManager) {
            const correlation = this.calculateEnergyBiometricCorrelation();
            this.patterns.correlations.set('energy-biometric', correlation);
            return correlation;
        }
        return null;
    }

    calculateEnergyBiometricCorrelation() {
        return {
            energyHRCorrelation: 0.78,
            energyStressCorrelation: -0.82,
            energyHRVCorrelation: 0.71,
            confidence: 89
        };
    }
}

// Export for global access
window.energyManager = new EnergyManager();