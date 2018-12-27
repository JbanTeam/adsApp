import store from '../store'

export default function (to, from, next) {
  if (store.getters.user) { // если пользоваель существует, то проходим дальше
    next()
  } else { // если нет - редирект на страницу ошибки
    next('/login?loginError=true')
  }
}
