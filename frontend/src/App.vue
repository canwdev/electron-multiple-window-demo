<template>
  <div id="app">
    <div class="global-actions">
      <button
          @click="isMessageOn ? offMessage() : onMessage()"
      >{{ isMessageOn ? '关闭' : '开启' }} 消息监听
      </button>
    </div>
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
  async created() {
    this.onMessage()
    electronAPI.onUpdateWindowIds((evt, windowIds) => {
      console.log('onUpdateWindowIds', evt, windowIds)
      this.$store.commit('setWindowIds', windowIds)
    })
    const ids = await electronAPI.wmGetWindowIds()
    console.log('initial ids', ids)
    this.$store.commit('setWindowIds', ids)

    await this.getSharedState()
  },
  methods: {
    handleUpdateMessage(evt, message) {
      console.log('onChannelMessage', evt, message)
      this.$store.commit('setWindowMessage', message)
    },
    onMessage() {
      electronAPI.onChannelMessage('UPDATE_MESSAGE', this.handleUpdateMessage)
      electronAPI.onChannelMessage('STATE_UPDATED', this.handleSharedStateUpdated)

      this.isMessageOn = true
    },
    offMessage() {
      electronAPI.offChannelMessage('UPDATE_MESSAGE', this.handleUpdateMessage)
      electronAPI.offChannelMessage('STATE_UPDATED', this.handleSharedStateUpdated)
      this.isMessageOn = false
    },
    handleSharedStateUpdated(ev, data) {
      console.log('handleSharedStateUpdated', ev, data)
      // this.getSharedState()

      const {path, value} = data
      if (!path) {
        this.getSharedState()
      } else {
        this.$store.commit('updateSharedState', {key: path, value})
      }
    },
    async getSharedState() {
      const state = await electronAPI.wmGetState()
      this.$store.commit('setSharedState', state)
    }
  }
}
</script>

<style lang="scss">
#app {
  width: 100%;
  height: 100%;
}

.global-actions {
  position: fixed;
  right: 10px;
  bottom: 10px;
  z-index: 10;
}
</style>
