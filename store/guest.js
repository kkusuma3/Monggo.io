/**
 * This file initialize store for anything related to guest
 */

export const types = {
  SET_UID: 'SET_UID',
  SET_QR: 'SET_QR',
  SET_SERVICE: 'SET_SERVICE',
  SET_ORDERS: 'SET_ORDERS',
  SET_RATES: 'SET_RATES',
  SET_SORT_BY: 'SET_SORT_BY'
}

export const state = () => ({
  uid: null, // user id got after scanning the qr code
  qr: null, // object hold the entire information about the qr
  service: null, // object hold the choosen service
  orders: [], // array hold user orders
  rates: [], // array hold current currency rates,
  sortBy: 'name asc' // hold current filter
})

export const getters = {
  isCheckedIn: state => state.uid !== null,
  sortByArray: state => {
    if (!state.sortBy) {
      return 'name asc'
    }
    return state.sortBy.split(' ')
  }
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
  },
  [types.SET_SORT_BY]: (state, sortBy) => {
    state.sortBy = sortBy
  }
}

export const actions = {}
