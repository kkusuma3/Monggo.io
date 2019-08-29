<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <div class="d-flex justify-end">
          <v-btn
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
              <v-btn icon="" @click="$emit('dialog:close')">
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
                class="dialog-close"
                depressed=""
                @click="$emit('dialog:close')"
              >
                <v-icon left="">mdi-cancel</v-icon>
                <span>Cancel</span>
              </v-btn>
              <v-btn
                :loading="isLoading"
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
              <v-btn icon="" @click="$emit('delete:close')">
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
                class="delete-action"
                @click="$emit(`delete:action`)"
              >
                <v-icon left="">mdi-delete</v-icon>
                <span>Delete</span>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'AppWrapper',
  props: {
    title: {
      type: String,
      required: true
    },
    dialogWidth: {
      type: [String, Number],
      default: 500
    },
    isLoading: {
      type: Boolean,
      required: true
    },
    isEditing: {
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
    }
  }
}
</script>
