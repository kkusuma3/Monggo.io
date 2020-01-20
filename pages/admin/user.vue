<template>
  <app-wrapper
    :title="title"
    :is-add-active="false"
    :is-dialog="isDialog"
    :is-editing="isEditing"
    :is-confirming="isConfirming"
    :is-deleting="isDeleting"
    :is-previewing="isPreviewing"
    @trigger:refresh="initData"
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
        <v-avatar
          :color="getMaterialColor(item.name || item.email || 'Anonim')"
          class="ma-1"
        >
          <app-img
            v-if="item.avatar && item.avatar.length > 0"
            :src="item.avatar"
            :alt="item.name || item.email || 'Anonim'"
          />
          <span
            v-else=""
            :class="{
              'white--text': isDarkColor(
                getMaterialColor(item.name || item.email || 'Anonim', true)
              )
            }"
          >
            {{ getInitials(item.name || item.email || 'Anonim') }}
          </span>
        </v-avatar>
      </template>
      <template #item.name="{ item }">
        <span>{{ item.name || item.email || 'Anonim' }}</span>
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
              :data-cy="`trigger-edit-${slugify(item.name || 'Anonim')}`"
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
          <span>{{ $t('edit') }} {{ item.name || 'Anonim' }}</span>
        </v-tooltip>
        <v-tooltip bottom="">
          <template #activator="{ on }">
            <v-btn
              :data-cy="`trigger-delete-${slugify(item.name)}`"
              :disabled="isLoading || role !== 'admin'"
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
      <v-text-field
        v-model="item.name"
        v-validate="{ required: !item.isAnonymous }"
        :error-messages="errors.collect('name')"
        :disabled="isLoading"
        data-vv-name="name"
        :data-vv-as="$t('name')"
        name="name"
        clearable=""
        data-vv-value-path="item.name"
        :required="!item.isAnonymous"
        :label="$t('name')"
        outlined=""
      />
      <v-text-field
        v-model="item.email"
        v-validate="{ required: !item.isAnonymous, email: true }"
        :error-messages="errors.collect('email')"
        :disabled="isLoading"
        data-vv-name="email"
        :data-vv-as="$t('email')"
        name="email"
        clearable=""
        data-vv-value-path="item.email"
        :required="!item.isAnonymous"
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
        v-model="item.currency"
        v-validate="{ required: !item.isAnonymous }"
        :items="currencies"
        :error-messages="errors.collect('currency')"
        :disabled="isLoading"
        data-vv-name="currency"
        :data-vv-as="$t('currency')"
        name="currency"
        clearable=""
        data-vv-value-path="item.currency"
        :required="!item.isAnonymous"
        :label="$t('currency')"
        outlined=""
      >
        <template #selection="data">
          <v-chip
            v-bind="data.attrs"
            :input-value="data.selected"
            label=""
            @click="data.select"
          >
            <v-avatar left="" tile="">
              <span>{{ data.item.symbol }}</span>
            </v-avatar>
            <span>{{ data.item.text }}</span>
          </v-chip>
        </template>
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
      <v-autocomplete
        v-model="item.role"
        v-validate="{ required: !item.isAnonymous }"
        :items="roles"
        :error-messages="errors.collect('role')"
        :disabled="isLoading"
        data-vv-name="role"
        :data-vv-as="$t('role')"
        name="role"
        clearable=""
        data-vv-value-path="item.role"
        :required="!item.isAnonymous"
        :label="$t('role')"
        outlined=""
      />
      <v-autocomplete
        v-model="item.hotel"
        v-validate="{
          required: item.role === 'operator' && item.role === 'worker'
        }"
        :items="hotels"
        :error-messages="errors.collect('hotel')"
        :disabled="
          isLoading || (item.role !== 'operator' && item.role !== 'worker')
        "
        item-text="name"
        item-value="uid"
        data-vv-name="hotel"
        :data-vv-as="$t('hotel')"
        name="hotel"
        clearable=""
        data-vv-value-path="item.hotel"
        :required="item.role === 'operator' && item.role === 'worker'"
        :label="$t('hotel')"
        outlined=""
      >
        <template #item="{ item }">
          <v-list-item-avatar>
            <v-avatar :color="getMaterialColor(item.name || item.email)">
              <app-img
                v-if="item.imagesMeta && item.imagesMeta.length > 0"
                :src="item.imagesMeta[0].url"
                :alt="item.name || item.email"
              />
              <span
                v-else=""
                :class="{
                  'white--text': isDarkColor(
                    getMaterialColor(item.name || item.email, true)
                  )
                }"
              >
                {{ getInitials(item.name || item.email) }}
              </span>
            </v-avatar>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ item.name || item.email }}</v-list-item-title>
          </v-list-item-content>
        </template>
      </v-autocomplete>
      <v-card ripple="" flat="" width="182" @click="onTriggerPreview">
        <v-card-text>
          <v-avatar
            :color="getMaterialColor(item.name || item.email)"
            size="150"
          >
            <app-img
              v-if="item.avatar && item.avatar.length > 0"
              :src="item.avatar"
              :alt="item.name || item.email"
            />
            <span
              v-else=""
              class="headline"
              :class="{
                'white--text': isDarkColor(
                  getMaterialColor(item.name || item.email, true)
                )
              }"
            >
              {{ getInitials(item.name || item.email) }}
            </span>
          </v-avatar>
        </v-card-text>
      </v-card>
    </template>
    <template #preview="">
      <v-row align="center" justify="center">
        <v-avatar :color="getMaterialColor(item.name || item.email)" size="512">
          <app-img
            v-if="item.avatar && item.avatar.length > 0"
            :src="item.avatar"
            :alt="item.name || item.email"
          />
          <span
            v-else=""
            class="display-1"
            :class="{
              'white--text': isDarkColor(
                getMaterialColor(item.name || item.email, true)
              )
            }"
          >
            {{ getInitials(item.name || item.email) }}
          </span>
        </v-avatar>
      </v-row>
    </template>
  </app-wrapper>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import slugify from '@sindresorhus/slugify'
import _cloneDeep from 'lodash.clonedeep'
import cleanDeep from 'clean-deep'
import isEqual from 'fast-deep-equal'
import isDarkColor from 'is-dark-color'
import materialColorHash from 'material-color-hash'
import initials from 'initials'
import pluralize from 'pluralize'
import { paramCase } from 'param-case'

import { db } from '~/utils/firebase'

export default {
  layout: 'admin',
  data() {
    return {
      title: 'User', // Hold page name
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
      items: [], // Array hold all hotel data
      // Hold hotel data
      item: {
        uid: null,
        name: null,
        email: null,
        phone: null,
        currency: 'IDR', // 'USD',
        avatar: '',
        role: null,
        hotel: null,
        createdAt: null,
        updatedAt: null
      },
      // Hold original hotel data, useful to calculate whether
      // the editing data has changed or not
      itemOriginal: {
        uid: null,
        name: null,
        email: null,
        phone: null,
        currency: 'IDR', // 'USD',
        avatar: '',
        role: null,
        hotel: null,
        createdAt: null,
        updatedAt: null
      },
      // Array hold currencies data
      currencies: [
        { text: 'United States Dollar', value: 'USD', symbol: '$' },
        { text: 'Pound Sterling', value: 'GBP', symbol: '£' },
        { text: 'Indonesian Rupiah', value: 'IDR', symbol: 'Rp' }
      ],
      // Array hold roles data
      roles: [
        { text: this.$t('guest'), value: 'guest' },
        { text: this.$t('worker'), value: 'worker' },
        { text: this.$t('operator'), value: 'operator' },
        { text: this.$t('admin'), value: 'admin' }
      ],
      // Array hold hotel data
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
          case 'worker':
            return 'warning'
          case 'operator':
            return 'error'
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
          case 'worker':
            return 'mdi-account-group'
          case 'operator':
            return 'mdi-account-supervisor'
          case 'admin':
            return 'mdi-shield-account'
          default:
            return 'mdi-account'
        }
      }
    }
  },
  watch: {
    'item.role'(role) {
      if (role !== 'operator' && role !== 'worker') {
        this.item.hotel = null
        this.itemOriginal.hotel = null
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
    /**
     * Called to reset data to original form
     */
    reset() {
      const item = {
        uid: null,
        name: null,
        email: null,
        phone: null,
        currency: 'IDR', // 'USD',
        avatar: '',
        role: null,
        hotel: null,
        createdAt: null,
        updatedAt: null
      }
      this.item = _cloneDeep(item)
      this.itemOriginal = _cloneDeep(item)
    },
    /**
     * Called to get user relation
     */
    async itemsCallback(data) {
      try {
        this.$setLoading(true)
        if (data.hotel && data.hotelRef) {
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
                  createdAt: data && data.createdAt && data.createdAt.toDate(),
                  updatedAt: data && data.updatedAt && data.updatedAt.toDate()
                }
              } else {
                return {
                  ...data,
                  createdAt: data && data.createdAt && data.createdAt.toDate(),
                  updatedAt: data && data.updatedAt && data.updatedAt.toDate()
                }
              }
            })
          )
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
     * Called to trigger displaying dialog for editing data
     */
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
    /**
     * Called to trigger displaying dialog for deleting data
     */
    onTriggerDelete(_item) {
      try {
        this.$setLoading(true)
        this.isDeleting = true

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
    /**
     * Called to trigger displaying dialog for previewing image
     */
    onTriggerPreview() {
      this.isPreviewing = true
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
      this.image = null
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
