class fileVar {
  constructor () {
    this.pointKeys = [
      "t",
      "T",
      "TR",
      "S0",
      "S1",
      "S2",
      "S3",
      "V",
      "R"
    ];
    this.maxNumberOfRows = 100000; // 2 for the headding rows
    this.clearData();
  }

  clearData () {
    this.data = [[
      "Time",
      "Set Temperature",
      "Temperature",
      "Relay 1",
      "Relay 2",
      "Relay 3",
      "Relay 4",
      "Voltage",
      "Resistance"
    ], [
      "seconds",
      "Degree C",
      "Degree C",
      "",
      "",
      "",
      "",
      "Volts",
      "Ohms",
    ]];
  }

  addData(point) {

    let insertPoint = this.data.length;
    let pointArray = [];
    if (this.data[this.data.length-1][0]>=point.t) {
      for (let i=this.data.length-1; i>=0; i--) {
        if (this.data[i][0] == point.t) {
          insertPoint = i;
          pointArray = this.data[i];
          break;
        }
      }
    }
    for (let i=0; i<this.pointKeys.length; i++) {
      if (point.hasOwnProperty(this.pointKeys[i])) {
        pointArray[i] = point[this.pointKeys[i]];
      }
    }

    this.data[insertPoint] = pointArray;
    //console.log(this.data.length);
    if (this.data.length>=this.maxNumberOfRows) {
      this.saveAsCSV();
      this.clearData();
    }
  }

  saveAsCSV() {
    console.log(this.data);
    let preparedData = this.data;
    let date = new Date();
    let filename = "";
    filename += date.getFullYear();
    filename += date.getMonth();
    filename += date.getDay();
    filename += "_";
    filename += date.getHours();
    filename += date.getMinutes();
    filename += date.getSeconds();
    filename += "_results";
    this.exportToCsv(filename, preparedData);
  }

  exportToCsv(filename, rows) {
    let processRow = function (row) {
        let finalVal = '';
        for (let j = 0; j < row.length; j++) {
            let innerValue = "";// = row[j] === null ? '' : row[j].toString();
            try {
              innerValue = row[j].toString();
            } catch (e) {
            }
            if (row[j] instanceof Date) {
                innerValue = row[j].toLocaleString();
            };
            let result = innerValue.replace(/"/g, '""');
            if (result.search(/("|,|\n)/g) >= 0)
                result = '"' + result + '"';
            if (j > 0)
                finalVal += ',';
            finalVal += result;
        }
        return finalVal + '\n';
    };
  
    let csvFile = '';
    for (let i = 0; i < rows.length; i++) {
        csvFile += processRow(rows[i]);
    }
  
    let blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, filename);
    } else {
        let link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            let url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
  }
};