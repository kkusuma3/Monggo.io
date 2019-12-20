import Vue from 'vue'
import { Bar, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

Vue.component('bar-chart', {
  extends: Bar,
  mixins: [reactiveProp],
  props: {
    options: {
      type: Object,
      default: () => {}
    }
  },
  mounted() {
    this.renderChart(this.chartData, this.options)
  }
})
