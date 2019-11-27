"use strict";
const xap_framework_1 = require("xap-framework");
module.exports = function (RED) {
    RED.nodes.registerType('xap-out', function (props) {
        RED.nodes.createNode(this, props);
        // get a reference to the xap-device configuration node using its ID
        const device = RED.nodes.getNode(props.device);
        if (device) {
            device.register(this.id);
        }
        this.on('input', (msg) => {
            let p = msg.payload;
            let msgClass = '';
            let target = '';
            let subdevice = undefined;
            let subdeviceID = undefined;
            let blockname = '';
            let blockcontent = {};
            // find payload items that contain the possible header options
            // any other item will be taken to be the block
            Object.keys(p).forEach(k => {
                if (k == 'class') {
                    msgClass = p[k];
                }
                else if (k == 'target') {
                    target = p[k];
                }
                else if (k == 'subdevice') {
                    subdevice = p[k];
                }
                else if (k == 'subdeviceID') {
                    subdeviceID = p[k];
                }
                else {
                    blockname = k;
                    blockcontent = p[k];
                }
            });
            if (msgClass != '' && blockname != '') {
                device.xap_send_block(msgClass, new xap_framework_1.xAP.block(blockname, blockcontent), target, subdevice, subdeviceID);
            }
        });
    });
};
//# sourceMappingURL=xap-out.js.map