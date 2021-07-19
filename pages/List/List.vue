<template>
	<view class="list">
		<view class="fixbg" :style="{background: 'url(' + dataSource.coverImgUrl + ')'}"></view>
		<musichead title="歌单" :iconShow="true" :color="true"/>
		<view class="container" v-show="!isLoading">
			<scroll-view scroll-y="true">
				<!-- 信息头部 -->
				<view class="list-head">
					<view class="list-head-img">
						<image :src="dataSource.coverImgUrl" mode="" />
						<view>
							<text class="cloud cloud-bofang"></text>
							{{dataSource.playCount | formatCount}}
						</view>
					</view>
					<view class="list-head-text">
						<view>{{dataSource.name}}</view>
						<view>
							<image :src="dataSource.avatarUrl" mode="" />
							{{ dataSource.nickName }}
						</view>
						<view>{{dataSource.description}}</view>
					</view>
				</view>
				
				<!-- 分享按钮：小程序自带的 -->
				<!-- 条件编译差异化 -->
				<!-- #ifdef MP-WEIXIN -->
					<button open-type="share" class="list-share">
						<text class="cloud cloud-fenxiang" />
						分享给微信好友
					</button>
				<!-- #endif -->	
				
				<!-- 歌单列表 -->
				<view class="list-music" v-if="dataSource.tracks">
					<view class="list-music-head">
						<text class="cloud cloud-bofang" />
						<text>播放全部</text>
						<text>(共{{dataSource.tracks.length}}首)</text>
					</view>
					<view class="list-music-item" 
					v-for="(item,index) in dataSource.tracks"
					:key="index" @tap="handleToDetail(item.al.id, index)">
						<view class="item-index">{{index + 1}}</view>
						<view class="item-song">
							<view>{{item.al.name}}</view>
							<view>{{item.ar}}</view>
						</view>
						<view class="item-icon">
							<text class="cloud cloud-bofang"></text>
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
	// 网络接口
	import { getListDetail } from 'utils/api.js'
	// 过滤数据
	import { PlayListFilter } from 'utils/dataFilter.js'
	
	export default {
		components: {
			musichead
		},
		data() {
			return {
				dataSource: [],
				isLoading: true
			};
		},
		onLoad(options) {
			uni.showLoading({
				title: '加载中...'
			}),
			this.isLoading = true,
			this.getListDetail(options.id)
		},
		methods: {
			handleToDetail(id, index) {
				this.$store.commit('getCurrentIndex', index),
				uni.navigateTo({
					url: '/pages/Detail/Detail?id=' + id
				})
			},
			getListDetail(id) {
				getListDetail(id).then(res => {
					if(res) {
						this.dataSource = new PlayListFilter(res.data.playlist),
						this.$store.commit('init_topListIds', this.dataSource.trackIds),
						this.isLoading = false,
						uni.hideLoading()
					}
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.list-head{
		display: flex;
		margin: 30rpx;
	}
	.list-head-img {
		width: 264rpx;
		height: 264rpx;
		border-radius: 30rpx;
		overflow: hidden;
		position: relative;
		margin-right: 42rpx;
		image {
			width: 100%;
			height: 100%;
		}
		view {
			position: absolute;
			right: 8rpx;
			top: 8rpx;
			color: #fff;
			font-size: 20rpx;
			text {
				font-size: 20rpx;
				margin-right: 10rpx;
			}
		}
	}
	.list-head-text {
		color: #f0f3f7;
		flex: 1;
		view:nth-child(1) {
			font-size: 34rpx;
			color: #fff;
		}
		view:nth-child(2) {
			margin: 20rpx 0;
			font-size: 24rpx;
			display: flex;
			align-items: center;
			image {
				width: 40rpx;
				height: 40rpx;
				border-radius: 50%;
				margin-right: 10rpx;
			}
		}
		view:nth-child(3) {
			line-height: 34rpx;
			font-size: 22rpx;
		}
	}
	.list-share {
		width: 330rpx;
		height: 74rpx;
		border-radius: 37rpx;
		margin: 0 auto;
		background: rgba(0, 0, 0, 0.4);
		text-align: center;
		line-height: 74rpx;
		color: #fff;
		font-size: 28rpx;
		text {
			margin-right: 16rpx;
		}
	}

	.list-music {
		width: 100%;
		background: #fff;
		border-radius: 50rpx 50rpx 0 0;
		margin-top: 40rpx;
		overflow: hidden; //解决父容器margin传递问题
	}
	.list-music-head {
		height: 50rpx;
		margin: 30rpx 0 70rpx 46rpx;
		text:nth-child(1) {
			font-size: 40rpx;
			margin-right: 26rpx;
		}
		text:nth-child(2) {
			font-size: 30rpx;
		}
		text:nth-child(3) {
			font-size: 26rpx;
			color: #b2b2b2;
			margin-left: 10rpx;
		}
	}
	.list-music-item{
		display: flex;
		margin-bottom: 66rpx;
		align-items: center;
		.item-index {
			width: 104rpx;
			text-align: center;
			color: #c7c7c7;
		}
		.item-song {
			flex: 1;
			view:nth-child(1) {
				width: calc(100vw - 200rpx);
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				font-size: 28rpx;
				color: #000;
			} 
			view:nth-child(2) {
				width: calc(100vw - 200rpx);
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				font-size: 20rpx;
				color: #c7c7c7;
			} 
		}
		.item-icon {
			width: 80rpx;
			text-align: center;
			margin-right: 16rpx;
			text {
				font-size: 40rpx;
				color: #c7c7c7;
			}
		}
	}
</style>
