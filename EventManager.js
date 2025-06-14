/**
 * EventManager.js - AI Platform Event Management System
 * Handles all event coordination, state management, and inter-component communication
 */

class EventManager {
    constructor() {
        this.events = new Map();
        this.intervals = new Map();
        this.timeouts = new Map();
        this.state = {
            currentSection: 'aiCoach',
            currentTab: {},
            isListening: false,
            biometricMonitoring: true,
            fusionEngineActive: false,
            sensorsActive: {
                accelerometer: false,
                light: false,
                audio: false
            }
        };
        
        this.init();
    }

    init() {
        this.setupGlobalEventListeners();
        this.setupKeyboardNavigation();
        this.setupTouchGestures();
        this.startSystemMonitoring();
        console.log('🎯 EventManager initialized');
    }

    // ====================================
    // EVENT REGISTRATION AND MANAGEMENT
    // ====================================

    on(eventName, callback, priority = 0) {
        if (!this.events.has(eventName)) {
            this.events.set(eventName, []);
        }
        
        const eventList = this.events.get(eventName);
        eventList.push({ callback, priority });
        
        // Sort by priority (higher first)
        eventList.sort((a, b) => b.priority - a.priority);
    }

    off(eventName, callback) {
        if (this.events.has(eventName)) {
            const eventList = this.events.get(eventName);
            const index = eventList.findIndex(event => event.callback === callback);
            if (index !== -1) {
                eventList.splice(index, 1);
            }
        }
    }

    emit(eventName, data = {}) {
        if (this.events.has(eventName)) {
            const eventList = this.events.get(eventName);
            eventList.forEach(event => {
                try {
                    event.callback(data);
                } catch (error) {
                    console.error(`Error in event handler for ${eventName}:`, error);
                }
            });
        }
        
        // Log important events
        if (this.isImportantEvent(eventName)) {
            this.logEvent(eventName, data);
        }
    }

    // ====================================
    // GLOBAL EVENT LISTENERS
    // ====================================

    setupGlobalEventListeners() {
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardEvent(e);
        });

        // Window events
        window.addEventListener('resize', () => {
            this.emit('window:resize', { 
                width: window.innerWidth, 
                height: window.innerHeight 
            });
        });

        window.addEventListener('beforeunload', () => {
            this.emit('app:beforeUnload');
            this.cleanup();
        });

        // Visibility changes
        document.addEventListener('visibilitychange', () => {
            this.emit('app:visibilityChange', { hidden: document.hidden });
        });

        // Focus events
        window.addEventListener('focus', () => {
            this.emit('app:focus');
        });

        window.addEventListener('blur', () => {
            this.emit('app:blur');
        });

        // Network events
        window.addEventListener('online', () => {
            this.emit('network:online');
        });

        window.addEventListener('offline', () => {
            this.emit('network:offline');
        });
    }

    setupKeyboardNavigation() {
        this.on('keyboard:escape', () => {
            this.emit('overlay:closeAll');
        });

        this.on('keyboard:arrowLeft', (data) => {
            if (data.target?.closest('.nav-items')) {
                this.emit('navigation:main', { direction: -1 });
            } else if (data.target?.closest('.sub-nav')) {
                this.emit('navigation:sub', { direction: -1 });
            }
        });

        this.on('keyboard:arrowRight', (data) => {
            if (data.target?.closest('.nav-items')) {
                this.emit('navigation:main', { direction: 1 });
            } else if (data.target?.closest('.sub-nav')) {
                this.emit('navigation:sub', { direction: 1 });
            }
        });

        this.on('keyboard:enter', (data) => {
            if (data.target?.closest('.conversation-input')) {
                this.emit('conversation:send');
            }
        });
    }

    setupTouchGestures() {
        let touchStartX = 0;
        let touchStartY = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            
            const minSwipeDistance = 50;
            
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
                if (deltaX > 0) {
                    this.emit('gesture:swipeRight', { deltaX, deltaY });
                } else {
                    this.emit('gesture:swipeLeft', { deltaX, deltaY });
                }
            } else if (Math.abs(deltaY) > minSwipeDistance) {
                if (deltaY > 0) {
                    this.emit('gesture:swipeDown', { deltaX, deltaY });
                } else {
                    this.emit('gesture:swipeUp', { deltaX, deltaY });
                }
            }
        }, { passive: true });
    }

    handleKeyboardEvent(e) {
        const eventMap = {
            'Escape': 'keyboard:escape',
            'ArrowLeft': 'keyboard:arrowLeft',
            'ArrowRight': 'keyboard:arrowRight',
            'ArrowUp': 'keyboard:arrowUp',
            'ArrowDown': 'keyboard:arrowDown',
            'Enter': 'keyboard:enter',
            'Space': 'keyboard:space'
        };

        const eventName = eventMap[e.key];
        if (eventName) {
            this.emit(eventName, { 
                originalEvent: e, 
                target: e.target,
                ctrlKey: e.ctrlKey,
                shiftKey: e.shiftKey,
                altKey: e.altKey
            });
        }
    }

    // ====================================
    // STATE MANAGEMENT
    // ====================================

    setState(path, value) {
        const keys = path.split('.');
        let current = this.state;
        
        for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) {
                current[keys[i]] = {};
            }
            current = current[keys[i]];
        }
        
        const oldValue = current[keys[keys.length - 1]];
        current[keys[keys.length - 1]] = value;
        
        this.emit('state:change', { 
            path, 
            oldValue, 
            newValue: value 
        });
        
        this.emit(`state:${path}`, { 
            oldValue, 
            newValue: value 
        });
    }

    getState(path) {
        const keys = path.split('.');
        let current = this.state;
        
        for (const key of keys) {
            if (current[key] === undefined) {
                return undefined;
            }
            current = current[key];
        }
        
        return current;
    }

    // ====================================
    // TIMER MANAGEMENT
    // ====================================

    setInterval(name, callback, delay) {
        if (this.intervals.has(name)) {
            clearInterval(this.intervals.get(name));
        }
        
        const intervalId = setInterval(callback, delay);
        this.intervals.set(name, intervalId);
        
        this.emit('timer:intervalSet', { name, delay });
        return intervalId;
    }

    clearInterval(name) {
        if (this.intervals.has(name)) {
            clearInterval(this.intervals.get(name));
            this.intervals.delete(name);
            this.emit('timer:intervalCleared', { name });
        }
    }

    setTimeout(name, callback, delay) {
        if (this.timeouts.has(name)) {
            clearTimeout(this.timeouts.get(name));
        }
        
        const timeoutId = setTimeout(() => {
            callback();
            this.timeouts.delete(name);
        }, delay);
        
        this.timeouts.set(name, timeoutId);
        this.emit('timer:timeoutSet', { name, delay });
        return timeoutId;
    }

    clearTimeout(name) {
        if (this.timeouts.has(name)) {
            clearTimeout(this.timeouts.get(name));
            this.timeouts.delete(name);
            this.emit('timer:timeoutCleared', { name });
        }
    }

    // ====================================
    // SYSTEM MONITORING
    // ====================================

    startSystemMonitoring() {
        // Monitor performance
        this.setInterval('performanceMonitor', () => {
            const performance = this.getSystemPerformance();
            this.emit('system:performance', performance);
        }, 5000);

        // Monitor memory
        this.setInterval('memoryMonitor', () => {
            if (window.performance && window.performance.memory) {
                const memory = {
                    used: window.performance.memory.usedJSHeapSize,
                    total: window.performance.memory.totalJSHeapSize,
                    limit: window.performance.memory.jsHeapSizeLimit
                };
                this.emit('system:memory', memory);
            }
        }, 10000);

        // Monitor battery (if available)
        if ('getBattery' in navigator) {
            navigator.getBattery().then((battery) => {
                this.monitorBattery(battery);
            });
        }

        // Monitor connection
        this.setInterval('connectionMonitor', () => {
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            if (connection) {
                this.emit('system:connection', {
                    effectiveType: connection.effectiveType,
                    downlink: connection.downlink,
                    rtt: connection.rtt
                });
            }
        }, 30000);
    }

    getSystemPerformance() {
        return {
            timestamp: Date.now(),
            memory: window.performance?.memory ? {
                used: window.performance.memory.usedJSHeapSize,
                total: window.performance.memory.totalJSHeapSize
            } : null,
            timing: window.performance?.timing ? {
                loadComplete: window.performance.timing.loadEventEnd - window.performance.timing.navigationStart
            } : null
        };
    }

    monitorBattery(battery) {
        const emitBatteryInfo = () => {
            this.emit('system:battery', {
                level: battery.level,
                charging: battery.charging,
                chargingTime: battery.chargingTime,
                dischargingTime: battery.dischargingTime
            });
        };

        emitBatteryInfo();
        battery.addEventListener('levelchange', emitBatteryInfo);
        battery.addEventListener('chargingchange', emitBatteryInfo);
    }

    // ====================================
    // COMPONENT INTEGRATION
    // ====================================

    registerComponent(name, component) {
        this.emit('component:register', { name, component });
        
        // Auto-bind component events
        if (component.events) {
            Object.entries(component.events).forEach(([eventName, handler]) => {
                this.on(eventName, handler.bind(component));
            });
        }
    }

    unregisterComponent(name) {
        this.emit('component:unregister', { name });
    }

    // ====================================
    // NOTIFICATION SYSTEM
    // ====================================

    notify(message, type = 'info', options = {}) {
        const notification = {
            id: this.generateId(),
            message,
            type,
            timestamp: Date.now(),
            ...options
        };
        
        this.emit('notification:show', notification);
        return notification.id;
    }

    dismissNotification(id) {
        this.emit('notification:dismiss', { id });
    }

    // ====================================
    // ANALYTICS AND LOGGING
    // ====================================

    track(eventName, properties = {}) {
        const trackingEvent = {
            name: eventName,
            properties,
            timestamp: Date.now(),
            session: this.getSessionId(),
            user: this.getUserId()
        };
        
        this.emit('analytics:track', trackingEvent);
        
        // Store in local tracking array (avoid localStorage per requirements)
        if (!window.trackingEvents) {
            window.trackingEvents = [];
        }
        window.trackingEvents.push(trackingEvent);
        
        // Keep only last 100 events
        if (window.trackingEvents.length > 100) {
            window.trackingEvents.shift();
        }
    }

    logEvent(eventName, data) {
        const logEntry = {
            event: eventName,
            data,
            timestamp: Date.now(),
            level: this.getEventLogLevel(eventName)
        };
        
        console.log(`[EventManager] ${eventName}:`, data);
        this.emit('system:log', logEntry);
    }

    // ====================================
    // ACCESSIBILITY SUPPORT
    // ====================================

    announceToScreenReader(message, priority = 'polite') {
        const announcer = document.getElementById('nav-announcer') || this.createAnnouncer();
        
        if (announcer) {
            announcer.setAttribute('aria-live', priority);
            announcer.textContent = message;
            
            // Clear after announcement
            setTimeout(() => {
                announcer.textContent = '';
            }, 1000);
        }
    }

    createAnnouncer() {
        const announcer = document.createElement('div');
        announcer.id = 'nav-announcer';
        announcer.className = 'sr-only';
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        document.body.appendChild(announcer);
        return announcer;
    }

    // ====================================
    // UTILITY METHODS
    // ====================================

    generateId() {
        return 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    getSessionId() {
        if (!window.sessionId) {
            window.sessionId = this.generateId();
        }
        return window.sessionId;
    }

    getUserId() {
        // In a real app, this would come from authentication
        return 'user_demo';
    }

    isImportantEvent(eventName) {
        const importantEvents = [
            'section:change',
            'fusion:start',
            'sensors:activate',
            'error:critical',
            'performance:warning',
            'conversation:send'
        ];
        return importantEvents.includes(eventName);
    }

    getEventLogLevel(eventName) {
        if (eventName.includes('error') || eventName.includes('critical')) {
            return 'error';
        }
        if (eventName.includes('warning')) {
            return 'warn';
        }
        if (eventName.includes('system') || eventName.includes('performance')) {
            return 'debug';
        }
        return 'info';
    }

    // ====================================
    // CLEANUP AND SHUTDOWN
    // ====================================

    cleanup() {
        // Clear all intervals
        this.intervals.forEach((intervalId) => {
            clearInterval(intervalId);
        });
        this.intervals.clear();

        // Clear all timeouts
        this.timeouts.forEach((timeoutId) => {
            clearTimeout(timeoutId);
        });
        this.timeouts.clear();

        // Clear events
        this.events.clear();

        this.emit('eventManager:cleanup');
        console.log('🎯 EventManager cleaned up');
    }

    // ====================================
    // DEBUG METHODS
    // ====================================

    getEventStats() {
        return {
            registeredEvents: this.events.size,
            activeIntervals: this.intervals.size,
            activeTimeouts: this.timeouts.size,
            currentState: this.state
        };
    }

    dumpState() {
        console.table(this.state);
        console.log('Events:', Array.from(this.events.keys()));
        console.log('Intervals:', Array.from(this.intervals.keys()));
        console.log('Timeouts:', Array.from(this.timeouts.keys()));
    }
}

// ====================================
// SINGLETON PATTERN
// ====================================

let eventManagerInstance = null;

function getEventManager() {
    if (!eventManagerInstance) {
        eventManagerInstance = new EventManager();
    }
    return eventManagerInstance;
}

// ====================================
// GLOBAL EXPORTS
// ====================================

// If using modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EventManager, getEventManager };
}

// Browser global
if (typeof window !== 'undefined') {
    window.EventManager = EventManager;
    window.getEventManager = getEventManager;
    
    // Auto-initialize
    window.eventManager = getEventManager();
}

// Export for ES6 modules
export { EventManager, getEventManager };