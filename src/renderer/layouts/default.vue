<template>
  <v-app id="inspire">
    <v-app-bar
      app
    >
    <v-row class="align-stretch">
      <v-col cols="1" class="text-center font-weight-black display-1">ζ</v-col>
      <v-col cols="10" style="padding: 0"><Menu></Menu></v-col>
      <v-col cols="1" style="padding: 0"><Volume></Volume></v-col>
    </v-row>
    </v-app-bar>

    <v-content>
      <nuxt />
    </v-content>

    <v-footer app>
      <div class="font-weight-thin caption flex-grow-1">zetadrums.io</div>
      <div class="font-weight-thin caption">
        <div v-if="$store.state.loggedInToHost === null">
          Connection to the VST host ...
          <div class="status-button" style="background:#FFC107"></div>
        </div>
        <div v-if="$store.state.loggedInToHost === true">
          Connected to VST host
          <div class="status-button" style="background:#4CAF50"></div>
        </div>
        <div v-if="$store.state.loggedInToHost === false">
          Can't connect to VST host
          <div class="status-button" style="background:#D32F2F"></div>
        </div>
      </div>
    </v-footer>
  </v-app>
</template>

<script>
import Menu from '../components/Menu'
import Volume from '../components/Volume'
export default {
  components: {Menu, Volume},
  created () {
    this.$vuetify.theme.dark = true
    this.$store.dispatch('connectToHost');
    this.$store.dispatch('fxb/loadBase');
    this.$store.dispatch('kits/load', this.$store.state.currentKit);
  }
}
</script>

<style>
html, body {
  overflow: hidden !important;
}
body {
  margin: 0 !important;
}
.status-button {
  height: 12px;
  width: 12px;
  border-radius: 50%;
  vertical-align: middle;
  display: inline-block;
  margin-left: 10px;
}
::-webkit-scrollbar {
    width: 8px;
}
 
::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 0;
}
 
::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.1); 
}
</style>
