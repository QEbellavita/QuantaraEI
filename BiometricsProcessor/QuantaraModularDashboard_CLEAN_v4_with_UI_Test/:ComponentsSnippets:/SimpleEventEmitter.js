
// SimpleEventEmitter.js
// Lightweight EventEmitter for browser modules

export default class SimpleEventEmitter {
  constructor() {
    this.target = new EventTarget();
  }

  on(eventName, callback) {
    this.target.addEventListener(eventName, (event) => callback(event.detail));
  }

  emit(eventName, data) {
    this.target.dispatchEvent(new CustomEvent(eventName, { detail: data }));
  }

  removeAllListeners() {
    // EventTarget does not natively support removeAllListeners.
    // To fully implement this, you'd track listeners manually.
    console.warn('SimpleEventEmitter.removeAllListeners() not implemented');
  }
}
