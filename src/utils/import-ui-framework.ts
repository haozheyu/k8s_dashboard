import { App } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
// import { ElButton, ElCard} from 'element-plus'

export default function importUiFramework(app: App) {
  // 按需载入 Element Plus 组件
  // app.use(ElButton).use(ElCard).use(ElLoading).use(ElIcon)
  app.use(ElementPlus)
  return app
}
