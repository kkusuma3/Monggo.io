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
            <p class="body-2">Avg. # of Web-App Visits</p>
          </div>

          <div class="display-1 text--primary">
            12 <span class="body-2">{{ this.$t('perDayPerRoom') }}</span>
            <p class="body-2">Avg. # of Requests Made</p>
          </div>

          <div class="display-1 text--primary">
            5 <span class="body-2">{{ this.$t('perDayPerRoom') }}</span>
            <p class="body-2">Avg. # of Requests Tracked</p>
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
              <tr v-for="request in serviceRequest" :key="request.name">
                <td>{{ request.name }}</td>
                <td class="text-center">{{ request.quantity }}</td>
                <td class="text-center">{{ request.period }}</td>
                <td class="text-center">{{ request.fullfillReq }}</td>
                <td class="text-center">{{ request.reqCancelled }}</td>
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
    }
  },
  data() {
    return {
      serviceRequest: [
        {
          name: 'Extra Pillow',
          quantity: 2,
          period: '8:00pm - 10.00pm',
          fullfillReq: 60,
          reqCancelled: 20
        },
        {
          name: 'Frozen Yogurt',
          quantity: 4,
          period: '4:00pm - 6.00pm',
          fullfillReq: 30,
          reqCancelled: 5
        }
      ]
    }
  },
  mounted() {
    this.initAveragesTabs()
  },
  methods: {
    /**
     * Called when tab today clicked
     */
    initAveragesTabs() {}
  }
}
</script>
