

import { createApp } from 'vue'

import 'vuetify-styles'
import { createVuetify, useTheme } from 'vuetify'
//import * as components from 'vuetify/lib/components'
//import * as directives from 'vuetify/lib/directives'

import '@mdi/font/css/materialdesignicons.min.css'
import "fa"




const vuetify = createVuetify({
  theme: {
    defaultTheme: 'light'
  },
});


let vueApp = createApp({
  data() {
    return {
      logo: require('./logo.png'),
      drawer: null,
      theme: useTheme(),
      chart: {
        historyPoints: 1000,
      },
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
  }
});

vueApp.use(vuetify).mount('#app');