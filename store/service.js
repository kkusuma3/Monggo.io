export const types = {
  SET_UNCATEGORIZED_SERVICES: 'SET_UNCATEGORIZED_SERVICES',
  SET_SERVICES: 'SET_SERVICES'
}

export const state = () => ({
  uncategorizedServices: [],
  services: []
})

export const mutations = {
  [types.SET_UNCATEGORIZED_SERVICES]: (state, uncategorizedServices) => {
    state.uncategorizedServices = uncategorizedServices
  },
  [types.SET_SERVICES]: (state, services) => {
    state.services = services
  }
}
