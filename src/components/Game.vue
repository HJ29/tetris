<template>
<div>
  {{time}}
  {{cleared}}
  <button @click="start">start</button>
  <button @click="end">stop</button>
  <div 
    :style="{width: `${container.x * size}px`, height: `${container.y * size}px`}"
    class="container">
    <block
      ref="block"
      :type="type"
      :positions="block.positions"
      :size="size"/>
    <base-block 
      :base="base"
      :outline="outline"
    />
  </div>
</div>
</template>

<script>
const width = 10;
const height = 20;
const outline = [];
const defaultCenter = {x: 4, y: 2}
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
      timer: null,
      time: 0,
      cleared: 0,
      size: 30,
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
    window.addEventListener("keydown", e => {
      if(this.time > 0) {
        this.keyPress(e.keyCode)
      }
    });
  },
  beforeDestroy() {
    this.end()
  },
  computed: {
    type() {
      return types[this.typeIndex]
    }
  },
  methods: {
    start() {
      this.end()
      this.timer = setInterval(() => {
        this.moveY(1)
        this.time += 1
      }, 500)
    },
    end() {
      this.base = []
      this.time = 0
      this.cleared = 0
      this.change()
      clearInterval(this.timer)
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
    change() {
      this.typeIndex = random(types.length);
      this.$nextTick(() => {
        this.block.center = defaultCenter
        this.block.positions = this.$refs.block.next(this.block.center, this.form)
      })
    },
    moveY(y) {
      const center = clone(this.block.center)
      center.y += y
      const positions = this.$refs.block.next(center, this.form)
      const result = this.check(positions)
      if(result) {
        this.block.center = center
        this.block.positions = positions
      } else {
        this.place(this.block.positions)
        this.clear()
        this.block.positions = this.$refs.block.next(this.block.center, this.form)
      }
    },
    keyPress(code) {
      switch(code) {
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
        case 32:  { // space
          // let i = this.typeIndex + 1
          // if(i === this.types.length) {
          //   i = 0
          // }
          // this.typeIndex = i
          break;
        }
        default:
          break;
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
    place(positions) {
      this.base = this.base.concat(positions)
      this.change()
    },
    clear() {
      const rows = []
      this.base.forEach((pixel, i) => {
        if(pixel.y === 1) {
          if (confirm(`Score: ${this.cleared}\nClick OK to restart!`)) {
            this.start()
          } else {
            this.end()
          }
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
    }
  }
}
</script>

<style lang="scss">
$pixel-size: 30px;
.container {
  background: black;
  position: relative;
  .pixel {
    height: $pixel-size;
    width: $pixel-size;
    background: blue;
    position: absolute;
  }
}
</style>