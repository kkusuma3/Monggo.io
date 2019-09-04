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
      <template #item.status="{ item }">
        <v-chip
          label=""
          class="ma-1"
          :color="getStatusColor(item.status)"
          text-color="white"
        >
          <v-avatar left>
            <v-icon>
              {{ getStatusIcon(item.status) }}
            </v-icon>
          </v-avatar>
          <span>
            {{ $t(item.status) }}
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
              :class="`trigger-edit-${slugify(item.refData.user.name)}`"
              class="ma-1"
              color="secondary"
              @click="onTriggerEdit(item)"
              v-on="on"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </template>
          <span>{{ $t('editOrder', { name: item.refData.user.name }) }}</span>
        </v-tooltip>
        <v-tooltip bottom="">
          <template #activator="{ on }">
            <v-btn
              :class="`trigger-delete-${slugify(item.refData.user.name)}`"
              class="ma-1"
              color="error"
              @click="onTriggerDelete(item)"
              v-on="on"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
          <span>{{ $t('deleteOrder', { name: item.refData.user.name }) }}</span>
        </v-tooltip>
      </template>
    </v-data-table>
    <template #form="">
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
      title: 'Order',
      isDialog: false,
      isEditing: false,
      isConfirming: false,
      isDeleting: false,
      isSaved: false,
      headers: [
        { text: this.$t('user'), value: 'refData.user.name' },
        { text: this.$t('service'), value: 'refData.service.name' },
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
      items: [],
      item: {
        uid: uuidv4(),
        user: '',
        service: '',
        count: '',
        status: '',
        createdAt: null,
        updatedAt: null
      },
      itemOriginal: {
        uid: uuidv4(),
        user: '',
        service: '',
        count: '',
        status: '',
        createdAt: null,
        updatedAt: null
      },
      users: [],
      services: [],
      statuses: [
        { text: this.$t('received'), value: 'received' },
        { text: this.$t('processed'), value: 'processed' },
        { text: this.$t('delivered'), value: 'delivered' }
      ]
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
    },
    getStatusColor() {
      return string => {
        if (!string) {
          return
        }
        string.toString()
        switch (string) {
          case 'received':
            return 'info'
          case 'processed':
            return 'warning'
          case 'delivered':
            return 'success'
          default:
            return 'error'
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
          case 'received':
            return 'mdi-basket-fill'
          case 'processed':
            return 'mdi-cached'
          case 'delivered':
            return 'mdi-check'
          default:
            return 'error'
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
    }
  },
  mounted() {
    this.getItems(this.collection, this.itemsCallback)
    this.getItems('users')
    this.getItems('services')
  },
  methods: {
    async itemsCallback(data) {
      try {
        this.$setLoading(true)
        const [userRefDoc, serviceRefDoc] = await Promise.all([
          data.userRef.get(),
          data.serviceRef.get()
        ])
        const [userRef, serviceRef] = await Promise.all([
          userRefDoc.data(),
          serviceRefDoc.data()
        ])
        delete data.userRef
        delete data.serviceRef
        return {
          user: userRef,
          service: serviceRef
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
        user: '',
        service: '',
        count: '',
        status: '',
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
              createdAt: data && data.createdAt && data.createdAt.toDate(),
              updatedAt: data && data.updatedAt && data.updatedAt.toDate()
            })
          } else {
            items.push({
              ...data,
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
    onTriggerEdit(item) {
      this.isDialog = true
      this.isEditing = true

      this.item = _cloneDeep(item)
      this.itemOriginal = _cloneDeep(item)
    },
    onTriggerDelete(item) {
      this.isDeleting = true
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
          payload.userRef = db.collection('users').doc(payload.user)
          payload.serviceRef = db.collection('services').doc(payload.service)
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
    }
  }
}
</script>
