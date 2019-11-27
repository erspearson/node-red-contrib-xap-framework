import { xAP } from 'xap-framework'
import { Red, Node, NodeProperties, NodeId } from 'node-red';

export interface xAP_OutNodeProperties extends NodeProperties {
  device: NodeId
}

export interface xAP_OutNode extends Node {
  myDeviceNode: xAP_DeviceNode
}


export interface xAP_InNodeProperties extends NodeProperties {
  filterClass: string
  filterSource: string
  filterTarget: string
  device: NodeId
}

export interface xAP_InNode extends Node {
}

export interface xAP_DeviceNodeProperties extends NodeProperties {
  vendor: string
  device: string
  instance: string
  hbInterval: number
}

export interface xAP_DeviceNode extends Node {
  vendor: string
  device: string
  instance: string
  uid: string
  
  //hbInterval: number
  //network: xAP.networkConnection

  //subscriberCount: number
  //subscribers: ((msg: xAP.message) => void )[]

  register(nodeID: NodeId): void
  subscribe(node: xAP_InNode, fn: (message: xAP.message) => void)
  xap_send(msg: xAP.message)
  xap_send_block(msgClass: string, block: xAP.block, target?: string, subdeviceSource?: string, subdeviceID?: number)

}
