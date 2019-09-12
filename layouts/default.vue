<i18n>
{
  "en-us": {
    "requestStat": "Request @:(status)",
    "searchService": "@:(service) @:(search)",
    "hotelInfo": "@:(hotel) Information"
  },
  "en-uk": {
    "requestStat": "Request @:(status)",
    "searchService": "@:(service) @:(search)",
    "hotelInfo": "@:(hotel) Information"
  },
  "id": {
    "requestStat": "@:(status) Pemesanan",
    "searchService": "@:(search) @:(service)",
    "hotelInfo": "Informasi @:(hotel)"
  }
}
</i18n>

<template>
  <v-app>
    <v-app-bar
      v-if="$route.name.includes('guest') && qr"
      app=""
      fixed=""
      dark=""
      shrink-on-scroll=""
      elevate-on-scroll=""
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
      <v-toolbar-title class="mr-3">
        <h1 aria-label="Monggo.IO">
          <app-img src="/icon.png" alt="Monggo.IO" width="24" height="24" />
        </h1>
      </v-toolbar-title>
      <v-spacer />
      <v-scroll-x-reverse-transition mode="out-in">
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
          :items="services"
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
      </v-scroll-x-reverse-transition>
      <v-dialog v-model="isHotelInfo" scrollable="">
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
          <v-carousel height="200">
            <v-carousel-item
              v-for="meta in qr.refData.hotel.imagesMeta"
              :key="meta.name"
              :src="meta.url"
            >
            </v-carousel-item>
          </v-carousel>
          <v-card-text class="pa-5 pa-4">
            <h2 class="headline">{{ qr.refData.hotel.name }}</h2>
            <div class="subtitle-1">{{ qr.refData.hotel.description }}</div>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              v-if="qr.refData.hotel.phone"
              color="primary"
              :href="`tel:${qr.refData.hotel.phone}`"
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
        :to="localePath({ name: 'guest-status' })"
      >
        <span>{{ $t('requestStat') }}</span>
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
import isDarkColor from 'is-dark-color'
import materialColorHash from 'material-color-hash'
import initials from 'initials'
import { auth, db } from '~/utils/firebase'
import { types as userTypes } from '~/store/user'
import { types as guestTypes } from '~/store/guest'
import AppNotification from '~/components/AppNotification'

export default {
  components: {
    AppNotification
  },
  data() {
    return {
      isSearch: false,
      isHotelInfo: false,
      service: null,
      services: []
    }
  },
  computed: {
    ...mapState(['isLoading']),
    ...mapState('guest', ['qr', 'uid']),
    ...mapState('user', ['user']),
    ...mapGetters('user', ['role', 'isAuth']),
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
    }
  },
  watch: {
    uid(uid) {
      if (uid) {
        this.setQr(uid)
      }
    },
    qr(qr) {
      if (qr && this.isAuth) {
        this.setRoom(qr.room)
        this.getServices(qr.hotel)
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async getServices(hotel) {
      try {
        this.$setLoading(true)
        const serviceSnap = await db
          .collection('services')
          .where('hotel', '==', hotel)
          .get()
        const services = []
        serviceSnap.forEach(service => {
          let serviceRef = service.data()
          delete serviceRef.hotelRef
          delete serviceRef.categoryRef
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
          services.push(serviceRef)
        })
        this.services = services
      } catch (error) {
        this.$notify({
          isError: true,
          message: error.message
        })
      } finally {
        this.$setLoading(false)
      }
    },
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
    async setRoom(room, uid = this.user.uid) {
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
            const payload = {
              uid: user.uid,
              name: user.displayName,
              email: user.email,
              phone: user.phoneNumber,
              avatar: user.photoURL,
              isAnonymous: user.isAnonymous,
              role: 'guest',
              createdAt: this.$moment().toDate(),
              updatedAt: this.$moment().toDate()
            }
            await db
              .collection('users')
              .doc(payload.uid)
              .set(payload, { merge: true })
            const userDoc = await db
              .collection('users')
              .doc(payload.uid)
              .get()
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
    }
  }
}
</script>
