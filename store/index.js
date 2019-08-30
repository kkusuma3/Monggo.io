export const types = {
  SET_LOADING: 'SET_LOADING'
}

export const state = () => ({
  isLoading: false
})

export const getters = {}

export const mutations = {
  [types.SET_LOADING]: (state, isLoading) => {
    state.isLoading = isLoading
  }
}

export const actions = {}
