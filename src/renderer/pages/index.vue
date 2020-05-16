<template>
  <v-tabs
    v-model="tab"
    background-color="deep-blue accent-4"
    class="elevation-2"
    dark
    vertical
    grow
    style="height: calc(100vh - 88px)"
    @change="highlightedKit = null"
  >
    <v-tabs-slider></v-tabs-slider>

    <v-tab
      v-for="(text, i) in $store.state.categories"
      :key="i"
      :href="`#tab-${i}`"
    >
      {{ text }}
    </v-tab>

    <v-tab-item
      v-for="(category, i) in $store.state.categories"
      :key="i"
      :value="'tab-' + i"
    >
      <div class="d-flex">
        <div style="overflow: auto; height: calc(100vh - 88px) ;border-left: 1px solid rgba(255, 255, 255, 0.5)" class="flex-grow-1">
          <div class="kit" v-for="(kit, i) in getKits(category)" :key="i" :class="{highlighted: highlightedKit === kit.id, selected: $store.state.currentKit === kit.id}" @click="highlightedKit = kit.id" @dblclick="$store.dispatch('kits/setCurrentKit', kit.id)">
            {{ kit.kit.name }}
          </div>
        </div>
        <div style="overflow: auto; height: calc(100vh - 88px); padding: 20px; border-left: 1px solid rgba(255, 255, 255, 0.5)" v-if="highlightedKit !== null">
          <table class="kitdef">
            <tr v-for="(d, idx) in getKitMap" :key="idx">
              <td>{{ d.name }}:</td>
              <td>
                {{ d.elementName }}
              </td>
            </tr>
          </table>
          <v-btn class="mt-6" tile block color="primary" @click="$store.dispatch('kits/setCurrentKit', highlightedKit)" v-if="highlightedKit !== $store.state.currentKit">
            Use this kit
          </v-btn>
        </div>
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
    if (this.$store.state.currentKit) {
      const category = this.$store.state.kits.kits[this.$store.state.currentKit].category
      tab = 'tab-' + this.$store.state.categories.findIndex(a => a === category)
    }

    return {
      tab,
      highlightedKit: null,
      kitmap: [
        'Kick',
        'Snare',
        'Tom 1',
        'Tom 2',
        'Tom 3',
        'Tom 4',
        'Hi-hat',
        'Ride',
        'Crash (L)',
        'Crash (R)',
        'Splash',
        'China',
        'Extra 1',
        'Extra 2',
        'Extra 3',
        'Extra 4',
        'Extra 5',
        'Extra 6',
        'Extra 7',
        'Extra 8',
        'Extra 9',
        'Extra 10',
        'Extra 11',
        'Extra 12',
        'Extra 13',
        'Extra 14',
        'Extra 15',
        'Extra 16',
        'Extra 17',
        'Extra 18',
        'Extra 19',
        'Extra 20'
      ],
      elementNames: {
      }
    }
  },
  computed: {
    getKitMap() {
      if (this.highlightedKit === null) {
        return []
      }

      let ret = []
      for (let i = 0; i < this.kitmap.length; i++) {
        if (this.$store.state.kits.kits[this.highlightedKit].data[`SAMPLER_loadedInstrument_idx_${i}instrument_name`] !== undefined) {
          ret.push({
            name: this.kitmap[i],
            elementName: this.elementName(this.$store.state.kits.kits[this.highlightedKit].data[`SAMPLER_loadedInstrument_idx_${i}instrument_name`])
          })
        }
      }
      
      return ret
    }
  },
  methods: {
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
    font-size: 12px;
    
    td:first-child {
      color: rgba(255, 255, 255, 0.5);
      padding-right: 10px;
    }
  }
</style>
