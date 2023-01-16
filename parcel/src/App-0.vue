
<template>
      <v-layout>
        <v-navigation-drawer v-model="drawer" temporary location="right">
        </v-navigation-drawer>
        <v-app-bar density="compact" >
          <template v-slot:prepend>
            <v-list-item nav prepend-avatar="/../logo.png"></v-list-item>
            <v-app-bar-title>Kitchen  sink for DA's serial DAQ</v-app-bar-title>
          </template>
          <template v-slot:append>
            <v-btn icon  @click="toggleTheme"><v-icon>mdi-theme-light-dark</v-icon></v-btn>
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"><i class="fa-solid fa-microchip"></i></v-app-bar-nav-icon>
          </template>
        </v-app-bar>
        <v-main>
          <v-card height="100%"></v-card>
        </v-main>
      </v-layout>
</template>

<script>
import 'vuetify/dist/vuetify.css';

export default {
  data: () => ({
    info: "null",
    drawer: null,
  }),
  mounted() {
    console.log(this.$el.querySelectorAll('a'));
  }
};
</script>