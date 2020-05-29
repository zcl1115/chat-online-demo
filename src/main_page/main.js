import Vue from 'vue';
import Main from './Main.vue';
import ElementUI from 'element-ui';
import '../assets/css/global.css';
import 'element-ui/lib/theme-chalk/index.css';
import SocketIO from 'socket.io-client';
import VueSocketIO from 'vue-socket.io';
import axios from 'axios';
import qs from 'qs';
import echarts from 'echarts';

Vue.prototype.$echarts = echarts;
Vue.use(new VueSocketIO({
  debug: true,
  connection: SocketIO('http://127.0.0.1:3001/') //xxx填后台给的socket地址，端口号根据实际后台端口写
}));

Vue.use(ElementUI);
Vue.prototype.axios = axios;
Vue.prototype.qs = qs;
Vue.config.productionTip = false;


new Vue({
  render: h => h(Main),
}).$mount('#app');
