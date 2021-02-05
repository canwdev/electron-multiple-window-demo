<template>
  <div class="demo-core">
    <fieldset>
      <legend>窗口管理</legend>

      <button @click="handleCreatedWindow">新建 Demo 窗口</button>

      <p>
        目标窗口 id:
        <select v-model="selectedId">
          <option
              v-for="id in windowIds"
              :key="id"
          >{{ id }}
          </option>
        </select> &nbsp;

        操作：

        <button
            v-for="action in windowActions"
            :key="action"
            :disabled="!selectedId"
            @click="sendWindowAction(action)"
        >{{ action }}
        </button>
      </p>

      <form @submit.prevent="handleSendMessage">
        <input v-model="text" type="text" placeholder="message" required> &nbsp;
        <button type="submit" :disabled="!selectedId">发送</button>
      </form>
    </fieldset>

    <fieldset>
      <legend>广播消息</legend>

      <form @submit.prevent="handleSendBroadcastMessage">
        <input required placeholder="message" v-model="text2"/> &nbsp;
        <button type="submit">发送</button>
      </form>
    </fieldset>

    <fieldset>
      <legend>接收到的消息</legend>

      <textarea style="width: 100%;" rows="5" readonly :value="message"></textarea>
    </fieldset>

    <fieldset>
      <legend>窗口间共享状态</legend>

      <form @submit.prevent="handleUpdateSharedState">
        path <input required type="text" v-model="updateState.path">
        value <input required type="text" v-model="updateState.value"> &nbsp;
        <button type="submit">更新</button>
      </form>

      <form @submit.prevent="handleSetSharedState">
        state <input required type="text" v-model="newState"> &nbsp;
        <button type="submit">设置状态</button>
      </form>

      <textarea style="width: 100%;" rows="10" readonly :value="JSON.stringify(sharedState, null, 2)"></textarea>
    </fieldset>

    <fieldset>
      <legend>测试 nodeIntegration</legend>
      <button @click="logFs">输出 fs</button>
    </fieldset>
  </div>
</template>

<script>
const {electronAPI} = window

const genText = () => 'Hello World! It\'s ' + Date.now()

export default {
  name: 'DemoCore',
  data() {
    return {
      text: genText(),
      text2: '回归运动声明：我们宇宙的总质量减少至临界值以下，宇宙将由封闭转变为开放，宇宙将在永恒的膨胀中死去，所有的生命和记忆都将死去。请归还你们拿走的质量，只把记忆体送往新宇宙。',
      selectedId: null,
      windowActions: [
        'close',
        'hideWindow',
        'showWindow',
        'minimize',
        'maximize',
        'unmaximize',
        'isMaximized'
      ],
      updateState: {
        path: 'a',
        value: 2
      },
      newState: JSON.stringify({b:2})
    }
  },
  computed: {
    windowIds() {
      return this.$store.state.windowIds
    },
    message() {
      return this.$store.state.windowMessage
    },
    sharedState() {
      return this.$store.state.sharedState
    }
  },
  methods: {
    logFs() {
      const electron = window.require('electron')
      const fs = electron.remote.require('fs')
      console.log('fs', fs)
    },
    handleCreatedWindow() {
      // electronAPI.wmCreateWindow()
      electronAPI.createWindow('demo')
    },
    handleSendMessage() {
      if (!this.selectedId) {
        console.error('no id selected!')
        return
      }
      electronAPI.wmSendMessage(this.selectedId, this.text)
      this.text = genText()
    },
    handleSendBroadcastMessage() {
      electronAPI.wmSendBroadcastMessage(this.text2)
    },
    sendWindowAction(action) {
      electronAPI.wmWindowAction(this.selectedId, action).then(res => {
        console.log(res)
      })
    },
    handleUpdateSharedState() {
      electronAPI.wmUpdateState(this.updateState.path, this.updateState.value)
    },
    handleSetSharedState() {
      electronAPI.wmSetState(JSON.parse(this.newState))
    }
  }
}
</script>

<style scoped lang="scss">
.demo-core {
  margin: 10px;
  font-size: 14px;
}
</style>
