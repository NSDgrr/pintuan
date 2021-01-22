var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:"",
    sog_id:"",
    radiocheck: "",
    textval:"",
    flieList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      id: options.id,
      sog_id: options.sog_id,
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
    // this.radiochangeTwo(2)
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

  },
  // radiochangeTwo: function (e) {
  //   console.log(e)
  //   this.setData({
  //     radiocheck:2
  //   })
  // },
  //选中
  radiochange:function(e){
    console.log(e)
      this.setData({
        radiocheck: e.detail.value
      })  
  },
  //原因
  textchange: function (e) {
    console.log(e)
    this.setData({
      textval: e.detail.value
    })
  },
  //上传
  flie_upload: function (e) {
    var that =this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // console.log(res);
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
        })
        var tempFilePaths = res.tempFilePaths[0];
        wx.uploadFile({
          url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Business/Pcapi/insertlogoapi',
          filePath: tempFilePaths,
          name: 'file',
          success: function (res) {
            wx.hideToast();
            var jsonStr = res.data.replace(/\ufeff/g, "");
            var datas = JSON.parse(jsonStr);
            var src = datas.replace(/^\"|\"$/g, "");
            that.data.flieList[e.currentTarget.dataset.index] = src;
            that.setData({
              flieList: that.data.flieList
            })
          },
          fail: function (res) {

          }
        })
      }
    })
  },
  //提交
  submit_btn:function(){
    var that = this;
    wx.request({
      url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Miniapp/Index/apply_service&mpid=' + app.data.mpid + "&token=" + wx.getStorageSync('unionId'),
      method: 'POST',
      data: {
        s_type: that.data.radiocheck,
        s_reason: that.data.textval,
        s_oid: that.data.id,
        s_img: that.data.flieList.join(),
        sog_id: that.data.sog_id?that.data.sog_id:"",
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res);
        if(res.data.code == 200){
          wx.showToast({
            title: '已提交售后',
            icon: 'none',
            duration: 2000,
            success: function () {
              wx.navigateBack({
                delta: 1, 
              })
            }
          })
        }
      }
    })
  }
})