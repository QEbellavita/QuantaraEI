class ContextManager {
    constructor() {
        this.context = {
            // Core Identity
            personality: {
                type: 'Analytical-Achiever',
                confidence: 87,
                traits: {
                    openness: 78,
                    conscientiousness: 91,
                    extraversion: 65,
                    agreeableness: 82,
                    neuroticism: 23
                },
                preferences: {
                    communicationStyle: 'data-driven',
                    learningStyle: 'structured',
                    decisionMaking: 'analytical',
                    problemSolving: 'systematic'
                }
            },

            // Current State
            currentState: {
                mood: 'Focused',
                energyLevel: 82,
                stressLevel: 15,
                motivation: 88,
                cognitiveLoad: 45,
                socialEnergy: 70,
                timeOfDay: 'morning',
                contextualFocus: 'productivity'
            },

            // Temporal Context
            temporal: {
                timeOfDay: 'morning',
                dayOfWeek: 'weekday',
                timeInSession: 0,
                lastInteraction: null,
                sessionStart: Date.now(),
                conversationDepth: 0,
                responseCount: 0
            },

            // Activity Context
            activities: {
                recent: ['meditation', 'planning', 'coffee'],
                current: 'ai_conversation',
                planned: ['deep_work', 'meeting_prep'],
                patterns: new Map(),
                preferences: new Map()
            },

            // Goal Context
            goals: {
                immediate: 'productivity_optimization',
                shortTerm: ['energy_management', 'focus_improvement'],
                longTerm: ['career_advancement', 'health_optimization'],
                activeGoal: 'productivity',
                progress: new Map(),
                priorities: ['efficiency', 'learning', 'wellness']
            },

            // Environmental Context
            environment: {
                location: 'office',
                lighting: 'optimal',
                noise: 'quiet',
                temperature: 'comfortable',
                distractions: 'minimal',
                deviceContext: 'mobile',
                networkQuality: 'good'
            },

            // Biometric Context
            biometric: {
                heartRate: 72,
                hrv: 45,
                stressIndicators: 'low',
                sleepQuality: 89,
                hydrationLevel: 'good',
                lastMeal: 2.5, // hours ago
                caffeineLevel: 'moderate'
            },

            // Social Context
            social: {
                recentInteractions: ['team_standup', 'client_call'],
                socialEnergy: 70,
                communicationPreferences: ['direct', 'concise', 'data_driven'],
                relationshipContext: 'professional',
                teamDynamics: 'collaborative'
            },

            // Learning Context
            learning: {
                currentTopics: ['productivity', 'ai_optimization'],
                learningStyle: 'analytical',
                comprehensionLevel: 'advanced',
                curiosityAreas: ['quantum_computing', 'biohacking'],
                knowledgeGaps: [],
                recentLearnings: []
            },

            // Quantum Context
            quantum: {
                coherenceLevel: 87.3,
                optimizationScore: 91.2,
                parallelPathways: 5,
                entanglementStrength: 0.84,
                superpositionState: 'high_performance',
                activeOptimizers: 6
            }
        };

        this.contextHistory = [];
        this.patterns = new Map();
        this.adaptations = new Map();
        this.insights = [];
        this.learningModel = new Map();
        this.correlations = new Map();
        
        this.updateIntervals = {
            rapid: null,    // Every 30 seconds
            standard: null, // Every 2 minutes
            slow: null      // Every 10 minutes
        };

        this.init();
    }

    init() {
        this.detectInitialContext();
        this.startContextTracking();
        this.loadPersonalityModel();
        this.initializePatternRecognition();
        this.setupContextIntegrations();
        this.startAdaptiveLearning();
        console.log('🧠 Context Manager initialized');
    }

    detectInitialContext() {
        const now = new Date();
        
        // Detect time context
        this.context.temporal.timeOfDay = this.getTimeOfDay(now.getHours());
        this.context.temporal.dayOfWeek = now.getDay() === 0 || now.getDay() === 6 ? 'weekend' : 'weekday';
        
        // Detect device context
        this.context.environment.deviceContext = this.detectDeviceType();
        
        // Set initial activity based on time
        this.context.activities.current = this.inferCurrentActivity();
        
        // Update current state context
        this.updateCurrentStateContext();
    }

    getTimeOfDay(hour) {
        if (hour >= 5 && hour < 12) return 'morning';
        if (hour >= 12 && hour < 17) return 'afternoon';
        if (hour >= 17 && hour < 21) return 'evening';
        return 'night';
    }

    detectDeviceType() {
        const userAgent = navigator.userAgent;
        if (/iPhone|iPad|iPod/.test(userAgent)) return 'ios';
        if (/Android/.test(userAgent)) return 'android';
        if (/Mobile/.test(userAgent)) return 'mobile';
        return 'desktop';
    }

    inferCurrentActivity() {
        const hour = new Date().getHours();
        const timeOfDay = this.context.temporal.timeOfDay;
        
        if (timeOfDay === 'morning' && hour >= 9 && hour <= 12) {
            return 'focused_work';
        } else if (timeOfDay === 'afternoon' && hour >= 14 && hour <= 17) {
            return 'collaborative_work';
        } else if (timeOfDay === 'evening') {
            return 'planning_reflection';
        }
        
        return 'general_interaction';
    }

    updateCurrentStateContext() {
        // Integrate with other managers
        if (energyManager) {
            this.context.currentState.energyLevel = energyManager.currentEnergy;
        }
        
        if (biometricManager) {
            this.context.currentState.stressLevel = biometricManager.data.stressLevel;
            this.context.biometric.heartRate = biometricManager.data.heartRate;
            this.context.biometric.hrv = biometricManager.data.hrv;
        }
        
        if (quantumEngine) {
            this.context.quantum.coherenceLevel = quantumEngine.coherenceLevel;
            this.context.quantum.optimizationScore = quantumEngine.optimizationScore;
            this.context.quantum.parallelPathways = quantumEngine.parallelPathways;
        }
        
        // Update global context for AI conversation
        if (window.conversationContext) {
            Object.assign(window.conversationContext, {
                personality: this.context.personality.type,
                currentMood: this.context.currentState.mood,
                energyLevel: this.context.currentState.energyLevel,
                timeOfDay: this.context.temporal.timeOfDay,
                goalContext: this.context.goals.activeGoal,
                quantumCoherence: this.context.quantum.coherenceLevel,
                optimizationScore: this.context.quantum.optimizationScore
            });
        }
    }

    startContextTracking() {
        // Rapid updates (30 seconds) - Current state, biometrics
        this.updateIntervals.rapid = setInterval(() => {
            this.updateRapidContext();
        }, 30000);

        // Standard updates (2 minutes) - Activities, environment
        this.updateIntervals.standard = setInterval(() => {
            this.updateStandardContext();
        }, 120000);

        // Slow updates (10 minutes) - Patterns, learning, adaptations
        this.updateIntervals.slow = setInterval(() => {
            this.updateSlowContext();
        }, 600000);
    }

    updateRapidContext() {
        // Update temporal context
        this.context.temporal.timeInSession = Date.now() - this.context.temporal.sessionStart;
        
        // Update current state from integrations
        this.updateCurrentStateContext();
        
        // Update mood based on interactions and biometrics
        this.updateMoodContext();
        
        // Update cognitive load
        this.updateCognitiveLoad();
    }

    updateStandardContext() {
        // Update activity context
        this.updateActivityContext();
        
        // Update environmental context
        this.updateEnvironmentalContext();
        
        // Update social context
        this.updateSocialContext();
        
        // Record context snapshot
        this.recordContextSnapshot();
    }

    updateSlowContext() {
        // Update learning patterns
        this.updateLearningPatterns();
        
        // Update goal progress
        this.updateGoalProgress();
        
        // Analyze context patterns
        this.analyzeContextPatterns();
        
        // Generate insights
        this.generateContextInsights();
        
        // Adapt personality model
        this.adaptPersonalityModel();
    }

    updateMoodContext() {
        let mood = this.context.currentState.mood;
        
        // Factor in energy level
        const energy = this.context.currentState.energyLevel;
        const stress = this.context.currentState.stressLevel;
        
        if (energy > 80 && stress < 25) {
            mood = 'Energized';
        } else if (energy > 70 && stress < 35) {
            mood = 'Focused';
        } else if (stress > 60) {
            mood = 'Stressed';
        } else if (energy < 40) {
            mood = 'Low Energy';
        } else {
            mood = 'Balanced';
        }
        
        // Factor in recent activities
        const recentActivities = this.context.activities.recent;
        if (recentActivities.includes('meditation')) {
            mood = this.adjustMood(mood, 'calmer');
        }
        if (recentActivities.includes('exercise')) {
            mood = this.adjustMood(mood, 'energized');
        }
        
        this.context.currentState.mood = mood;
    }

    adjustMood(currentMood, adjustment) {
        const moodAdjustments = {
            'calmer': {
                'Stressed': 'Focused',
                'Anxious': 'Balanced',
                'Overwhelmed': 'Calm'
            },
            'energized': {
                'Low Energy': 'Balanced',
                'Tired': 'Focused',
                'Sluggish': 'Energized'
            }
        };
        
        return moodAdjustments[adjustment]?.[currentMood] || currentMood;
    }

    updateCognitiveLoad() {
        let load = this.context.currentState.cognitiveLoad;
        
        // Factor in conversation depth
        const depth = this.context.temporal.conversationDepth;
        load = Math.min(100, 20 + depth * 5);
        
        // Factor in time in session
        const sessionMinutes = this.context.temporal.timeInSession / 60000;
        if (sessionMinutes > 60) load += 15; // Mental fatigue
        
        // Factor in multitasking (simulated)
        if (this.context.activities.current === 'multitasking') {
            load += 20;
        }
        
        this.context.currentState.cognitiveLoad = Math.max(0, Math.min(100, load));
    }

    updateActivityContext() {
        const currentActivity = this.inferCurrentActivity();
        
        // Update current activity if changed
        if (currentActivity !== this.context.activities.current) {
            this.context.activities.recent.push(this.context.activities.current);
            this.context.activities.current = currentActivity;
            
            // Keep only last 10 recent activities
            if (this.context.activities.recent.length > 10) {
                this.context.activities.recent.shift();
            }
        }
        
        // Update activity patterns
        this.updateActivityPatterns();
    }

    updateActivityPatterns() {
        const hour = new Date().getHours();
        const activity = this.context.activities.current;
        
        const key = `${hour}_${activity}`;
        const count = this.context.activities.patterns.get(key) || 0;
        this.context.activities.patterns.set(key, count + 1);
    }

    updateEnvironmentalContext() {
        // Simulate environmental detection
        const hour = new Date().getHours();
        
        // Update lighting based on time
        if (hour >= 8 && hour <= 18) {
            this.context.environment.lighting = 'optimal';
        } else if (hour >= 19 && hour <= 22) {
            this.context.environment.lighting = 'dim';
        } else {
            this.context.environment.lighting = 'low';
        }
        
        // Simulate noise level
        if (hour >= 9 && hour <= 17) {
            this.context.environment.noise = Math.random() > 0.7 ? 'moderate' : 'quiet';
        } else {
            this.context.environment.noise = 'quiet';
        }
        
        // Update location context (simulated)
        this.updateLocationContext();
    }

    updateLocationContext() {
        const hour = new Date().getHours();
        const day = this.context.temporal.dayOfWeek;
        
        if (day === 'weekend') {
            this.context.environment.location = 'home';
        } else if (hour >= 9 && hour <= 17) {
            this.context.environment.location = 'office';
        } else {
            this.context.environment.location = 'home';
        }
    }

    updateSocialContext() {
        // Update social energy based on recent interactions
        let socialEnergy = this.context.social.socialEnergy;
        
        const recentInteractions = this.context.social.recentInteractions;
        const personality = this.context.personality.traits;
        
        // Extraverts gain energy from interactions
        if (personality.extraversion > 60) {
            socialEnergy = Math.min(100, socialEnergy + recentInteractions.length * 5);
        } else {
            // Introverts lose energy from interactions
            socialEnergy = Math.max(0, socialEnergy - recentInteractions.length * 3);
        }
        
        this.context.social.socialEnergy = socialEnergy;
    }

    recordContextSnapshot() {
        const snapshot = {
            timestamp: Date.now(),
            context: JSON.parse(JSON.stringify(this.context)),
            integrations: this.captureIntegrationStates()
        };
        
        this.contextHistory.push(snapshot);
        
        // Keep only last 100 snapshots
        if (this.contextHistory.length > 100) {
            this.contextHistory.shift();
        }
    }

    captureIntegrationStates() {
        return {
            energy: energyManager ? energyManager.currentEnergy : null,
            biometric: biometricManager ? biometricManager.data : null,
            screenTime: screenTimeManager ? screenTimeManager.calculateOverallEfficiency() : null,
            quantum: quantumEngine ? {
                coherence: quantumEngine.coherenceLevel,
                optimization: quantumEngine.optimizationScore
            } : null
        };
    }

    updateLearningPatterns() {
        // Analyze conversation patterns for learning
        const conversationCount = this.context.temporal.responseCount;
        const sessionTime = this.context.temporal.timeInSession / 60000; // minutes
        
        if (conversationCount > 0) {
            const engagementRate = conversationCount / Math.max(1, sessionTime / 5); // responses per 5 minutes
            
            if (engagementRate > 2) {
                this.context.learning.comprehensionLevel = 'advanced';
            } else if (engagementRate > 1) {
                this.context.learning.comprehensionLevel = 'intermediate';
            } else {
                this.context.learning.comprehensionLevel = 'basic';
            }
        }
        
        // Update learning topics based on conversation content
        this.updateLearningTopics();
    }

    updateLearningTopics() {
        // This would integrate with conversation analysis
        const currentTopics = this.context.learning.currentTopics;
        
        // Simulate topic interest tracking
        const possibleTopics = [
            'productivity', 'ai_optimization', 'quantum_computing', 
            'biohacking', 'energy_management', 'focus_techniques'
        ];
        
        // Randomly add new topics of interest
        if (Math.random() > 0.8) {
            const newTopic = possibleTopics[Math.floor(Math.random() * possibleTopics.length)];
            if (!currentTopics.includes(newTopic)) {
                currentTopics.push(newTopic);
                if (currentTopics.length > 5) {
                    currentTopics.shift(); // Remove oldest
                }
            }
        }
    }

    updateGoalProgress() {
        // Update goal progress based on activities and achievements
        const activeGoal = this.context.goals.activeGoal;
        const currentProgress = this.context.goals.progress.get(activeGoal) || 0;
        
        // Simulate progress based on activities
        if (this.context.activities.current === 'focused_work' && activeGoal === 'productivity') {
            this.context.goals.progress.set(activeGoal, Math.min(100, currentProgress + 2));
        }
        
        // Check for goal completion
        if (currentProgress >= 100) {
            this.completeGoal(activeGoal);
        }
    }

    completeGoal(goal) {
        notificationManager?.showNotification(`🎯 Goal completed: ${goal}!`, 'success');
        
        // Move to next goal
        const shortTermGoals = this.context.goals.shortTerm;
        if (shortTermGoals.length > 0) {
            this.context.goals.activeGoal = shortTermGoals.shift();
            this.context.goals.progress.set(this.context.goals.activeGoal, 0);
        }
    }

    analyzeContextPatterns() {
        // Analyze patterns in context history
        if (this.contextHistory.length < 10) return;
        
        // Energy patterns
        this.analyzeEnergyPatterns();
        
        // Mood patterns
        this.analyzeMoodPatterns();
        
        // Activity patterns
        this.analyzeActivityPatterns();
        
        // Correlation analysis
        this.analyzeContextCorrelations();
    }

    analyzeEnergyPatterns() {
        const energyData = this.contextHistory.map(snapshot => ({
            time: new Date(snapshot.timestamp).getHours(),
            energy: snapshot.context.currentState.energyLevel
        }));
        
        // Find peak energy times
        const hourlyAverage = new Map();
        energyData.forEach(data => {
            const current = hourlyAverage.get(data.time) || { sum: 0, count: 0 };
            current.sum += data.energy;
            current.count++;
            hourlyAverage.set(data.time, current);
        });
        
        let peakHour = 9;
        let peakEnergy = 0;
        
        hourlyAverage.forEach((data, hour) => {
            const average = data.sum / data.count;
            if (average > peakEnergy) {
                peakEnergy = average;
                peakHour = hour;
            }
        });
        
        this.patterns.set('peak_energy_hour', peakHour);
        this.patterns.set('peak_energy_level', peakEnergy);
    }

    analyzeMoodPatterns() {
        const moodCounts = new Map();
        
        this.contextHistory.forEach(snapshot => {
            const mood = snapshot.context.currentState.mood;
            moodCounts.set(mood, (moodCounts.get(mood) || 0) + 1);
        });
        
        // Find dominant mood
        let dominantMood = 'Balanced';
        let maxCount = 0;
        
        moodCounts.forEach((count, mood) => {
            if (count > maxCount) {
                maxCount = count;
                dominantMood = mood;
            }
        });
        
        this.patterns.set('dominant_mood', dominantMood);
        this.patterns.set('mood_stability', this.calculateMoodStability(moodCounts));
    }

    calculateMoodStability(moodCounts) {
        const total = Array.from(moodCounts.values()).reduce((sum, count) => sum + count, 0);
        const moodVariance = Array.from(moodCounts.values()).reduce((variance, count) => {
            const proportion = count / total;
            return variance + Math.pow(proportion - 1/moodCounts.size, 2);
        }, 0);
        
        return Math.max(0, 100 - moodVariance * 100); // Higher = more stable
    }

    analyzeActivityPatterns() {
        const activityFrequency = new Map();
        
        this.contextHistory.forEach(snapshot => {
            const activity = snapshot.context.activities.current;
            activityFrequency.set(activity, (activityFrequency.get(activity) || 0) + 1);
        });
        
        this.patterns.set('activity_frequency', activityFrequency);
        
        // Find preferred activities
        const sortedActivities = Array.from(activityFrequency.entries())
            .sort((a, b) => b[1] - a[1]);
        
        this.patterns.set('preferred_activities', sortedActivities.slice(0, 3));
    }

    analyzeContextCorrelations() {
        // Correlate energy with other factors
        const correlations = this.calculateCorrelations();
        this.correlations = new Map(Object.entries(correlations));
    }

    calculateCorrelations() {
        if (this.contextHistory.length < 20) return {};
        
        const data = this.contextHistory.map(snapshot => ({
            energy: snapshot.context.currentState.energyLevel,
            stress: snapshot.context.currentState.stressLevel,
            cognitiveLoad: snapshot.context.currentState.cognitiveLoad,
            socialEnergy: snapshot.context.social.socialEnergy,
            hour: new Date(snapshot.timestamp).getHours()
        }));
        
        return {
            energy_stress: this.pearsonCorrelation(data.map(d => d.energy), data.map(d => d.stress)),
            energy_cognitive: this.pearsonCorrelation(data.map(d => d.energy), data.map(d => d.cognitiveLoad)),
            energy_social: this.pearsonCorrelation(data.map(d => d.energy), data.map(d => d.socialEnergy))
        };
    }

    pearsonCorrelation(x, y) {
        const n = x.length;
        if (n !== y.length || n === 0) return 0;
        
        const sumX = x.reduce((a, b) => a + b, 0);
        const sumY = y.reduce((a, b) => a + b, 0);
        const sumXY = x.map((xi, i) => xi * y[i]).reduce((a, b) => a + b, 0);
        const sumX2 = x.map(xi => xi * xi).reduce((a, b) => a + b, 0);
        const sumY2 = y.map(yi => yi * yi).reduce((a, b) => a + b, 0);
        
        const numerator = n * sumXY - sumX * sumY;
        const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
        
        return denominator === 0 ? 0 : numerator / denominator;
    }

    generateContextInsights() {
        const insights = [];
        
        // Energy insights
        const peakHour = this.patterns.get('peak_energy_hour');
        if (peakHour) {
            insights.push(`Your peak energy consistently occurs at ${peakHour}:00`);
        }
        
        // Mood insights
        const dominantMood = this.patterns.get('dominant_mood');
        const moodStability = this.patterns.get('mood_stability');
        if (dominantMood && moodStability) {
            insights.push(`Your dominant mood is ${dominantMood} with ${Math.round(moodStability)}% stability`);
        }
        
        // Activity insights
        const preferredActivities = this.patterns.get('preferred_activities');
        if (preferredActivities && preferredActivities.length > 0) {
            insights.push(`Your most frequent activity is ${preferredActivities[0][0]}`);
        }
        
        // Correlation insights
        const energyStressCorr = this.correlations.get('energy_stress');
        if (energyStressCorr && Math.abs(energyStressCorr) > 0.5) {
            const relationship = energyStressCorr < 0 ? 'inversely' : 'positively';
            insights.push(`Energy and stress are ${relationship} correlated (${energyStressCorr.toFixed(2)})`);
        }
        
        this.insights = insights;
    }

    adaptPersonalityModel() {
        // Adapt personality model based on observed patterns
        const observedBehaviors = this.getObservedBehaviors();
        
        // Adjust personality traits based on behavior
        this.adjustPersonalityTraits(observedBehaviors);
        
        // Update confidence in personality assessment
        this.updatePersonalityConfidence();
    }

    getObservedBehaviors() {
        return {
            engagement: this.context.temporal.responseCount / Math.max(1, this.context.temporal.timeInSession / 60000),
            activityPreference: this.patterns.get('preferred_activities')?.[0]?.[0],
            moodStability: this.patterns.get('mood_stability'),
            energyPattern: this.patterns.get('peak_energy_hour'),
            socialInteraction: this.context.social.socialEnergy
        };
    }

    adjustPersonalityTraits(behaviors) {
        // Adjust conscientiousness based on activity patterns
        if (behaviors.activityPreference === 'focused_work') {
            this.context.personality.traits.conscientiousness = Math.min(100, 
                this.context.personality.traits.conscientiousness + 1);
        }
        
        // Adjust extraversion based on social energy patterns
        if (behaviors.socialInteraction > 70) {
            this.context.personality.traits.extraversion = Math.min(100, 
                this.context.personality.traits.extraversion + 0.5);
        }
        
        // Adjust neuroticism based on mood stability
        if (behaviors.moodStability > 80) {
            this.context.personality.traits.neuroticism = Math.max(0, 
                this.context.personality.traits.neuroticism - 0.5);
        }
    }

    updatePersonalityConfidence() {
        const dataPoints = this.contextHistory.length;
        const maxConfidence = 95;
        const minDataForMax = 100;
        
        this.context.personality.confidence = Math.min(maxConfidence, 
            50 + (dataPoints / minDataForMax) * (maxConfidence - 50));
    }

    loadPersonalityModel() {
        // Initialize personality-based preferences
        const personality = this.context.personality.type;
        
        if (personality === 'Analytical-Achiever') {
            this.context.personality.preferences = {
                communicationStyle: 'data-driven',
                learningStyle: 'structured',
                decisionMaking: 'analytical',
                problemSolving: 'systematic',
                informationPreference: 'detailed',
                feedbackStyle: 'specific'
            };
            
            this.context.goals.priorities = ['efficiency', 'accuracy', 'optimization'];
        }
    }

    initializePatternRecognition() {
        // Set up pattern recognition for various context elements
        this.setupEnergyPatternRecognition();
        this.setupActivityPatternRecognition();
        this.setupMoodPatternRecognition();
    }

    setupEnergyPatternRecognition() {
        // Initialize energy pattern tracking
        this.patterns.set('energy_peaks', []);
        this.patterns.set('energy_dips', []);
        this.patterns.set('energy_trends', []);
    }

    setupActivityPatternRecognition() {
        // Initialize activity pattern tracking
        this.patterns.set('activity_sequences', []);
        this.patterns.set('activity_durations', new Map());
        this.patterns.set('activity_transitions', new Map());
    }

    setupMoodPatternRecognition() {
        // Initialize mood pattern tracking
        this.patterns.set('mood_triggers', new Map());
        this.patterns.set('mood_duration', new Map());
        this.patterns.set('mood_recovery', new Map());
    }

    setupContextIntegrations() {
        // Set up integrations with other managers
        this.integrateWithEnergyManager();
        this.integrateWithBiometricManager();
        this.integrateWithQuantumEngine();
        this.integrateWithScreenTimeManager();
    }

    integrateWithEnergyManager() {
        if (energyManager) {
            // Subscribe to energy updates
            energyManager.onEnergyUpdate = (energy) => {
                this.context.currentState.energyLevel = energy;
                this.updateCurrentStateContext();
            };
        }
    }

    integrateWithBiometricManager() {
        if (biometricManager) {
            // Subscribe to biometric updates
            biometricManager.onBiometricUpdate = (data) => {
                this.context.biometric = { ...this.context.biometric, ...data };
                this.context.currentState.stressLevel = data.stressLevel;
                this.updateCurrentStateContext();
            };
        }
    }

    integrateWithQuantumEngine() {
        if (quantumEngine) {
            // Subscribe to quantum updates
            quantumEngine.onQuantumUpdate = (data) => {
                this.context.quantum = { ...this.context.quantum, ...data };
                this.updateCurrentStateContext();
            };
        }
    }

    integrateWithScreenTimeManager() {
        if (screenTimeManager) {
            // Subscribe to screen time updates
            screenTimeManager.onActivityUpdate = (activity) => {
                this.context.activities.current = activity;
                this.updateActivityContext();
            };
        }
    }

    startAdaptiveLearning() {
        // Start adaptive learning algorithms
        this.initializeLearningModel();
        this.startContextPrediction();
    }

    initializeLearningModel() {
        // Initialize simple learning model for context prediction
        this.learningModel.set('energy_prediction', new Map());
        this.learningModel.set('mood_prediction', new Map());
        this.learningModel.set('activity_prediction', new Map());
    }

    startContextPrediction() {
        // Start predicting future context states
        setInterval(() => {
            this.predictNextEnergyState();
            this.predictNextMoodState();
            this.predictOptimalActivities();
        }, 300000); // Every 5 minutes
    }

    predictNextEnergyState() {
        const currentEnergy = this.context.currentState.energyLevel;
        const hour = new Date().getHours();
        const trend = this.calculateEnergyTrend();
        
        const prediction = Math.max(10, Math.min(100, currentEnergy + trend));
        this.learningModel.get('energy_prediction').set(hour + 1, prediction);
    }

    calculateEnergyTrend() {
        if (this.contextHistory.length < 5) return 0;
        
        const recent = this.contextHistory.slice(-5);
        const energyValues = recent.map(s => s.context.currentState.energyLevel);
        
        // Simple linear trend
        let trend = 0;
        for (let i = 1; i < energyValues.length; i++) {
            trend += energyValues[i] - energyValues[i-1];
        }
        
        return trend / (energyValues.length - 1);
    }

    predictNextMoodState() {
        const currentMood = this.context.currentState.mood;
        const moodStability = this.patterns.get('mood_stability') || 50;
        
        // Higher stability = less likely to change
        const changeProb = (100 - moodStability) / 100;
        
        if (Math.random() < changeProb) {
            // Predict potential mood change
            const moodTransitions = this.getMoodTransitionProbabilities(currentMood);
            this.learningModel.get('mood_prediction').set('next', moodTransitions);
        }
    }

    getMoodTransitionProbabilities(currentMood) {
        // Simplified mood transition model
        const transitions = {
            'Focused': { 'Energized': 0.3, 'Balanced': 0.4, 'Tired': 0.2, 'Focused': 0.1 },
            'Energized': { 'Focused': 0.4, 'Balanced': 0.3, 'Overwhelmed': 0.2, 'Energized': 0.1 },
            'Balanced': { 'Focused': 0.3, 'Energized': 0.3, 'Relaxed': 0.3, 'Balanced': 0.1 },
            'Tired': { 'Balanced': 0.4, 'Rested': 0.3, 'Sluggish': 0.2, 'Tired': 0.1 }
        };
        
        return transitions[currentMood] || { 'Balanced': 1.0 };
    }

    predictOptimalActivities() {
        const currentEnergy = this.context.currentState.energyLevel;
        const currentMood = this.context.currentState.mood;
        const hour = new Date().getHours();
        
        const optimalActivities = [];
        
        if (currentEnergy > 80 && currentMood === 'Focused') {
            optimalActivities.push('deep_analytical_work', 'complex_problem_solving');
        } else if (currentEnergy > 60) {
            optimalActivities.push('collaborative_work', 'meetings', 'learning');
        } else {
            optimalActivities.push('administrative_tasks', 'planning', 'reflection');
        }
        
        this.learningModel.get('activity_prediction').set('optimal', optimalActivities);
    }

    // Public API methods
    getContextSummary() {
        return {
            personality: this.context.personality.type,
            currentMood: this.context.currentState.mood,
            energyLevel: this.context.currentState.energyLevel,
            stressLevel: this.context.currentState.stressLevel,
            cognitiveLoad: this.context.currentState.cognitiveLoad,
            activeGoal: this.context.goals.activeGoal,
            currentActivity: this.context.activities.current,
            timeOfDay: this.context.temporal.timeOfDay,
            sessionDuration: Math.round(this.context.temporal.timeInSession / 60000),
            quantumCoherence: this.context.quantum.coherenceLevel
        };
    }

    getPersonalizationData() {
        return {
            personality: this.context.personality,
            preferences: this.context.personality.preferences,
            patterns: Object.fromEntries(this.patterns),
            correlations: Object.fromEntries(this.correlations),
            insights: this.insights,
            learningStyle: this.context.learning.learningStyle,
            communicationStyle: this.context.personality.preferences.communicationStyle
        };
    }

    updateConversationContext(message, response) {
        this.context.temporal.responseCount++;
        this.context.temporal.lastInteraction = Date.now();
        this.context.temporal.conversationDepth++;
        
        // Analyze message for context updates
        this.analyzeMessageForContext(message);
        
        // Update learning context
        this.updateLearningFromInteraction(message, response);
        
        // Update global context
        this.updateCurrentStateContext();
    }

    analyzeMessageForContext(message) {
        const lowerMessage = message.toLowerCase();
        
        // Update goal context based on message content
        if (lowerMessage.includes('work') || lowerMessage.includes('focus')) {
            this.context.goals.activeGoal = 'productivity';
        } else if (lowerMessage.includes('health') || lowerMessage.includes('wellness')) {
            this.context.goals.activeGoal = 'health_optimization';
        } else if (lowerMessage.includes('learn') || lowerMessage.includes('grow')) {
            this.context.goals.activeGoal = 'learning';
        }
        
        // Update mood based on message sentiment (simplified)
        if (lowerMessage.includes('tired') || lowerMessage.includes('exhausted')) {
            this.context.currentState.mood = 'Low Energy';
        } else if (lowerMessage.includes('excited') || lowerMessage.includes('energized')) {
            this.context.currentState.mood = 'Energized';
        }
        
        // Update learning topics
        const topics = ['quantum', 'energy', 'productivity', 'health', 'biometric', 'optimization'];
        topics.forEach(topic => {
            if (lowerMessage.includes(topic) && !this.context.learning.currentTopics.includes(topic)) {
                this.context.learning.currentTopics.push(topic);
                if (this.context.learning.currentTopics.length > 5) {
                    this.context.learning.currentTopics.shift();
                }
            }
        });
    }

    updateLearningFromInteraction(message, response) {
        // Track comprehension based on interaction complexity
        const messageComplexity = this.assessMessageComplexity(message);
        const responseComplexity = this.assessMessageComplexity(response);
        
        if (messageComplexity > 0.7 && responseComplexity > 0.7) {
            this.context.learning.comprehensionLevel = 'advanced';
        } else if (messageComplexity > 0.5) {
            this.context.learning.comprehensionLevel = 'intermediate';
        }
        
        // Update curiosity areas based on questions asked
        if (message.includes('?')) {
            this.updateCuriosityAreas(message);
        }
    }

    assessMessageComplexity(message) {
        // Simple complexity assessment
        const complexWords = ['quantum', 'optimization', 'correlation', 'algorithm', 'analysis'];
        const complexWordCount = complexWords.filter(word => 
            message.toLowerCase().includes(word)).length;
        
        const wordCount = message.split(' ').length;
        return Math.min(1, (complexWordCount / Math.max(1, wordCount)) * 10 + wordCount / 100);
    }

    updateCuriosityAreas(question) {
        const lowerQuestion = question.toLowerCase();
        const curiosityTopics = ['quantum', 'ai', 'optimization', 'biometric', 'energy', 'productivity'];
        
        curiosityTopics.forEach(topic => {
            if (lowerQuestion.includes(topic) && 
                !this.context.learning.curiosityAreas.includes(topic)) {
                this.context.learning.curiosityAreas.push(topic);
                if (this.context.learning.curiosityAreas.length > 8) {
                    this.context.learning.curiosityAreas.shift();
                }
            }
        });
    }

    getContextualRecommendations() {
        const recommendations = [];
        const context = this.getContextSummary();
        
        // Energy-based recommendations
        if (context.energyLevel > 80) {
            recommendations.push('Perfect time for complex analytical work');
        } else if (context.energyLevel < 50) {
            recommendations.push('Consider lighter tasks or a short break');
        }
        
        // Mood-based recommendations
        if (context.currentMood === 'Stressed') {
            recommendations.push('Breathing exercise might help reduce stress');
        } else if (context.currentMood === 'Focused') {
            recommendations.push('Great focus state - tackle important priorities');
        }
        
        // Time-based recommendations
        if (context.timeOfDay === 'morning') {
            recommendations.push('Leverage morning clarity for strategic thinking');
        } else if (context.timeOfDay === 'afternoon') {
            recommendations.push('Good time for collaborative activities');
        }
        
        // Cognitive load recommendations
        if (context.cognitiveLoad > 70) {
            recommendations.push('Consider simplifying current tasks');
        }
        
        return recommendations;
    }

    exportContextData() {
        const exportData = {
            timestamp: new Date().toISOString(),
            context: this.context,
            patterns: Object.fromEntries(this.patterns),
            correlations: Object.fromEntries(this.correlations),
            insights: this.insights,
            learningModel: Object.fromEntries(this.learningModel),
            contextHistory: this.contextHistory.slice(-50) // Last 50 snapshots
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'context-data.json';
        a.click();

        notificationManager?.showNotification('🧠 Context data exported', 'success');
    }

    // Cleanup
    destroy() {
        Object.values(this.updateIntervals).forEach(interval => {
            if (interval) clearInterval(interval);
        });
    }
}

// Export for global access
window.contextManager = new ContextManager();