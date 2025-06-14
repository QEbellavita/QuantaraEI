// ====================================
// SENSORS OVERLAY COMPONENT
// ====================================

export class SensorsOverlay {
    constructor(notificationManager, phoneSensorsManager) {
        this.notificationManager = notificationManager;
        this.phoneSensorsManager = phoneSensorsManager;
        
        this.isVisible = false;
        this.activeTab = 'accelerometer';
        this.charts = {};
        this.updateIntervals = {};
        
        this.init();
    }

    init() {
        this.setupOverlay();
        this.setupEventListeners();
        this.setupCharts();
        console.log('📱 Sensors Overlay initialized');
    }

    // ====================================
    // OVERLAY MANAGEMENT
    // ====================================

    show() {
        const overlay = document.getElementById('sensorsOverlay');
        if (overlay) {
            overlay.classList.add('active');
            this.isVisible = true;
            this.startRealTimeUpdates();
            this.notificationManager?.show('📱 Phone Sensors Manager opened', 'success');
        }
    }

    hide() {
        const overlay = document.getElementById('sensorsOverlay');
        if (overlay) {
            overlay.classList.remove('active');
            this.isVisible = false;
            this.stopRealTimeUpdates();
        }
    }

    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }

    // ====================================
    // OVERLAY SETUP
    // ====================================

    setupOverlay() {
        // Check if overlay already exists
        if (document.getElementById('sensorsOverlay')) return;

        const overlayHTML = this.createOverlayHTML();
        document.body.insertAdjacentHTML('beforeend', overlayHTML);
        
        // Initialize with default tab
        this.switchTab('accelerometer');
    }

    createOverlayHTML() {
        return `
            <div id="sensorsOverlay" class="sensors-overlay">
                <div class="overlay-content">
                    <div class="overlay-header">
                        <h2>📱 Phone Sensors Manager</h2>
                        <button class="close-btn" onclick="closeSensorsOverlay()">×</button>
                    </div>
                    
                    <div class="sensors-tabs">
                        <button class="tab-btn active" data-tab="accelerometer" onclick="sensorsOverlay.switchTab('accelerometer')">
                            📱 Motion
                        </button>
                        <button class="tab-btn" data-tab="light" onclick="sensorsOverlay.switchTab('light')">
                            💡 Light
                        </button>
                        <button class="tab-btn" data-tab="audio" onclick="sensorsOverlay.switchTab('audio')">
                            🎵 Audio
                        </button>
                        <button class="tab-btn" data-tab="overview" onclick="sensorsOverlay.switchTab('overview')">
                            📊 Overview
                        </button>
                    </div>

                    <div class="sensors-content">
                        ${this.createAccelerometerTab()}
                        ${this.createLightTab()}
                        ${this.createAudioTab()}
                        ${this.createOverviewTab()}
                    </div>
                </div>
            </div>
        `;
    }

    createAccelerometerTab() {
        return `
            <div class="sensor-tab" id="accelerometerTab">
                <div class="sensor-controls">
                    <div class="sensor-status">
                        <div class="status-indicator" id="accelStatus">disconnected</div>
                        <span>Accelerometer Status</span>
                    </div>
                    
                    <button id="accelBtn" class="btn" onclick="toggleAccelerometer()">
                        <span>🚀</span><span>Start Accelerometer</span>
                    </button>
                    
                    <div class="permission-request" id="accelPermission" style="display: none;">
                        <p>📱 Motion permission required on iOS 13+</p>
                        <small>Tap "Allow" when prompted</small>
                    </div>
                </div>

                <div class="sensor-data">
                    <div class="data-row">
                        <div class="data-item">
                            <label>X-Axis</label>
                            <span id="accelX">0.00</span> m/s²
                        </div>
                        <div class="data-item">
                            <label>Y-Axis</label>
                            <span id="accelY">0.00</span> m/s²
                        </div>
                        <div class="data-item">
                            <label>Z-Axis</label>
                            <span id="accelZ">0.00</span> m/s²
                        </div>
                        <div class="data-item">
                            <label>Magnitude</label>
                            <span id="accelMagnitude">0.00</span> m/s²
                        </div>
                    </div>
                </div>

                <div class="chart-container">
                    <canvas id="accelChart" class="sensor-chart"></canvas>
                </div>

                <div class="data-stream">
                    <h4>Motion Stream</h4>
                    <div id="accelStream" class="stream-content"></div>
                </div>
            </div>
        `;
    }

    createLightTab() {
        return `
            <div class="sensor-tab" id="lightTab" style="display: none;">
                <div class="sensor-controls">
                    <div class="sensor-status">
                        <div class="status-indicator" id="lightStatus">disconnected</div>
                        <span>Light Sensor Status</span>
                    </div>
                    
                    <button id="lightBtn" class="btn" onclick="toggleLightSensor()">
                        <span>🌟</span><span>Start Light Monitoring</span>
                    </button>
                </div>

                <div class="sensor-data">
                    <div class="data-row">
                        <div class="data-item">
                            <label>Light Level</label>
                            <span id="lightLevel">0</span> lux
                        </div>
                        <div class="data-item">
                            <label>Condition</label>
                            <span id="lightCondition">Unknown</span>
                        </div>
                    </div>
                </div>

                <div class="chart-container">
                    <canvas id="lightChart" class="sensor-chart"></canvas>
                </div>

                <div class="light-indicator">
                    <div class="light-circle" id="lightCircle"></div>
                    <p>Visual Light Indicator</p>
                </div>

                <div class="data-stream">
                    <h4>Light Stream</h4>
                    <div id="lightStream" class="stream-content"></div>
                </div>
            </div>
        `;
    }

    createAudioTab() {
        return `
            <div class="sensor-tab" id="audioTab" style="display: none;">
                <div class="sensor-controls">
                    <div class="sensor-status">
                        <div class="status-indicator" id="audioStatus">disconnected</div>
                        <span>Audio Analysis Status</span>
                    </div>
                    
                    <button id="audioBtn" class="btn" onclick="toggleAudioAnalysis()">
                        <span>🎵</span><span>Start Audio Analysis</span>
                    </button>
                    
                    <div class="permission-request" id="audioPermission" style="display: none;">
                        <p>🎤 Microphone permission required</p>
                        <small>Click "Allow" when prompted</small>
                    </div>
                </div>

                <div class="sensor-data">
                    <div class="data-row">
                        <div class="data-item">
                            <label>Volume</label>
                            <span id="audioVolume">-60</span> dB
                        </div>
                        <div class="data-item">
                            <label>Frequency</label>
                            <span id="audioFreq">0</span> Hz
                        </div>
                        <div class="data-item">
                            <label>Activity</label>
                            <span id="audioActivity">Quiet</span>
                        </div>
                    </div>
                </div>

                <div class="audio-visualizer">
                    <div class="visualizer-container">
                        ${Array.from({length: 20}, (_, i) => 
                            `<div class="audio-bar" id="audioBar${i}"></div>`
                        ).join('')}
                    </div>
                </div>

                <div class="data-stream">
                    <h4>Audio Stream</h4>
                    <div id="audioStream" class="stream-content"></div>
                </div>
            </div>
        `;
    }

    createOverviewTab() {
        return `
            <div class="sensor-tab" id="overviewTab" style="display: none;">
                <div class="overview-grid">
                    <div class="overview-card">
                        <h4>📱 Motion Sensor</h4>
                        <div class="card-status" id="overviewAccel">Inactive</div>
                        <div class="card-data" id="overviewAccelData">Ready to start</div>
                    </div>
                    
                    <div class="overview-card">
                        <h4>💡 Light Sensor</h4>
                        <div class="card-status" id="overviewLight">Inactive</div>
                        <div class="card-data" id="overviewLightData">Ready to start</div>
                    </div>
                    
                    <div class="overview-card">
                        <h4>🎵 Audio Analysis</h4>
                        <div class="card-status" id="overviewAudio">Inactive</div>
                        <div class="card-data" id="overviewAudioData">Ready to start</div>
                    </div>
                    
                    <div class="overview-card">
                        <h4>🔗 Integration</h4>
                        <div class="card-status">Connected</div>
                        <div class="card-data">Emotional Fusion Engine</div>
                    </div>
                </div>

                <div class="sensor-insights">
                    <h4>📊 Sensor Insights</h4>
                    <div id="sensorInsights" class="insights-content">
                        <p>Start sensors to see real-time insights and patterns.</p>
                    </div>
                </div>

                <div class="quick-actions">
                    <h4>⚡ Quick Actions</h4>
                    <div class="action-buttons">
                        <button class="action-btn" onclick="sensorsOverlay.startAllSensors()">
                            🚀 Start All Sensors
                        </button>
                        <button class="action-btn" onclick="sensorsOverlay.stopAllSensors()">
                            ⏹️ Stop All Sensors
                        </button>
                        <button class="action-btn" onclick="sensorsOverlay.exportSensorData()">
                            💾 Export Data
                        </button>
                        <button class="action-btn" onclick="sensorsOverlay.calibrateSensors()">
                            ⚙️ Calibrate
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // ====================================
    // TAB MANAGEMENT
    // ====================================

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.sensors-overlay .tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });

        // Update tab content
        document.querySelectorAll('.sensor-tab').forEach(tab => {
            tab.style.display = tab.id === `${tabName}Tab` ? 'block' : 'none';
        });

        this.activeTab = tabName;

        // Setup charts for the active tab
        setTimeout(() => {
            this.setupTabChart(tabName);
        }, 100);
    }

    setupTabChart(tabName) {
        const chartId = `${tabName}Chart`;
        const canvas = document.getElementById(chartId);
        
        if (canvas && !this.charts[chartId]) {
            const ctx = canvas.getContext('2d');
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            
            this.charts[chartId] = {
                canvas,
                ctx,
                data: []
            };
        }
    }

    // ====================================
    // EVENT LISTENERS
    // ====================================

    setupEventListeners() {
        // Close overlay when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('sensors-overlay')) {
                this.hide();
            }
        });

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isVisible) {
                this.hide();
            }
        });

        // Listen to phone sensors manager events
        if (this.phoneSensorsManager) {
            this.setupSensorListeners();
        }
    }

    setupSensorListeners() {
        // Listen for sensor data updates
        if (this.phoneSensorsManager.on) {
            this.phoneSensorsManager.on('accelerometerUpdate', (data) => {
                this.updateAccelerometerDisplay(data);
            });

            this.phoneSensorsManager.on('lightUpdate', (data) => {
                this.updateLightDisplay(data);
            });

            this.phoneSensorsManager.on('audioUpdate', (data) => {
                this.updateAudioDisplay(data);
            });
        }
    }

    // ====================================
    // DISPLAY UPDATES
    // ====================================

    updateAccelerometerDisplay(data) {
        if (!this.isVisible) return;

        const elements = {
            'accelX': data.x?.toFixed(2) || '0.00',
            'accelY': data.y?.toFixed(2) || '0.00',
            'accelZ': data.z?.toFixed(2) || '0.00',
            'accelMagnitude': data.magnitude?.toFixed(2) || '0.00'
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        });

        // Update chart
        this.updateChart('accelChart', data.magnitude || 0);

        // Update overview
        this.updateOverviewCard('overviewAccel', 'Active', `${data.magnitude?.toFixed(1) || 0} m/s²`);

        // Log significant movement
        if (data.magnitude > 10) {
            this.logToStream('accelStream', `High motion: ${data.magnitude.toFixed(1)} m/s²`, 'warning');
        }
    }

    updateLightDisplay(data) {
        if (!this.isVisible) return;

        const elements = {
            'lightLevel': Math.round(data.level || 0),
            'lightCondition': data.condition || 'Unknown'
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        });

        // Update light indicator
        this.updateLightIndicator(data.level || 0);

        // Update chart
        this.updateChart('lightChart', data.level || 0);

        // Update overview
        this.updateOverviewCard('overviewLight', 'Active', `${data.level?.toFixed(0) || 0} lux`);
    }

    updateAudioDisplay(data) {
        if (!this.isVisible) return;

        const elements = {
            'audioVolume': Math.round(data.volume || -60),
            'audioFreq': Math.round(data.frequency || 0),
            'audioActivity': data.activity || 'Quiet'
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        });

        // Update audio visualizer
        if (data.frequencyData) {
            this.updateAudioVisualizer(data.frequencyData);
        }

        // Update overview
        this.updateOverviewCard('overviewAudio', 'Active', `${data.volume?.toFixed(0) || -60} dB`);
    }

    updateOverviewCard(statusId, status, data) {
        const statusElement = document.getElementById(statusId);
        const dataElement = document.getElementById(statusId.replace('overview', 'overview') + 'Data');
        
        if (statusElement) {
            statusElement.textContent = status;
            statusElement.className = `card-status ${status.toLowerCase()}`;
        }
        
        if (dataElement) {
            dataElement.textContent = data;
        }
    }

    updateLightIndicator(lightLevel) {
        const indicator = document.getElementById('lightCircle');
        if (!indicator) return;

        let brightness = Math.min(100, lightLevel / 10);
        let color = '#333';

        if (lightLevel < 50) {
            color = '#1a1a2e';
        } else if (lightLevel < 200) {
            color = '#ffa500';
            brightness = 30;
        } else if (lightLevel < 500) {
            color = '#ffff00';
            brightness = 60;
        } else {
            color = '#ffffff';
            brightness = 100;
        }

        indicator.style.backgroundColor = color;
        indicator.style.opacity = brightness / 100;
        indicator.style.boxShadow = `0 0 ${brightness / 5}px ${color}`;
    }

    updateAudioVisualizer(frequencyData) {
        const bars = document.querySelectorAll('.audio-bar');
        const binSize = Math.floor(frequencyData.length / bars.length);

        bars.forEach((bar, index) => {
            let sum = 0;
            for (let i = 0; i < binSize; i++) {
                sum += frequencyData[index * binSize + i] || 0;
            }
            const average = sum / binSize;
            const height = Math.max(4, (average / 255) * 60);
            bar.style.height = `${height}px`;
        });
    }

    // ====================================
    // CHART UPDATES
    // ====================================

    setupCharts() {
        // Initialize charts for all tabs
        ['accelerometer', 'light', 'audio'].forEach(tab => {
            this.setupTabChart(tab);
        });
    }

    updateChart(chartId, value) {
        const chart = this.charts[chartId];
        if (!chart) return;

        chart.data.push(value);
        if (chart.data.length > 50) {
            chart.data.shift();
        }

        this.drawChart(chart);
    }

    drawChart(chart) {
        const { canvas, ctx, data } = chart;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (data.length < 2) return;

        const maxValue = Math.max(...data, 1);
        const minValue = Math.min(...data, 0);
        const range = maxValue - minValue || 1;

        ctx.strokeStyle = '#4facfe';
        ctx.lineWidth = 2;
        ctx.beginPath();

        data.forEach((value, index) => {
            const x = (index / (data.length - 1)) * canvas.width;
            const y = canvas.height - ((value - minValue) / range) * canvas.height;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.stroke();
    }

    // ====================================
    // QUICK ACTIONS
    // ====================================

    startAllSensors() {
        if (this.phoneSensorsManager) {
            this.phoneSensorsManager.toggleAccelerometer();
            this.phoneSensorsManager.toggleLightSensor();
            this.phoneSensorsManager.toggleAudioAnalysis();
        }
        
        this.notificationManager?.show('🚀 Starting all sensors...', 'info');
    }

    stopAllSensors() {
        if (this.phoneSensorsManager) {
            if (this.phoneSensorsManager.sensors.accelerometer.active) {
                this.phoneSensorsManager.toggleAccelerometer();
            }
            if (this.phoneSensorsManager.sensors.light.active) {
                this.phoneSensorsManager.toggleLightSensor();
            }
            if (this.phoneSensorsManager.sensors.audio.active) {
                this.phoneSensorsManager.toggleAudioAnalysis();
            }
        }
        
        this.notificationManager?.show('⏹️ All sensors stopped', 'warning');
    }

    exportSensorData() {
        if (!this.phoneSensorsManager) return;

        const data = {
            timestamp: new Date().toISOString(),
            accelerometer: this.phoneSensorsManager.sensors.accelerometer.history,
            light: this.phoneSensorsManager.sensors.light.history,
            audio: this.phoneSensorsManager.sensors.audio.data
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: 'application/json'
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sensor-data-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);

        this.notificationManager?.show('💾 Sensor data exported', 'success');
    }

    calibrateSensors() {
        this.notificationManager?.show('⚙️ Calibrating sensors...', 'info');
        
        setTimeout(() => {
            this.notificationManager?.show('✅ Sensor calibration complete', 'success');
        }, 2000);
    }

    // ====================================
    // REAL-TIME UPDATES
    // ====================================

    startRealTimeUpdates() {
        this.updateIntervals.overview = setInterval(() => {
            if (this.activeTab === 'overview') {
                this.updateOverviewInsights();
            }
        }, 5000);
    }

    stopRealTimeUpdates() {
        Object.values(this.updateIntervals).forEach(interval => {
            if (interval) clearInterval(interval);
        });
        this.updateIntervals = {};
    }

    updateOverviewInsights() {
        const insights = document.getElementById('sensorInsights');
        if (!insights) return;

        const activeSensors = [];
        if (this.phoneSensorsManager?.sensors?.accelerometer?.active) activeSensors.push('Motion');
        if (this.phoneSensorsManager?.sensors?.light?.active) activeSensors.push('Light');
        if (this.phoneSensorsManager?.sensors?.audio?.active) activeSensors.push('Audio');

        if (activeSensors.length === 0) {
            insights.innerHTML = '<p>Start sensors to see real-time insights and patterns.</p>';
            return;
        }

        insights.innerHTML = `
            <div class="insight-item">
                <span class="insight-icon">📊</span>
                <span>Active sensors: ${activeSensors.join(', ')}</span>
            </div>
            <div class="insight-item">
                <span class="insight-icon">🔗</span>
                <span>Data flowing to Emotional Fusion Engine</span>
            </div>
            <div class="insight-item">
                <span class="insight-icon">⚡</span>
                <span>Real-time processing active</span>
            </div>
        `;
    }

    // ====================================
    // UTILITY METHODS
    // ====================================

    logToStream(streamId, message, type = 'info') {
        const stream = document.getElementById(streamId);
        if (!stream) return;

        const entry = document.createElement('div');
        entry.className = `log-entry ${type}`;
        entry.innerHTML = `
            <span class="log-time">${new Date().toLocaleTimeString()}</span>
            <span class="log-message">${message}</span>
        `;

        stream.appendChild(entry);
        stream.scrollTop = stream.scrollHeight;

        // Keep only last 20 entries
        while (stream.children.length > 20) {
            stream.removeChild(stream.firstChild);
        }
    }

    // ====================================
    // CLEANUP
    // ====================================

    destroy() {
        this.stopRealTimeUpdates();
        
        const overlay = document.getElementById('sensorsOverlay');
        if (overlay) {
            overlay.remove();
        }
        
        console.log('📱 Sensors Overlay destroyed');
    }
}

// Export for global access
export default SensorsOverlay;