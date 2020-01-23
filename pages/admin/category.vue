<template>
  <app-wrapper
    :title="title"
    :is-dialog="isDialog"
    :is-editing="isEditing"
    :is-confirming="isConfirming"
    :is-deleting="isDeleting"
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
    </template>
  </app-wrapper>
</template>

<script>
import { mapState } from 'vuex'
import uuidv4 from 'uuid/v4'
import slugify from '@sindresorhus/slugify'
import _cloneDeep from 'lodash.clonedeep'
import cleanDeep from 'clean-deep'
import isEqual from 'fast-deep-equal'
import pluralize from 'pluralize'
import { paramCase } from 'param-case'

import { db } from '~/utils/firebase'

export default {
  layout: 'admin',
  data() {
    return {
      title: 'Category', // Hold page name
      isDialog: false, // Hold dialog state for editing and adding
      isEditing: false, // Hold editing state
      isConfirming: false, // Hold edit confirmation state
      isDeleting: false, // Hold deleting dialog state
      isSaved: false, // Hold whether current data is saved
      // Array hold table column
      headers: [
        { text: this.$t('name'), value: 'name' },
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
      items: [], // Array hold all category data
      // Hold category data
      item: {
        uid: uuidv4(),
        name: null,
        createdAt: null,
        updatedAt: null
      },
      // Hold original category data, useful to calculate whether
      // the editing data has changed or not
      itemOriginal: {
        uid: uuidv4(),
        name: null,
        createdAt: null,
        updatedAt: null
      }
    }
  },
  head() {
    return {
      title: `${this.$t(paramCase(this.title))} - Admin`
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
      const item = _cloneDeep(this.item)
      delete item.refData
      const itemOriginal = _cloneDeep(this.itemOriginal)
      delete itemOriginal.refData
      return this.isEditing && !isEqual(item, itemOriginal)
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
        await this.getItems()
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
        name: null,
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
        if (isValid) {
          this.$setLoading(true)
          const date = this.$moment().toDate()
          const payload = {
            ..._cloneDeep(this.item),
            createdAt: this.isEditing ? this.item.createdAt : date,
            updatedAt: date
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
          await this.getItems()
          await this.onDialogClose()
          await this.$notify({
            kind: 'success',
            message: this.$t('dataSaved')
          })
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
        await this.getItems()
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
    }
  }
}
</script>
