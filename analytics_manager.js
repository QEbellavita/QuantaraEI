// ====================================
// ANALYTICS MANAGER
// ====================================

export class AnalyticsManager {
    constructor(notificationManager, dataManager) {
        this.notificationManager = notificationManager;
        this.dataManager = dataManager;
        
        this.events = [];
        this.sessions = [];
        this.metrics = new Map();
        this.funnels = new Map();
        this.cohorts = new Map();
        
        this.config = {
            maxEventHistory: 10000,
            sessionTimeout: 30 * 60 * 1000, // 30 minutes
            batchSize: 50,
            flushInterval: 60000, // 1 minute
            trackingEnabled: true,
            privacyMode: false
        };
        
        this.currentSession = null;
        this.lastActivity = Date.now();
        this.flushTimer = null;
        
        this.init();
    }

    init() {
        this.startSession();
        this.setupEventTracking();
        this.startFlushTimer();
        this.trackPageView();
        console.log('📊 Analytics Manager initialized');
    }

    // ====================================
    // SESSION MANAGEMENT
    // ====================================

    startSession() {
        this.currentSession = {
            id: this.generateId(),
            startTime: Date.now(),
            endTime: null,
            events: [],
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            screenResolution: `${screen.width}x${screen.height}`,
            viewport: `${window.innerWidth}x${window.innerHeight}`,
            referrer: document.referrer,
            url: window.location.href
        };
        
        this.sessions.push(this.currentSession);
        this.trackEvent('session_start', {
            sessionId: this.currentSession.id
        });
        
        console.log('📊 New session started:', this.currentSession.id);
    }

    endSession() {
        if (!this.currentSession) return;
        
        this.currentSession.endTime = Date.now();
        this.currentSession.duration = this.currentSession.endTime - this.currentSession.startTime;
        
        this.trackEvent('session_end', {
            sessionId: this.currentSession.id,
            duration: this.currentSession.duration,
            eventCount: this.currentSession.events.length
        });
        
        console.log('📊 Session ended:', this.currentSession.id);
        this.currentSession = null;
    }

    checkSessionTimeout() {
        const now = Date.now();
        if (now - this.lastActivity > this.config.sessionTimeout) {
            this.endSession();
            this.startSession();
        }
    }

    updateActivity() {
        this.lastActivity = Date.now();
    }

    // ====================================
    // EVENT TRACKING
    // ====================================

    trackEvent(eventName, properties = {}, options = {}) {
        if (!this.config.trackingEnabled) return;
        
        this.updateActivity();
        this.checkSessionTimeout();
        
        const event = {
            id: this.generateId(),
            name: eventName,
            timestamp: Date.now(),
            sessionId: this.currentSession?.id,
            properties: this.sanitizeProperties(properties),
            userProperties: this.getUserProperties(),
            context: this.getEventContext(),
            processed: false
        };
        
        // Add to session
        if (this.currentSession) {
            this.currentSession.events.push(event.id);
        }
        
        // Add to events list
        this.events.push(event);
        
        // Maintain max history
        if (this.events.length > this.config.maxEventHistory) {
            this.events = this.events.slice(-this.config.maxEventHistory);
        }
        
        // Process event immediately if requested
        if (options.immediate) {
            this.processEvent(event);
        }
        
        console.log('📊 Event tracked:', eventName, properties);
        return event;
    }

    trackPageView(url = window.location.href, title = document.title) {
        this.trackEvent('page_view', {
            url,
            title,
            path: window.location.pathname,
            search: window.location.search,
            hash: window.location.hash
        });
    }

    trackUserAction(action, element = null, value = null) {
        const properties = {
            action,
            value
        };
        
        if (element) {
            properties.element = {
                tagName: element.tagName,
                id: element.id,
                className: element.className,
                textContent: element.textContent?.slice(0, 100)
            };
        }
        
        this.trackEvent('user_action', properties);
    }

    trackError(error, context = {}) {
        this.trackEvent('error', {
            message: error.message,
            stack: error.stack,
            type: error.name,
            context
        });
    }

    trackPerformance(metric, value, context = {}) {
        this.trackEvent('performance', {
            metric,
            value,
            context
        });
    }

    trackFeatureUsage(feature, action = 'used', metadata = {}) {
        this.trackEvent('feature_usage', {
            feature,
            action,
            metadata
        });
    }

    // ====================================
    // METRICS CALCULATION
    // ====================================

    calculateMetric(metricName, timeframe = '24h') {
        const events = this.getEventsInTimeframe(timeframe);
        
        switch (metricName) {
            case 'active_time':
                return this.calculateActiveTime(events);
            case 'feature_adoption':
                return this.calculateFeatureAdoption(events);
            case 'error_rate':
                return this.calculateErrorRate(events);
            case 'session_duration':
                return this.calculateAverageSessionDuration(timeframe);
            case 'user_engagement':
                return this.calculateEngagementScore(events);
            case 'funnel_conversion':
                return this.calculateFunnelConversion(events);
            default:
                return this.calculateCustomMetric(metricName, events);
        }
    }

    calculateActiveTime(events) {
        const sessionEvents = events.filter(e => e.name === 'user_action');
        if (sessionEvents.length < 2) return 0;
        
        let activeTime = 0;
        let lastEventTime = sessionEvents[0].timestamp;
        
        sessionEvents.forEach(event => {
            const timeDiff = event.timestamp - lastEventTime;
            if (timeDiff < 5 * 60 * 1000) { // Less than 5 minutes
                activeTime += timeDiff;
            }
            lastEventTime = event.timestamp;
        });
        
        return activeTime;
    }

    calculateFeatureAdoption(events) {
        const featureEvents = events.filter(e => e.name === 'feature_usage');
        const features = new Map();
        
        featureEvents.forEach(event => {
            const feature = event.properties.feature;
            if (!features.has(feature)) {
                features.set(feature, 0);
            }
            features.set(feature, features.get(feature) + 1);
        });
        
        return Object.fromEntries(features);
    }

    calculateErrorRate(events) {
        const totalEvents = events.length;
        const errorEvents = events.filter(e => e.name === 'error').length;
        
        return totalEvents > 0 ? (errorEvents / totalEvents) * 100 : 0;
    }

    calculateAverageSessionDuration(timeframe) {
        const sessions = this.getSessionsInTimeframe(timeframe);
        const completedSessions = sessions.filter(s => s.duration);
        
        if (completedSessions.length === 0) return 0;
        
        const totalDuration = completedSessions.reduce((sum, s) => sum + s.duration, 0);
        return totalDuration / completedSessions.length;
    }

    calculateEngagementScore(events) {
        const userActions = events.filter(e => e.name === 'user_action').length;
        const featureUsage = events.filter(e => e.name === 'feature_usage').length;
        const pageViews = events.filter(e => e.name === 'page_view').length;
        
        // Weighted engagement score
        return (userActions * 1) + (featureUsage * 2) + (pageViews * 0.5);
    }

    calculateFunnelConversion(events) {
        const funnels = {};
        
        this.funnels.forEach((steps, funnelName) => {
            const conversions = this.calculateSingleFunnelConversion(events, steps);
            funnels[funnelName] = conversions;
        });
        
        return funnels;
    }

    calculateSingleFunnelConversion(events, steps) {
        const conversions = {};
        const userJourneys = new Map();
        
        // Group events by session
        events.forEach(event => {
            const sessionId = event.sessionId;
            if (!userJourneys.has(sessionId)) {
                userJourneys.set(sessionId, []);
            }
            userJourneys.get(sessionId).push(event);
        });
        
        // Calculate conversions for each step
        userJourneys.forEach(journey => {
            let currentStep = 0;
            
            journey.forEach(event => {
                if (currentStep < steps.length && this.matchesFunnelStep(event, steps[currentStep])) {
                    if (!conversions[currentStep]) conversions[currentStep] = 0;
                    conversions[currentStep]++;
                    currentStep++;
                }
            });
        });
        
        return conversions;
    }

    // ====================================
    // COHORT ANALYSIS
    // ====================================

    createCohort(name, criteria) {
        const cohort = {
            name,
            criteria,
            users: new Set(),
            createdAt: Date.now(),
            metrics: new Map()
        };
        
        this.cohorts.set(name, cohort);
        this.updateCohort(name);
        
        return cohort;
    }

    updateCohort(cohortName) {
        const cohort = this.cohorts.get(cohortName);
        if (!cohort) return;
        
        const sessions = this.sessions;
        cohort.users.clear();
        
        sessions.forEach(session => {
            if (this.meetsCohortCriteria(session, cohort.criteria)) {
                cohort.users.add(session.id);
            }
        });
    }

    analyzeCohort(cohortName, metric, timeframe = '30d') {
        const cohort = this.cohorts.get(cohortName);
        if (!cohort) return null;
        
        const cohortSessions = this.sessions.filter(s => cohort.users.has(s.id));
        const cohortEvents = this.events.filter(e => 
            cohortSessions.some(s => s.id === e.sessionId)
        );
        
        return this.calculateMetric(metric, cohortEvents);
    }

    // ====================================
    // REAL-TIME ANALYTICS
    // ====================================

    startRealTimeTracking() {
        this.realTimeInterval = setInterval(() => {
            this.processRealtimeMetrics();
        }, 5000);
    }

    stopRealTimeTracking() {
        if (this.realTimeInterval) {
            clearInterval(this.realTimeInterval);
            this.realTimeInterval = null;
        }
    }

    processRealtimeMetrics() {
        const recent = this.getEventsInTimeframe('5m');
        
        const realtimeData = {
            activeUsers: this.getActiveUserCount(),
            eventsPerMinute: recent.length,
            topEvents: this.getTopEvents(recent),
            errorRate: this.calculateErrorRate(recent),
            currentSessions: this.sessions.filter(s => !s.endTime).length
        };
        
        this.emit('realtimeUpdate', realtimeData);
    }

    getActiveUserCount() {
        const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
        const activeSessions = this.sessions.filter(s => 
            !s.endTime && s.startTime > fiveMinutesAgo
        );
        return activeSessions.length;
    }

    getTopEvents(events, limit = 5) {
        const eventCounts = new Map();
        
        events.forEach(event => {
            const count = eventCounts.get(event.name) || 0;
            eventCounts.set(event.name, count + 1);
        });
        
        return Array.from(eventCounts.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(([name, count]) => ({ name, count }));
    }

    // ====================================
    // INSIGHTS & REPORTS
    // ====================================

    generateInsights(timeframe = '7d') {
        const events = this.getEventsInTimeframe(timeframe);
        const insights = [];
        
        // Feature usage insights
        const featureAdoption = this.calculateFeatureAdoption(events);
        const topFeatures = Object.entries(featureAdoption)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
        
        if (topFeatures.length > 0) {
            insights.push({
                type: 'feature_usage',
                title: 'Top Features',
                data: topFeatures,
                insight: `${topFeatures[0][0]} is your most used feature with ${topFeatures[0][1]} interactions`
            });
        }
        
        // Engagement insights
        const engagementScore = this.calculateEngagementScore(events);
        insights.push({
            type: 'engagement',
            title: 'Engagement Score',
            data: engagementScore,
            insight: this.getEngagementInsight(engagementScore)
        });
        
        // Error insights
        const errorRate = this.calculateErrorRate(events);
        if (errorRate > 0) {
            insights.push({
                type: 'quality',
                title: 'Error Rate',
                data: errorRate,
                insight: `${errorRate.toFixed(2)}% error rate detected`
            });
        }
        
        // Session insights
        const avgSessionDuration = this.calculateAverageSessionDuration(timeframe);
        insights.push({
            type: 'session',
            title: 'Session Duration',
            data: avgSessionDuration,
            insight: `Average session lasts ${this.formatDuration(avgSessionDuration)}`
        });
        
        return insights;
    }

    generateReport(type = 'summary', timeframe = '7d') {
        const events = this.getEventsInTimeframe(timeframe);
        const sessions = this.getSessionsInTimeframe(timeframe);
        
        const report = {
            type,
            timeframe,
            generatedAt: Date.now(),
            summary: {
                totalEvents: events.length,
                totalSessions: sessions.length,
                uniqueFeatures: new Set(events.filter(e => e.name === 'feature_usage').map(e => e.properties.feature)).size,
                errorCount: events.filter(e => e.name === 'error').length
            },
            metrics: {},
            insights: this.generateInsights(timeframe)
        };
        
        // Calculate key metrics
        report.metrics.engagementScore = this.calculateEngagementScore(events);
        report.metrics.errorRate = this.calculateErrorRate(events);
        report.metrics.avgSessionDuration = this.calculateAverageSessionDuration(timeframe);
        report.metrics.featureAdoption = this.calculateFeatureAdoption(events);
        
        return report;
    }

    // ====================================
    // DATA PROCESSING
    // ====================================

    processEvent(event) {
        if (event.processed) return;
        
        // Mark as processed
        event.processed = true;
        
        // Update metrics
        this.updateMetrics(event);
        
        // Check for patterns
        this.detectPatterns(event);
        
        // Trigger any funnel updates
        this.updateFunnels(event);
        
        // Real-time processing
        this.emit('eventProcessed', event);
    }

    updateMetrics(event) {
        const hour = new Date(event.timestamp).getHours();
        
        // Update hourly metrics
        const hourKey = `hour_${hour}`;
        if (!this.metrics.has(hourKey)) {
            this.metrics.set(hourKey, { events: 0, features: new Set() });
        }
        
        const hourMetrics = this.metrics.get(hourKey);
        hourMetrics.events++;
        
        if (event.name === 'feature_usage') {
            hourMetrics.features.add(event.properties.feature);
        }
    }

    detectPatterns(event) {
        // Detect usage patterns
        if (event.name === 'feature_usage') {
            this.detectFeaturePatterns(event);
        }
        
        // Detect error patterns
        if (event.name === 'error') {
            this.detectErrorPatterns(event);
        }
        
        // Detect engagement patterns
        this.detectEngagementPatterns(event);
    }

    detectFeaturePatterns(event) {
        const feature = event.properties.feature;
        const recentFeatureEvents = this.events
            .filter(e => e.name === 'feature_usage' && 
                    e.properties.feature === feature &&
                    e.timestamp > Date.now() - (24 * 60 * 60 * 1000))
            .length;
        
        if (recentFeatureEvents > 10) {
            this.emit('patternDetected', {
                type: 'high_feature_usage',
                feature,
                count: recentFeatureEvents
            });
        }
    }

    // ====================================
    // UTILITY METHODS
    // ====================================

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    sanitizeProperties(properties) {
        if (this.config.privacyMode) {
            // Remove sensitive data in privacy mode
            const sanitized = { ...properties };
            delete sanitized.email;
            delete sanitized.phone;
            delete sanitized.address;
            return sanitized;
        }
        return properties;
    }

    getUserProperties() {
        const userData = this.dataManager?.userData;
        return {
            personality: userData?.personality,
            level: userData?.profile?.level,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
    }

    getEventContext() {
        return {
            url: window.location.href,
            userAgent: navigator.userAgent,
            timestamp: Date.now(),
            sessionId: this.currentSession?.id
        };
    }

    getEventsInTimeframe(timeframe) {
        const now = Date.now();
        const timeframes = {
            '5m': 5 * 60 * 1000,
            '1h': 60 * 60 * 1000,
            '24h': 24 * 60 * 60 * 1000,
            '7d': 7 * 24 * 60 * 60 * 1000,
            '30d': 30 * 24 * 60 * 60 * 1000
        };
        
        const cutoff = now - (timeframes[timeframe] || timeframes['24h']);
        return this.events.filter(event => event.timestamp > cutoff);
    }

    getSessionsInTimeframe(timeframe) {
        const now = Date.now();
        const timeframes = {
            '24h': 24 * 60 * 60 * 1000,
            '7d': 7 * 24 * 60 * 60 * 1000,
            '30d': 30 * 24 * 60 * 60 * 1000
        };
        
        const cutoff = now - (timeframes[timeframe] || timeframes['24h']);
        return this.sessions.filter(session => session.startTime > cutoff);
    }

    formatDuration(ms) {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}m ${seconds}s`;
    }

    getEngagementInsight(score) {
        if (score > 100) return 'Highly engaged user with frequent interactions';
        if (score > 50) return 'Moderately engaged with regular feature usage';
        if (score > 20) return 'Low engagement, consider onboarding improvements';
        return 'Very low engagement detected';
    }

    // ====================================
    // EVENT SYSTEM
    // ====================================

    setupEventTracking() {
        // Track user interactions
        document.addEventListener('click', (e) => {
            this.trackUserAction('click', e.target);
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                this.trackUserAction('keyboard_shortcut', null, e.key);
            }
        });
        
        // Track page visibility
        document.addEventListener('visibilitychange', () => {
            this.trackEvent('visibility_change', {
                hidden: document.hidden
            });
        });
        
        // Track errors
        window.addEventListener('error', (e) => {
            this.trackError(e.error, {
                filename: e.filename,
                lineno: e.lineno,
                colno: e.colno
            });
        });
    }

    startFlushTimer() {
        this.flushTimer = setInterval(() => {
            this.flushEvents();
        }, this.config.flushInterval);
    }

    flushEvents() {
        const unprocessedEvents = this.events.filter(e => !e.processed);
        
        unprocessedEvents.forEach(event => {
            this.processEvent(event);
        });
        
        if (unprocessedEvents.length > 0) {
            console.log(`📊 Processed ${unprocessedEvents.length} events`);
        }
    }

    // Simple event emitter
    emit(eventName, data) {
        if (this.listeners && this.listeners[eventName]) {
            this.listeners[eventName].forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in analytics listener for ${eventName}:`, error);
                }
            });
        }
    }

    on(eventName, callback) {
        if (!this.listeners) this.listeners = {};
        if (!this.listeners[eventName]) this.listeners[eventName] = [];
        this.listeners[eventName].push(callback);
    }

    // ====================================
    // EXPORT/IMPORT
    // ====================================

    exportAnalytics() {
        return {
            events: this.events,
            sessions: this.sessions,
            metrics: Object.fromEntries(this.metrics),
            config: this.config,
            exportedAt: Date.now()
        };
    }

    importAnalytics(data) {
        if (data.events) this.events = data.events;
        if (data.sessions) this.sessions = data.sessions;
        if (data.metrics) this.metrics = new Map(Object.entries(data.metrics));
        if (data.config) this.config = { ...this.config, ...data.config };
    }

    // ====================================
    // CLEANUP
    // ====================================

    cleanup() {
        this.endSession();
        
        if (this.flushTimer) {
            clearInterval(this.flushTimer);
        }
        
        this.stopRealTimeTracking();
        
        console.log('📊 Analytics Manager cleaned up');
    }
}