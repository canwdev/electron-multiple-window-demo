<template>
  <WindowFrameMac>
    <h3>这个页面是 Home</h3>

    <fieldset>
      <legend>创建窗口</legend>
      <button
          v-for="(item, index) in windowModules"
          :key="index"
          @click="item.action()">{{ item.name }}</button>
    </fieldset>
  </WindowFrameMac>
</template>

<script>
import WindowFrameMac from '@/components/WindowFrameMac'
const {electronAPI} = window
const windowModules = [
  {
    name: 'Demo Vue App',
    action: () => {
      electronAPI.createWindow('demo')
    }
  },
  {
    name: 'Empty page',
    action: () => {
    }
  },
  {
    name: 'Splash',
    action: () => {
      electronAPI.createWindow('splash')
    }
  },
]
export default {
  name: 'Home',
  components: {
    WindowFrameMac
  },
  data() {
    return {
      windowModules: Object.freeze(windowModules)
    }
  },
  methods: {
    handleWMCreateWindow() {
      window.electronAPI.wmCreateWindow()
    }
  }
}
</script>
