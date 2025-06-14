
import SimpleEventEmitter from './SimpleEventEmitter.js';
import HeartRateAPI from './HeartRateAPI.js';
import EdAPISensor from './EdAPISensor.js';

/**
 * SensorManager
 * Handles initialization and event emission for raw biometric sensors.
 */
export default class SensorManager extends SimpleEventEmitter {
  constructor(config) {
    super();
    this.config = config;
  }

  initHeartRateSensor() {
    this.hrSensor = new HeartRateAPI(this.config.hr);
    this.hrSensor.on('data', rawHr => {
      this.emit('rawHeartRate', rawHr);
    });
    this.hrSensor.startEmitting(); // Start mock emission
  }

  initEdaSensor() {
    this.edaSensor = new EdAPISensor(this.config.eda);
    this.edaSensor.on('data', rawEda => {
      this.emit('rawEda', rawEda);
    });
    this.edaSensor.startEmitting(); // Start mock emission
  }

  start() {
    this.initHeartRateSensor();
    this.initEdaSensor();
  }

  stop() {
    if (this.hrSensor) this.hrSensor.stop();
    if (this.edaSensor) this.edaSensor.stop();
    this.removeAllListeners();
  }
}
