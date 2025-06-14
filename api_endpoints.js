// js/config/api-endpoints.js - API Configuration and Endpoints
export const API_CONFIG = {
    // Base Configuration
    baseUrl: 'https://api.ailife.platform',
    version: 'v1',
    timeout: 30000, // 30 seconds
    retryAttempts: 3,
    retryDelay: 1000, // 1 second
    
    // Authentication
    auth: {
        tokenKey: 'ailife_auth_token',
        refreshTokenKey: 'ailife_refresh_token',
        tokenExpiration: 86400000, // 24 hours
    },
    
    // Request Headers
    defaultHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Client-Version': '1.0.0',
        'X-Platform': 'web'
    }
};

// API Endpoints
export const ENDPOINTS = {
    // Authentication
    auth: {
        login: '/auth/login',
        logout: '/auth/logout',
        register: '/auth/register',
        refresh: '/auth/refresh',
        verify: '/auth/verify'
    },
    
    // User Management
    user: {
        profile: '/user/profile',
        preferences: '/user/preferences',
        settings: '/user/settings',
        achievements: '/user/achievements',
        stats: '/user/stats'
    },
    
    // Biometric Data
    biometric: {
        current: '/biometric/current',
        history: '/biometric/history',
        upload: '/biometric/upload',
        sync: '/biometric/sync',
        correlations: '/biometric/correlations'
    },
    
    // Emotional Fusion
    fusion: {
        analyze: '/fusion/analyze',
        history: '/fusion/history',
        correlations: '/fusion/correlations',
        patterns: '/fusion/patterns',
        export: '/fusion/export'
    },
    
    // Phone Sensors
    sensors: {
        data: '/sensors/data',
        calibrate: '/sensors/calibrate',
        status: '/sensors/status',
        config: '/sensors/config'
    },
    
    // AI Conversation
    conversation: {
        chat: '/conversation/chat',
        context: '/conversation/context',
        history: '/conversation/history',
        personality: '/conversation/personality'
    },
    
    // Analytics
    analytics: {
        events: '/analytics/events',
        metrics: '/analytics/metrics',
        reports: '/analytics/reports',
        insights: '/analytics/insights'
    },
    
    // Quantum Intelligence
    quantum: {
        optimize: '/quantum/optimize',
        coherence: '/quantum/coherence',
        pathways: '/quantum/pathways',
        superposition: '/quantum/superposition'
    },
    
    // Data Management
    data: {
        backup: '/data/backup',
        restore: '/data/restore',
        export: '/data/export',
        sync: '/data/sync'
    },
    
    // Health Integration
    health: {
        devices: '/health/devices',
        sync: '/health/sync',
        metrics: '/health/metrics',
        insights: '/health/insights'
    },
    
    // Performance Tracking
    performance: {
        metrics: '/performance/metrics',
        goals: '/performance/goals',
        streaks: '/performance/streaks',
        achievements: '/performance/achievements'
    }
};

// Error Codes
export const ERROR_CODES = {
    // Network Errors
    NETWORK_ERROR: 'NETWORK_ERROR',
    TIMEOUT_ERROR: 'TIMEOUT_ERROR',
    CONNECTION_ERROR: 'CONNECTION_ERROR',
    
    // Authentication Errors
    AUTH_REQUIRED: 'AUTH_REQUIRED',
    TOKEN_EXPIRED: 'TOKEN_EXPIRED',
    INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
    PERMISSION_DENIED: 'PERMISSION_DENIED',
    
    // Data Errors
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    DATA_NOT_FOUND: 'DATA_NOT_FOUND',
    DUPLICATE_DATA: 'DUPLICATE_DATA',
    
    // Server Errors
    INTERNAL_ERROR: 'INTERNAL_ERROR',
    SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
    RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED'
};

// Response Status Codes
export const STATUS_CODES = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504
};

// API Utility Functions
export const API_UTILS = {
    // Build full URL
    buildUrl(endpoint, params = {}) {
        let url = `${API_CONFIG.baseUrl}/${API_CONFIG.version}${endpoint}`;
        
        const queryParams = new URLSearchParams(params);
        if (queryParams.toString()) {
            url += `?${queryParams.toString()}`;
        }
        
        return url;
    },
    
    // Get auth headers
    getAuthHeaders() {
        const token = localStorage.getItem(API_CONFIG.auth.tokenKey);
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    },
    
    // Check if token is expired
    isTokenExpired() {
        const token = localStorage.getItem(API_CONFIG.auth.tokenKey);
        if (!token) return true;
        
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return Date.now() >= payload.exp * 1000;
        } catch {
            return true;
        }
    },
    
    // Handle API errors
    handleError(error, endpoint) {
        console.error(`API Error for ${endpoint}:`, error);
        
        if (error.code === 'ECONNABORTED') {
            return { error: ERROR_CODES.TIMEOUT_ERROR, message: 'Request timeout' };
        }
        
        if (!error.response) {
            return { error: ERROR_CODES.NETWORK_ERROR, message: 'Network error' };
        }
        
        const { status, data } = error.response;
        
        switch (status) {
            case STATUS_CODES.UNAUTHORIZED:
                return { error: ERROR_CODES.AUTH_REQUIRED, message: 'Authentication required' };
            case STATUS_CODES.FORBIDDEN:
                return { error: ERROR_CODES.PERMISSION_DENIED, message: 'Permission denied' };
            case STATUS_CODES.NOT_FOUND:
                return { error: ERROR_CODES.DATA_NOT_FOUND, message: 'Resource not found' };
            case STATUS_CODES.TOO_MANY_REQUESTS:
                return { error: ERROR_CODES.RATE_LIMIT_EXCEEDED, message: 'Rate limit exceeded' };
            case STATUS_CODES.INTERNAL_SERVER_ERROR:
                return { error: ERROR_CODES.INTERNAL_ERROR, message: 'Internal server error' };
            default:
                return { error: data?.error || 'Unknown error', message: data?.message || 'An error occurred' };
        }
    }
};

// Mock API Response for Development
export const MOCK_RESPONSES = {
    user: {
        profile: {
            id: 'user123',
            name: 'Belinda',
            email: 'belinda@example.com',
            personality: 'Analytical-Achiever',
            level: 15,
            totalXP: 8534,
            createdAt: '2024-01-01T00:00:00Z'
        }
    },
    
    biometric: {
        current: {
            heartRate: 72,
            hrv: 45,
            stressLevel: 25,
            bloodOxygen: 98,
            timestamp: Date.now()
        }
    },
    
    fusion: {
        correlations: {
            hrEmotion: 0.87,
            stressEmotion: 0.91,
            overallFusion: 0.84,
            confidence: 94
        }
    }
};