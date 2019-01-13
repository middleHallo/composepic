// pages/compress/compress.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedWidth:0,
    selectedHeight:0,
    selected:'',
    compressurl:'',
    chooseSuc:false,
    compressSuc:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  /**
   * goNow 立即体验
   */
  goNow:function(){
    wx.cloud.init()

    wx.showLoading({
      title: '加载中...',
    })
    wx.cloud.callFunction({
      name:'index',
      success:function(res){
        if(res.result == 0){
          wx.showModal({
            title: '提示',
            content: '目前此功能不稳定，请择需使用',
            showCancel:false,
            success:function(e){
              if(e.confirm){
                wx.navigateTo({
                  url: '/pages/compressNow/compressNow',
                })
              }
            }
          })
        }
      },
      fail:function(){
        setTimeout(function(){
          wx.showModal({
            title:'提示',
            content:'出错了，是否继续？',
            success:function(e){
              if(e.confirm){
                wx.navigateTo({
                  url: '/pages/compressNow/compressNow',
                })
              }
            }
          })
        },500)
      },
      complete:function(){
        wx.hideLoading()
      }
    })
    // wx.navigateTo({
    //   url: '',
    // })
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