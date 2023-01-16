<template>
  <Line :data="data" :options="options" />
</template>

<script lang="ts">
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'vue-chartjs'
import * as chartConfig from './chartConfig.ts'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export default {
  name: 'lineChart',
  components: {
    Line
  },
  data() {
    return chartConfig
  },
  methods: {
    addPoint() {
      this.data.datasets[0].data.push(10)
      this.data.labels.push('new label')
      this.$data._chart.update()
    }
  },
}
</script>
