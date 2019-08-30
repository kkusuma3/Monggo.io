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
      <template #item.createdAt="{ item }">
        <time :datetime="item.createdAt">
          {{ $moment(item.createdAt).format('llll') }}
        </time>
      </template>
      <template #item.updatedAt="{ item }">
        <time :datetime="item.updatedAt">
          {{ $moment(item.updatedAt).format('llll') }}
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
          <span>Edit {{ item.name }}</span>
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
          <span>Delete {{ item.name }}</span>
        </v-tooltip>
      </template>
    </v-data-table>
    <template #form="">
      <v-text-field
        v-model="item.name"
        v-validate="'required'"
        :error-messages="errors.collect('name')"
        :disabled="isLoading"
        data-vv-name="name"
        data-vv-as="Name"
        name="name"
        clearable=""
        data-vv-value-path="item.name"
        required=""
        label="Name"
        outlined=""
      />
      <v-textarea
        v-model="item.description"
        v-validate="'required'"
        :error-messages="errors.collect('description')"
        :disabled="isLoading"
        data-vv-name="description"
        data-vv-as="Description"
        name="description"
        clearable=""
        data-vv-value-path="item.description"
        required=""
        label="Description"
        outlined=""
        auto-grow=""
      />
      <v-file-input
        v-model="item.images"
        v-validate="'required'"
        :error-messages="errors.collect('images')"
        :disabled="isLoading"
        :prepend-icon="null"
        data-vv-name="images"
        data-vv-as="Images"
        name="images"
        counter=""
        clearable=""
        data-vv-value-path="item.images"
        required=""
        label="Images"
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
            <v-card ripple="" flat="" @click="onTriggerPreview(meta)">
              <app-img
                :src="meta.url"
                :alt="meta.name"
                :aspect-ratio="1"
                @click="onTriggerPreview(meta)"
              />
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

import { db, storage } from '~/utils/firebase'

export default {
  layout: 'admin',
  head() {
    return {
      title: `${this.title} - Admin`
    }
  },
  data() {
    return {
      title: 'User',
      isDialog: false,
      isEditing: false,
      isConfirming: false,
      isDeleting: false,
      isPreviewing: false,
      isSaved: false,
      headers: [
        { text: 'Image', value: 'image', align: 'center', sortable: false },
        { text: 'Name', value: 'name' },
        { text: 'Description', value: 'description' },
        {
          text: 'Created At',
          value: 'createdAt',
          align: 'center',
          sort: (a, b) => {
            return this.$moment(a) - this.$moment(b)
          }
        },
        {
          text: 'Updated At',
          value: 'updatedAt',
          align: 'center',
          sort: (a, b) => {
            return this.$moment(a) - this.$moment(b)
          }
        },
        { text: 'Action', value: 'action', align: 'center', sortable: false }
      ],
      items: [],
      item: {
        uid: uuidv4(),
        name: '',
        images: [],
        imagesMeta: [],
        description: '',
        status: '',
        createdAt: null,
        updatedAt: null
      },
      itemOriginal: {
        uid: uuidv4(),
        name: '',
        images: [],
        imagesMeta: [],
        description: '',
        status: '',
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
      return this.isEditing && !isEqual(this.item, this.itemOriginal)
    }
  },
  watch: {
    'item.images': async function(images) {
      if (images && images.length > 0) {
        if (this.item.imagesMeta.length === 0) {
          const imagesMeta = await Promise.all(
            images.map(async image => ({
              name: image.name,
              url: await this.getUrlFromFile(image)
            }))
          )
          this.item.imagesMeta = imagesMeta
        }
      } else {
        this.item.imagesMeta = []
      }
    }
  },
  mounted() {
    this.getItems()
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

    reset() {
      const item = {
        uid: uuidv4(),
        name: '',
        images: [],
        imagesMeta: [],
        description: '',
        status: '',
        createdAt: null,
        updatedAt: null
      }
      this.item = _cloneDeep(item)
      this.itemOriginal = _cloneDeep(item)
    },

    async getItems(collection = this.collection) {
      try {
        this.$setLoading(true)
        const snaps = await db.collection(collection).get()
        const items = []
        snaps.forEach(doc => {
          const data = doc.data()
          items.push({
            ...data,
            images: [],
            createdAt: data && data.createdAt && data.createdAt.toDate(),
            updatedAt: data && data.updatedAt && data.updatedAt.toDate()
          })
        })
        if (!collection) {
          this.items = items
        } else if (this[collection]) {
          this[collection] = items
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
            createdAt: date,
            updatedAt: date
          }
          if (this.itemOriginal.imagesMeta.length > 0) {
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
          this.isSaved = true
          await db
            .collection(this.collection)
            .doc(payload.uid)
            .set(payload, { merge: true })
          await this.getItems()
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
        await this.getItems()
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
