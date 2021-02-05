<template>
  <fieldset>
    <legend>系统信息</legend>

    <div class="system-info">
      <div class="info-row">
        <div class="left">User Agent</div>
        <div class="right">{{ userAgent }}</div>
      </div>
      <div class="info-row">
        <div class="left">Outer Size (WxH)</div>
        <div class="right">{{ outerWidth }} x {{ outerHeight }}</div>
      </div>
      <div class="info-row">
        <div class="left">Inner Size (WxH)</div>
        <div class="right">{{ innerWidth }} x {{ innerHeight }}</div>
      </div>
      <div class="info-row">
        <div class="left">Device Pixel Ratio</div>
        <div class="right">{{ devicePixelRatio }}</div>
      </div>
    </div>
  </fieldset>
</template>

<script>
export default {
  name: "SystemInfo",
  data() {
    return {
      outerWidth: null,
      outerHeight: null,
      innerWidth: null,
      innerHeight: null,
      devicePixelRatio: null,
      userAgent: window.navigator.userAgent
    }
  },
  mounted: function () {
    var self = this;
    this.getHW();
    window.addEventListener('resize', function () {
      self.getHW();
    })
  },
  methods: {
    getHW: function () {
      this.outerWidth = window.outerWidth;
      this.innerWidth = window.innerWidth;
      this.outerHeight = window.outerHeight;
      this.innerHeight = window.innerHeight;
      this.devicePixelRatio = window.devicePixelRatio;
    }
  }
}
</script>

<style lang="scss" scoped>
.system-info {
  font-size: 14px;

  .info-row {
    display: flex;
    align-items: center;
    min-height: 40px;

    &:hover {
      background: rgba(114,114,114,0.2);
    }

    & + .info-row {
      border-top: 1px solid rgba(114,114,114,0.5);
    }

    .left {
      width: 180px;
      font-weight: bold;
    }

    .right {
      flex: 1;
      font-family: Consolas,monospace;

    }
  }
}
</style>
