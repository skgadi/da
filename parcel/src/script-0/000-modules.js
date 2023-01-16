import { createApp } from 'vue'
import App from './App-0.vue'

// Vuetify
import 'vuetify/dist/vuetify.css'
//import 'vuetify/styles'
import { createVuetify } from 'vuetify'
//import * as components from 'vuetify/components'
//import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
});

createApp(App).use(vuetify).mount('#app');

