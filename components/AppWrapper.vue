<template>
  <v-container>
    <v-row v-if="isAddActive">
      <v-col cols="12">
        <div class="d-flex justify-end align-center">
          <v-btn
            :disabled="isLoading"
            :loading="isLoading"
            class="trigger-add"
            dark=""
            color="secondary"
            @click="$emit('trigger:add')"
          >
            <v-icon left="">mdi-plus</v-icon>
            <span>Add {{ title }}</span>
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-app-bar flat="" color="grey lighten-3">
            <v-toolbar-title>
              <h1 class="headline">
                {{ title }}
              </h1>
            </v-toolbar-title>
          </v-app-bar>
          <v-card-text>
            <slot />
          </v-card-text>
        </v-card>
        <v-dialog
          v-model="isDialog"
          persistent=""
          scrollable=""
          :width="dialogWidth"
        >
          <v-card :loading="isLoading">
            <v-app-bar flat="" color="grey lighten-3">
              <v-toolbar-title>
                <h2 class="title">
                  {{ isEditing ? 'Edit' : 'Add' }} {{ title }}
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
                <span>Cancel</span>
              </v-btn>
              <v-btn
                :loading="isLoading"
                :disabled="isLoading"
                class="dialog-action"
                color="secondary"
                @click="$emit(`dialog:action`)"
              >
                <v-icon>{{ isEditing ? 'mdi-pencil' : 'mdi-plus' }}</v-icon>
                <span>{{ isEditing ? 'Edit' : 'Add' }}</span>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="isDeleting" persistent="" scrollable="" width="500">
          <v-card :loading="isLoading">
            <v-app-bar flat="" color="grey lighten-3">
              <v-toolbar-title>
                <h2 class="title">
                  Delete Confirmation
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
                Are you sure you want to delete this data?
              </div>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn
                :loading="isLoading"
                :disabled="isLoading"
                class="delete-close"
                depressed=""
                color="secondary"
                @click="$emit('delete:close')"
              >
                <v-icon left="">mdi-cancel</v-icon>
                <span>Cancel</span>
              </v-btn>
              <v-btn
                :loading="isLoading"
                :disabled="isLoading"
                class="delete-action"
                @click="$emit(`delete:action`)"
              >
                <v-icon left="">mdi-delete</v-icon>
                <span>Delete</span>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog
          v-model="isConfirming"
          persistent=""
          scrollable=""
          width="500"
        >
          <v-card :loading="isLoading">
            <v-app-bar flat="" color="grey lighten-3">
              <v-toolbar-title>
                <h2 class="title">
                  Cancel Edit Confirmation
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
                depressed=""
                color="secondary"
                @click="$emit('confirm:close')"
              >
                <v-icon left="">mdi-cancel</v-icon>
                <span>Cancel</span>
              </v-btn>
              <v-btn
                :loading="isLoading"
                :disabled="isLoading"
                class="confirm-action"
                @click="$emit(`confirm:action`)"
              >
                <v-icon left="">mdi-check</v-icon>
                <span>Yes</span>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog
          v-model="isPreviewing"
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
                <span>Cancel</span>
              </v-btn>
              <v-btn
                :loading="isLoading"
                :disabled="isLoading"
                class="preview-action"
                color="secondary"
                @click="$emit(`preview:action`)"
              >
                <v-icon left="">mdi-check</v-icon>
                <span>Yes</span>
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
    ...mapState(['isLoading'])
  }
}
</script>
