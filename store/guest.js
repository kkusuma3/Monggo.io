export const types = {
  SET_UID: 'SET_UID',
  SET_QR: 'SET_QR',
  SET_SERVICE: 'SET_SERVICE',
  SET_ORDERS: 'SET_ORDERS',
  SET_RATES: 'SET_RATES'
}

export const state = () => ({
  uid: null,
  qr: null,
  service: null,
  orders: [],
  rates: []
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
  },
  [types.SET_ORDERS]: (state, orders) => {
    state.orders = orders
  },
  [types.SET_RATES]: (state, rates) => {
    state.rates = rates
  }
}

export const actions = {}
