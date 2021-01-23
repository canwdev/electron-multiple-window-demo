<template>
  <div class="hello">
    <fieldset>
      <legend>Test nodeIntegration</legend>
      <button @click="logFs">log fs</button>
    </fieldset>

    <fieldset>
      <legend>Window Manage</legend>

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
      </p>

      <form @submit.prevent="handleSend">
        <input v-model="text" type="text" placeholder="message" required>
        <button type="submit" :disabled="!selectedId">Send!</button>
      </form>
    </fieldset>

    <fieldset>
      <legend>Received Message</legend>

      <textarea rows="5" readonly :value="message"></textarea>
    </fieldset>

  </div>
</template>

<script>
const {electronAPI} = window

const genText = () => 'Hello World! It\'s ' + Date.now()

export default {
  name: 'HelloWorld',
  data() {
    return {
      text: genText(),
      selectedId: null
    }
  },
  computed: {
    windowIds() {
      return this.$store.state.windowIds
    },
    message() {
      return this.$store.state.message
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
    handleSend() {
      if (!this.selectedId) {
        console.error('no id selected!')
        return
      }
      electronAPI.wmSendMessage(this.selectedId, this.text)
      this.text = genText()
    }
  }
}
</script>

<style scoped lang="scss">
.hello {
  margin: 10px;
}
</style>
