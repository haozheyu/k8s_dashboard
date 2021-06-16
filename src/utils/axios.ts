import Axios, { AxiosInstance } from 'axios'
import { ElMessage } from 'element-plus'

const baseURL = 'http://114.67.110.204:9997'

const axios: AxiosInstance = Axios.create({
  baseURL,
  timeout: 20000 // 请求超时 20s
})

const addHeader = "Bearer "+localStorage.getItem('token')

// 前置拦截器（发起请求之前的拦截）
axios.interceptors.request.use(
  (config) => {
    /**
     * 根据你的项目实际情况来对 config 做处理
     */
    config.headers['Authorization'] = addHeader || ''
    config.headers.post['Content-Type'] = 'application/json'
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 后置拦截器（获取到响应时的拦截）
axios.interceptors.response.use(
  (response) => {
    /**
     * 根据你的项目实际情况来对 response 和 error 做处理
     * 这里对 response 和 error 不做任何处理，直接返回
     */
    return response.data
  },
  (error) => {
    if (error.response && error.response.data) {
      const code = error.response.status
      const msg = error.response.data.message
      ElMessage.error(`Code: ${code}, Message: ${msg}`)
      console.error(`[Axios Error]`, error.response)
    } else {
      ElMessage.error(`${error}`)
    }
    return Promise.reject(error)
  }
)

export default axios
