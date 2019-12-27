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
                {{ this.$t('dailyAverage') }}: {{ averageRequest.allRequest }}
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
      const now = new Date()
      const todayDate =
        now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate()
      const todayDateFormat = new Date(todayDate + ' 00:00:00')

      const nowVal = new Date(now)
      const oneMonthBefore = nowVal.setMonth(nowVal.getMonth() - 1)
      const oneMonthBeforeFormat = new Date(oneMonthBefore)
      for (let i = 0; i < this.orders.length; i++) {
        const indexOrderCreatedAt = this.orders[i].createdAt
        const indexOrderStatus = this.orders[i].status

        if (indexOrderCreatedAt >= oneMonthBeforeFormat) {
          if (indexOrderStatus === 'canceled') {
            this.averageRequest.requestCanceled++
            this.averageRequest.allRequest++
          } else if (indexOrderStatus === 'delivered') {
            this.averageRequest.requestCompleted++
            this.averageRequest.allRequest++
          } else if (indexOrderStatus === 'ordered') {
            this.averageRequest.allRequest++
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
    }
  }
}
</script>
