<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card
          v-for="(service, i) in services"
          :key="service[0].uid"
          :class="{ 'mb-3': i !== services.length - 1 }"
          flat=""
        >
          <v-card-text>
            <h2 class="subtitle-1">{{ service[0].name }}</h2>
            <v-slide-group>
              <v-slide-item
                v-for="serviceItem in service[1]"
                :key="`${service[0].uid}_${serviceItem.uid}`"
              >
                <v-card
                  class="ma-3"
                  width="150"
                  ripple=""
                  @click="onTriggerService(serviceItem)"
                >
                  <app-img
                    :src="serviceItem.imagesMeta[0].url"
                    :alt="serviceItem.name"
                    :height="75"
                    :contain="false"
                  >
                    <v-row class="fill-height ma-0" justify="end">
                      <v-chip label="" small="" color="primary" class="ma-2">
                        <span class="text-uppercase">
                          {{ rate(serviceItem) }}
                        </span>
                      </v-chip>
                    </v-row>
                  </app-img>
                  <v-card-text>
                    <h3 class="subtitle-2">
                      {{ serviceItem.name }}
                    </h3>
                    <p class="mb-0">
                      {{ truncate(serviceItem.description, 20) }}
                    </p>
                  </v-card-text>
                </v-card>
              </v-slide-item>
            </v-slide-group>
          </v-card-text>
        </v-card>
        <v-dialog
          v-model="isService"
          scrollable=""
          @click:outside="onServiceClose"
        >
          <v-card v-if="service">
            <v-carousel height="200" cycle="">
              <v-carousel-item
                v-for="meta in service.imagesMeta"
                :key="meta.name"
                :src="meta.url"
              />
            </v-carousel>
            <v-card-text class="pa-5 pa-4">
              <h2 class="title">{{ service.name }}</h2>
              <div class="subtitle-1 primary--text">
                {{ rate(service, count) }}
              </div>
              <div class="subtitle-1">{{ service.description }}</div>
              <v-slider
                v-if="service"
                v-model="count"
                style="margin-top: 32px"
                :hint="`${service.count} in stocks`"
                :min="1"
                :max="service.count"
                :thumb-size="24"
                label="Quantity"
                persistent-hint=""
                thumb-label="always"
                ticks=""
              />
            </v-card-text>
            <v-card-actions>
              <v-btn block="" color="primary">{{ $t('request') }}</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import truncate from 'truncate'
import { types as guestTypes } from '~/store/guest'

export default {
  head() {
    return {
      title: `${this.$t('home')} - ${this.$t('guest')}`
    }
  },
  data() {
    return {
      isService: false,
      rates: null,
      currencySymbols: {
        USD: '$',
        GBP: '£',
        IDR: 'Rp'
      },
      count: 0
    }
  },
  computed: {
    ...mapState(['isLoading']),
    ...mapState('service', ['services']),
    ...mapState('user', ['user']),
    ...mapGetters('user', ['isAuth']),
    ...mapState('guest', ['service']),
    truncate() {
      return (str, length) => {
        if (!str) {
          return
        }
        str = str.toString()
        return truncate(str, length)
      }
    },
    rate() {
      return ({ currency, price }, count) => {
        if (!this.rates) {
          return 0
        }
        if (price === 0) {
          return this.$t('free')
        }
        let newPrice = price
        if (count) {
          newPrice = price * count
        }
        if (this.isAuth) {
          if (currency === this.user.currency) {
            return `${this.currencySymbols[currency]}${newPrice}`
          }
          const rate = this.rates.find(({ base }) => base === currency)
          if (rate) {
            return `${this.currencySymbols[this.user.currency]}${(
              newPrice * rate.rates[this.user.currency]
            ).toPrecision(4)}`
          }
          return 0
        }
        return 0
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      try {
        this.$setLoading(true)
        await this.getRates()
      } catch (error) {
        this.$notify({
          isError: true,
          message: error.message
        })
      } finally {
        this.$setLoading(false)
      }
    },
    async getRates() {
      try {
        this.$setLoading(true)
        const rates = ['USD', 'GBP', 'IDR']
        const ratesConversion = await Promise.all(
          rates.map(rate =>
            this.$http.$get(
              `https://api.exchangeratesapi.io/latest?base=${rate}&symbols=${rates
                .filter(r => r !== rate)
                .join(',')}`
            )
          )
        )
        this.rates = ratesConversion
      } catch (error) {
        this.$notify({
          isError: true,
          message: error.message
        })
      } finally {
        this.$setLoading(false)
      }
    },
    onTriggerService(service) {
      this.isService = true
      this.$store.commit(`guest/${guestTypes.SET_SERVICE}`, service)
    },
    onServiceClose() {
      this.$store.commit(`guest/${guestTypes.SET_SERVICE}`, null)
    }
  }
}
</script>
