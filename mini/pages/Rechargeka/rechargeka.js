// pages/Rechargeka/rechargeka.js
var app = new getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    yue:"",
    chongcode:""
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

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    wx.request({
      url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Api/ShopApi/getMoney&mpid=' + app.data.mpid,
      method: 'POST',
      data: {
        openid: wx.getStorageSync('unionId')
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          yue: res.data
        })
      },
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

  },
  //充值code
  inputcodeval: function (e) {
    var val = e.detail.value
    this.setData({
      chongcode: val
    })
  },
  //立即充值
  chongzhisub: function () {
    var that = this;
    wx.request({
      url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Api/ShopApi/rechargeCardnumber&mpid=' + app.data.mpid,
      method: 'POST',
      data: {
        openid: wx.getStorageSync('unionId'),
        cardnumber:that.data.chongcode,
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.status == 1){
          wx.showToast({
            title: res.data.info,
            icon: 'none',
            duration: 2000,
            success: function () {}
          })
        }else{
          wx.showToast({
            title: '充值成功',
            icon: 'none',
            duration: 2000,
            success: function () {}
          })
        }
        // that.setData({
        //   taoclist: res.data
        // })
      },
    })
  },
})