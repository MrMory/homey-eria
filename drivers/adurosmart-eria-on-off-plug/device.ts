import { ZigBeeDevice } from 'homey-zigbeedriver';
import { debug, CLUSTER } from 'zigbee-clusters';

class OnOffPlug extends ZigBeeDevice {

  async onNodeInit({ zclNode }: any) {

    // enable debugging
    //this.enableDebug();

    // Enables debug logging in zigbee-clusters
    //debug(true);

    // print the node's info to the console
    //this.printNode();

    this.registerOnOffCapability(this.getSettings('report_interval_OnOff'));
  }
  async onSettings({oldSettings, newSettings, changedKeys}: any) {

    try {
      if (changedKeys.includes('report_interval_OnOff')) {
        this.registerOnOffCapability(newSettings.report_interval_OnOff);
      }
    } catch (err) {
      // reset settings values on failed update
      throw new Error(`failed to update settings. Message:${err}`);
    }
  }

  registerOnOffCapability(pollInterval: number = 60000) {
    if (this.hasCapability('onoff')) {
      this.registerCapability('onoff', CLUSTER.ON_OFF, {
        getOpts: {
          // If the power plug is controlled by homey the state will be switch directly
          // If power plug is toggled on the plug itself often this value can be changed to fit the users needs in the settings
          pollInterval: pollInterval * 1000 || 60000,
        },
      });
    }
  }
}

module.exports = OnOffPlug;
