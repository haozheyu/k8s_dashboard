<template>
  <el-row>
    <el-col :span="12">
      <el-form ref="form" :model="PodMetadata" label-width="80px">
        <el-form-item label="Pod名称">
          <el-input v-model="PodMetadata.namespace"></el-input>
        </el-form-item>
        <el-form-item label="namespace">
          <el-input v-model="PodMetadata.name"></el-input>
        </el-form-item>
        <el-form-item label="createTime">
          <el-input v-model="PodMetadata.creationTimestamp"></el-input>
        </el-form-item>
      </el-form>
      <el-form ref="form" :model="PodSpec" label-width="80px">
        <el-form-item label="nodeName">
          <el-input v-model="PodSpec.nodeName"></el-input>
        </el-form-item>
        <el-form-item label="serviceAccountName">
          <el-input v-model="PodSpec.serviceAccountName"></el-input>
        </el-form-item>
        <el-form-item label="volumes" v-for="item in PodSpec.volumes" :key="item.name">
          <el-input v-model="item.name"></el-input>
          <el-input v-model="item.mountPath"></el-input>
          <el-input v-model="item.readOnly"></el-input>
        </el-form-item>
        <el-form-item label="containers" v-for="item in PodSpec.containers" :key="item.name">
          <el-input v-model="item.name"></el-input>
          <el-input v-model="item.image"></el-input>
          <el-form-item label="volumeMounts" v-for="item1 in item.volumeMounts" :key="item1.name">
            <el-input v-model="item1.name"></el-input>
            <el-input v-model="item1.readOnly"></el-input>
            <el-input v-model="item1.mountPath"></el-input>
          </el-form-item>
        </el-form-item>
      </el-form>

      <el-form ref="form" :model="PodStatus" label-width="80px">
        <el-form-item label="运行状态">
          <el-input v-model="PodStatus.phase"></el-input>
        </el-form-item>
        <el-form-item label="podIp">
          <el-input v-model="PodStatus.podIP"></el-input>
        </el-form-item>
        <el-form-item label="启动时间">
          <el-input v-model="PodStatus.startTime"></el-input>
        </el-form-item>
        <el-form-item label="Qos">
          <el-input v-model="PodStatus.qosClass"></el-input>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :span="12">

    </el-col>
  </el-row>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs, onMounted, ref, markRaw, onBeforeUnmount, onUnmounted} from 'vue'
import { useRouter } from 'vue-router'
import axios from "@/utils/axios";


export interface Metadata {
    name: string;
    namespace: string;
    creationTimestamp: string;
}
export interface Spec {
  volumes: VolumeMount[];
  containers: Container[];
  serviceAccountName: string;
  nodeName: string;
}
export interface Container {
  name: string;
  image: string;
  volumeMounts: VolumeMount[];
}
export interface VolumeMount{
  name: string;
  readOnly: boolean;
  mountPath: string;
}
export interface Status {
  phase: string; //现阶段状态
  podIP: string;
  startTime: string;
  qosClass: string;
}

export default {
  name: "PodInfo",
  setup() {
    const router = useRouter()
    const podName = router.currentRoute.value.query.podName
    const podNamespace = router.currentRoute.value.query.podNamespace

    const PodMetadata = reactive<Metadata>({name:'',namespace:'',creationTimestamp:''})
    const PodSpec = reactive<Spec>({volumes:[],serviceAccountName:'',nodeName:'', containers:[]})
    const PodStatus = reactive<Status>({phase:'',podIP:'',startTime:'',qosClass:''})
    const Podcontainers = reactive<Container[]>([])
    const PodVolumeMounts = reactive<VolumeMount[]>([])

    const querUrl = "resource/pod?"+"namespace="+podNamespace+"&podName="+podName
    axios.get(querUrl).then((res) => {
      // console.log(res.data[0])
      PodMetadata.name = res.data[0].metadata.name
      PodMetadata.namespace = res.data[0].metadata.namespace
      PodMetadata.creationTimestamp = res.data[0].metadata.creationTimestamp
      for (var i = 0; i < res.data[0].spec.containers.length; i++) {
        for (var j = 0; j < res.data[0].spec.containers[i].volumeMounts.length; j++) {
          PodVolumeMounts.push({
            name: res.data[0].spec.containers[i].volumeMounts[j].name,
            readOnly: res.data[0].spec.containers[i].volumeMounts[j].readOnly,
            mountPath: res.data[0].spec.containers[i].volumeMounts[j].mountPath,
          })
        }
        Podcontainers.push({
          name: res.data[0].spec.containers[i].name,
          image: res.data[0].spec.containers[i].image,
          volumeMounts: PodVolumeMounts
        })
      }

      PodSpec.nodeName = res.data[0].spec.nodeName
      PodSpec.serviceAccountName = res.data[0].spec.serviceAccountName
      PodSpec.volumes = PodVolumeMounts
      PodSpec.containers = Podcontainers
      PodStatus.phase = res.data[0].status.phase
      PodStatus.podIP = res.data[0].status.podIP
      PodStatus.qosClass = res.data[0].status.qosClass
      PodStatus.startTime = res.data[0].status.startTime
    })
    console.log(PodMetadata,PodSpec,PodStatus)
    return {
      PodMetadata,PodSpec,PodStatus,
    }
  },
  methods: {
    onSubmit() {
      console.log('submit!');
    }
  }
}
</script>

<style scoped>

</style>
