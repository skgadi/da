class fileVar {
  constructor () {
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
    this.data.push(point);
  }

  saveAsCSV() {
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
            let innerValue = row[j] === null ? '' : row[j].toString();
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