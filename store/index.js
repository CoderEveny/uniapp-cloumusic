// uniapp内置了Vuex，直接导入就好
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		topListIds: [],
		currentIndex: null,
	},
	getters: {
		nextId: state => {
			return state.currentIndex === null ? null : state.topListIds[state.currentIndex + 1]
		}
	},
	mutations: {
		init_topListIds(state, payload) {
			state.topListIds = payload
		},
		getCurrentIndex(state, payload) {
			state.currentIndex = payload
		}
	},
	methods: {
		
	}
})
