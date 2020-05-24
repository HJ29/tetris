<template>
  <div>
    <div 
      v-for="(position, i) in base"
      :key="i"
      :style="$pixel.getStyle(position, size)"
      class="pixel"/>
  </div>
</template>

<script>
export default {
  props: {
    base: {
      default: () => [],
      type: Array
    },
    size: {
      default: 30,
      type: Number
    },
  }
}
</script>