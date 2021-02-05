<template>
  <WindowFrameMac title="Electron 多窗口通信 Demo">
    <h3>Home 页面</h3>

    <fieldset>
      <legend>创建窗口</legend>
      <button
          v-for="(item, index) in windowModules"
          :key="index"
          @click="item.action()">{{ item.name }}</button>
    </fieldset>

    <WindowState/>

    <SystemInfo/>
  </WindowFrameMac>
</template>

<script>
import WindowFrameMac from '@/components/WindowFrameMac'
import WindowState from '@/components/WindowState'
import SystemInfo from '@/components/SystemInfo'
const {electronAPI} = window
const windowModules = [
  {
    name: 'Demo',
    action: () => {
      electronAPI.createWindow('demo')
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
    WindowFrameMac,
    WindowState,
    SystemInfo,
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
