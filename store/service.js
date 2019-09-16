/**
 * This file initialize store for service displayed on guest homepage
 */

export const types = {
  SET_UNCATEGORIZED_SERVICES: 'SET_UNCATEGORIZED_SERVICES',
  SET_SERVICES: 'SET_SERVICES'
}

export const state = () => ({
  uncategorizedServices: [], // array hold service displayed for the guest homepage
  services: [] // array hold service displayed for the guest search autocomplete
})

export const mutations = {
  [types.SET_UNCATEGORIZED_SERVICES]: (state, uncategorizedServices) => {
    state.uncategorizedServices = uncategorizedServices
  },
  [types.SET_SERVICES]: (state, services) => {
    state.services = services
  }
}
