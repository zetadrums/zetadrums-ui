<template>
    <div>
      
      <button @click="setVolume(0)">Set volume 0</button>
      <button @click="setPerformance(-1)">setPerformance -1</button>
      <button @click="setPerformance(0)">setPerformance 0</button>
      <button @click="setPerformance(1)">setPerformance 1</button>
    </div>
</template>

<script>
import { Fxb } from 'fxbjs'
import { mapMutations } from 'vuex'

export default {
  methods: {
    setVolume(nb) {
      this.$store.dispatch('osc/send', {
        endpoint: '/performance/num',
        args: [
          {
            type: 'i',
            value: -1
          }
        ],
        prefix: false
      })
    },
    ...mapMutations({
      setPerformance: 'setPerformance'
    })
   }
  }
</script>

<style>
</style>
