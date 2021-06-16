<template>
  <div class="home-container page-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-table
    :data="itemRefs"
    style="width: 100%"
    :row-class-name="tableRowClassName">
          <el-table-column
            prop="name"
            label="Cluster Name"
            width="auto">
          </el-table-column>
          <el-table-column
            prop="osVersion"
            label="系统类型"
            width="auto">
          </el-table-column>
          <el-table-column
            prop="runtimeVersion"
            label="运行时"
            width="auto">
          </el-table-column>
          <el-table-column
            prop="kubeletVersion"
            label="控制器版本"
            width="auto">
          </el-table-column>
          <el-table-column
            prop="architecture"
            label="系统平台"
            width="auto">
          </el-table-column>
      </el-table>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref , onMounted, provide, reactive} from 'vue'
import axios from "@/utils/axios";

// interface ResourceStruct {
//   name : String,
//   osVersion : String,
//   runtimeVersion : String,
//   kubeletVersion : String,
//   architecture : String,
// }
// interface ResourceStructArr {
//   [index: number]: ResourceStruct
// }

export default defineComponent({
  name: 'Resource',
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return 'warning-row'
      } else if (rowIndex === 3) {
        return 'success-row'
      }
      return ''
    },
  },
  setup() {
    const activeName = ref('second')
    const handleClick = (tab, event) => {
      console.log(tab, event)
    }
    const itemRefs = reactive<any[]>([])
    axios.get('/resource/node_list').then((res) => {
      for (var i = 0; i < res.data[0].items.length; i++) {
        itemRefs.push({
          name: res.data[0].items[i].metadata.name,
          osVersion: res.data[0].items[i].status.nodeInfo.osImage,
          runtimeVersion: res.data[0].items[i].status.nodeInfo.containerRuntimeVersion,
          kubeletVersion: res.data[0].items[i].status.nodeInfo.kubeletVersion,
          architecture: res.data[0].items[i].status.nodeInfo.architecture,
        })
      }
    })
    return {activeName, handleClick, itemRefs}
  }
})
</script>

<style scoped lang="stylus">
.home-container {
  .vue-element-plus-logo {
    width 50%
  }
}

.el-header, .el-footer {
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #D3DCE6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #ffffff;
  color: #333;
  text-align: center;
  line-height: 20px;
}
</style>
