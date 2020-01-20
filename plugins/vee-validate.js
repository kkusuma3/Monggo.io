import Vue from 'vue'
import VeeValidate from 'vee-validate'
import en from 'vee-validate/dist/locale/en'
import id from 'vee-validate/dist/locale/id'
import cn from 'vee-validate/dist/locale/zh_CN'
import ja from 'vee-validate/dist/locale/ja'

export default ({ app }) => {
  Vue.use(VeeValidate, {
    i18n: app.i18n,
    dictionary: {
      'en-us': en,
      'en-uk': en,
      id,
      cn,
      ja
    }
  })
}
