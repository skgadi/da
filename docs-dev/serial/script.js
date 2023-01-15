const {
  createApp,  
} = Vue;

const { createVuetify, useTheme } = Vuetify

const vuetify = createVuetify({
  theme: {
    defaultTheme: 'light'
  }
});


let vueApp = createApp({
  data() {
    return {
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