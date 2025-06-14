
export default class EdAPISensor {
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
      const fakeEda = 0.1 + Math.random() * 0.5; // arbitrary units
      if (this.listeners.has('data')) {
        this.listeners.get('data')(fakeEda);
      }
    }, 1000);
  }

  stop() {
    clearInterval(this.interval);
  }
}
