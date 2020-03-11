<template>
    <div>
      
      <button @click="setVolume(0)">Set volume 0</button>
    </div>
</template>

<script>
 export default {
   methods: {
     setVolume(nb) {
       this.$store.dispatch('sendOsc', {
         endpoint: '/performance/num',
         args: [
           {
             type: 'i',
             value: -1
           }
         ],
         prefix: false
       })
     }
   }
  }
</script>

<style>
</style>
