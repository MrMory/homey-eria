import {ZigBeeDevice} from 'homey-zigbeedriver';
import {debug, CLUSTER} from 'zigbee-clusters';

class PowerAnalyticsPlug extends ZigBeeDevice {

    async onNodeInit({zclNode}: any) {

        // enable debugging
        this.enableDebug();

        // Enables debug logging in zigbee-clusters
        debug(true);

        // print the node's info to the console
        this.printNode();

        if (this.hasCapability('onoff')) {
            this.registerCapability('onoff', CLUSTER.ON_OFF, {
                getOpts: {
                    // If the power plug is controlled by homey the state will be switch directly
                    // If power plug is toggled on the plug itself often this value can be changed to fit the users needs in the settings
                    pollInterval: this.getSetting('report_interval_OnOff') * 1000 || 60000,
                },
            });
        }

        if (this.hasCapability('meter_power')) {
            this.registerCapability('meter_power', CLUSTER.METERING, {
                get: 'currentSummationDelivered',
                getOpts: {
                    getOnStart: true,
                    getOnOnline: true,
                    // In homey the values are registered as kWh.
                    // This means that a fetch of the data every hour should be enough.
                    pollInterval: 3600000,
                },
                reportOpts: {
                    configureAttributeReporting: {
                        minInterval: 120, // No minimum reporting interval
                        maxInterval: 300, // Maximally every ~16 hours
                        minChange: 0.01, // Report when value changed by 0.01
                    },
                }, report: 'currentSummationDelivered',
                reportParser(report: number) {
                    console.log(`reported meter power: ${report}`)
                    return report / 1000
                },
                endpoint: this.getClusterEndpoint(CLUSTER.METERING),
            });
        }

        if (this.hasCapability('measure_power')) {
            this.registerCapability('measure_power', CLUSTER.ELECTRICAL_MEASUREMENT, {
                get: 'activePower',
                getOpts: {
                    getOnStart: true,
                    getOnOnline: true,
                    // If you are not actively triggering based on power change it's not needed to fetch data every second.
                    // This can be changed in settings to fit the users needs
                    pollInterval: this.getSetting('report_interval_measure') * 1000 || 60000,
                },
                reportOpts: {
                    configureAttributeReporting: {
                        minInterval: 0, // No minimum reporting interval
                        maxInterval: 300, // Maximally every ~16 hours
                        minChange: 1, // Report when value changed by 1
                    },
                },
                report: 'activePower',
                reportParser(report: number) {
                    console.log(`reported active power: ${report}`)
                    if(report < 0) return 0;
                    return report / 10
                },
                endpoint: this.getClusterEndpoint(CLUSTER.ELECTRICAL_MEASUREMENT),
            });
        }

        if (this.hasCapability('measure_voltage')) {
            this.registerCapability("measure_voltage", CLUSTER.ELECTRICAL_MEASUREMENT, {
                get: 'rmsVoltage',
                getOpts: {
                    getOnStart: true,
                    getOnOnline: true,
                    // Voltage almost never changes so every min should be enough
                    pollInterval: 60000,
                },
                report: 'rmsVoltage',
                reportParser(report: any) {
                    console.log(`reported voltage: ${report}`)
                    return report / 100;
                },
            });
        }

        this.registerCapability("measure_current", CLUSTER.ELECTRICAL_MEASUREMENT, {
            get: 'rmsCurrent',
            getOpts: {
                getOnStart: true,
                getOnOnline: true,
                pollInterval: 60000,
            },
            report: 'rmsCurrent',
            reportParser(report: any) {
                console.log(`reported voltage: ${report}`)
                return report / 10;
            },
        });
    }

    async OnSettings({ oldSettings, newSettings, changedKeys }: any) {
        try{
            console.log(newSettings);
            if (changedKeys.includes('report_interval_OnOff')) {

            }

            if (changedKeys.includes('report_interval_measure')) {

            }

            }catch (err) {
            // reset settings values on failed update
            throw new Error(`failed to update settings. Message:${err}`);
        }
    }
}

module.exports = PowerAnalyticsPlug;
