let vueApp = createApp({
  data() {
    return {
      view: 0,
      protocol: 'serial',
      command: 'list',
      parameters: [],
      fullList: fullList,
      websocket: null,
      recCode: '',
      enableSend: false,
    }
  },
  computed: {
    codetoSend() {
      let sendCodeObj = {
        type: this.protocol,
        command: this.command,
      };
      if (this.protocol === 'serial') {
        if (this.fullList[this.protocol].commands[this.command].parameters.length > 0) {
          sendCodeObj.port = this.parameters[0];
        }
        if ( this.fullList[this.protocol].commands[this.command].parameters.length > 1) {
          if (this.command == 'open') {
            sendCodeObj.baud = this.parameters[1];
          } else if (this.command == 'write') {
            sendCodeObj.data = this.parameters[1];
          }
        }
      } else if (this.protocol === 'visa') {
        if (this.fullList[this.protocol].commands[this.command].parameters.length > 0) {
          sendCodeObj.resource = this.parameters[0];
        }
        if (this.fullList[this.protocol].commands[this.command].parameters.length > 1) {
          sendCodeObj.data = this.parameters[1];
        }
      }
      return sendCodeObj;
    },
    prettySendCode() {
      return syntaxHighlight(JSON.stringify(this.codetoSend, null, 2));
    }
  },
  methods: {
    connectIfNeeded() {
      if (!this.enableSend) {
        this.connectSocket();
      }
    },
    connectSocket() {
      this.websocket = new WebSocket('ws://localhost:8765');
      this.websocket.onopen = () => {
        this.enableSend = true;
      }
      this.websocket.onmessage = (event) => {
        //console.log(event.data);
        this.onReceiveCode(event.data);
      }
      this.websocket.onclose = () => {
        this.enableSend = false;
      }
    },
    onReceiveCode(code) {
      try {
        let codeObj = JSON.parse(code);
        this.recCode = syntaxHighlight(JSON.stringify(codeObj, null, 2));
      } catch (e) {
        this.recCode = "Error in received code: " + e;
      }
    },
    sendCode() {
      if (this.enableSend) {
        console.log(JSON.stringify(this.codetoSend));
        this.websocket.send(JSON.stringify(this.codetoSend));
        this.recCode = "Fecthing response...";
      }
    }
  },
}).mount('#app')