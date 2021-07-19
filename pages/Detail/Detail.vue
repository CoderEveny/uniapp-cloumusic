<template>
	<view class="detail">
		<view class="fixbg" v-if="songDetail.picUrl" :style="{background: 'url(' + songDetail.picUrl + ')'}"></view>
		<musichead :title="songDetail.name" :iconShow="true" :color="true" />
		<view class="container" v-show="!isLoading">
			<scroll-view scroll-y="true">
				<!-- 唱片部分 -->
				<view class="detail-play" @tap="isPlaying">
					<image :src="songDetail.picUrl" mode="" :class="{'run': isRotate}"></image>
					<text class="cloud" :class="{'cloud-bofang': !playing, 'cloud-zanting': playing}"></text>
					<view></view>
				</view>
				<!-- 歌词部分 -->
				<view class="detail-lyric">
					<view class="detail-lyric-wrap" :style="{transform: 'translateY('+ (-(lyricIndex - 1) *82) +'rpx)'}">
						<view class="detail-lyric-item" 
						v-for="(item,index) in lyric" 
						:key="index"
						:class="{active: lyricIndex === index}">
							{{item.lyric}}
						</view>
					</view>
				</view>
				<!-- 推荐喜欢 -->
				<view class="detail-like">
					<view class="detail-like-head">喜欢这首歌的人也听</view>
					<view class="detail-like-item" 
					v-for="(item,index) in simiSong" :key="index"
					@tap="handleToSimi(item.id)">
						<view class="detail-like-img">
							<image :src="item.picUrl" mode=""></image>
						</view>
						<view class="detail-like-song">
							<view>{{item.name}}</view>
							<view>{{item.ar}}</view>
						</view>
						<view class="detail-like-icon">
							<text class="cloud cloud-bofang"></text>
						</view>
					</view>
				</view>
				<!-- 评论 -->
				<view class="detail-comment">
					<!-- 评论头 -->
					<view class="detail-comment-head">精彩评论</view>
					<!-- 评论部分 -->
					<view class="detail-comment-item" v-for="(item,index) in comments" :key="index">
						<view class="detail-comment-img">
							<image :src="item.picUrl" mode=""></image>
						</view>
						<view class="detail-comment-content">
							<view class="detail-comment-title">
								<view class="detail-comment-name">
									<view>{{ item.nickName}}</view>
									<view>{{ item.time | dateFilter }}</view>
								</view>
								<view class="detail-comment-good">
									{{item.likeCount | formatCount}} <text class="cloud cloud-dianzan"></text>
								</view>
							</view>
							<view class="detail-comment-text">{{item.content}}</view>
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
	// 数据过滤
	import { SongDetailFilter } from 'utils/dataFilter.js'
	import { fmtDate } from 'utils/date.js'
	// 网络请求相关
	import { getSongDetail, getSimiSongs, getComments, getLyric} from 'utils/api.js'
	
	export default {
		name: 'Deatil',
		components: {
			musichead
		},
		data() {
			return {
				songDetail: [],
				lyric: [],
				simiSong: [],
				comments: [],
				lyricIndex: 0,
				playing: true,
				isRotate: true,
				isLoading: true
			}
		},
		onLoad(options) {
			uni.showLoading({
				title: '加载中...'
			});
			this.playMusic(options.id)
		},
		onUnload() {
			this.cancleLyricIndex();
			// #ifdef H5
			this.bgAudioManager.destroy()
			// #endif
		},
		onHide() {
			this.cancleLyricIndex()
		},
		filters: {
			dateFilter: function(date) {
				let temp = new Date(date);
				return fmtDate(temp, 'yyyy-MM-dd')
			}
		},
		methods: {
			playMusic(id) {
				this.isLoading = true;
				Promise.all([getSongDetail(id),getLyric(id),getSimiSongs(id),getComments(id)]).then(res => {
					// 获取歌曲详情
					if(res[0][1].data.code === 200) {
						this.songDetail = new SongDetailFilter(res[0][1].data.songs[0])
						this.handlePlay(id)
					}
					// 获取歌词
					if(res[1][1].data.code === 200) {
						const temp = res[1][1].data.lrc.lyric;
						let result = [];
						let re = /\[([^\]]+)\]([^[]+)/g;
						temp.replace(re,($0,$1,$2) => {
							result.push({ time: this.formatTimeToSec($1) , lyric: $2 });
						});
						this.lyric = result
					}
					// 获取相似歌曲
					if(res[2][1].data.code === 200) {
						this.simiSong = res[2][1].data.songs.map(item => ({
							id: item.id,
							name: item.album.name,
							picUrl: item.album.blurPicUrl,
							ar: item.artists.map(item => item.name).join('/')
						}))
					}
					// 获取评论
					if(res[3][1].data.code === 200) {
						this.comments = res[3][1].data.hotComments.map(item => ({
							nickName: item.user.nickname,
							picUrl: item.user.avatarUrl,
							content: item.content,
							time: item.time,
							likeCount: item.likedCount
						}))	
					}
					this.isLoading = false;
					uni.hideLoading()
				})
			},
			handleToSimi(id) {
				this.playMusic(id)
			},
			// 格式化歌词的时间
			formatTimeToSec(time) {
				let arr = time.split(':');
				return (parseFloat(arr[0]) * 60 + parseFloat(arr[1])).toFixed(2);
			},
			// 处理播放事件
			handlePlay(id) {
				if(this.songDetail !== null && this.lyric !== null) {
					// #ifdef MP-WEIXIN
					this.bgAudioManager = uni.getBackgroundAudioManager();
					this.bgAudioManager.title = this.songDetail.name;
					// #endif
				
					// #ifdef H5
					if(!this.bgAudioManager) {
						this.bgAudioManager = uni.createInnerAudioContext();
					}
					this.playing = false;
					this.isRotate = false;
					// #endif
					this.bgAudioManager.src =`https://music.163.com/song/media/outer/url?id=${id}.mp3`;
					this.listenLyricIndex();
					this.bgAudioManager.onPlay(() => {
						this.playing = true;
						this.isRotate = true
						this.listenLyricIndex();
					});
					this.bgAudioManager.onPause(() => {
						this.playing = false;
						this.isRotate = false
						this.cancleLyricIndex()
					});
					this.bgAudioManager.onEnded(() => {
						if(this.$store.getters.nextId !== null) {
							this.playMusic(this.$store.getters.nextId)
						} else {
							this.playMusic(id)
						}
					})
				}
			},
			isPlaying() {
				if(this.bgAudioManager.paused) {
					this.bgAudioManager.play();
					// 这个方法可以跟onplay联动，下面也是
				} else {
					this.bgAudioManager.pause();
				}	
			},
			// 监听歌词滚动
			listenLyricIndex() {
				clearInterval(this.timer);
				this.timers = setInterval(() => {
					for(let i = 0;i < this.lyric.length; i++) {
						if (this.bgAudioManager.currentTime > this.lyric[this.lyric.length - 1].time ) {
							this.lyricIndex = this.lyric.length - 1;
							break;
						}
						if(this.bgAudioManager.currentTime > this.lyric[i].time && this.bgAudioManager.currentTime < this.lyric[i+1].time) {
							this.lyricIndex = i;
						}
					}
				},500)
			},
			// 清除定时器
			cancleLyricIndex() {
				clearInterval(this.timer)
			}
		}
	}
</script>

<style lang="less" scoped>
	@keyframes rotate{
		from{
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
	.detail-play {
		width: 580rpx;
		height: 580rpx;
		background: url(/static/image/disc.png);
		background-size: cover;
		margin: 214rpx auto 0 auto;
		position: relative;
		image {
			width: 370rpx;
			height: 370rpx;
			border-radius: 50%;
			position: absolute;
			left: 0;
			top: 0;
			right: 0;
			bottom: 0;
			margin: auto;
			animation: 10s rotate linear infinite;
			animation-play-state: paused;
			&.run {
				animation-play-state: running;
			}
		}
		text {
			width: 100rpx;
			height: 100rpx;
			font-size: 80rpx;
			color: #fff;
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-30%,-40%);
		}
		view {
			width: 230rpx;
			height: 360rpx;
			background: url(/static/image/needle.png);
			background-size: cover;
			position: absolute;
			left: 100rpx;
			right: 0;
			top: -200rpx;
			margin: auto;
		}
	}
	
	.detail-lyric {
		font-size: 32rpx;
		line-height: 82rpx;
		height: 246rpx;
		text-align: center;
		overflow: hidden;
		color: #6f6e73;
	}
	.detail-lyric-wrap {
		transition: 0.5s;
	}
	.detail-lyric-item {
		height: 82rpx;
		&.active {
			color: #fff;
		}
	}
	
	.detail-like {
		margin: 0 30rpx;
	}
	.detail-like-head {
		font-size: 32rpx;
		color: #fff;
		margin: 50rpx 0;
	}
	.detail-like-item {
		display: flex;
		align-items: center;
		margin-bottom: 28rpx;
		.detail-like-img {
			width: 82rpx;
			height: 82rpx;
			border-radius: 20rpx;
			overflow: hidden;
			margin-right: 20rpx;
			image {
				width: 100%;
				height: 100%;
			}
		}
		.detail-like-song {
			flex: 1;
			view:nth-child(1) {
				font-size: 28rpx;
				color: #fff;
				margin-bottom: 12rpx;
			}
			view:nth-child(2) {
				font-size: 22rpx;
				color: #c6c2bf;
			}
		}
		.detail-like-icon {
			text {
				font-size: 30rpx;
				color: #c6c2bf;
			}
		}
	}

	.detail-comment {
		margin: 0 30rpx;
	}
	.detail-comment-head {
		font-size: 32rpx;
		color: #fff;
		margin: 50rpx 0;
	}
	.detail-comment-item {
		margin-bottom: 28rpx;
		display: flex;
	}
	.detail-comment-img {
		width: 64rpx;
		height: 64rpx;
		border-radius: 50%;
		margin-right: 18rpx;
		overflow: hidden;
		image {
			width: 100%;
			height: 100%;
		}
	}
	.detail-comment-content {
		flex: 1;
		
	}
	.detail-comment-title {
		display: flex;
		justify-content: space-between;
		color: #ccc;
		.detail-comment-name {
			view:nth-child(1) {
				font-size: 26rpx;
				color: #cbcacf;
			}
			view:nth-child(2) {
				font-size: 20rpx;
			}
		}
		.detail-comment-good {
			font-size: 26rpx;
		}
	}
	.detail-comment-text {
		font-size: 28rpx;
		line-height: 40rpx;
		color: #fff;
		margin-top: 22rpx;
		border-bottom: 1px solid #e0e0e0;
		padding-bottom: 40rpx;
	}
</style>
