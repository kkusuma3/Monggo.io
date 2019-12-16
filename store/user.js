/**
 * This file initialize store for anything related to user
 */

export const types = {
  SET_USER: 'SET_USER',
  SET_LOCALE: 'SET_LOCALE',
  SET_QR: 'SET_QR'
}

export const state = () => ({
  qr: null,
  locale: null,
  user: null // object hold the entire user information,
  // Uncomment this user object below start from line 13 to 28 to run E2E test
  // then comment user object on line 10 above
  // user: {
  //   avatar:
  //     'https://lh4.googleusercontent.com/-YHbsFQddGE8/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rexqf_sp9Qjt9KLHa-k52ZR3QwvrQ/photo.jpg',
  //   createdAt:
  //     '[native Date Sun Sep 08 2019 07:45:49 GMT+0700 (Western Indonesia Time)]',
  //   currency: 'USD',
  //   email: 'monggoayoio@gmail.com',
  //   hotel: null,
  //   isAnonymous: false,
  //   name: 'Monggo IO',
  //   phone: null,
  //   role: 'admin',
  //   uid: 'ZJZBjzNGjHcoiCCEmogub2rbZDY2',
  //   updatedAt:
  //     '[native Date Fri Sep 13 2019 05:06:49 GMT+0700 (Western Indonesia Time)]',
  //   refData: { hotel: null }
  // }
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
  },
  [types.SET_LOCALE]: (state, locale = null) => {
    state.locale = locale
  },
  [types.SET_QR]: (state, qr = null) => {
    state.qr = qr
  }
}
