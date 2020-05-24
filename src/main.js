import Vue from 'vue'
import App from './App.vue'
import './quasar'

Vue.config.productionTip = false

Vue.prototype.$pixel = {
  getStyle(position, size) {
    const x = position.x - 1
    const y = position.y - 1
    return {
      opacity: y < 0 ? 0 : 1,
      left: `${x * size}px`,
      top: `${y * size}px`
    }
  },
  getPositions(center, block) {
    return block.map(b => ({
      x: center.x + b.x,
      y: center.y + b.y,
    }))
  }
}

new Vue({
  render: h => h(App),
}).$mount('#app')
