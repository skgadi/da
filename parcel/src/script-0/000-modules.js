

import { createApp } from 'vue'

import 'vuetify-styles'
import './style/style-0.css'

import { createVuetify, useTheme } from 'vuetify'
//import * as components from 'vuetify/lib/components'
//import * as directives from 'vuetify/lib/directives'

import '@mdi/font/css/materialdesignicons.min.css'
import "fa"


import chart from './chart/chart.vue'

console.log(chart);
const vuetify = createVuetify({
  theme: {
    defaultTheme: 'light'
  },
});


let vueApp = createApp({
  components: { chart },
  data() {
    return {
      logo: require('./logo.png'),
      drawer: null,
      theme: useTheme(),
      chartRef: chart,
    }
  },
  methods: {
    toggleTheme() {
      if (this.theme.global.current.dark) {
        this.theme.global.name = 'light';
      } else {
        this.theme.global.name = 'dark';
      }
      console.log();
    },
    addAPoint() {
      this.chartRef.addPoint();
    }
  }
});

vueApp.use(vuetify).mount('#app');



