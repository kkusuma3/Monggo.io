<template>
  <v-row>
    <v-col cols="12" md="4">
      <v-card>
        <v-card-text>
          <div class="display-1 text--primary">
            30%
            <p class="body-2">Monggo.io {{ this.$t('averageUsageRate') }}</p>
          </div>

          <div class="display-1 text--primary">
            70%
            <p class="body-2">Monggo.io {{ this.$t('maxUsageRate') }}</p>
          </div>

          <div class="display-1 text--primary">
            4%
            <p class="body-2">Monggo.io {{ this.$t('minUsageRate') }}</p>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" md="4">
      <v-card>
        <v-card-text>
          <div class="display-1 text--primary">
            30 <span class="body-2">{{ this.$t('perDayPerRoom') }}</span>
            <p class="body-2">{{ this.$t('avgWebAppVisits') }}</p>
          </div>

          <div class="display-1 text--primary">
            12 <span class="body-2">{{ this.$t('perDayPerRoom') }}</span>
            <p class="body-2">{{ this.$t('avgRequestsMade') }}</p>
          </div>

          <div class="display-1 text--primary">
            5 <span class="body-2">{{ this.$t('perDayPerRoom') }}</span>
            <p class="body-2">{{ this.$t('avgRequestsTracked') }}</p>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" md="4">
      <v-card style="height: 100%">
        <v-card-text>
          <div class="display-1 text--primary">
            50%
            <p class="body-2">{{ this.$t('usersThatChoseEnglish') }}</p>
          </div>

          <div class="display-1 text--primary">
            50%
            <p class="body-2">{{ this.$t('usersThatChoseIndonesian') }}</p>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12">
      <v-card class="px-4 py-4">
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th
                  class="text-left text--primary"
                  v-text="$t('typeRequest')"
                ></th>
                <th
                  class="text-center text--primary"
                  v-text="$t('avgQuantityRequest')"
                ></th>
                <th
                  class="text-center text--primary"
                  v-text="$t('mostFrequentTimePeriodRequested')"
                ></th>
                <th
                  class="text-center text--primary"
                  v-text="$t('avgTimeFulfillRequest')"
                ></th>
                <th
                  class="text-center text--primary"
                  v-text="$t('requestsCancelled')"
                ></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(request, index) in serviceRequest" :key="index">
                <td>{{ request.name }}</td>
                <td class="text-center">{{ request.avgQuantity }}</td>
                <td class="text-center">{{ request.period }}</td>
                <td
                  class="text-center"
                  v-text="request.fullfillReq + ' ' + $t('minutes')"
                ></td>
                <td class="text-center">{{ request.reqCancelled }}%</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'TabsAverages',
  props: {
    orders: {
      type: Array,
      default: () => {}
    },
    services: {
      type: Array,
      default: () => {}
    }
  },
  data() {
    return {}
  },
  computed: {
    serviceRequest() {
      return this.setServicesValues()
    }
  },
  mounted() {
    // this.initAveragesTabs_Block4()
  },
  methods: {
    setServicesValues() {
      const servicesVal = []
      for (let i = 0; i < this.services.length; i++) {
        servicesVal.push({
          id: i,
          uid: this.services[i].uid,
          name: this.services[i].name,
          avgQuantity: 0,
          period: '',
          fullfillReq: 0,
          reqAll: 0,
          reqCancelled: 0,
          createTime: []
        })
      }

      console.log(this.orders)

      const now = new Date()
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

      for (let i = 0; i < this.orders.length; i++) {
        const indexOrderCreatedAt = this.orders[i].createdAt
        const indexOrderStatus = this.orders[i].status
        const indexOrderService = this.orders[i].service

        if (indexOrderCreatedAt >= oneMonthBeforeFormat) {
          const serviceObj = servicesVal.find(o => o.uid === indexOrderService)

          console.log(serviceObj)
          servicesVal[serviceObj.id].avgQuantity++
          servicesVal[serviceObj.id].createTime.push(indexOrderCreatedAt)
          servicesVal[serviceObj.id].reqAll++

          if (indexOrderStatus === 'canceled') {
            servicesVal[serviceObj.id].reqCancelled++
          }
        } else {
          i = this.orders.length
        }
      }

      console.log(servicesVal)

      for (let i = 0; i < this.services.length; i++) {
        // Avg. Quantity of Request
        const avgQuantity = servicesVal[i].avgQuantity / dateDiff
        servicesVal[i].avgQuantity =
          avgQuantity % 1 === 0 ? avgQuantity : avgQuantity.toFixed(2)

        // Requests Cancelled
        const reqCancelled =
          (servicesVal[i].reqCancelled / servicesVal[i].reqAll) * 100 || 0
        servicesVal[i].reqCancelled =
          reqCancelled % 1 === 0 ? reqCancelled : reqCancelled.toFixed(2)
      }

      return servicesVal
    }
  }
}
</script>
