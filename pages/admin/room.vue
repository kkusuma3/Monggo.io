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
        <v-tooltip bottom="">
          <template #activator="{ on }">
            <v-btn
              :class="`trigger-edit-${slugify(item.name)}`"
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
              :class="`trigger-delete-${slugify(item.name)}`"
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
        v-validate="'required'"
        :error-messages="errors.collect('description')"
        :disabled="isLoading"
        data-vv-name="description"
        :data-vv-as="$t('description')"
        name="description"
        clearable=""
        data-vv-value-path="item.description"
        required=""
        :label="$t('description')"
        outlined=""
        auto-grow=""
      />
      <v-autocomplete
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
        v-validate="'required'"
        :error-messages="errors.collect('images')"
        :disabled="isLoading"
        :prepend-icon="null"
        data-vv-name="images"
        :data-vv-as="$tc('image', 2)"
        name="images"
        counter=""
        clearable=""
        data-vv-value-path="item.images"
        required=""
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

import { db, storage } from '~/utils/firebase'

export default {
  layout: 'admin',
  head() {
    return {
      title: `${this.$t(this.title.toLowerCase())} - Admin`
    }
  },
  data() {
    return {
      title: 'Room',
      isDialog: false,
      isEditing: false,
      isConfirming: false,
      isDeleting: false,
      isPreviewing: false,
      isSaved: false,
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
      items: [],
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
      image: {
        name: '',
        url: '',
        fullPath: '',
        createdAt: ''
      },
      hotels: [],
      statuses: [
        { text: this.$t('empty'), value: 'empty' },
        { text: this.$t('reserved'), value: 'reserved' }
      ],
      users: []
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
        this.item = {
          ...this.item,
          imagesMeta: _cloneDeep(imagesMeta)
        }
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
        this.itemOriginal = {
          ...this.itemOriginal,
          imagesMeta: _cloneDeep(imagesMeta)
        }
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
    getUrlFromFile(file) {
      return new Promise(resolve => {
        const fileReader = new FileReader()
        fileReader.readAsDataURL(file)
        fileReader.addEventListener('load', () => {
          resolve(fileReader.result)
        })
      })
    },

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

    onTriggerAdd() {
      this.isDialog = true
    },
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
    onTriggerDelete(item) {
      this.isDeleting = true
      this.item = _cloneDeep(item)
    },
    onTriggerPreview(item) {
      this.isPreviewing = true
      this.image = _cloneDeep(item)
    },

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
              this.itemOriginal.imagesMeta.map(meta =>
                storage.ref(meta.fullPath).delete()
              )
            )
            delete payload.refData
          }
          const imagesMeta = await Promise.all(
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
          payload.imagesMeta = imagesMeta
          delete payload.images
          if (payload.user) {
            payload.userRef = db.collection('users').doc(payload.user)
          }
          payload.hotelRef = db.collection('hotels').doc(payload.hotel)
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

    onDeleteClose() {
      this.$validator.reset()
      this.isDeleting = false
      this.reset()
    },
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
            item.imagesMeta.map(meta => storage.ref(meta.fullPath).delete())
          )
        }
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

    onConfirmClose() {
      this.isConfirming = false
    },
    onConfirmAction() {
      this.onConfirmClose()
      this.$validator.reset()
      this.isDialog = false
      this.isEditing = false
      this.reset()
    },

    onPreviewClose() {
      this.isPreviewing = false
      this.image = {
        name: '',
        url: '',
        fullPath: '',
        createdAt: ''
      }
    },
    onPreviewAction() {
      this.onPreviewClose()
    }
  }
}
</script>
