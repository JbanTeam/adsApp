import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import Vuetify from 'vuetify'
import BuyModalComponent from '@/components/Shared/BuyModal'
import * as fb from 'firebase'
import 'vuetify/dist/vuetify.min.css'
import colors from 'vuetify/es5/util/colors'

Vue.use(Vuetify, {
  theme: {
    primary: colors.red.base,
    secondary: colors.red.lighten4
    // accent: colors.red.base,
    // error: colors.red.base
  }
})
Vue.component('app-buy-modal', BuyModalComponent) // глобальный компонент
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  created () {
    fb.initializeApp({ // инициализируем подклчание к бд
      apiKey: 'AUTH_SECRET',
      authDomain: 'AUTH_DAMAIN',
      databaseURL: 'DB_URL',
      projectId: 'PROJECT_ID',
      storageBucket: 'STORE_BUCKET',
      messagingSenderId: 'MESSAGE_SENDER_ID'
    })
    fb.auth().onAuthStateChanged(user => { // автовход при перезагрузке страницы
      if (user) {
        this.$store.dispatch('autoLoginUser', user)
      }
    })
    this.$store.dispatch('fetchAds')
  }
})
