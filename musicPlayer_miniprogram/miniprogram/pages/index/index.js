//初始化云数据库
// const musicList = wx.cloud.database().collection('musicList')

Page({
  //基础数据
  data: {
    item:0,
    tab:0,
    //播放列表
    playlist:[{
      _id: "",
      cover:'',
      title:'',
      singer:'',
      src:''
    }],
    //播放状态
    state:'paused',
    //当前播放标识
    playIndex:0,
    //当前播放属性
    play:{
      currentTime:'00:00',
      duration:'00:00',
      percent:0,
      title:'',
      singer:'',
      cover:'',
      MV:''
    }
  },

  //页面切换
  changeItem:function(e){ //切换导航条
    // console.log(e);
    this.setData({
      item:e.target.dataset.item
    })
  },
  changeTab:function(e){ //切换滑动
    // console.log(e);
    this.setData({
      tab:e.detail.current
    })
  },
  changePage:function(e){ //页面跳转
    // console.log(e);
    this.setData({
      item:e.currentTarget.dataset.page,
      tab:e.currentTarget.dataset.page
    })
  },
  toMV:function(){ //路由跳转
    wx.navigateTo({
      url: "/pages/MV/MV",
    })
  },

  //监听页面显示--从云数据库获取列表
  onShow:function(){
    this.getList()
  },
  //云函数获取云数据库列表
  getList(){
    //保存this
    let that = this
    //使用云函数获取列表
    wx.cloud.callFunction({
      name:'getMusicList',
      success:res => {
        //停止刷新
        wx.stopPullDownRefresh()
        // console.log(res);
        if (res.result) {
          let playlist = res.result.data;
          // console.log(playlist);
          if (playlist === undefined || playlist.length == 0) {
            wx.showToast({
              title: '数据不存在',
            })
          } else {
            //更新数据
            that.setData({
              isShowArticle: true,
              playlist: playlist,
            },
            function(){
              //默认选择第一首
              this.setMusic(0)
            });
          }
        } else {
          wx.showToast({
            title: '没有数据',
          })
        }
      },
      fail:err => {
        //停止刷新
        wx.stopPullDownRefresh()
        wx.showToast({
          title: '数据不存在',
        })
      }
    })
  },

  //设置播放状态
  setMusic:function(index){
    let music = this.data.playlist[index]
    this.musicCtx.src = music.src
    this.setData({
      playIndex:index,
      'play.title':music.title,
      'play.singer':music.singer,
      'play.cover':music.cover,
      'play.currentTime':'00:00',
      'play.duration':'00:00',
      'play.percent':0,
      'play.MV':music.MV
    }
    // ,function(){
    //   console.log(this.data.play.MV.length,music)
    // }
    )
  },

  //监听页面初次渲染完成
  musicCtx:null,
  onReady:function(){
    //创建InnerAudioContext(音频播放)实例
    this.musicCtx = wx.createInnerAudioContext()
    let that = this
    //播放失败检测
    this.musicCtx.onError(function(){
      wx.showToast({
        title: that.musicCtx.src.title + '播放失败',
      })
    })
    //自动播放下一曲
    this.musicCtx.onEnded(function(){
      that.next()
    })
    //自动更新播放进度
    this.musicCtx.onTimeUpdate(function(){
      that.setData({
        'play.duration':formatTime(that.musicCtx.duration),
        'play.currentTime':formatTime(that.musicCtx.currentTime),
        'play.percent':that.musicCtx.currentTime / that.musicCtx.duration * 100
      })
    })
    //格式化时间
    function formatTime(time){
      var minute = Math.floor(time/60)%60;
      var second = Math.floor(time)%60
      return(minute < 10 ? + minute:minute) + ':' + (second < 10? '0'+second:second)
    }
  },

  //播放
  play: function () {
    this.musicCtx.play()
    this.setData({
      state: 'running'
    })
  },
  //暂停
  pause: function () {
    this.musicCtx.pause()
    this.setData({
      state: 'paused'
    })
  },
  //下一首
  next: function () {
    this.pause()
    let index = this.data.playIndex >= this.data.playlist.length - 1 ? 0 
    : this.data.playIndex + 1
    this.setMusic(index)
    this.play()
  },
  //换歌
  change:function(e){
    this.setMusic(e.currentTarget.dataset.index)
    this.play()
  },
  //滑动滚动条
  sliderChange:function(e){
    var second = e.detail.value * this.musicCtx.duration/100
    this.musicCtx.seek(second)
  },
})