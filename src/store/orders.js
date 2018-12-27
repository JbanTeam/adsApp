import * as fb from 'firebase'

class Order {
  constructor (name, phone, adId, done = false, id = null) {
    this.name = name
    this.phone = phone
    this.adId = adId
    this.done = done
    this.id = id
  }
}

export default {
  state: {
    orders: []
  },
  getters: {
    doneOrders (state) { // завершенные заказы
      return state.orders.filter(o => o.done)
    },
    undoneOrders (state) {
      return state.orders.filter(o => !o.done) // незавершенные заказы
    },
    orders (state, getters) { // все заказы
      return getters.undoneOrders.concat(getters.doneOrders)
    }
  },
  mutations: {
    loadOrders (state, payload) { // загрузить заказы
      state.orders = payload
    }
  },
  actions: {
    async createOrder ({commit}, {name, phone, adId, ownerId}) { // создать заказ
      const order = new Order(name, phone, adId)
      commit('clearError')

      try {
        await fb.database().ref(`/users/${ownerId}/orders`).push(order)
      } catch (error) {
        commit('setError', error.message)
        throw error
      }
    },
    async fetchOrders ({commit, getters}) { // достать заказы из бд
      commit('setLoading', true)
      commit('clearError')
      const resultOrders = []
      try {
        const fbVal = await fb.database().ref(`/users/${getters.user.id}/orders`).once('value')
        const orders = fbVal.val()

        Object.keys(orders).forEach(key => {
          const o = orders[key]
          resultOrders.push(new Order(o.name, o.phone, o.adId, o.done, key))
        })

        commit('loadOrders', resultOrders)
        commit('setLoading', false)
      } catch (error) {
        commit('setError', error.message)
        commit('setLoading', false)
        throw error
      }
    },
    async markOrderDone ({commit, getters}, payload) { // пометить заказ как завершенный
      commit('clearError')
      try {
        await fb.database().ref(`users/${getters.user.id}/orders`).child(payload).update({
          done: true
        })
      } catch (error) {
        commit('setError', error.message)
        throw error
      }
    }
  }
}
