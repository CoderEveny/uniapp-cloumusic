import { baseUrl } from './config.js'

// 首页-获取歌单
export function getTopList() {
	// uniapp封装了网络请求方法
	return new Promise((resolve,reject) => {
		uni.request({
			url: `${baseUrl}/toplist/detail`,
			method: 'GET',
			success: res => {
				let result = res.data.list;
				result.length = 4;
				resolve(result)
			}
		})	
	})
}

// List页-获取歌单详情
export function getListDetail(id) {
	return new Promise((resolve,reject) => {
		uni.request({
			url: `${baseUrl}/playlist/detail?id=${id}`,
			method: 'GET',
			success: res => {
				resolve(res)
			}
		})	
	})
}

// Detail页-获取歌曲详情
export function getSongDetail(id) {
	return uni.request({
		url: `${baseUrl}/song/detail?ids=${id}`,
		method: 'GET'
	})		
}

// Detail页-获取相似歌曲
export function getSimiSongs(id) {
	return uni.request({
		url: `${baseUrl}/simi/song?id=${id}`,
		method: 'GET'
	})
}

// Detail页-获取评论
export function getComments(id) {
	return uni.request({
		url: `${baseUrl}/comment/music?id=${id}`,
		method: 'GET'
	})
}

// Detail页-获取歌词
export function getLyric(id) {
	return uni.request({
		url: `${baseUrl}/lyric?id=${id}`,
		method: 'GET'
	})
}

// Search页-获取热词
export function getSearchHot() {
	return uni.request({
		url: `${baseUrl}/search/hot/detail`,
		method: 'GET'
	})
}

// Search页-搜索结果
export function getSearchResult(keyword) {
	return uni.request({
		url: `${baseUrl}/search?keywords=${keyword}`,
		method: 'GET'
	})
}

// Search页-获取提示
export function getSearchSuggest(keyword) {
	return uni.request({
		url: `${baseUrl}/search/suggest?keywords=${keyword}&type=mobile`,
		method: 'GET'
	})
}

