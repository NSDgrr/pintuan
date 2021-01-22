// pages/bindPhone/bindPhone.js
var app = getApp()
var interval = null 
//倒计时函数
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '请选择日期',
    fun_id: 2,
    time: '获取验证码', //倒计时 
    currentTime: 61,
    telname:'',
    phone:'',
    code:''

  },
// 60倒计时
  getCode: function (options) {
    var that = this;
    var currentTime = that.data.currentTime
    interval = setInterval(function () {
      currentTime--;
      that.setData({
        time: currentTime + '秒'
      })
      // 重新发送
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          time: '重新发送',
          currentTime: 61,
          disabled: false
        })
      }
    }, 1000)
  },
  getVerificationCode() {
    this.getCode();
    var that = this
    that.setData({
      disabled: true
    })
  },

  // 手机号验证  
  loginPhone: function (e) {
    var phone = e.detail.value;
    console.log(phone);
    
    if (!(/^1[34578]\d{9}$/.test(phone))) {
      this.setData({
        ajxtrue: false
      })
      if (phone.length >= 11) {
        wx.showToast({
          title: '手机号有误',
          duration: 2000
        })
      }
    } else {
      this.setData({
        ajxtrue: true
      })
    }
    // console.log(phone);
  },


  // 姓名验证
  loginname:function(e){
    var name = e.detail.value;
    console.log(name);
    //如果当前姓名跟本地存储中的一样
    if(name != '' ){
  
      
    }

  },


  //短信验证
  VeriCode:function(e){
    var code = e.detail.value;
    console.log(code);
    //将返回的验证码对比


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