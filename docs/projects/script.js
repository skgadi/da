/*
function openUrl(url) {
  window.open(url, "_blank");
}*/



const {
  createApp
} = Vue;

const projects = [{
  title: "Synthesis of material in a gas chamber - 1",
  desc: "This app communicates with the custom hardware to control the gas chamber to prepare research material",
  img: "logo-uanl.svg",
  url: "/projects/2022-uanl/"
}, {
  title: "Synthesis of material in a gas chamber - 2",
  desc: "This app communicates with the custom hardware to control the gas chamber to prepare research material",
  img: "logo-uanl.svg",
  url: "/projects/2022-uanl/"
}];

let vueApp = createApp({
  data() {
    return {
      projects: projects
    }
  }, methods: {
    openUrl: function(url) {
      window.open(url, "_self");
    }
  }
}).mount("#app");


