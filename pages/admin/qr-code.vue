<i18n>
{
  "en-us": {
    "alreadyHasQr": "Already has @:(qr-code)",
    "notHasQr": "Doesn't has @:(qr-code)",
    "uniqueQr": "Please choose another room, this room already has @:(qr-code)",
    "seeQr": "@:(see) @:(qr-code) for {name}",
    "editQr": "@:(edit) @:(qr-code) for {name}",
    "deleteQr": "@:(delete) @:(qr-code) for {name}"
  },
  "en-uk": {
    "alreadyHasQr": "Already has @:(qr-code)",
    "notHasQr": "Doesn't has @:(qr-code)",
    "uniqueQr": "Please choose another room, this room already has @:(qr-code)",
    "seeQr": "@:(see) @:(qr-code) for {name}",
    "editQr": "@:(edit) @:(qr-code) for {name}",
    "deleteQr": "@:(delete) @:(qr-code) for {name}"
  },
  "id": {
    "alreadyHasQr": "Telah memiliki @:(qr-code)",
    "notHasQr": "Belum memiliki @:(qr-code)",
    "uniqueQr": "Silakan pilih kamar lain, kamar ini sudah memiliki @:(qr-code)",
    "seeQr": "@:(see) @:(qr-code) untuk {name}",
    "editQr": "@:(edit) @:(qr-code) untuk {name}",
    "deleteQr": "@:(delete) @:(qr-code) untuk {name}"
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
    :is-previewing="isPreviewing"
    :preview-width="500"
    @trigger:refresh="initData"
    @trigger:add="onTriggerAdd"
    @dialog:close="onDialogClose"
    @dialog:action="onDialogAction"
    @delete:close="onDeleteClose"
    @delete:action="onDeleteAction"
    @confirm:close="onConfirmClose"
    @confirm:action="onConfirmAction"
    @preview:close="onPreviewClose"
    @preview:action="onPreviewClose"
  >
    <v-data-table
      :headers="headers"
      :items="items"
      :sort-by="['createdAt']"
      :sort-desc="[true]"
      :loading="isLoading"
    >
      <template #item.image="{ item }">
        <qr-code :value="item.uid" :options="{ scale: 1 }" />
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
              :data-cy="
                `trigger-preview-${slugify(
                  isExist(item.refData.room) ? item.refData.room.name : 'Room'
                )}`
              "
              :disabled="isLoading"
              :loading="isLoading"
              class="ma-1"
              color="secondary"
              @click="onTriggerPreview(item)"
              v-on="on"
            >
              <v-icon>mdi-qrcode</v-icon>
            </v-btn>
          </template>
          <span>{{
            $t('seeQr', {
              name: isExist(item.refData.room) ? item.refData.room.name : 'Room'
            })
          }}</span>
        </v-tooltip>
        <v-tooltip bottom="">
          <template #activator="{ on }">
            <v-btn
              :data-cy="
                `trigger-edit-${slugify(
                  isExist(item.refData.room) ? item.refData.room.name : 'Room'
                )}`
              "
              :disabled="isLoading"
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
            $t('seeQr', {
              name: isExist(item.refData.room) ? item.refData.room.name : 'Room'
            })
          }}</span>
        </v-tooltip>
        <v-tooltip bottom="">
          <template #activator="{ on }">
            <v-btn
              :data-cy="
                `trigger-delete-${slugify(
                  isExist(item.refData.room) ? item.refData.room.name : 'Room'
                )}`
              "
              :disabled="isLoading"
              :loading="isLoading"
              class="ma-1"
              color="error"
              @click="onTriggerDelete(item)"
              v-on="on"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
          <span>
            {{
              $t('deleteQr', {
                name: isExist(item.refData.room)
                  ? item.refData.room.name
                  : 'Room'
              })
            }}
          </span>
        </v-tooltip>
      </template>
    </v-data-table>
    <template #form="">
      <v-autocomplete
        v-model="item.hotel"
        v-validate="'required'"
        :items="hotels"
        :error-messages="errors.collect('hotel')"
        :disabled="isLoading || role === 'operator'"
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
        :disabled="isLoading"
        item-text="name"
        item-value="uid"
        data-vv-name="room"
        data-vv-as="Room"
        name="room"
        clearable=""
        data-vv-value-path="item.room"
        required=""
        label="Room"
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
            <v-list-item-title>
              {{ item.name }}
            </v-list-item-title>
          </v-list-item-content>
          <v-tooltip bottom="">
            <template #activator="{ on }">
              <v-list-item-action v-on="on">
                <v-icon>
                  {{ item.hasQr ? 'mdi-check' : 'mdi-close' }}
                </v-icon>
              </v-list-item-action>
            </template>
            <span>
              {{ item.hasQr ? $t('alreadyHasQr') : $t('notHasQr') }}
            </span>
          </v-tooltip>
        </template>
      </v-autocomplete>
    </template>
    <template #preview="">
      <div class="d-flex justify-center align-center">
        <qr-code
          v-if="isPreviewing"
          :value="item.uid"
          :options="{ scale: 5 }"
        />
      </div>
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
import { paramCase } from 'param-case'
import QrCode from '@chenfengyuan/vue-qrcode'

import { db } from '~/utils/firebase'

export default {
  layout: 'admin',
  components: {
    QrCode
  },
  data() {
    return {
      title: 'QR Code', // Hold page name
      isDialog: false, // Hold dialog state for editing and adding
      isEditing: false, // Hold editing state
      isConfirming: false, // Hold edit confirmation state
      isDeleting: false, // Hold deleting dialog state
      isPreviewing: false, // Hold previewing dialog state
      isSaved: false, // Hold whether current data is saved
      // Array hold table column
      headers: [
        {
          text: this.$tc('image'),
          value: 'image',
          align: 'center',
          sortable: false
        },
        { text: this.$t('hotel'), value: 'refData.hotel.name' },
        { text: this.$t('room'), value: 'refData.room.name' },
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
      items: [], // Array hold all qr code data
      rooms: [],
      // Hold qr code data
      item: {
        uid: uuidv4(),
        room: null,
        hotel: null,
        createdAt: null,
        updatedAt: null
      },
      // Hold original qr code data, useful to calculate whether
      // the editing data has changed or not
      itemOriginal: {
        uid: uuidv4(),
        room: null,
        hotel: null,
        createdAt: null,
        updatedAt: null
      },
      hotels: []
    }
  },
  head() {
    return {
      title: `${this.$t(paramCase(this.title))} - Admin`
    }
  },
  computed: {
    ...mapState(['isLoading']),
    ...mapState('user', ['user']),
    ...mapGetters('user', ['role']),
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

      const itemOriginal = _cloneDeep(this.itemOriginal)
      delete itemOriginal.refData
      delete itemOriginal.hotelRef
      delete itemOriginal.roomRef
      return this.isEditing && !isEqual(item, itemOriginal)
    }
  },
  watch: {
    async 'item.hotel'(hotel) {
      if (hotel) {
        await Promise.all([
          this.getItems(
            db.collection('rooms').where('hotel', '==', hotel),
            'rooms',
            this.roomsCallback
          )
        ])
      } else {
        this.rooms = []
      }
    },
    'item.room'(id) {
      if (id) {
        const room = this.rooms.find(({ uid }) => uid === id)
        if (id !== this.itemOriginal.room) {
          if (room && room.hasQr && !this.isDeleting && !this.isPreviewing) {
            this.$notify({
              isError: true,
              message: this.$t('uniqueQr')
            })
            this.item.room = null
          }
        }
        if (room) {
          this.item.hotel = room.hotel
        }
      } else {
        this.item.hotel = null
      }
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    isExist(obj) {
      return obj !== null && typeof obj !== 'undefined'
    },
    /**
     * Called to initialize the data
     */
    async initData() {
      try {
        this.$setLoading(true)
        if (this.role === 'operator') {
          this.item.hotel = this.user.hotel
          // eslint-disable-next-line
          this.itemOriginal.hotel = this.itemOriginal.hotel

          await Promise.all([
            this.getItems(
              db
                .collection(this.collection)
                .where('hotel', '==', this.user.hotel),
              'items',
              this.itemsCallback
            ),
            this.getItems('hotels'),
            this.getItems(
              db.collection('rooms').where('hotel', '==', this.user.hotel),
              'rooms',
              this.roomsCallback
            )
          ])
        } else {
          await Promise.all([
            this.getItems(this.collection, 'items', this.itemsCallback),
            this.getItems('hotels')
          ])
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
    /**
     * Called to get qr code relation data
     */
    async itemsCallback(data) {
      try {
        this.$setLoading(true)
        if (data.hotelRef && data.roomRef) {
          const [hotelRefDoc, roomRefDoc] = await Promise.all([
            data.hotelRef.get(),
            data.roomRef.get()
          ])
          const [hotelRef, roomRef] = await Promise.all([
            hotelRefDoc.data(),
            roomRefDoc.data()
          ])
          delete data.hotelRef
          delete data.roomRef
          return {
            hotel: hotelRef,
            room: roomRef
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
     * Called to get room relation data
     */
    async roomsCallback(data) {
      try {
        this.$setLoading(true)
        const hotelRefDoc = await data.hotelRef.get()
        const hotelRef = hotelRefDoc.data()
        delete data.hotelRef
        return {
          hotel: hotelRef
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
    /**
     * Called to reset data to original form
     */
    reset() {
      const item = {
        uid: uuidv4(),
        room: null,
        hotel: null,
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
        if (snaps && snaps.docs) {
          const items = await Promise.all(
            snaps.docs.map(async doc => {
              const data = doc.data()
              if (cb) {
                const refData = await cb(data)
                return {
                  ...data,
                  refData,
                  images: [],
                  createdAt: data && data.createdAt && data.createdAt.toDate(),
                  updatedAt: data && data.updatedAt && data.updatedAt.toDate()
                }
              } else {
                return {
                  ...data,
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
    /**
     * Called to trigger displaying dialog for adding data
     */
    onTriggerAdd() {
      this.isDialog = true
    },
    /**
     * Called to trigger displaying dialog for editing data
     */
    onTriggerEdit(_item) {
      this.isDialog = true
      this.isEditing = true

      this.item = _cloneDeep(_item)
      this.itemOriginal = _cloneDeep(_item)
    },
    /**
     * Called to trigger displaying dialog for deleting data
     */
    onTriggerDelete(_item) {
      this.isDeleting = true

      this.item = _cloneDeep(_item)
      this.itemOriginal = _cloneDeep(_item)
    },
    /**
     * Called to trigger displaying dialog for previewing image
     */
    onTriggerPreview(item) {
      this.isPreviewing = true
      this.item = _cloneDeep(item)
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
        if (isValid) {
          this.$setLoading(true)
          const date = this.$moment().toDate()
          const payload = {
            ..._cloneDeep(this.item),
            createdAt: this.isEditing ? this.item.createdAt : date,
            updatedAt: date
          }
          const room = this.rooms.find(({ uid }) => uid === payload.room)

          payload.roomRef = db.collection('rooms').doc(payload.room)
          payload.hotelRef = db.collection('hotels').doc(room.hotel)
          delete payload.refData

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
          await db
            .collection('rooms')
            .doc(payload.room)
            .set({ hasQr: true }, { merge: true })
          if (this.isEdited) {
            await db
              .collection('rooms')
              .doc(payload.room)
              .set({ hasQr: false }, { merge: true })
            delete payload.refData
          }
          await this.initData()
          await this.onDialogClose()
          await this.$notify({ kind: 'success', message: this.$t('dataSaved') })
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
        await db
          .collection('rooms')
          .doc(item.room)
          .set({ hasQr: false }, { merge: true })
        await this.initData()
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
     * Called when the user close image preview
     */
    onPreviewClose() {
      this.isPreviewing = false
      this.reset()
    },
    /**
     * Called when the user click ok on image preview
     */
    onPreviewAction() {
      this.onPreviewClose()
    }
  }
}
</script>
