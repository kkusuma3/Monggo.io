<template>
  <v-container>
    <v-row>
      <template v-for="(menu, i) in menus">
        <v-col :key="`menu_${i}`" cols="6" md="2">
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
    <v-row>
      <v-col cols="12" md="4">
        <v-select
          v-model="hotels[0]"
          item-value="name"
          :items="hotels"
          item-text="name"
          label="Hotel"
          :loading="isLoading"
          outlined
          hide-details
          style="min-height: 50px"
          @change="selectHotel"
        ></v-select>
      </v-col>
      <v-col cols="12" md="8">
        <v-btn-toggle
          mandatory
          class="col-12 px-0 py-1"
          background-color="transparent"
        >
          <v-btn
            x-large
            class="col-4"
            @click.native="setActiveTab('average')"
            >{{ $t('average') }}</v-btn
          >
          <v-btn
            x-large
            class="col-4"
            @click.native="setActiveTab('hitoday')"
            >{{ $t('today') }}</v-btn
          >
          <v-btn
            x-large
            class="col-4"
            @click.native="setActiveTab('history')"
            >{{ $t('history') }}</v-btn
          >
        </v-btn-toggle>
      </v-col>
    </v-row>
    <template v-if="activeTab === 'average' && !hideDashboard">
      <tabs-averages :orders="orders" :services="services"></tabs-averages>
    </template>
    <template v-else-if="activeTab === 'hitoday' && !hideDashboard">
      <tabs-today :orders="orders"></tabs-today>
    </template>
    <template v-else-if="activeTab === 'history' && !hideDashboard">
      <tabs-history ref="tabsHistory" :orders="orders"></tabs-history>
    </template>
  </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import tabsAverages from './dashboard/tabs-averages.vue'
import tabsToday from './dashboard/tabs-today.vue'
import tabsHistory from './dashboard/tabs-history.vue'
import { db } from '~/utils/firebase'

export default {
  layout: 'admin',
  head() {
    return {
      title: 'Dashboard - Admin'
    }
  },
  components: {
    'tabs-averages': tabsAverages,
    'tabs-today': tabsToday,
    'tabs-history': tabsHistory
  },
  data() {
    return {
      hideDashboard: true,
      activeTab: 'average',
      items: [], // Array hold all dashboard data
      hotels: [], // Array hold hotel data
      services: [], // Array hold services data
      orders: [], // Array hold orders data
      users: [] // Array hold user data
    }
  },
  computed: {
    ...mapState(['isLoading']),
    ...mapState('user', ['user']),
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
  },
  mounted() {
    this.initData()
  },
  methods: {
    /**
     * Called to initialize the data
     */
    async initData() {
      try {
        this.$setLoading(true)
        this.collection = 'hotels'
        if (this.role === 'operator') {
          await Promise.all([
            this.getItems(
              db.collection('hotels').where('uid', '==', this.user.hotel),
              'hotels'
            ),
            this.getItems(
              db.collection('orders').where('hotel', '==', this.user.hotel),
              'orders'
            ),
            this.getItems(
              db.collection('services').where('hotel', '==', this.user.hotel),
              'services'
            )
          ])

          this.orders.sort(this.sortbyCreatedAt)
          if (this.hotels.length === 0) {
            this.hideDashboard = true
          } else {
            this.hideDashboard = false
          }
        }
      } catch (error) {
        this.$notify({
          isError: true,
          message: error.message
        })
      } finally {
        this.$setLoading(false)
      }
    },
    sortbyCreatedAt(a, b) {
      if (a.createdAt.getTime() > b.createdAt.getTime()) {
        return -1
      }
      if (a.createdAt.getTime() < b.createdAt.getTime()) {
        return 1
      }
      return 0
    },
    /**
     * Called to get all data
     */
    async getItems(collection = this.collection, location, cb) {
      try {
        this.$setLoading(true)
        let snaps = null
        if (typeof collection === 'string') {
          snaps = await db
            .collection(collection)
            .orderBy('createdAt', 'desc')
            .get()
        } else {
          snaps = await collection.get()
        }
        if (snaps && snaps.docs) {
          const items = await Promise.all(
            snaps.docs.map(async doc => {
              const data = doc.data()
              if (cb) {
                const refData = await cb(data)
                return {
                  ...data,
                  refData,
                  createdAt: data && data.createdAt && data.createdAt.toDate(),
                  updatedAt: data && data.updatedAt && data.updatedAt.toDate()
                }
              } else {
                return {
                  ...data,
                  createdAt: data && data.createdAt && data.createdAt.toDate(),
                  updatedAt: data && data.updatedAt && data.updatedAt.toDate()
                }
              }
            })
          )
          await (() => {
            if (typeof collection === 'string') {
              if (collection === this.collection) {
                this.items = items
              } else if (this[collection]) {
                this[collection] = items
              } else {
                throw new Error('Collection must be defined in the data.')
              }
            } else if (this[location]) {
              this[location] = items
            } else {
              throw new Error('Collection must be defined in the data.')
            }
          })()
        }
      } catch (error) {
        this.$notify({
          isError: true,
          message: error.message
        })
      } finally {
        this.$setLoading(false)
      }
    },
    selectHotel(i) {
      console.log(i)
    },
    /**
     * Called when dashboard tab clicked
     */
    setActiveTab(activeTab) {
      this.activeTab = activeTab
      // if (activeTab === 'history') {
      //   this.$nextTick(() => {
      //     this.$refs.tabsHistory.initHistoryChart('daily')
      //   })
      // }
    }
  }
}
</script>
