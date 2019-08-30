<i18n>
{
  "en-US": {
    "scan": "Scan the QR Code in your room on the box below",
    "or": "Or",
    "manual": "Manually enter the following",
    "hotelCode": "Hotel Code",
    "roomCode": "Room Code",
    "hintHotelCode": "Ex: HIL1092",
    "hintRoomCode": "Ex: 4321",
    "submit": "Submit"
  },
  "en-UK": {
    "scan": "Scan the QR Code in your room on the box below",
    "or": "Or",
    "manual": "Manually enter the following",
    "hotelCode": "Hotel Code",
    "roomCode": "Room Code",
    "hintHotelCode": "Ex: HIL1092",
    "hintRoomCode": "Ex: 4321",
    "submit": "Submit"
  },
  "id": {
    "scan": "Pindai kode QR pada ruangan di kotak di bawah ini",
    "or": "Atau",
    "manual": "Masukkan secara manual",
    "hotelCode": "Kode Hotel",
    "roomCode": "Kode Ruangan",
    "hintHotelCode": "Contoh: HIL1092",
    "hintRoomCode": "Contoh: 4321",
    "submit": "Kirim"
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
                <v-img
                  src="/icons/icon-with-text.png"
                  alt="Mongo.IO"
                  max-width="150"
                  contain=""
                >
                  <template #placeholder="">
                    <v-row
                      class="fill-height ma-0"
                      align="center"
                      justify="center"
                    >
                      <v-progress-circular indeterminate="" color="grey" />
                    </v-row>
                  </template>
                </v-img>
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
        <h2 class="text-center subtitle-1 primary--text text-uppercase">
          {{ $t('or') }}
        </h2>
        <h2 class="text-center subtitle-1 primary--text mb-3">
          {{ $t('manual') }}
        </h2>
        <v-card outlined="" class="v-card--outlined-custom mb-3">
          <v-card-text>
            <v-text-field
              v-model="qr.hotelCode"
              v-validate="'required|alpha_num'"
              :error-messages="errors.collect('hotelCode')"
              :disabled="isLoading"
              :label="$t('hotelCode')"
              :hint="$t('hintHotelCode')"
              :data-vv-as="$t('hotelCode')"
              data-vv-name="hotelCode"
              data-vv-value-path="qr.hotelCode"
              name="hotelCode"
              outlined=""
              clearable=""
            />
            <v-text-field
              v-model="qr.roomCode"
              v-validate="'required|numeric'"
              :error-messages="errors.collect('roomCode')"
              :disabled="isLoading"
              :label="$t('roomCode')"
              :hint="$t('hintRoomCode')"
              :data-vv-as="$t('roomCode')"
              data-vv-name="roomCode"
              data-vv-value-path="qr.roomCode"
              name="roomCode"
              outlined=""
              clearable=""
            />
          </v-card-text>
        </v-card>
        <v-btn
          color="secondary"
          block=""
          rounded=""
          nuxt=""
          exact=""
          :to="localePath({ name: 'qr-scan' })"
        >
          <v-icon left="">mdi-camera</v-icon>
          <span>{{ $t('submit') }}</span>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  head() {
    return {
      title: 'QR Scan'
    }
  },
  data() {
    return {
      isLoading: false,
      qr: {
        hotelCode: null,
        roomCode: null
      }
    }
  },
  methods: {
    async onInit(promise) {
      try {
        this.isLoading = true
        await promise
      } catch (error) {
        if (error.name === 'NotAllowedError') {
          console.log('ERROR: you need to grant camera access permisson')
        } else if (error.name === 'NotFoundError') {
          console.log('ERROR: no camera on this device')
        } else if (error.name === 'NotSupportedError') {
          console.log('ERROR: secure context required (HTTPS, localhost)')
        } else if (error.name === 'NotReadableError') {
          console.log('ERROR: is the camera already in use?')
        } else if (error.name === 'OverconstrainedError') {
          console.log('ERROR: installed cameras are not suitable')
        } else if (error.name === 'StreamApiNotSupportedError') {
          console.log('ERROR: Stream API is not supported in this browser')
        }
      } finally {
        this.isLoading = false
      }
    },
    onDecode(string) {
      console.log(string)
    }
  }
}
</script>
