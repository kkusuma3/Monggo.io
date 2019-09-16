/**
 * This file initialize store for category
 */

export const types = {
  SET_CATEGORIES: 'SET_CATEGORIES'
}

export const state = () => ({
  categories: []
})

export const mutations = {
  [types.SET_CATEGORIES]: (state, categories) => {
    state.categories = categories
  }
}
