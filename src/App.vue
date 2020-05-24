<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <game />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'LayoutDefault',

  components: {
    Game: () => import('./components/Game.vue')
  },

  data () {
    return {
      leftDrawerOpen: false
    }
  }
}
</script>

<style>
</style>
