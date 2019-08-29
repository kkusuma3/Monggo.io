<template>
  <v-app>
    <v-app-bar app="" color="primary" dark="">
      <v-toolbar-title
        style="cursor: pointer"
        @click="localePath({ name: 'admin' })"
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
    <v-navigation-drawer v-model="isSidebar" app="" right="">
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
    <v-content>
      <nuxt />
      <app-notification />
    </v-content>
  </v-app>
</template>

<script>
import AppNotification from '~/components/AppNotification'

export default {
  components: {
    AppNotification
  },
  data() {
    return {
      isSidebar: false,
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
  watch: {
    '$vuetify.breakpoint.name': function(value) {
      if (value !== 'sm') {
        this.isSidebar = false
      }
    }
  },
  methods: {
    onLogout() {}
  }
}
</script>
