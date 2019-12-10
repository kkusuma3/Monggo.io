<i18n>
{
  "en-us": {
    "orderPlaced": "Your request is submitted. Check the request status on @:(order) menu",
    "noService": "No services available on this category",
    "nameAsc": "Name A-Z",
    "nameDesc": "Name Z-A",
    "priceAsc": "Least Expensive",
    "priceDesc": "Most Expensive",
    "dateDesc": "Newest",
    "dateAsc": "Oldest"
  },
  "en-uk": {
    "orderPlaced": "Your request is submitted. Check the request status on @:(order) menu",
    "noService": "No services available on this category",
    "nameAsc": "Name A-Z",
    "nameDesc": "Name Z-A",
    "priceAsc": "Least Expensive",
    "priceDesc": "Most Expensive",
    "dateDesc": "Newest",
    "dateAsc": "Oldest"
  },
  "id": {
    "orderPlaced": "Permintaan Anda telah terkirim. Periksa status pemesanan pada menu @:(order)",
    "noService": "Tidak ada layanan tersedia untuk kategori ini",
    "nameAsc": "Nama A-Z",
    "nameDesc": "Nama Z-A",
    "priceAsc": "Paling Murah",
    "priceDesc": "Paling Mahal",
    "dateDesc": "Terbaru",
    "dateAsc": "Terlama"
  },
  "cn": {
    "orderPlaced": "您的请求已发送。检查菜单上的订单状态 @:(order)",
    "noService": "没有适用于此类别的服务",
    "nameAsc": "AZ名称",
    "nameDesc": "名字叫Z-A",
    "priceAsc": "最便宜的",
    "priceDesc": "最贵的",
    "dateDesc": "最新的",
    "dateAsc": "最长的"
  },
  "ja": {
    "orderPlaced": "リクエストが送信されました。メニューで注文状況を確認する @:(order)",
    "noService": "このカテゴリで利用できるサービスはありません",
    "nameAsc": "A-Z名",
    "nameDesc": "名前Z-A",
    "priceAsc": "最も安い",
    "priceDesc": "最も高価な",
    "dateDesc": "最新の",
    "dateAsc": "最長"
  }
}
</i18n>

<template>
  <v-container id="guest-home" :class="{ 'fill-height': !isDataLoaded }">
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
          <v-select
            v-model="sortBy"
            :items="sorts"
            :label="$t('sortBy')"
            hide-details=""
            solo=""
            flat=""
            class="mb-5"
          />
          <v-card
            v-for="(service, i) in services"
            :key="service[0].uid"
            :class="{ 'mb-3': i !== services.length - 1 }"
            flat=""
          >
            <v-card-text>
              <h2 class="subtitle-1">{{ service[0].name }}</h2>
              <v-slide-group v-if="service[1].length > 0">
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
              <div v-else="">{{ $t('noService') }}</div>
            </v-card-text>
          </v-card>
          <v-dialog
            v-model="isService"
            scrollable=""
            @click:outside="onServiceClose"
          >
            <v-card v-if="service" :loading="isLoading">
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
                  :max="5"
                  :thumb-size="24"
                  label="Quantity"
                  persistent-hint=""
                  thumb-label="always"
                  ticks=""
                />
              </v-card-text>
              <v-card-text class="pa-5 pa-4">
                <v-textarea
                  v-model="note"
                  :disabled="isLoading"
                  name="note"
                  clearable=""
                  :label="$t('note')"
                  outlined=""
                  auto-grow=""
                  hide-details=""
                />
              </v-card-text>
              <v-card-actions>
                <v-btn
                  :loading="isLoading"
                  :disabled="isLoading || service.count === 0"
                  block=""
                  color="primary"
                  @click="onRequest"
                >
                  <v-icon left="">mdi-cart</v-icon>
                  <span>{{ $t('request') }}</span>
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
import uuidv4 from 'uuid/v4'
import truncate from 'truncate'
import cleanDeep from 'clean-deep'
import _flatten from 'lodash.flatten'
import { types as guestTypes } from '~/store/guest'
import { types as serviceTypes } from '~/store/service'
import { db } from '~/utils/firebase'

export default {
  head() {
    return {
      title: `${this.$t('home')} - ${this.$t('guest')}`
    }
  },
  data() {
    return {
      isService: false, // Hold service dialog
      // Hold currency symbol
      currencySymbols: {
        USD: '$',
        GBP: '£',
        IDR: 'Rp'
      },
      // Hold service count
      count: 0,
      // Hold service note
      note: null,
      sorts: [
        { text: this.$t('nameAsc'), value: 'name asc' },
        { text: this.$t('nameDesc'), value: 'name desc' },
        { text: this.$t('priceAsc'), value: 'price asc' },
        { text: this.$t('priceDesc'), value: 'price desc' },
        { text: this.$t('dateDesc'), value: 'createdAt desc' },
        { text: this.$t('dateAsc'), value: 'createdAt asc' }
      ]
    }
  },
  computed: {
    ...mapState(['isLoading', 'isDataLoaded']),
    ...mapState('service', ['services']),
    ...mapState('user', ['user']),
    ...mapState('category', ['categories']),
    ...mapGetters('user', ['isAuth']),
    ...mapState('guest', ['qr', 'service', 'rates']),
    ...mapGetters('guest', ['sortByArray']),
    sortBy: {
      get() {
        return this.$store.state.guest.sortBy
      },
      set(sortBy) {
        this.$store.commit(`guest/${guestTypes.SET_SORT_BY}`, sortBy)
      }
    },
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
          if (this.rates.length > 0) {
            if (currency === this.user.currency) {
              return `${this.currencySymbols[currency]}${newPrice}`
            }
            const rate = this.rates.find(({ base }) => base === currency)
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
  watch: {
    service(service) {
      if (service) {
        this.onTriggerService(service)
      }
    },
    sortBy(sortBy) {
      if (sortBy) {
        this.getServices()
      }
    }
  },
  methods: {
    /**
     * Called when the user click one of the service and the dialog appeared
     */
    onTriggerService(service) {
      this.isService = true
      this.$store.commit(`guest/${guestTypes.SET_SERVICE}`, service)
    },
    /**
     * Called when the user close the dialog service
     */
    onServiceClose() {
      this.isService = false
      this.count = 0
      this.$store.commit(`guest/${guestTypes.SET_SERVICE}`, null)
    },
    /**
     * Called when the user click request button,
     * it will save the user request to firestore and add it to order list
     */
    async onRequest() {
      try {
        this.$setLoading(true)
        if (this.isAuth && this.qr && this.service) {
          const date = this.$moment().toDate()
          const rates = this.rates.map(rate => ({
            ...rate,
            date: this.$moment(rate.date).toDate()
          }))
          const payload = {
            uid: uuidv4(),
            hotel: this.qr.hotel,
            room: this.qr.room,
            user: this.user.uid,
            service: this.service.uid,
            count: this.count,
            status: 'ordered',
            note: this.note,
            rates,
            createdAt: date,
            updatedAt: date
          }
          payload.hotelRef = db.collection('hotels').doc(payload.hotel)
          payload.roomRef = db.collection('rooms').doc(payload.room)
          payload.userRef = db.collection('users').doc(payload.user)
          payload.serviceRef = db.collection('services').doc(payload.service)
          await db
            .collection('orders')
            .doc(payload.uid)
            .set(
              cleanDeep(payload, {
                emptyArrays: false,
                emptyObjects: false,
                emptyStrings: false,
                nullValues: false
              }),
              { merge: true }
            )
          await db
            .collection('services')
            .doc(this.service.uid)
            .set({ count: this.service.count - this.count }, { merge: true })
          await Promise.all([this.getServices(), this.getOrders()])
          await this.onServiceClose()
          await this.$notify({
            kind: 'success',
            message: this.$t('orderPlaced')
          })
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
     * Called to get all the service available
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
                .orderBy(...this.sortByArray)
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
          const uncategorizedServices = await _flatten(
            _flatten(services).filter(i => Array.isArray(i))
          )
          await this.$store.commit(
            `service/${serviceTypes.SET_UNCATEGORIZED_SERVICES}`,
            uncategorizedServices
          )
          await this.$store.commit(
            `service/${serviceTypes.SET_SERVICES}`,
            services
          )
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
                rates: orderRef.rates.map(rate => ({
                  ...rate,
                  date: rate && rate.date && rate.date.toDate()
                })),
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
