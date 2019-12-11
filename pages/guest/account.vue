<template>
  <v-container
    id="guest-account"
    :class="{ 'fill-height': !isDataLoaded || isAnonymous }"
  >
    <v-fade-transition mode="out-in" hide-on-leave="">
      <v-row
        v-if="!isDataLoaded"
        class="fill-height ma-0"
        align="center"
        justify="center"
      >
        <v-progress-circular indeterminate="" color="grey lighten-1" />
      </v-row>
      <v-row v-else="">
        <v-col cols="12">
          <div v-if="isAnonymous" class="d-flex align-center justify-center">
            <div class="text-center">
              <app-img
                src="/icons/icon-with-text.png"
                alt="Monggo.IO"
                width="150"
                height="150"
                class="mb-3"
              />
              <v-btn
                :disabled="isLoading"
                :loading="isLoading"
                color="primary"
                @click="onLoginUpgrade"
              >
                <v-icon left="">mdi-login-variant</v-icon>
                <span>{{ $t('login') }}</span>
              </v-btn>
            </div>
          </div>
          <v-card v-else-if="isAuth">
            <v-card-text class="text-center">
              <v-avatar
                :color="getMaterialColor(user.name || user.email)"
                size="100"
                class="mb-3"
              >
                <app-img
                  v-if="user.avatar && user.avatar.length > 0"
                  :src="user.avatar"
                  :alt="user.name || user.email"
                />
                <span
                  v-else=""
                  class="headline"
                  :class="{
                    'white--text': isDarkColor(
                      getMaterialColor(user.name || user.email, true)
                    )
                  }"
                >
                  {{ getInitials(user.name || user.email) }}
                </span>
              </v-avatar>
              <h2 class="title mb-3">{{ user.name || user.email }}</h2>
              <v-btn
                :disabled="isLoading"
                :loading="isLoading"
                :color="!isEditing ? 'info' : 'primary'"
                @click="onTriggerSave"
              >
                <v-icon left="">
                  {{ !isEditing ? 'mdi-pencil' : 'mdi-content-save' }}
                </v-icon>
                <span>{{ !isEditing ? $t('edit') : $t('save') }}</span>
              </v-btn>
            </v-card-text>
            <v-card-text>
              <v-text-field
                v-model="item.name"
                v-validate="{ required: !item.isAnonymous }"
                :error-messages="errors.collect('name')"
                :disabled="isLoading || !isEditing"
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
                v-model="item.phone"
                :disabled="isLoading || !isEditing"
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
                :disabled="isLoading || !isEditing"
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
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-fade-transition>
  </v-container>
</template>

<script>
import isDarkColor from 'is-dark-color'
import materialColorHash from 'material-color-hash'
import initials from 'initials'
import _cloneDeep from 'lodash.clonedeep'
import cleanDeep from 'clean-deep'
import { mapState, mapGetters } from 'vuex'
import { auth, GoogleAuthProvider, db } from '~/utils/firebase'
import { types as userTypes } from '~/store/user'

export default {
  head() {
    return {
      title: `${this.$t('account')} - ${this.$t('guest')}`
    }
  },
  data() {
    return {
      isEditing: false,
      item: {
        uid: null,
        name: null,
        email: null,
        phone: null,
        currency: 'IDR', // 'USD',
        avatar: '',
        role: null,
        createdAt: null,
        updatedAt: null
      },
      currencies: [
        { text: 'United States Dollar', value: 'USD', symbol: '$' },
        { text: 'Pound Sterling', value: 'GBP', symbol: '£' },
        { text: 'Indonesian Rupiah', value: 'IDR', symbol: 'Rp' }
      ]
    }
  },
  computed: {
    ...mapState(['isLoading', 'isDataLoaded']),
    ...mapState('user', ['user']),
    ...mapGetters('user', ['isAnonymous', 'isAuth']),
    ...mapState('guest', ['qr']),
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
    }
  },
  watch: {
    user: {
      handler(user) {
        if (user) {
          this.item = {
            uid: user.uid,
            name: user.name,
            email: user.email,
            phone: user.phone,
            currency: user.currency || 'IDR', // 'USD',
            avatar: user.avatar || '',
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
          }
        }
      },
      immediate: true
    },
    isEditing(isEditing) {
      if (!isEditing) {
        this.onSave()
      }
    }
  },
  methods: {
    /**
     * Called when the anonymous user click the login button
     */
    async onLoginUpgrade() {
      try {
        this.$setLoading(true)
        await auth.currentUser.linkWithRedirect(GoogleAuthProvider)
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
     * Called when the signed user (Has been signed using Google) click the save button.
     * It check whether the field is correct or not. If it correct, it will trigger
     * onSave method below.
     */
    async onTriggerSave() {
      if (!this.isEditing) {
        this.isEditing = true
      } else {
        try {
          this.$setLoading(true)
          const isValid = await this.$validator.validateAll()
          if (isValid) {
            this.isEditing = false
          }
        } catch (error) {
          this.$notify({
            isError: true,
            message: error.message
          })
        } finally {
          this.$setLoading(false)
        }
      }
    },
    /**
     * Called when the field is correct and save data to firestore
     */
    async onSave() {
      try {
        this.$setLoading(true)
        const payload = _cloneDeep(this.item)
        await db
          .collection('users')
          .doc(this.item.uid)
          .set(
            cleanDeep(payload, {
              emptyArrays: false,
              emptyObjects: false,
              emptyStrings: false,
              nullValues: false
            }),
            { merge: true }
          )
        const userDoc = await db
          .collection('users')
          .doc(this.item.uid)
          .get()
        await (() => {
          let userRef = userDoc.data()
          userRef = {
            ...userRef,
            createdAt:
              userRef && userRef.createdAt && userRef.createdAt.toDate(),
            updatedAt:
              userRef && userRef.updatedAt && userRef.updatedAt.toDate()
          }
          if (userRef) {
            this.$store.commit(`user/${userTypes.SET_USER}`, userRef)
          }
        })()
        await this.$notify({ kind: 'success', message: this.$t('dataSaved') })
      } catch (error) {
        this.$notify({
          isError: true,
          message: error.message
        })
      } finally {
        this.$setLoading(false)
      }
    }
  }
}
</script>
