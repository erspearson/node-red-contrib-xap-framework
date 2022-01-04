# node-red-contrib-xap-framework

Send and receive xAP home automation messages with Node-RED and
[xap-framework](https://github.com/erspearson/xap-framework).

Requires
[xap-hub](https://github.com/erspearson/xap-hub)
to communicate with the LAN.

xap-hub is best installed globally and run as a service.

## Installation

Not yet published to the Node-RED repository so install locally. Typically,

``cd ~/.node-red``

``npm install node-red-contrib-xap-framework``

and restart Node-RED.

The xAP-In and xAP-Out nodes will appear in the network section of the node palette.

## Nodes

* xAP-Device config node
* xAP-In receives xAP messages from the LAN
* xAP-Out transmits messages to the LAN.

### xAP-Device (config node)

* Common connection point for In and Out nodes to communicate with the local network.
* Sets the source address for messages sent and sets the interval between heartbeat messages.

### xAP-In

* By default, with no filters set, receives all xAP messages
* Filters can be set for class, source and target message fields
* ``msg.payload`` contains the xAP message as a structured message object that can be inspected in a function node using all the methods and sub-objects defined by xap-framework.

```javascript
function lc(str) { return str.toLowerCase(); }

// Extract the header and first block
var hdr = msg.payload.header;
var blk = msg.payload.blocks[1];

// Check the header class and block name
if(hdr.class == 'xapbsc.event') {
  if(lc(blk.name) == 'output.state') {
      state = lc(blk.getValue('state'));
...
```

### xAP-Out

Parses a string containing a partial xAP message on its input, passes it to the connected xAP-Device config node which adds the source address and UID, and transmits to xap-hub for forwarding onto the LAN.

#### Example

A template node Mustache template for creating a BSC command message:

```json
{
  "class": "xAPBSC.Cmd",
  "target": "{{target}}",
  "output.state.1": {
    "ID": "*",
    "State": "{{state}}"
  }
}
```
