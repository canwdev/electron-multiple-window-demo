<template>
  <fieldset>
    <legend>窗口状态</legend>

    <div class="window-state-table">
      <div class="table-row table-head">
        <div class="t-col id">窗口 id</div>
        <div class="t-col os-pid">OS PID</div>
        <div class="t-col app-pid">APP PID</div>
<!--        <div class="t-col cpu">CPU %</div>-->
<!--        <div class="t-col memory">内存</div>-->
        <div class="t-col title">窗口标题</div>
        <div class="t-col visible-attr">是否可见</div>
      </div>
      <div class="table-body">
        <div
            v-for="item in windowStateList"
            :key="item.id"
            class="table-row"
        >
          <div class="t-col id">{{ item.id }}</div>
          <div class="t-col os-pid">{{ item.OSProcessId }}</div>
          <div class="t-col app-pid">{{ item.processId }}</div>
<!--          <div class="t-col cpu"> %</div>-->
<!--          <div class="t-col memory"></div>-->
          <div class="t-col title">{{ item.title }}</div>
          <div class="t-col visible-attr" :class="{visible: item.isVisible}">{{ item.isVisible ? '是' : '否' }}</div>
        </div>
      </div>
    </div>
  </fieldset>
</template>

<script>
const {electronAPI} = window

export default {
  name: "WindowState",
  data() {
    return {
      windowStateList: [],
      refreshTimer: null
    }
  },
  computed: {
    windowIds() {
      return this.$store.state.windowIds
    },
  },
  watch: {
    windowIds(val) {
      this.updateList(val)
    }
  },
  mounted() {
    this.updateList(this.windowIds)
    this.startAutoRefresh()
  },
  beforeDestroy() {
    clearTimeout(this.refreshTimer)
  },
  methods: {
    startAutoRefresh() {
      clearTimeout(this.refreshTimer)
      this.refreshTimer = setInterval(() => {
        this.updateList(this.windowIds)
      }, 3000)
    },
    async updateList(ids) {
      const list = []
      for (let i = 0; i < ids.length; i++) {
        const id = ids[i]
        const title = await electronAPI.wmWindowAction(id, 'title')
        const isVisible = await electronAPI.wmWindowAction(id, 'isVisible')
        const OSProcessId = await electronAPI.wmWindowAction(id, 'getOSProcessId')
        const processId = await electronAPI.wmWindowAction(id, 'getProcessId')
        list.push({
          id,
          OSProcessId,
          processId,
          title,
          isVisible,
        })
      }
      this.windowStateList = list
    }
  }
}
</script>

<style lang="scss" scoped>
$borderColor: 1px solid rgba(114, 114, 114, .5);

.window-state-table {
  .table-row {
    display: flex;
    font-size: 14px;

    .t-col {
      padding: 0 10px;
      display: flex;
      align-items: center;
      min-height: 45px;

      &.id, &.os-pid, &.app-pid, &.cpu, &.memory {
        width: 60px;
      }

      &.title {
        flex: 1;
      }

      &.visible-attr {
        width: 60px;

        &.visible {
          color: #00ca56;
        }
      }
    }
  }

  .table-head {
    font-weight: bold;
    border-bottom: $borderColor;
  }

  .table-body {
    .table-row {
      & + .table-row {
        border-top: $borderColor;
      }

      &:hover {
        background: rgba(114, 114, 114, 0.2);
      }
    }
  }
}
</style>
