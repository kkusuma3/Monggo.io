export const types = {
  SET_SERVICES: 'SET_SERVICES'
}

export const state = () => ({
  services: []
})

export const mutations = {
  [types.SET_SERVICES]: (state, services) => {
    state.services = services
  }
}
