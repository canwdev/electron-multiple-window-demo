<template>
  <div class="window-frame-wrap">
    <div class="window-title-bar flex items-center justify-between">
      <div class="title">{{ title }}</div>
      <div class="actions">
        <button @click="handleMinimum" class="btn-no-style">-</button>
        <button @click="handleToggleMaximum" class="btn-no-style">{{ isMaximized ? '=' : '#' }}</button>
        <button @click="handleClose" class="btn-no-style close">x</button>
      </div>
    </div>
    <div class="window-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
const {electronAPI} = window

export default {
  name: 'WindowFrame',
  props: {
    title: {
      type: String,
      default: 'WindowFrame'
    }
  },
  data() {
    return {
      isMaximized: false,
    }
  },
  mounted() {
    this.getIsMaximized()
    electronAPI.windowEventListener('resize', this.getIsMaximized)
  },
  methods: {
    getIsMaximized() {
      this.isMaximized = electronAPI.getIsMaximized()
    },
    handleMinimum() {
      electronAPI.minWindow()
    },
    handleToggleMaximum() {
      electronAPI.maxWindow(!this.isMaximized)
    },
    handleClose() {
      electronAPI.closeWindow()
    },
  }
}
</script>

<style lang="scss" scoped>
$themeColor: #4caf50;
$titleHeight: 28px;

.window-frame-wrap {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  border: 1px solid $themeColor;
  border-top: 0;
  display: flex;
  flex-direction: column;

  .window-title-bar {
    height: $titleHeight;
    background: $themeColor;
    color: white;
    -webkit-app-region: drag;
    border-top: 1px solid $themeColor;
    font-size: 12px;
    padding-left: 8px;
    .iconfont {
      font-size: 12px;
    }

    .actions {
      -webkit-app-region: no-drag;
      height: 100%;
      &>button {
        width: $titleHeight;
        height: 100%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        &:hover {
          background: rgba(255,255,255,0.2);
        }

        &.close {
          &:hover {
            background: #f44336;
          }
        }
      }

    }
  }

  .window-content {
    overflow: auto;
    flex: 1;
  }
}
</style>
