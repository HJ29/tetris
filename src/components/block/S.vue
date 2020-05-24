<template>
  <div 
    v-if="positions.length > 0">
    <div 
      v-for="(position, i) in positions"
      :key="i"
      :style="$pixel.getStyle(position, size)"
      class="pixel"/>
  </div>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  props: {
    positions: {
      default: () => [],
      type: Array
    },
    size: {
      default: 30,
      type: Number
    },
  },
  data() {
    return {
      forms: [
        [
          {x: 0, y: 0},
          {x: -1, y: 0},
          {x: 0, y: -1},
          {x: 1, y: -1},
        ],
        [
          {x: 1, y: 0},
          {x: 1, y: -1},
          {x: 0, y: -1},
          {x: 0, y: -2},
        ],
        [
          {x: 0, y: 0},
          {x: -1, y: 0},
          {x: 0, y: -1},
          {x: 1, y: -1},
        ],
        [
          {x: 1, y: 0},
          {x: 1, y: -1},
          {x: 0, y: -1},
          {x: 0, y: -2},
        ],
      ],
    }
  },
  methods: {
    next(center, form) {
      return this.$pixel.getPositions(center, this.forms[form])
    }
  }
})
</script>
