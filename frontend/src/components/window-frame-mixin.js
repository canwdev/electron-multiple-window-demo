const {electronAPI} = window

export default {
  data() {
    return {
      isMaximized: false,
      isResizable: false
    }
  },
  mounted() {
    this.getIsMaximized()
    electronAPI.windowEventListener('resize', this.getIsMaximized)
  },
  beforeDestroy() {
    electronAPI.windowEventListenerOff('resize', this.getIsMaximized)
  },
  methods: {
    getIsMaximized() {
      this.isMaximized = electronAPI.getIsMaximized()
      this.isResizable = electronAPI.getIsResizable()
    },
    handleMinimum() {
      electronAPI.minWindow()
    },
    handleToggleMaximum() {
      electronAPI.maxWindow(!this.isMaximized)
    },
    handleClose() {
      electronAPI.closeWindow()
    }
  }
}
