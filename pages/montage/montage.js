// pages/montage/montage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    /**
     * 1.已选了的图片的地址数组
     * 2.数组长度
     * 3.动态计算的scroll-view的高度
     * 4.动态计算rpx和px的商
     */
    imglists: [],
    imglistslen: 0,
    scrollHeight: 340,
    discussx: 0,

    /**
     * 记录数组里每一张图片的高度
     */
    imageheights: [],
    /**
     * 拖拽图片时需要用到的一些参数
     * 1.是否隐藏图片
     * 2.图片url
     * 3.当前选择的是哪一个图片的下标
     * 4.绝对定位的left值
     * 5.绝对定位的top值
     * 6.偏移量
     */
    touchimage: true,
    touchimageurl: '',
    currselimgidx: 0,
    currselimgleft: 100,
    currselimgtop: 100,
    offsety: 0
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
    let width = wx.getSystemInfoSync().screenWidth

    let height = wx.getSystemInfoSync().screenHeight
    let scrollHeight = height - 190

    let discussx = 750 / width

    this.setData({
      discussx: discussx,
      scrollHeight: scrollHeight
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  /**
   * 选择图片
   */
  chooseimg: function () {
    let that = this
    let selectarr = []
    wx.chooseImage({
      count: 9,
      success: function (res) {
        // return 0
        selectarr = res.tempFilePaths
        let imglists = that.data.imglists
        let imglistslen = that.data.imglistslen + selectarr.length
        let newlist = imglists.concat(selectarr)
        that.setData({
          imglistslen: imglistslen,
          imglists: newlist
        })
        that.readheight(selectarr)
      },
    })
  },
  /**
   * 记录每一张图片的高度，用于拖拽图片交换位置
   */
  readheight: function (arr) {
    let imgheightarr = this.data.imageheights
    let discus = this.data.discussx
    for (let i = 0; i < arr.length; i++) {
      wx.getImageInfo({
        src: arr[i],
        success: function (info) {
          let width = info.width
          let height = info.height
          let ry = Math.ceil((223 * height) / width)
          let py = ry / discus
          imgheightarr.push(py)
        }
      })
    }
    this.setData({
      imageheights: imgheightarr
    })

    return 0
  },

  /**
   * 向上排序
   */
  sortTop:function(e){
    let idx = e.currentTarget.dataset.idx
    let imglist = this.data.imglists
    let imglistslen = this.data.imglistslen
    let arr = this.data.imageheights

    // 上面已无图片可进行交换排序
    if(idx == 0){
     return 0
    }

    // 被选中的img及其高度
    let selectedImg = imglist[idx]
    let selectedHei = arr[idx]

    // 上一张的图片及其高度
    let preImg = imglist[idx - 1]
    let preHei = arr[idx - 1]

    // 交换操作
    imglist[idx] = preImg
    arr[idx] = preHei
    imglist[idx - 1] = selectedImg
    arr[idx - 1] = selectedHei

    this.setData({
      imglists: imglist,
      imageheights:arr
    })

  },

  /**
   * 向下排序
   */
  sortBottom:function(e){
    let idx = e.currentTarget.dataset.idx
    let imglist = this.data.imglists
    let imglistslen = this.data.imglistslen
    let arr = this.data.imageheights

    // 下面已无图片进行交换排序
    if (idx == (imglist.length - 1)) {
      return 0
    }

    // 被选中的img及其高度
    let selectedImg = imglist[idx]
    let selectedHei = arr[idx]

    // 上一张的图片及其高度
    let preImg = imglist[idx + 1]
    let preHei = arr[idx + 1]

    // 交换操作
    imglist[idx] = preImg
    arr[idx] = preHei
    imglist[idx + 1] = selectedImg
    arr[idx + 1] = selectedHei

    this.setData({
      imglists: imglist,
      imageheights: arr
    })
  },
  /**
   * 删除选中的图片
   */
  deleteimg: function (e) {
    let idx = e.currentTarget.dataset.idx
    let imglist = this.data.imglists
    let imglistslen = this.data.imglistslen

    let arr = this.data.imageheights
    let that = this

    wx.showModal({
      title: '请确认操作',
      content: '是否删除选中的第' + (idx - 0 + 1) + '张图片',
      success:res=>{
        if(res.confirm){
          /**
     * 注：这里返回的是被删除的那个选项，所以此处获取那个被删除的图片并无意义
     */
          imglist.splice(idx, 1)
          /**
           * 删除对应的图片的高度
           */
          arr.splice(idx, 1)
          let newlen = imglistslen - 1
          that.setData({
            imglists: imglist,
            imglistslen: newlen,
            imageheights: arr
          })
        }else{ // 点了取消之后，直接退出当前操作
          return 0;
        }
      }
    })
  },

  /**
   * 预览图片
   */
  preimg: function (e) {
    let imglist = this.data.imglists
    let idx = (e.currentTarget.dataset.idx)
    let currentimg = imglist[idx]
    wx.previewImage({
      urls: imglist,
      current: currentimg
    })
  },

  // 清空图片
  clearimg: function () {
    this.setData({
      imglists: [],
      imglistslen: 0,
      imageheights: []
    })
  },

  /**
   * 跳转图片拼接界面
   */
  createlogpic: function () {
    let imglist = this.data.imglists

    if(imglist.length == 0){
      wx.showModal({
        title: '请选择图片',
        content: '当前未选择图片，无法生成拼接图片。',
        showCancel:false
      })
      return 0
    }


    wx.setStorageSync('imglist', imglist)

    wx.navigateTo({
      url: '/pages/compose/compose?cptype=1',
    })

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