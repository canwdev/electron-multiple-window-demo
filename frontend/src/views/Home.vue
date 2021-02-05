<template>
  <WindowFrameMac :title="title">
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
      title: 'Electron 多窗口通信',
      windowModules: Object.freeze(windowModules)
    }
  },
  metaInfo() {
    return {
      title: this.title,
    }
  },
  methods: {
    handleWMCreateWindow() {
      window.electronAPI.wmCreateWindow()
    }
  }
}
</script>
