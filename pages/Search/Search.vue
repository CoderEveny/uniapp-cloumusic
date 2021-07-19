<template>
	<view class="search">
		<musichead title="搜索" :iconShow="true" :iconColor="true"/>
		<view class="container">
			<!-- 可滚动区域 -->
			<scroll-view scroll-y="true" > <!-- 表示y轴可以滚动-->
				<!-- 搜索框区域 -->
				<view class="search-input">
					<text class="cloud cloud-sousuo"/>
					<!-- @confirm点击回车时触发-->
					<!-- @input键盘输入时input触发事件 -->
					<input type="text" placeholder="搜索歌曲" 
					v-model="searchWord"
					@confirm="handleToSearch(searchWord)" 
					@input="handleToSuggest"
					/> 	
					<text v-show="searchType !== 1" 
					class="cloud cloud-close"
					@tap="handleSetType"></text>
				</view>
				<!-- block:不占位 -->
				<!-- 搜索面 -->
				<block v-if="searchType === 1">
					<!-- 历史记录区 -->
					<view class="search-history">
						<view class="search-history-head">
							<text>历史记录</text>
							<text class="cloud cloud-lajitong" @tap="handleToClear"></text>
						</view>
						<view class="search-history-list">
							<view v-for="(item,index) in searchHistory" :key="index"
							@tap="handleToWord(item)">
								{{item}}
							</view>
						</view>
					</view>
					<!-- 热搜榜 -->
					<view class="search-hot">
						<view class="search-hot-head">热搜榜</view>
						<view class="search-hot-item" 
						v-for="(item,index) in hotList" 
						:key="index"
						@tap="handleToWord(item.searchWord)">
							<view class="search-hot-index">{{ index + 1 }}</view>
							<view class="search-hot-word">
								<view>
									{{ item.searchWord }}
									<image :src="item.iconUrl" mode="aspectFit"/>  <!-- 跟background很像，mode="aspectFit"：保持横纵比-->
								</view>
								<view>{{ item.content }}</view>
							</view>
							<text class="search-hot-count">{{item.count}}</text>
						</view>
					</view>
				</block>
				<!-- 搜索结果面 -->
				<block v-else-if="searchType === 2">
					<view class="search-result">
						<view class="search-result-item" 
						v-for="(item,index) in searchList"
						:key="index"
						@tap="handleToDetail(item.id)">
							<view class="search-result-word">
								<view>{{item.name}}</view>
								<view>{{item.ar}}-{{item.album}}</view>
							</view>
							<text class="cloud cloud-bofang"></text>
						</view>	
					</view>
				</block>
				<block v-else-if="searchType === 3">
					<view class="search-suggest">
						<view class="search-suggest-head">搜索“{{searchWord}}”</view>
						<view class="search-suggest-item" 
						v-for="(item,index) in searchSuggest"
						:key="index"
						@tap="handleToWord(item)">
							<text class="cloud cloud-sousuo"></text>
							{{item}}
						</view>
					</view>
				</block>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	// 公共组件相关
	import musichead from 'components/musichead/musichead.vue'
	// 网络请求相关
	import { getSearchHot, getSearchResult, getSearchSuggest } from 'utils/api.js'
	
	export default {
		name: 'Search',
		components: {
			musichead
		},
		data() {
			return {
				hotList: [],
				searchWord: '',
				searchHistory: [],
				searchList: [],
				searchSuggest: [],
				searchType: 1
			}
		},
		onLoad() {
			getSearchHot().then(res => {
				if(res[1].data.code === 200) {
					this.hotList = res[1].data.data.map(item => ({
						content: item.content,
						searchWord: item.searchWord,
						iconUrl: item.iconUrl,
						count: item.score
					}))
				}
			}),
			// 从本地把搜索记录拿出来
			uni.getStorage({
				key: 'searchHistory',
				success: res => {
					this.searchHistory = res.data
				}
			})
		},
		methods: {
			handleToWord(word) {
				this.searchWord = word;
				this.handleToSearch(word)
			},
			handleToSearch(word) {
				// unshift：从头部开始添加
				this.searchHistory.unshift(word);
				// ES6 set去重
				this.searchHistory = [...new Set(this.searchHistory)]
				if(this.searchHistory.length > 10) {
					this.searchHistory.length = 10;
				}
				// 记录在本地
				uni.setStorage({
					key: 'searchHistory',
					data: this.searchHistory
				});
				this.getSearchList(word)
			},
			// 清空本地存储
			handleToClear() {
				uni.removeStorage({
					key: 'searchHistory',
					success: res => {
						this.searchHistory = []
					}
				})
			},
			// 获取搜索结果
			getSearchList(word) {
				this.searchType = 2;
				getSearchResult(word).then(res => {
					if(res[1].data.code === 200) {
						this.searchList = res[1].data.result.songs.map(item => ({
							name: item.name,
							album: item.album.name,
							id: item.id,
							ar: item.artists.map(arItem => arItem.name).join('/')
						}))
					}
				})
			},
			handleToDetail(id) {
				uni.navigateTo({
					url: '/pages/Detail/Detail?id=' + id
				})
			},
			handleSetType() {
				this.searchWord = '';
				this.searchType = 1
			},
			handleToSuggest(event) {
				this.searchType = 3;
				let value = event.detail.value; //拿到当前输入
				if(!value) {
					this.searchType = 1;
					return
				}
				getSearchSuggest(value).then(res => {
					if(res[1].data.code === 200) {
						this.searchSuggest = res[1].data.result.allMatch.map(item => item.keyword)
					}
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.search-input {
		display: flex;
		align-items: center;
		height: 70rpx;
		margin: 30rpx 30rpx 30rpx 30rpx;
		background: #f7f7f7;
		border-radius: 35rpx;
		.cloud {
			font-size: 26rpx;
			margin: 0 26rpx;
		}
		input{
			font-size: 24rpx;
			flex: 1;
		}
	}
	
	.search-history {
		margin: 0 30rpx 50rpx 30rpx;
		font-size: 26rpx;
	}
	.search-history-head {
		display: flex;
		justify-content: space-between;
		margin-bottom: 36rpx;
	}
	.search-history-list {
		display: flex;
		flex-wrap: wrap;
		view {
			padding: 16rpx 28rpx;
			border-radius: 40rpx;
			margin-right: 30rpx;
			margin-bottom: 30rpx;
			background: #f7f7f7;
		}
	}
	
	.search-hot {
		margin: 0 30rpx;
		font-size: 26rpx;
	}
	.search-hot-head {
		margin-bottom: 36rpx;
	}
	.search-hot-item {
		display: flex;
		align-items: center;
		margin-bottom: 58rpx;
		.search-hot-index {
			margin-right: 20rpx;
			color: #fb2222;
			width: 60rpx;
			text-align: center;
		}
		.search-hot-word {
			flex: 1;
			image {
				width: 48rpx;
				height: 22rpx;
				margin-left: 10rpx;
			}
			view:nth-child(1) {
				font-size: 30rpx;
				color: #000;
			}
			view:nth-child(2) {
				font-size: 24rpx;
				color: #878787;
			}
		}
		.search-hot-count {
			color: #878787;
			margin-left: 10rpx;
		}
	}

	.search-result {
		border-top: 2rpx solid #e4e4e4;
		padding: 30rpx;
	}
	.search-result-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-bottom: 30rpx;
		margin-bottom: 30rpx;
		border-bottom: 2rpx solid #e4e4e4;
		.search-result-word {
			view:nth-child(1) {
				font-size: 28rpx;
				color: #235790;
				margin-bottom: 12rpx;
			}
			view:nth-child(2) {
				font-size: 22rpx;
				color: #898989;
			}
		}
		text {
			font-size: 34rpx;
		}
	}

	.search-suggest {
		border-top: 2rpx solid #e4e4e4;
		padding: 30rpx;
		font-size: 26rpx;
	}	
	.search-suggest-head {
		color: #4574a5;
		margin-bottom: 74rpx;
	}
	.search-suggest-item {
		color: #5d5d5d;
		margin-bottom: 74rpx;
		text {
			color: #bdbdbd;
			margin-right: 20rpx;
		}
	}
</style>
