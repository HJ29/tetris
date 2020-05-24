import Vue from 'vue'
import App from './App.vue'
import './quasar'

Vue.config.productionTip = false

Vue.prototype.$pixel = {
  getStyle(position, size) {
    return {
      left: `${(position.x - 1) * size}px`,
      top: `${(position.y - 1) * size}px`
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
