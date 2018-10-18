// pages/compose/compose.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canvasHidden: true,
    resultHidden: true,
    canvasWidth: 0,
    canvasHeight: 0,
    scrollHeight: 0,
    url: '',
    maxwidth: 0,
    maxheight: 0,
    isdone:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    /**
     * 这部分代码放到onshow中，每次点预览图片回来都会调用重新渲染页面
     * 会造成很大的性能问题，有可能会触发闪退。
     * 放到onready中只会执行一次
     */
    let imglist = wx.getStorageSync('imglist')
    let screenheight = wx.getSystemInfoSync().screenHeight
    let scrollHeight = screenheight - 170
    this.setData({
      imglist: imglist,
      scrollHeight: scrollHeight
    })
    this.initinfo(imglist)
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // console.log(this.data.)
  },

  // 初始化相关配置信息
  initinfo: function (imglist2) {
  
    let that = this
    var promist = new Promise(function (resolve, reject){
    let imglist = imglist2
    let imgwidths = []
    let imgheights = []
    let maxwidth = 0
    let maxheight = 0

    let len = imglist.length
    for (let i = 0; i < len; i++) {
      
      wx.getImageInfo({
        src: imglist[i],
        success: function (res) {
          
          imgwidths.push(res.width)
          imgheights.push(res.height)
          //计算最大的宽度
          if (maxwidth < res.width) {
            maxwidth = res.width
          }
        }
      })
    }

    // 计算总高度
    for (let j = 0; j < len; j++) {
      
      let dwith = imgwidths[j]
      if (dwith < maxwidth) {
        let dis = maxwidth / dwith
        let dheight = imgheights[j] * dis

        imgheights[j] = dheight
        maxheight += dheight
      } else {
        maxheight += imgheights[j]
      }
    }

    that.setData({
      
      // 画布要显示出来才能进行画图和拼接相关操作
      canvasHidden: false,
      maxwidth: maxwidth,
      maxheight: maxheight
    })
    //创建绘图上下文
    let context = wx.createCanvasContext('share', this)
    let dy = 0
    for (let i = 0; i < len; i++) {
      
      let sourcestr = imglist[i]
      let dheight = imgheights[i]
      context.drawImage(sourcestr, 0, dy, maxwidth, dheight)
      dy += dheight
    }
    context.save()

    //把画板内容绘制成图片，并回调 画板图片路径
    context.draw(false, function () {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: maxwidth,
        height: maxheight,
        destWidth: maxwidth,
        destHeight: maxheight,
        canvasId: 'share',
        fileType:'jpg',
        success: function (res) {
          resolve(res.tempFilePath)
        },
        fail: function () {

          reject('出错了...')
        }
      })
    });
  });

    promist.then(function(url){
      that.setData({
        url: url,
        canvasHidden: true,
        isdone:1
      })
      wx.showToast({
        title: '拼接成功',
        icon:'success',
        duration:1100
      })

    }).catch(function(error){
      that.setData({
        isdone: 3,
        canvasHidden: true
      })
      wx.showToast({
        title: '拼接失败',
        icon: 'error',
        duration: 1100
      })
    });

  },


  // 返回首页
  back: function () {
    wx.navigateBack({})
  },

  // 保存图片
  saveimg: function () {

    let url = this.data.url
    let isdone = this.data.isdone

    // 先判断isdone==1，如果成功就不必判断后面的程序
    if(isdone == 1){
      
      wx.saveImageToPhotosAlbum({
        filePath: url,
        success: function (suc) {
          wx.showToast({
            title: '保存成功!',
            icon:'success',
            duration:1200
          })
        },
        fail: function (err) {
          wx.showModal({
            title: '保存失败！',
            content: '请稍后重试！~~',
            showCancel: false
          })
        }
      })

    }else if(isdone == 3){
      wx.showToast({
        title: '图片拼接出错，请重试...',
        icon: 'none',
        duration: 1500
      })
      return 0
    }else{
      wx.showToast({
        title: '图片拼接中，请稍后再保存！',
        icon: 'none',
        duration: 1500
      })
      return 0
    }
    
  },

  // 跳转关于我们
  aboutus:function(){

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // 清除相关缓存
    wx.clearStorageSync('imglist')

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})