<template>
  <app-wrapper
    title="Hotel"
    :is-loading="isLoading"
    :is-dialog="isDialog"
    :is-editing="isEditing"
    :is-deleting="isDeleting"
    @trigger:add="onTriggerAdd"
    @dialog:close="onDialogClose"
    @dialog:action="onDialogAction"
    @delete:close="onDeleteClose"
    @delete:action="onDeleteAction"
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
          {{ $moment(item.createdAt).format('llll') }}
        </time>
      </template>
      <template #item.updatedAt="{ item }">
        <time :datetime="item.updatedAt">
          {{ $moment(item.updatedAt).format('llll') }}
        </time>
      </template>
      <template #item.action="{ item }">
        <v-btn
          :class="`trigger-edit-${slugify(item.name)}`"
          class="ma-1"
          color="secondary"
          @click="onTriggerEdit(item)"
        >
          <v-icon left="">mdi-pencil</v-icon>
          <span>Edit</span>
        </v-btn>
        <v-btn
          :class="`trigger-delete-${slugify(item.name)}`"
          class="ma-1"
          color="error"
          @click="onTriggerDelete(item)"
        >
          <v-icon left="">mdi-delete</v-icon>
          <span>Delete</span>
        </v-btn>
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
    </template>
  </app-wrapper>
</template>

<script>
import uuidv4 from 'uuid/v4'
import slugify from '@sindresorhus/slugify'
import { db } from '~/utils/firebase'

const itemsRef = db.collection('hotels')

export default {
  layout: 'admin',
  data() {
    return {
      isLoading: false,
      isDialog: false,
      isEditing: false,
      isDeleting: false,
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Description', value: 'description' },
        {
          text: 'Created At',
          value: 'createdAt',
          sort: (a, b) => {
            return this.$moment(a) - this.$moment(b)
          }
        },
        {
          text: 'Updated At',
          value: 'updatedAt',
          sort: (a, b) => {
            return this.$moment(a) - this.$moment(b)
          }
        },
        { text: 'Action', value: 'action', sortable: false }
      ],
      items: [],
      item: {
        uid: uuidv4(),
        name: '',
        description: '',
        createdAt: null,
        updatedAt: null
      }
    }
  },
  computed: {
    slugify() {
      return string => {
        if (!string) {
          return
        }
        string.toString()
        return slugify(string)
      }
    }
  },
  mounted() {
    this.getItems()
  },
  methods: {
    async getItems() {
      try {
        this.isLoading = true
        const snaps = await itemsRef.get()
        const items = []
        snaps.forEach(doc => {
          const data = doc.data()
          items.push({
            ...data,
            createdAt: data && data.createdAt && data.createdAt.toDate(),
            updatedAt: data && data.updatedAt && data.updatedAt.toDate()
          })
        })
        this.items = items
      } catch (error) {
        this.$notify({
          isError: true,
          message: error.message
        })
      } finally {
        this.isLoading = false
      }
    },

    onTriggerAdd() {
      this.isDialog = true
    },
    onTriggerEdit(item) {
      this.isDialog = true
      this.isEditing = true
      this.item = {
        ...item
      }
    },
    onTriggerDelete(item) {
      this.isDeleting = true
      this.item = {
        ...item
      }
    },

    onDialogClose() {
      this.$validator.reset()
      this.isDialog = false
      this.isEditing = false
      this.item = {
        uid: uuidv4(),
        name: '',
        description: '',
        createdAt: null,
        updatedAt: null
      }
    },
    async onDialogAction() {
      try {
        this.isLoading = true
        const date = this.$moment().toDate()
        const payload = {
          ...this.item,
          createdAt: date,
          updatedAt: date
        }
        await itemsRef.doc(this.item.uid).set(payload, { merge: true })
        await this.getItems()
        await this.onDialogClose()
        await this.$notify({ kind: 'success', message: 'Data is saved' })
      } catch (error) {
        this.$notify({
          isError: true,
          message: error.message
        })
      } finally {
        this.isLoading = false
      }
    },

    onDeleteClose() {
      this.isDeleting = false
    },
    async onDeleteAction() {
      try {
        this.isLoading = true
        await itemsRef.doc(this.item.uid).delete()
        await this.getItems()
        await this.onDeleteClose()
        await this.$notify({ kind: 'success', message: 'Data is deleted' })
      } catch (error) {
        this.$notify({
          isError: true,
          message: error.message
        })
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>
