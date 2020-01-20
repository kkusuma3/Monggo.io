<i18n>
{
  "en-us": {
    "hotelSimpler": "Your hotel <strong class='secondary--text'>needs</strong> made <strong class='secondary--text'>simpler</strong>",
    "langPref": "Choose your Language of Preference below",
    "operatorLogin": "@:(operator) @:(login)"
  },
  "en-uk": {
    "hotelSimpler": "Your hotel <strong class='secondary--text'>needs</strong> made <strong class='secondary--text'>simpler</strong>",
    "langPref": "Choose your Language of Preference below",
    "operatorLogin": "@:(operator) @:(login)"
  },
  "id": {
    "hotelSimpler": "<strong class='secondary--text'>Kebutuhan</strong> hotel Anda dibuat <strong class='secondary--text'>lebih sederhana</strong>",
    "langPref": "Pilih preferensi bahasa Anda",
    "operatorLogin": "@:(login) @:(operator)"
  },
  "cn": {
    "hotelSimpler": "您的酒店需求变得更加简单",
    "langPref": "在下面选择您的偏好语言",
    "operatorLogin": "@:(login) @:(operator)"
  },
  "ja": {
    "hotelSimpler": "ホテルのニーズがよりシンプルに",
    "langPref": "言語設定を選択してください",
    "operatorLogin": "@:(login) @:(operator)"
  }
}
</i18n>

<template>
  <v-container fluid="" class="fill-height">
    <v-row justify="center">
      <v-col cols="10" md="4">
        <div class="mb-3">
          <h1
            class="text-center headline primary--text d-flex align-center justify-center"
            aria-label="Monggo.IO"
          >
            <app-img
              src="/icons/icon-with-text.png"
              alt="Mongo.IO"
              max-width="150"
              contain=""
            />
          </h1>
          <h2
            class="text-center subtitle-1 primary--text"
            v-html="$t('hotelSimpler')"
          ></h2>
        </div>
        <v-card outlined="" class="v-card--outlined-custom mb-5">
          <v-card-text class="text-center">
            <h3 class="subtitle-1 primary--text font-weight-bold mb-3">
              {{ $t('langPref') }}
            </h3>
            <v-item-group v-model="locale">
              <v-item
                v-for="(loc, i) in locales"
                :key="`loc_${loc.code}`"
                #default="{ active, toggle }"
                :value="loc.code"
              >
                <v-btn
                  :outlined="!active"
                  :class="{ 'mb-3': i !== locales.length - 1 }"
                  color="primary"
                  block=""
                  rounded=""
                  @click="toggle"
                >
                  {{ loc.name }}
                </v-btn>
              </v-item>
            </v-item-group>
          </v-card-text>
        </v-card>
        <v-btn
          :loading="isLoading"
          :disabled="isLoading"
          color="secondary"
          block=""
          rounded=""
          nuxt=""
          exact=""
          class="mb-5"
          @click="checkQr()"
        >
          {{ $t('next') }}
        </v-btn>
        <v-btn
          color="secondary"
          block=""
          rounded=""
          nuxt=""
          exact=""
          :to="localePath({ name: 'admin' })"
        >
          {{ $t('operatorLogin') }}
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import locales from '~/utils/locales'
import { types as userTypes } from '~/store/user'
import { types as guestTypes } from '~/store/guest'
import { auth, db } from '~/utils/firebase'

export default {
  data() {
    return {
      locales: [...locales] // Locale imported from locale list
    }
  },
  computed: {
    ...mapState(['isLoading']),
    ...mapGetters('user', ['isAuth']),
    localeSelected() {
      return this.$store.state.user.locale
    },
    qr() {
      return this.$store.state.user.qr
    },
    locale: {
      get() {
        return this.$i18n.locale
      },
      set(locale) {
        this.$vuetify.lang.current = locale
        this.$cookies.set('i18n_redirected', locale)
        this.$store.commit(`user/${userTypes.SET_LOCALE}`, locale)
        this.$router.push(this.switchLocalePath(locale))
      }
    }
  },

  mounted() {
    const { qrCode } = this.$route.query
    if (qrCode) {
      this.$store.commit(`user/${userTypes.SET_QR}`, qrCode)
    }
  },
  methods: {
    async checkQr() {
      this.$setLoading(true)
      this.$store.commit(`user/${userTypes.SET_LOCALE}`, this.locale)
      if (this.qr === null) {
        this.$setLoading(false)
        return this.$router.push('qr-scan')
      }
      const qr = await db
        .collection('qr-codes')
        .where('uid', '==', this.qr)
        .get()
      if (qr.docs[0]) {
        const room = await qr.docs[0].data().roomRef.get()
        const roomData = room.data()
        if (roomData.status !== 'empty') {
          this.$notify({
            isError: true,
            message: roomData.name + ' is not available'
          })
        } else {
          if (!this.isAuth) {
            await auth.signInAnonymously()
          }
          this.$store.commit(`guest/${guestTypes.SET_UID}`, this.qr)
          this.$cookies.set('qr', this.qr)
          this.$router.replace(this.localePath({ name: 'guest' }))
        }
      } else {
        this.$notify({
          isError: true,
          message: 'Invalid QR-Code'
        })
      }
      this.$setLoading(false)

  head() {
    return {
      title: this.$t('home')

    }
  }
}
</script>
