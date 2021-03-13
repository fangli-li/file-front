import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from './router'
import VueAxios from 'vue-axios';
import axios from 'axios';
import less from 'less'
Vue.use(less)

Vue.prototype.$axios = axios;

Vue.config.productionTip = false
Vue.use(ElementUI);

new Vue({
	el: '#app',
	router,
	render: h => h(App)
})
