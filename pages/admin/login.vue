<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center">
      <v-btn
        :loading="isLoading"
        :disabled="isLoading"
        color="primary"
        @click="onLogin"
      >
        Login
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
      title: 'Login'
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
  methods: {
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
