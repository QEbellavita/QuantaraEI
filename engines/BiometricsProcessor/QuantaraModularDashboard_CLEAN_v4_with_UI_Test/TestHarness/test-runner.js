import EmotionEngine from '../EmotionEngine/EmotionEngine.js';
import WellnessEngine from '../WellnessEngine/WellnessEngine.js';
import SuggestionsEngine from '../SuggestionsEngine/SuggestionsEngine.js';

const emotionEngine = new EmotionEngine();
const wellnessEngine = new WellnessEngine();
const suggestionsEngine = new SuggestionsEngine();

// Mock data samples
const mockEmotionData = {
    joy: 0.8,
    fear: 0.1,
    anger: 0.05,
    sadness: 0.2
};

const mockPhysiologicalData = {
    heartRate: 78,
    eda: 0.35,
    hrv: 0.12
};

// Run through engines
console.log("=== Emotion Analysis ===");
const emotionResult = emotionEngine.process(mockEmotionData);
console.log("Emotion Result:", emotionResult);

console.log("=== Wellness Evaluation ===");
const wellnessResult = wellnessEngine.evaluate(mockPhysiologicalData);
console.log("Wellness Result:", wellnessResult);

console.log("=== Suggestion Output ===");
const suggestion = suggestionsEngine.generateSuggestion(emotionResult);
console.log("Suggestion:", suggestion);
