/**
 * This file initialize store for global state
 */

export const types = {
  SET_LOADING: 'SET_LOADING',
  SET_DATA_LOADED: 'SET_DATA_LOADED'
}

export const state = () => ({
  isLoading: false, // hold global loading state
  isDataLoaded: false // hold global data loaded state
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
