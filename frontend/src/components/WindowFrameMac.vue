<template>
  <div class="window-frame-wrap" :class="{'is-maximized': isMaximized}">
    <div class="window-title-bar flex items-center justify-between">
    <span class="actions">
      <button @click="handleClose" class="btn-no-style btn-red"><span>x</span></button>
      <button @click="handleMinimum" class="btn-no-style btn-yellow"><span>-</span></button>
      <button :disabled="!isResizable" @click="handleToggleMaximum"
              class="btn-no-style btn-green"><span>{{ isMaximized ? '=' : '+' }}</span></button>
    </span>

      <span class="title">{{ title }}</span>
      <span class="actions"></span>
    </div>
    <div class="window-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import WindowFrameMixin from "./window-frame-mixin"

export default {
  name: "WindowFrameMac",
  mixins: [WindowFrameMixin],
  props: {
    title: {
      type: String,
      default: 'WindowFrameMac'
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>

.window-frame-wrap {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  border: 1px solid #acacac;
  /*box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.3);*/
  /*box-shadow: inset 0 1px 0 rgba(255, 255, 255, .6), 0 22px 70px 4px rgba(0, 0, 0, 0.56), 0 0 0 1px rgba(0, 0, 0, 0.3);*/
  /*backdrop-filter: saturate(180%) blur(20px);*/
  /*border-radius: 6px;*/
  min-width: 400px;
  min-height: 300px;
  display: flex;
  flex-direction: column;

  &.is-maximized {
    border: 0;
    .window-title-bar {

    }
  }

  .window-title-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: linear-gradient(to bottom, #ebebeb, #d5d5d5);
    color: #4d494d;
    font-size: 14px;
    text-align: center;
    line-height: 1.6;
    user-select: none;
    border-top: 1px solid #f3f1f3;
    -webkit-app-region: drag;
    //border-top-left-radius: 6px;
    //border-top-right-radius: 6px;
    border-bottom: 1px solid #b1aeb1;

    .title {
      flex: 1;
    }
  }
}



.actions {
  min-width: 100px;
  height: 100%;
  display: flex;
  align-items: center;

  button {
    -webkit-app-region: no-drag;
    border-radius: 50%;
    width: 14px;
    height: 14px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    outline: none;
    font-size: 12px;
    margin-left: 8px;
    position: relative;
    cursor: default;

    & > span {
      transition: opacity .3s;
      opacity: 0;
    }
  }

  &:hover {
    button > span {
      opacity: 1;
    }
  }
}

.btn-red {
  background: #ff5c5c;
  border: 1px solid #e33e41;
}

.btn-red:active {
  background: #c14645;
  border: 1px solid #b03537;
}

.btn-red > span {
  color: #820005;
  font-weight: bold;
}

.btn-red:active > span {
  color: #4e0002;
}

.btn-yellow {
  background: #ffbd4c;
  border: 1px solid #e09e3e;
}

.btn-yellow:active {
  background: #c08e38;
  border: 1px solid #af7c33;
}

.btn-yellow > span {
  color: #9a5518;
}

.btn-yellow:active > span {
  color: #5a2607;
}

.btn-green {
  background: #00ca56;
  border: 1px solid #14ae46;
}

.btn-green:active {
  background: #029740;
  border: 1px solid #128435;
}

.btn-green > span {
  color: #006519;
}

.btn-green:active > span {
  color: #003107;
}

.window-content {
  padding: 10px;
  overflow: auto;
  flex: 1;
}
</style>
