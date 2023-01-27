import Homey from 'homey';
import { ZigBeeDevice } from 'homey-zigbeedriver';
import { debug, CLUSTER } from 'zigbee-clusters';

// debug(true);

class PowerAnalyticsPlug extends ZigBeeDevice {

  async onNodeInit({ zclNode }: any) {
    // const meterPowerCluster = await zclNode.endpoints[1].clusters;
    // console.log(meterPowerCluster);
    // require('inspector').open(9229, '0.0.0.0');

    this.registerCapability("onoff", CLUSTER.ON_OFF);

    this.registerCapability("meter_power", CLUSTER.METERING, {
      get: 'currentSummationDelivered',
      getOpts: {
        getOnStart: true,
        getOnOnline: true,
        pollInterval: 60000,
      },
      report: 'currentSummationDelivered',
    });
    
    // this.registerCapability("meter_power_summed", CLUSTER.METERING, {
    //   get: 'instantaneousDemand',
    //   report: 'instantaneousDemand',
    //   getOpts: {
    //     getOnStart: true,
    //     getOnOnline: true,
    //     pollInterval: 1000,
    //   },
    //   endpoint: 1
    // });

    this.registerCapability("measure_power", CLUSTER.ELECTRICAL_MEASUREMENT, {
      get: 'activePower',
      getOpts: {
        getOnStart: true,
        getOnOnline: true,
        pollInterval: 1000,
      },
      report: 'activePower',
      reportOpts: {
        configureAttributeReporting: {
          minInterval: 0,
          maxInterval: 10,
          minChange: 1,
        }
      },
    });
    
    this.registerCapability("measure_voltage", CLUSTER.ELECTRICAL_MEASUREMENT, {
      get: 'rmsVoltage',
      getOpts: {
        getOnStart: true,
        getOnOnline: true,
        pollInterval: 10000,
      },
      report: 'rmsVoltage',
      reportParser(report: any) {
        console.log(report);
        return report/100;
      },
    });

    this.registerCapability("measure_current", CLUSTER.ELECTRICAL_MEASUREMENT, {
      get: 'rmsCurrent',
      getOpts: {
        getOnStart: true,
        getOnOnline: true,
        pollInterval: 10000,
      },
      report: 'rmsCurrent',
    });
  }

  /**
   * onAdded is called when the user adds the device, called just after pairing.
   */
  async onAdded() {
    this.log('Power Analytics Plug has been added');
  }

  /**
   * onSettings is called when the user updates the device's settings.
   * @param {object} event the onSettings event data
   * @param {object} event.oldSettings The old settings object
   * @param {object} event.newSettings The new settings object
   * @param {string[]} event.changedKeys An array of keys changed since the previous version
   * @returns {Promise<string|void>} return a custom message that will be displayed
   */
  async onSettings({ oldSettings: {}, newSettings: {}, changedKeys: {} }): Promise<string|void> {
    this.log('Power Analytics Plug settings where changed');
  }

  /**
   * onRenamed is called when the user updates the device's name.
   * This method can be used this to synchronise the name to the device.
   * @param {string} name The new name
   */
  async onRenamed(name: string) {
    this.log('Power Analytics Plug was renamed');
  }

  /**
   * onDeleted is called when the user deleted the device.
   */
  async onDeleted() {
    this.log('Power Analytics Plug has been deleted');
  }

}

module.exports = PowerAnalyticsPlug;
