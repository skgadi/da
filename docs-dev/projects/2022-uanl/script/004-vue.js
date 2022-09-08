let vueApp = createApp({
  data() {
    return {
      status: {
        process: {
          isRunning: false,
          hTimeInterval: null, //Handle for time interval
          t: 0,
          outTimeInt: 30,
          rRI: 1,
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
      relays: {
        cycleTime: 1,
        list: [{
          total: 1,
          list: [1]
        }, {
          total: 1,
          list: [1]
        }, {
          total: 1,
          list: [1]
        }, {
          total: 1,
          list: [1]
        }]
      },
      outputInterval: "30",
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
    "relays.list": {
      handler (newValue, oldValue) {
        this.computeRelayTotals();
        /*for (let i=0; i<relays.list.length; i++) {
          this.relays.cycleTime 
        }*/
        try {
          this.computeRelayTotals();
          let out = this.relays.list[0].total;
          for (let i = 1; i < this.relays.list.length; i++) {
            out = leastCommonMultiple(out, this.relays.list[i].total);
          }
          this.relays.cycleTime = out;
        } catch (e) {
          console.log("Error in relayTime");
          console.log(e);
          this.relays.cycleTime = -1;
        }
      },
      deep: true
    }

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
    /*relayTime: function () {
      try {
        this.computeRelayTotals();
        let out = this.relays.list[0].total;
        for (let i = 1; i < this.relays.list.length; i++) {
          out = leastCommonMultiple(out, this.relays.list[i].total);
        }
        return out;
      } catch (e) {
        console.log("Error in relayTime");
        console.log(e);
        return -1;
      }
    },*/
    samplingTimeInSec: function () {
      let defaultValueOut = 30;
      let minSamplingTime = 1;
      try {
        let gcd = this.relays.list[0].list[0];
        //console.log(gcd);
        for (let i = 0; i < this.relays.list.length; i++) {
          for (let j = 0; j < this.relays.list[i].list.length; j++) {
            gcd = greatestCommonDivisor(gcd, this.relays.list[i].list[j]);
          }
        }
        let out = math.evaluate(this.outputInterval);
        return [out, gcd]
      } catch (e) {
        console.log("Error in interpreting sampling time");
        console.log(e);
        return [defaultValueOut, minSamplingTime];
      }
    }
  },
  methods: {
    computeRelayTotals: function () {
      for (let i=0; i<this.relays.list.length; i++) {
        this.relays.list[i].total = this.relays.list[i].list.reduce((a,b)=>a+b)
      }
    },
    addRelayTime: function (idx) {
      if (!this.status.process.isRunning) {
        this.relays.list[idx].list.push(1);
      }
    },
    removeRelayTime: function (idx) {
      if (!this.status.process.isRunning) {
        if (this.relays.list[idx].list.length > 1) {
          this.relays.list[idx].list.pop();
        }
      }
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
        //console.log(jsonData);

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

      this.status.process.t = this.status.process.t + 1;

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
          R: null,
          T: null,
          S0: null,
          S1: null,
          S2: null,
          S3: null,
        },
        W: {
          R: this.setValues.temperature
        }
      };
      
      
      // set and get relay positions
      for (let i=0; i<this.relays.list.length; i++) {
        cmd.data.R['S'+i] = null;
        let cumVal = 0;
        let relativeTime = math.mod(this.status.process.t,this.relays.list[i].total);
        for (let j=0; j<this.relays.list[i].list.length; j++) {
          cumVal += this.relays.list[i].list[j];
          if (relativeTime<cumVal) {
            cmd.data.W['S'+i] = !isEven(j);
            break;
          }
        }
      }
      console.log(cmd);
      
      this.sendDataToWSocket(cmd);





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
        this.status.process.rRI = this.samplingTimeInSec[1];
        if (greatestCommonDivisor(1,this.status.process.rRI) != 1) {
          alert("Relay times are not correct, please adjust them to match 1s sampling time.");
          return;
        }
        this.status.process.outTimeInt = this.samplingTimeInSec[0];
        if (greatestCommonDivisor(1,this.status.process.outTimeInt) != 1) {
          alert("Selected output interval is incompatible with the 1s sampling time. Please adjust.");
          return;
        }
        //TODO
        //Get confirmation
        if (confirm("Warning: you are about to start the process.\n\nIt will remove all the previous data.\n\n\nAre you sure?")) {
          this.status.process.isRunning = true;
          chartVar.clear();
          chartVar.init();
          this.status.process.t = -1;
          this.status.process.hTimeInterval = setInterval(() => {
            vueApp.requestData();
          }, (1000));
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