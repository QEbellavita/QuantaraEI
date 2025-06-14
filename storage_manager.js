// ====================================
// STORAGE MANAGER
// ====================================

export class StorageManager {
    constructor(notificationManager) {
        this.notificationManager = notificationManager;
        
        this.storageKeys = {
            main: 'aiLifePlatformData',
            settings: 'aiLifePlatformSettings',
            cache: 'aiLifePlatformCache',
            temp: 'aiLifePlatformTemp',
            backup: 'aiLifePlatformBackup'
        };
        
        this.compressionEnabled = true;
        this.encryptionEnabled = false;
        this.encryptionKey = null;
        
        this.quotaInfo = {
            used: 0,
            available: 0,
            percentage: 0
        };
        
        this.changeListeners = new Map();
        this.syncQueue = [];
        this.isOnline = navigator.onLine;
        
        this.init();
    }

    init() {
        this.checkStorageSupport();
        this.checkStorageQuota();
        this.setupStorageEventListeners();
        this.setupOnlineStatusListeners();
        this.startPeriodicCleanup();
        console.log('💾 Storage Manager initialized');
    }

    // ====================================
    // STORAGE SUPPORT DETECTION
    // ====================================

    checkStorageSupport() {
        this.support = {
            localStorage: this.testStorage('localStorage'),
            sessionStorage: this.testStorage('sessionStorage'),
            indexedDB: this.testIndexedDB(),
            webSQL: 'openDatabase' in window,
            cookies: navigator.cookieEnabled
        };
        
        console.log('💾 Storage support:', this.support);
    }

    testStorage(type) {
        try {
            const storage = window[type];
            const testKey = '__storage_test__';
            storage.setItem(testKey, 'test');
            storage.removeItem(testKey);
            return true;
        } catch (e) {
            return false;
        }
    }

    testIndexedDB() {
        return 'indexedDB' in window;
    }

    async checkStorageQuota() {
        if ('storage' in navigator && 'estimate' in navigator.storage) {
            try {
                const estimate = await navigator.storage.estimate();
                this.quotaInfo = {
                    used: estimate.usage || 0,
                    available: estimate.quota || 0,
                    percentage: estimate.quota ? Math.round((estimate.usage / estimate.quota) * 100) : 0
                };
                
                if (this.quotaInfo.percentage > 80) {
                    this.notificationManager?.show('⚠️ Storage quota nearly full', 'warning');
                }
                
            } catch (error) {
                console.warn('Failed to check storage quota:', error);
            }
        }
    }

    // ====================================
    // LOCAL STORAGE OPERATIONS
    // ====================================

    setItem(key, value, options = {}) {
        try {
            const fullKey = this.getFullKey(key, options.namespace);
            let serializedValue = JSON.stringify({
                data: value,
                timestamp: Date.now(),
                expires: options.expires,
                version: options.version || '1.0'
            });

            if (this.compressionEnabled && options.compress !== false) {
                serializedValue = this.compress(serializedValue);
            }

            if (this.encryptionEnabled && options.encrypt !== false) {
                serializedValue = this.encrypt(serializedValue);
            }

            localStorage.setItem(fullKey, serializedValue);
            this.notifyListeners('itemSet', { key, value });
            
            return true;
        } catch (error) {
            console.error('Failed to set storage item:', error);
            this.handleStorageError(error, 'setItem');
            return false;
        }
    }

    getItem(key, options = {}) {
        try {
            const fullKey = this.getFullKey(key, options.namespace);
            let serializedValue = localStorage.getItem(fullKey);
            
            if (!serializedValue) return null;

            if (this.encryptionEnabled && options.encrypt !== false) {
                serializedValue = this.decrypt(serializedValue);
            }

            if (this.compressionEnabled && options.compress !== false) {
                serializedValue = this.decompress(serializedValue);
            }

            const parsed = JSON.parse(serializedValue);
            
            // Check expiration
            if (parsed.expires && Date.now() > parsed.expires) {
                this.removeItem(key, options);
                return null;
            }

            this.notifyListeners('itemGet', { key, value: parsed.data });
            return parsed.data;
            
        } catch (error) {
            console.error('Failed to get storage item:', error);
            this.handleStorageError(error, 'getItem');
            return null;
        }
    }

    removeItem(key, options = {}) {
        try {
            const fullKey = this.getFullKey(key, options.namespace);
            localStorage.removeItem(fullKey);
            this.notifyListeners('itemRemoved', { key });
            return true;
        } catch (error) {
            console.error('Failed to remove storage item:', error);
            return false;
        }
    }

    clear(namespace = null) {
        try {
            if (namespace) {
                const prefix = `${namespace}_`;
                const keysToRemove = [];
                
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && key.startsWith(prefix)) {
                        keysToRemove.push(key);
                    }
                }
                
                keysToRemove.forEach(key => localStorage.removeItem(key));
            } else {
                localStorage.clear();
            }
            
            this.notifyListeners('storageCleared', { namespace });
            return true;
        } catch (error) {
            console.error('Failed to clear storage:', error);
            return false;
        }
    }

    // ====================================
    // ADVANCED STORAGE OPERATIONS
    // ====================================

    setItemWithTTL(key, value, ttlSeconds, options = {}) {
        const expires = Date.now() + (ttlSeconds * 1000);
        return this.setItem(key, value, { ...options, expires });
    }

    getItemAge(key, options = {}) {
        try {
            const fullKey = this.getFullKey(key, options.namespace);
            const serializedValue = localStorage.getItem(fullKey);
            
            if (!serializedValue) return null;
            
            const parsed = JSON.parse(serializedValue);
            return Date.now() - parsed.timestamp;
            
        } catch (error) {
            return null;
        }
    }

    updateItem(key, updateFunction, options = {}) {
        const currentValue = this.getItem(key, options);
        const newValue = updateFunction(currentValue);
        return this.setItem(key, newValue, options);
    }

    incrementCounter(key, increment = 1, options = {}) {
        const current = this.getItem(key, options) || 0;
        return this.setItem(key, current + increment, options);
    }

    // ====================================
    // BULK OPERATIONS
    // ====================================

    setMultiple(items, options = {}) {
        const results = {};
        
        for (const [key, value] of Object.entries(items)) {
            results[key] = this.setItem(key, value, options);
        }
        
        return results;
    }

    getMultiple(keys, options = {}) {
        const results = {};
        
        keys.forEach(key => {
            results[key] = this.getItem(key, options);
        });
        
        return results;
    }

    removeMultiple(keys, options = {}) {
        const results = {};
        
        keys.forEach(key => {
            results[key] = this.removeItem(key, options);
        });
        
        return results;
    }

    // ====================================
    // BACKUP & RESTORE
    // ====================================

    createBackup(includeSettings = true) {
        try {
            const backup = {
                timestamp: Date.now(),
                version: '1.0',
                data: {},
                settings: includeSettings ? {} : null
            };

            // Backup main data
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(this.storageKeys.main)) {
                    backup.data[key] = localStorage.getItem(key);
                }
            }

            // Backup settings if requested
            if (includeSettings) {
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && key.startsWith(this.storageKeys.settings)) {
                        backup.settings[key] = localStorage.getItem(key);
                    }
                }
            }

            // Store backup
            const backupKey = `${this.storageKeys.backup}_${Date.now()}`;
            this.setItem(backupKey, backup, { namespace: 'backup', compress: true });
            
            this.notificationManager?.show('💾 Backup created successfully', 'success');
            return backup;
            
        } catch (error) {
            console.error('Failed to create backup:', error);
            this.notificationManager?.show('❌ Backup creation failed', 'error');
            return null;
        }
    }

    restoreBackup(backup, options = { overwrite: false }) {
        try {
            if (!backup || !backup.data) {
                throw new Error('Invalid backup data');
            }

            if (!options.overwrite) {
                // Create current backup before restore
                this.createBackup();
            }

            // Restore data
            for (const [key, value] of Object.entries(backup.data)) {
                localStorage.setItem(key, value);
            }

            // Restore settings if available
            if (backup.settings) {
                for (const [key, value] of Object.entries(backup.settings)) {
                    localStorage.setItem(key, value);
                }
            }

            this.notifyListeners('backupRestored', backup);
            this.notificationManager?.show('✅ Backup restored successfully', 'success');
            return true;
            
        } catch (error) {
            console.error('Failed to restore backup:', error);
            this.notificationManager?.show('❌ Backup restoration failed', 'error');
            return false;
        }
    }

    listBackups() {
        const backups = [];
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(this.storageKeys.backup)) {
                try {
                    const backup = this.getItem(key, { namespace: 'backup' });
                    if (backup) {
                        backups.push({
                            key,
                            timestamp: backup.timestamp,
                            version: backup.version,
                            size: JSON.stringify(backup).length
                        });
                    }
                } catch (error) {
                    console.warn('Invalid backup found:', key);
                }
            }
        }
        
        return backups.sort((a, b) => b.timestamp - a.timestamp);
    }

    // ====================================
    // COMPRESSION & ENCRYPTION
    // ====================================

    compress(data) {
        // Simple LZ-string-like compression
        if (typeof data !== 'string') return data;
        
        const dict = {};
        const result = [];
        let phrase = data[0];
        let code = 256;
        
        for (let i = 1; i < data.length; i++) {
            const current = data[i];
            const combined = phrase + current;
            
            if (dict[combined]) {
                phrase = combined;
            } else {
                result.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
                dict[combined] = code++;
                phrase = current;
            }
        }
        
        result.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
        
        return JSON.stringify({
            compressed: true,
            data: result
        });
    }

    decompress(data) {
        try {
            const parsed = JSON.parse(data);
            if (!parsed.compressed) return data;
            
            const dict = {};
            const result = [];
            let code = 256;
            let phrase = String.fromCharCode(parsed.data[0]);
            
            result.push(phrase);
            
            for (let i = 1; i < parsed.data.length; i++) {
                const current = parsed.data[i];
                let entry;
                
                if (dict[current]) {
                    entry = dict[current];
                } else if (current === code) {
                    entry = phrase + phrase[0];
                } else {
                    entry = String.fromCharCode(current);
                }
                
                result.push(entry);
                dict[code++] = phrase + entry[0];
                phrase = entry;
            }
            
            return result.join('');
        } catch (error) {
            return data; // Return original if decompression fails
        }
    }

    encrypt(data) {
        // Simple XOR encryption (not secure, for demo purposes)
        if (!this.encryptionKey) return data;
        
        let encrypted = '';
        for (let i = 0; i < data.length; i++) {
            encrypted += String.fromCharCode(
                data.charCodeAt(i) ^ this.encryptionKey.charCodeAt(i % this.encryptionKey.length)
            );
        }
        
        return btoa(encrypted);
    }

    decrypt(data) {
        if (!this.encryptionKey) return data;
        
        try {
            const decoded = atob(data);
            let decrypted = '';
            
            for (let i = 0; i < decoded.length; i++) {
                decrypted += String.fromCharCode(
                    decoded.charCodeAt(i) ^ this.encryptionKey.charCodeAt(i % this.encryptionKey.length)
                );
            }
            
            return decrypted;
        } catch (error) {
            return data;
        }
    }

    // ====================================
    // INDEXEDDB OPERATIONS
    // ====================================

    async openIndexedDB(dbName = 'AILifePlatform', version = 1) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName, version);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                if (!db.objectStoreNames.contains('data')) {
                    const store = db.createObjectStore('data', { keyPath: 'key' });
                    store.createIndex('timestamp', 'timestamp', { unique: false });
                }
                
                if (!db.objectStoreNames.contains('cache')) {
                    db.createObjectStore('cache', { keyPath: 'key' });
                }
            };
        });
    }

    async setIndexedDBItem(key, value, storeName = 'data') {
        try {
            const db = await this.openIndexedDB();
            const transaction = db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            
            await store.put({
                key,
                value,
                timestamp: Date.now()
            });
            
            return true;
        } catch (error) {
            console.error('IndexedDB set error:', error);
            return false;
        }
    }

    async getIndexedDBItem(key, storeName = 'data') {
        try {
            const db = await this.openIndexedDB();
            const transaction = db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            
            const result = await store.get(key);
            return result ? result.value : null;
        } catch (error) {
            console.error('IndexedDB get error:', error);
            return null;
        }
    }

    // ====================================
    // CLEANUP & MAINTENANCE
    // ====================================

    startPeriodicCleanup() {
        // Clean up expired items every hour
        setInterval(() => {
            this.cleanupExpiredItems();
        }, 60 * 60 * 1000);
        
        // Check quota every 30 minutes
        setInterval(() => {
            this.checkStorageQuota();
        }, 30 * 60 * 1000);
    }

    cleanupExpiredItems() {
        let cleaned = 0;
        
        for (let i = localStorage.length - 1; i >= 0; i--) {
            const key = localStorage.key(i);
            if (!key) continue;
            
            try {
                const value = localStorage.getItem(key);
                const parsed = JSON.parse(value);
                
                if (parsed.expires && Date.now() > parsed.expires) {
                    localStorage.removeItem(key);
                    cleaned++;
                }
            } catch (error) {
                // Skip invalid entries
            }
        }
        
        if (cleaned > 0) {
            console.log(`💾 Cleaned up ${cleaned} expired storage items`);
        }
    }

    cleanupOldBackups(keepCount = 5) {
        const backups = this.listBackups();
        const toDelete = backups.slice(keepCount);
        
        toDelete.forEach(backup => {
            localStorage.removeItem(backup.key);
        });
        
        if (toDelete.length > 0) {
            console.log(`💾 Cleaned up ${toDelete.length} old backups`);
        }
    }

    // ====================================
    // EVENT SYSTEM
    // ====================================

    setupStorageEventListeners() {
        window.addEventListener('storage', (event) => {
            this.notifyListeners('storageChanged', {
                key: event.key,
                oldValue: event.oldValue,
                newValue: event.newValue,
                source: 'external'
            });
        });
    }

    setupOnlineStatusListeners() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.processSyncQueue();
            this.notificationManager?.show('🌐 Back online - syncing data', 'info');
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.notificationManager?.show('📴 Offline - data will sync when connected', 'warning');
        });
    }

    on(event, callback) {
        if (!this.changeListeners.has(event)) {
            this.changeListeners.set(event, new Set());
        }
        this.changeListeners.get(event).add(callback);
    }

    off(event, callback) {
        if (this.changeListeners.has(event)) {
            this.changeListeners.get(event).delete(callback);
        }
    }

    notifyListeners(event, data) {
        if (this.changeListeners.has(event)) {
            this.changeListeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in storage listener for ${event}:`, error);
                }
            });
        }
    }

    // ====================================
    // SYNC OPERATIONS
    // ====================================

    addToSyncQueue(operation) {
        this.syncQueue.push({
            ...operation,
            timestamp: Date.now()
        });
        
        if (this.isOnline) {
            this.processSyncQueue();
        }
    }

    processSyncQueue() {
        if (!this.isOnline || this.syncQueue.length === 0) return;
        
        const operations = [...this.syncQueue];
        this.syncQueue = [];
        
        operations.forEach(operation => {
            // Process sync operation (would implement actual sync logic here)
            console.log('Processing sync operation:', operation);
        });
    }

    // ====================================
    // UTILITY METHODS
    // ====================================

    getFullKey(key, namespace) {
        return namespace ? `${namespace}_${key}` : key;
    }

    handleStorageError(error, operation) {
        if (error.name === 'QuotaExceededError') {
            this.notificationManager?.show('💾 Storage quota exceeded - cleaning up old data', 'warning');
            this.cleanupExpiredItems();
            this.cleanupOldBackups(3);
        } else {
            console.error(`Storage ${operation} error:`, error);
        }
    }

    getStorageInfo() {
        return {
            support: this.support,
            quota: this.quotaInfo,
            isOnline: this.isOnline,
            syncQueueLength: this.syncQueue.length,
            itemCount: localStorage.length
        };
    }

    // Export/Import functionality
    exportStorage() {
        const data = {};
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            data[key] = localStorage.getItem(key);
        }
        
        return {
            timestamp: Date.now(),
            data,
            quota: this.quotaInfo
        };
    }

    importStorage(exportedData, options = { overwrite: false }) {
        if (!options.overwrite) {
            this.createBackup();
        }
        
        if (options.clear) {
            localStorage.clear();
        }
        
        for (const [key, value] of Object.entries(exportedData.data)) {
            localStorage.setItem(key, value);
        }
        
        this.notifyListeners('storageImported', exportedData);
    }
}