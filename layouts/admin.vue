<template>
  <v-app>
    <v-app-bar v-if="isAuth" app="" color="primary" dark="">
      <v-toolbar-title
        style="cursor: pointer"
        @click="$router.push(localePath({ name: 'admin' }))"
      >
        <h1 class="headline">Monggo.IO Admin</h1>
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
            <span>{{ menu.text }}</span>
          </v-btn>
        </template>
      </v-toolbar-items>
      <v-spacer />
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn text="" nuxt="" exact="" @click="onLogout">
          <v-icon left="">mdi-logout-variant</v-icon>
          <span>Logout</span>
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
              <v-list-item-title>{{ menu.text }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
        <v-list-item nuxt="" exact="" ripple="">
          <v-list-item-icon>
            <v-icon>mdi-logout-variant</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Logout</v-list-item-title>
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

const usersRef = db.collection('users')

export default {
  components: {
    AppNotification
  },
  data() {
    return {
      isSidebar: false,
      admins: [],
      menus: [
        {
          text: 'Hotel',
          icon: 'mdi-office-building',
          to: 'hotel'
        },
        {
          text: 'Room',
          icon: 'mdi-hotel',
          to: 'room'
        },
        {
          text: 'Category',
          icon: 'mdi-tag',
          to: 'category'
        },
        {
          text: 'Service',
          icon: 'mdi-room-service',
          to: 'service'
        },
        {
          text: 'Order',
          icon: 'mdi-cart',
          to: 'order'
        },
        {
          text: 'User',
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
      await this.initAuth()
      await this.getAdmin()
      await this.onAuthStateChanged()
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
          this.onLogout()
        } else {
          try {
            this.$setLoading(true)
            const payload = {
              uid: user.uid,
              name: user.displayName,
              email: user.email,
              phone: user.phoneNumber,
              avatar: user.photoURL,
              role: 'admin',
              createdAt: this.$moment().toDate(),
              updatedAt: this.$moment().toDate()
            }
            await usersRef.doc(payload.uid).set(payload, { merge: true })
            const snap = await usersRef.doc(payload.uid).get()
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
    }
  }
}
</script>
