var app = new getApp();
// pages/massages/massages.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index:1,
    list:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Api/ShopApi/my_massages&mpid=' + app.data.mpid,
      method: 'POST',
      data: {
        type:'3',
        openid: wx.getStorageSync('unionId'),
        unionid: ""
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          list: res.data.data
        })
      },
      fail: function () {
        console.log("接口调用失败");
      }
    });
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

  },
  shiyong_click:function(e){
    console.log(e);
    this.setData({
      index: e.currentTarget.dataset.index
    })
  }
})