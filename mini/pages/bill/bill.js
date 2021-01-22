// pages/bill/bill.js
var app = new getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index:"",
    list:[],
    price:"",
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
      url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Api/ShopApi/bill&mpid=' + app.data.mpid,
      method: 'POST',
      data: {
        openid: wx.getStorageSync('unionId'),
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          list: res.data.data.billdata,
          price: res.data.data.price
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
  liclick:function(e){
    if (this.data.index == e.currentTarget.dataset.index){
      this.setData({
        index: ''
      })
    }else{
      this.setData({
        index: e.currentTarget.dataset.index
      })
    }
  }
})