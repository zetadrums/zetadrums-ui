<template>
    <div class="volume">
      <div class="button" @click="show = !show"></div>
      <div class="popup" v-if="show">
        <v-slider height="150" :value="$store.state.volume" min="0" max="100" @input="setVolume"
          vertical></v-slider>
      </div>
    </div>
</template>

<script>
import { mapMutations } from 'vuex'
  export default {
    components: {},
    data() {
      return {
        volume: 75,
        show: false 
      }
    },
    computed: {
      label() {
        return `${this.$store.state.volume}%`;
      }
    },
    methods: {
      ...mapMutations({
        setVolume: 'setVolume'
      })
    }
  }
</script>

<style lang="scss">
.volume {
  position: relative;
  height: 100%;
  text-align: center;

  .button {
    background: url("data:image/svg+xml,%3Csvg width='500' height='500' xmlns='http://www.w3.org/2000/svg'%3E%3Cg%3E%3Ctitle%3Ebackground%3C/title%3E%3Crect fill='none' id='canvas_background' height='402' width='582' y='-1' x='-1'/%3E%3C/g%3E%3Cg%3E%3Ctitle%3ELayer 1%3C/title%3E%3Cpath id='svg_1' fill-rule='evenodd' fill='%23ffffff' d='m139.884,340.854l115.476,112.842c3.271,3.275 7.814,5.27 12.812,5.27c9.988,0 18.169,-8.081 18.169,-17.993l0,-381.948c0,-9.902 -8.181,-17.991 -18.169,-17.991c-5.093,0 -9.724,2.09 -12.998,5.452l-115.203,112.66l-71.681,0c-20.077,0 -36.34,16.264 -36.34,36.343l0,109.025c0,20.078 16.264,36.34 36.34,36.34l71.594,0zm248.669,-202.421c-8.723,8.629 -8.723,22.713 0,31.437c21.623,21.714 35.064,51.607 35.064,84.675c0,33.077 -13.529,62.96 -35.151,84.679c-8.731,8.723 -8.731,22.804 0,31.435c8.623,8.724 22.712,8.724 31.435,0c29.707,-29.712 48.15,-70.774 48.15,-116.113c0,-45.245 -18.26,-86.225 -47.876,-115.93l-0.188,-0.182c-8.718,-8.726 -22.711,-8.726 -31.434,-0.001zm-18.81,181.979c16.804,-16.892 27.166,-40.158 27.166,-65.868c0,-25.713 -10.362,-48.969 -27.166,-65.871c-8.72,-8.721 -22.804,-8.721 -31.435,0c-8.724,8.634 -8.724,22.713 0,31.437c8.723,8.815 14.168,20.988 14.168,34.434c0,13.449 -5.445,25.623 -14.168,34.435c-8.724,8.723 -8.724,22.715 0,31.434c8.631,8.635 22.715,8.722 31.435,-0.001z' clip-rule='evenodd'/%3E%3C/g%3E%3C/svg%3E") no-repeat center center;
    background-size: contain;
    display: inline-block;
    height: 36px;
    width: 36px;
    margin: 10px;
    position: relative;
    top: 2px;
  }

  .popup {
    position: absolute;
    display: flex;
    top: 60px;
    left: 50%;
    margin-left: -22px; 
    background: #272727;
    height: 190px;
    padding: 20px;
  }
}
</style>
