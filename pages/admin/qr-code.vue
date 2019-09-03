<template>
  <app-wrapper
    :title="title"
    :is-dialog="isDialog"
    :is-editing="isEditing"
    :is-confirming="isConfirming"
    :is-deleting="isDeleting"
    :is-previewing="isPreviewing"
    :preview-width="500"
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
              :class="`trigger-qr-${slugify(item.refData.room.name)}`"
              class="ma-1"
              color="secondary"
              @click="onTriggerPreview(item)"
              v-on="on"
            >
              <v-icon>mdi-qrcode</v-icon>
            </v-btn>
          </template>
          <span>See QR Code for {{ item.refData.room.name }}</span>
        </v-tooltip>
        <v-tooltip bottom="">
          <template #activator="{ on }">
            <v-btn
              :class="`trigger-edit-${slugify(item.refData.room.name)}`"
              class="ma-1"
              color="secondary"
              @click="onTriggerEdit(item)"
              v-on="on"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </template>
          <span>{{ $t('edit') }} QR Code for {{ item.refData.room.name }}</span>
        </v-tooltip>
        <v-tooltip bottom="">
          <template #activator="{ on }">
            <v-btn
              :class="`trigger-delete-${slugify(item.refData.room.name)}`"
              class="ma-1"
              color="error"
              @click="onTriggerDelete(item)"
              v-on="on"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
          <span>
            {{ $t('delete') }} QR Code for {{ item.refData.room.name }}
          </span>
        </v-tooltip>
      </template>
    </v-data-table>
    <template #form="">
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
      />
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
import { mapState } from 'vuex'
import uuidv4 from 'uuid/v4'
import slugify from '@sindresorhus/slugify'
import _cloneDeep from 'lodash.clonedeep'
import isEqual from 'fast-deep-equal'
import pluralize from 'pluralize'
import paramCase from 'param-case'
import QrCode from '@chenfengyuan/vue-qrcode'

import { db } from '~/utils/firebase'

export default {
  layout: 'admin',
  head() {
    return {
      title: `${this.$t(paramCase(this.title))} - Admin`
    }
  },
  components: {
    QrCode
  },
  data() {
    return {
      title: 'QR Code',
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
      items: [],
      rooms: [],
      item: {
        uid: uuidv4(),
        room: '',
        createdAt: null,
        updatedAt: null
      },
      itemOriginal: {
        uid: uuidv4(),
        room: '',
        createdAt: null,
        updatedAt: null
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
    isEdited() {
      return this.isEditing && !isEqual(this.item, this.itemOriginal)
    }
  },
  mounted() {
    this.getItems(this.collection, async data => {
      const roomRefDoc = await data.roomRef.get()
      const roomRef = roomRefDoc.data()
      delete data.roomRef
      return {
        room: roomRef
      }
    })
    this.getItems('rooms')
  },
  methods: {
    reset() {
      const item = {
        uid: uuidv4(),
        room: '',
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
    onTriggerEdit(_item) {
      this.isDialog = true
      this.isEditing = true
      this.item = _cloneDeep(_item)
      this.itemOriginal = _cloneDeep(_item)
    },
    onTriggerDelete(item) {
      this.isDeleting = true
      this.item = _cloneDeep(item)
    },
    onTriggerPreview(item) {
      this.isPreviewing = true
      this.item = _cloneDeep(item)
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
          payload.roomRef = db.collection('rooms').doc(payload.room)
          this.isSaved = true
          await db
            .collection(this.collection)
            .doc(payload.uid)
            .set(payload, { merge: true })
          await this.getItems(this.collection, async data => {
            const roomRefDoc = await data.roomRef.get()
            const roomRef = roomRefDoc.data()
            delete data.roomRef
            return {
              room: roomRef
            }
          })
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
        await this.getItems(this.collection, async data => {
          const roomRefDoc = await data.roomRef.get()
          const roomRef = roomRefDoc.data()
          delete data.roomRef
          return {
            room: roomRef
          }
        })
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
      this.reset()
    },
    onPreviewAction() {
      this.onPreviewClose()
    }
  }
}
</script>
