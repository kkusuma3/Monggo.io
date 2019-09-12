export const types = {
  SET_UID: 'SET_UID',
  SET_QR: 'SET_QR',
  SET_SERVICE: 'SET_SERVICE'
}

export const state = () => ({
  uid: null,
  qr: null,
  service: null
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
  },
  [types.SET_SERVICE]: (state, service) => {
    state.service = service
  }
}

export const actions = {}
