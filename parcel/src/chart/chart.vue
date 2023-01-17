<template>
  <Line :data="data" :options="options" ref="childRef"/>
</template>

<script lang="ts">
import { ref } from 'vue'
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

  setup() {
    const childRef = ref(null);
    const addPoint = () => {
      console.log("addPoint");
    }
    return {
      childRef,
      addPoint
    }
  },
}
</script>
