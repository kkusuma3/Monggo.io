<i18n>
{
  "en-us": {
    "refreshData": "@:(refresh) {title} data",
    "deleteConfirmation": "@:delete @:confirmation",
    "deleteConfirmationWarn": "Are you sure you want to delete this data?"
  },
  "en-uk": {
    "refreshData": "@:(refresh) {title} data",
    "deleteConfirmation": "@:delete @:confirmation",
    "deleteConfirmationWarn": "Are you sure you want to delete this data?"
  },
  "id": {
    "refreshData": "@:(refresh) data {title}",
    "deleteConfirmation": "@:confirmation Penghapusan",
    "deleteConfirmationWarn": "Apakah Anda yakin ingin menghapus data ini?"
  }
}
</i18n>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <div class="d-flex justify-end align-center">
          <v-tooltip bottom="">
            <template #activator="{ on }">
              <v-btn
                :disabled="isLoading"
                :loading="isLoading"
                class="trigger-refresh ma-1"
                color="secondary"
                @click="$emit('trigger:refresh')"
                v-on="on"
              >
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
            </template>
            <span>{{ $t('refreshData', { title: $t(formattedTitle) }) }}</span>
          </v-tooltip>
          <v-tooltip v-if="isAddActive" bottom="">
            <template #activator="{ on }">
              <v-btn
                :disabled="isLoading"
                :loading="isLoading"
                class="trigger-add ma-1"
                color="secondary"
                @click="$emit('trigger:add')"
                v-on="on"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
            <span>{{ $t('add') }} {{ $t(formattedTitle) }}</span>
          </v-tooltip>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-app-bar flat="" color="grey lighten-3">
            <v-toolbar-title>
              <h1 class="headline">
                {{ $t(formattedTitle) }}
              </h1>
            </v-toolbar-title>
          </v-app-bar>
          <v-card-text>
            <slot />
          </v-card-text>
        </v-card>
        <v-dialog
          :value="isDialog"
          persistent=""
          scrollable=""
          :width="dialogWidth"
        >
          <v-card :loading="isLoading">
            <v-app-bar flat="" color="grey lighten-3">
              <v-toolbar-title>
                <h2 class="title">
                  {{ isEditing ? $t('edit') : $t('add') }}
                  {{ $t(formattedTitle) }}
                </h2>
              </v-toolbar-title>
              <v-spacer />
              <v-btn
                :disabled="isLoading"
                icon=""
                @click="$emit('dialog:close')"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-app-bar>
            <v-card-text style="padding: 24px 20px">
              <slot name="form" />
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn
                :loading="isLoading"
                :disabled="isLoading"
                class="dialog-close"
                depressed=""
                @click="$emit('dialog:close')"
              >
                <v-icon left="">mdi-cancel</v-icon>
                <span>{{ $t('cancel') }}</span>
              </v-btn>
              <v-btn
                :loading="isLoading"
                :disabled="isLoading"
                class="dialog-action"
                color="secondary"
                @click="$emit(`dialog:action`)"
              >
                <v-icon>{{ isEditing ? 'mdi-pencil' : 'mdi-plus' }}</v-icon>
                <span>{{ isEditing ? $t('edit') : $t('add') }}</span>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog :value="isDeleting" persistent="" scrollable="" width="500">
          <v-card :loading="isLoading">
            <v-app-bar flat="" color="grey lighten-3">
              <v-toolbar-title>
                <h2 class="title">
                  {{ $t('deleteConfirmation') }}
                </h2>
              </v-toolbar-title>
              <v-spacer />
              <v-btn
                :disabled="isLoading"
                icon=""
                @click="$emit('delete:close')"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-app-bar>
            <v-card-text style="padding: 24px 20px">
              <div class="subtitle-1">
                {{ $t('deleteConfirmationWarn') }}
              </div>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn
                :loading="isLoading"
                :disabled="isLoading"
                class="delete-close"
                color="secondary"
                @click="$emit('delete:close')"
              >
                <v-icon left="">mdi-cancel</v-icon>
                <span>{{ $t('cancel') }}</span>
              </v-btn>
              <v-btn
                :loading="isLoading"
                :disabled="isLoading"
                depressed=""
                class="delete-action"
                @click="$emit(`delete:action`)"
              >
                <v-icon left="">mdi-delete</v-icon>
                <span>{{ $t('delete') }}</span>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog :value="isConfirming" persistent="" scrollable="" width="500">
          <v-card :loading="isLoading">
            <v-app-bar flat="" color="grey lighten-3">
              <v-toolbar-title>
                <h2 class="title">
                  Cancel Editing Confirmation
                </h2>
              </v-toolbar-title>
              <v-spacer />
              <v-btn
                :disabled="isLoading"
                icon=""
                @click="$emit('confirm:close')"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-app-bar>
            <v-card-text style="padding: 24px 20px">
              <div class="subtitle-1">
                Are you sure you want to close edit process? Any edited field
                won't save.
              </div>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn
                :loading="isLoading"
                :disabled="isLoading"
                class="confirm-close"
                color="secondary"
                @click="$emit('confirm:close')"
              >
                <v-icon left="">mdi-cancel</v-icon>
                <span>{{ $t('cancel') }}</span>
              </v-btn>
              <v-btn
                :loading="isLoading"
                :disabled="isLoading"
                depressed=""
                class="confirm-action"
                @click="$emit(`confirm:action`)"
              >
                <v-icon left="">mdi-check</v-icon>
                <span>{{ $t('yes') }}</span>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog
          :value="isPreviewing"
          persistent=""
          scrollable=""
          :width="previewWidth"
        >
          <v-card :loading="isLoading">
            <v-app-bar flat="" color="grey lighten-3">
              <v-toolbar-title>
                <h2 class="title">
                  {{ previewTitle }}
                </h2>
              </v-toolbar-title>
              <v-spacer />
              <v-btn
                :disabled="isLoading"
                icon=""
                @click="$emit('preview:close')"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-app-bar>
            <v-card-text style="padding: 24px 20px">
              <slot name="preview" />
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn
                :loading="isLoading"
                :disabled="isLoading"
                class="preview-close"
                depressed=""
                @click="$emit('preview:close')"
              >
                <v-icon left="">mdi-cancel</v-icon>
                <span>{{ $t('cancel') }}</span>
              </v-btn>
              <v-btn
                :loading="isLoading"
                :disabled="isLoading"
                class="preview-action"
                color="secondary"
                @click="$emit(`preview:action`)"
              >
                <v-icon left="">mdi-check</v-icon>
                <span>{{ $t('ok') }}</span>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import paramCase from 'param-case'

export default {
  name: 'AppWrapper',
  props: {
    isAddActive: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      required: true
    },
    dialogWidth: {
      type: [String, Number],
      default: 500
    },
    previewWidth: {
      type: [String, Number],
      default: 900
    },
    isEditing: {
      type: Boolean,
      required: true
    },
    isConfirming: {
      type: Boolean,
      required: true
    },
    isDialog: {
      type: Boolean,
      required: true
    },
    isDeleting: {
      type: Boolean,
      required: true
    },
    isPreviewing: {
      type: Boolean,
      default: false
    },
    previewTitle: {
      type: String,
      default: 'Preview'
    }
  },
  computed: {
    ...mapState(['isLoading']),
    formattedTitle() {
      return paramCase(this.title)
    }
  }
}
</script>
