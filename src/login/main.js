import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import axios from 'axios'
import qs from 'qs'
import vueRes from 'vue-resource';
import 'element-ui/lib/theme-chalk/index.css'
Vue.config.productionTip = false

Vue.prototype.axios=axios;
Vue.prototype.qs=qs;
Vue.use(vueRes);
Vue.use(ElementUI)

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
