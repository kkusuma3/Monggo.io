<template>
  <app-wrapper
    :title="title"
    :is-dialog="isDialog"
    :is-editing="isEditing"
    :is-confirming="isConfirming"
    :is-deleting="isDeleting"
    :is-previewing="isPreviewing"
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
      <template #item.price="{ item }">
        <span>{{ item.price }} {{ item.currency }}</span>
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
        v-model="item.category"
        v-validate="'required'"
        :items="categories"
        :error-messages="errors.collect('category')"
        :disabled="isLoading"
        item-text="name"
        item-value="uid"
        data-vv-name="category"
        :data-vv-as="$t('category')"
        name="category"
        clearable=""
        data-vv-value-path="item.category"
        required=""
        :label="$t('category')"
        outlined=""
      />
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
      <v-row>
        <v-col cols="12" md="6">
          <v-autocomplete
            v-model="item.currency"
            v-validate="'required'"
            :items="currencies"
            :error-messages="errors.collect('currency')"
            :disabled="isLoading"
            data-vv-name="currency"
            :data-vv-as="$t('currency')"
            name="currency"
            clearable=""
            data-vv-value-path="item.currency"
            required=""
            :label="$t('currency')"
            outlined=""
          >
            <template #item="{ item }">
              <v-list-item-avatar color="grey lighten-3">
                {{ item.symbol }}
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ item.text }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ item.value }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </template>
          </v-autocomplete>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model.number="item.price"
            v-validate="'required|numeric'"
            :error-messages="errors.collect('price')"
            :disabled="isLoading"
            data-vv-name="price"
            :data-vv-as="$t('price')"
            name="price"
            clearable=""
            data-vv-value-path="item.price"
            required=""
            :label="$t('price')"
            outlined=""
            type="number"
            min="0"
          />
        </v-col>
      </v-row>
      <v-text-field
        v-model.number="item.count"
        v-validate="'required|numeric'"
        :error-messages="errors.collect('count')"
        :disabled="isLoading"
        data-vv-name="count"
        :data-vv-as="$t('count')"
        name="count"
        clearable=""
        data-vv-value-path="item.count"
        required=""
        :label="$t('count')"
        outlined=""
        type="number"
        min="0"
      />
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
            +{{ item.images.length - 2 }}
            {{ $tc('file', item.images.length - 2) }}
          </span>
        </template>
      </v-file-input>
      <v-row>
        <template v-for="meta in item.imagesMeta">
          <v-col :key="meta.url" cols="4" class="d-flex child-flex">
            <v-card ripple="" flat="" @click="onTriggerPreview(meta)">
              <app-img :src="meta.url" :alt="meta.name" :aspect-ratio="1" />
            </v-card>
          </v-col>
        </template>
      </v-row>
    </template>
    <template #preview="">
      <app-img :src="image.url" :alt="image.name" />
    </template>
  </app-wrapper>
</template>

<script>
import { mapState } from 'vuex'
import uuidv4 from 'uuid/v4'
import slugify from '@sindresorhus/slugify'
import _cloneDeep from 'lodash.clonedeep'
import isEqual from 'fast-deep-equal'
import isDarkColor from 'is-dark-color'
import materialColorHash from 'material-color-hash'
import initials from 'initials'
import pluralize from 'pluralize'
import paramCase from 'param-case'

import { db, storage } from '~/utils/firebase'

export default {
  layout: 'admin',
  head() {
    return {
      title: `${this.$t(paramCase(this.title))} - Admin`
    }
  },
  data() {
    return {
      title: 'Service',
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
        { text: this.$t('name'), value: 'name' },
        { text: this.$t('description'), value: 'description' },
        { text: this.$t('count'), value: 'count' },
        { text: this.$t('price'), value: 'price' },
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
      categories: [],
      currencies: [
        { text: 'United States Dollar', value: 'USD', symbol: '$' },
        { text: 'Pound Sterling', value: 'GBP', symbol: '£' },
        { text: 'Indonesian Rupiah', value: 'IDR', symbol: 'Rp' }
      ],
      item: {
        uid: uuidv4(),
        category: '',
        name: '',
        images: [],
        imagesMeta: [],
        description: '',
        currency: '',
        price: '',
        count: 0,
        createdAt: null,
        updatedAt: null
      },
      itemOriginal: {
        uid: uuidv4(),
        category: '',
        name: '',
        images: [],
        imagesMeta: [],
        description: '',
        currency: '',
        price: '',
        count: 0,
        createdAt: null,
        updatedAt: null
      },
      image: {
        name: '',
        url: '',
        fullPath: '',
        createdAt: ''
      }
    }
  },
  computed: {
    ...mapState(['isLoading']),
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
      const itemOriginal = _cloneDeep(this.itemOriginal)
      delete itemOriginal.refData
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
        this.itemOriginal.imagesMeta = _cloneDeep(imagesMeta)
      } else {
        this.item.imagesMeta = []
        this.itemOriginal.imagesMeta = []
      }
    }
  },
  mounted() {
    this.getItems(this.collection, this.itemsCallback)
    this.getItems('categories')
  },
  methods: {
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
    async itemsCallback(data) {
      try {
        this.$setLoading(true)
        const categoryRefDoc = await data.categoryRef.get()
        const categoryRef = categoryRefDoc.data()
        delete data.categoryRef
        return {
          category: categoryRef
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

    reset() {
      const item = {
        uid: uuidv4(),
        category: '',
        name: '',
        images: [],
        imagesMeta: [],
        description: '',
        currency: '',
        price: '',
        count: 0,
        createdAt: null,
        updatedAt: null
      }
      this.item = _cloneDeep(item)
      this.itemOriginal = _cloneDeep(item)
    },

    async getItems(collection = this.collection, cb) {
      try {
        this.$setLoading(true)
        const snaps = await db.collection(collection).get()
        const items = []
        snaps.forEach(async doc => {
          const data = doc.data()
          if (cb) {
            const refData = await cb(data)
            items.push({
              ...data,
              refData,
              images: [],
              createdAt: data && data.createdAt && data.createdAt.toDate(),
              updatedAt: data && data.updatedAt && data.updatedAt.toDate()
            })
          } else {
            items.push({
              ...data,
              images: [],
              createdAt: data && data.createdAt && data.createdAt.toDate(),
              updatedAt: data && data.updatedAt && data.updatedAt.toDate()
            })
          }
        })
        if (collection === this.collection) {
          this.items = items
        } else if (this[collection]) {
          this[collection] = items
        } else {
          throw new Error('Collection must be defined in the data.')
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
          if (this.isEdited) {
            await Promise.all(
              this.itemOriginal.imagesMeta.map(meta =>
                storage.ref(meta.fullPath).delete()
              )
            )
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
          payload.categoryRef = db
            .collection('categories')
            .doc(payload.category)

          this.isSaved = true
          await db
            .collection(this.collection)
            .doc(payload.uid)
            .set(payload, { merge: true })
          await this.getItems(this.collection, this.itemsCallback)
          await this.onDialogClose()
          await this.$notify({ kind: 'success', message: 'Data is saved' })
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
        await Promise.all(
          item.imagesMeta.map(meta => storage.ref(meta.fullPath).delete())
        )
        await this.getItems(this.collection, this.itemsCallback)
        await this.onDeleteClose()
        await this.$notify({ kind: 'success', message: 'Data is deleted' })
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
