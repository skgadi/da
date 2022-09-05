const {
  createApp
} = Vue;


const chartVar = {
  data: [],
  series: {},
  root: null,
  chart: null,
  createSeries: function (name, field) {
    let tempSeries = chartVar.chart.series.push( 
      am5xy.SmoothedXLineSeries.new(chartVar.root, { 
        name: name,
        xAxis: chartVar.xAxis, 
        yAxis: chartVar.yAxis, 
        valueYField: field, 
        valueXField: "t",
        tooltip: am5.Tooltip.new(chartVar.root, {}),
        legendLabelText: "{name}",
        legendRangeLabelText: "{name}"
      }) 
    );
    
    tempSeries.strokes.template.set("strokeWidth", 2);
    
    tempSeries.get("tooltip").label.set("text", "[bold]{name}[/]\n{valueX}: {valueY}")
    tempSeries.data.setAll(this.data);


    
    this.series[field] = tempSeries;
  },
  makeRoot: function () {
    this.root = am5.Root.new("chartdiv");
  },
  init: function() {
    this.root.setThemes([
      am5themes_Animated.new(this.root)
    ]);

    this.chart = this.root.container.children.push( 
      am5xy.XYChart.new(this.root, {
        panY: false,
        wheelY: "zoomX",
        layout: this.root.verticalLayout,
        maxTooltipDistance: 0
      }) 
    );

    // Create Y-axis
    this.yAxis = this.chart.yAxes.push(
      am5xy.ValueAxis.new(this.root, {
        extraTooltipPrecision: 1,
        renderer: am5xy.AxisRendererY.new(this.root, {})
      })
    );

    // Create X-Axis
    this.xAxis = this.chart.xAxes.push(
      am5xy.ValueAxis.new(this.root, {
        extraTooltipPrecision: 1,
        renderer: am5xy.AxisRendererX.new(this.root, {})
      })
    );

    this.createSeries("Relay 1", "S0");
    this.createSeries("Relay 2", "S1");
    this.createSeries("Relay 3", "S2");
    this.createSeries("Relay 4", "S3");
    this.createSeries("Temperature setpoint", "TR");
    this.createSeries("Temperature", "T");
    this.createSeries("Resistance", "R");

    // Add cursor
    this.chart.set("cursor", am5xy.XYCursor.new(this.root, {
      behavior: "zoomXY",
      xAxis: this.xAxis
    }));

    this.xAxis.set("tooltip", am5.Tooltip.new(this.root, {
      themeTags: ["axis"]
    }));

    this.yAxis.set("tooltip", am5.Tooltip.new(this.root, {
      themeTags: ["axis"]
    }));

    this.legend = this.chart.children.push(am5.Legend.new(this.root, {}));
    this.legend.data.setAll(this.chart.series.values);



  },
  addDataPoint: function (point) {
    let keys = Object.keys(point);
    for (let i=0; i<keys.length; i++) {
      if (keys[i] != "t") {
        let obj = {t: point.t};
        obj[keys[i]] = point[keys[i]];
        this.series[keys[i]].data.push(obj);
      }
    }
  },
  clear: function () {
    this.chart.dispose();
  },
  setVisibility: function(series, show) {
    if (show) {
      this.series[series].show();
    } else {
      this.series[series].hide();
    }
  }
};