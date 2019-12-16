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
                :value="loc.code"
                #default="{ active, toggle }"
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
import locales from '~/utils/locales'
import { types as userTypes } from '~/store/user'

export default {
  head() {
    return {
      title: this.$t('home')
    }
  },
  data() {
    return {
      locales: [...locales] // Locale imported from locale list
    }
  },
  computed: {
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
    checkQr() {
      this.$store.commit(`user/${userTypes.SET_LOCALE}`, this.locale)

      if (this.qr === null) {
        this.$router.push('qr-scan')
      } else {
        this.$cookies.set('qr', this.qr)
        this.$router.replace(this.localePath({ name: 'guest' }))
      }
    }
  }
}
</script>
