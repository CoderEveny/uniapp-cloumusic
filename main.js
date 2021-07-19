import Vue from 'vue'
import App from './App'
import store from 'store/index.js'

Vue.config.productionTip = false

App.mpType = 'app'

Vue.filter('formatCount', value => {
	if(value >= 10000 && value < 100000000) {
		value /= 10000; // 万
		return value.toFixed(1) + '万'; // toFixed：留一位小数
	} else if(value > 100000000) {
		value /= 100000000;
		return value.toFixed(1) + '亿';
	} else {
		return value
	}
})

const app = new Vue({
    ...App,
		store //这样就可以通过this访问到store了
})
app.$mount()
