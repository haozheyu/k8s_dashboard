import { App } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'

export default function importUiFramework(app: App) {
  app.use(ElementPlus)
  return app
}
