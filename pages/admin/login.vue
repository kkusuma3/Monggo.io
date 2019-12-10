<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center">
      <v-btn
        :loading="isLoading"
        :disabled="isLoading"
        color="primary"
        @click="onLogin"
      >
        <v-icon left="">mdi-login-variant</v-icon>
        <span>{{ $t('login') }}</span>
      </v-btn>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import { auth, GoogleAuthProvider } from '~/utils/firebase'
import { types as userTypes } from '~/store/user'

export default {
  layout: 'admin',
  head() {
    return {
      title: this.$t('login')
    }
  },
  data() {
    return {}
  },
  computed: {
    ...mapState(['isLoading']),
    user: {
      get() {
        return this.$store.state.user.user
      },
      set(user) {
        this.$store.commit(`user/${userTypes.SET_USER}`, user)
      }
    }
  },
  mounted() {
    this.$setLoading(false)
  },
  methods: {
    /**
     * Called when the admin called login button
     */
    async onLogin() {
      try {
        this.$setLoading(true)
        await auth.signInWithRedirect(GoogleAuthProvider)
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
