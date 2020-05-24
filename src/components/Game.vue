<template>
<div class="column">
  <div class="column items-center setting-container">
    <div class="text">
      {{`TIME: ${time}`}}
    </div>
    <div class="text">
      {{`SCORE: ${cleared}`}}
    </div>
    <div class="row items-center justify-center">
      <div 
        class="btn cursor-pointer"
        @click="start">
        START
      </div>
      <div 
        class="btn cursor-pointer"
        @click="end">
        END
      </div>
    </div>
  </div>
  <div class="column items-center justify-center">
    <div 
      :style="{width: `${container.x * size}px`, height: `${container.y * size}px`}"
      class="game-container">
      <block
        ref="block"
        :type="type"
        :positions="block.positions"
        :size="size"/>
      <base-block 
        :base="base"
        :size="size"
      />
    </div>
  </div>
</div>
</template>

<script>
import ScoreDialog from './ScoreDialog.vue'
const width = 10;
const height = 20;
const outline = [];
const defaultCenter = {x: 4, y: 0}
const types = ['t','o','s','z','l','i']
function random(num) {
  return Math.floor(Math.random() * Math.floor(num))
}
for(let i = 1; i <= width; i += 1) {
  outline.push({x: i, y: height + 1})
}
for(let i = 1; i <= height; i += 1) {
  outline.push({x: 0, y: i})
  outline.push({x: 11, y: i})
}
function clone(object) {
  return JSON.parse(JSON.stringify(object))
}
export default {
  components: {
    Block: () => import('./block/Index.vue'),
    BaseBlock: () => import('./Base.vue'),
  },
  data() {
    return {
      timeInterval: null,
      time: 0,
      frequency: 500,
      cleared: 0,
      size: 32,
      typeIndex: null,
      block: {
        center: defaultCenter,
        positions: []
      },
      form: 0,
      container: {
        x: width,
        y: height
      },
      outline: outline,
      base: [],
    }
  },  
  mounted() {
    this.setKeydownListener(true)
  },
  beforeDestroy() {
    this.setKeydownListener(false)
  },
  computed: {
    type() {
      return types[this.typeIndex]
    }
  },
  methods: {
    setKeydownListener(ok) {
      if(ok) {
        window.addEventListener("keydown", this.keyPress);
      } else {
        window.removeEventListener("keydown", this.keyPress)
      }
    },
    keyPress(e) {
      switch(e.keyCode) {
        case 13:
          this.end()
          this.generateNewBlock()
          this.start()
          break;
        case 37:  // left
          this.moveX(-1);
          break;
        case 39:  // right
          this.moveX(1);
          break;
        case 81:  // q
        case 38:  // up
          this.transform(1);
          break;
        case 87:  // w
        case 40:  // down
          this.moveY(1);
          break;
        default:
          break;
      }
    },
    start() {
      this.timeInterval = setInterval(() => {
        this.time += 1
      }, 1000)
      this.gameInterval = setInterval(() => {
        this.moveY(1)
      }, this.frequency)
    },
    end() {
      this.base = []
      this.generateNewBlock(false)
      this.time = 0
      this.cleared = 0
      clearInterval(this.timeInterval)
      clearInterval(this.gameInterval)
    },
    transform(num) {
      let form = this.form + num;
      if(form === 4) {
        form = 0;
      } else if(form === -1) {
        form = 3;
      }
      const positions = this.$refs.block.next(this.block.center, form)
      const result = this.check(positions)
      if(result) {
        this.form = form
        this.block.positions = positions
      }
    },
    moveX(x) {
      const center = clone(this.block.center)
      center.x += x
      const positions = this.$refs.block.next(center, this.form)
      const result = this.check(positions)
      if(result) {
        this.block.center = center
        this.block.positions = positions
      }
    },
    generateNewBlock(generate = true) {
      if(generate) {
        this.form = 0
        this.typeIndex = random(types.length);
        this.$nextTick(() => {
          this.block.center = defaultCenter
          this.block.positions = this.$refs.block.next(this.block.center, this.form)
        })
      } else {
        this.block = {
          center: defaultCenter,
          positions: []
        }
      }
    },
    async moveY(y) {
      const center = clone(this.block.center)
      center.y += y
      const positions = this.$refs.block.next(center, this.form)
      const result = this.check(positions)
      if(result) {
        this.block.center = center
        this.block.positions = positions
      } else {
        this.place(this.block.positions)
      }
    },
    check(positions) {
      const base = this.outline.concat(this.base)
      for(let i = 0; i < base.length; i += 1) {
        for(let j = 0; j < positions.length; j += 1) {
          if(base[i].x === positions[j].x && base[i].y === positions[j].y) {
            return false
          }
        }
      }
      return true
    },
    async place(positions) {
      this.base = this.base.concat(positions)
        const result = await this.clear()
        if(result) {
          this.generateNewBlock()
        } else {
          this.setKeydownListener(false)
          const score = this.cleared
          const time = this.time
          this.$q.dialog({
            component: ScoreDialog,
            score,
            time
          }).onOk(() => {
            this.generateNewBlock()
            this.start()
          }).onDismiss(() => {
            this.setKeydownListener(true)
          })
          this.end()
        }
    },
    async clear() {
      return new Promise((resolve) => {
        const rows = []
        this.base.forEach((pixel, i) => {
          if(pixel.y === 1) {
            resolve(false)
          }
          if(!rows[pixel.y]) {
            rows[pixel.y] = []
          }
          rows[pixel.y].push(i)
        })
        rows.forEach((cols, y) => {
          if(cols.length === width) {
            this.base = this.base.reduce((base, pixel) => {
              const result = pixel
              if(pixel.y < y) {
                result.y += 1 
                base.push(result)
              } else if(pixel.y > y) {
                base.push(result)
              }
              return base
            }, [])
            this.cleared += 1
          }
        })
        resolve(true)
      }) 
    }
  }
}
</script>

<style lang="scss">
$pixel-size: 32px;
.game-container {
  background: black;
  position: relative;
  .pixel {
    height: $pixel-size;
    width: $pixel-size;
    background: white;
    border-style: solid;
    border-color: black;
    border-width: 1px;
    position: absolute;
  }
}
.setting-container {
  padding: 40px 0px;
  .text {
    margin: 5px;
  }
  .btn {
    border-style: solid;
    border-width: 2px;
    border-radius: 5px;
    border-color: black;
    padding: 5px 20px;
    width: 150px;
    text-align: center;
    margin: 5px;
  } 
}
</style>