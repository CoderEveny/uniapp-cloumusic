<template>
	<view class="index">
		<musichead title="网易云音乐" :iconShow="false"/>
		<view class="container" v-show="!isLoading">
			<!-- 可滚动区域 -->
			<scroll-view scroll-y="true" > <!-- 表示y轴可以滚动-->
				<!-- 搜索框区域 -->
				<view class="index-search" @tap="handleToSearch">
					<text class="cloud cloud-sousuo"/>
					<input type="text" placeholder="搜索歌曲" />
				</view>
				<!-- 歌单列表 -->
				<view class="index-list">
					<view class="index-list-item" v-for="(item,index) in topList" 
					:key="index" @tap="handleToList(item.id)"> <!-- @tap:手指触摸后马上离开-->
						<view class="index-list-item-img">
							<image :src="item.coverImgUrl" mode="" />
							<text>{{item.updateFrequency}}</text>
						</view>
						<view class="index-list-item-text">
							<view class="text-content" v-for="(songItem,songIndex) in item.tracks" :key="songIndex">
								{{songIndex + 1}}.{{songItem.first}} - {{songItem.second}}
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	// 公共组件相关
	import musichead from 'components/musichead/musichead.vue'
	// 网络请求相关
	import { getTopList } from 'utils/api.js'
	
	export default {
		components: {
			musichead
		},
		data() {
			return {
				topList: [],
				isLoading: true
			}
		},
		onLoad() {  //整个页面加载完毕触发的
			uni.showLoading({
				title: '加载中...'
			})
			this.isLoading = true,
			this.getTopList()
		},
		methods: {
			handleToList(id) {
				uni.navigateTo({
					url: '/pages/List/List?id=' + id //动态传参
				})
			},
			getTopList() {
				getTopList().then(res => {
					if(res.length) {
						this.topList = res.map(item => ({
							name: item.name,
							id: item.id,
							coverImgUrl: item.coverImgUrl,
							updateFrequency: item.updateFrequency,
							tracks: item.tracks
						}))
						this.isLoading = false
						uni.hideLoading()
					}
				})
			},
			handleToSearch() {
				uni.navigateTo({
					url: '/pages/Search/Search'
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.index-search {
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
	.index-list {
		margin: 0 30rpx;
	}
	.index-list-item {
		display: flex;
		margin-bottom: 34rpx;
		.index-list-item-img {
			width: 212rpx;
			height: 212rpx;
			position: relative;
			border-radius: 30rpx;
			margin-right: 22rpx;
			overflow: hidden;
			image {
				width: 100%;
				height: 100%;
			}
			text {
				position: absolute;
				left: 12rpx;
				bottom: 16rpx;
				color: #fff;
				font-size: 20rpx;
			}
		}
		.index-list-item-text {
			flex: 1;
			font-size: 24rpx;
			line-height: 66rpx;
			.text-content {
				width: calc(100vw - 294rpx);
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}			
		}
	}
</style>
