import Homey from 'homey';
import { ZigBeeDevice } from 'homey-zigbeedriver';
import { debug, CLUSTER } from 'zigbee-clusters';

debug(true);

class ContactSensor extends ZigBeeDevice {

  async onNodeInit({ zclNode }: any) {
    this.registerCapability("alarm_contact", CLUSTER.IAS_ZONE, {
      get: 'zoneStatus',
      getOpts: {
        getOnStart: true,
        getOnOnline: true,
      },
      report: 'zoneStatus',
      reportParser(value: any) {
        this.log('ZoneStatus - Value: ', value);
        return (value.alarm2);
      },
      reportOpts: {
        configureAttributeReporting: {
          minInterval: 0,
          maxInterval: 1800,
          minChange: 1,
        }
      },
      endpoint: 1
    });

    this.registerCapability("alarm_tamper", CLUSTER.IAS_ZONE, {
      get: 'zoneStatus',
      getOpts: {
        getOnStart: true,
        getOnOnline: true,
      },
      report: 'zoneStatus',
      reportParser(value: any) {
        return (value.tamper);
      },
      reportOpts: {
        configureAttributeReporting: {
          minInterval: 0,
          maxInterval: 1800,
          minChange: 1,
        }
      },
      endpoint: 1
    });

    // this.registerCapability("alarm_battery", CLUSTER.POWER_CONFIGURATION, {
    //   get: 'batteryAlarmState',
    //   report: 'batteryAlarmState',
    //   getOpts: {
    //     getOnStart: true,
    //     getOnOnline: true,
    //     pollInterval: 10000,
    //   },
    //   endpoint: 1
    // });

    this.registerCapability("measure_battery", CLUSTER.POWER_CONFIGURATION, {
      get: 'batteryPercentageRemaining',
      report: 'batteryPercentageRemaining',
      getOpts: {
        getOnStart: true,
        getOnOnline: true,
        pollInterval: 10000,
      },
      endpoint: 1
    });

  }
  /**
   * onAdded is called when the user adds the device, called just after pairing.
   */
  async onAdded() {
    this.log('ContactSensor has been added');
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
    this.log('ContactSensor settings where changed');
  }

  /**
   * onRenamed is called when the user updates the device's name.
   * This method can be used this to synchronise the name to the device.
   * @param {string} name The new name
   */
  async onRenamed(name: string) {
    this.log('ContactSensor was renamed');
  }

  /**
   * onDeleted is called when the user deleted the device.
   */
  async onDeleted() {
    this.log('ContactSensor has been deleted');
  }

}

module.exports = ContactSensor;
