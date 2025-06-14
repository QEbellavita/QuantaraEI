
export default class HeartRateAPI {
  constructor(config) {
    this.config = config;
    this.listeners = new Map();
    this.interval = null;
  }

  on(eventName, callback) {
    this.listeners.set(eventName, callback);
  }

  startEmitting() {
    this.interval = setInterval(() => {
      const fakeHr = 60 + Math.random() * 40; // 60-100 bpm
      if (this.listeners.has('data')) {
        this.listeners.get('data')(fakeHr);
      }
    }, 1000);
  }

  stop() {
    clearInterval(this.interval);
  }
}
