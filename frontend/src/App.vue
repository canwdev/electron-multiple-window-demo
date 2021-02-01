<template>
  <div id="app">
    <button style="position:fixed; top: 100px;left: 0; z-index: 999"
            @click="isMessageOn ? offMessage() : onMessage()"
    >{{ isMessageOn ? 'Turn off message' : 'Turn on message' }}
    </button>

    <router-view/>
  </div>
</template>

<script>
const {electronAPI} = window

export default {
  data() {
    return {
      isMessageOn: false,
    }
  },
  async mounted() {
    this.onMessage()
    electronAPI.onUpdateWindowIds((evt, windowIds) => {
      console.log('onUpdateWindowIds', evt, windowIds)
      this.$store.commit('setWindowIds', windowIds)
    })
    const ids = await electronAPI.wmGetWindowIds()
    console.log('initial ids', ids)

    this.$store.commit('setWindowIds', ids)
  },
  methods: {
    handleUpdateMessage(evt, message) {
      console.log('onChannelMessage', evt, message)
      this.$store.commit('setWindowMessage', message)
    },
    onMessage() {
      electronAPI.onChannelMessage('UPDATE_MESSAGE', this.handleUpdateMessage)
      this.isMessageOn = true
    },
    offMessage() {
      electronAPI.offChannelMessage('UPDATE_MESSAGE', this.handleUpdateMessage)
      this.isMessageOn = false
    }
  }
}
</script>

<style lang="scss">
#app {
  width: 100%;
  height: 100%;
}
</style>
