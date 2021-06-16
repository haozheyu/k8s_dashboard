<template>
  <el-select v-model="value" placeholder="default" @change="changeNamespace">
    <el-option
      v-for="item in Namespace_list"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>

  <el-table
    :data="Pod_list"
    style="width: 100%">
    <el-table-column
      label="createTime">
      <template #default="scope">
        <i class="el-icon-time"></i>
        <span style="margin-left: 10px">{{ scope.row.startTime }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="name">
      <template #default="scope">
        <el-popover effect="light" trigger="hover" placement="top">
          <template #default>
            <p>namespace: {{ scope.row.namespace }}</p>
          </template>
          <template #reference>
            <div class="name-wrapper">
              <el-tag @click="getPodName(scope.row)" size="medium">{{ scope.row.name }}</el-tag>
            </div>
          </template>
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column
      label="status">
      <template #default="scope">
        <i class="el-icon-rank"></i>
        <span style="margin-left: 10px">{{ scope.row.status }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="qosClass">
      <template #default="scope">
        <i class="el-icon-aim"></i>
        <span style="margin-left: 10px">{{ scope.row.qosClass}}</span>
      </template>
    </el-table-column>

    <el-table-column
      label="podIP">
      <template #default="scope">
        <el-popover effect="light" trigger="hover"
                    v-if="scope.row.podIP">
          <template #default>
            <p>podIPs: {{ scope.row.podIP }}</p>
          </template>
          <template #reference>
            <div class="name-wrapper">
              <el-tag >{{ scope.row.podIP[0].ip }}</el-tag>
            </div>
          </template>
        </el-popover>
      </template>
    </el-table-column>

    <el-table-column type="expand" label="操作">
      <template #default="scope">
        <el-form label-position="top" inline class="demo-table-expand" v-for="info in scope.row.containerInfo" :key="info">
          <el-form-item label="Conn">
            <span>
              <el-button @click="handleConn(scope.row, info.name, shell)" type="warning" plain> conn </el-button>
            </span>
          </el-form-item>
          <el-form-item label="containerName">
            <span>conn :{{ info.name }}</span>
          </el-form-item>
          <el-form-item label="containerReady">
            <span>{{ info.ready }}</span>
          </el-form-item>
          <el-form-item label="restartCount">
            <span>{{ info.restartCount }}</span>
          </el-form-item>
          <el-form-item label="image">
            <span> {{ info.image }}</span>
          </el-form-item>
          <el-form-item label="link type">
            <el-radio v-model="shell" label="bash">bash</el-radio>
            <el-radio v-model="shell" label="sh">sh</el-radio>
          </el-form-item>
        </el-form>
      </template>
    </el-table-column>
  </el-table>
</template>


<script lang="ts">

import {defineComponent, getCurrentInstance, ref, onMounted, reactive, computed} from 'vue'
import { useRouter } from "vue-router"
import axios from "@/utils/axios";

interface NamespaceList {
  value: string,
  label: string,
}
interface PodList {
  name : string,
  namespace : string,
  status : string,
  startTime: string,
  podIP : string[]|undefined,
  containerInfo : any,
  qosClass: string,
}
interface Container {
  containerName: string,
  containerReady: boolean,
  containerRestartCount ?: number,
}

export default defineComponent({
  name: "Pod",
  setup() {
    const Pod_list = reactive<PodList[]>([])
    const Namespace_list = reactive<NamespaceList[]>([])
    const value = ref("")
    const shell = ref("bash")
    axios.get('/resource/pod_list').then((res) => {
      for (var i = 0; i < res.data[0].items.length; i++) {
        Pod_list.push({
          name: res.data[0].items[i].metadata.name,
          namespace: res.data[0].items[i].metadata.namespace,
          status: res.data[0].items[i].status.phase,
          startTime: res.data[0].items[i].status.startTime,
          podIP: res.data[0].items[i].status.podIPs,
          containerInfo: res.data[0].items[i].status.containerStatuses,
          qosClass: res.data[0].items[i].status.qosClass,
        })
      }
    })
    axios.get('/resource/namespace_list').then((res) => {
      for (var i = 0; i < res.data[0].items.length; i++) {
        Namespace_list.push({
          value: res.data[0].items[i].metadata.name,
          label: res.data[0].items[i].metadata.name,
        })
      }
    })
    const router = useRouter()
    const handleConn = (row, info, sh) => {
      // 路由跳转带参数
      router.push({
        path:"/webShell",
        query:{
          podName : row.name,
          podNamespace : row.namespace,
          containerName : info,
          shell: sh,
        }
      })
    }
    const changeNamespace = (value) => {
      Pod_list.length = 0
      axios.get('/resource/pod_list?namespace='+value).then((res) => {
        for (var i = 0; i < res.data[0].items.length; i++) {
          Pod_list.push({
            name: res.data[0].items[i].metadata.name,
            namespace: res.data[0].items[i].metadata.namespace,
            status: res.data[0].items[i].status.phase,
            startTime: res.data[0].items[i].status.startTime,
            podIP: res.data[0].items[i].status.podIPs,
            containerInfo: res.data[0].items[i].status.containerStatuses,
            qosClass: res.data[0].items[i].status.qosClass,
          })
        }
      })
    }
    const getPodName = (e)=> {
      // 带参数路由
      router.push({
        path:"/podInfo",
        query:{
          podName : e.name,
          podNamespace : e.namespace,
        }
      })
    }
    return {
      Namespace_list,
      Pod_list,
      value,
      handleConn,
      shell,
      changeNamespace,
      getPodName,
    }
  }
})

</script>

<style scoped>

</style>
