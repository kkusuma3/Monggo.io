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
          >
            <v-card-text class="text-center">
              <v-icon x-large="">{{ menu.icon }}</v-icon>
              <h2 class="mt-3">{{ menu.text }}</h2>
            </v-card-text>
          </v-card>
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>

<script>
export default {
  layout: 'admin',
  head() {
    return {
      title: 'Admin'
    }
  },
  data() {
    return {
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
  }
}
</script>
