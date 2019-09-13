export const types = {
  SET_LOADING: 'SET_LOADING',
  SET_DATA_LOADED: 'SET_DATA_LOADED'
}

export const state = () => ({
  isLoading: false,
  isDataLoaded: false
})

export const getters = {}

export const mutations = {
  [types.SET_LOADING]: (state, isLoading) => {
    state.isLoading = isLoading
  },
  [types.SET_DATA_LOADED]: (state, isDataLoaded) => {
    state.isDataLoaded = isDataLoaded
  }
}

export const actions = {}
