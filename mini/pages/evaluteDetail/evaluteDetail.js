// pages/evaluteDetail/evaluteDetail.js
var app = new getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showView: true,
    id:"",
    text:"",
    title:"",
    img:"",
    nameping:"",
    usernameimg:"",
    username:"",
    usernamedata:"",
    list:[],
  },

  onChangeShowState: function () {
    var that = this;
    that.setData({
      showView: !that.data.showView
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      id: options.id,
      title: options.title,
      img: options.img,
      nameping: options.nameping,
      usernameimg: options.usernameimg,
      username: options.username,
      usernamedata: options.usernamedata
    })
    this.sub_val();
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
  sub_val:function(){
    var that = this;
    wx.request({
      url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Miniapp/Index/comment_ajax_add&mpid=' + app.data.mpid + "&token=" + wx.getStorageSync('unionId'),
      method: 'POST',
      data: {
        text: that.data.text,
        sgc_id: that.data.id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          list: res.data.info
        })
      }
    })
  },
  input_val:function(e){
    var val = e.detail.value;
    this.setData({
      text:val
    })
  }
})