<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card
          v-for="(order, i) in orders"
          :key="order.uid"
          :class="{ 'mb-5': i !== orders.length - 1 }"
        >
          <div class="d-flex">
            <app-img
              :src="order.refData.service.imagesMeta[0].url"
              :alt="order.refData.service.imagesMeta[0].name"
              :contain="false"
              width="100"
            />
            <v-card-text>
              <h3 class="subtitle-1">{{ order.refData.service.name }}</h3>
              <div class="mb-2">
                <time :datetime="order.createdAt" class="caption">
                  {{ $moment(order.createdAt).format('llll') }}
                </time>
              </div>
              <div>
                <v-chip
                  label=""
                  :color="getStatusColor(order.status)"
                  text-color="white"
                  small=""
                >
                  <v-avatar left>
                    <v-icon small="">
                      {{ getStatusIcon(order.status) }}
                    </v-icon>
                  </v-avatar>
                  <span>
                    {{ $t(order.status) }}
                  </span>
                </v-chip>
              </div>
            </v-card-text>
          </div>
          <v-card-actions>
            <v-btn block="" depressed="" small="">Batalkan</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'

export default {
  head() {
    return {
      title: `${this.$t('order')} - ${this.$t('guest')}`
    }
  },
  data() {
    return {}
  },
  computed: {
    ...mapState('user', ['user']),
    ...mapState('guest', ['qr', 'orders']),
    getStatusColor() {
      return string => {
        if (!string) {
          return
        }
        string.toString()
        switch (string) {
          case 'ordered':
            return 'info'
          case 'processed':
            return 'warning'
          case 'delivered':
            return 'success'
          default:
            return 'error'
        }
      }
    },
    getStatusIcon() {
      return string => {
        if (!string) {
          return
        }
        string.toString()
        switch (string) {
          case 'ordered':
            return 'mdi-basket-fill'
          case 'processed':
            return 'mdi-cached'
          case 'delivered':
            return 'mdi-check'
          default:
            return 'error'
        }
      }
    },
    getStatusText() {
      return string => {
        if (!string) {
          return
        }
        string.toString()
        return `${string.charAt(0).toUpperCase()}${string
          .slice(1)
          .toLowerCase()}`
      }
    }
  }
}
</script>
