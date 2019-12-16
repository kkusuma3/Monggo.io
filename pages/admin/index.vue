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
    <template v-if="activeTab === 'average'">
      <v-row>
        <v-col cols="12" md="4">
          <v-card>
            <v-card-text>
              <div>Word of the Day</div>
              <p class="display-1 text--primary">
                be•nev•o•lent
              </p>
              <p>adjective</p>
              <div class="text--primary">
                well meaning and kindly.<br />
                "a benevolent smile"
              </div>
            </v-card-text>
            <v-card-actions>
              <v-btn text color="deep-purple accent-4">
                Learn More
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card>
            <v-card-text>
              <div>Word of the Day</div>
              <p class="display-1 text--primary">
                be•nev•o•lent
              </p>
              <p>adjective</p>
              <div class="text--primary">
                well meaning and kindly.<br />
                "a benevolent smile"
              </div>
            </v-card-text>
            <v-card-actions>
              <v-btn text color="deep-purple accent-4">
                Learn More
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card>
            <v-card-text>
              <div>Word of the Day</div>
              <p class="display-1 text--primary">
                be•nev•o•lent
              </p>
              <p>adjective</p>
              <div class="text--primary">
                well meaning and kindly.<br />
                "a benevolent smile"
              </div>
            </v-card-text>
            <v-card-actions>
              <v-btn text color="deep-purple accent-4">
                Learn More
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </template>
    <template v-else-if="activeTab === 'hitoday'">
      ss
    </template>
    <template v-else-if="activeTab === 'history'">
      pp
    </template>
  </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { db } from '~/utils/firebase'

export default {
  layout: 'admin',
  head() {
    return {
      title: 'Dashboard - Admin'
    }
  },
  data() {
    return {
      activeTab: 'average',
      items: [], // Array hold all dashboard data
      hotels: [], // Array hold hotel data
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
            // this.getItems(
            //   db
            //     .collection(this.collection)
            //     .where('hotel', '==', this.user.hotel)
            //     .orderBy('createdAt', 'desc'),
            //   'items',
            //   this.itemsCallback
            // ),
            this.getItems(
              db
                .collection('hotels')
                .where('uid', '==', this.user.hotel)
                .orderBy('createdAt', 'desc'),
              'hotels'
            )
          ])
        }

        console.log(this.hotels)
      } catch (error) {
        this.$notify({
          isError: true,
          message: error.message
        })
      } finally {
        this.$setLoading(false)
      }
    },
    async itemsCallback(data) {
      try {
        this.$setLoading(true)
        let refData = null
        if (data.hotelRef) {
          const hotelRefDoc = await data.hotelRef.get()
          let hotelRef = hotelRefDoc.data()
          hotelRef = {
            ...hotelRef,
            createdAt:
              hotelRef && hotelRef.createdAt && hotelRef.createdAt.toDate(),
            updatedAt:
              hotelRef && hotelRef.updatedAt && hotelRef.updatedAt.toDate()
          }
          delete data.hotelRef
          refData = {
            hotel: hotelRef
          }
        }
        if (data.userRef) {
          const userRefDoc = await data.userRef.get()
          let userRef = userRefDoc.data()
          userRef = {
            ...userRef,
            createdAt:
              userRef && userRef.createdAt && userRef.createdAt.toDate(),
            updatedAt:
              userRef && userRef.updatedAt && userRef.updatedAt.toDate()
          }
          delete data.userRef
          refData = {
            ...refData,
            user: userRef
          }
        }
        return refData
      } catch (error) {
        this.$notify({
          isError: true,
          message: error.message
        })
      } finally {
        this.$setLoading(false)
      }
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
                  imagesMeta: data.imagesMeta.map(meta => ({
                    ...meta,
                    createdAt: meta && meta.createdAt && meta.createdAt.toDate()
                  })),
                  images: [],
                  createdAt: data && data.createdAt && data.createdAt.toDate(),
                  updatedAt: data && data.updatedAt && data.updatedAt.toDate()
                }
              } else {
                return {
                  ...data,
                  imagesMeta: data.imagesMeta.map(meta => ({
                    ...meta,
                    createdAt: meta && meta.createdAt && meta.createdAt.toDate()
                  })),
                  images: [],
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
    setActiveTab(activeTab) {
      this.activeTab = activeTab
    }
  }
}
</script>
