<template>
    <div>
      
      <button @click="setVolume(0)">Set volume 0</button>
      <button @click="analyze">Analyze</button>
    </div>
</template>

<script>
import { Fxb } from 'fxbjs'

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
    analyze() {
      const base = Fxb.loadFile(__dirname + '/../assets/ssd5.5.fxb')
      const data = base.get('data')
      const size = data.readInt32LE(4);
      const content = data.slice(8, size + 8)
      console.log(content.toString());
    }
   }
  }
</script>

<style>
</style>
