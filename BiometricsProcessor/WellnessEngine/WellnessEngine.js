
// WellnessEngine.js
// Simple template for computing wellness metrics from biometric trends

export default class WellnessEngine {
  constructor(config = {}) {
    this.config = config;
    console.log("WellnessEngine initialized with config:", this.config);

    this.hrvHistory = [];
    this.stressHistory = [];
  }

  update(hrv, stressLevel) {
    const now = Date.now();

    // Maintain short rolling history
    this.hrvHistory.push({ value: hrv, timestamp: now });
    this.stressHistory.push({ value: stressLevel, timestamp: now });

    if (this.hrvHistory.length > 100) this.hrvHistory.shift();
    if (this.stressHistory.length > 100) this.stressHistory.shift();

    return this.computeWellnessMetrics();
  }

  computeWellnessMetrics() {
    // Example naive metrics — replace with real model later
    const avgHRV = this.hrvHistory.reduce((sum, d) => sum + d.value, 0) / Math.max(this.hrvHistory.length, 1);
    const avgStress = this.stressHistory.reduce((sum, d) => sum + d.value, 0) / Math.max(this.stressHistory.length, 1);

    const resilienceScore = Math.min(100, Math.max(0, (avgHRV - 30) * 2));
    const chronicStressIndex = Math.min(100, avgStress * 100);

    return {
      resilienceScore,
      chronicStressIndex,
      timestamp: Date.now()
    };
  }
}
