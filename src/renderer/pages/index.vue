<template>
    <div>
      
      <button @click="setVolume(0)">Set volume 0</button>
      <button @click="setKick('Kick Snr 22 SQB')">Kick Snr 22 SQB</button>
      <button @click="setKick('Kick Lwg 26 LCY')">Kick Lwg 26 LCY</button>
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
    setKick(value) {
      this.setPerformance(0)
      this.setParameters({
        SAMPLER_loadedInstrument_idx_0instrument_name: value,
        SAMPLER_instrument_idx_0instrument_name: value
      })
      this.setPerformance(-1)
    },
    ...mapMutations({
      setPerformance: 'setPerformance',
      setParameters: 'fxb/setParameters'
    })
   }
  }
</script>

<style>
</style>
