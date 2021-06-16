<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">k8s_vite</div>
      <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
        <el-form-item prop="username">
          <el-input v-model="param.username" placeholder="username">
            <template #prepend>
              <el-button icon="el-icon-user"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="password"
            v-model="param.password"
            @keyup.enter="submitForm"
          >
            <template #prepend>
              <el-button icon="el-icon-lock"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input
            placeholder="code"
            v-model="param.code"
          >
            <template #prepend>
              <img style='height: 30px;' ref='picRef' id='picCodeId' @click="GetPic" />
            </template>
          </el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm">登录</el-button>
        </div>
        <p class="login-tips">Tips : 用户名和密码随便填。</p>
      </el-form>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { onMounted, onUnmounted, reactive, ref, toRefs } from 'vue'
import { ElMessage } from 'element-plus'
import axios from '@/utils/axios'

export default {
  setup(){
    const router = useRouter()
    const login = ref(null)
    const picRef = ref(null)
    const picStatus = reactive({
      picUrl: '',
      picId : ''
    })
    const state = reactive({
      param: {
        username: 'admin',
        password: 'admin',
        code: '123123',
      },
      rules: {
        username: [
          { required: 'true', message: '账户不能为空', trigger: 'blur' }
        ],
        password: [
          { required: 'true', message: '密码不能为空', trigger: 'blur' }
        ],
        code: [
          { required: 'true', message: '验证码不能为空', trigger: 'blur' }
        ]
      }
    })
    const submitForm = () =>{
      login.value.validate(valid => {
        if (valid) {
          // send get user
          var params = new URLSearchParams()
          params.append('Id',picStatus.picId)
          params.append('Username', state.param.username)
          params.append('Password',state.param.password)
          params.append('Code',state.param.code)
          axios.post('v1/login', params).then((data) => {
            if ( data.status === 200 ) {
              ElMessage.success('登录成功')
              localStorage.setItem('token', data.data.token)
              localStorage.setItem('user', JSON.stringify(data.data.user))
              // 路由跳转带参数
              router.push({
                path:"/",
                // query:{
                //   show : true
                // }
              })
            }else {
              const repstr = "登录失败"+data.msg
              ElMessage.warning(repstr)
            }
          }, (err)=> {
            ElMessage.error(err)
          })
        } else {
          ElMessage.warning('请核验输入的内容')
          return false;
        }
      });
    }
    const GetPic = ()=>{
      axios.get('v1/picCode').then((data) => {
        picRef.value.src = data.data.base_64_blob
        picStatus.picUrl = data.data.base_64_blob
        picStatus.picId = data.data.id
      })
    }
    // get code pic
    onMounted(()=>{
      GetPic()
    })
    return {
      login,submitForm,...toRefs(state), GetPic,picRef
    }
  }
};
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url(../assets/img/login-bg.jpg);
  background-size: 100%;
}
.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #fff;
  border-bottom: 1px solid #ddd;
}
.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 350px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
  overflow: hidden;
}
.ms-content {
  padding: 30px 30px;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}
.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #fff;
}
</style>
