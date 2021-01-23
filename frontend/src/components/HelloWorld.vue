<template>
  <div class="hello">
    <fieldset>
      <legend>Test</legend>
      <button @click="logFs">log fs</button>
    </fieldset>

    <fieldset>
      <legend>Window Manage</legend>

      <button @click="handleCreatedWindow">Create Window</button>

      <p>
        Send <input type="text" placeholder="message"> <br>
        to <select name=""></select> <button>Send!</button>
      </p>

      <p>
        Received Message: <br>
        <textarea rows="5" readonly></textarea>
      </p>
    </fieldset>

  </div>
</template>

<script>
const {electronAPI} = window

export default {
  name: 'HelloWorld',
  mounted() {
    electronAPI.onUpdateMessage((...args) => {
      console.log('onUpdateMessage', args)
    })
    electronAPI.onUpdateWindowIds((...args) => {
      console.log('onUpdateWindowIds', args)
    })
  },
  methods: {
    logFs() {
      const electron = window.require('electron')
      const fs = electron.remote.require('fs')
      console.log('fs', fs)
    },
    handleCreatedWindow() {
      electronAPI.wmCreateWindow()
    }
  }
}
</script>

<style scoped lang="scss">
.hello {
  margin: 10px;
}
</style>
