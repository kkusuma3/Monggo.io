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
            label:
              this.$t('completed')
                .charAt(0)
                .toUpperCase() + this.$t('completed').slice(1),
            backgroundColor: '#FB8C00',
            data: this.chartDataValues.completed
          }
        ]
      }
    }
  },
  mounted() {
    this.initHistoryChart('daily')
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
        const nowVal = new Date(now)
        const oneYearBefore = nowVal.setYear(nowVal.getFullYear() - 1)
        const oneYearBeforeFormat = new Date(oneYearBefore)

        const chartLabels = []
        let orderIndex = 0
        const chartVal = []
        for (let i = 1; i <= 12; i++) {
          const oneYearBeforeVal = new Date(oneYearBeforeFormat)
          const oneMonthBefore = oneYearBeforeVal.setMonth(
            oneYearBeforeVal.getMonth() + i
          )
          const oneMonthBeforeFormat = new Date(oneMonthBefore)
          const twoYearBeforeVal = new Date(oneYearBeforeFormat)
          const twoMonthBefore = twoYearBeforeVal.setMonth(
            twoYearBeforeVal.getMonth() + (i - 1)
          )
          const twoMonthBeforeFormat = new Date(twoMonthBefore)
          const twoMonthBeforeV2 = twoMonthBeforeFormat.setDate(
            twoMonthBeforeFormat.getDate() - 1
          )
          const twoMonthBeforeV2Format = new Date(twoMonthBeforeV2)

          const oneMonthBeforeVal =
            twoMonthBeforeV2Format.getDate() +
            ' ' +
            twoMonthBeforeV2Format.toLocaleString('default', {
              month: 'short'
            }) +
            ' ' +
            twoMonthBeforeV2Format.getFullYear() +
            ' - ' +
            oneMonthBeforeFormat.getDate() +
            ' ' +
            oneMonthBeforeFormat.toLocaleString('default', { month: 'short' }) +
            ' ' +
            oneMonthBeforeFormat.getFullYear()
          chartLabels.push(oneMonthBeforeVal)

          const dateFrom = new Date(now)
          const dateFromBefore = dateFrom.setMonth(
            dateFrom.getMonth() - (i - 1)
          )
          const dateFromBeforeFormat = new Date(dateFromBefore)
          const dateTo = new Date(now)
          const dateToBefore = dateTo.setMonth(dateTo.getMonth() - i)
          const dateToBeforeFormat = new Date(dateToBefore)

          for (let iv2 = orderIndex; iv2 < this.orders.length; iv2++) {
            const indexOrderCreatedAt = this.orders[iv2].createdAt
            const indexOrderStatus = this.orders[iv2].status

            if (
              indexOrderCreatedAt <= dateFromBeforeFormat &&
              indexOrderCreatedAt > dateToBeforeFormat
            ) {
              if (indexOrderStatus === 'canceled') {
                chartVal['barIndex' + (12 - i)] += ',canceled'
              } else if (indexOrderStatus === 'delivered') {
                chartVal['barIndex' + (12 - i)] += ',completed'
              }
              orderIndex = iv2 + 1
            } else {
              iv2 = this.orders.length
            }
          }
        }

        const chartDataValues = {
          canceled: [],
          completed: []
        }
        for (let i = 0; i < 12; i++) {
          if (chartVal.hasOwnProperty('barIndex' + i)) {
            const crtPrm = chartVal['barIndex' + i].slice(10).split(',')
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
      }
    }
  }
}
</script>
