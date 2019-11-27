"use strict";
module.exports = function (RED) {
    RED.nodes.registerType('xap-in', function (props) {
        RED.nodes.createNode(this, props);
        // get a reference to the xap-device configuration node using its ID
        const device = RED.nodes.getNode(props.device);
        const filterClass = props.filterClass.toLowerCase();
        const filterSource = props.filterSource.toLowerCase();
        const filterTarget = props.filterTarget.toLowerCase();
        if (device) {
            device.register(this.id);
            // Subscribe to receive xAP messages via the device node
            device.subscribe(this, (message) => {
                let passFilters = true;
                if (passFilters && filterClass && message.class.toLowerCase().indexOf(filterClass) != 0) {
                    passFilters = false;
                }
                if (passFilters && filterSource && message.source.toLowerCase().indexOf(filterSource) != 0) {
                    passFilters = false;
                }
                if (passFilters && filterTarget && !message.header.target) {
                    passFilters = false;
                }
                if (passFilters && filterTarget && message.header.target && message.header.target.toLowerCase().indexOf(filterClass) != 0) {
                    passFilters = false;
                }
                if (passFilters) {
                    let msg = { payload: message };
                    this.send(msg);
                }
            });
        }
    });
};
