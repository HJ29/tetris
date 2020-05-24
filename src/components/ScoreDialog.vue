<template>
  <q-dialog ref="dialog" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <div class="row items-center justify-center q-my-md text-h5">
        RESULT
      </div>
      <div class="column items-center justify-center">
        <div class="col row items-center justify-center">
          <div class="col text-right q-px-md">
            TIME:
          </div>
          <div class="col text-left q-px-md">
            {{time}}
          </div>
        </div>
        <div class="row items-center justify-center">
          <div class="col text-right q-px-md">
            SCORE:
          </div>
          <div class="col text-left q-px-md">
            {{score}}
          </div>
        </div>
      </div>
      <div class="row justify-center items-center q-my-md q-gutter-sm">
        <q-btn 
          class="btn"
          outline 
          color="black" 
          label="cancel" 
          @click="onCancelClick" 
        />
        <q-btn 
          class="btn"
          outline 
          color="black" 
          label="restart"
          @click="onOKClick" 
        />
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  props: {
    score: {
      default: 0,
      type: Number
    },
    time: {
      default: 0,
      type: Number
    }
  },

  methods: {
    show () {
      this.$refs.dialog.show()
    },

    hide () {
      this.$refs.dialog.hide()
    },

    onDialogHide () {
      this.$emit('hide')
    },

    onOKClick () {
      this.$emit('ok')
      this.hide()
    },

    onCancelClick () {
      this.hide()
    }
  }
}
</script>

<style lang="scss" scoped>
.btn {
  width: 100px;
}
</style>