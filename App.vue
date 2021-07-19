<script>
	export default {
		onLaunch: function() {
			
		},
		onShow: function() {
			
		},
		onHide: function() {
			
		}
	}
</script>

<style lang="less">
	@import 'static/style/index.css';
	.container {
		width: 100%;
		height: calc(100vh - 75px);
		overflow: hidden;
		scroll-view {
			height: 100%;
		}
	}
	.fixbg {
		width: 100%;
		height: 100%;
		position: fixed;
		left: 0;
		top: 0;
		background-size: cover;
		background-position: center 0;
		filter: blur(20px); //模糊背景
		transform: scale(1.2); //缩放
	}	
</style>
