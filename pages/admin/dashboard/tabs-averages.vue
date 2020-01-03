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
                <td class="text-center" v-html="request.period"></td>
                <td class="text-center" v-text="request.fullfillReq"></td>
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
    return {
      serviceRequest: []
    }
  },
  mounted() {
    this.setServicesValues()
  },
  methods: {
    // Load card services average
    setServicesValues() {
      const servicesVal = []
      for (let i = 0; i < this.services.length; i++) {
        servicesVal.push({
          id: i,
          uid: this.services[i].uid,
          name: this.services[i].name,
          avgQuantity: 0,
          period: '-',
          fullfillReq: '-',
          reqAll: 0,
          reqCancelled: 0,
          reqTime: [],
          fulFillTimes: []
        })
      }

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
        const indexOrderUpdatedAt = this.orders[i].updatedAt
        const orderCreatedAtTime = new Date(indexOrderCreatedAt)
        const orderUpdateAtTime = new Date(indexOrderUpdatedAt)

        const indexOrderStatus = this.orders[i].status
        const indexOrderService = this.orders[i].service

        if (indexOrderCreatedAt >= oneMonthBeforeFormat) {
          const serviceObj = servicesVal.find(o => o.uid === indexOrderService)

          if (serviceObj !== undefined) {
            servicesVal[serviceObj.id].avgQuantity++
            servicesVal[serviceObj.id].reqAll++

            const reqCreate =
              orderCreatedAtTime.getHours() +
              '' +
              orderCreatedAtTime.getMinutes()

            if (+reqCreate >= 0 && +reqCreate < 1200) {
              if (+reqCreate >= 0 && +reqCreate < 400) {
                if (+reqCreate >= 0 && +reqCreate < 200) {
                  servicesVal[serviceObj.id].reqTime.push('t0002')
                } else if (+reqCreate >= 200 && +reqCreate < 400) {
                  servicesVal[serviceObj.id].reqTime.push('t0204')
                }
              } else if (+reqCreate >= 400 && +reqCreate < 800) {
                if (+reqCreate >= 400 && +reqCreate < 600) {
                  servicesVal[serviceObj.id].reqTime.push('t0406')
                } else if (+reqCreate >= 600 && +reqCreate < 800) {
                  servicesVal[serviceObj.id].reqTime.push('t0608')
                }
              } else if (+reqCreate >= 800 && +reqCreate < 1200) {
                if (+reqCreate >= 800 && +reqCreate < 1000) {
                  servicesVal[serviceObj.id].reqTime.push('t0810')
                } else if (+reqCreate >= 1000 && +reqCreate < 1200) {
                  servicesVal[serviceObj.id].reqTime.push('t1012')
                }
              }
            } else if (+reqCreate >= 1200 && +reqCreate < 2400) {
              if (+reqCreate >= 1200 && +reqCreate < 1600) {
                if (+reqCreate >= 1200 && +reqCreate < 1400) {
                  servicesVal[serviceObj.id].reqTime.push('t1214')
                } else if (+reqCreate >= 1400 && +reqCreate < 1600) {
                  servicesVal[serviceObj.id].reqTime.push('t1416')
                }
              } else if (+reqCreate >= 1600 && +reqCreate < 2000) {
                if (+reqCreate >= 1600 && +reqCreate < 1800) {
                  servicesVal[serviceObj.id].reqTime.push('t1618')
                } else if (+reqCreate >= 1800 && +reqCreate < 2000) {
                  servicesVal[serviceObj.id].reqTime.push('t1820')
                }
              } else if (+reqCreate >= 2000 && +reqCreate < 2400) {
                if (+reqCreate >= 2000 && +reqCreate < 2200) {
                  servicesVal[serviceObj.id].reqTime.push('t2022')
                } else if (+reqCreate >= 2200 && +reqCreate < 2400) {
                  servicesVal[serviceObj.id].reqTime.push('t2224')
                }
              }
            }

            if (indexOrderStatus === 'delivered') {
              const fulFillTime = Math.round(
                (orderUpdateAtTime.getTime() - orderCreatedAtTime.getTime()) /
                  (1000 * 60)
              )

              servicesVal[serviceObj.id].fulFillTimes.push(fulFillTime)
            } else if (indexOrderStatus === 'canceled') {
              servicesVal[serviceObj.id].reqCancelled++
            }
          }
        } else {
          i = this.orders.length
        }
      }

      for (let i = 0; i < this.services.length; i++) {
        // Avg. Quantity of Request
        const avgQuantity = servicesVal[i].avgQuantity / dateDiff
        servicesVal[i].avgQuantity =
          avgQuantity % 1 === 0 ? avgQuantity : avgQuantity.toFixed(2)

        // Most Frequent Time Period Requested
        const countReqTime = {}
        servicesVal[i].reqTime.forEach(function(x) {
          countReqTime[x] = (countReqTime[x] || 0) + 1
        })
        const reqTime = Object.keys(countReqTime).map(key => ({
          time: key,
          count: countReqTime[key]
        }))

        if (reqTime.length > 0) {
          const reMapReqTime = []
          for (let ii = 0; ii < reqTime.length; ii++) {
            const timeReq = reqTime[ii].time.toString().replace(/t/g, '')

            if (reMapReqTime.hasOwnProperty(reqTime[ii].count)) {
              reMapReqTime[reqTime[ii].count].push(
                timeReq.slice(0, 2) + ':00 - ' + timeReq.slice(2, 4) + ':00'
              )
            } else if (reqTime.lastIndexOf(reqTime[ii].count) !== ii) {
              reMapReqTime[reqTime[ii].count] = [
                timeReq.slice(0, 2) + ':00 - ' + timeReq.slice(2, 4) + ':00'
              ]
            }
          }

          servicesVal[i].period = reMapReqTime[reMapReqTime.length - 1]
            .toString()
            .replace(/,/g, '<br>')
        }

        // Fullfill Requests
        if (servicesVal[i].fulFillTimes.length !== 0) {
          servicesVal[i].fullfillReq =
            servicesVal[i].fulFillTimes.reduce((pv, cv) => pv + cv, 0) /
              servicesVal[i].fulFillTimes.length +
            ' ' +
            this.$t('minutes')
        } else {
          servicesVal[i].fullfillReq = '-'
        }

        // Requests Cancelled
        const reqCancelled =
          (servicesVal[i].reqCancelled / servicesVal[i].reqAll) * 100 || 0
        servicesVal[i].reqCancelled =
          reqCancelled % 1 === 0 ? reqCancelled : reqCancelled.toFixed(2)
      }

      this.serviceRequest = servicesVal
    }
  }
}
</script>
