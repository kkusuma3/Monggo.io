<i18n>
{
  "en-us": {
    "searchService": "@:(service) @:(search)",
    "hotelInfo": "@:(hotel) Information",
    "wifiName": "@:(wifi) @:(name)",
    "wifiPass": "@:(wifi) @:(password)",
    "wifiNameCopied": "@:(wifiName) has copied",
    "wifiPassCopied": "@:(wifiPass) has copied"
  },
  "en-uk": {
    "searchService": "@:(service) @:(search)",
    "hotelInfo": "@:(hotel) Information",
    "wifiName": "@:(wifi) @:(name)",
    "wifiPass": "@:(wifi) @:(password)",
    "wifiNameCopied": "@:(wifiName) has copied",
    "wifiPassCopied": "@:(wifiPass) has copied"
  },
  "id": {
    "searchService": "@:(search) @:(service)",
    "hotelInfo": "Informasi @:(hotel)",
    "wifiName": "@:(name) @:(wifi)",
    "wifiPass": "@:(password) @:(wifi)",
    "wifiNameCopied": "@:(wifiName) telah disalin",
    "wifiPassCopied": "@:(wifiPass) telah disalin"
  }
}
</i18n>

<template>
  <v-app v-scroll="onScroll">
    <v-app-bar
      v-if="$route.name.includes('guest') && qr"
      app=""
      fixed=""
      dark=""
      :shrink-on-scroll="
        !($route.name.includes('order') || $route.name.includes('account'))
      "
      :elevate-on-scroll="
        !($route.name.includes('order') || $route.name.includes('account'))
      "
      :src="qr.refData.hotel.imagesMeta[0].url"
      color="primary"
    >
      <template #img="{ props }">
        <app-img
          v-bind="props"
          :contain="false"
          :alt="qr.refData.hotel.name"
          gradient="to top right, rgba(17, 54, 142, .3), rgba(247, 63, 82, .7)"
        />
      </template>
      <template
        v-if="
          !($route.name.includes('order') || $route.name.includes('account'))
        "
      >
        <v-fade-transition mode="in-out">
          <v-toolbar-title v-if="!isSearch" class="mr-3 text-center">
            <h1 aria-label="Monggo.IO">
              <app-img
                src="/icon.png"
                class="mx-auto"
                alt="Monggo.IO"
                :width="isScrolled ? 24 : 48"
                :height="isScrolled ? 24 : 48"
              />
            </h1>
            <h2 v-if="!isScrolled" class="title">
              {{ qr.refData.hotel.name }}
            </h2>
            <h3 v-if="!isScrolled" class="subtitle-2">
              {{ qr.refData.room.name }}
            </h3>
          </v-toolbar-title>
        </v-fade-transition>
      </template>
      <template v-else="">
        <v-toolbar-title class="mr-3 text-center">
          <h1 aria-label="Monggo.IO">
            <app-img
              src="/icon.png"
              class="mx-auto"
              alt="Monggo.IO"
              width="24"
              height="24"
            />
          </h1>
        </v-toolbar-title>
      </template>
      <v-spacer />
      <template
        v-if="
          !($route.name.includes('order') || $route.name.includes('account'))
        "
      >
        <v-fade-transition mode="out-in">
          <v-tooltip v-if="!isSearch" key="button-search" bottom="">
            <template #activator="{ on }">
              <v-btn icon="" v-on="on" @click="isSearch = !isSearch">
                <v-icon>mdi-magnify</v-icon>
              </v-btn>
            </template>
            <span>{{ $t('search') }}</span>
          </v-tooltip>
          <v-autocomplete
            v-else=""
            key="input-search"
            v-model="service"
            :items="uncategorizedServices"
            :loading="isLoading"
            :label="$t('searchService')"
            hide-details=""
            item-text="name"
            return-object=""
            light=""
            solo=""
            flat=""
            prepend-inner-icon="mdi-magnify"
            clearable=""
            autofocus=""
            @blur="isSearch = !isSearch"
          >
            <template #item="{ item }">
              <v-list-item-avatar>
                <v-avatar :color="getMaterialColor(item.name)" class="ma-1">
                  <app-img
                    v-if="item.imagesMeta && item.imagesMeta.length > 0"
                    :src="item.imagesMeta[0].url"
                    :alt="item.imagesMeta[0].name"
                  />
                  <span
                    v-else=""
                    :class="{
                      'white--text': isDarkColor(
                        getMaterialColor(item.name, true)
                      )
                    }"
                  >
                    {{ getInitials(item.name) }}
                  </span>
                </v-avatar>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ item.name }}</v-list-item-title>
              </v-list-item-content>
            </template>
          </v-autocomplete>
        </v-fade-transition>
      </template>
      <v-dialog v-model="isHotelInfo" scrollable="" width="500">
        <template #activator="{ on: dialog }">
          <v-tooltip bottom="">
            <template #activator="{ on: tooltip }">
              <v-btn icon="" v-on="{ ...dialog, ...tooltip }">
                <v-icon>mdi-information-outline</v-icon>
              </v-btn>
            </template>
            <span>{{ $t('hotelInfo') }}</span>
          </v-tooltip>
        </template>
        <v-card v-if="qr">
          <v-carousel height="200" cycle="">
            <v-carousel-item
              v-for="meta in qr.refData.hotel.imagesMeta"
              :key="meta.name"
            >
              <app-img :src="meta.url" :alt="meta.name" />
            </v-carousel-item>
          </v-carousel>
          <v-card-text class="pa-5 pa-4">
            <h2 class="headline">{{ qr.refData.hotel.name }}</h2>
            <div class="subtitle-1">{{ qr.refData.hotel.description }}</div>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-dialog
              v-if="qr.refData.hotel.wifiName && qr.refData.hotel.wifiPass"
              v-model="isWifi"
              width="500"
            >
              <template #activator="{ on }">
                <v-btn color="primary" v-on="on">
                  <v-icon left="">mdi-wifi</v-icon>
                  <span>{{ $t('wifi') }}</span>
                </v-btn>
              </template>
              <v-card>
                <v-card-text class="pa-5 pa-4">
                  <v-text-field
                    v-model="qr.refData.hotel.wifiName"
                    readonly=""
                    :label="$t('wifiName')"
                    outlined=""
                    hide-details=""
                    append-outer-icon="mdi-content-copy"
                    class="mb-5"
                    @click:append-outer="onCopyWifiName"
                  />
                  <v-text-field
                    v-model="qr.refData.hotel.wifiPass"
                    readonly=""
                    :label="$t('wifiPass')"
                    outlined=""
                    hide-details=""
                    append-outer-icon="mdi-content-copy"
                    @click:append-outer="onCopyWifiPass"
                  />
                </v-card-text>
              </v-card>
            </v-dialog>
            <v-btn
              v-if="
                qr.refData.hotel.callingCodes &&
                  qr.refData.hotel.callingCodes.length > 0 &&
                  qr.refData.hotel.phone
              "
              color="primary"
              :href="
                `tel:${qr.refData.hotel.callingCodes[0]}${
                  qr.refData.hotel.phone
                }`
              "
            >
              <v-icon left="">mdi-phone</v-icon>
              <span>{{ $t('call') }}</span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-tooltip bottom="">
        <template #activator="{ on }">
          <v-btn icon="" v-on="on" @click="onCheckout">
            <v-icon>mdi-logout-variant</v-icon>
          </v-btn>
        </template>
        <span>{{ $t('checkout') }}</span>
      </v-tooltip>
    </v-app-bar>
    <v-content>
      <nuxt />
      <app-notification />
    </v-content>
    <v-bottom-navigation
      v-if="$route.name.includes('guest')"
      app=""
      grow=""
      class="primary"
      dark=""
    >
      <v-btn
        color="primary"
        nuxt=""
        exact=""
        :to="localePath({ name: 'guest-order' })"
      >
        <span>{{ $t('order') }}</span>
        <v-icon>mdi-clipboard-check</v-icon>
      </v-btn>
      <v-btn
        color="primary"
        nuxt=""
        exact=""
        :to="localePath({ name: 'guest' })"
      >
        <span>{{ $t('home') }}</span>
        <v-icon>mdi-view-dashboard</v-icon>
      </v-btn>
      <v-btn
        color="primary"
        nuxt=""
        exact=""
        :to="localePath({ name: 'guest-account' })"
      >
        <span>{{ $t('account') }}</span>
        <v-icon>mdi-account</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script>
import _cloneDeep from 'lodash.clonedeep'
import { mapGetters, mapState } from 'vuex'
import uuidv4 from 'uuid/v4'
import isDarkColor from 'is-dark-color'
import materialColorHash from 'material-color-hash'
import initials from 'initials'
import _flatten from 'lodash.flatten'
import { auth, db } from '~/utils/firebase'
import { types as userTypes } from '~/store/user'
import { types as guestTypes } from '~/store/guest'
import { types as categoryTypes } from '~/store/category'
import { types as serviceTypes } from '~/store/service'
import AppNotification from '~/components/AppNotification'

export default {
  components: {
    AppNotification
  },
  data() {
    return {
      isSearch: false,
      currentScroll: 0,
      isHotelInfo: false,
      isWifi: false
    }
  },
  computed: {
    ...mapState(['isLoading']),
    ...mapState('guest', ['qr', 'uid']),
    ...mapState('user', ['user']),
    ...mapGetters('user', ['role', 'isAuth']),
    ...mapState('category', ['categories']),
    ...mapState('service', ['uncategorizedServices']),
    isScrolled() {
      return this.currentScroll > 0
    },
    isDarkColor() {
      return color => {
        if (!color) {
          return
        }
        color = color.toString()
        return isDarkColor(color)
      }
    },
    getMaterialColor() {
      return (string, isCode = false) => {
        if (!string) {
          return
        }
        string = string.toString()
        const { backgroundColor, materialColorName } = materialColorHash(string)
        return isCode ? backgroundColor : materialColorName.toLowerCase()
      }
    },
    getInitials() {
      return string => {
        if (!string) {
          return
        }
        string = string.toString()
        return initials(string)
      }
    },
    service: {
      get() {
        return this.$store.state.guest.service
      },
      set(service) {
        this.$store.commit(`guest/${guestTypes.SET_SERVICE}`, service)
      }
    }
  },
  watch: {
    uid(uid) {
      if (uid) {
        this.setQr(uid)
      }
    },
    async qr(qr) {
      if (qr && this.isAuth) {
        this.$setDataLoaded(false)
        await Promise.all([this.getCategories(), this.getRates()])
        await this.setRoom(qr.room)
        await Promise.all([
          this.getServices(qr.hotel),
          this.getOrders(qr.hotel)
        ])
        await this.$setDataLoaded(true)
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
        await this.initLocale()
        await this.onAuthStateChanged()
        await this.initUid()
      } catch (error) {
        this.$notify({
          isError: true,
          message: error.message
        })
      } finally {
        this.$setLoading(false)
      }
    },
    async getCategories() {
      try {
        this.$setLoading(true)
        const categoriesSnap = await db
          .collection('categories')
          .orderBy('createdAt', 'desc')
          .get()
        const categories = await Promise.all(
          categoriesSnap.docs.map(category => {
            const categoryRef = category.data()
            return {
              ...categoryRef,
              createdAt:
                categoryRef &&
                categoryRef.createdAt &&
                categoryRef.createdAt.toDate(),
              updatedAt:
                categoryRef &&
                categoryRef.updatedAt &&
                categoryRef.updatedAt.toDate()
            }
          })
        )
        await this.$store.commit(
          `category/${categoryTypes.SET_CATEGORIES}`,
          categories
        )
      } catch (error) {
        this.$notify({
          isError: true,
          message: error.message
        })
      } finally {
        this.$setLoading(false)
      }
    },
    async getServices(hotel) {
      try {
        this.$setLoading(true)
        if (hotel && this.categories.length > 0) {
          const services = await Promise.all(
            this.categories.map(async category => {
              const serviceSnap = await db
                .collection('services')
                .where('hotel', '==', hotel)
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
    async getOrders(hotel) {
      try {
        this.$setLoading(true)
        if (this.user && this.user.uid && this.qr && hotel && this.qr.room) {
          const ordersSnap = await db
            .collection('orders')
            .where('hotel', '==', hotel)
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
        this.$store.commit(`guest/${guestTypes.SET_RATES}`, ratesConversion)
      } catch (error) {
        this.$notify({
          isError: true,
          message: error.message
        })
      } finally {
        this.$setLoading(false)
      }
    },
    initUid() {
      const uid = this.$cookies.get('qr')
      if (uid) {
        this.$store.commit(`guest/${guestTypes.SET_UID}`, uid)
        this.$router.replace(this.localePath({ name: 'guest' }))
      } else {
        this.$router.replace(this.localePath({ name: 'index' }))
      }
    },
    initLocale() {
      const currLocale = this.$cookies.get('i18n_redirected')
      if (!currLocale) {
        this.$cookies.set('i18n_redirected', this.$i18n.locale)
      } else {
        this.$router.push(this.switchLocalePath(currLocale))
      }
    },
    async setRoom(room, uid = this.user && this.user.uid) {
      if (room && uid) {
        try {
          this.$setLoading(true)
          await db
            .collection('rooms')
            .doc(room)
            .set(
              {
                status: 'reserved',
                user: uid,
                userRef: db.collection('users').doc(uid)
              },
              { merge: true }
            )
        } catch (error) {
          this.$notify({
            isError: true,
            message: error.message
          })
        } finally {
          this.$setLoading(false)
        }
      }
    },
    async setQr(uid) {
      try {
        this.$setLoading(true)
        const qrDoc = await db
          .collection('qr-codes')
          .doc(uid)
          .get()
        let qrRef = qrDoc.data()
        if (
          qrRef &&
          qrRef.room &&
          qrRef.hotel &&
          qrRef.hotelRef &&
          qrRef.roomRef
        ) {
          await this.setRoom(qrRef.room)
          if (qrRef.hotelRef && qrRef.roomRef) {
            const [hotelRefDoc, roomRefDoc] = await Promise.all([
              qrRef.hotelRef.get(),
              qrRef.roomRef.get()
            ])
            let [hotelRef, roomRef] = await Promise.all([
              hotelRefDoc.data(),
              roomRefDoc.data()
            ])
            await (() => {
              hotelRef = {
                ...hotelRef,
                imagesMeta: hotelRef.imagesMeta.map(meta => ({
                  ...meta,
                  createdAt: meta && meta.createdAt && meta.createdAt.toDate()
                })),
                createdAt:
                  hotelRef && hotelRef.createdAt && hotelRef.createdAt.toDate(),
                updatedAt:
                  hotelRef && hotelRef.updatedAt && hotelRef.updatedAt.toDate()
              }
              roomRef = {
                ...roomRef,
                imagesMeta: roomRef.imagesMeta.map(meta => ({
                  ...meta,
                  createdAt: meta && meta.createdAt && meta.createdAt.toDate()
                })),
                createdAt:
                  roomRef && roomRef.createdAt && roomRef.createdAt.toDate(),
                updatedAt:
                  roomRef && roomRef.updatedAt && roomRef.updatedAt.toDate()
              }
              delete roomRef.hotelRef
              qrRef = {
                ...qrRef,
                refData: {
                  hotel: hotelRef,
                  room: roomRef
                },
                createdAt: qrRef && qrRef.createdAt && qrRef.createdAt.toDate(),
                updatedAt: qrRef && qrRef.updatedAt && qrRef.updatedAt.toDate()
              }
              delete qrRef.hotelRef
              delete qrRef.roomRef

              const payload = _cloneDeep(qrRef)
              this.$store.commit(`guest/${guestTypes.SET_QR}`, payload)
            })()
          }
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
    onAuthStateChanged() {
      auth.onAuthStateChanged(async user => {
        if (user === null) {
          this.$cookies.remove('qr')
          this.$router.replace(this.localePath({ name: 'index' }))
          return
        }
        try {
          this.$setLoading(true)
          const userSnap = await db
            .collection('users')
            .doc(user.uid)
            .get()
          const existingUser = userSnap.data()
          if (
            existingUser &&
            (existingUser.role === 'admin' || existingUser.role === 'operator')
          ) {
            await auth.signOut()
          } else {
            let userDoc = await db
              .collection('users')
              .doc(user.uid)
              .get()
            if (!userDoc.exists || !user.isAnonymous) {
              const payload = {
                uid: user.uid,
                name: `User ${uuidv4().split('-')[4]}`,
                email: user.email,
                phone: user.phoneNumber,
                currency: 'USD',
                avatar: user.photoURL,
                isAnonymous: user.isAnonymous,
                role: 'guest',
                createdAt: this.$moment().toDate(),
                updatedAt: this.$moment().toDate()
              }
              await db
                .collection('users')
                .doc(user.uid)
                .set(payload, { merge: true })
              userDoc = await db
                .collection('users')
                .doc(user.uid)
                .get()
            }
            await (() => {
              let userRef = userDoc.data()
              userRef = {
                ...userRef,
                createdAt:
                  userRef && userRef.createdAt && userRef.createdAt.toDate(),
                updatedAt:
                  userRef && userRef.updatedAt && userRef.updatedAt.toDate()
              }
              if (userRef) {
                this.$store.commit(`user/${userTypes.SET_USER}`, userRef)
                this.setQr(this.uid, userRef.uid)
              }
            })()
          }
        } catch (error) {
          this.$notify({
            isError: true,
            message: error.message
          })
        } finally {
          this.$setLoading(false)
        }
      })
    },
    async onCheckout() {
      try {
        this.$setLoading(true)
        await db
          .collection('rooms')
          .doc(this.qr.room)
          .set(
            {
              status: 'empty',
              user: null,
              userRef: null
            },
            { merge: true }
          )
        await this.$cookies.remove('qr')
        await this.$store.commit(`guest/${guestTypes.SET_UID}`, null)
        await this.$store.commit(`guest/${guestTypes.SET_QR}`, null)
        const path = this.localePath({ name: 'index' })
        await this.$router.replace(path)
      } catch (error) {
        this.$notify({
          isError: true,
          message: error.message
        })
      } finally {
        this.$setLoading(false)
      }
    },
    onScroll() {
      this.currentScroll = window.pageYOffset
    },
    onCopyWifiName() {
      try {
        this.$clipboard(this.qr.refData.hotel.wifiName)
        this.$notify({
          kind: 'success',
          message: this.$t('wifiNameCopied')
        })
      } catch (error) {
        this.$notify({
          isError: true,
          message: error.message
        })
      }
    },
    onCopyWifiPass() {
      try {
        this.$clipboard(this.qr.refData.hotel.wifiPass)
        this.$notify({
          kind: 'success',
          message: this.$t('wifiPassCopied')
        })
      } catch (error) {
        this.$notify({
          isError: true,
          message: error.message
        })
      }
    }
  }
}
</script>
