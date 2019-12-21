<template>
  <v-row>
    <v-col cols="12">
      <v-card class="py-8 px-8">
        <v-btn-toggle
          mandatory
          class="col-12 px-0 py-1 d-flex justify-end mb-8"
          background-color="transparent"
        >
          <v-btn small class="col-2" @click.native="setHistory('daily')">{{
            $t('daily')
          }}</v-btn>
          <v-btn small class="col-2" @click.native="setHistory('monthly')">{{
            $t('monthly')
          }}</v-btn>
        </v-btn-toggle>
        <bar-chart :chart-data="chartData" :options="chartOptions" />
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'TabsHistory',
  props: {
    orders: {
      type: Array,
      default: () => {}
    }
  },
  data() {
    return {
      chartDataValues: {}, // Array hold history chart data
      chartLabels: [], // Array hold history chart label
      // Chartjs Option
      chartOptions: {
        animation: {
          duration: 500,
          xAxis: false,
          yAxis: false
        },
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              stacked: true
            }
          ],
          yAxes: [
            {
              stacked: true
            }
          ]
        }
      }
    }
  },
  computed: {
    chartData() {
      return {
        labels: this.chartLabels,
        datasets: [
          {
            label: this.$t('canceled'),
            backgroundColor: '#FDD835',
            data: this.chartDataValues.canceled
          },
          {
            label: this.$t('completed'),
            backgroundColor: '#FB8C00',
            data: this.chartDataValues.completed
          }
        ]
      }
    }
  },
  methods: {
    /**
     * Called when daily/monthly tab history clicked
     */
    setHistory(history) {
      this.initHistoryChart(history)
    },
    /**
     * Called to initialize the charts data
     */
    initHistoryChart(history) {
      const now = new Date()
      if (history === 'daily') {
        const nowVal = new Date(now)
        const oneMonthBefore = nowVal.setMonth(nowVal.getMonth() - 1)
        const oneMonthBeforeFormat = new Date(oneMonthBefore)

        // DateDiff Count Variable
        const dayFirst = nowVal.getDate()
        const monthFirst = nowVal.getMonth() + 1
        const yearFirst = nowVal.getFullYear()
        const dateFirst = new Date(yearFirst, monthFirst, dayFirst)

        const daySecond = oneMonthBeforeFormat.getDate()
        const monthSecond = oneMonthBeforeFormat.getMonth()
        const yearSecond = oneMonthBeforeFormat.getFullYear()
        const dateSecond = new Date(yearSecond, monthSecond, daySecond)

        const dateDiff = Math.round(
          (dateFirst - dateSecond) / (1000 * 60 * 60 * 24)
        )

        const chartVal = []
        for (let i = 0; i < this.orders.length; i++) {
          const indexOrderCreatedAt = this.orders[i].createdAt
          const indexOrderStatus = this.orders[i].status
          const orderDate = indexOrderCreatedAt.getDate() + '-'
          const orderMonthYear =
            indexOrderCreatedAt.getMonth() +
            '-' +
            indexOrderCreatedAt.getFullYear()
          const thisMonthYear = now.getMonth() + '-' + now.getFullYear()
          const beforeMonthYear =
            oneMonthBeforeFormat.getMonth() +
            '-' +
            oneMonthBeforeFormat.getFullYear()

          if (thisMonthYear === orderMonthYear) {
            if (indexOrderStatus === 'canceled') {
              chartVal[orderDate + orderMonthYear] += ',canceled'
            } else if (indexOrderStatus === 'delivered') {
              chartVal[orderDate + orderMonthYear] += ',completed'
            }
          } else if (beforeMonthYear === orderMonthYear) {
            if (indexOrderStatus === 'canceled') {
              chartVal[orderDate + orderMonthYear] += ',canceled'
            } else if (indexOrderStatus === 'delivered') {
              chartVal[orderDate + orderMonthYear] += ',completed'
            }
          } else {
            i = this.orders.length
          }
        }
        const chartLabels = []
        const chartDataValues = {
          canceled: [],
          completed: []
        }
        for (let i = 0; i <= dateDiff; i++) {
          const oneMonthBeforeVal = new Date(oneMonthBeforeFormat)
          const oneDayBefore = oneMonthBeforeVal.setDate(
            oneMonthBeforeVal.getDate() + i
          )

          const oneDayBeforeFormat = new Date(oneDayBefore)
          const oneDayBeforeVal =
            oneMonthBeforeVal.getDate() +
            ' ' +
            oneDayBeforeFormat.toLocaleString('default', { month: 'short' })
          chartLabels.push(oneDayBeforeVal)

          const dateParam =
            oneMonthBeforeVal.getDate() +
            '-' +
            oneMonthBeforeVal.getMonth() +
            '-' +
            oneMonthBeforeVal.getFullYear()
          if (chartVal.hasOwnProperty(dateParam)) {
            const crtPrm = chartVal[dateParam].slice(10).split(',')
            const counts = {}
            crtPrm.forEach(function(x) {
              counts[x] = (counts[x] || 0) + 1
            })

            if (counts.canceled === undefined) {
              chartDataValues.canceled[i] = 0
              chartDataValues.completed[i] = counts.completed
            } else if (counts.completed === undefined) {
              chartDataValues.canceled[i] = counts.canceled
              chartDataValues.completed[i] = 0
            } else {
              chartDataValues.canceled[i] = counts.canceled
              chartDataValues.completed[i] = counts.completed
            }
          } else {
            chartDataValues.canceled[i] = 0
            chartDataValues.completed[i] = 0
          }
        }

        this.chartLabels = chartLabels
        this.chartDataValues = chartDataValues
      } else if (history === 'monthly') {
        this.chartLabels = ['January', 'February', 'Maret']
        this.chartDataValues = {
          canceled: [13, 16, 15],
          completed: [12, 17, 14]
        }
      }
    }
  }
}
</script>
