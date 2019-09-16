/**
 * This file initialize store for anything related to notification
 */

export const types = {
  SET_NOTIFICATION: 'SET_NOTIFICATION'
}

export const state = () => ({
  isError: false, // is notification error?
  kind: 'info', // notification kind, can be following value: 'success', 'info', 'warning', 'error'
  message: null // notification message
})

export const mutations = {
  [types.SET_NOTIFICATION](
    state,
    { isError = false, kind = 'info', message = null }
  ) {
    state.isError = isError
    state.message = message
    if (isError) {
      state.kind = 'error'
    } else {
      state.kind = kind
    }
  }
}
