<i18n>
{
  "en-us": {
    "orderEmpty": "You still don't have any order yet. You can order our service through home page.",
    "cancelConfirmationWarn": "Are you sure you want to cancel this order?",
    "cancelationSuccess": "Order cancelation success"
  },
  "en-uk": {
    "orderEmpty": "You still don't have any order yet. You can order our service through home page.",
    "cancelConfirmationWarn": "Are you sure you want to cancel this order?",
    "cancelationSuccess": "Order cancelation success"
  },
  "id": {
    "orderEmpty": "Anda masih belum memiliki pesanan. Anda dapat memesan layanan kami melalui halaman beranda.",
    "cancelConfirmationWarn": "Apakah Anda yakin ingin membatalkan pesanan ini?",
    "cancelationSuccess": "Pembatalan pesanan sukses"
  }
}
</i18n>

<template>
  <v-container id="guest-order" :class="{ 'fill-height': !isDataLoaded }">
    <v-fade-transition mode="out-in" hide-on-leave="">
      <v-row
        v-if="!isDataLoaded"
        class="fill-height ma-0"
        align="center"
        justify="center"
      >
        <v-progress-circular indeterminate="" color="grey lighten-1" />
      </v-row>
      <v-row v-else="">
        <v-col cols="12">
          <div class="d-flex justify-end">
            <v-tooltip bottom="">
              <template #activator="{ on }">
                <v-btn
                  :disabled="isLoading"
                  :loading="isLoading"
                  color="primary"
                  class="mb-5"
                  v-on="on"
                  @click="getOrders"
                >
                  <v-icon>mdi-cached</v-icon>
                </v-btn>
              </template>
              <span>{{ $t('refresh') }}</span>
            </v-tooltip>
          </div>
          <v-fade-transition mode="out-in" group="">
            <v-alert
              v-if="orders && orders.length === 0"
              key="order-alert"
              type="info"
              prominent=""
            >
              <p>{{ $t('orderEmpty') }}</p>
              <v-btn
                light=""
                nuxt=""
                exact=""
                :to="localePath({ name: 'guest' })"
              >
                {{ $t('home') }}
              </v-btn>
            </v-alert>
            <v-card
              v-for="(order, i) in orders"
              v-else=""
              :key="order.uid"
              :class="{ 'mb-5': i !== orders.length - 1 }"
            >
              <div class="d-flex">
                <app-img
                  :src="order.refData.service.imagesMeta[0].url"
                  :alt="order.refData.service.imagesMeta[0].name"
                  :contain="false"
                  width="100"
                >
                  <v-row class="fill-height ma-0" justify="end">
                    <v-chip label="" small="" color="primary" class="ma-2">
                      <span class="text-uppercase">
                        {{
                          rate(order.refData.service, order.rates, order.count)
                        }}
                      </span>
                    </v-chip>
                  </v-row>
                </app-img>
                <v-card-text>
                  <h3 class="subtitle-1">
                    {{ order.count }}x {{ order.refData.service.name }}
                  </h3>
                  <div class="mb-2">
                    <time :datetime="order.createdAt" class="caption">
                      {{ $moment(order.createdAt).format('llll') }}
                    </time>
                  </div>
                  <div>
                    <v-chip
                      label=""
                      :color="getStatusColor(order.status)"
                      text-color="white"
                      small=""
                    >
                      <v-avatar left>
                        <v-icon small="">
                          {{ getStatusIcon(order.status) }}
                        </v-icon>
                      </v-avatar>
                      <span>
                        {{ $t(order.status) }}
                      </span>
                    </v-chip>
                  </div>
                </v-card-text>
              </div>
              <v-card-actions>
                <v-btn
                  :disabled="isLoading || order.status !== 'ordered'"
                  :loading="isLoading"
                  block=""
                  depressed=""
                  small=""
                  color="error"
                  @click="triggerCancel(order)"
                >
                  <v-icon left="" small="">mdi-cancel</v-icon>
                  <span>{{ $t('cancel') }}</span>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-fade-transition>
          <v-dialog
            :value="isCancelling"
            scrollable=""
            width="500"
            @click:outside="onCancelCanceled"
          >
            <v-card :loading="isLoading">
              <v-card-text style="padding: 24px 20px">
                <div class="subtitle-2">
                  {{ $t('cancelConfirmationWarn') }}
                </div>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn
                  :loading="isLoading"
                  :disabled="isLoading"
                  color="secondary"
                  @click="onCancelCanceled"
                >
                  <v-icon left="">mdi-cancel</v-icon>
                  <span>{{ $t('cancel') }}</span>
                </v-btn>
                <v-btn
                  :loading="isLoading"
                  :disabled="isLoading"
                  depressed=""
                  @click="onCancelAction"
                >
                  <v-icon left="">mdi-check</v-icon>
                  <span>{{ $t('yes') }}</span>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
      </v-row>
    </v-fade-transition>
  </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import _cloneDeep from 'lodash.clonedeep'
import _flatten from 'lodash.flatten'
import { db } from '~/utils/firebase'
import { types as guestTypes } from '~/store/guest'
import { types as serviceTypes } from '~/store/service'

export default {
  head() {
    return {
      title: `${this.$t('order')} - ${this.$t('guest')}`
    }
  },
  data() {
    return {
      isCancelling: false, // Hold cancellation dialog status
      // Hold order data
      item: {
        uid: null,
        hotel: null,
        room: null,
        user: null,
        service: null,
        count: null,
        status: null,
        rates: [],
        createdAt: null,
        updatedAt: null
      },
      // Hold currency symbol
      currencySymbols: {
        USD: 'Rp', // '$',
        GBP: 'RP', // '£',
        IDR: 'Rp'
      },
      // Hold interval id
      interval: null
    }
  },
  computed: {
    ...mapState(['isLoading', 'isDataLoaded']),
    ...mapState('user', ['user']),
    ...mapState('category', ['categories']),
    ...mapState('guest', ['qr', 'orders']),
    ...mapGetters('user', ['isAuth']),
    getStatusColor() {
      return string => {
        if (!string) {
          return
        }
        string.toString()
        switch (string) {
          case 'ordered':
            return 'info'
          case 'processed':
            return 'warning'
          case 'delivered':
            return 'success'
          case 'canceled':
            return 'error'
          default:
            return ''
        }
      }
    },
    getStatusIcon() {
      return string => {
        if (!string) {
          return
        }
        string.toString()
        switch (string) {
          case 'ordered':
            return 'mdi-basket-fill'
          case 'processed':
            return 'mdi-cached'
          case 'delivered':
            return 'mdi-check'
          case 'canceled':
            return 'mdi-cancel'
          default:
            return ''
        }
      }
    },
    getStatusText() {
      return string => {
        if (!string) {
          return
        }
        string.toString()
        return `${string.charAt(0).toUpperCase()}${string
          .slice(1)
          .toLowerCase()}`
      }
    },
    rate() {
      return ({ currency, price }, rates, count) => {
        if (!rates) {
          return `${this.currencySymbols[currency]}0`
        }
        if (price === 0) {
          return this.$t('free')
        }
        let newPrice = price
        if (count) {
          newPrice = price * count
        }
        if (this.isAuth) {
          if (rates.length > 0) {
            if (currency === this.user.currency) {
              return `${this.currencySymbols[currency]}${newPrice}`
            }
            const rate = rates.find(({ base }) => base === currency)
            if (rate) {
              return `${this.currencySymbols[this.user.currency]}${(
                newPrice * rate.rates[this.user.currency] || 1
              ).toPrecision(4)}`
            }
            return `${this.currencySymbols[currency]}0`
          }
          return `${this.currencySymbols[currency]}0`
        }
        return `${this.currencySymbols[currency]}0`
      }
    }
  },
  mounted() {
    this.interval = setInterval(() => {
      this.getOrders()
    }, 60 * 1000)
  },
  beforeDestroy() {
    clearInterval(this.interval)
  },
  methods: {
    /**
     * Called to trigger order cancellation process
     */
    triggerCancel(item) {
      this.isCancelling = true
      this.item = _cloneDeep(item)
    },
    /**
     * Called to cancel order cancellation process
     */
    onCancelCanceled() {
      this.isCancelling = false
      this.item = {
        uid: null,
        hotel: null,
        room: null,
        user: null,
        service: null,
        count: null,
        status: null,
        createdAt: null,
        updatedAt: null
      }
    },
    /**
     * Called when the user confirm cancellation process
     */
    async onCancelAction() {
      try {
        this.$setLoading(true)
        await db
          .collection('orders')
          .doc(this.item.uid)
          .set({ status: 'canceled' }, { merge: true })
        await db
          .collection('services')
          .doc(this.item.service)
          .set(
            { count: this.item.refData.service.count + this.item.count },
            { merge: true }
          )
        await Promise.all([this.getServices(), this.getOrders()])
        await this.onCancelCanceled()
        await this.$notify({
          kind: 'success',
          message: this.$t('cancelationSuccess')
        })
      } catch (error) {
        this.$notify({
          isError: true,
          message: error.message
        })
      } finally {
        this.$setLoading(false)
      }
    },
    /**
     * Called to get all the services available
     */
    async getServices() {
      try {
        this.$setLoading(true)
        if (this.qr && this.qr.hotel && this.categories.length > 0) {
          const services = await Promise.all(
            this.categories.map(async category => {
              const serviceSnap = await db
                .collection('services')
                .where('hotel', '==', this.qr.hotel)
                .where('category', '==', category.uid)
                .orderBy('createdAt', 'desc')
                .get()
              const _services = await Promise.all(
                serviceSnap.docs.map(service => {
                  let serviceRef = service.data()
                  delete serviceRef.hotelRef
                  delete serviceRef.categoryRef
                  serviceRef = {
                    ...serviceRef,
                    imagesMeta: serviceRef.imagesMeta.map(meta => ({
                      ...meta,
                      createdAt:
                        meta && meta.createdAt && meta.createdAt.toDate()
                    })),
                    createdAt:
                      serviceRef &&
                      serviceRef.createdAt &&
                      serviceRef.createdAt.toDate(),
                    updatedAt:
                      serviceRef &&
                      serviceRef.updatedAt &&
                      serviceRef.updatedAt.toDate()
                  }
                  return serviceRef
                })
              )
              return [category, _services]
            })
          )
          const uncategorizedServices = _flatten(
            _flatten(services).filter(i => Array.isArray(i))
          )
          this.$store.commit(
            `service/${serviceTypes.SET_UNCATEGORIZED_SERVICES}`,
            uncategorizedServices
          )
          this.$store.commit(`service/${serviceTypes.SET_SERVICES}`, services)
        }
      } catch (error) {
        this.$notify({
          isError: true,
          message: error.message
        })
      } finally {
        this.$setLoading(false)
      }
    },
    /**
     * Called to get all the current user' order
     */
    async getOrders() {
      try {
        this.$setLoading(true)
        if (
          this.user &&
          this.user.uid &&
          this.qr &&
          this.qr.hotel &&
          this.qr.room
        ) {
          const ordersSnap = await db
            .collection('orders')
            .where('hotel', '==', this.qr.hotel)
            .where('room', '==', this.qr.room)
            .where('user', '==', this.user.uid)
            .orderBy('createdAt', 'desc')
            .get()
          const orders = await Promise.all(
            ordersSnap.docs.map(async order => {
              let orderRef = order.data()
              const serviceSnap = await orderRef.serviceRef.get()
              let serviceRef = serviceSnap.data()
              serviceRef = {
                ...serviceRef,
                imagesMeta: serviceRef.imagesMeta.map(meta => ({
                  ...meta,
                  createdAt: meta && meta.createdAt && meta.createdAt.toDate()
                })),
                createdAt:
                  serviceRef &&
                  serviceRef.createdAt &&
                  serviceRef.createdAt.toDate(),
                updatedAt:
                  serviceRef &&
                  serviceRef.updatedAt &&
                  serviceRef.updatedAt.toDate()
              }
              delete serviceRef.hotelRef
              delete serviceRef.categoryRef
              orderRef = {
                ...orderRef,
                refData: {
                  service: serviceRef
                },
                createdAt:
                  orderRef && orderRef.createdAt && orderRef.createdAt.toDate(),
                updatedAt:
                  orderRef && orderRef.updatedAt && orderRef.updatedAt.toDate()
              }
              delete orderRef.hotelRef
              delete orderRef.roomRef
              delete orderRef.userRef
              delete orderRef.serviceRef
              return orderRef
            })
          )
          await this.$store.commit(`guest/${guestTypes.SET_ORDERS}`, orders)
        }
      } catch (error) {
        this.$notify({
          isError: true,
          message: error.message
        })
      } finally {
        this.$setLoading(false)
      }
    }
  }
}
</script>
