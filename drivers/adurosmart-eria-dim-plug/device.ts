import Homey from 'homey';
import { ZigBeeDevice } from 'homey-zigbeedriver';
import { debug, CLUSTER } from 'zigbee-clusters';

// debug(true);

class DimPlug extends ZigBeeDevice {

  async onNodeInit({ zclNode }: any) {
    this.registerCapability("onoff", CLUSTER.ON_OFF, {
      endpoint: 1
    });

    this.registerCapability("dim", CLUSTER.LEVEL_CONTROL, {
      endpoint: 1
    });
  }

  /**
   * onAdded is called when the user adds the device, called just after pairing.
   */
  async onAdded() {
    this.log('Dim Plug has been added');
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
    this.log('Dim Plug settings where changed');
  }

  /**
   * onRenamed is called when the user updates the device's name.
   * This method can be used this to synchronise the name to the device.
   * @param {string} name The new name
   */
  async onRenamed(name: string) {
    this.log('Dim Plug was renamed');
  }

  /**
   * onDeleted is called when the user deleted the device.
   */
  async onDeleted() {
    this.log('Dim Plug has been deleted');
  }

}

module.exports = DimPlug;
