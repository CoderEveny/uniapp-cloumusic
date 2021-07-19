<template>
	<view class="nav-head-container">
		<view class="nav-head-icon" v-if="iconShow" :class="{black: iconColor}">
			<text class="cloud cloud-left" @tap="handleToBack"/> | 
			<text class="cloud cloud-shouye" @tap="handleToHome"/>
		</view>
		<view class="nav-head-title" :class="{white: color}">{{ title }}</view>
	</view>
</template>

<script>
	export default {
		name: 'musichead',
		props: {
			title: String,
			iconShow: Boolean,
			color: Boolean,
			iconColor: Boolean
		},
		data() {
			return {
				navHeight: '', //整体顶部导航栏的高度
				statusBarHeight:'' //状态栏高度
			}
		},
		methods: {
			handleToBack() {
				uni.navigateBack()  //返回到上一个页面
			},
			handleToHome() {
				uni.navigateTo({
					url: '/pages/index/index'
				})
			}
		}
	}
	
</script>

<style lang="less">
	.nav-head-container {
		width: 100%;
		height: 75px;
		line-height: 75px;
		font-size: 16px;
		text-align: center;
		color: #000;
		position: relative;
	}
	.nav-head-icon {
		position: absolute;
		left: 8px;
		top: 26px;
		width: 90px;
		height: 30px;
		line-height: 30px;
		background: rgba(0,0,0,0.4);
		color: #fff;
		border-radius: 15px;
		display: flex;
		justify-content: space-around;
		&.black {
			background: rgba(255,255,255,0.8);
			border: 1px solid #ccc;
			color: #000;
		}
	}
	.nav-head-title {
		color: #000;
		&.white {
			color: #fff;
		}
	}
</style>
