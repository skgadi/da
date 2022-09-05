const {
  createApp
} = Vue;


const fullList = {
  serial: {
    name: 'Serial',
    description: 'Serial port communication',
    commands: {
      list: {
        name: 'List',
        description: 'List all available serial ports',
        parameters: [],
      }, open: {
        name: 'Open',
        description: 'Open a serial port',
        parameters: [{
          key : 'port',
          name: 'Port',
          description: 'The name of the port to open',
          type: 'text',
        }, {
          key : 'baud',
          name: 'Baudrate',
          description: 'The baudrate to use',
          type: 'number',
        }],
      }, close: {
        name: 'Close',
        description: 'Close a serial port',
        parameters: [{
          key : 'port',
          name: 'Port',
          description: 'The name of the port to close',
          type: 'text',
        }],
      }, read: {
        name: 'Read',
        description: 'Read data from a serial port',
        parameters: [{
          key : 'port',
          name: 'Port',
          description: 'The name of the port to open',
          type: 'text',
        }],
      }, write: {
        name: 'Write',
        description: 'Write data to a serial port',
        parameters: [{
          key : 'port',
          name: 'Port',
          description: 'The name of the port to open',
          type: 'text',
        }, {
          key : 'data',
          name: 'Data',
          description: 'The data to write',
          type: 'text',
        }],
      }, sRCbor: {
        name: 'sRCbor',
        description: 'Send receive data from a serial port in binary format',
        parameters: [{
          key : 'port',
          name: 'Port',
          description: 'The name of the port to open',
          type: 'text',
        }, {
          key : 'data',
          name: 'Data',
          description: 'The data to write',
          type: 'text',
          encode: 'json'
        }],
      }, sR: {
        name: 'sR',
        description: 'Send receive data from a serial port in ASCII format',
        parameters: [{
          key : 'port',
          name: 'Port',
          description: 'The name of the port to open',
          type: 'text',
        }, {
          key : 'data',
          name: 'Data',
          description: 'The data to write',
          type: 'text',
          encode: 'json'
        }],
      },
    },
  },
  visa: {
    name: 'VISA',
    description: 'VISA (Virtual Instrument Software Architecture) communication',
    commands: {
      list: {
        name: 'List',
        description: 'List all available visa ports',
        parameters: [],
      }, open: {
        name: 'Open',
        description: 'Open a visa port',
        parameters: [{
          key : 'resource',
          name: 'Resource',
          description: 'The name of the port to open',
          type: 'text',
        }],
      }, close: {
        name: 'Close',
        description: 'Close a visa port',
        parameters: [{
          key : 'resource',
          name: 'Resource',
          description: 'The name of the port to close',
          type: 'text',
        }],
      }, read: {
        name: 'Read',
        description: 'Read data from a visa port',
        parameters: [{
          key : 'resource',
          name: 'Resource',
          description: 'The name of the port to open',
          type: 'text',
        }],
      }, write: {
        name: 'Write',
        description: 'Write data to a visa port',
        parameters: [{
          key : 'resource',
          name: 'Resource',
          description: 'The name of the port to open',
          type: 'text',
        }, {
          key : 'data',
          name: 'Data',
          description: 'The data to write',
          type: 'text',
        }],
      }, query: {
        name: 'Query',
        description: 'Query a visa port',
        parameters: [{
          key : 'resource',
          name: 'Resource',
          description: 'The name of the port to open',
          type: 'text',
        }, {
          key : 'data',
          name: 'Data',
          description: 'The data to write',
          type: 'text',
        }],
      },
    },
  },
}




