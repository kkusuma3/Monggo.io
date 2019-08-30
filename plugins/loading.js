import { types } from '~/store'

export default ({ store: { commit } }, inject) => {
  const setLoading = isLoading => {
    commit(types.SET_LOADING, isLoading)
  }
  inject('setLoading', setLoading)
}
