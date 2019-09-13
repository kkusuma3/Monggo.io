import { types } from '~/store'

export default ({ store: { commit } }, inject) => {
  const setDataLoaded = isDataLoaded => {
    commit(types.SET_DATA_LOADED, isDataLoaded)
  }
  const setLoading = isLoading => {
    commit(types.SET_LOADING, isLoading)
  }
  inject('setLoading', setLoading)
  inject('setDataLoaded', setDataLoaded)
}
