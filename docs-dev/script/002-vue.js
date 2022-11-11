let vueApp = createApp({
  data() {
    return {
      view: 0,
      protocol: 'serial',
      command: 'list',
      parameters: {},
      fullList: fullList,
      websocket: null,
      recCode: '',
      enableSend: false,
      codetoSend: {},
      prettySendCode: '',
    }
  },
  watch: {
    parameters: {
      handler(newValue, oldValue) {
          this.composeCode()
        },
      deep: true,
    },
    command() {
      this.composeCode()
    },
    protocol() {
      this.composeCode()
    }
  },
  mounted() {
    this.composeCode()
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
        let codeObj = JSON5.parse(code);
        this.recCode = syntaxHighlight(JSON.stringify(codeObj, null, 2));
      } catch (e) {
        this.recCode = "Error in received code: " + e;
      }
    },
    sendCode() {
      this.codetoSend.id = Date.now();
      if (this.enableSend) {
        console.log(JSON5.stringify(this.codetoSend));
        this.websocket.send(JSON.stringify(this.codetoSend));
        this.recCode = "Fecthing response...";
      }
    }, composeCode() {
      this.codetoSend = {
        type: this.protocol,
        command: this.command,
      };
      for (let i = 0; i < this.fullList[this.protocol].commands[this.command].parameters.length; i++) {
        key = this.fullList[this.protocol].commands[this.command].parameters[i].key;
        this.codetoSend[key] = this.parameters[key];
        if (this.fullList[this.protocol].commands[this.command].parameters[i].encode == "json"){
          try {
            console.log(this.codetoSend[key]);
            this.codetoSend[key] = JSON5.parse(this.codetoSend[key]);
          } catch (e) {
          }
        }
      }
      this.prettySendCode = syntaxHighlight(JSON.stringify(this.codetoSend, null, 2));
    }
  },
}).mount('#app')