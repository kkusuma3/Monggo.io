<i18n>
{
  "en-us": {
    "hotelSimpler": "Your hotel <strong class='secondary--text'>needs</strong> made <strong class='secondary--text'>simpler</strong>",
    "langPref": "Choose your Language of Preference below"
  },
  "en-uk": {
    "hotelSimpler": "Your hotel <strong class='secondary--text'>needs</strong> made <strong class='secondary--text'>simpler</strong>",
    "langPref": "Choose your Language of Preference below"
  },
  "id": {
    "hotelSimpler": "<strong class='secondary--text'>Kebutuhan</strong> hotel Anda dibuat <strong class='secondary--text'>lebih sederhana</strong>",
    "langPref": "Pilih preferensi bahasa Anda"
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
          :to="localePath({ name: 'qr-scan' })"
        >
          {{ $t('next') }}
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import locales from '~/utils/locales'

export default {
  head() {
    return {
      title: this.$t('home')
    }
  },
  data() {
    return {
      locales: [...locales]
    }
  },
  computed: {
    locale: {
      get() {
        return this.$i18n.locale
      },
      set(locale) {
        this.$vuetify.lang.current = locale
        this.$cookies.set('i18n_redirected', locale)
        this.$router.push(this.switchLocalePath(locale))
      }
    }
  }
}
</script>
