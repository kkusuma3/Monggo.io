<template>
  <v-container class="fill-height">
    <v-row align="center">
      <template v-for="(menu, i) in menus">
        <v-col :key="`menu_${i}`" cols="12" md="2">
          <v-card
            :to="localePath({ name: `admin-${menu.to}` })"
            color="primary"
            dark=""
            nuxt=""
            exact=""
            :data-cy="menu.to"
          >
            <v-card-text class="text-center">
              <v-icon x-large="">{{ menu.icon }}</v-icon>
              <h2 class="mt-3">{{ $t(menu.to) }}</h2>
            </v-card-text>
          </v-card>
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  layout: 'admin',
  data() {
    return {}
  },
  head() {
    return {
      title: 'Admin'
    }
  },
  computed: {
    ...mapGetters('user', ['role']),
    menus() {
      switch (this.role) {
        case 'admin':
          return [
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
              icon: 'mdi-room-service',
              to: 'service'
            },
            {
              icon: 'mdi-cart',
              to: 'order'
            },
            {
              icon: 'mdi-tag',
              to: 'category'
            },
            {
              icon: 'mdi-account-group',
              to: 'user'
            }
          ]
        case 'operator':
          return [
            {
              icon: 'mdi-hotel',
              to: 'room'
            },
            {
              icon: 'mdi-qrcode',
              to: 'qr-code'
            },
            {
              icon: 'mdi-room-service',
              to: 'service'
            },
            {
              icon: 'mdi-cart',
              to: 'order'
            }
          ]
        case 'worker':
          return [
            {
              icon: 'mdi-cart',
              to: 'order'
            }
          ]
        default:
          return []
      }
    }
  }
}
</script>
