import os = require('os')
import { Red } from 'node-red'
import { xAP_InNode, xAP_InNodeProperties, xAP_DeviceNode,  } from './xap-node-types'


export = function (RED: Red) {

  RED.nodes.registerType('xap-in', function(this: xAP_InNode, props: xAP_InNodeProperties) {

    RED.nodes.createNode(this, props);
    
    // get a reference to the xap-device configuration node using its ID
    const device = RED.nodes.getNode(props.device) as xAP_DeviceNode;

    const filterClass = props.filterClass.toLowerCase()
    const filterSource = props.filterSource.toLowerCase()
    const filterTarget = props.filterTarget.toLowerCase()
    
    if(device) {
      this.status({fill:"yellow", shape:"dot", text:"awaiting hub connection"})
      device.register(this.id)
      
      // Subscribe to receive xAP messages via the device node
      device.subscribe(this, (message) => {
        
        let passFilters = true
        if(passFilters && filterClass  && message.class.toLowerCase().indexOf(filterClass) != 0) { passFilters = false }
        if(passFilters && filterSource && message.source.toLowerCase().indexOf(filterSource) != 0) { passFilters = false }
        if(passFilters && filterTarget && !message.header.target) { passFilters = false }
        if(passFilters && filterTarget && message.header.target && message.header.target.toLowerCase().indexOf(filterClass) != 0) { passFilters = false }
        
        if(passFilters) {
          let msg = { payload: message }
          this.send(msg)
        }
      })
    }
  })
}