<template>
  <v-app>
    <v-content>
      <nuxt />
    </v-content>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
import { auth } from '~/utils/firebase'

export default {
  computed: {
    ...mapGetters('user', ['role'])
  },
  mounted() {
    this.init()
    this.initLocale()
  },
  methods: {
    async init() {
      try {
        this.$setLoading(true)
        if (this.role !== 'guest') {
          await auth.signOut()
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
