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

  /**
   * ltimg:长按图片
   */
  ltimg: function (e) {

    let idx = e.currentTarget.dataset.idx
    let imgurl = this.data.imglists[idx]

    let touch = e.touches[0]

    let imgwidth = 0
    let imgheight = 0

    wx.getImageInfo({
      src: imgurl,
      success: function (info) {
        imgwidth = info.width
        imgheight = info.height
      }
    })

    let discussx = this.data.discussx
    /**
     * offsety偏小
     */
    let offsety = Math.floor(((223 * imgheight) / imgwidth) / 2.0)
    let currselimgleft = touch.clientX * discussx - 112
    let currselimgtop = touch.clientY * discussx - offsety - 80
    this.setData({
      touchimageurl: imgurl,
      touchimage: false,
      currselimgidx: idx,
      currselimgleft: currselimgleft,
      currselimgtop: currselimgtop,
      offsety: offsety
    })
  },

  /**
   * tmimg：移动图片
   */
  tmimg: function (e) {

    let touch = e.touches[0]
    let offsety = this.data.offsety
    let discussx = this.data.discussx
    let clientY = touch.clientY
    /**
     * 减掉部分偏差
     */
    let realoffsety = 0
    if (clientY > offsety) {
      realoffsety = clientY - offsety
    }
    /**
     * 让图片居中于触摸点
     */
    let currselimgleft = touch.clientX * discussx - 112
    let currselimgtop = touch.clientY * discussx - offsety - 80 - realoffsety
    this.setData({
      currselimgleft: currselimgleft,
      currselimgtop: currselimgtop
    })
  },
  /**
   * teimg：触摸结束
   * 交换位置
   */
  teimg: function (e) {

    // 记录点击的图片在数组中的下标
    let idx = e.currentTarget.dataset.idx
    let images = this.data.imglists
    // 获取图片高度数组
    let imgarr = this.data.imageheights

    // 计算共有几行图片
    let rows = Math.ceil(imgarr.length / 3.0)

    // 存储每行图片高度最大的那个值
    let rowHeights = []

    // 最后一行的图片数
    let lastrownum = imgarr.length % 3


    // 遍历图片高度，记录每行图片高度最大的那个值
    for (let i = 0; i < rows; i++) {
      // 当前行所有图片的高度最大值
      let maxheight = 0
      // 最后一行
      if (i == rows - 1) {
        if (lastrownum == 0) {
          lastrownum = 3
        }
        for (let k = 0; k < lastrownum; k++) {

          let idx = i * 3 + k
          let currentimageh = imgarr[idx]
          if (maxheight < currentimageh) {
            maxheight = currentimageh
          }
        }
      } else {
        // 非最后一行
        for (let j = 0; j < 3; j++) {
          let currentimageh = imgarr[i * 3 + j]
          if (maxheight < currentimageh) {
            maxheight = currentimageh
          }
        }
      }
      rowHeights.push(maxheight)
    }

    // 获取触摸点的坐标值
    let touchpoint = e.changedTouches[0]

    let touchy = touchpoint.clientY - 40
    let touchx = touchpoint.clientX

    let discus = this.data.discussx

    // 计算所有行加起来的高度
    let allmaxheight = 0
    for (let h = 0; h < rowHeights.length; h++) {
      allmaxheight += rowHeights[h]
    }

    // 计算拖拽图片到第几行
    let selectedrow = 0
    let allmaxheight2 = 0
    for (let p = 0; p < rowHeights.length; p++) {
      allmaxheight2 += rowHeights[p]
      if (touchy < allmaxheight2) {

        selectedrow = p
        break
      }
    }
    // 如果触摸点大于所有行的高度加起来，则将当前拖拽的图片放到数组最后
    if (touchy > allmaxheight) {

      let currentimgurl = images[idx]
      images.splice(idx, 1)
      images.push(currentimgurl)
      this.setData({
        imglists: images
      })
    } else { // 否则，则进行计算图片拖到哪张图片中

      let selectedcol = 0
      let touchrpx = touchx * discus
      let allrpx = 0
      for (let c = 0; c < 3; c++) {
        // touchx
        allrpx = (c + 1) * 223 + 20
        if (touchrpx < allrpx) {
          selectedcol = c
          break
        }
      }

      // 判断该位置是否有图片，有则交换，无则将图片拖到最后
      if (images.length > (selectedrow * 3 + selectedcol)) {

        let bechangeimg = images[selectedrow * 3 + selectedcol]
        images[selectedrow * 3 + selectedcol] = images[idx]
        images[idx] = bechangeimg

        this.setData({
          imglists: images
        })

      } else {

      }
    }

    this.setData({
      touchimage: true
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