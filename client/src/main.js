import Vue from 'vue'
import App from './App.vue'
import router from './router'
// router navigation control
import '@/permission'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import axios from './http'

import '@/styles/index.scss'

Vue.config.productionTip = false

// @edu $axios is available on all Vue instances
Vue.prototype.$axios = axios

// @edu use ui set ElementUI lang to EN
import locale from 'element-ui/lib/locale/lang/en'

Vue.use(ElementUI, { locale })

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')