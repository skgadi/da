let vueApp = createApp({
  data() {
    return {
      status: {
        process: {
          isRunning: false,
          hTimeInterval: null,
          t: 0,
          tS: 1,
        },
        comm: { //Communication tab
          text: "Communications",
          icon: "fa-fw fa-solid fa-angle-down",
          expand: true
        },
        da: {
          text: "[Not connected]",
          icon: "fa-fw fa-regular fa-circle-xmark"
        },
        serial: {
          text: "[Not connected]",
          icon: "fa-fw fa-regular fa-circle-xmark"
        },
        visa: {
          text: "[Not connected]",
          icon: "fa-fw fa-regular fa-circle-xmark"
        }
      },
      ports: {
        serial: {
          selcted: null,
          list: [],
          baud: 115200,
          tOut: 0.01
        },
        visa: {
          selcted: null,
          list: []
        }
      },
      wSocket: {
        readyState: 3
      },
      setValues: {
        voltage: 100,
        temperature: 100
      },
      relays: [
        [1],
        [1],
        [1],
        [1]
      ],
      samplingTime: "",
      chart: chartVar,
      fileData: [],
    }
  },
  watch: {
    "ports.serial.selected": function (newValue, oldValue) {
      //close old port 
      let command = {};
      command.type = "serial";
      command.command = "close";
      command.port = oldValue;
      this.sendDataToWSocket(command);
      this.status.serial = {
        text: "[Not connected]",
        icon: "fa-fw fa-regular fa-circle-xmark"
      };
      //open new port
      command = {};
      command.type = "serial";
      command.command = "open";
      command.port = newValue;
      command.baud = this.ports.serial.baud;
      command.tOut = this.ports.serial.tOut;
      this.sendDataToWSocket(command);
    },
    "ports.visa.selected": function (newValue, oldValue) {
      //close old port 
      let command = {};
      command.type = "visa";
      command.command = "close";
      command.resource = oldValue;
      this.sendDataToWSocket(command);
      this.status.visa = {
        text: "[Not connected]",
        icon: "fa-fw fa-regular fa-circle-xmark"
      };
      //open new port
      command = {};
      command.type = "visa";
      command.command = "open";
      command.resource = newValue;
      this.sendDataToWSocket(command);
    },

    /*samplingTime: function (newItem, oldItem) {
      try {
        let num = parseFloat(newItem);
        num = Math.round(num);
        if (num<0) {
          num = -num;
        }
        this.samplingTime = num;
      } catch(e) {
        log.console("Error in samplingTime");
        log.console(e);
      }
    }*/
  },
  computed: {
    relayTime: function () {
      try {
        let out = this.getRelayTime(0);
        for (let i = 1; i < this.relays.length; i++) {
          out = leastCommonMultiple(out, this.getRelayTime(i));
        }
        return out;
      } catch (e) {
        console.log("Error in relayTime");
        console.log(e);
        return -1;
      }
    },
    samplingTimeInSec: function () {
      let defaultValueOut = 30;
      let minSamplingTime = 1;
      try {
        let gcd = this.relays[0][0];
        for (let i = 0; i < this.relays.length; i++) {
          for (let j = 0; j < this.relays[i].length; j++) {
            gcd = greatestCommonDivisor(gcd, this.relays[i][j]);
          }
        }
        let out = math.evaluate(this.samplingTime);
        out = Math.abs(Math.round(out));
        if (isNaN(out)) {
          out = defaultValueOut;
        }
        if (isNaN(gcd) || gcd < minSamplingTime) {
          gcd = minSamplingTime;
        }
        return [out, gcd]
      } catch (e) {
        console.log("Error in interpreting sampling time");
        console.log(e);
        return [defaultValueOut, minSamplingTime];
      }
    }
  },
  methods: {
    removeRelayTime: function (idx) {
      if (this.relays[idx].length > 1) {
        this.relays[idx].pop();
      }
    },
    getRelayTime: function (idx) {
      let out = 0;
      for (let i = 0; i < this.relays[idx].length; i++) {
        out = out + this.relays[idx][i];
      }
      return out;
    },
    connectIfNeeded: function () {
      if (this.wSocket.readyState > 1) {
        this.wSocket = new WebSocket('ws://localhost:8765');
        this.wSocket.onmessage = (event) => {
          //console.log(event.data);
          //console.log(event);
          this.onReceiveCode(event.data);
        }
        this.wSocket.onopen = () => {
          //Update status
          this.status.da = {
            text: "[Connected]",
            icon: "fa-fw fa-solid fa-check"
          }
          //List ports
          this.requestPortsList();
        }
        this.wSocket.onclose = () => {
          this.status.da = {
            text: "[Not connected]",
            icon: "fa-fw fa-regular fa-circle-xmark"
          }
        }
      }
    },
    onReceiveCode: function (data) {
      //console.log(data);
      try {
        jsonData = JSON5.parse(data);
        console.log(jsonData);

        if (!jsonData.isError) {

          if (jsonData.type == "serial") {
            //Serial port List received
            if (jsonData.command == "list") {
              this.ports.serial.list = jsonData.response;
            }
            //Serial port opened
            if (jsonData.command == "open") {
              if (this.ports.serial.selected == jsonData.port) {
                this.status.serial = {
                  text: "[Connected]",
                  icon: "fa-fw fa-solid fa-check"
                };
              }
            }
            //when data received
            if (jsonData.command == "sRCbor") {
              if (!!jsonData.response.R) {
                chartVar.addDataPoint({
                  t: this.status.process.t,
                  T: jsonData.response.R.T,
                  TR: jsonData.response.R.R,
                  S0: (jsonData.response.R.S0 ? 1 : 0),
                  S1: (jsonData.response.R.S1 ? 1 : 0),
                  S2: (jsonData.response.R.S2 ? 1 : 0),
                  S3: (jsonData.response.R.S3 ? 1 : 0),
                });
              }
            }


          } else if (jsonData.type == "visa") {
            //Visa port List received
            if (jsonData.command == "list") {
              this.ports.visa.list = jsonData.response;
            }
            //Visa port opened
            if (jsonData.command == "open") {
              if (this.ports.visa.selected == jsonData.resource) {
                this.status.visa = {
                  text: "[Connected]",
                  icon: "fa-fw fa-solid fa-check"
                };
              }
            }

          }
        }

      } catch (e) {
        console.log("Error in interpretting.");
        console.log(e);
      }


    },
    requestPortsList: function () {
      command = {
        type: "serial",
        command: "list"
      };
      this.sendDataToWSocket(command);
      command = {
        type: "visa",
        command: "list"
      };
      this.sendDataToWSocket(command);
    },
    sendDataToWSocket: function (command) {
      try {
        if (this.wSocket.readyState == 1) {
          this.wSocket.send(JSON.stringify(command));
        }
      } catch (e) {
        console.log("Error sendin command to Websocket");
        console.log(e);
      }
    },
    requestData: function () {
      //set and request visa port data
      //TODO


      //set serial port values
      //TODO


      //Request serail port data
      let cmd = {};
      cmd.type = "serial";
      cmd.port = this.ports.serial.selected;
      cmd.baud = this.ports.serial.baud;
      cmd.tOut = this.ports.serial.tOut;
      cmd.command = "sRCbor";
      cmd.data = {
        R: {
          R: true,
          T: true,
          S0: true,
          S1: true,
          S2: true,
          S3: true,
        },
        W: {
          R: this.setValues.temperature
        }
      };
      this.sendDataToWSocket(cmd);



      this.status.process.t = this.status.process.t + this.status.process.tS;
    },
    startStop: function () {
      if (this.status.process.isRunning) {
        clearInterval(this.status.process.hTimeInterval);
        this.status.process.isRunning = false;
      } else {
        //Check websocket
        //TODO
        //Test all ports are open
        //TODO
        //check times are good
        //TODO
        //Get confirmation
        if (confirm("Warning: you are about to start the process.\n\nIt will remove all the previous data.\n\n\nAre you sure?")) {
          this.status.process.isRunning = true;
          chartVar.clear();
          chartVar.init();
          this.status.process.tS = this.samplingTimeInSec[1];
          this.status.process.t = -this.status.process.tS;
          this.status.process.hTimeInterval = setInterval(() => {
            vueApp.requestData();
          }, (this.status.process.tS * 1000));
        }
      }
    },
    graphDisplay: function (model) {
      chartVar.setVisibility("TR",false);
      chartVar.setVisibility("T",false);
      chartVar.setVisibility("R",false);
      chartVar.setVisibility("S0",false);
      chartVar.setVisibility("S1",false);
      chartVar.setVisibility("S2",false);
      chartVar.setVisibility("S3",false);
      switch (model) {
        case 0:
          chartVar.setVisibility("TR",true);
          chartVar.setVisibility("T",true);
              break;
        case 1:
          chartVar.setVisibility("T",true);
          chartVar.setVisibility("R",true);
          break;
        case 2:
          chartVar.setVisibility("R",true);
          chartVar.setVisibility("S0",true);
          chartVar.setVisibility("S1",true);
          chartVar.setVisibility("S2",true);
          chartVar.setVisibility("S3",true);
          break;
        case 3:
          chartVar.setVisibility("S0",true);
          chartVar.setVisibility("S1",true);
          chartVar.setVisibility("S2",true);
          chartVar.setVisibility("S3",true);
          break;
        default:
          break;
      }
    }
  },
  mounted: function () {
    chartVar.makeRoot();
    chartVar.init();
  }
}).mount("#app");