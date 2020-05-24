<template>
  <div 
    id="app">
    <game />
  </div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'App',
  components: {
    Game: () => import('./components/Game.vue')
  },
})
</script>
