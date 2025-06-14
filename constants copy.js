// js/config/constants.js - Application Constants
export const CONSTANTS = {
    // Event Names
    EVENTS: {
        SECTION_CHANGE: 'section:change',
        ENGINE_UPDATE: 'engine:update',
        NOTIFICATION_SHOW: 'notification:show',
        BIOMETRIC_UPDATE: 'biometric:update',
        SENSOR_DATA: 'sensor:data',
        QUANTUM_UPDATE: 'quantum:update',
        FUSION_RESULT: 'fusion:result'
    },
    
    // Section Names
    SECTIONS: {
        AI_COACH: 'aiCoach',
        EMOTIONAL_FUSION: 'emotionalFusion',
        HEALTH: 'health',
        PERFORMANCE: 'performance',
        GROWTH: 'growth',
        PROFILE: 'profile'
    },
    
    // Engine Names
    ENGINES: {
        FUSION: 'fusion',
        QUANTUM: 'quantum',
        SENSORS: 'sensors',
        CONVERSATION: 'conversation'
    },
    
    // Notification Types
    NOTIFICATION_TYPES: {
        SUCCESS: 'success',
        ERROR: 'error',
        WARNING: 'warning',
        INFO: 'info',
        QUANTUM: 'quantum'
    },
    
    // Biometric Thresholds
    BIOMETRIC: {
        HEART_RATE: {
            REST_MIN: 60,
            REST_MAX: 100,
            EXERCISE_MIN: 120,
            EXERCISE_MAX: 180
        },
        STRESS: {
            LOW: 30,
            MODERATE: 60,
            HIGH: 80
        },
        HRV: {
            EXCELLENT: 50,
            GOOD: 40,
            FAIR: 30,
            POOR: 20
        }
    },
    
    // Sensor Limits
    SENSORS: {
        ACCELEROMETER: {
            MAX_MAGNITUDE: 20, // m/s²
            MOVEMENT_THRESHOLD: 2
        },
        AUDIO: {
            SILENCE_THRESHOLD: -60, // dB
            LOUD_THRESHOLD: -20
        },
        LIGHT: {
            DARK: 50, // lux
            DIM: 200,
            BRIGHT: 1000
        }
    }
};