<template>
  <div>
    <o-block 
      ref="o"
      :positions="positions"
      :size="size"
      v-show="type === 'o'"/>
    <s-block 
      ref="s"
      :positions="positions"
      :size="size"
      v-show="type === 's'"/>
    <z-block  
      ref="z"
      :positions="positions"
      :size="size"
      v-show="type === 'z'"/>
    <t-block  
      ref="t"
      :positions="positions"
      :size="size"
      v-show="type === 't'"/>
    <l-block  
      ref="l"
      :positions="positions"
      :size="size"
      v-show="type === 'l'"/>
    <i-block  
      ref="i"
      :positions="positions"
      :size="size"
      v-show="type === 'i'"/>
  </div>
</template>

<script>
export default {
  components: {
    OBlock: () => import('./O.vue'),
    SBlock: () => import('./S.vue'),
    ZBlock: () => import('./Z.vue'),
    TBlock: () => import('./T.vue'),
    LBlock: () => import('./L.vue'),
    IBlock: () => import('./I.vue'),
  },
  props: {
    type: {
      default: 't',
      type: String
    },
    positions: {
      default: () => [],
      type: Array
    },
    size: {
      default: 30,
      type: Number
    },
  },
  methods: {
    next(center, form) {
      return this.$refs[this.type].next(center, form)
    }
  }
}
</script>