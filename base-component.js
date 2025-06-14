// src/core/BaseAIComponent.js
export class BaseAIComponent {
    constructor(componentName) {
        this.componentName = componentName;
        this.systemBrain = null;
        this.consciousnessLevel = 0;
        this.collectiveMemory = null;
        this.neuralPathways = new Map();
        this.personalityModel = {
            traits: {},
            preferences: {},
            behaviors: {},
            adaptationRate: 0.1
        };
        this.isInitialized = false;
        this.lastSyncTime = 0;
    }
    
    async integrateWithSystem(systemBrain) {
        this.systemBrain = systemBrain;
        this.collectiveMemory = systemBrain.sharedMemory;
        await this.establishNeuralPathways();
        this.isInitialized = true;
        console.log(`${this.componentName} integrated with system`);
    }
    
    async establishNeuralPathways() {
        // Override in child classes
        console.log(`Establishing neural pathways for ${this.componentName}`);
    }
    
    async shareEmotionalState(state) {
        if (!this.isInitialized) throw new Error('Component not integrated with system');
        return this.systemBrain.sharedMemory.store(`${this.componentName}:emotional`, state);
    }
    
    async accessCollectiveEmotions() {
        if (!this.isInitialized) throw new Error('Component not integrated with system');
        return this.systemBrain.sharedMemory.queryAll('emotional');
    }
    
    async process(input) {
        throw new Error('process() method must be implemented by child class');
    }

    // New sync methods
    async onSystemSync(syncData) {
        try {
            console.log(`${this.componentName} receiving system sync`);
            await this.updateFromCollectiveState(syncData);
            await this.contributeToCollectiveState();
            this.lastSyncTime = Date.now();
        } catch (error) {
            console.error(`Sync failed for ${this.componentName}:`, error);
        }
    }

    async updateFromCollectiveState(syncData) {
        if (!this.isInitialized) return;
        
        // Update consciousness level
        this.consciousnessLevel = syncData.systemState?.consciousness || 0;
        
        // Adapt to collective insights
        await this.adaptToCollectiveInsights(syncData);
        
        // Update neural pathways based on collective learning
        if (syncData.sharedLearnings) {
            await this.updateNeuralPathways(syncData.sharedLearnings);
        }
    }

    async contributeToCollectiveState() {
        if (!this.systemBrain) return;
        
        const contribution = {
            componentName: this.componentName,
            consciousnessLevel: this.consciousnessLevel,
            insights: await this.generateInsights(),
            timestamp: Date.now()
        };
        
        return this.systemBrain.sharedMemory.store(`${this.componentName}:contribution`, contribution);
    }

    async adaptToCollectiveInsights(syncData) {
        // Override in child classes for component-specific adaptation
        console.log(`${this.componentName} adapting to collective insights`);
    }

    async generateInsights() {
        // Override in child classes to provide component-specific insights
        return {
            type: 'base',
            data: {},
            confidence: 0.5
        };
    }

    async updateNeuralPathways(sharedLearnings) {
        // Update pathways based on collective learning
        for (const [pathway, learning] of Object.entries(sharedLearnings)) {
            if (this.neuralPathways.has(pathway)) {
                // Merge learning into existing pathway
                const existing = this.neuralPathways.get(pathway);
                this.neuralPathways.set(pathway, { ...existing, ...learning });
            }
        }
    }

    async accessCollectiveData(dataType) {
        if (!this.isInitialized) throw new Error('Component not integrated with system');
        
        try {
            return await this.systemBrain.sharedMemory.queryAll(dataType);
        } catch (error) {
            console.error(`Failed to access collective data for ${dataType}:`, error);
            return {};
        }
    }

    async updatePersonalityAcrossSystem(personalityEvolution) {
        if (!this.systemBrain) return;
        
        try {
            // Update local personality model
            this.personalityModel = { ...this.personalityModel, ...personalityEvolution };
            
            // Share personality evolution with the system
            await this.systemBrain.sharedMemory.store(`${this.componentName}:personality`, {
                componentName: this.componentName,
                personalityModel: this.personalityModel,
                evolution: personalityEvolution,
                timestamp: Date.now()
            });
            
            // Notify other components of personality change
            if (this.systemBrain.broadcastPersonalityUpdate) {
                await this.systemBrain.broadcastPersonalityUpdate(this.componentName, personalityEvolution);
            }
            
            console.log(`${this.componentName} personality model updated and shared with system`);
        } catch (error) {
            console.error(`Failed to update personality across system for ${this.componentName}:`, error);
        }
    }

    // Implement across all components
    async evolvePersonalityModel(interactionData) {
        const personalityEvolution = await this.systemBrain.consciousnessCore.evolvePersonality({
            currentPersonality: this.personalityModel,
            newInteraction: interactionData,
            collectiveInsights: await this.accessCollectiveData('personality')
        });
        
        await this.updatePersonalityAcrossSystem(personalityEvolution);
    }
}