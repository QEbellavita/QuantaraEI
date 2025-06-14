
/**
 * BridgeConnector
 * Wraps UniversalSystemBridge for bidirectional sync of processed data.
 */
export default class BridgeConnector {
  constructor(bridgeInstance) {
    this.bridge = bridgeInstance;
  }

  syncHeartRate(cleanedHr) {
    if (typeof this.bridge.send === 'function') {
      this.bridge.send('heartRate', cleanedHr);
    } else if (typeof this.bridge.broadcastEvent === 'function') {
      this.bridge.broadcastEvent('heartRate', cleanedHr);
    } else {
      console.warn('Bridge does not support send or broadcastEvent for heartRate');
    }
  }

  syncEda(cleanedEda) {
    if (typeof this.bridge.send === 'function') {
      this.bridge.send('eda', cleanedEda);
    } else if (typeof this.bridge.broadcastEvent === 'function') {
      this.bridge.broadcastEvent('eda', cleanedEda);
    } else {
      console.warn('Bridge does not support send or broadcastEvent for EDA');
    }
  }

  // Example response handler; expand as needed
  onBridgeEvent(eventName, handler) {
    if (typeof this.bridge.on === 'function') {
      this.bridge.on(eventName, handler);
    } else {
      console.warn('Bridge does not support .on() handler registration');
    }
  }
}
