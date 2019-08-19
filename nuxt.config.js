import id from 'vuetify/es5/locale/id'
import colors from 'vuetify/es5/util/colors'
import locales from './utils/locales'

const isDev = process.env.NODE_ENV !== 'production'

export default {
  // https://nuxtjs.org/api/configuration-modern
  modern: !isDev,

  // https://nuxtjs.org/api/configuration-mode/
  mode: 'spa',

  // https://nuxtjs.org/api/configuration-head
  head: {
    titleTemplate(title) {
      if (title) {
        return `${title} - Monggo.IO`
      }
      return 'Monggo.IO'
    }
  },

  // https://nuxtjs.org/api/configuration-modules
  modules: [
    // https://pwa.nuxtjs.org/
    '@nuxtjs/pwa',

    // https://github.com/nuxt-community/moment-module
    '@nuxtjs/moment',

    // https://github.com/nuxt-community/sentry-module
    '@nuxtjs/sentry',

    // https://github.com/nuxt-community/analytics-module
    [
      '@nuxtjs/google-analytics',
      {
        // TODO: Change this id to your Google Analytics ID
        id: 'UA-145883475-1'
      }
    ],

    // https://nuxt-community.github.io/nuxt-i18n/
    [
      'nuxt-i18n',
      {
        vueI18n: {
          silentTranslationWarn: true
        },
        defaultLocale: 'en-us',
        vueI18nLoader: true,
        lazy: true,
        detectBrowserLanguage: {
          useCookie: true,
          alwaysRedirect: true
        },
        langDir: 'locales/',
        locales
      }
    ],

    // https://github.com/microcipcip/cookie-universal/tree/master/packages/cookie-universal-nuxt
    'cookie-universal-nuxt'
  ],

  sentry: {
    dsn: 'https://f2a60806af1a4265ab96857e7aeabc71@sentry.io/1533832'
  },

  moment: {
    locales: ['id']
  },

  devModules: [
    // Simple usage
    '@nuxtjs/vuetify'
  ],

  vuetify: {
    theme: {
      themes: {
        light: {
          primary: colors.pink.accent2,
          secondary: colors.pink.darken1
        }
      }
    },
    lang: {
      locales: { id },
      current: 'id'
    }
  },

  meta: {
    name: 'Monggo.io',
    description:
      'Monggo.io tackles language barriers when traveling to different hotels around the world.',
    theme_color: '#fff',
    ogHost: 'https://mongo-io.web.app',
    twitterCard: 'summary_large_image',
    twitterSite: '@datagoid',
    twitterCreator: '@datagoid'
  },

  manifest: {
    name: 'Monggo.io',
    short_name: 'Monggo.io',
    start_url: '/?utm_source=homescreen',
    description:
      'Monggo.io tackles language barriers when traveling to different hotels around the world.',
    lang: 'id',
    theme_color: '#fff',
    background_color: '#fff'
  },

  loading: {
    color: colors.pink.accent2,
    height: '3px'
  },

  // https://nuxtjs.org/api/configuration-plugins
  plugins: ['~plugins/vee-validate', '~plugins/vue-qrcode-reader.client'],

  // https://nuxtjs.org/api/configuration-css
  css: ['~assets/styles/app'],

  // https://nuxtjs.org/api/configuration-build
  build: {
    extractCSS: !isDev,
    extend(config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /node_modules/,
          options: {
            fix: true
          }
        })
      }
    }
  }
}
