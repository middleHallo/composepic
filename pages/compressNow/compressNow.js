// pages/compressNow/compressNow.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    oldurl:'',
    value:80,
    oldsize:0,
    newsize:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * changeSlider
   */
  changeSlider:function(e){
    let value = e.detail.value
  },

  /**
   * 选择图片
   */
  chooseImage:function(){
    let that = this
    wx.chooseImage({
      count:1,
      success: function(res) {
        let oldurl = res.tempFilePaths[0]
        wx.getFileInfo({
          filePath: oldurl,
          success:function(info){
            let size = info.size
            that.setData({
              oldurl: oldurl,
              oldsize:size
            })
          }
        })
      },
    })
  },

  /**
   * 压缩图片
   */
  startcompress:function(){
    let oldurl = this.data.oldurl
    let quality = this.data.value
    let oldsize = this.data.oldsize
    let that = this
    wx.showLoading({
      title: '压缩中...',
    })
    wx.compressImage({
      src:oldurl,
      quality: quality,
      success:function(res){
        let newurl =  res.tempFilePath
        wx.getFileInfo({
          filePath: newurl,
          success:function(info){
            let newsize = info.size
            that.compare(oldsize, newsize, newurl)
          }
        })
      },
      fail:function(){
        wx.showToast({
          title: '出错啦，请稍候再试',
          icon:'none',
          duration:2500
        })
      },
      complete:function(){
        wx.hideLoading()
      }
    })
  },

  /**
   * compare
   */
  compare: function (oldsize, newsize,newurl){
    let that = this
      let modalContent = '压缩前图片为：' + Math.ceil(oldsize / 1024) + 'Kb;压缩后图片为：' + Math.ceil(newsize/1024) + 'Kb';
      wx.showModal({
        title: '是否保存',
        content: modalContent,
        success:function(res){
          if(res.confirm){
            wx.saveImageToPhotosAlbum({
              filePath: newurl,
              success:function(){
                that.showTips()
              }
            })
          }
        }
      })
  },

  /**
   * showTips
   */
  showTips:function(){
    wx.showToast({
      title: '保存成功',
      icon:'success',
      duration:2000
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