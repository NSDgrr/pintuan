// pages/editAddress/editAddress.js

var app = getApp();
var unionId = wx.getStorageSync('unionId')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: ['北京市', '北京市', '海淀区']
  },

  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
    console.log(e)
  },
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
      wx.request({
        url: app.data.http_text+'.mobtop.com.cn/index.php?s=/Miniapp/Index/addDeliveryAddress',
        method:'POST',
        data: {
          token: unionId,
          mpid:app.data.mpid
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },

      })
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
