import * as fb from 'firebase'

class Ad {
  constructor (title, description, ownerId, imageSrc = '', promo = false, id = null) {
    this.title = title
    this.description = description
    this.ownerId = ownerId
    this.imageSrc = imageSrc
    this.promo = promo
    this.promo = promo
    this.id = id
  }
}

export default {
  state: {
    ads: []
  },
  getters: {
    ads (state) {
      return state.ads
    },
    promoAds (state) {
      return state.ads.filter(ad => {
        return ad.promo
      })
    },
    myAds (state, getters) {
      return state.ads.filter((ad) => {
        return ad.ownerId === getters.user.id
      })
    },
    adById (state) { // функция, которая возвращает функцию
      return adId => {
        return state.ads.find(ad => ad.id === adId)
      }
    }
  },
  mutations: {
    createAd (state, payload) { // создаем объявление и добавляем его в стор
      state.ads.push(payload)
    },
    loadAds (state, payload) { // грузис объявы в стор
      state.ads = payload
    },
    updateAd (state, {title, description, id}) { // обновляем объявление в сторе
      const ad = state.ads.find(a => {
        return a.id === id
      })
      ad.title = title
      ad.description = description
    }
  },
  actions: {
    async createAd ({commit, getters}, payload) { // работа с бд
      commit('clearError')
      commit('setLoading', true)
      const image = payload.image
      try {
        const newAd = new Ad(payload.title, payload.description, getters.user.id, '', payload.promo)
        const ad = await fb.database().ref('ads').push(newAd) // вносим рекламное объявление в бд
        const imageExt = image.name.slice(image.name.lastIndexOf('.')) // берем расширение файла
        const fileData = await fb.storage().ref(`ads/${ad.key}${imageExt}`).put(image) // кладем картинку в storage
        const imageSrc = await fileData.ref.getDownloadURL()
        console.log(imageSrc)
        await fb.database().ref('ads').child(ad.key).update({ // вносим путь до картинки в бд
          imageSrc
        })
        commit('setLoading', false)
        commit('createAd', {
          ...newAd,
          id: ad.key,
          imageSrc
        })
      } catch (error) {
        commit('setError', error.message)
        commit('setLoading', false)
        throw error
      }
    },
    async fetchAds ({commit}) { // берем обявления из бд
      commit('clearError') // чистим ошибки
      commit('setLoading', true) // ставим состояние загрузки
      const resultAds = []
      try {
        const fbVal = await fb.database().ref('ads').once('value')
        const ads = fbVal.val()
        Object.keys(ads).forEach(key => {
          let ad = ads[key]
          resultAds.push(new Ad(
            ad.title,
            ad.description,
            ad.ownerId,
            ad.imageSrc,
            ad.promo,
            key
          ))
        })
        commit('loadAds', resultAds) // грузим объявления в стор
        commit('setLoading', false) // убираем состояние загрузки
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    },
    async updateAd ({commit}, {title, description, id}) {
      commit('clearError')
      commit('setLoading', true)

      try {
        await fb.database().ref('ads').child(id).update({ // обновляем существующее объявление
          title, description
        })
        commit('updateAd', {title, description, id})
        commit('setLoading', false)
      } catch (error) {
        commit('setError', error.message)
        commit('setLoading', false)
        throw error
      }
    }
  }
}
