// ====================================
// LABS OVERLAY COMPONENT
// ====================================

export class LabsOverlay {
    constructor(notificationManager, labsManager, navigationManager, aiConversationEngine) {
        this.notificationManager = notificationManager;
        this.labsManager = labsManager;
        this.navigationManager = navigationManager;
        this.aiConversationEngine = aiConversationEngine;
        
        this.isVisible = false;
        this.activeCategory = 'featured';
        this.analysisPoints = 1247;
        this.quantumCoherence = 87.3;
        this.activeLabs = new Set();
        
        this.labs = {
            featured: [
                {
                    id: 'emotional-fusion',
                    name: 'Emotional Fusion',
                    icon: '🧠💓',
                    description: 'Real-time multimodal emotion analysis',
                    status: 'ready',
                    complexity: 'advanced',
                    estimatedTime: '2-3 min',
                    capabilities: ['Face', 'Voice', 'Biometric', 'Context']
                },
                {
                    id: 'quantum',
                    name: 'Quantum Analysis',
                    icon: '⚛️',
                    description: 'Quantum-enhanced pattern recognition',
                    status: 'ready',
                    complexity: 'expert',
                    estimatedTime: '3-5 min',
                    capabilities: ['Superposition', 'Entanglement', 'Optimization']
                },
                {
                    id: 'predictive',
                    name: 'Predictive Intelligence',
                    icon: '🔮',
                    description: 'AI-powered future state prediction',
                    status: 'ready',
                    complexity: 'advanced',
                    estimatedTime: '1-2 min',
                    capabilities: ['Forecasting', 'Pattern Analysis', 'Risk Assessment']
                }
            ],
            cognitive: [
                {
                    id: 'deep-emotion',
                    name: 'Deep Emotion Analysis',
                    icon: '🔬',
                    description: 'Advanced emotional state mapping',
                    status: 'ready',
                    complexity: 'intermediate',
                    estimatedTime: '2-4 min',
                    capabilities: ['Micro-expressions', 'Voice patterns', 'Stress analysis']
                },
                {
                    id: 'personality',
                    name: 'Personality Testing',
                    icon: '📊',
                    description: 'Comprehensive personality profiling',
                    status: 'ready',
                    complexity: 'beginner',
                    estimatedTime: '5-10 min',
                    capabilities: ['Big Five', 'AI Assessment', 'Behavioral Analysis']
                },
                {
                    id: 'cognitive-load',
                    name: 'Cognitive Load Analysis',
                    icon: '🧩',
                    description: 'Mental workload optimization',
                    status: 'beta',
                    complexity: 'intermediate',
                    estimatedTime: '3-5 min',
                    capabilities: ['Attention tracking', 'Mental fatigue', 'Performance']
                }
            ],
            multimodal: [
                {
                    id: 'multimodal',
                    name: 'Multimodal Fusion',
                    icon: '🌐',
                    description: 'Cross-modal data integration',
                    status: 'ready',
                    complexity: 'advanced',
                    estimatedTime: '2-3 min',
                    capabilities: ['Audio', 'Visual', 'Sensor', 'Biometric']
                },
                {
                    id: 'biometric',
                    name: 'Biometric Integration',
                    icon: '💓',
                    description: 'Advanced health metrics analysis',
                    status: 'ready',
                    complexity: 'intermediate',
                    estimatedTime: '1-2 min',
                    capabilities: ['Heart Rate', 'HRV', 'Stress', 'Recovery']
                },
                {
                    id: 'environmental',
                    name: 'Environmental Context',
                    icon: '🌍',
                    description: 'Ambient intelligence analysis',
                    status: 'experimental',
                    complexity: 'advanced',
                    estimatedTime: '2-4 min',
                    capabilities: ['Light', 'Sound', 'Motion', 'Location']
                }
            ],
            experimental: [
                {
                    id: 'neural-mapping',
                    name: 'Neural Pattern Mapping',
                    icon: '🧬',
                    description: 'Advanced neural network analysis',
                    status: 'experimental',
                    complexity: 'expert',
                    estimatedTime: '5-10 min',
                    capabilities: ['Pattern recognition', 'Neural pathways', 'Plasticity']
                },
                {
                    id: 'quantum-consciousness',
                    name: 'Quantum Consciousness',
                    icon: '🌌',
                    description: 'Consciousness state analysis',
                    status: 'research',
                    complexity: 'expert',
                    estimatedTime: '10-15 min',
                    capabilities: ['Awareness levels', 'Quantum states', 'Consciousness']
                },
                {
                    id: 'temporal-analysis',
                    name: 'Temporal Analysis',
                    icon: '⏰',
                    description: 'Time-series pattern discovery',
                    status: 'beta',
                    complexity: 'advanced',
                    estimatedTime: '3-7 min',
                    capabilities: ['Chronobiology', 'Rhythms', 'Periodicity']
                }
            ]
        };
        
        this.init();
    }

    init() {
        this.setupOverlay();
        this.setupEventListeners();
        this.startQuantumUpdates();
        console.log('⚛️ Labs Overlay initialized');
    }

    // ====================================
    // OVERLAY MANAGEMENT
    // ====================================

    show() {
        const overlay = document.getElementById('labsOverlay');
        if (overlay) {
            overlay.classList.add('active');
            this.isVisible = true;
            this.updateQuantumMetrics();
            this.notificationManager?.show('⚛️ Quantum AI Labs interface opened', 'quantum');
        }
    }

    hide() {
        const overlay = document.getElementById('labsOverlay');
        if (overlay) {
            overlay.classList.remove('active');
            this.isVisible = false;
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
        if (document.getElementById('labsOverlay')) return;

        const overlayHTML = this.createOverlayHTML();
        document.body.insertAdjacentHTML('beforeend', overlayHTML);
        
        // Initialize with featured labs
        this.switchCategory('featured');
    }

    createOverlayHTML() {
        return `
            <div id="labsOverlay" class="labs-overlay">
                <div class="overlay-content">
                    ${this.createHeader()}
                    ${this.createQuantumStatus()}
                    ${this.createCategoryTabs()}
                    ${this.createLabsGrid()}
                    ${this.createAnalysisQueue()}
                </div>
            </div>
        `;
    }

    createHeader() {
        return `
            <div class="overlay-header">
                <div class="header-content">
                    <div class="header-title">
                        <h2>⚛️ Quantum AI Labs</h2>
                        <p>Advanced Intelligence Analysis Platform</p>
                    </div>
                    <div class="header-metrics">
                        <div class="metric-item">
                            <span class="metric-label">Analysis Points</span>
                            <span class="metric-value" id="analysisPoints">${this.analysisPoints}</span>
                        </div>
                        <div class="metric-item">
                            <span class="metric-label">Active Labs</span>
                            <span class="metric-value" id="activeLabs">${this.activeLabs.size}</span>
                        </div>
                    </div>
                </div>
                <button class="labs-close" onclick="closeLabs()">×</button>
            </div>
        `;
    }

    createQuantumStatus() {
        return `
            <div class="quantum-status">
                <div class="status-grid">
                    <div class="status-item">
                        <div class="status-icon">⚛️</div>
                        <div class="status-info">
                            <div class="status-label">Quantum Coherence</div>
                            <div class="status-value" id="quantumCoherence">${this.quantumCoherence}%</div>
                        </div>
                    </div>
                    <div class="status-item">
                        <div class="status-icon">🔗</div>
                        <div class="status-info">
                            <div class="status-label">Parallel Pathways</div>
                            <div class="status-value" id="parallelPathways">5</div>
                        </div>
                    </div>
                    <div class="status-item">
                        <div class="status-icon">⚡</div>
                        <div class="status-info">
                            <div class="status-label">Processing Power</div>
                            <div class="status-value" id="processingPower">91.2%</div>
                        </div>
                    </div>
                    <div class="status-item">
                        <div class="status-icon">🌌</div>
                        <div class="status-info">
                            <div class="status-label">Entanglement</div>
                            <div class="status-value" id="entanglementLevel">0.87</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    createCategoryTabs() {
        return `
            <div class="category-tabs">
                <button class="category-tab active" data-category="featured" onclick="labsOverlay.switchCategory('featured')">
                    ⭐ Featured
                </button>
                <button class="category-tab" data-category="cognitive" onclick="labsOverlay.switchCategory('cognitive')">
                    🧠 Cognitive
                </button>
                <button class="category-tab" data-category="multimodal" onclick="labsOverlay.switchCategory('multimodal')">
                    🌐 Multimodal
                </button>
                <button class="category-tab" data-category="experimental" onclick="labsOverlay.switchCategory('experimental')">
                    🔬 Experimental
                </button>
            </div>
        `;
    }

    createLabsGrid() {
        return `
            <div class="labs-container">
                <div id="labsGrid" class="labs-grid">
                    ${this.renderLabsForCategory('featured')}
                </div>
            </div>
        `;
    }

    createAnalysisQueue() {
        return `
            <div class="analysis-queue">
                <div class="queue-header">
                    <h4>📊 Analysis Queue</h4>
                    <button class="queue-action" onclick="labsOverlay.runAdvancedAnalysis()">
                        🎯 Run Advanced Analysis
                    </button>
                </div>
                <div id="queueContent" class="queue-content">
                    <p class="queue-empty">No analyses queued. Select a lab to begin.</p>
                </div>
            </div>
        `;
    }

    renderLabsForCategory(category) {
        const labs = this.labs[category] || [];
        return labs.map(lab => this.createLabCard(lab)).join('');
    }

    createLabCard(lab) {
        const statusClass = this.getStatusClass(lab.status);
        const complexityClass = this.getComplexityClass(lab.complexity);
        
        return `
            <div class="lab-card ${statusClass}" data-lab="${lab.id}">
                <div class="lab-header">
                    <div class="lab-icon">${lab.icon}</div>
                    <div class="lab-status ${statusClass}">${lab.status}</div>
                </div>
                
                <div class="lab-content">
                    <h4 class="lab-name">${lab.name}</h4>
                    <p class="lab-description">${lab.description}</p>
                    
                    <div class="lab-metadata">
                        <div class="lab-complexity ${complexityClass}">
                            <span class="complexity-icon">${this.getComplexityIcon(lab.complexity)}</span>
                            <span>${lab.complexity}</span>
                        </div>
                        <div class="lab-time">
                            <span class="time-icon">⏱️</span>
                            <span>${lab.estimatedTime}</span>
                        </div>
                    </div>
                    
                    <div class="lab-capabilities">
                        ${lab.capabilities.map(cap => `<span class="capability-tag">${cap}</span>`).join('')}
                    </div>
                </div>
                
                <div class="lab-actions">
                    <button class="lab-btn primary" onclick="labsOverlay.launchLab('${lab.id}')" 
                            ${lab.status === 'maintenance' ? 'disabled' : ''}>
                        <span class="btn-icon">🚀</span>
                        <span>Launch Lab</span>
                    </button>
                    <button class="lab-btn secondary" onclick="labsOverlay.showLabInfo('${lab.id}')">
                        <span class="btn-icon">ℹ️</span>
                        <span>Info</span>
                    </button>
                </div>
            </div>
        `;
    }

    // ====================================
    // CATEGORY MANAGEMENT
    // ====================================

    switchCategory(category) {
        // Update tab buttons
        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.category === category);
        });

        // Update labs grid
        const labsGrid = document.getElementById('labsGrid');
        if (labsGrid) {
            labsGrid.innerHTML = this.renderLabsForCategory(category);
        }

        this.activeCategory = category;
    }

    // ====================================
    // LAB ACTIONS
    // ====================================

    launchLab(labId) {
        const lab = this.findLabById(labId);
        if (!lab) return;

        this.notificationManager?.show(`⚛️ Initializing ${lab.name}...`, 'quantum');
        
        // Add to active labs
        this.activeLabs.add(labId);
        this.updateActiveLabsCount();

        // Add to analysis queue
        this.addToQueue(lab);

        // Special handling for emotional fusion
        if (labId === 'emotional-fusion') {
            this.hide();
            this.navigationManager?.switchSection('emotionalFusion');
            return;
        }

        // For other labs, integrate with AI conversation
        setTimeout(() => {
            this.hide();
            this.navigationManager?.switchSection('aiCoach');
            
            setTimeout(() => {
                const labResponse = this.generateLabResponse(lab);
                this.aiConversationEngine?.addMessage('ai', labResponse, true);
            }, 1000);
            
            this.notificationManager?.show(`🧪 ${lab.name} analysis started`, 'success');
        }, 1500);
    }

    showLabInfo(labId) {
        const lab = this.findLabById(labId);
        if (!lab) return;

        const infoContent = this.generateLabInfo(lab);
        this.showModal('Lab Information', infoContent);
    }

    generateLabResponse(lab) {
        const responses = {
            'quantum': `⚛️ **Quantum Analysis Laboratory**\n\n**Quantum Computing Simulation Active:**\n• Coherence Level: ${this.quantumCoherence}%\n• Optimization Score: 91.2%\n• Parallel Processing: ${Math.floor(Math.random() * 3 + 4)} pathways\n• Entanglement Strength: 0.87\n\n**Quantum Algorithms Online:**\n• Quantum Annealing: Optimizing life domains\n• Superposition Search: Exploring possibilities\n• Entanglement Analysis: Mapping correlations\n\n**Ready for quantum-enhanced optimization?**`,
            
            'deep-emotion': `🔬 **Deep Emotion Analysis Laboratory**\n\n**Multimodal Emotion Fusion Active:**\n• Facial micro-expression: 94% accuracy\n• Voice pattern recognition: 89% confidence\n• Biometric correlation: Real-time fusion\n• Text sentiment: Advanced NLP\n\n**Current Reading:** Analytical Focus with Optimistic Undertones\n**Confidence:** 96.3%\n\nWhat aspect would you like to explore?`,
            
            'personality': `📊 **Personality Testing Laboratory**\n\n**Big Five + AI Assessment:**\n• Openness: 78% (High creativity)\n• Conscientiousness: 91% (Excellent discipline)\n• Extraversion: 65% (Balanced social energy)\n• Agreeableness: 82% (Collaborative)\n• Neuroticism: 23% (Emotionally stable)\n\n**AI Profile:** Analytical-Achiever\n**Confidence:** 87%\n\nReady for advanced profiling?`,
            
            'predictive': `🔮 **Predictive Intelligence Laboratory**\n\n**AI Forecasting Models:**\n• Energy prediction: 91% accuracy\n• Mood forecasting: 84% confidence\n• Productivity windows: 96% precision\n\n**Next 6 Hours:**\n⚡ Peak: 9:15-11:30 AM\n📉 Dip: 2:17 PM\n🎯 Optimal decisions: 10:45 AM\n\nWhich model would you like to explore?`,
            
            'multimodal': `🌐 **Multimodal Fusion Laboratory**\n\n**Cross-Modal Analysis Active:**\n• Audio-Visual Sync: 92% correlation\n• Sensor Integration: Real-time processing\n• Biometric Fusion: Advanced algorithms\n• Context Awareness: Environmental factors\n\n**Current Fusion State:**\n• Voice-Camera emotion: 87% agreement\n• Stress-Biometric: 0.91 correlation\n• Environmental match: 94% confidence\n\nReady for comprehensive analysis?`,
            
            'biometric': `💓 **Biometric Integration Laboratory**\n\n**Health Metrics Analysis:**\n• Heart Rate: 72 BPM (Optimal)\n• HRV: 45ms (Good recovery)\n• Stress Level: 15% (Well managed)\n• Blood Oxygen: 98% (Excellent)\n\n**Pattern Recognition:**\n• Circadian alignment: 94%\n• Recovery patterns: Strong\n• Stress resilience: High\n\nWhat would you like to analyze deeper?`
        };
        
        return responses[lab.id] || `🔬 **${lab.name} Laboratory**\n\nAdvanced analysis capabilities initialized. This lab provides cutting-edge insights using AI-powered analysis. What would you like to explore?`;
    }

    generateLabInfo(lab) {
        return `
            <div class="lab-info-content">
                <div class="lab-info-header">
                    <div class="lab-info-icon">${lab.icon}</div>
                    <div>
                        <h3>${lab.name}</h3>
                        <p class="lab-info-status ${this.getStatusClass(lab.status)}">${lab.status}</p>
                    </div>
                </div>
                
                <div class="lab-info-description">
                    <p>${lab.description}</p>
                </div>
                
                <div class="lab-info-details">
                    <div class="detail-item">
                        <strong>Complexity:</strong> ${lab.complexity}
                    </div>
                    <div class="detail-item">
                        <strong>Estimated Time:</strong> ${lab.estimatedTime}
                    </div>
                    <div class="detail-item">
                        <strong>Capabilities:</strong> ${lab.capabilities.join(', ')}
                    </div>
                </div>
                
                <div class="lab-info-requirements">
                    <h4>Requirements:</h4>
                    <ul>
                        <li>Quantum coherence: >80%</li>
                        <li>Analysis points: 50+ required</li>
                        <li>Estimated analysis time: ${lab.estimatedTime}</li>
                    </ul>
                </div>
            </div>
        `;
    }

    // ====================================
    // ANALYSIS QUEUE
    // ====================================

    addToQueue(lab) {
        const queueContent = document.getElementById('queueContent');
        if (!queueContent) return;

        // Remove empty message if it exists
        const emptyMessage = queueContent.querySelector('.queue-empty');
        if (emptyMessage) {
            emptyMessage.remove();
        }

        const queueItem = document.createElement('div');
        queueItem.className = 'queue-item';
        queueItem.innerHTML = `
            <div class="queue-item-icon">${lab.icon}</div>
            <div class="queue-item-info">
                <div class="queue-item-name">${lab.name}</div>
                <div class="queue-item-status">Initializing...</div>
            </div>
            <div class="queue-item-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 0%"></div>
                </div>
            </div>
        `;

        queueContent.appendChild(queueItem);

        // Simulate progress
        this.simulateAnalysisProgress(queueItem, lab);
    }

    simulateAnalysisProgress(queueItem, lab) {
        const progressFill = queueItem.querySelector('.progress-fill');
        const statusText = queueItem.querySelector('.queue-item-status');
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15 + 5;
            
            if (progress >= 100) {
                progress = 100;
                statusText.textContent = 'Complete';
                queueItem.classList.add('completed');
                clearInterval(interval);
                
                // Remove after delay
                setTimeout(() => {
                    queueItem.remove();
                    this.activeLabs.delete(lab.id);
                    this.updateActiveLabsCount();
                }, 3000);
            } else {
                statusText.textContent = 'Processing...';
            }
            
            progressFill.style.width = `${progress}%`;
        }, 500);
    }

    runAdvancedAnalysis() {
        this.notificationManager?.show('🎯 Running advanced multi-lab analysis...', 'quantum');
        
        // Add multiple labs to queue
        const featuredLabs = this.labs.featured.slice(0, 2);
        featuredLabs.forEach(lab => {
            this.addToQueue(lab);
            this.activeLabs.add(lab.id);
        });
        
        this.updateActiveLabsCount();
        
        setTimeout(() => {
            this.notificationManager?.show('✨ Advanced analysis complete!', 'success');
        }, 8000);
    }

    // ====================================
    // EVENT LISTENERS
    // ====================================

    setupEventListeners() {
        // Close overlay when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('labs-overlay')) {
                this.hide();
            }
        });

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isVisible) {
                this.hide();
            }
        });
    }

    // ====================================
    // QUANTUM UPDATES
    // ====================================

    startQuantumUpdates() {
        setInterval(() => {
            if (this.isVisible) {
                this.updateQuantumMetrics();
            }
        }, 3000);
    }

    updateQuantumMetrics() {
        // Simulate quantum fluctuations
        this.quantumCoherence = Math.max(75, Math.min(95, 
            this.quantumCoherence + (Math.random() - 0.5) * 2
        ));
        
        const updates = {
            'quantumCoherence': `${this.quantumCoherence.toFixed(1)}%`,
            'parallelPathways': Math.floor(Math.random() * 3 + 4),
            'processingPower': `${(88 + Math.random() * 8).toFixed(1)}%`,
            'entanglementLevel': (0.8 + Math.random() * 0.15).toFixed(2),
            'analysisPoints': this.analysisPoints + Math.floor(Math.random() * 10)
        };

        Object.entries(updates).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        });

        if (typeof updates.analysisPoints === 'number') {
            this.analysisPoints = updates.analysisPoints;
        }
    }

    updateActiveLabsCount() {
        const element = document.getElementById('activeLabs');
        if (element) {
            element.textContent = this.activeLabs.size;
        }
    }

    // ====================================
    // UTILITY METHODS
    // ====================================

    findLabById(labId) {
        for (const category of Object.values(this.labs)) {
            const lab = category.find(l => l.id === labId);
            if (lab) return lab;
        }
        return null;
    }

    getStatusClass(status) {
        const statusMap = {
            'ready': 'status-ready',
            'beta': 'status-beta',
            'experimental': 'status-experimental',
            'research': 'status-research',
            'maintenance': 'status-maintenance'
        };
        return statusMap[status] || 'status-unknown';
    }

    getComplexityClass(complexity) {
        const complexityMap = {
            'beginner': 'complexity-beginner',
            'intermediate': 'complexity-intermediate',
            'advanced': 'complexity-advanced',
            'expert': 'complexity-expert'
        };
        return complexityMap[complexity] || 'complexity-unknown';
    }

    getComplexityIcon(complexity) {
        const icons = {
            'beginner': '🟢',
            'intermediate': '🟡',
            'advanced': '🟠',
            'expert': '🔴'
        };
        return icons[complexity] || '⚪';
    }

    showModal(title, content) {
        // Create modal overlay
        const modal = document.createElement('div');
        modal.className = 'labs-modal-overlay';
        modal.innerHTML = `
            <div class="labs-modal">
                <div class="labs-modal-header">
                    <h3>${title}</h3>
                    <button class="labs-modal-close">&times;</button>
                </div>
                <div class="labs-modal-content">
                    ${content}
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Event listeners
        modal.querySelector('.labs-modal-close').onclick = () => modal.remove();
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };

        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (document.body.contains(modal)) {
                modal.remove();
            }
        }, 10000);
    }

    // ====================================
    // PUBLIC API
    // ====================================

    getActiveLabsCount() {
        return this.activeLabs.size;
    }

    getAnalysisPoints() {
        return this.analysisPoints;
    }

    getQuantumCoherence() {
        return this.quantumCoherence;
    }

    // ====================================
    // CLEANUP
    // ====================================

    destroy() {
        const overlay = document.getElementById('labsOverlay');
        if (overlay) {
            overlay.remove();
        }
        
        this.activeLabs.clear();
        console.log('⚛️ Labs Overlay destroyed');
    }
}

// Export for global access
export default LabsOverlay;