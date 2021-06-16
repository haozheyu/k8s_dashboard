import { createApp } from 'vue'
import importUiFramework from '@/utils/import-ui-framework'
import router from '@/router/index'
import { key, store } from '@/store'
import App from './App.vue'
import '@/style/basic.styl'
// eslint-disable-next-line import/order
import * as echarts from 'echarts'

const app = createApp(App)
app.config.globalProperties.echarts = echarts
importUiFramework(app).use(router).use(store, key).mount('#app')
