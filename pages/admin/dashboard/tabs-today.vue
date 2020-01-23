<template>
  <v-row>
    <v-col cols="12">
      <v-card class="pt-8 px-8">
        <v-row>
          <v-col cols="12" class="pt-0 align-center d-flex">
            <div class="dashboard-today-circle">
              {{ allRequest }}
            </div>
            <div class="d-inline-block ml-8">
              <h1>{{ this.$t('requsetsMadeToday') }}</h1>
              <p class="primary--text">
                {{ this.$t('dailyAverage') }}:
                {{ averageRequest.allRequest }}
              </p>
            </div>
          </v-col>
          <v-col cols="12" class="pt-0 align-center d-flex">
            <div class="dashboard-today-circle">
              {{ requestCompleted }}
            </div>
            <div class="d-inline-block ml-8">
              <h1>{{ this.$t('requsetsCompleteToday') }}</h1>
              <p class="primary--text">
                {{ this.$t('dailyAverage') }}:
                {{ averageRequest.requestCompleted }}
              </p>
            </div>
          </v-col>
          <v-col cols="12" class="pt-0 align-center d-flex">
            <div class="dashboard-today-circle">
              {{ requestCanceled }}
            </div>
            <div class="d-inline-block ml-8">
              <h1>{{ this.$t('requsetsCanceledToday') }}</h1>
              <p class="primary--text">
                {{ this.$t('dailyAverage') }}:
                {{ averageRequest.requestCanceled }}
              </p>
            </div>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'TabsToday',
  props: {
    orders: {
      type: Array,
      default: () => {}
    }
  },
  data() {
    return {
      allRequest: 0,
      requestCompleted: 0,
      requestCanceled: 0,
      averageRequest: {
        allRequest: 0,
        requestCompleted: 0,
        requestCanceled: 0
      }
    }
  },
  mounted() {
    this.initTodayTabs()
  },
  methods: {
    /**
     * Called when tab today clicked
     */
    initTodayTabs() {
      this.allRequest = 0
      this.requestCompleted = 0
      this.requestCanceled = 0

      const now = new Date()
      const todayDate =
        now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate()
      const todayDateFormat = new Date(todayDate + ' 00:00:00')

      const nowVal = new Date(now)
      const oneMonthBefore = nowVal.setMonth(nowVal.getMonth() - 1)
      const oneMonthBeforeFormat = new Date(oneMonthBefore)

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

      const averageRequest = {
        allRequest: 0,
        requestCompleted: 0,
        requestCanceled: 0
      }

      for (let i = 0; i < this.orders.length; i++) {
        const indexOrderCreatedAt = this.orders[i].createdAt
        const indexOrderStatus = this.orders[i].status
        if (indexOrderCreatedAt >= oneMonthBeforeFormat) {
          if (indexOrderStatus === 'canceled') {
            averageRequest.requestCanceled++
            averageRequest.allRequest++
          } else if (indexOrderStatus === 'delivered') {
            averageRequest.requestCompleted++
            averageRequest.allRequest++
          } else if (indexOrderStatus === 'ordered') {
            averageRequest.allRequest++
          }

          if (indexOrderCreatedAt >= todayDateFormat) {
            if (indexOrderStatus === 'canceled') {
              this.requestCanceled++
              this.allRequest++
            } else if (indexOrderStatus === 'delivered') {
              this.requestCompleted++
              this.allRequest++
            } else if (indexOrderStatus === 'ordered') {
              this.allRequest++
            }
          }
        } else {
          i = this.orders.length
        }
      }

      const requestCanceled = averageRequest.requestCanceled / dateDiff
      const requestCompleted = averageRequest.requestCompleted / dateDiff
      const allRequest = averageRequest.allRequest / dateDiff

      this.averageRequest.requestCanceled =
        requestCanceled % 1 === 0 ? requestCanceled : requestCanceled.toFixed(2)
      this.averageRequest.requestCompleted =
        requestCompleted % 1 === 0
          ? requestCompleted
          : requestCompleted.toFixed(2)
      this.averageRequest.allRequest =
        allRequest % 1 === 0 ? allRequest : allRequest.toFixed(2)
    }
  }
}
</script>
