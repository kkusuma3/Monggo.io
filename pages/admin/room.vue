<i18n>
{
  "en-us": {
    "seeQr": "@:(see) @:(qr-code) for {name}"
  },
  "en-uk": {
    "seeQr": "@:(see) @:(qr-code) for {name}"
  },
  "id": {
    "seeQr": "@:(see) @:(qr-code) untuk {name}"
  },
  "cn": {
    "seeQr": "@:(see) @:(qr-code) 对于 {name}"
  },
  "jp": {
    "seeQr": "@:(see) @:(qr-code) ために {name}"
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
      </template>
      <template #item.status="{ item }">
        <v-chip
          label=""
          class="ma-1"
          :color="item.status === 'empty' ? 'warning' : 'success'"
          text-color="white"
        >
          <v-avatar left>
            <v-icon>
              {{
                item.status === 'empty'
                  ? 'mdi-alert-circle'
                  : 'mdi-checkbox-marked-circle'
              }}
            </v-icon>
          </v-avatar>
          <span>
            {{ item.status === 'empty' ? $t('empty') : $t('reserved') }}
          </span>
        </v-chip>
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
        <v-tooltip v-if="item.qrCode" bottom="">
          <template #activator="{ on }">
            <v-btn
              :data-cy="`trigger-preview-${slugify(item.name)}`"
              :disabled="isLoading"
              :loading="isLoading"
              class="ma-1"
              color="secondary"
              @click="previewQr(item.qrCode)"
              v-on="on"
            >
              <v-icon>mdi-qrcode</v-icon>
            </v-btn>
          </template>
          <span>{{
            $t('seeQr', {
              name: item.name
            })
          }}</span>
        </v-tooltip>
        <v-tooltip bottom="">
          <template #activator="{ on }">
            <v-btn
              :data-cy="`trigger-edit-${slugify(item.name)}`"
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
          <span>{{ $t('edit') }} {{ item.name }}</span>
        </v-tooltip>
        <v-tooltip bottom="">
          <template #activator="{ on }">
            <v-btn
              :data-cy="`trigger-delete-${slugify(item.name)}`"
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
          <span>{{ $t('delete') }} {{ item.name }}</span>
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
      <v-text-field
        v-model="item.name"
        v-validate="'required'"
        :error-messages="errors.collect('name')"
        :disabled="isLoading"
        data-vv-name="name"
        :data-vv-as="$t('name')"
        name="name"
        clearable=""
        data-vv-value-path="item.name"
        required=""
        :label="$t('name')"
        outlined=""
      />
      <v-textarea
        v-model="item.description"
        :disabled="isLoading"
        name="description"
        clearable=""
        :label="$t('description')"
        outlined=""
        auto-grow=""
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
      <v-autocomplete
        v-model="item.user"
        v-validate="{ required: item.status === 'reserved' }"
        :items="users"
        :error-messages="errors.collect('user')"
        :disabled="isLoading || item.status !== 'reserved'"
        item-text="name"
        item-value="uid"
        data-vv-name="user"
        :data-vv-as="$t('user')"
        name="user"
        clearable=""
        data-vv-value-path="item.user"
        :required="item.status === 'reserved'"
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
      <v-file-input
        v-model="item.images"
        :disabled="isLoading"
        :prepend-icon="null"
        name="images"
        counter=""
        clearable=""
        :label="$tc('image', 2)"
        outlined=""
        multiple=""
        :show-size="1000"
      >
        <template #selection="{ index, text }">
          <v-chip v-if="index < 2" label="" small="">
            {{ text }}
          </v-chip>

          <span
            v-else-if="index === 2"
            class="overline grey--text text--darken-3 mx-2"
          >
            +{{ item.images.length - 2 }} File(s)
          </span>
        </template>
      </v-file-input>
      <v-row>
        <template v-for="meta in item.imagesMeta">
          <v-col :key="meta.url" cols="4" class="d-flex child-flex">
            <v-card
              ripple=""
              flat=""
              color="grey lighten-3"
              @click="onTriggerPreview(meta)"
            >
              <app-img
                v-if="
                  meta.url &&
                    meta.url.length > 0 &&
                    meta.name &&
                    meta.name.length > 0
                "
                :src="meta.url"
                :alt="meta.name"
                :aspect-ratio="1"
              />
            </v-card>
          </v-col>
        </template>
      </v-row>
    </template>
    <template #preview="">
      <app-img
        v-if="
          image.url &&
            image.url.length > 0 &&
            image.name &&
            image.name.length > 0
        "
        :src="image.url"
        :alt="image.name"
      />
      <div class="d-flex justify-center align-center">
        <qr-code :value="qrCode" :options="{ scale: 10 }" />
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
import QrCode from '@chenfengyuan/vue-qrcode'

import { db, storage } from '~/utils/firebase'

export default {
  layout: 'admin',
  head() {
    return {
      title: `${this.$t(this.title.toLowerCase())} - Admin`
    }
  },
  components: {
    QrCode
  },
  data() {
    return {
      title: 'Room', // Hold page name
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
        { text: this.$t('name'), value: 'name' },
        { text: this.$t('status'), value: 'status', align: 'center' },
        { text: this.$t('user'), value: 'refData.user.name' },
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
      items: [], // Array hold all room data
      // Hold room data
      item: {
        uid: uuidv4(),
        hotel: null,
        user: null,
        name: null,
        images: [],
        imagesMeta: [],
        description: null,
        hasQr: false,
        status: 'empty',
        createdAt: null,
        updatedAt: null
      },
      // Hold original room data, useful to calculate whether
      // the editing data has changed or not
      itemOriginal: {
        uid: uuidv4(),
        hotel: null,
        user: null,
        name: null,
        images: [],
        imagesMeta: [],
        description: null,
        hasQr: false,
        status: 'empty',
        createdAt: null,
        updatedAt: null
      },
      // Hold image data
      image: {
        name: '',
        url: '',
        fullPath: '',
        createdAt: ''
      },
      qrCode: null,
      hotels: [], // Array hold hotel data
      // Array hold status data
      statuses: [
        { text: this.$t('empty'), value: 'empty' },
        { text: this.$t('reserved'), value: 'reserved' }
      ],
      // Array hold user data
      users: [],
      // Hold default images meta data
      imagesMeta: [
        {
          createdAt: this.$moment('2019-09-19T02:52:55.000Z').toDate(),
          fullPath: 'default/de65cf77-9923-4fcd-b066-1d02a507c8f6.png',
          name: 'de65cf77-9923-4fcd-b066-1d02a507c8f6.png',
          url:
            'https://firebasestorage.googleapis.com/v0/b/monggo-io.appspot.com/o/default%2Fde65cf77-9923-4fcd-b066-1d02a507c8f6.png?alt=media&token=5704205a-726a-4d40-a4bf-e782cec5b427'
        }
      ]
    }
  },
  computed: {
    ...mapState(['isLoading']),
    ...mapState('user', ['user']),
    ...mapGetters('user', ['role']),
    collection() {
      return pluralize(this.title.toLowerCase())
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

      const itemOriginal = _cloneDeep(this.itemOriginal)
      delete itemOriginal.refData
      delete itemOriginal.hotelRef
      return this.isEditing && !isEqual(item, itemOriginal)
    }
  },
  watch: {
    'item.images': async function(images) {
      if (images && images.length > 0) {
        const imagesMeta = await Promise.all(
          images.map(async (image, i) => ({
            ...this.item.imagesMeta[i],
            name: image.name,
            url: await this.getUrlFromFile(image)
          }))
        )
        this.item.imagesMeta = _cloneDeep(imagesMeta)
      } else {
        this.item.imagesMeta = []
      }
    },
    'itemOriginal.images': async function(images) {
      if (images && images.length > 0) {
        const imagesMeta = await Promise.all(
          images.map(async (image, i) => ({
            ...this.itemOriginal.imagesMeta[i],
            name: image.name,
            url: await this.getUrlFromFile(image)
          }))
        )
        this.itemOriginal.imagesMeta = _cloneDeep(imagesMeta)
      } else {
        this.itemOriginal.imagesMeta = []
      }
    },
    'item.status': async function(status) {
      try {
        this.$setLoading(true)
        if (status === 'reserved') {
          await this.getItems(
            db.collection('users').where('role', '==', 'guest'),
            'users'
          )
        } else {
          this.users = []
          this.item.user = null
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
        if (this.role === 'operator') {
          this.item.hotel = this.user.hotel
          this.itemOriginal.hotel = this.itemOriginal.hotel

          await Promise.all([
            this.getItems(
              db
                .collection(this.collection)
                .where('hotel', '==', this.user.hotel)
                .orderBy('createdAt', 'desc'),
              'items',
              this.itemsCallback
            ),
            this.getItems(
              db
                .collection('hotels')
                .where('uid', '==', this.user.hotel)
                .orderBy('createdAt', 'desc'),
              'hotels'
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
     * Called to get file form url
     * @param {string} url
     * @param {string} name
     */
    async getFileFromUrl(url, name) {
      try {
        // Taken from: https://stackoverflow.com/questions/44070437/how-to-get-a-file-or-blob-from-an-url-in-javascript
        this.$setLoading(true)
        if (!url) {
          return
        }
        url = url.toString()
        const response = await fetch(url)
        const blob = await response.blob()
        const file = new File([blob], name, {
          type: blob.type
        })
        return file
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
     * Called to get url from file
     * @param {File} file
     */
    getUrlFromFile(file) {
      return new Promise(resolve => {
        const fileReader = new FileReader()
        fileReader.readAsDataURL(file)
        fileReader.addEventListener('load', () => {
          resolve(fileReader.result)
        })
      })
    },
    /**
     * Called to reset data to original form
     */
    reset() {
      const item = {
        uid: uuidv4(),
        hotel: null,
        user: null,
        name: null,
        images: [],
        imagesMeta: [],
        description: null,
        hasQr: false,
        status: 'empty',
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
              let imagesMeta = []
              if (data.imagesMeta && data.imagesMeta.length > 0) {
                imagesMeta = data.imagesMeta.map(meta => ({
                  ...meta,
                  createdAt: meta && meta.createdAt && meta.createdAt.toDate()
                }))
              }
              if (cb) {
                const refData = await cb(data)
                return {
                  ...data,
                  refData,
                  imagesMeta,
                  images: [],
                  createdAt: data && data.createdAt && data.createdAt.toDate(),
                  updatedAt: data && data.updatedAt && data.updatedAt.toDate()
                }
              } else {
                return {
                  ...data,
                  imagesMeta,
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
     * Called to trigger displaying dialog for adding data
     */
    onTriggerAdd() {
      this.$validator.reset()
      this.isDialog = true
    },
    /**
     * Called to trigger displaying dialog for editing data
     */
    async onTriggerEdit(_item) {
      try {
        this.$setLoading(true)
        this.isDialog = true
        this.isEditing = true

        const item = _cloneDeep(_item)

        const images = await Promise.all(
          item.imagesMeta.map(meta =>
            this.getFileFromUrl(meta.url, meta.name || `${uuidv4()}.jpg`)
          )
        )
        item.images = images

        this.item = _cloneDeep(item)
        this.itemOriginal = _cloneDeep(item)
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
     * Called to trigger displaying dialog for deleting data
     */
    async onTriggerDelete(_item) {
      try {
        this.$setLoading(true)
        this.isDeleting = true

        const item = _cloneDeep(_item)

        const images = await Promise.all(
          item.imagesMeta.map(meta =>
            this.getFileFromUrl(meta.url, meta.name || `${uuidv4()}.jpg`)
          )
        )
        item.images = images

        this.item = _cloneDeep(item)
        this.itemOriginal = _cloneDeep(item)
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
     * Called to trigger displaying dialog for previewing image
     */
    onTriggerPreview(item) {
      this.isPreviewing = true
      this.image = _cloneDeep(item)
    },
    /**
     * Called to trigger displaying dialog for previewing qrCode
     */
    previewQr(qrCode) {
      if (qrCode) {
        this.qrCode = qrCode
        this.isPreviewing = true
        console.log(qrCode)
      }
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
          if (
            this.isEdited &&
            this.itemOriginal.imagesMeta &&
            this.itemOriginal.imagesMeta.length > 0
          ) {
            await Promise.all(
              this.itemOriginal.imagesMeta.map(meta => {
                if (meta.fullPath.includes('default')) {
                  return
                }
                return storage.ref(meta.fullPath).delete()
              })
            )
            delete payload.refData
          }
          let imagesMeta = this.imagesMeta
          if (this.item.imagesMeta.length > 0) {
            imagesMeta = await Promise.all(
              payload.images.map(async image => {
                const snap = await storage
                  .ref(this.collection)
                  .child(`${uuidv4()}.jpg`)
                  .put(image)
                const url = await snap.ref.getDownloadURL()
                return {
                  url,
                  name: snap.metadata.name,
                  fullPath: snap.metadata.fullPath,
                  createdAt: this.$moment(snap.metadata.timeCreated).toDate()
                }
              })
            )
          }
          payload.imagesMeta = imagesMeta
          delete payload.images
          if (payload.user) {
            payload.userRef = db.collection('users').doc(payload.user)
          }
          payload.hotelRef = db.collection('hotels').doc(payload.hotel)
          delete payload.refData
          this.isSaved = true

          const qrCode = uuidv4()
          payload.hasQr = true
          payload.qrCode = 'https://monggo.io?qrCode=' + qrCode

          await Promise.all([
            db
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
              ),
            db
              .collection('qr-codes')
              .doc(qrCode)
              .set({
                createdAt: payload.createdAt,
                hotel: payload.hotel,
                hotelRef: payload.hotelRef,
                room: payload.uid,
                roomRef: db.collection('rooms').doc(payload.uid),
                uid: qrCode,
                updatedAt: payload.updatedAt
              })
          ])

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
        if (item.imagesMeta && item.imagesMeta.length > 0) {
          await Promise.all(
            item.imagesMeta.map(meta => {
              if (meta.fullPath.includes('default')) {
                return
              }
              return storage.ref(meta.fullPath).delete()
            })
          )
        }
        const [qrRef, ordersRef] = await Promise.all([
          db
            .collection('qr-codes')
            .where('room', '==', item.uid)
            .get(),
          db
            .collection('orders')
            .where('room', '==', item.uid)
            .get()
        ])
        await Promise.all([
          ...qrRef.docs.map(qrDoc => qrDoc.ref.delete()),
          ...ordersRef.docs.map(orderDoc => orderDoc.ref.delete())
        ])
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
      this.image = {
        name: '',
        url: '',
        fullPath: '',
        createdAt: ''
      }
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
