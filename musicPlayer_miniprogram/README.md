#Day01_20200724
  ##项目名称：音乐播放器小程序_仿
  ##项目灵感：腾讯学堂视频_'从0到1实现音乐播放器小程序'
  ##项目记录：
    静态结构解析
      index：
        导航栏 navigationBar
        标签页标题 tabbar
        滑动内容 swiper (info play list)
        底部播放器 view
      info：
        整体滑动布局 (Scroll-view)
          Swiper:Content-info-slide
          View:Content-info-protal
          View:Content-info-list
      play:
        view:Content-play-info
        view:Content-play-cover
        view:Content-play-progress
      list:
        view:mlist-item

#Day02_20200725
  ##静态页面搭建
    01 include 可以将目标文件除了 <template/> <wxs/> 外的整个代码引入，相当于是拷贝到 include 位置
     -- 可以用来拆分代码
    02 事件对象：当组件触发事件时，逻辑层绑定该事件的处理函数会收到一个事件对象
        target	        Object	  触发事件的组件的一些属性值集合	
        currentTarget	  Object	  当前组件的一些属性值集合

#Day03_20200726
  ##云开发学习
    01 注册
      云开发控制台开通就行
    02 初始化云环境(app.js)
      wx.cloud.init({
        env: '环境ID'
      })
    03 初始化云数据库(index.js)
      const db = wx.cloud.database()
    04 初始化云函数
      项目配置："cloudfunctionRoot": "./cloud"
      上传并部署
      **为什么使用云函数获取数据库的数据？
        为了突破20条的限制，并且不受数据表的权限控制