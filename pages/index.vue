<i18n>
{
  "en-US": {
    "hotelSimpler": "Your hotel <strong class='secondary--text'>needs</strong> made <strong class='secondary--text'>simpler</strong>",
    "langPref": "Choose your Language of Preference below"
  },
  "en-UK": {
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
  <v-container fluid="" fill-height="">
    <v-row justify="center">
      <v-col cols="12" md="4">
        <div class="mb-5">
          <h1 class="text-center headline primary--text">Monggo.io</h1>
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
        <v-btn color="secondary" block="" rounded="">
          {{ $t('next') }}
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import locales from '~/utils/locales'

export default {
  layout: 'onboarding',
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
        this.$cookies.set('i18n_redirected', locale)
        this.$router.push(this.switchLocalePath(locale))
      }
    }
  },
  created() {
    this.initLocale()
  },
  methods: {
    initLocale() {
      const currLocale = this.$cookies.get('i18n_redirected')
      if (!currLocale) {
        this.$cookies.set('i18n_redirected', this.$i18n.locale)
      } else {
        this.$router.push(this.switchLocalePath(currLocale))
      }
    }
  }
}
</script>

<style lang="scss">
.theme--light.v-card.v-card--outlined.v-card--outlined-custom {
  border-color: #ff4081;
}
</style>
