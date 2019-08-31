<template>
  <v-app>
    <nuxt />
  </v-app>
</template>

<script>
export default {
  data() {
    return {}
  },
  mounted() {
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
