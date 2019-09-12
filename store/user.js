export const types = {
  SET_USER: 'SET_USER'
}

export const state = () => ({
  user: null
})

export const getters = {
  isAuth: state => state.user !== null,
  role: (state, getters) => (getters.isAuth ? state.user.role : null),
  isAnonymous: (state, getters) =>
    getters.isAuth ? state.user.isAnonymous : false
}

export const mutations = {
  [types.SET_USER]: (state, user = null) => {
    state.user = user
  }
}
