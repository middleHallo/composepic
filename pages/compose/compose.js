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
    cptype: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let cptype = options.cptype
    this.setData({
      cptype: cptype
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 获取图片信息
    let imglist = wx.getStorageSync('imglist')
    this.setData({
      imglist: imglist
    })

    wx.showLoading({
      title: '加载中...',
    })
    this.initinfo()

  },

  // 初始化相关配置信息
  initinfo: function () {
    let screenheight = wx.getSystemInfoSync().screenHeight
    let scrollHeight = screenheight - 170
    let imglist = this.data.imglist
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
          // 计算总的高度
          maxheight += res.height
        }
      })
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

  this.centercomposepic()

  },
  // 左对齐、居中对齐、右对齐拼接，根据传进来的cptype来判别
  centercomposepic: function () {
    let that = this
    let imglist = this.data.imglist
    let widths = this.data.imgwidths
    let heights = this.data.imgheights

    let cptype = this.data.cptype

    let maxwidth = this.data.maxwidth
    let maxheight = this.data.maxheight
    //创建绘图上下文
    let context = wx.createCanvasContext('share', this)
    let dy = 0
    for (let i = 0; i < imglist.length; i++) {
      let sourcestr = imglist[i]

      console.log(sourcestr)
      let dx = 0
      if (cptype == 0) { // 左对齐拼接图片
        dx = 0
      } else if (cptype == 1) {  // 居中对齐拼接图片
        dx = Math.ceil((maxwidth - widths[i]) / 2.0)
      } else {  // 右对齐拼接图片
        dx = maxwidth - widths[i]
      }
      // let dWidth = widths[i]
      // let dHeight = heights[i]
      // context.drawImage(sourcestr,dx,dy,dWidth,dHeight)
      context.drawImage(sourcestr, dx, dy)
      dy += heights[i]
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

          console.log(res)
          if (!res.tempFilePath) {
            wx.showModal({
              title: '提示',
              content: '图片绘制中，请稍后重试',
              showCancel: false
            })
          }
          wx.hideLoading()
          that.setData({
            url: res.tempFilePath,
            canvasHidden: true,
            resultHidden: false
          })

        },
        fail: function () {
          console.log(222)
        }
      })
    });
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
          content: '快点去发朋友圈试试吧！',
          showCancel: false
        })
      },
      fail: function (err) {
        console.log(err)
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