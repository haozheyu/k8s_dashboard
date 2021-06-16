<template>
  <main class="main-container">
    <div class="top" v-if='state.showMenu'>
      <Header />
    </div>
    <div class="bottom">
      <div class="right">
        <div class="content">
            <router-view />
        </div>
      </div>
    </div>
  </main>
</template>
<script lang="ts">
import { defineComponent, onUnmounted, reactive, ref } from 'vue'
import Header from '@/components/Header.vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'Main',
  components: {
    Header,
  },
  setup(){
    const router = useRouter()
    const state = reactive({
      showMenu: false
    })
    const islogin = router.beforeEach((to,from,next)=>{
      if (to.path == '/login') {
        // 如果路径是 /login 则正常执行
        next()
      } else {
        // 如果不是 /login，判断是否有 token
        if (!localStorage.getItem('token')) {
          state.showMenu = false
            // 如果没有，则跳至登录页面
          next({ path: '/login' })
        } else {
          // 否则继续执行
          state.showMenu = true
          next()
        }
      }
    })
    // 监听浏览器原生回退事件
    if (window.history && window.history.pushState) {
      history.pushState(null, null, document.URL);
      window.addEventListener('popstate', () => {
        if (!localStorage.getItem('token')) {
          state.showMenu = false
        }
      }, false);
    }

    onUnmounted(()=> {
      islogin()
    })
    return {
      state,
    }
  }
})
</script>

<style scoped lang="stylus">

@import "../style/basic.styl"

$top-height = 60px
$left-side-width = 80px

.main-container {
  position absolute
  left 0
  right 0
  top 0
  bottom 0
  width 100%
  height 100%
  background $second-background-color
  box-sizing border-box
  display flex
  flex-direction column
  justify-content space-between

  .top {
    position relative
    box-sizing border-box
    width 100%
    height $top-height
    margin-bottom 10px
  }

  .bottom {
    position relative
    box-sizing border-box
    width 100%
    height 100%
    display flex
    justify-content space-between

    .left {
      position relative
      width $left-side-width
      height 100%
      box-sizing border-box
    }

    .right {
      position relative
      width 100%
      height 100%
      box-sizing border-box
      padding 0 10px 10px 10px

      .content {
        position relative
        width 100%
        height 100%
        background $background-color
        border-radius 5px
        box-sizing border-box
        padding 10px
      }
    }
  }
}

.page-links {
  a {
    font-weight: bold;
    margin: 0 20px;
  }
}
</style>
