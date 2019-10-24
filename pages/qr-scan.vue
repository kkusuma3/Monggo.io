<i18n>
{
  "en-us": {
    "scan": "Scan the QR Code in your room on the box below",
    "or": "Or",
    "manual": "Manually enter the following",
    "hotelCode": "Hotel Code",
    "roomCode": "Room Code",
    "hintHotelCode": "Ex: HIL1092",
    "hintRoomCode": "Ex: 4321",
    "submit": "Submit",
    "qrScan": "@:(qr-code) Scan"
  },
  "en-uk": {
    "scan": "Scan the QR Code in your room on the box below",
    "or": "Or",
    "manual": "Manually enter the following",
    "hotelCode": "Hotel Code",
    "roomCode": "Room Code",
    "hintHotelCode": "Ex: HIL1092",
    "hintRoomCode": "Ex: 4321",
    "submit": "Submit",
    "qrScan": "@:(qr-code) Scan"
  },
  "id": {
    "scan": "Pindai kode QR pada ruangan di kotak di bawah ini",
    "or": "Atau",
    "manual": "Masukkan secara manual",
    "hotelCode": "Kode Hotel",
    "roomCode": "Kode Ruangan",
    "hintHotelCode": "Contoh: HIL1092",
    "hintRoomCode": "Contoh: 4321",
    "submit": "Kirim",
    "qrScan": "Pemindaian @:(qr-code)"
  }
}
</i18n>

<template>
  <v-container fluid="">
    <v-row justify="center">
      <v-col cols="10" md="4">
        <div class="mb-3">
          <v-row justify="center">
            <v-col>
              <v-btn
                icon=""
                color="primary"
                nuxt=""
                exact=""
                :to="localePath({ name: 'index' })"
              >
                <v-icon>mdi-arrow-left</v-icon>
              </v-btn>
            </v-col>
            <v-col>
              <h1
                class="text-center headline primary--text d-flex align-center justify-center"
                aria-label="Monggo.IO"
              >
                <app-img
                  src="/icons/icon-with-text.png"
                  alt="Mongo.IO"
                  max-width="150"
                  contain=""
                />
              </h1>
            </v-col>
            <v-spacer />
          </v-row>
          <h2 class="text-center subtitle-1 primary--text">
            {{ $t('scan') }}
          </h2>
        </div>
        <v-card outlined="" class="v-card--outlined-custom mb-3">
          <v-card-text>
            <qrcode-stream @decode="onDecode" @init="onInit">
              <v-fade-transition>
                <v-row
                  v-if="isLoading"
                  class="fill-height ma-0"
                  align="center"
                  justify="center"
                >
                  <v-progress-circular indeterminate="" color="grey" />
                </v-row>
              </v-fade-transition>
            </qrcode-stream>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<!-- <h2 class="text-center subtitle-1 primary--text text-uppercase">
          {{ $t('or') }}
        </h2>
        <h2 class="text-center subtitle-1 primary--text mb-3">
          {{ $t('manual') }}
        </h2>
        <v-card outlined="" class="v-card--outlined-custom mb-3">
          <v-card-text>
            <v-autocomplete
              v-model="item.hotel"
              v-validate="'required'"
              :items="hotels"
              :error-messages="errors.collect('hotel')"
              :disabled="isLoading"
              item-text="name"
              item-value="uid"
              data-vv-name="hotel"
              :data-vv-as="$t('hotel')"
              name="hotel"
              clearable=""
              data-vv-value-path="item.hotel"
              required=""
              :label="$t('hotel')"
              outlined=""
            >
              <template #item="{ item }">
                <v-list-item-avatar>
                  <v-avatar :color="getMaterialColor(item.name)" class="ma-1">
                    <app-img
                      v-if="item.imagesMeta && item.imagesMeta.length > 0"
                      :src="item.imagesMeta[0].url"
                      :alt="item.imagesMeta[0].name"
                    />
                    <span
                      v-else=""
                      :class="{
                        'white--text': isDarkColor(
                          getMaterialColor(item.name, true)
                        )
                      }"
                    >
                      {{ getInitials(item.name) }}
                    </span>
                  </v-avatar>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{ item.name }}</v-list-item-title>
                </v-list-item-content>
              </template>
            </v-autocomplete>
            <v-autocomplete
              v-model="item.room"
              v-validate="'required'"
              :items="rooms"
              :error-messages="errors.collect('room')"
              :disabled="isLoading"
              item-text="name"
              item-value="uid"
              data-vv-name="room"
              :data-vv-as="$t('room')"
              name="room"
              clearable=""
              data-vv-value-path="item.room"
              required=""
              :label="$t('room')"
              outlined=""
            >
              <template #item="{ item }">
                <v-list-item-avatar>
                  <v-avatar :color="getMaterialColor(item.name)" class="ma-1">
                    <app-img
                      v-if="item.imagesMeta && item.imagesMeta.length > 0"
                      :src="item.imagesMeta[0].url"
                      :alt="item.imagesMeta[0].name"
                    />
                    <span
                      v-else=""
                      :class="{
                        'white--text': isDarkColor(
                          getMaterialColor(item.name, true)
                        )
                      }"
                    >
                      {{ getInitials(item.name) }}
                    </span>
                  </v-avatar>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{ item.name }}</v-list-item-title>
                </v-list-item-content>
              </template>
            </v-autocomplete>
          </v-card-text>
        </v-card>
        <v-btn
          :disabled="isLoading || hotels.length === 0 || rooms.length === 0"
          :loading="isLoading"
          color="secondary"
          block=""
          rounded=""
          @click="onSubmit"
        >
          <v-icon left="">mdi-send</v-icon>
          <span>{{ $t('submit') }}</span> -->
<!-- </v-btn> -->
<!-- </v-col> -->
<!-- </v-row> -->
<!-- </v-container>
</template> -->

<script>
import { mapState, mapGetters } from 'vuex'
import pDebounce from 'p-debounce'
import isDarkColor from 'is-dark-color'
import materialColorHash from 'material-color-hash'
import initials from 'initials'
import { auth, db } from '~/utils/firebase'
import { types as guestTypes } from '~/store/guest'

export default {
  head() {
    return {
      title: this.$t('qrScan')
    }
  },
  data() {
    return {
      item: {
        hotel: null, // Hold hotel id
        room: null // Hold room id
      },
      hotels: [], // Array hold hotel list
      rooms: [] // Array hold room list
    }
  },
  computed: {
    ...mapGetters('user', ['isAuth']),
    ...mapState(['isLoading']),
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
  watch: {
    'item.hotel': async function(hotel) {
      if (hotel) {
        await Promise.all([
          this.getItems(
            db
              .collection('rooms')
              .where('hotel', '==', hotel)
              .where('hasQr', '==', true),
            'rooms'
          )
        ])
      } else {
        this.rooms = []
      }
    }
  },
  beforeDestroy() {
    this.$setLoading(false)
  },
  mounted() {
    this.initData()
  },
  methods: {
    /**
     * Method to initialize the data
     */
    async initData() {
      try {
        this.$setLoading(true)
        await this.getItems('hotels')
      } catch (error) {
        this.$notify({
          kind: 'error',
          message: error.message
        })
      } finally {
        this.$setLoading(false)
      }
    },
    /**
     * Methot to initialize the qr code scanner
     */
    async onInit(promise) {
      try {
        this.$setLoading(true)
        await promise
      } catch (error) {
        if (error.name === 'NotAllowedError') {
          this.$notify({
            kind: 'error',
            message: 'You need to grant camera access permisson'
          })
        } else if (error.name === 'NotFoundError') {
          this.$notify({ kind: 'error', message: 'No camera on this device' })
        } else if (error.name === 'NotSupportedError') {
          this.$notify({
            kind: 'error',
            message: 'Secure context required (HTTPS, localhost)'
          })
        } else if (error.name === 'NotReadableError') {
          this.$notify({
            kind: 'error',
            message: 'Is the camera already in use?'
          })
        } else if (error.name === 'OverconstrainedError') {
          this.$notify({
            kind: 'error',
            message: 'Installed cameras are not suitable'
          })
        } else if (error.name === 'StreamApiNotSupportedError') {
          this.$notify({
            kind: 'error',
            message: 'Stream API is not supported in this browser'
          })
        }
      } finally {
        this.$setLoading(false)
      }
    },
    /**
     * Called when the qr code is decoded.
     *
     * @param {string} uid
     */
    onDecode: pDebounce(
      async function(uid) {
        try {
          this.$setLoading(true)
          if (!this.isAuth) {
            await auth.signInAnonymously()
          }
          this.$store.commit(`guest/${guestTypes.SET_UID}`, uid)
          this.$cookies.set('qr', uid)
          const path = this.localePath({ name: 'guest' })
          this.$router.replace(path)
        } catch (error) {
          this.$notify({
            kind: 'error',
            message: error.message
          })
        } finally {
          this.$setLoading(true)
        }
      },
      5000,
      { leading: true }
    ),
    /**
     * Called when the user click the submit button
     */
    async onSubmit() {
      try {
        this.$setLoading(true)
        const qrRef = await db
          .collection('qr-codes')
          .where('hotel', '==', this.item.hotel)
          .where('room', '==', this.item.room)
          .get()
        const [qr] = await Promise.all(
          qrRef.docs.map(doc => {
            const data = doc.data()
            return {
              ...data,
              createdAt: data && data.createdAt && data.createdAt.toDate(),
              updatedAt: data && data.updatedAt && data.updatedAt.toDate()
            }
          })
        )
        if (qr && qr.uid) {
          await this.onDecode(qr.uid)
        }
      } catch (error) {
        this.$notify({
          kind: 'error',
          message: error.message
        })
      } finally {
        this.$setLoading(false)
      }
    },
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
    }
  }
}
</script>
