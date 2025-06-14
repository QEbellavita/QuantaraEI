// ====================================
// AUDIO MANAGER
// ====================================

export class AudioManager {
    constructor(notificationManager) {
        this.notificationManager = notificationManager;
        
        this.audioContext = null;
        this.mediaStream = null;
        this.analyser = null;
        this.microphone = null;
        
        this.isListening = false;
        this.isRecording = false;
        this.mediaRecorder = null;
        this.recordedChunks = [];
        
        this.audioSettings = {
            sampleRate: 44100,
            fftSize: 2048,
            smoothingTimeConstant: 0.8,
            minDecibels: -90,
            maxDecibels: -10
        };
        
        this.emotionAnalysis = {
            enabled: false,
            features: {
                pitch: 0,
                energy: 0,
                spectralCentroid: 0,
                mfcc: [],
                tempo: 0
            }
        };
        
        this.callbacks = {
            onVolumeChange: [],
            onFrequencyData: [],
            onEmotionDetected: [],
            onSpeechDetected: []
        };
        
        this.init();
    }

    init() {
        this.setupAudioContext();
        console.log('🎵 Audio Manager initialized');
    }

    // ====================================
    // AUDIO CONTEXT SETUP
    // ====================================

    setupAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            console.log('🎵 Audio context created');
        } catch (error) {
            console.error('❌ Failed to create audio context:', error);
        }
    }

    async resumeAudioContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }
    }

    // ====================================
    // MICROPHONE ACCESS
    // ====================================

    async requestMicrophoneAccess() {
        try {
            await this.resumeAudioContext();
            
            this.mediaStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                    sampleRate: this.audioSettings.sampleRate
                }
            });

            this.setupAnalyser();
            this.setupMediaRecorder();
            
            this.notificationManager?.show('🎤 Microphone access granted', 'success');
            return true;
            
        } catch (error) {
            console.error('❌ Microphone access denied:', error);
            this.notificationManager?.show('❌ Microphone access denied', 'error');
            return false;
        }
    }

    setupAnalyser() {
        if (!this.audioContext || !this.mediaStream) return;

        this.microphone = this.audioContext.createMediaStreamSource(this.mediaStream);
        this.analyser = this.audioContext.createAnalyser();
        
        this.analyser.fftSize = this.audioSettings.fftSize;
        this.analyser.smoothingTimeConstant = this.audioSettings.smoothingTimeConstant;
        this.analyser.minDecibels = this.audioSettings.minDecibels;
        this.analyser.maxDecibels = this.audioSettings.maxDecibels;
        
        this.microphone.connect(this.analyser);
        
        console.log('🎵 Audio analyser setup complete');
    }

    setupMediaRecorder() {
        if (!this.mediaStream) return;

        try {
            this.mediaRecorder = new MediaRecorder(this.mediaStream, {
                mimeType: 'audio/webm;codecs=opus'
            });

            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.recordedChunks.push(event.data);
                }
            };

            this.mediaRecorder.onstop = () => {
                this.processRecording();
            };

            console.log('🎵 Media recorder setup complete');
        } catch (error) {
            console.error('❌ Failed to setup media recorder:', error);
        }
    }

    // ====================================
    // AUDIO ANALYSIS
    // ====================================

    startAnalysis() {
        if (!this.analyser) {
            this.notificationManager?.show('❌ Audio analyser not ready', 'error');
            return false;
        }

        this.isListening = true;
        this.analyseAudio();
        this.notificationManager?.show('🎵 Audio analysis started', 'success');
        return true;
    }

    stopAnalysis() {
        this.isListening = false;
        this.notificationManager?.show('🎵 Audio analysis stopped', 'info');
    }

    analyseAudio() {
        if (!this.isListening || !this.analyser) return;

        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        const frequencyArray = new Uint8Array(bufferLength);

        this.analyser.getByteTimeDomainData(dataArray);
        this.analyser.getByteFrequencyData(frequencyArray);

        // Calculate audio metrics
        const metrics = this.calculateAudioMetrics(dataArray, frequencyArray);
        
        // Trigger callbacks
        this.triggerCallbacks('onVolumeChange', metrics.volume);
        this.triggerCallbacks('onFrequencyData', frequencyArray);

        // Emotion analysis if enabled
        if (this.emotionAnalysis.enabled) {
            this.analyzeEmotionalContent(metrics, frequencyArray);
        }

        // Speech detection
        this.detectSpeech(metrics);

        // Continue analysis
        requestAnimationFrame(() => this.analyseAudio());
    }

    calculateAudioMetrics(timeData, frequencyData) {
        // Volume (RMS)
        let sum = 0;
        for (let i = 0; i < timeData.length; i++) {
            const sample = (timeData[i] - 128) / 128;
            sum += sample * sample;
        }
        const rms = Math.sqrt(sum / timeData.length);
        const volume = Math.round(20 * Math.log10(rms + 0.001));

        // Peak frequency
        let maxIndex = 0;
        let maxValue = 0;
        for (let i = 0; i < frequencyData.length; i++) {
            if (frequencyData[i] > maxValue) {
                maxValue = frequencyData[i];
                maxIndex = i;
            }
        }
        const peakFrequency = maxIndex * this.audioContext.sampleRate / (2 * frequencyData.length);

        // Spectral centroid (brightness)
        let weightedSum = 0;
        let magnitudeSum = 0;
        for (let i = 0; i < frequencyData.length; i++) {
            const frequency = i * this.audioContext.sampleRate / (2 * frequencyData.length);
            weightedSum += frequency * frequencyData[i];
            magnitudeSum += frequencyData[i];
        }
        const spectralCentroid = magnitudeSum > 0 ? weightedSum / magnitudeSum : 0;

        // Energy
        const energy = frequencyData.reduce((sum, val) => sum + val * val, 0) / frequencyData.length;

        return {
            volume,
            peakFrequency,
            spectralCentroid,
            energy,
            rms
        };
    }

    analyzeEmotionalContent(metrics, frequencyData) {
        // Update emotion analysis features
        this.emotionAnalysis.features = {
            pitch: metrics.peakFrequency,
            energy: metrics.energy,
            spectralCentroid: metrics.spectralCentroid,
            mfcc: this.calculateMFCC(frequencyData),
            tempo: this.estimateTempo(metrics)
        };

        // Simple emotion classification based on audio features
        const emotion = this.classifyEmotion(this.emotionAnalysis.features);
        
        if (emotion.confidence > 0.6) {
            this.triggerCallbacks('onEmotionDetected', emotion);
        }
    }

    calculateMFCC(frequencyData) {
        // Simplified MFCC calculation
        const mfcc = [];
        const melFilters = this.createMelFilterBank(frequencyData.length);
        
        for (let i = 0; i < 13; i++) {
            let sum = 0;
            for (let j = 0; j < frequencyData.length; j++) {
                sum += frequencyData[j] * melFilters[i][j];
            }
            mfcc.push(Math.log(sum + 1));
        }
        
        return mfcc;
    }

    createMelFilterBank(fftSize) {
        // Simplified mel filter bank creation
        const numFilters = 13;
        const filters = [];
        
        for (let i = 0; i < numFilters; i++) {
            const filter = new Array(fftSize).fill(0);
            const center = (i + 1) * fftSize / (numFilters + 1);
            const width = fftSize / (numFilters + 1);
            
            for (let j = 0; j < fftSize; j++) {
                const distance = Math.abs(j - center);
                if (distance < width) {
                    filter[j] = 1 - distance / width;
                }
            }
            filters.push(filter);
        }
        
        return filters;
    }

    estimateTempo(metrics) {
        // Simplified tempo estimation based on energy peaks
        // In a real implementation, this would use more sophisticated algorithms
        return metrics.energy > 50 ? 120 + Math.random() * 60 : 80 + Math.random() * 40;
    }

    classifyEmotion(features) {
        // Simplified emotion classification
        let emotion = 'neutral';
        let confidence = 0.5;

        if (features.pitch > 300 && features.energy > 60) {
            emotion = 'excited';
            confidence = 0.8;
        } else if (features.pitch < 150 && features.energy < 30) {
            emotion = 'sad';
            confidence = 0.7;
        } else if (features.energy > 80 && features.spectralCentroid > 2000) {
            emotion = 'angry';
            confidence = 0.75;
        } else if (features.pitch > 200 && features.pitch < 300) {
            emotion = 'happy';
            confidence = 0.65;
        }

        return { emotion, confidence, features };
    }

    detectSpeech(metrics) {
        // Simple speech detection based on volume and frequency characteristics
        const isSpeechLikely = metrics.volume > -40 && 
                              metrics.peakFrequency > 80 && 
                              metrics.peakFrequency < 3000;

        if (isSpeechLikely) {
            this.triggerCallbacks('onSpeechDetected', metrics);
        }
    }

    // ====================================
    // RECORDING FUNCTIONALITY
    // ====================================

    startRecording() {
        if (!this.mediaRecorder) {
            this.notificationManager?.show('❌ Media recorder not ready', 'error');
            return false;
        }

        this.recordedChunks = [];
        this.mediaRecorder.start();
        this.isRecording = true;
        
        this.notificationManager?.show('🔴 Recording started', 'info');
        return true;
    }

    stopRecording() {
        if (!this.isRecording || !this.mediaRecorder) return;

        this.mediaRecorder.stop();
        this.isRecording = false;
        
        this.notificationManager?.show('⏹️ Recording stopped', 'info');
    }

    processRecording() {
        if (this.recordedChunks.length === 0) return;

        const blob = new Blob(this.recordedChunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        
        // Create download link
        const a = document.createElement('a');
        a.href = url;
        a.download = `voice-recording-${Date.now()}.webm`;
        a.click();
        
        URL.revokeObjectURL(url);
        this.notificationManager?.show('💾 Recording saved', 'success');
    }

    // ====================================
    // VOICE COMMANDS
    // ====================================

    enableVoiceCommands() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            this.notificationManager?.show('❌ Speech recognition not supported', 'error');
            return false;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.speechRecognition = new SpeechRecognition();
        
        this.speechRecognition.continuous = true;
        this.speechRecognition.interimResults = true;
        this.speechRecognition.lang = 'en-US';

        this.speechRecognition.onstart = () => {
            this.notificationManager?.show('🎤 Voice commands active', 'info');
        };

        this.speechRecognition.onresult = (event) => {
            let finalTranscript = '';
            
            for (let i = event.resultIndex; i < event.results.length; i++) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                }
            }
            
            if (finalTranscript) {
                this.processVoiceCommand(finalTranscript.toLowerCase().trim());
            }
        };

        this.speechRecognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
        };

        this.speechRecognition.start();
        return true;
    }

    disableVoiceCommands() {
        if (this.speechRecognition) {
            this.speechRecognition.stop();
            this.speechRecognition = null;
            this.notificationManager?.show('🔇 Voice commands disabled', 'info');
        }
    }

    processVoiceCommand(command) {
        const commands = {
            'open labs': () => window.toggleLabs?.(),
            'open sensors': () => window.openSensorsOverlay?.(),
            'start focus': () => window.startFocusSession?.(),
            'show health': () => window.switchSection?.('health'),
            'show performance': () => window.switchSection?.('performance'),
            'start recording': () => this.startRecording(),
            'stop recording': () => this.stopRecording(),
            'analyze emotions': () => this.toggleEmotionAnalysis()
        };

        for (const [trigger, action] of Object.entries(commands)) {
            if (command.includes(trigger)) {
                action();
                this.notificationManager?.show(`🎤 Command executed: ${trigger}`, 'success');
                break;
            }
        }
    }

    // ====================================
    // AUDIO EFFECTS & FILTERS
    // ====================================

    applyFilter(filterType, intensity = 1.0) {
        if (!this.audioContext || !this.microphone) return;

        let filter;
        
        switch (filterType) {
            case 'lowpass':
                filter = this.audioContext.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(1000 * intensity, this.audioContext.currentTime);
                break;
                
            case 'highpass':
                filter = this.audioContext.createBiquadFilter();
                filter.type = 'highpass';
                filter.frequency.setValueAtTime(100 * intensity, this.audioContext.currentTime);
                break;
                
            case 'reverb':
                filter = this.createReverbFilter(intensity);
                break;
                
            default:
                return;
        }

        this.microphone.connect(filter);
        filter.connect(this.analyser);
    }

    createReverbFilter(intensity) {
        const convolver = this.audioContext.createConvolver();
        const impulseResponse = this.createImpulseResponse(2, 2, false, intensity);
        convolver.buffer = impulseResponse;
        return convolver;
    }

    createImpulseResponse(duration, decay, reverse, intensity) {
        const sampleRate = this.audioContext.sampleRate;
        const length = sampleRate * duration;
        const impulse = this.audioContext.createBuffer(2, length, sampleRate);
        
        for (let channel = 0; channel < 2; channel++) {
            const channelData = impulse.getChannelData(channel);
            for (let i = 0; i < length; i++) {
                const n = reverse ? length - i : i;
                channelData[i] = (Math.random() * 2 - 1) * 
                                Math.pow(1 - n / length, decay) * intensity;
            }
        }
        
        return impulse;
    }

    // ====================================
    // EVENT SYSTEM
    // ====================================

    on(event, callback) {
        if (this.callbacks[event]) {
            this.callbacks[event].push(callback);
        }
    }

    off(event, callback) {
        if (this.callbacks[event]) {
            const index = this.callbacks[event].indexOf(callback);
            if (index > -1) {
                this.callbacks[event].splice(index, 1);
            }
        }
    }

    triggerCallbacks(event, data) {
        if (this.callbacks[event]) {
            this.callbacks[event].forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in audio callback for ${event}:`, error);
                }
            });
        }
    }

    // ====================================
    // UTILITY METHODS
    // ====================================

    toggleEmotionAnalysis() {
        this.emotionAnalysis.enabled = !this.emotionAnalysis.enabled;
        const status = this.emotionAnalysis.enabled ? 'enabled' : 'disabled';
        this.notificationManager?.show(`🧠 Emotion analysis ${status}`, 'info');
    }

    getAudioSettings() {
        return { ...this.audioSettings };
    }

    updateAudioSettings(newSettings) {
        this.audioSettings = { ...this.audioSettings, ...newSettings };
        
        if (this.analyser) {
            this.analyser.fftSize = this.audioSettings.fftSize;
            this.analyser.smoothingTimeConstant = this.audioSettings.smoothingTimeConstant;
            this.analyser.minDecibels = this.audioSettings.minDecibels;
            this.analyser.maxDecibels = this.audioSettings.maxDecibels;
        }
    }

    getCurrentMetrics() {
        return {
            isListening: this.isListening,
            isRecording: this.isRecording,
            emotionAnalysisEnabled: this.emotionAnalysis.enabled,
            currentFeatures: { ...this.emotionAnalysis.features }
        };
    }

    // ====================================
    // CLEANUP
    // ====================================

    cleanup() {
        this.stopAnalysis();
        this.stopRecording();
        this.disableVoiceCommands();
        
        if (this.mediaStream) {
            this.mediaStream.getTracks().forEach(track => track.stop());
            this.mediaStream = null;
        }
        
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
        
        console.log('🎵 Audio Manager cleaned up');
    }
}