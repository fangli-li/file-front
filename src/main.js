import Vue from 'vue'
import App from './App.vue'
import Storage from 'vue-ls'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from './router'
import VueAxios from 'vue-axios';
import axios from 'axios';
import less from 'less'
import Moment from 'moment'
Vue.use(less)

Vue.prototype.$axios = axios;

Vue.config.productionTip = false
Vue.use(Storage, {
    namespace: 'pro__', // key prefix
    name: 'ls', // name variable Vue.[ls] or this.[$ls],
    storage: 'local', // storage name session, local, memory
})
Vue.use(ElementUI);

new Vue({
	el: '#app',
	router,
	render: h => h(App)
})
