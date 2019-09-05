<template>
  <app-wrapper
    :title="title"
    :is-add-active="false"
    :is-dialog="isDialog"
    :is-editing="isEditing"
    :is-confirming="isConfirming"
    :is-deleting="isDeleting"
    :is-previewing="isPreviewing"
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
      </template>
      <template #item.role="{ item }">
        <v-chip
          label=""
          class="ma-1"
          :color="getRoleColor(item.role)"
          text-color="white"
        >
          <v-avatar left>
            <v-icon>
              {{ getRoleIcon(item.role) }}
            </v-icon>
          </v-avatar>
          <span>
            {{ $t(item.role) }}
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
        <!-- <v-tooltip bottom="">
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
        </v-tooltip> -->
      </template>
    </v-data-table>
    <template #form="">
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
      <v-text-field
        v-model="item.email"
        v-validate="'required|email'"
        :error-messages="errors.collect('email')"
        :disabled="isLoading"
        data-vv-name="email"
        :data-vv-as="$t('email')"
        name="email"
        clearable=""
        data-vv-value-path="item.email"
        required=""
        :label="$t('email')"
        outlined=""
      />
      <v-text-field
        v-model="item.phone"
        :disabled="isLoading"
        name="phone"
        clearable=""
        :label="$t('phone')"
        outlined=""
      />
      <v-autocomplete
        v-model="item.role"
        v-validate="'required'"
        :items="roles"
        :error-messages="errors.collect('role')"
        :disabled="isLoading"
        data-vv-name="role"
        :data-vv-as="$t('role')"
        name="role"
        clearable=""
        data-vv-value-path="item.role"
        required=""
        :label="$t('role')"
        outlined=""
      />
      <v-autocomplete
        v-model="item.hotel"
        v-validate="{ required: item.role === 'operator' }"
        :items="hotels"
        :error-messages="errors.collect('hotel')"
        :disabled="isLoading || item.role !== 'operator'"
        item-text="name"
        item-value="uid"
        data-vv-name="hotel"
        :data-vv-as="$t('hotel')"
        name="hotel"
        clearable=""
        data-vv-value-path="item.hotel"
        :required="item.role === 'operator'"
        :label="$t('hotel')"
        outlined=""
      >
        <template #item="{ item }">
          <v-list-item-avatar>
            <v-avatar :color="getMaterialColor(item.name)" class="ma-1">
              <app-img
                v-if="item.imagesMeta && item.imagesMeta.length > 0"
                :src="item.imagesMeta[0].url"
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
      <v-row>
        <v-col :key="item.avatar" cols="4" class="d-flex child-flex">
          <v-card ripple="" flat="" @click="onTriggerPreview">
            <app-img
              v-if="
                item.avatar &&
                  item.avatar.length > 0 &&
                  item.name &&
                  item.name.length > 0
              "
              :src="item.avatar"
              :alt="item.name"
              :aspect-ratio="1"
            />
          </v-card>
        </v-col>
      </v-row>
    </template>
    <template #preview="">
      <app-img
        v-if="
          item.avatar &&
            item.avatar.length > 0 &&
            item.name &&
            item.name.length > 0
        "
        :src="item.avatar"
        :alt="item.name"
      />
    </template>
  </app-wrapper>
</template>

<script>
import { mapState } from 'vuex'
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
      title: 'User',
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
        { text: this.$t('role'), value: 'role', align: 'center' },
        { text: this.$t('hotel'), value: 'refData.hotel.name' },
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
        uid: null,
        name: null,
        email: null,
        phone: null,
        avatar: '',
        role: null,
        hotel: null,
        createdAt: null,
        updatedAt: null
      },
      itemOriginal: {
        uid: null,
        name: null,
        email: null,
        phone: null,
        avatar: '',
        role: null,
        hotel: null,
        createdAt: null,
        updatedAt: null
      },
      roles: [
        { text: 'Guest', value: 'guest' },
        { text: 'Operator', value: 'operator' },
        { text: 'Admin', value: 'admin' }
      ],
      hotels: []
    }
  },
  computed: {
    ...mapState(['isLoading']),
    isOperator() {
      return this.item.role === 'operator'
    },
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

      const itemOriginal = _cloneDeep(this.itemOriginal)
      delete itemOriginal.refData
      delete itemOriginal.hotelRef
      return this.isEditing && !isEqual(item, itemOriginal)
    },
    getRoleColor() {
      return string => {
        if (!string) {
          return
        }
        string.toString()
        switch (string) {
          case 'guest':
            return 'info'
          case 'operator':
            return 'warning'
          case 'admin':
            return 'success'
          default:
            return 'error'
        }
      }
    },
    getRoleIcon() {
      return string => {
        if (!string) {
          return
        }
        string.toString()
        switch (string) {
          case 'guest':
            return 'mdi-account'
          case 'operator':
            return 'mdi-account-plus'
          case 'admin':
            return 'mdi-account-star'
          default:
            return 'error'
        }
      }
    }
  },
  watch: {
    'item.role': function(role) {
      if (role !== 'operator') {
        this.item.hotel = null
        this.itemOriginal.hotel = null
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
        await Promise.all([
          this.getItems(this.collection, 'items', this.itemsCallback),
          this.getItems('hotels')
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
    reset() {
      const item = {
        uid: null,
        name: null,
        email: null,
        phone: null,
        avatar: '',
        role: null,
        hotel: null,
        createdAt: null,
        updatedAt: null
      }
      this.item = _cloneDeep(item)
      this.itemOriginal = _cloneDeep(item)
    },

    async itemsCallback(data) {
      try {
        this.$setLoading(true)
        if (data.hotelRef) {
          const hotelRefDoc = await data.hotelRef.get()
          const hotelRef = hotelRefDoc.data()
          delete data.hotelRef
          return {
            hotel: hotelRef
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
    async getItems(collection = this.collection, location, cb) {
      try {
        this.$setLoading(true)
        let snaps = null
        if (typeof collection === 'string') {
          snaps = await db.collection(collection).get()
        } else {
          snaps = await collection.get()
        }
        const items = []
        snaps.forEach(async doc => {
          const data = doc.data()
          if (cb) {
            const refData = await cb(data)
            await items.push({
              ...data,
              refData,
              createdAt: data && data.createdAt && data.createdAt.toDate(),
              updatedAt: data && data.updatedAt && data.updatedAt.toDate()
            })
          } else {
            await items.push({
              ...data,
              createdAt: data && data.createdAt && data.createdAt.toDate(),
              updatedAt: data && data.updatedAt && data.updatedAt.toDate()
            })
          }
        })
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
      } catch (error) {
        this.$notify({
          isError: true,
          message: error.message
        })
      } finally {
        this.$setLoading(false)
      }
    },

    onTriggerEdit(_item) {
      try {
        this.$setLoading(true)
        this.isDialog = true
        this.isEditing = true

        this.item = _cloneDeep(_item)
        this.itemOriginal = _cloneDeep(_item)
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
    onTriggerPreview() {
      this.isPreviewing = true
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
          if (payload.hotel) {
            payload.hotelRef = db.collection('hotels').doc(payload.hotel)
          }
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
          await this.getItems(this.collection, 'items', this.itemsCallback)
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
      this.image = null
    },
    onPreviewAction() {
      this.onPreviewClose()
    }
  }
}
</script>
