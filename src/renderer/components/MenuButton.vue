<template>
    <div class="menu-button" @click="goto">
      <slot />
    </div>
</template>

<script>
 export default {
   props: {
     href: String
   },
   methods: {
     goto() {
       this.$nuxt.$router.replace({ path: this.href })
     }
   }
  }
</script>

<style lang="scss">
.menu-button {
  cursor: pointer;
  line-height: 44px;
  margin: 10px 0;
  padding: 0 40px;
  border-right: 1px solid rgba(255, 255, 255, 0.2);
}
</style>
