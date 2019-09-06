<i18n>
{
  "en-us": {
    "requestStat": "Request @:(status)"
  },
  "en-uk": {
    "requestStat": "Request @:(status)"
  },
  "id": {
    "requestStat": "@:(status) Pemesanan"
  }
}
</i18n>

<template>
  <v-app>
    <v-content>
      <nuxt />
    </v-content>
    <v-bottom-navigation v-if="$route.name.includes('guest')" grow="" dark="">
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
import { auth, db } from '~/utils/firebase'
import { types as userTypes } from '~/store/user'
import { types as qrTypes } from '~/store/qr'

export default {
  data() {
    return {}
  },
  computed: {
    ...mapState('qr', ['qr', 'uid']),
    ...mapState('user', ['user']),
    ...mapGetters('user', ['role']),
    ...mapGetters('qr', ['isCheckedIn'])
  },
  watch: {
    uid(uid) {
      if (uid) {
        this.setQr(uid)
      }
    },
    qr(qr) {
      if (qr) {
        this.setRoom(qr.room)
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
    initUid() {
      const uid = this.$cookies.get('qr')
      if (uid) {
        this.$store.commit(`qr/${qrTypes.SET_UID}`, uid)
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
    async setRoom(room) {
      try {
        this.$setLoading(true)
        await db
          .collection('rooms')
          .doc(room)
          .set({ status: 'reserved', user: this.user.uid }, { merge: true })
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
        if (qrRef && qrRef.room) {
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
                createdAt:
                  hotelRef && hotelRef.createdAt && hotelRef.createdAt.toDate(),
                updatedAt:
                  hotelRef && hotelRef.updatedAt && hotelRef.updatedAt.toDate()
              }
              roomRef = {
                ...roomRef,
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
              this.$store.commit(`qr/${qrTypes.SET_QR}`, payload)
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
    }
  }
}
</script>
