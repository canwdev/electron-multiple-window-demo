<template>
  <div class="window-frame-wrap" :class="{'is-maximized': isMaximized}">
    <div class="window-title-bar flex items-center justify-between">
      <div class="title">{{ title }}</div>
      <div class="actions">
        <button @click="handleMinimum" class="btn-no-style">-</button>
        <button :disabled="!isResizable" @click="handleToggleMaximum" class="btn-no-style">{{ isMaximized ? '=' : '+' }}</button>
        <button @click="handleClose" class="btn-no-style close">x</button>
      </div>
    </div>
    <div class="window-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import WindowFrameMixin from "./window-frame-mixin"

export default {
  name: 'WindowFrame',
  mixins: [WindowFrameMixin],
  props: {
    title: {
      type: String,
      default: 'WindowFrame'
    }
  },

}
</script>

<style lang="scss" scoped>
$themeColor: #0078D7;
$titleHeight: 28px;

.window-frame-wrap {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  border: 1px solid $themeColor;
  display: flex;
  flex-direction: column;

  &.is-maximized {
    border: 0;
    .window-title-bar {
      height: $titleHeight - 2;
    }
  }

  .window-title-bar {
    height: $titleHeight;
    background: $themeColor;
    color: white;
    -webkit-app-region: drag;
    font-size: 12px;
    padding-left: 8px;
    user-select: none;

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
        cursor: default;
        transition: background .3s;
        &:hover {
          background: rgba(255,255,255,0.2);
        }

        &.close {
          &:hover {
            background: #E81123;
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
