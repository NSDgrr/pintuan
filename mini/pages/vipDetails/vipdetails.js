// pages/vipDetails/vipdetails.js
var app = new getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataval:"",
    logo:"",
    name:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Api/ShopApi/idcards_mes&mpid=' + app.data.mpid,
      method: 'POST',
      data: {
        openid: wx.getStorageSync('unionId'),
        unionid: ""
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        var logoimg = res.data.data.member_mess.icons;
        that.setData({
          logo: logoimg
        })
      },
      fail: function () {
        console.log('接口调用失败');
      }
    })
    // console.log(options,"rrr")
    this.setData({
      name: options.name,
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
    var that = this;
    wx.request({
      url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Api/ShopApi/idcards_mes&mpid=' + app.data.mpid,
      method: 'POST',
      data: {
        openid: wx.getStorageSync('unionId'),
        unionid:""
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res)
        var data = res.data.data.card_info;
        var logoimg = res.data.data.member_mess.icons;
        that.setData({
          dataval: data,
          logo: logoimg
        })
      },
      fail: function () {
        console.log('接口调用失败');
      }
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