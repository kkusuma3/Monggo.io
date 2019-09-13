<template>
  <v-container id="guest-account" class="fill-height">
    <v-fade-transition mode="out-in" hide-on-leave="">
      <v-row
        v-if="!isDataLoaded"
        class="fill-height ma-0"
        align="center"
        justify="center"
      >
        <v-progress-circular indeterminate="" color="grey lighten-1" />
      </v-row>
      <v-row v-else="">
        <v-col cols="12">
          <div class="d-flex align-center justify-center">
            <div v-if="isAnonymous" class="text-center">
              <app-img
                src="/icons/icon-with-text.png"
                alt="Monggo.IO"
                width="150"
                height="150"
                class="mb-3"
              />
              <v-btn
                :disabled="isLoading"
                :loading="isLoading"
                color="primary"
                @click="onLoginUpgrade"
              >
                <v-icon left="">mdi-login-variant</v-icon>
                <span>{{ $t('login') }}</span>
              </v-btn>
            </div>
            <div v-else-if="isAuth" class="text-center">
              <v-avatar
                :color="getMaterialColor(user.name || user.email)"
                size="100"
                class="mb-3"
              >
                <app-img
                  v-if="user.avatar && user.avatar.length > 0"
                  :src="user.avatar"
                  :alt="user.name || user.email"
                />
                <span
                  v-else=""
                  class="headline"
                  :class="{
                    'white--text': isDarkColor(
                      getMaterialColor(user.name || user.email, true)
                    )
                  }"
                >
                  {{ getInitials(user.name || user.email) }}
                </span>
              </v-avatar>
              <h2 class="headline mb-3">{{ user.name || user.email }}</h2>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-fade-transition>
  </v-container>
</template>

<script>
import isDarkColor from 'is-dark-color'
import materialColorHash from 'material-color-hash'
import initials from 'initials'
import { mapState, mapGetters } from 'vuex'
import { auth, GoogleAuthProvider } from '~/utils/firebase'

export default {
  head() {
    return {
      title: `${this.$t('account')} - ${this.$t('guest')}`
    }
  },
  data() {
    return {}
  },
  computed: {
    ...mapState(['isLoading', 'isDataLoaded']),
    ...mapState('user', ['user']),
    ...mapGetters('user', ['isAnonymous', 'isAuth']),
    ...mapState('guest', ['qr']),
    isDarkColor() {
      return color => {
        if (!color) {
          return
        }
        color = color.toString()
        return isDarkColor(color)
      }
    },
    getMaterialColor() {
      return (string, isCode = false) => {
        if (!string) {
          return
        }
        string = string.toString()
        const { backgroundColor, materialColorName } = materialColorHash(string)
        return isCode ? backgroundColor : materialColorName.toLowerCase()
      }
    },
    getInitials() {
      return string => {
        if (!string) {
          return
        }
        string = string.toString()
        return initials(string)
      }
    }
  },
  methods: {
    async onLoginUpgrade() {
      try {
        this.$setLoading(true)
        await auth.currentUser.linkWithRedirect(GoogleAuthProvider)
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
