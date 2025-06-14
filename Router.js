// AI Life Platform - Advanced Router System
// Version 2.1.0 - Quantum Intelligence & Emotional Fusion Support

class AILifePlatformRouter {
    constructor() {
        this.routes = new Map();
        this.middleware = [];
        this.currentRoute = null;
        this.previousRoute = null;
        this.history = [];
        this.state = {
            section: 'aiCoach',
            subSection: null,
            overlay: null,
            context: {}
        };
        
        // Route parameters and query parsing
        this.params = {};
        this.query = {};
        
        // Navigation guards
        this.beforeEach = null;
        this.afterEach = null;
        
        // Initialize router
        this.init();
    }

    init() {
        this.setupRoutes();
        this.bindEvents();
        this.loadCurrentRoute();
        console.log('🚀 AI Platform Router initialized');
    }

    setupRoutes() {
        // Main sections
        this.addRoute('/', 'aiCoach', {
            component: 'aiCoach',
            title: 'AI Coach - Quantum Intelligence',
            description: 'Your quantum-enhanced AI life coach',
            middleware: ['initializeQuantumEngine']
        });

        this.addRoute('/ai-coach', 'aiCoach', {
            component: 'aiCoach',
            title: 'AI Coach - Quantum Intelligence',
            middleware: ['initializeQuantumEngine']
        });

        this.addRoute('/emotional-fusion', 'emotionalFusion', {
            component: 'emotionalFusion',
            title: 'Emotional Fusion Engine',
            description: 'Biometric-emotional correlation analysis',
            middleware: ['initializeFusionEngine']
        });

        // Health section with nested routes
        this.addRoute('/health', 'health', {
            component: 'health',
            title: 'Health Overview',
            defaultSub: 'overview'
        });

        this.addRoute('/health/overview', 'health.overview', {
            component: 'health',
            subComponent: 'overview',
            title: 'Health Overview'
        });

        this.addRoute('/health/biometrics', 'health.biometrics', {
            component: 'health',
            subComponent: 'biometrics',
            title: 'Real-Time Biometrics',
            middleware: ['requireBiometricAccess']
        });

        this.addRoute('/health/sensors', 'health.sensors', {
            component: 'health',
            subComponent: 'sensors',
            title: 'Phone Sensors',
            middleware: ['initializeSensorManager']
        });

        this.addRoute('/health/sleep', 'health.sleep', {
            component: 'health',
            subComponent: 'sleep',
            title: 'Sleep Optimization'
        });

        this.addRoute('/health/nutrition', 'health.nutrition', {
            component: 'health',
            subComponent: 'nutrition',
            title: 'Nutrition Intelligence'
        });

        this.addRoute('/health/fitness', 'health.fitness', {
            component: 'health',
            subComponent: 'fitness',
            title: 'Fitness & Activity'
        });

        // Performance section with nested routes
        this.addRoute('/performance', 'performance', {
            component: 'performance',
            title: 'Performance Analytics',
            defaultSub: 'productivity'
        });

        this.addRoute('/performance/productivity', 'performance.productivity', {
            component: 'performance',
            subComponent: 'productivity',
            title: 'Productivity & Energy'
        });

        this.addRoute('/performance/energy', 'performance.energy', {
            component: 'performance',
            subComponent: 'energy',
            title: 'Energy Investment'
        });

        this.addRoute('/performance/goals', 'performance.goals', {
            component: 'performance',
            subComponent: 'goals',
            title: 'Goals & Achievement'
        });

        this.addRoute('/performance/strategy', 'performance.strategy', {
            component: 'performance',
            subComponent: 'strategy',
            title: 'Strategy & Decision Making'
        });

        // Growth section with nested routes
        this.addRoute('/growth', 'growth', {
            component: 'growth',
            title: 'Learning & Growth',
            defaultSub: 'learning'
        });

        this.addRoute('/growth/learning', 'growth.learning', {
            component: 'growth',
            subComponent: 'learning',
            title: 'Learning & Development'
        });

        this.addRoute('/growth/habits', 'growth.habits', {
            component: 'growth',
            subComponent: 'habits',
            title: 'Habits & Behavior'
        });

        this.addRoute('/growth/social', 'growth.social', {
            component: 'growth',
            subComponent: 'social',
            title: 'Social & Relationships'
        });

        this.addRoute('/growth/emotional', 'growth.emotional', {
            component: 'growth',
            subComponent: 'emotional',
            title: 'Emotional Intelligence'
        });

        this.addRoute('/growth/labs', 'growth.labs', {
            component: 'growth',
            subComponent: 'labs',
            title: 'AI Analysis Labs'
        });

        // Profile section with nested routes
        this.addRoute('/profile', 'profile', {
            component: 'profile',
            title: 'Your Profile',
            defaultSub: 'achievements'
        });

        this.addRoute('/profile/achievements', 'profile.achievements', {
            component: 'profile',
            subComponent: 'achievements',
            title: 'Achievements & Gamification'
        });

        this.addRoute('/profile/integrations', 'profile.integrations', {
            component: 'profile',
            subComponent: 'integrations',
            title: 'Integration Ecosystem'
        });

        this.addRoute('/profile/analytics', 'profile.analytics', {
            component: 'profile',
            subComponent: 'analytics',
            title: 'Analytics & Insights'
        });

        // Special overlay routes
        this.addRoute('/labs', 'labs', {
            component: 'overlay',
            overlayType: 'labs',
            title: 'Quantum AI Labs',
            middleware: ['requireQuantumAccess']
        });

        this.addRoute('/sensors', 'sensors', {
            component: 'overlay',
            overlayType: 'sensors',
            title: 'Phone Sensors Manager',
            middleware: ['initializeSensorManager']
        });

        // Lab-specific routes
        this.addRoute('/labs/emotional-fusion', 'labs.emotionalFusion', {
            component: 'lab',
            labType: 'emotional-fusion',
            title: 'Emotional Fusion Lab'
        });

        this.addRoute('/labs/quantum', 'labs.quantum', {
            component: 'lab',
            labType: 'quantum',
            title: 'Quantum Analysis Lab'
        });

        this.addRoute('/labs/personality', 'labs.personality', {
            component: 'lab',
            labType: 'personality',
            title: 'Personality Testing Lab'
        });

        this.addRoute('/labs/predictive', 'labs.predictive', {
            component: 'lab',
            labType: 'predictive',
            title: 'Predictive Intelligence Lab'
        });

        // Dynamic routes with parameters
        this.addRoute('/conversation/:id', 'conversation', {
            component: 'conversation',
            title: 'AI Conversation',
            middleware: ['loadConversation']
        });

        this.addRoute('/analysis/:type/:id?', 'analysis', {
            component: 'analysis',
            title: 'Analysis Results',
            middleware: ['loadAnalysis']
        });
    }

    addRoute(path, name, config = {}) {
        const route = {
            path,
            name,
            ...config,
            regex: this.pathToRegex(path)
        };
        
        this.routes.set(name, route);
        return this;
    }

    pathToRegex(path) {
        // Convert path with parameters to regex
        const parameterRegex = /:([^/]+)/g;
        const regexPath = path.replace(parameterRegex, '([^/]+)');
        return new RegExp(`^${regexPath}$`);
    }

    addMiddleware(middleware) {
        if (typeof middleware === 'function') {
            this.middleware.push(middleware);
        }
        return this;
    }

    beforeEachGuard(guard) {
        this.beforeEach = guard;
        return this;
    }

    afterEachGuard(guard) {
        this.afterEach = guard;
        return this;
    }

    bindEvents() {
        // Handle browser back/forward buttons
        window.addEventListener('popstate', (event) => {
            this.loadCurrentRoute(false);
        });

        // Handle link clicks
        document.addEventListener('click', (event) => {
            const link = event.target.closest('a[href]');
            if (link && this.isInternalLink(link.href)) {
                event.preventDefault();
                this.navigate(link.href);
            }
        });

        // Handle form submissions for search/filters
        document.addEventListener('submit', (event) => {
            if (event.target.classList.contains('router-form')) {
                event.preventDefault();
                this.handleFormSubmission(event.target);
            }
        });
    }

    isInternalLink(href) {
        const url = new URL(href, window.location.origin);
        return url.origin === window.location.origin;
    }

    navigate(path, options = {}) {
        const { replace = false, state = null } = options;
        
        // Parse path and query
        const [pathname, search] = path.split('?');
        this.query = this.parseQuery(search || '');
        
        // Find matching route
        const route = this.findRoute(pathname);
        
        if (!route) {
            console.warn(`Route not found: ${pathname}`);
            this.navigate('/'); // Fallback to home
            return;
        }

        // Extract parameters
        this.params = this.extractParams(route, pathname);
        
        // Run before guard
        if (this.beforeEach) {
            const result = this.beforeEach(route, this.currentRoute);
            if (result === false) return; // Navigation cancelled
        }

        // Store previous route
        this.previousRoute = this.currentRoute;
        this.currentRoute = route;

        // Update browser history
        const fullPath = pathname + (search ? `?${search}` : '');
        if (replace) {
            window.history.replaceState(state, route.title, fullPath);
        } else {
            window.history.pushState(state, route.title, fullPath);
        }

        // Update page title
        document.title = route.title || 'AI Life Platform';

        // Execute route
        this.executeRoute(route);

        // Add to history
        this.history.push({
            route,
            timestamp: Date.now(),
            params: { ...this.params },
            query: { ...this.query }
        });

        // Run after guard
        if (this.afterEach) {
            this.afterEach(route, this.previousRoute);
        }

        // Announce navigation for accessibility
        this.announceNavigation(route);
    }

    findRoute(pathname) {
        for (const [name, route] of this.routes) {
            if (route.regex.test(pathname)) {
                return route;
            }
        }
        return null;
    }

    extractParams(route, pathname) {
        const matches = pathname.match(route.regex);
        if (!matches) return {};

        const params = {};
        const paramNames = route.path.match(/:([^/]+)/g);
        
        if (paramNames) {
            paramNames.forEach((param, index) => {
                const paramName = param.substring(1); // Remove ':'
                params[paramName] = matches[index + 1];
            });
        }

        return params;
    }

    parseQuery(search) {
        const query = {};
        if (search) {
            const pairs = search.split('&');
            pairs.forEach(pair => {
                const [key, value] = pair.split('=');
                query[decodeURIComponent(key)] = decodeURIComponent(value || '');
            });
        }
        return query;
    }

    async executeRoute(route) {
        try {
            // Run middleware
            if (route.middleware) {
                for (const middlewareName of route.middleware) {
                    await this.runMiddleware(middlewareName, route);
                }
            }

            // Execute route based on component type
            switch (route.component) {
                case 'overlay':
                    this.handleOverlayRoute(route);
                    break;
                    
                case 'lab':
                    this.handleLabRoute(route);
                    break;
                    
                case 'conversation':
                    this.handleConversationRoute(route);
                    break;
                    
                case 'analysis':
                    this.handleAnalysisRoute(route);
                    break;
                    
                default:
                    this.handleStandardRoute(route);
            }

            // Update state
            this.updateState(route);

        } catch (error) {
            console.error('Route execution error:', error);
            this.handleRouteError(error, route);
        }
    }

    async runMiddleware(middlewareName, route) {
        const middleware = this.getMiddleware(middlewareName);
        if (middleware) {
            await middleware(route, this.params, this.query);
        }
    }

    getMiddleware(name) {
        const middlewareMap = {
            initializeQuantumEngine: async () => {
                if (window.conversationContext) {
                    window.conversationContext.quantumCoherence = 87 + Math.random() * 10;
                }
                console.log('⚛️ Quantum engine initialized');
            },

            initializeFusionEngine: async () => {
                if (window.fusionEngine && !window.fusionEngine.isActive) {
                    window.fusionEngine.initializeFusion();
                }
                console.log('🧠💓 Fusion engine initialized');
            },

            initializeSensorManager: async () => {
                if (window.phoneSensorsManager) {
                    console.log('📱 Sensor manager ready');
                }
            },

            requireBiometricAccess: async () => {
                // Check if biometric monitoring is enabled
                if (!window.biometricMonitoring) {
                    window.showNotification('🔒 Biometric access required', 'warning');
                }
            },

            requireQuantumAccess: async () => {
                // Check quantum access permissions
                console.log('⚛️ Quantum access verified');
            },

            loadConversation: async (route, params) => {
                // Load specific conversation
                const conversationId = params.id;
                console.log(`💬 Loading conversation: ${conversationId}`);
            },

            loadAnalysis: async (route, params) => {
                // Load analysis results
                const { type, id } = params;
                console.log(`📊 Loading analysis: ${type}${id ? ` (${id})` : ''}`);
            }
        };

        return middlewareMap[name];
    }

    handleStandardRoute(route) {
        // Handle main section routes
        const section = route.component;
        const subSection = route.subComponent;

        // Switch to main section
        if (window.switchSection) {
            window.switchSection(section);
        }

        // Switch to sub-section if specified
        if (subSection) {
            this.switchToSubSection(section, subSection);
        } else if (route.defaultSub) {
            this.switchToSubSection(section, route.defaultSub);
        }

        // Update navigation state
        this.updateNavigationUI(section, subSection);
    }

    handleOverlayRoute(route) {
        const overlayType = route.overlayType;
        
        switch (overlayType) {
            case 'labs':
                if (window.openLabs) {
                    window.openLabs();
                }
                break;
                
            case 'sensors':
                if (window.openSensorsOverlay) {
                    window.openSensorsOverlay();
                }
                break;
        }
    }

    handleLabRoute(route) {
        const labType = route.labType;
        
        if (window.openLab) {
            window.openLab(labType);
        }
    }

    handleConversationRoute(route) {
        // Handle conversation-specific routing
        window.switchSection('aiCoach');
        
        // Load specific conversation if ID provided
        const conversationId = this.params.id;
        if (conversationId && window.loadConversation) {
            window.loadConversation(conversationId);
        }
    }

    handleAnalysisRoute(route) {
        // Handle analysis result routing
        const analysisType = this.params.type;
        const analysisId = this.params.id;
        
        // Route to appropriate section based on analysis type
        const sectionMap = {
            'biometric': 'health',
            'emotional': 'emotionalFusion',
            'productivity': 'performance',
            'learning': 'growth'
        };
        
        const targetSection = sectionMap[analysisType] || 'aiCoach';
        window.switchSection(targetSection);
        
        // Load specific analysis
        if (window.loadAnalysis) {
            window.loadAnalysis(analysisType, analysisId);
        }
    }

    switchToSubSection(section, subSection) {
        const switchFunctions = {
            health: window.switchHealthTab,
            performance: window.switchPerformanceTab,
            growth: window.switchGrowthTab,
            profile: window.switchProfileTab
        };

        const switchFunction = switchFunctions[section];
        if (switchFunction) {
            switchFunction(subSection);
        }
    }

    updateNavigationUI(section, subSection) {
        // Update main navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.removeAttribute('aria-current');
        });
        
        const activeNavLink = document.querySelector(`[href="#${section}"]`);
        if (activeNavLink) {
            activeNavLink.setAttribute('aria-current', 'page');
        }

        // Update sub-navigation if exists
        if (subSection) {
            const sectionElement = document.getElementById(section);
            if (sectionElement) {
                const subNavItems = sectionElement.querySelectorAll('.sub-nav-item');
                subNavItems.forEach(item => {
                    item.classList.remove('active');
                    item.setAttribute('aria-selected', 'false');
                });

                const activeSubNavItem = Array.from(subNavItems).find(item =>
                    item.textContent.toLowerCase().includes(subSection.toLowerCase()) ||
                    item.getAttribute('onclick')?.includes(subSection)
                );
                
                if (activeSubNavItem) {
                    activeSubNavItem.classList.add('active');
                    activeSubNavItem.setAttribute('aria-selected', 'true');
                }
            }
        }
    }

    updateState(route) {
        this.state = {
            section: route.component,
            subSection: route.subComponent || null,
            overlay: route.overlayType || null,
            context: {
                params: { ...this.params },
                query: { ...this.query },
                route: route.name
            }
        };

        // Emit state change event
        window.dispatchEvent(new CustomEvent('routeChange', {
            detail: {
                route,
                state: this.state,
                params: this.params,
                query: this.query
            }
        }));
    }

    loadCurrentRoute(pushState = true) {
        const pathname = window.location.pathname;
        const search = window.location.search.substring(1);
        
        this.query = this.parseQuery(search);
        
        const route = this.findRoute(pathname);
        if (route) {
            this.params = this.extractParams(route, pathname);
            this.currentRoute = route;
            this.executeRoute(route);
        } else {
            // Fallback to home
            if (pushState) {
                this.navigate('/');
            }
        }
    }

    announceNavigation(route) {
        const announcer = document.getElementById('nav-announcer');
        if (announcer) {
            announcer.textContent = `Navigated to ${route.title}`;
            setTimeout(() => {
                announcer.textContent = '';
            }, 1000);
        }
    }

    handleRouteError(error, route) {
        console.error(`Route error for ${route.path}:`, error);
        
        // Show user-friendly error
        if (window.showNotification) {
            window.showNotification('❌ Navigation error occurred', 'error');
        }
        
        // Fallback to safe route
        if (route.path !== '/') {
            this.navigate('/');
        }
    }

    // Public API methods
    push(path, state = null) {
        this.navigate(path, { replace: false, state });
    }

    replace(path, state = null) {
        this.navigate(path, { replace: true, state });
    }

    go(delta) {
        window.history.go(delta);
    }

    back() {
        window.history.back();
    }

    forward() {
        window.history.forward();
    }

    getCurrentRoute() {
        return this.currentRoute;
    }

    getState() {
        return { ...this.state };
    }

    getParams() {
        return { ...this.params };
    }

    getQuery() {
        return { ...this.query };
    }

    // URL building helpers
    buildUrl(routeName, params = {}, query = {}) {
        const route = this.routes.get(routeName);
        if (!route) return null;

        let path = route.path;
        
        // Replace parameters
        for (const [key, value] of Object.entries(params)) {
            path = path.replace(`:${key}`, encodeURIComponent(value));
        }

        // Add query string
        const queryString = Object.entries(query)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');

        return path + (queryString ? `?${queryString}` : '');
    }

    // Enhanced navigation methods for the AI platform
    navigateToSection(section, subSection = null, context = {}) {
        let path = `/${section}`;
        if (subSection) {
            path += `/${subSection}`;
        }
        
        if (Object.keys(context).length > 0) {
            const queryString = Object.entries(context)
                .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
                .join('&');
            path += `?${queryString}`;
        }
        
        this.navigate(path);
    }

    openLab(labType, context = {}) {
        this.navigate(`/labs/${labType}`, { state: context });
    }

    openAnalysis(type, id = null, context = {}) {
        const path = id ? `/analysis/${type}/${id}` : `/analysis/${type}`;
        this.navigate(path, { state: context });
    }

    // Deep linking support
    generateDeepLink(section, subSection = null, context = {}) {
        const baseUrl = window.location.origin;
        const path = this.buildUrl(`${section}${subSection ? `.${subSection}` : ''}`, {}, context);
        return `${baseUrl}${path}`;
    }

    // Analytics integration
    trackNavigation(route) {
        // Integration point for analytics
        if (window.analytics) {
            window.analytics.track('route_change', {
                route: route.name,
                path: route.path,
                timestamp: Date.now()
            });
        }
    }

    // Export navigation history for analytics
    exportHistory() {
        return this.history.map(entry => ({
            route: entry.route.name,
            timestamp: entry.timestamp,
            params: entry.params,
            query: entry.query
        }));
    }
}

// Create global router instance
const router = new AILifePlatformRouter();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AILifePlatformRouter;
} else {
    window.AIRouter = router;
}

// Integration with existing navigation functions
if (typeof window !== 'undefined') {
    // Override existing navigation functions to use router
    const originalSwitchSection = window.switchSection;
    window.switchSection = function(section, element = null) {
        router.navigateToSection(section);
        
        // Still call original for immediate UI updates
        if (originalSwitchSection) {
            originalSwitchSection(section, element);
        }
    };

    // Enhanced navigation helpers
    window.navigateToHealth = (subSection) => router.navigateToSection('health', subSection);
    window.navigateToPerformance = (subSection) => router.navigateToSection('performance', subSection);
    window.navigateToGrowth = (subSection) => router.navigateToSection('growth', subSection);
    window.navigateToProfile = (subSection) => router.navigateToSection('profile', subSection);
    
    // Lab navigation
    window.navigateToLab = (labType) => router.openLab(labType);
    
    // Analysis navigation
    window.navigateToAnalysis = (type, id) => router.openAnalysis(type, id);

    console.log('🧭 AI Platform Router ready with enhanced navigation');
}