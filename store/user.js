/**
 * This file initialize store for anything related to user
 */

export const types = {
  SET_USER: 'SET_USER'
}

export const state = () => ({
  user: null // object hold the entire user information
})

export const getters = {
  isAuth: state => state.user !== null, // getter if current user is authenticated or not
  role: (state, getters) => (getters.isAuth ? state.user.role : null), // getter for user role
  isAnonymous: (state, getters) =>
    getters.isAuth ? state.user.isAnonymous : false // getter whether current logged in user is anonymous user or not
}

export const mutations = {
  [types.SET_USER]: (state, user = null) => {
    state.user = user
  }
}
