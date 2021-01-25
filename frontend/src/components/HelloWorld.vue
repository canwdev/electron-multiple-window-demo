<template>
  <div class="hello">
    <fieldset>
      <legend>Test nodeIntegration</legend>
      <button @click="logFs">log fs</button>
    </fieldset>

    <fieldset>
        <legend>Window Management</legend>

      <button @click="handleCreatedWindow">Create Window</button>

      <p>
        Target window id:
        <select v-model="selectedId">
          <option
              v-for="id in windowIds"
              :key="id"
          >{{ id }}
          </option>
        </select>

          <button
            v-for="action in windowActions"
            :key="action"
            :disabled="!selectedId"
            @click="sendWindowAction(action)"
          >{{ action }}
          </button>
      </p>

        <form @submit.prevent="handleSendMessage">
        <input v-model="text" type="text" placeholder="message" required>
        <button type="submit" :disabled="!selectedId">Send!</button>
      </form>
    </fieldset>

      <fieldset>
        <legend>Broadcast Message</legend>

        <form @submit.prevent="handleSendBroadcastMessage">
          <input required placeholder="message" v-model="text2"/>
          <button type="submit">Send!</button>
        </form>
      </fieldset>

    <fieldset>
      <legend>Received Message</legend>

        <textarea style="width: 100%;" rows="5" readonly :value="message"></textarea>
    </fieldset>

  </div>
  </WindowFrame>
</template>

<script>
const {electronAPI} = window

const genText = () => 'Hello World! It\'s ' + Date.now()

export default {
  name: 'HelloWorld',
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
      ]
    }
  },
  computed: {
    windowIds() {
      return this.$store.state.windowIds
    },
    message() {
      return this.$store.state.windowMessage
    }
  },
  methods: {
    logFs() {
      const electron = window.require('electron')
      const fs = electron.remote.require('fs')
      console.log('fs', fs)
    },
    handleCreatedWindow() {
      electronAPI.wmCreateWindow()
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
    }
  }
}
</script>

<style scoped lang="scss">
.hello {
  margin: 10px;
}
</style>
