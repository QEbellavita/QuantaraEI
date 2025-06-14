
import SensorManager from './SensorManager.js';
import DataNormalizer from './DataNormalizer.js';
import BridgeConnector from './BridgeConnector.js';

/**
 * ProcessorCore
 * Orchestrates sensors, normalization, and bridge syncing pipeline.
 */
export default class ProcessorCore {
  /**
   * @param {object} config - Configuration for sensors & normalizer
   * @param {object} bridgeInstance - Initialized UniversalSystemBridge
   */
  constructor(config, bridgeInstance) {
    this.sensors = new SensorManager(config.sensors);
    this.normalizer = new DataNormalizer(config.normalizer);
    this.bridgeConnector = new BridgeConnector(bridgeInstance);
  }

  start() {
    this.sensors.start();

    // Heart rate pipeline
    this.sensors.on('rawHeartRate', rawHr => {
      const hr = this.normalizer.processHeartRate(rawHr);
      this.bridgeConnector.syncHeartRate(hr);
    });

    // EDA pipeline
    this.sensors.on('rawEda', rawEda => {
      const eda = this.normalizer.processEda(rawEda);
      this.bridgeConnector.syncEda(eda);
    });
  }

  stop() {
    this.sensors.stop();
  }
}
