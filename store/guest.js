export const types = {
  SET_UID: 'SET_UID',
  SET_QR: 'SET_QR'
}

export const state = () => ({
  uid: null,
  qr: null
})

export const getters = {
  isCheckedIn: state => state.uid !== null
}

export const mutations = {
  [types.SET_UID]: (state, uid) => {
    state.uid = uid
  },
  [types.SET_QR]: (state, qr) => {
    state.qr = qr
  }
}

export const actions = {}
