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
    ...mapState('qr', ['uid']),
    ...mapGetters('user', ['role'])
  },
  mounted() {
    this.initLocale()
    this.initUid()
    this.onAuthStateChanged()
  },
  methods: {
    initUid() {
      const uid = this.$cookies.get('uid')
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
    onAuthStateChanged() {
      auth.onAuthStateChanged(async user => {
        if (user === null) {
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
            role: 'guest',
            createdAt: this.$moment().toDate(),
            updatedAt: this.$moment().toDate()
          }
          await db
            .collection('users')
            .doc(payload.uid)
            .set(payload, { merge: true })
          const [userDoc, qrDoc] = await Promise.all([
            db
              .collection('users')
              .doc(payload.uid)
              .get(),
            db
              .collection('qr-codes')
              .doc(this.uid)
              .get()
          ])
          // eslint-disable-next-line
          let [userRef, qrRef] = await Promise.all([
            userDoc.data(),
            qrDoc.data()
          ])
          if (userRef && qrRef && qrRef.room) {
            await db
              .collection('rooms')
              .doc(qrRef.room)
              .set({ status: 'reserved', user: payload.uid }, { merge: true })
            if (qrRef.roomRef) {
              const roomRefDoc = await qrRef.roomRef.get()
              const roomRef = roomRefDoc.data()
              qrRef = {
                ...qrRef,
                refData: {
                  room: roomRef
                }
              }
              delete qrRef.roomRef
              const payload = _cloneDeep(qrRef)
              this.$store.commit(`qr/${qrTypes.SET_QR}`, payload)
              this.$store.commit(`user/${userTypes.SET_USER}`, userRef)
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
    }
  }
}
</script>
