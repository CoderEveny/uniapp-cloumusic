// 过滤歌单列表
export class PlayListFilter {
	constructor(data) {
	  this.name = data.name === null ? '' : data.name,
		this.coverImgUrl = data.coverImgUrl,
		this.playCount = data.playCount,
		this.description = data.description,
		this.nickName = data.creator.nickname,
		this.avatarUrl = data.creator.avatarUrl === null ? '' : data.creator.avatarUrl,
		this.tracks = data.tracks.map(item => ({
			al: {
				id: item.id,
				name: item.al.name,
			},
			ar: item.ar.map(arItem => arItem.name).join('-')
		}))
		this.trackIds = data.trackIds.map(item => item.id)
	}
}

export class SongDetailFilter {
	constructor(data) {
	  this.name = data.name,
		this.picUrl = data.al.picUrl === null ? '' : data.al.picUrl
	}
}
