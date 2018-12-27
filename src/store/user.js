import * as fb from 'firebase'

class User {
  constructor (id) {
    this.id = id
  }
}

export default {
  state: {
    user: null
  },
  getters: {
    user (state) { // текущий юзер
      return state.user
    },
    isUserLoggedIn (state) { // залогинен ли юзер
      return state.user !== null
    }
  },
  mutations: {
    setUser (state, payload) { // установить юзера
      state.user = payload
    }
  },
  actions: {
    async registerUser ({commit}, {email, password}) { // регистрация юзера
      commit('clearError') // очищаем ошибки
      commit('setLoading', true) // ставим флаг что идет загрузка
      try {
        const user = await fb.auth().createUserWithEmailAndPassword(email, password)
        commit('setUser', new User(user.uid))
        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    },
    async loginUser ({commit}, {email, password}) {
      commit('clearError') // очищаем ошибки
      commit('setLoading', true) // ставим флаг что идет загрузка
      try {
        const user = await fb.auth().signInWithEmailAndPassword(email, password)
        commit('setUser', new User(user.user.uid))
        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    },
    autoLoginUser ({commit}, payload) { // автологин при перезагрузке страницы
      commit('setUser', new User(payload.uid))
    },
    logoutUser ({commit}) { // логаут
      fb.auth().signOut()
      commit('setUser', null)
    }
  }
}
