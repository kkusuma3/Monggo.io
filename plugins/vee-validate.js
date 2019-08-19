import Vue from 'vue'
import VeeValidate from 'vee-validate'
import en from 'vee-validate/dist/locale/en'
import id from 'vee-validate/dist/locale/id'

export default ({ app }) => {
  Vue.use(VeeValidate, {
    i18n: app.i18n,
    dictionary: {
      en,
      id
    }
  })
}
