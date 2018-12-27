export default {
  state: {
    loading: false,
    error: null
  },
  getters: {
    loading (state) {
      return state.loading
    },
    error (state) {
      return state.error
    }
  },
  mutations: {
    setLoading (state, payload) { // установить состояние загрузки
      state.loading = payload
    },
    setError (state, payload) { // установить "произошла ошибка"
      state.error = payload
    },
    clearError (state) { // очистить ошибку
      state.error = null
    }
  },
  actions: {
    setLoading ({commit}, payload) {
      commit('setLoading', payload)
    },
    setError ({commit}, payload) {
      commit('setError', payload)
    },
    clearError ({commit}) {
      commit('clearError')
    }
  }
}
