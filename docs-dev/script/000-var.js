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
      },
      open: {
        name: 'Open',
        description: 'Open a serial port',
        parameters: [{
          name: 'Port',
          description: 'The name of the port to open',
          type: 'text',
        }, {
          name: 'Baudrate',
          description: 'The baudrate to use',
          type: 'number',
        }],
      },
      close: {
        name: 'Close',
        description: 'Close a serial port',
        parameters: [{
          name: 'Port',
          description: 'The name of the port to close',
          type: 'text',
        }],
      },
      read: {
        name: 'Read',
        description: 'Read data from a serial port',
        parameters: [{
          name: 'Port',
          description: 'The name of the port to open',
          type: 'text',
        }],
      },
      write: {
        name: 'Write',
        description: 'Write data to a serial port',
        parameters: [{
          name: 'Port',
          description: 'The name of the port to open',
          type: 'text',
        }, {
          name: 'Data',
          description: 'The data to write',
          type: 'text',
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
      },
      open: {
        name: 'Open',
        description: 'Open a visa port',
        parameters: [{
          name: 'Resource',
          description: 'The name of the port to open',
          type: 'text',
        }],
      },
      close: {
        name: 'Close',
        description: 'Close a visa port',
        parameters: [],
      },
      read: {
        name: 'Read',
        description: 'Read data from a visa port',
        parameters: [{
          name: 'Resource',
          description: 'The name of the port to open',
          type: 'text',
        }],
      },
      write: {
        name: 'Write',
        description: 'Write data to a visa port',
        parameters: [{
          name: 'Resource',
          description: 'The name of the port to open',
          type: 'text',
        }, {
          name: 'Data',
          description: 'The data to write',
          type: 'text',
        }],
      },
      query: {
        name: 'Query',
        description: 'Query a visa port',
        parameters: [{
          name: 'Resource',
          description: 'The name of the port to open',
          type: 'text',
        }, {
          name: 'Data',
          description: 'The data to write',
          type: 'text',
        }],
      },
    },
  },
}




