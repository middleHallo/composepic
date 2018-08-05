// pages/compose/compose.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imglist: [],
    imgwidths: [],
    imgheights: [],
    canvasHidden: true,
    resultHidden: true,
    canvasWidth: 0,
    canvasHeight: 0,
    scrollHeight: 0,
    url: '',
    maxwidth: 0,
    maxheight: 0,
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
    this.initinfo()
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  // 初始化相关配置信息
  initinfo: function () {
    wx.showLoading({
      title: '加载中...',
    })

    let imglist = wx.getStorageSync('imglist')
    this.setData({
      imglist: imglist
    })

    let screenheight = wx.getSystemInfoSync().screenHeight
    let scrollHeight = screenheight - 170

    let imgwidths = []
    let imgheights = []
    let maxwidth = 0
    let maxheight = 0

    for (let i = 0; i < imglist.length; i++) {
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

    // 计算最大高度
    for (let j = 0; j < imglist.length;j++){
      let dwith = imgwidths[j]
      if (dwith < maxwidth){
        let dis = maxwidth / dwith
        let dheight = imgheights[j] * dis

        imgheights[j] = dheight
        maxheight += dheight 
      }else{
        maxheight += imgheights[j]
      }
    }

    this.setData({
      imgwidths: imgwidths,
      imgheights: imgheights,
      scrollHeight: scrollHeight,
      // 画布要显示出来才能进行画图和拼接相关操作
      canvasHidden: false,
      maxwidth: maxwidth,
      maxheight: maxheight
    })

    // 调用拼接图片的接口
    this.composepic()
  },

  composepic: function () {
    
    let that = this
    let imglist = this.data.imglist
    let heights = this.data.imgheights

    let maxwidth = this.data.maxwidth
    let maxheight = this.data.maxheight
    //创建绘图上下文
    let context = wx.createCanvasContext('share', this)
    let dy = 0
    for (let i = 0; i < imglist.length; i++) {
      let sourcestr = imglist[i]
      let dheight = heights[i]
      context.drawImage(sourcestr, 0, dy, maxwidth,dheight)
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
        success: function (res) {

          if (!res.tempFilePath) {
            wx.showModal({
              title: '提示',
              content: '图片绘制中，请稍后重试',
              showCancel: false
            })
          }
          that.setData({
            url: res.tempFilePath,
            canvasHidden: true
          })
         
        },
        fail: function () {
          wx.hideLoading()
          wx.showModal({
            title: '出错了',
            content: '请重新尝试！',
            showCancel:false
          })
        }
      })
    });
  },

  // 监听图片加载完成
  imageLoad:function(){
    wx.hideLoading()
  },

  // 预览图片
  preview: function () {

    console.log('preimg')
    let urls = []
    let url = this.data.url
    urls.push(url)
    wx.previewImage({
      urls: urls,
    })
  },

  // 返回首页
  back: function () {
    wx.navigateBack({})
  },

  // 保存图片
  saveimg: function () {

    let url = this.data.url
    wx.saveImageToPhotosAlbum({
      filePath: url,
      success: function (suc) {
        wx.showModal({
          title: '保存成功！',
          content: '喵喵喵~~',
          showCancel: false
        })
      },
      fail: function (err) {
        
      }
    })
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