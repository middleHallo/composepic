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
   * 选择图片
   */
  choseImg:function(){
    let __this = this
    wx.chooseImage({
      success: function(res) {
        __this.setData({
          selected : res.tempFilePaths[0]
        })
       
      },
    })
  },

  /**
   * 点击压缩
   */
  compressImg:function(){
    let url = this.data.selected
    let __this = this
    if(url == ''){
      wx.showToast({
        title: '请选择图片！',
        icon:'none',
        duration:2000
      })
      return 0
    }

    wx.getImageInfo({
      src: url,
      success:res=>{
        let width = res.width
        let height = res.height
        __this.setData({
          selectedWidth:width,
          selectedHeight:height
        })
        setTimeout(function(){
          __this.compress(url,width,height)
        },400)
      }
    })

  },

  /**
   * 压缩图片js
   */
  compress:function(url,width,height){
    let __this = this
    let ctx = wx.createCanvasContext('compress', this)
    // let url = __this.data.
    ctx.drawImage(url,0,0,width,height)

    ctx.draw(false,function(res){

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