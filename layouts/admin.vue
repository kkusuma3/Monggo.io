<i18n>
{
  "en-us": {
    "logout": "Logout"
  },
  "en-uk": {
    "logout": "Logout"
  },
  "id": {
    "logout": "Keluar"
  }
}
</i18n>

<template>
  <v-app>
    <v-app-bar v-if="isAuth" app="" color="primary" dark="">
      <v-toolbar-title
        style="cursor: pointer"
        @click="$router.push(localePath({ name: 'admin' }))"
      >
        <h1 class="headline">Monggo.IO</h1>
      </v-toolbar-title>
      <v-toolbar-items class="hidden-sm-and-down ml-4">
        <template v-for="(menu, i) in menus">
          <v-btn
            :key="`menu_toolbar_${i}`"
            :to="localePath({ name: `admin-${menu.to}` })"
            text=""
            nuxt=""
            exact=""
          >
            <v-icon left="">{{ menu.icon }}</v-icon>
            <span>{{ $t(menu.to) }}</span>
          </v-btn>
        </template>
      </v-toolbar-items>
      <v-spacer />
      <v-toolbar-items class="hidden-sm-and-down">
        <v-menu offset-y="" bottom="">
          <template #activator="{ on }">
            <v-btn text="" v-on="on">
              <v-icon left="">mdi-translate</v-icon>
              <span>{{ $t('language') }}</span>
              <v-icon dark="" right="">mdi-chevron-down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <template v-for="(locale, i) in locales">
              <v-list-item
                :key="`menu_toolbar_locale_${locale.code}_${i}`"
                nuxt=""
                exact=""
                ripple=""
                @click="onLocaleChange(locale.code)"
              >
                <v-list-item-content>
                  <v-list-item-title>
                    {{ locale.name }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-list>
        </v-menu>
        <v-btn text="" nuxt="" exact="" @click="onLogout">
          <v-icon left="">mdi-logout-variant</v-icon>
          <span>{{ $t('logout') }}</span>
        </v-btn>
      </v-toolbar-items>
      <v-app-bar-nav-icon
        class="hidden-md-and-up"
        @click="isSidebar = !isSidebar"
      />
    </v-app-bar>
    <v-navigation-drawer v-if="isAuth" v-model="isSidebar" app="" right="">
      <v-list>
        <template v-for="(menu, i) in menus">
          <v-list-item
            :key="`menu_sidebar_${i}`"
            :to="localePath({ name: `admin-${menu.to}` })"
            nuxt=""
            exact=""
            ripple=""
          >
            <v-list-item-icon>
              <v-icon>{{ menu.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ $t(menu.to) }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
        <v-list-group prepend-icon="mdi-translate" no-action="">
          <template #activator="">
            <v-list-item-content>
              <v-list-item-title>{{ $t('language') }}</v-list-item-title>
            </v-list-item-content>
          </template>
          <template v-for="(locale, i) in locales">
            <v-list-item
              :key="`menu_sidebar_locale_${locale.code}_${i}`"
              nuxt=""
              exact=""
              ripple=""
              @click="onLocaleChange(locale.code)"
            >
              <v-list-item-content>
                <v-list-item-title>{{ locale.name }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list-group>
        <v-list-item nuxt="" exact="" ripple="">
          <v-list-item-icon>
            <v-icon>mdi-logout-variant</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ $t('logout') }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-content v-if="isAuth || $route.name.includes('login')">
      <nuxt />
      <app-notification />
    </v-content>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
import { auth, db } from '~/utils/firebase'
import AppNotification from '~/components/AppNotification'
import { types as userTypes } from '~/store/user'
import locales from '~/utils/locales'

const usersRef = db.collection('users')

export default {
  components: {
    AppNotification
  },
  data() {
    return {
      isSidebar: false,
      admins: [],
      locales: [...locales],
      menus: [
        {
          icon: 'mdi-office-building',
          to: 'hotel'
        },
        {
          icon: 'mdi-hotel',
          to: 'room'
        },
        {
          icon: 'mdi-qrcode',
          to: 'qr-code'
        },
        {
          icon: 'mdi-tag',
          to: 'category'
        },
        {
          icon: 'mdi-room-service',
          to: 'service'
        },
        {
          icon: 'mdi-cart',
          to: 'order'
        },
        {
          icon: 'mdi-account-group',
          to: 'user'
        }
      ]
    }
  },
  computed: {
    ...mapGetters('user', ['isAuth'])
  },
  watch: {
    '$vuetify.breakpoint.name': function(value) {
      if (value !== 'sm') {
        this.isSidebar = false
      }
    },
    isAuth(isAuth) {
      this.initAuth()
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      await this.initLocale()
      await this.initAuth()
      await this.getAdmin()
      await this.onAuthStateChanged()
    },
    initLocale() {
      const currLocale = this.$cookies.get('i18n_redirected')
      if (!currLocale) {
        this.$cookies.set('i18n_redirected', this.$i18n.locale)
      } else {
        this.$router.push(this.switchLocalePath(currLocale))
      }
    },
    async getAdmin() {
      try {
        this.$setLoading(true)
        const snaps = await usersRef.where('role', '==', 'admin').get()
        const admins = []
        snaps.forEach(doc => {
          const data = doc.data()
          admins.push({
            ...data,
            createdAt: data && data.createdAt && data.createdAt.toDate(),
            updatedAt: data && data.updatedAt && data.updatedAt.toDate()
          })
        })
        this.admins = admins
      } catch (error) {
        this.$notify({
          isError: true,
          message: error.message
        })
      } finally {
        this.$setLoading(false)
      }
    },
    onAuthStateChanged() {
      auth.onAuthStateChanged(async user => {
        if (user === null) {
          return
        }
        const isAdmin = this.admins.reduce(
          (acc, curr) => acc || curr.email === user.email,
          false
        )
        if (!isAdmin) {
          try {
            this.$setLoading(true)
            const payload = {
              uid: user.uid,
              name: user.displayName,
              email: user.email,
              phone: user.phoneNumber,
              avatar: user.photoURL,
              role: 'guest',
              createdAt: this.$moment().toDate(),
              updatedAt: this.$moment().toDate()
            }
            await usersRef.doc(payload.uid).set(payload, { merge: true })
            await auth.signOut()
            await this.$notify({
              message: `You're not the admin`
            })
          } catch (error) {
            this.$notify({
              isError: true,
              message: error.message
            })
          } finally {
            this.$setLoading(false)
          }
        } else {
          try {
            this.$setLoading(true)
            const snap = await usersRef.doc(user.uid).get()
            const data = await snap.data()
            await this.$store.commit(`user/${userTypes.SET_USER}`, {
              ...data,
              createdAt: data && data.createdAt && data.createdAt.toDate(),
              updatedAt: data && data.updatedAt && data.updatedAt.toDate()
            })
            await this.$notify({
              kind: 'success',
              message: 'Login successfully'
            })
          } catch (error) {
            this.$notify({
              isError: true,
              message: error.message
            })
          } finally {
            this.$setLoading(false)
          }
        }
      })
    },
    initAuth() {
      if (!this.isAuth) {
        const path = this.localePath({ name: 'admin-login' })
        this.$router.replace(path)
      } else {
        const path = this.localePath({ name: 'admin' })
        this.$router.replace(path)
      }
    },
    async onLogout() {
      try {
        this.$setLoading(true)
        await auth.signOut()
        await this.$store.commit(`user/${userTypes.SET_USER}`)
        await this.$notify({
          kind: 'success',
          message: 'Logout successfully'
        })
      } catch (error) {
        this.$notify({
          isError: true,
          message: error.message
        })
      } finally {
        this.$setLoading(false)
      }
    },
    onLocaleChange(locale) {
      this.$cookies.set('i18n_redirected', locale)
      this.$router.push(this.switchLocalePath(locale))
    }
  }
}
</script>
