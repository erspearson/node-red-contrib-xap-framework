import os = require('os')
import { xAP } from 'xap-framework'
import { Red, NodeId} from 'node-red'
import { xAP_DeviceNode, xAP_DeviceNodeProperties } from './xap-node-types'

export = function (RED: Red) {

  RED.nodes.registerType("xap-device", function(this: xAP_DeviceNode, props: xAP_DeviceNodeProperties) {

    RED.nodes.createNode(this, props);

    this.vendor = props.vendor
    this.device = props.device
    this.instance = props.instance
    this.uid = xAP.generateUID13(`${props.vendor}.${props.device}.${props.instance}`)

    let network : xAP.networkConnection | null = null
    let connected : boolean = false

    this.xap_send = function(msg: xAP.message)
    {
      if(network) { network.send(msg.toString()) }
    }

    this.xap_send_block = function(msgClass: string, block: xAP.block, target?: string, subdeviceSource?: string, subdeviceID?: number) {
      if(network) { network.sendBlock(msgClass, block, target, subdeviceSource, subdeviceID) }
    }

    let clients: { [key: string]: NodeId } = {}

    this.register = function(client: NodeId) {
      clients[client] = client

      if(connected) {
        const clientNode = RED.nodes.getNode(client)
        if(clientNode) { clientNode.status({fill:'green',shape:'dot',text:'node-red:common.status.connected'}) }
      }

      if(!network) {

        // first client node registration causes the creation of a xAP network connection object
        network = new xAP.networkConnection({
          source: {
            vendor: this.vendor,
            device: this.device,
            instance: this.instance
          },
          hbInterval: props.hbInterval
        })

        network.on('connected', () => {
          this.log('xAP connected')
          connected = true

          for(const c of Object.keys(clients)) {
            const clientNode = RED.nodes.getNode(c)
            if(clientNode) { clientNode.status({fill:'green',shape:'dot',text:'node-red:common.status.connected'}) }
          }
        })
        
        network.on('connection-lost', () => {
          this.log('xAP lost connection to hub or network')
          connected = false
          
          for(const c of Object.keys(clients)) {
            const clientNode = RED.nodes.getNode(c)
            if(clientNode) { clientNode.status({fill:'red',shape:'dot',text:'lost connection'}) }
          }
        })
        
        this.log(`xAP connecting as ${this.vendor}.${this.device}`)
        network.connect()
      }
    }

    // List of callback functions to xap-in nodes wanting messages
    let subscribers: { [key: string]: ((msg: xAP.message) => void ) } = {}

    // xap-in nodes call subscribe to start receiving messages
    this.subscribe = function(xAP_InNode, callback) {
      subscribers[xAP_InNode.id] = callback

      // the first subscription causes a connection to the socket
      if(Object.keys(subscribers).length == 1) {
        if(network) {
          network.on('message', (message) => {
            for(const s of Object.keys(subscribers)) {
              subscribers[s](message)
            }
          })
        }
      }
    }

    this.on('close', done => {
      if(network) { network.disconnect() }
      done()
    })
  })
}
