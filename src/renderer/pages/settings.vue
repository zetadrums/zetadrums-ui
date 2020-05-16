<template>
  <v-tabs
    v-model="tab"
    background-color="deep-blue accent-4"
    class="elevation-2"
    dark
    vertical
    style="height: calc(100vh - 88px)"
  >
    <v-tabs-slider></v-tabs-slider>

    <v-tab href="#import">
      Import kit
    </v-tab>

    <v-tab-item value="import">
      <div style="overflow: auto; height: calc(100vh - 88px); padding: 20px; border-left: 1px solid rgba(255, 255, 255, 0.5)">

        <v-text-field
          label="Kit name"
          outlined
          v-model="addKitData.name"
        ></v-text-field>

        <v-select
          :items="$store.state.categories"
          label="Category"
          outlined
          v-model="addKitData.category"
        ></v-select>

        <v-btn :disabled="addKitData.name.trim() === '' || !addKitData.category" color="primary" @click="addKit">
          Import current kit from DAW
        </v-btn>
      </div>
    </v-tab-item>
  </v-tabs>
</template>

<script>
import { Fxb } from 'fxbjs'
import { mapMutations } from 'vuex'

export default {
  data() {
    let tab = null

    return {
      tab,
      snackbar: false,
      addKitData: {
        name: '',
        category: ''
      }
    }
  },
  methods: {
    addKit() {
      this.$store.dispatch('fxb/importKitFromDAW', { ...this.addKitData, currentPerformance: this.$store.state.currentPerformance })
      new Notification('ZetaDrums', {
        body: this.addKitData.name +' added !',
        silent: false
      })
      this.addKitData.name = ''
    },
    elementName(name) {
      return this.elementNames[name] || name
    },
    getKits(category) {
      let kits = []
      for (let id in this.$store.state.kits.kits) {
        const kit = this.$store.state.kits.kits[id]
        if (kit.category !== category) {
          continue;
        }

        kits.push({id, kit})
      }

      kits.sort((a, b) => a.kit.name - b.kit.name)
      return kits
    },
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
    }
   }
  }
</script>

<style lang="scss">
  .kit {
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    padding: 20px 30px;
    cursor: pointer;

    &.highlighted {
      background: rgba(255, 255, 255, 0.1)
    }

    &.selected {
      background: #003c80;
    }
  }

  .kitdef {
    font-size: 13px;
    
    td:first-child {
      color: rgba(255, 255, 255, 0.5);
      padding-right: 10px;
    }
  }
</style>
