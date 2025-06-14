class ScreenTimeManager {
    constructor() {
        this.dailyData = {
            totalTime: 6.3, // hours
            productiveTime: 4.2,
            socialTime: 1.8,
            distractionTime: 0.3,
            categories: {
                productive: { time: 4.2, percentage: 68, apps: ['VSCode', 'Notion', 'Analytics'] },
                social: { time: 1.8, percentage: 29, apps: ['Slack', 'Email', 'Teams'] },
                distraction: { time: 0.3, percentage: 3, apps: ['Social Media', 'News'] }
            }
        };

        this.hourlyData = Array.from({ length: 24 }, () => ({
            hour: 0,
            total: 0,
            productive: 0,
            social: 0,
            distraction: 0,
            efficiency: 0
        }));

        this.patterns = {
            peakProductivity: { start: 9, end: 11, efficiency: 92 },
            socialWindow: { start: 14, end: 16, efficiency: 73 },
            eveningReflection: { start: 18, end: 20, efficiency: 81 },
            focusBlocks: [],
            interruptionCount: 0,
            averageSessionLength: 0
        };

        this.insights = {
            weeklyTrend: 'improving',
            optimalSchedule: [],
            recommendations: [],
            personalityAdaptations: []
        };

        this.focusSession = {
            active: false,
            startTime: null,
            duration: 0,
            interruptions: 0,
            productivity: 0
        };

        this.init();
    }

    init() {
        this.generateHourlyData();
        this.calculatePatterns();
        this.generateInsights();
        this.updateDisplay();
        this.startRealTimeTracking();
        console.log('📱 Screen Time Manager initialized');
    }

    generateHourlyData() {
        // Simulate realistic hourly screen time data
        for (let hour = 0; hour < 24; hour++) {
            this.hourlyData[hour].hour = hour;
            
            let baseUsage = 0;
            let productiveRatio = 0.3;
            let socialRatio = 0.4;
            let distractionRatio = 0.3;

            // Work hours (9-17) - high productive usage
            if (hour >= 9 && hour <= 17) {
                baseUsage = 0.8 + Math.random() * 0.4; // 0.8-1.2 hours
                productiveRatio = 0.7 + Math.random() * 0.2; // 70-90% productive
                socialRatio = 0.2 + Math.random() * 0.1; // 20-30% social
                distractionRatio = 0.05 + Math.random() * 0.05; // 5-10% distraction
            }
            // Evening hours (18-22) - mixed usage
            else if (hour >= 18 && hour <= 22) {
                baseUsage = 0.3 + Math.random() * 0.3; // 0.3-0.6 hours
                productiveRatio = 0.4 + Math.random() * 0.2; // 40-60% productive
                socialRatio = 0.4 + Math.random() * 0.2; // 40-60% social
                distractionRatio = 0.1 + Math.random() * 0.1; // 10-20% distraction
            }
            // Night/early morning (23-8) - low usage
            else {
                baseUsage = 0.05 + Math.random() * 0.1; // 0.05-0.15 hours
                productiveRatio = 0.2;
                socialRatio = 0.3;
                distractionRatio = 0.5;
            }

            this.hourlyData[hour].total = baseUsage;
            this.hourlyData[hour].productive = baseUsage * productiveRatio;
            this.hourlyData[hour].social = baseUsage * socialRatio;
            this.hourlyData[hour].distraction = baseUsage * distractionRatio;
            this.hourlyData[hour].efficiency = Math.round(productiveRatio * 100);
        }
    }

    calculatePatterns() {
        // Find peak productivity windows
        let maxEfficiency = 0;
        let peakHour = 9;

        this.hourlyData.forEach((hour, index) => {
            if (hour.efficiency > maxEfficiency && index >= 6 && index <= 18) {
                maxEfficiency = hour.efficiency;
                peakHour = index;
            }
        });

        this.patterns.peakProductivity = {
            start: Math.max(6, peakHour - 1),
            end: Math.min(18, peakHour + 2),
            efficiency: maxEfficiency
        };

        // Calculate focus blocks
        this.patterns.focusBlocks = this.identifyFocusBlocks();
        
        // Calculate average session length
        this.patterns.averageSessionLength = this.calculateAverageSessionLength();
        
        // Calculate interruption patterns
        this.patterns.interruptionCount = this.calculateInterruptions();
    }

    identifyFocusBlocks() {
        const focusBlocks = [];
        let currentBlock = null;

        this.hourlyData.forEach((hour, index) => {
            if (hour.efficiency > 70 && hour.productive > 0.3) {
                if (!currentBlock) {
                    currentBlock = {
                        start: index,
                        end: index,
                        duration: 1,
                        avgEfficiency: hour.efficiency,
                        totalProductive: hour.productive
                    };
                } else {
                    currentBlock.end = index;
                    currentBlock.duration++;
                    currentBlock.avgEfficiency = (currentBlock.avgEfficiency + hour.efficiency) / 2;
                    currentBlock.totalProductive += hour.productive;
                }
            } else {
                if (currentBlock && currentBlock.duration >= 2) {
                    focusBlocks.push(currentBlock);
                }
                currentBlock = null;
            }
        });

        if (currentBlock && currentBlock.duration >= 2) {
            focusBlocks.push(currentBlock);
        }

        return focusBlocks;
    }

    calculateAverageSessionLength() {
        // Simulate session tracking
        const sessions = Array.from({ length: 15 }, () => ({
            duration: 15 + Math.random() * 45, // 15-60 minutes
            productive: Math.random() > 0.3
        }));

        const productiveSessions = sessions.filter(s => s.productive);
        return productiveSessions.reduce((sum, s) => sum + s.duration, 0) / productiveSessions.length;
    }

    calculateInterruptions() {
        // Simulate interruption tracking
        return Math.floor(Math.random() * 15 + 5); // 5-20 interruptions per day
    }

    generateInsights() {
        this.insights.recommendations = [
            'Schedule analytical tasks during 9-11 AM peak window',
            'Use afternoon energy for meetings and communication',
            'Limit notification interrupts during deep work blocks',
            'Evening planning activities show 81% effectiveness'
        ];

        this.insights.personalityAdaptations = [
            'Analytical focus blocks: 92% efficiency during peak hours',
            'Data-driven task scheduling: Optimal alignment detected',
            'Systematic break patterns: Supporting sustained deep work',
            'Pattern recognition: Consistent productivity rhythms'
        ];

        this.insights.optimalSchedule = this.generateOptimalSchedule();
    }

    generateOptimalSchedule() {
        return [
            { time: '9:00-11:30', activity: 'Deep analytical work', efficiency: 94 },
            { time: '11:30-12:00', activity: 'Structured break', efficiency: 85 },
            { time: '12:00-13:00', activity: 'Administrative tasks', efficiency: 78 },
            { time: '14:00-16:00', activity: 'Meetings & collaboration', efficiency: 82 },
            { time: '16:00-17:00', activity: 'Communication & email', efficiency: 75 },
            { time: '18:00-19:00', activity: 'Planning & reflection', efficiency: 81 }
        ];
    }

    updateDisplay() {
        // Update main statistics
        const updates = {
            'productiveTime': `${this.dailyData.productiveTime}h`,
            'socialTime': `${this.dailyData.socialTime}h`,
            'distractionTime': `${this.dailyData.distractionTime}h`,
            'productivePercentage': `${this.dailyData.categories.productive.percentage}%`,
            'screenEfficiency': `${this.dailyData.categories.productive.percentage}%`
        };

        Object.entries(updates).forEach(([id, value]) => {
            uiManager?.updateElement(id, value);
        });

        this.updateScreenBars();
        this.updateEfficiencyChart();
    }

    updateScreenBars() {
        const screenBars = document.getElementById('screenBars');
        if (!screenBars) return;

        const bars = this.hourlyData.map(hour => {
            let className = 'screen-bar';
            let height = Math.min(100, (hour.total / 1.5) * 100); // Normalize to 1.5h max

            // Determine primary activity type
            if (hour.productive > hour.social && hour.productive > hour.distraction) {
                className += ' productive';
            } else if (hour.social > hour.distraction) {
                className += ' social';
            } else {
                className += ' distraction';
            }

            return `<div class="${className}" style="height: ${height}%" title="Hour ${hour.hour}: ${hour.total.toFixed(1)}h total, ${hour.efficiency}% efficient"></div>`;
        });

        screenBars.innerHTML = bars.join('');
    }

    updateEfficiencyChart() {
        // Update any efficiency visualization
        const chart = document.getElementById('efficiencyChart');
        if (chart) {
            // Implementation for efficiency chart updates
            this.renderEfficiencyChart(chart);
        }
    }

    renderEfficiencyChart(canvas) {
        const ctx = canvas.getContext('2d');
        const width = canvas.width = canvas.offsetWidth;
        const height = canvas.height = canvas.offsetHeight;

        ctx.clearRect(0, 0, width, height);

        // Draw efficiency line
        ctx.strokeStyle = '#667eea';
        ctx.lineWidth = 2;
        ctx.beginPath();

        this.hourlyData.forEach((hour, index) => {
            const x = (index / 23) * width;
            const y = height - (hour.efficiency / 100) * height;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.stroke();

        // Highlight peak productivity window
        const peakStart = (this.patterns.peakProductivity.start / 23) * width;
        const peakEnd = (this.patterns.peakProductivity.end / 23) * width;
        
        ctx.fillStyle = 'rgba(102, 126, 234, 0.2)';
        ctx.fillRect(peakStart, 0, peakEnd - peakStart, height);
    }

    startFocusSession(duration = 90) {
        if (this.focusSession.active) {
            notificationManager?.showNotification('Focus session already active', 'warning');
            return;
        }

        this.focusSession = {
            active: true,
            startTime: Date.now(),
            duration: duration * 60 * 1000, // Convert to milliseconds
            interruptions: 0,
            productivity: 0
        };

        notificationManager?.showNotification(`🎯 ${duration}-minute focus session started`, 'success');
        this.startFocusTracking();
    }

    startFocusTracking() {
        const updateInterval = setInterval(() => {
            if (!this.focusSession.active) {
                clearInterval(updateInterval);
                return;
            }

            const elapsed = Date.now() - this.focusSession.startTime;
            const remaining = this.focusSession.duration - elapsed;

            if (remaining <= 0) {
                this.endFocusSession();
                clearInterval(updateInterval);
            } else {
                this.updateFocusProgress(elapsed, this.focusSession.duration);
            }
        }, 1000);
    }

    updateFocusProgress(elapsed, total) {
        const percentage = (elapsed / total) * 100;
        const minutes = Math.floor(elapsed / 60000);
        const remainingMinutes = Math.floor((total - elapsed) / 60000);

        // Update focus session UI if it exists
        uiManager?.updateElement('focusProgress', `${percentage.toFixed(1)}%`);
        uiManager?.updateElement('focusRemaining', `${remainingMinutes} min remaining`);
    }

    endFocusSession() {
        if (!this.focusSession.active) return;

        const sessionDuration = (Date.now() - this.focusSession.startTime) / 60000; // minutes
        const productivity = Math.max(0, 100 - (this.focusSession.interruptions * 10));

        this.focusSession.active = false;
        this.focusSession.productivity = productivity;

        // Add to gamification
        const xpGained = Math.round(sessionDuration * (productivity / 100));
        gamificationManager?.addXp('productivity-warrior', xpGained, 'Focus session completed');

        notificationManager?.showNotification(
            `🎯 Focus session complete! ${sessionDuration.toFixed(0)} min, ${productivity}% productivity (+${xpGained} XP)`,
            'success'
        );

        this.recordFocusSession(sessionDuration, productivity);
    }

    recordFocusSession(duration, productivity) {
        // Record focus session data
        const session = {
            timestamp: Date.now(),
            duration,
            productivity,
            interruptions: this.focusSession.interruptions,
            timeOfDay: new Date().getHours()
        };

        // Store in analytics
        analyticsManager?.trackEvent('focus_session_completed', session);
    }

    addInterruption(source = 'unknown') {
        if (this.focusSession.active) {
            this.focusSession.interruptions++;
            notificationManager?.showNotification(`📱 Interruption detected (${this.focusSession.interruptions})`, 'warning');
        }
    }

    analyzeScreenTime() {
        const analysis = {
            overall: this.generateOverallAnalysis(),
            patterns: this.generatePatternAnalysis(),
            recommendations: this.generatePersonalizedRecommendations(),
            comparison: this.generateComparison()
        };

        return analysis;
    }

    generateOverallAnalysis() {
        return {
            totalTime: this.dailyData.totalTime,
            productivity: this.dailyData.categories.productive.percentage,
            efficiency: this.calculateOverallEfficiency(),
            trend: this.insights.weeklyTrend,
            score: this.calculateScreenTimeScore()
        };
    }

    generatePatternAnalysis() {
        return {
            peakHours: `${this.patterns.peakProductivity.start}:00-${this.patterns.peakProductivity.end}:00`,
            peakEfficiency: `${this.patterns.peakProductivity.efficiency}%`,
            focusBlocks: this.patterns.focusBlocks.length,
            avgSessionLength: `${this.patterns.averageSessionLength.toFixed(0)} min`,
            interruptions: this.patterns.interruptionCount
        };
    }

    generatePersonalizedRecommendations() {
        const personality = window.conversationContext?.personality || 'Analytical-Achiever';
        
        const baseRecs = [
            'Schedule demanding work during your 9-11 AM peak window',
            'Use afternoon hours for collaborative and social activities',
            'Implement 25-minute focused work blocks with 5-minute breaks',
            'Set up distraction blocking during high-productivity hours'
        ];

        if (personality === 'Analytical-Achiever') {
            baseRecs.push(
                'Leverage your systematic approach with time-blocked scheduling',
                'Use data from screen time patterns to optimize daily structure',
                'Set measurable productivity goals for each focus session'
            );
        }

        return baseRecs;
    }

    generateComparison() {
        return {
            vsAverage: '+23% more productive than average user',
            vsLastWeek: '+12% improvement in focus time',
            vsOptimal: '87% of theoretical optimal productivity'
        };
    }

    calculateOverallEfficiency() {
        const totalEfficiency = this.hourlyData.reduce((sum, hour) => {
            return sum + (hour.efficiency * hour.total);
        }, 0);
        
        const totalTime = this.hourlyData.reduce((sum, hour) => sum + hour.total, 0);
        return Math.round(totalEfficiency / totalTime);
    }

    calculateScreenTimeScore() {
        const productivityWeight = 0.4;
        const efficiencyWeight = 0.3;
        const focusWeight = 0.2;
        const balanceWeight = 0.1;

        const productivityScore = this.dailyData.categories.productive.percentage;
        const efficiencyScore = this.calculateOverallEfficiency();
        const focusScore = Math.min(100, this.patterns.focusBlocks.length * 25);
        const balanceScore = 100 - Math.abs(50 - (this.dailyData.categories.social.percentage + this.dailyData.categories.distraction.percentage));

        return Math.round(
            productivityScore * productivityWeight +
            efficiencyScore * efficiencyWeight +
            focusScore * focusWeight +
            balanceScore * balanceWeight
        );
    }

    getScreenTimeInsights() {
        return {
            summary: `${this.dailyData.categories.productive.percentage}% productive time with ${this.patterns.peakProductivity.efficiency}% peak efficiency`,
            keyInsight: this.generateKeyInsight(),
            nextAction: this.generateNextAction(),
            weeklyTrend: this.insights.weeklyTrend
        };
    }

    generateKeyInsight() {
        const insights = [
            `Your analytical profile shows excellent alignment with morning productivity patterns`,
            `Focus sessions during 9-11 AM window show ${this.patterns.peakProductivity.efficiency}% efficiency`,
            `Systematic break patterns are supporting sustained deep work`,
            `Screen time optimization potential: ${100 - this.calculateScreenTimeScore()}% improvement available`
        ];

        return insights[Math.floor(Math.random() * insights.length)];
    }

    generateNextAction() {
        const actions = [
            'Start a 90-minute focus session during your peak window',
            'Review and block distracting apps during work hours',
            'Set up automated focus mode for your productive hours',
            'Analyze which specific apps contribute most to productive time'
        ];

        return actions[Math.floor(Math.random() * actions.length)];
    }

    startRealTimeTracking() {
        // Simulate real-time screen time tracking
        setInterval(() => {
            this.updateCurrentUsage();
        }, 60000); // Update every minute
    }

    updateCurrentUsage() {
        const currentHour = new Date().getHours();
        const hourData = this.hourlyData[currentHour];
        
        // Simulate small increments
        const increment = Math.random() * 0.02; // Up to 1.2 minutes
        hourData.total += increment;
        
        // Distribute increment based on current time patterns
        if (currentHour >= 9 && currentHour <= 17) {
            hourData.productive += increment * 0.7;
            hourData.social += increment * 0.25;
            hourData.distraction += increment * 0.05;
        } else {
            hourData.productive += increment * 0.4;
            hourData.social += increment * 0.4;
            hourData.distraction += increment * 0.2;
        }

        this.updateDisplay();
    }

    exportScreenTimeData() {
        const exportData = {
            timestamp: new Date().toISOString(),
            dailyData: this.dailyData,
            hourlyData: this.hourlyData,
            patterns: this.patterns,
            insights: this.insights,
            analysis: this.analyzeScreenTime()
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'screen-time-analysis.json';
        a.click();

        notificationManager?.showNotification('📱 Screen time data exported', 'success');
    }

    // Integration methods
    integrateWithBiometrics() {
        if (biometricManager) {
            // Correlate screen time with stress/energy levels
            const correlation = this.calculateBiometricCorrelation();
            return correlation;
        }
        return null;
    }

    calculateBiometricCorrelation() {
        return {
            stressScreenCorrelation: 0.68,
            energyProductivityCorrelation: 0.84,
            focusHRVCorrelation: 0.72
        };
    }

    integrateWithQuantum() {
        if (quantumEngine) {
            // Use quantum optimization for screen time patterns
            return quantumEngine.runQuantumAnnealing('screen_time_optimization');
        }
        return null;
    }
}

// Export for global access
window.screenTimeManager = new ScreenTimeManager();