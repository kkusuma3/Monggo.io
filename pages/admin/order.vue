<i18n>
{
  "en-us": {
    "editOrder": "@:(edit) @:(order) for {name}",
    "deleteOrder": "@:(delete) @:(order) for {name}"
  },
  "en-uk": {
    "editOrder": "@:(edit) @:(order) for {name}",
    "deleteOrder": "@:(delete) @:(order) for {name}"
  },
  "id": {
    "editOrder": "@:(edit) @:(order) untuk {name}",
    "deleteOrder": "@:(delete) @:(order) untuk {name}"
  },
  "cn": {
    "editOrder": "@:(edit) @:(order) 对于 {name}",
    "deleteOrder": "@:(delete) @:(order) 对于 {name}"
  },
  "jp": {
    "editOrder": "@:(edit) @:(order) ために {name}",
    "deleteOrder": "@:(delete) @:(order) ために {name}"
  }
}
</i18n>

<template>
  <app-wrapper
    :title="title"
    :is-dialog="isDialog"
    :is-editing="isEditing"
    :is-confirming="isConfirming"
    :is-deleting="isDeleting"
    :is-add-active="role !== 'worker'"
    @trigger:refresh="initData"
    @trigger:add="onTriggerAdd"
    @dialog:close="onDialogClose"
    @dialog:action="onDialogAction"
    @delete:close="onDeleteClose"
    @delete:action="onDeleteAction"
    @confirm:close="onConfirmClose"
    @confirm:action="onConfirmAction"
  >
    <v-data-table
      :headers="headers"
      :items="items"
      :sort-by="['createdAt']"
      :sort-desc="[true]"
      :loading="isLoading"
    >
      <template #item.user="{ item }">
        <span>
          {{
            item.refData.user &&
              (item.refData.user.name || item.refData.user.email || 'Anonim')
          }}
        </span>
      </template>
      <template #item.price="{ item }">
        <span>
          {{ rate(item.refData.service, item.rates, item.count) }}
        </span>
      </template>
      <template #item.status="{ item }">
        <v-select
          v-model="item.status"
          :items="['ordered', 'processed', 'delivered', 'canceled']"
          :label="$t('status')"
          solo=""
          flat=""
          hide-details=""
          @change="onStatusChange($event, item)"
        >
          <template #selection="data">
            <v-chip
              label=""
              class="ma-1"
              :color="getStatusColor(data.item)"
              text-color="white"
            >
              <v-avatar left>
                <v-icon>
                  {{ getStatusIcon(data.item) }}
                </v-icon>
              </v-avatar>
              <span>
                {{ $t(data.item) }}
              </span>
            </v-chip>
          </template>
          <template #item="data">
            <v-chip
              label=""
              class="ma-1"
              :color="getStatusColor(data.item)"
              text-color="white"
            >
              <v-avatar left>
                <v-icon>
                  {{ getStatusIcon(data.item) }}
                </v-icon>
              </v-avatar>
              <span>
                {{ $t(data.item) }}
              </span>
            </v-chip>
          </template>
        </v-select>
      </template>
      <template #item.createdAt="{ item }">
        <time :datetime="item.createdAt">
          {{
            $moment(item.createdAt)
              .locale($i18n.locale)
              .format('llll')
          }}
        </time>
      </template>
      <template #item.updatedAt="{ item }">
        <time :datetime="item.updatedAt">
          {{
            $moment(item.updatedAt)
              .locale($i18n.locale)
              .format('llll')
          }}
        </time>
      </template>
      <template #item.action="{ item }">
        <v-tooltip bottom="">
          <template #activator="{ on }">
            <v-btn
              :class="
                `trigger-edit-${slugify(
                  item.refData && item.refData.user
                    ? item.refData.user.name
                    : 'Anonim'
                )}`
              "
              :disabled="isLoading || role === 'worker'"
              :loading="isLoading"
              class="ma-1"
              color="secondary"
              @click="onTriggerEdit(item)"
              v-on="on"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </template>
          <span>{{
            $t('editOrder', {
              name:
                item.refData && item.refData.user
                  ? item.refData.user.name
                  : 'Anonim'
            })
          }}</span>
        </v-tooltip>
        <v-tooltip bottom="">
          <template #activator="{ on }">
            <v-btn
              :class="
                `trigger-delete-${slugify(
                  item.refData && item.refData.user
                    ? item.refData.user.name
                    : 'Anonim'
                )}`
              "
              :disabled="isLoading || role === 'worker'"
              :loading="isLoading"
              class="ma-1"
              color="error"
              @click="onTriggerDelete(item)"
              v-on="on"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
          <span>{{
            $t('deleteOrder', {
              name:
                item.refData && item.refData.user
                  ? item.refData.user.name
                  : 'Anonim'
            })
          }}</span>
        </v-tooltip>
      </template>
    </v-data-table>
    <template #form="">
      <v-autocomplete
        v-model="item.hotel"
        v-validate="'required'"
        :items="hotels"
        :error-messages="errors.collect('hotel')"
        :disabled="isLoading || role === 'operator' || role === 'worker'"
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
                  'white--text': isDarkColor(getMaterialColor(item.name, true))
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
        :disabled="isLoading || role === 'operator'"
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
                  'white--text': isDarkColor(getMaterialColor(item.name, true))
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
        v-model="item.user"
        v-validate="'required'"
        :items="users"
        :error-messages="errors.collect('user')"
        :disabled="isLoading"
        item-text="name"
        item-value="uid"
        data-vv-name="user"
        :data-vv-as="$t('user')"
        name="user"
        clearable=""
        data-vv-value-path="item.user"
        required=""
        :label="$t('user')"
        outlined=""
      >
        <template #item="{ item }">
          <v-list-item-avatar>
            <v-avatar :color="getMaterialColor(item.name)" class="ma-1">
              <app-img
                v-if="item.avatar && item.avatar.length > 0"
                :src="item.avatar"
                :alt="item.name"
              />
              <span
                v-else=""
                :class="{
                  'white--text': isDarkColor(getMaterialColor(item.name, true))
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
        v-model="item.service"
        v-validate="'required'"
        :items="services"
        :error-messages="errors.collect('service')"
        :disabled="isLoading"
        item-text="name"
        item-value="uid"
        data-vv-name="service"
        :data-vv-as="$t('service')"
        name="service"
        clearable=""
        data-vv-value-path="item.service"
        required=""
        :label="$t('service')"
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
                  'white--text': isDarkColor(getMaterialColor(item.name, true))
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
      <v-slider
        v-if="service"
        v-model="item.count"
        style="margin-top: 32px; margin-bottom: 32px"
        :hint="`${service.count} in stocks`"
        :min="1"
        :max="service.count"
        :thumb-size="24"
        label="Quantity"
        persistent-hint=""
        thumb-label="always"
        ticks=""
      />
      <v-select
        v-model="item.status"
        v-validate="'required'"
        :items="statuses"
        :error-messages="errors.collect('status')"
        :disabled="isLoading"
        data-vv-name="status"
        :data-vv-as="$t('status')"
        name="status"
        clearable=""
        data-vv-value-path="item.status"
        required=""
        :label="$t('status')"
        outlined=""
      />
      <v-textarea
        v-model="item.note"
        :disabled="isLoading"
        name="note"
        clearable=""
        :label="$t('note')"
        outlined=""
        auto-grow=""
      />
    </template>
  </app-wrapper>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import uuidv4 from 'uuid/v4'
import slugify from '@sindresorhus/slugify'
import _cloneDeep from 'lodash.clonedeep'
import cleanDeep from 'clean-deep'
import isEqual from 'fast-deep-equal'
import isDarkColor from 'is-dark-color'
import materialColorHash from 'material-color-hash'
import initials from 'initials'
import pluralize from 'pluralize'
import paramCase from 'param-case'

import { db } from '~/utils/firebase'

export default {
  layout: 'admin',
  head() {
    return {
      title: `${this.$t(paramCase(this.title))} - Admin`
    }
  },
  data() {
    return {
      title: 'Order', // Hold page name
      isDialog: false, // Hold dialog state for editing and adding
      isEditing: false, // Hold editing state
      isConfirming: false, // Hold edit confirmation state
      isDeleting: false, // Hold deleting dialog state
      isSaved: false, // Hold whether current data is saved
      isEditingStatus: false, // Hold whether current editing status is only changing status
      // Array hold table column
      headers: [
        { text: this.$t('hotel'), value: 'refData.hotel.name' },
        { text: this.$t('room'), value: 'refData.room.name' },
        { text: this.$t('user'), value: 'user' },
        { text: this.$t('service'), value: 'refData.service.name' },
        { text: this.$t('price'), value: 'price' },
        { text: this.$t('status'), value: 'status', align: 'center' },
        {
          text: this.$t('createdAt'),
          value: 'createdAt',
          align: 'center',
          sort: (a, b) => {
            return this.$moment(a) - this.$moment(b)
          }
        },
        {
          text: this.$t('updatedAt'),
          value: 'updatedAt',
          align: 'center',
          sort: (a, b) => {
            return this.$moment(a) - this.$moment(b)
          }
        },
        {
          text: this.$t('action'),
          value: 'action',
          align: 'center',
          sortable: false
        }
      ],
      items: [], // Array hold all order data
      // Hold order data
      item: {
        uid: uuidv4(),
        hotel: null,
        room: null,
        user: null,
        service: null,
        count: null,
        status: null,
        note: null,
        rates: [],
        createdAt: null,
        updatedAt: null
      },
      // Hold original order data, useful to calculate whether
      // the editing data has changed or not
      itemOriginal: {
        uid: uuidv4(),
        hotel: null,
        room: null,
        user: null,
        service: null,
        count: null,
        status: null,
        note: null,
        rates: [],
        createdAt: null,
        updatedAt: null
      },
      hotels: [], // Array hold all hotel data
      rooms: [], // Array hold all rooms data
      users: [], // Array hold all user data
      services: [], // Array hold all service data
      // Array hold status data
      statuses: [
        { text: this.$t('ordered'), value: 'ordered' },
        { text: this.$t('processed'), value: 'processed' },
        { text: this.$t('delivered'), value: 'delivered' },
        { text: this.$t('canceled'), value: 'canceled' }
      ],
      // Hold currency symbol
      currencySymbols: {
        USD: '$',
        GBP: '£',
        IDR: 'Rp'
      },
      // Hold interval id
      interval: null
    }
  },
  computed: {
    ...mapState(['isLoading']),
    ...mapState('user', ['user']),
    ...mapGetters('user', ['isAuth', 'role']),
    collection() {
      return pluralize(paramCase(this.title))
    },
    slugify() {
      return string => {
        if (!string) {
          return
        }
        string.toString()
        return slugify(string)
      }
    },
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
    },
    isEdited() {
      const item = _cloneDeep(this.item)
      delete item.refData
      delete item.hotelRef
      delete item.roomRef
      delete item.userRef
      delete item.serviceRef

      const itemOriginal = _cloneDeep(this.itemOriginal)
      delete itemOriginal.refData
      delete itemOriginal.hotelRef
      delete itemOriginal.roomRef
      delete itemOriginal.userRef
      delete itemOriginal.serviceRef
      return this.isEditing && !isEqual(item, itemOriginal)
    },
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
          case 'canceled':
            return 'error'
          default:
            return ''
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
          case 'canceled':
            return 'mdi-cancel'
          default:
            return ''
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
    },
    service() {
      if (!this.item.service) {
        return null
      }
      const service = this.services.find(({ uid }) => uid === this.item.service)
      return service
    },
    rate() {
      return ({ currency, price }, rates, count) => {
        if (!rates) {
          return `${this.currencySymbols[currency]}0`
        }
        if (price === 0) {
          return this.$t('free')
        }
        let newPrice = price
        if (count) {
          newPrice = price * count
        }
        if (this.isAuth) {
          if (rates.length > 0) {
            if (currency === this.user.currency) {
              return `${this.currencySymbols[currency]}${newPrice}`
            }
            const rate = rates.find(({ base }) => base === currency)
            if (rate) {
              return `${this.currencySymbols[this.user.currency]}${parseFloat(
                newPrice * rate.rates[this.user.currency] || 1
              ).toFixed(2)}`
            }
            return `${this.currencySymbols[currency]}0`
          }
          return `${this.currencySymbols[currency]}0`
        }
        return `${this.currencySymbols[currency]}0`
      }
    }
  },
  watch: {
    'item.hotel': async function(hotel) {
      if (hotel) {
        await Promise.all([
          this.getItems(
            db.collection('rooms').where('hotel', '==', hotel),
            'rooms'
          ),
          this.getItems(
            db.collection('services').where('hotel', '==', hotel),
            'services'
          )
        ])
      } else {
        this.rooms = []
        this.services = []
      }
    }
  },
  mounted() {
    this.initData()
    this.interval = setInterval(() => {
      this.initData()
    }, 60 * 1000)
  },
  beforeDestroy() {
    clearInterval(this.interval)
  },
  methods: {
    /**
     * Called to initialize the data
     */
    async initData() {
      try {
        this.$setLoading(true)
        if (this.role === 'operator') {
          this.item.hotel = this.user.hotel
          this.itemOriginal.hotel = this.itemOriginal.hotel

          await this.getItems(
            db
              .collection(this.collection)
              .where('hotel', '==', this.user.hotel),
            'items',
            this.itemsCallback
          )
        } else {
          await this.getItems(this.collection, 'items', this.itemsCallback)
        }
        await Promise.all([
          this.getItems('hotels'),
          this.getItems(
            db.collection('users').where('role', '==', 'guest'),
            'users'
          ),
          this.getRates()
        ])
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
     * Called to get order relation data
     */
    async itemsCallback(data) {
      try {
        this.$setLoading(true)
        if (data.hotelRef && data.roomRef && data.userRef && data.serviceRef) {
          const [
            hotelRefDoc,
            roomRefDoc,
            userRefDoc,
            serviceRefDoc
          ] = await Promise.all([
            data.hotelRef.get(),
            data.roomRef.get(),
            data.userRef.get(),
            data.serviceRef.get()
          ])
          const [hotelRef, roomRef, userRef, serviceRef] = await Promise.all([
            hotelRefDoc.data(),
            roomRefDoc.data(),
            userRefDoc.data(),
            serviceRefDoc.data()
          ])
          delete data.hotelRef
          delete data.roomRef
          delete data.userRef
          delete data.serviceRef
          return {
            hotel: hotelRef,
            room: roomRef,
            user: userRef,
            service: serviceRef
          }
        }
        return null
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
     * Called to reset data to original form
     */
    reset() {
      const item = {
        uid: uuidv4(),
        hotel: null,
        room: null,
        user: null,
        service: null,
        count: null,
        status: null,
        note: null,
        rates: [],
        createdAt: null,
        updatedAt: null
      }
      this.item = _cloneDeep(item)
      this.itemOriginal = _cloneDeep(item)
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
        const items = await Promise.all(
          snaps.docs.map(async doc => {
            const data = doc.data()
            let rates = []
            if (data.rates) {
              rates = data.rates.map(rate => ({
                ...rate,
                date: rate && rate.date && rate.date.toDate()
              }))
            }
            if (cb) {
              const refData = await cb(data)
              return {
                ...data,
                refData,
                rates,
                createdAt: data && data.createdAt && data.createdAt.toDate(),
                updatedAt: data && data.updatedAt && data.updatedAt.toDate()
              }
            } else {
              return {
                ...data,
                rates,
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
     * Called to trigger displaying dialog for adding data
     */
    onTriggerAdd() {
      this.$validator.reset()
      this.isDialog = true
    },
    /**
     * Called to trigger displaying dialog for editing data
     */
    onTriggerEdit(item) {
      this.isDialog = true
      this.isEditing = true

      this.item = _cloneDeep(item)
      this.itemOriginal = _cloneDeep(item)
    },
    /**
     * Called to trigger displaying dialog for deleting data
     */
    onTriggerDelete(item) {
      this.isDeleting = true

      this.item = _cloneDeep(item)
      this.itemOriginal = _cloneDeep(item)
    },
    /**
     * Called when the user close dialog for adding or editing data
     */
    onDialogClose() {
      if (this.isEdited) {
        if (!this.isSaved) {
          this.isConfirming = true
          return
        }
      }
      this.$validator.reset()
      this.isDialog = false
      this.isEditing = false
      this.isSaved = false
      this.reset()
    },
    /**
     * Called when the user click the save or edit button
     */
    async onDialogAction() {
      try {
        const isValid = await this.$validator.validateAll()
        if (isValid && this.item.count > 0) {
          this.$setLoading(true)
          const date = this.$moment().toDate()
          const rates = this.item.rates.map(rate => ({
            ...rate,
            date: this.$moment(rate.date).toDate()
          }))
          const payload = {
            ..._cloneDeep(this.item),
            rates,
            createdAt: this.isEditing ? this.item.createdAt : date,
            updatedAt: date
          }
          if (this.isEdited || this.isEditingStatus) {
            delete payload.refData
          }
          payload.hotelRef = db.collection('hotels').doc(payload.hotel)
          payload.roomRef = db.collection('rooms').doc(payload.room)
          payload.userRef = db.collection('users').doc(payload.user)
          payload.serviceRef = db.collection('services').doc(payload.service)
          this.isSaved = true
          await db
            .collection(this.collection)
            .doc(payload.uid)
            .set(
              cleanDeep(payload, {
                emptyArrays: false,
                emptyObjects: false,
                emptyStrings: false,
                nullValues: false
              }),
              { merge: true }
            )
          if (!this.isEditingStatus) {
            if (
              !this.isEditing ||
              this.item.count !== this.itemOriginal.count
            ) {
              await db
                .collection('services')
                .doc(payload.service)
                .set(
                  { count: this.service.count - payload.count },
                  { merge: true }
                )
            }
            if (this.isEditing && this.item.status === 'canceled') {
              await db
                .collection('services')
                .doc(payload.service)
                .set(
                  { count: this.service.count + payload.count },
                  { merge: true }
                )
            }
          }
          await this.getItems(this.collection, 'items', this.itemsCallback)
          await this.onDialogClose()
          await this.$notify({ kind: 'success', message: this.$t('dataSaved') })
        }
      } catch (error) {
        console.log(error)
        this.$notify({
          isError: true,
          message: error.message
        })
      } finally {
        this.$setLoading(false)
      }
    },
    /**
     * Called when the user close delete confirmation dialog
     */
    onDeleteClose() {
      this.$validator.reset()
      this.isDeleting = false
      this.reset()
    },
    /**
     * Called when the user click the delete button on dialog
     */
    async onDeleteAction() {
      try {
        this.$setLoading(true)
        const item = _cloneDeep(this.item)

        await db
          .collection(this.collection)
          .doc(item.uid)
          .delete()
        if (item.status === 'ordered') {
          await db
            .collection('services')
            .doc(this.item.service)
            .set(
              { count: this.service.count + this.item.count },
              { merge: true }
            )
        }
        await this.getItems(this.collection, 'items', this.itemsCallback)
        await this.onDeleteClose()
        await this.$notify({ kind: 'success', message: this.$t('dataDeleted') })
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
     * Called when the user close edit confirmation dialog
     */
    onConfirmClose() {
      this.isConfirming = false
    },
    /**
     * Called when the user click yes in edit confirmation dialog
     */
    onConfirmAction() {
      this.onConfirmClose()
      this.$validator.reset()
      this.isDialog = false
      this.isEditing = false
      this.reset()
    },
    /**
     * Called to get currency rates data
     */
    async getRates() {
      try {
        this.$setLoading(true)
        const rates = ['USD', 'GBP', 'IDR']
        const ratesConversion = await Promise.all(
          rates.map(rate =>
            this.$http.$get(
              `https://api.exchangeratesapi.io/latest?base=${rate}&symbols=${rates
                .filter(r => r !== rate)
                .join(',')}`
            )
          )
        )
        this.item.rates = ratesConversion
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
     * Called when status changed
     */
    async onStatusChange(event, item) {
      try {
        this.$setLoading(true)
        this.isEditingStatus = true
        this.item = _cloneDeep(item)
        this.itemOriginal = _cloneDeep(item)
        await this.onDialogAction()
      } catch (error) {
        this.$notify({
          isError: true,
          message: error.message
        })
      } finally {
        this.isEditingStatus = false
        this.$setLoading(false)
      }
    }
  }
}
</script>
