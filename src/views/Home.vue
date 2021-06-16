<template>
  <div class="home-container page-container">
    <div class="page-title">
      <div id="clusterinfo" ref="myRef" class="clusterinfo" />
      <div class="grid-content bg-purple-light selfinfo" id="selfinfo" ref="myRef" />
    </div>
    <el-row class="carinfo" :gutter="32">
      <el-col class="carinfoitem" :span="4">
        <el-card shadow="hover"> node | {{ node }} </el-card>
      </el-col>
      <el-col class="carinfoitem" :span="4">
        <el-card shadow="hover"> Services | {{ Services }} </el-card>
      </el-col>
      <el-col class="carinfoitem" :span="4">
        <el-card shadow="hover"> Pods |{{ Pods }} </el-card>
      </el-col>
      <el-col class="carinfoitem" :span="4">
        <el-card shadow="hover"> DaemonSets |{{ DaemonSets }} </el-card>
      </el-col>
      <el-col class="carinfoitem" :span="4">
        <el-card shadow="hover"> Deployments | {{ Deployments }} </el-card>
      </el-col>
      <el-col class="carinfoitem" :span="4">
        <el-card shadow="hover"> StatefulSets |{{ StatefulSets }} </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import axios from '@/utils/axios'
import * as echarts from 'echarts'

export default defineComponent({
  name: 'Home',
  setup() {
    const echart = echarts
    const node = ref<number>(0)
    const Services = ref<number>(0)
    const Pods = ref<number>(0)
    const DaemonSets = ref<number>(0)
    const Deployments = ref<number>(0)
    const StatefulSets = ref<number>(0)

    const initClusterInfo = () => {
      const myChart = echart.init(document.getElementById('clusterinfo'))
      axios.get('/resource/cluster_info').then((response) => {
        node.value = response.data[0].node
        Services.value = response.data[0].service
        Pods.value = response.data[0].pod
        DaemonSets.value = response.data[0].daemonset
        Deployments.value = response.data[0].deployment
        StatefulSets.value = response.data[0].statefulset
        myChart.setOption({
          title: {
            text: '资源类型占比',
            left: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            left: 'center',
            top: 'bottom',
            data: [
              'Nodes',
              'Services',
              'Pods',
              'DaemonSets',
              'Deployments',
              'StatefulSets'
            ]
          },
          toolbox: {
            show: true,
            feature: {
              mark: { show: true },
              dataView: { show: true, readOnly: false },
              restore: { show: true },
              saveAsImage: { show: true }
            }
          },
          series: [
            {
              name: '半径模式',
              type: 'pie',
              radius: [40, 150],
              center: ['45%', '50%'],
              roseType: 'radius',
              itemStyle: {
                borderRadius: 5
              },
              label: {
                show: false
              },
              emphasis: {
                label: {
                  show: true
                }
              },
              data: [
                { value: response.data[0].node, name: 'Nodes' },
                { value: response.data[0].service, name: 'Services' },
                { value: response.data[0].pod, name: 'Pods' },
                { value: response.data[0].daemonset, name: 'DaemonSets' },
                { value: response.data[0].deployment, name: 'Deployments' },
                { value: response.data[0].statefulset, name: 'StatefulSets' }
              ]
            }
          ]
        })
      })
    }
    const initSelfInfo = () => {
      const myChart = echart.init(document.getElementById('selfinfo'))
      axios.get('/resource/system_info').then((response) => {
        myChart.setOption({
          xAxis: {
            type: 'category',
            data: ['cpu %', 'mem %']
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              data: [
                { value: response.data[0].cpu, itemStyle: { color: '#99CCFF' } },
                { value: response.data[0].mem, itemStyle: { color: '#FF9900' } }
              ],
              type: 'bar',
              showBackground: true,
              backgroundStyle: {
                color: 'rgba(180, 180, 180, 0.2)'
              }
            }
          ]
        })
      })
    }

    onMounted(() => {
      initClusterInfo()
      initSelfInfo()
    })
    return {
      node,
      Services,
      Pods,
      DaemonSets,
      Deployments,
      StatefulSets
    }
  }
})
</script>

<style scoped lang="stylus">
.home-container {
  .vue-element-plus-logo {
    width 50%
  }
}
.clusterinfo{
  float:left;
  width: 600px;
  height: 400px;
  margin:0 auto;
}
.selfinfo{
  float:left;
  width: 400px;
  height: 400px;
  margin:0 auto;
}
.carinfo{
  top 100px;
  float:left;
  height 100px;
  position: relative;
  left: 10px;
  bottom: 10px;
  right: 10px;
}
.carinfoitem{
  height 100px;
  width 200px;
  left 20px;
  font-max-size 20px 20px;
  font-family "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif
}
</style>
