// pages/others/others.js
var app = new getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navindex:1,
    katel: "",
    kacode:"",
    chongtel:"",
    taoclist: [],
    listindex:"0",
    chongid:"",
    chongval:"",
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
      url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Api/ShopApi/getRule',
      method: 'GET',
      data: {
        mpid: app.data.mpid
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          taoclist: res.data,
          chongid: res.data[0].id
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
  //nav
  navclick:function(e){
    this.setData({
      navindex: e.currentTarget.dataset.index
    })
  },
  //选中套餐
  listclick: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    that.setData({
      listindex: index,
      chongid: id
    })
  },
  //输入金额
  inputprval: function (e) {
    var val = e.detail.value
    this.setData({
      chongval: val
    })
  },
  //充值tel
  codetel: function (e) {
    var val = e.detail.value
    var that = this;
    wx.request({
      url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Api/ShopApi/checkPhone&mpid=' + app.data.mpid,
      method: 'POST',
      data: {
        tel: val
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.state == 1){
          that.setData({
            katel: val
          })
        }else{
          wx.showToast({
            title: '该手机号码未注册!',
            icon: 'none',
            duration: 2000,
            success: function () { }
          })
          that.setData({
            katel: ""
          })
        }
      },
    })
  },
  //充值code
  codeval: function (e) {
    var val = e.detail.value
    this.setData({
      kacode: val
    })
  },
  //充值code
  zaicodetel: function (e) {
    var val = e.detail.value
    var that = this;
    wx.request({
      url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Api/ShopApi/checkPhone&mpid=' + app.data.mpid,
      method: 'POST',
      data: {
        tel: val
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.state == 1) {
          that.setData({
            chongtel: val
          })
        } else {
          wx.showToast({
            title: '该手机号码未注册!',
            icon: 'none',
            duration: 2000,
            success: function () { }
          })
          that.setData({
            chongtel: ""
          })
        }
      },
    })
  },
  //充值提交code
  chongzhicodesub: function () {
    var that = this;
    wx.request({
      url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Api/ShopApi/toforother&mpid=' + app.data.mpid,
      method: 'POST',
      data: {
        tel: that.data.katel,
        openid: wx.getStorageSync('unionId'),
        number: that.data.kacode,
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.state == 0) {
          wx.showToast({
            title: res.data.info,
            icon: 'none',
            duration: 2000,
            success: function () { }
          })
        } else {
          wx.showToast({
            title: '充值成功',
            icon: 'none',
            duration: 2000,
            success: function () { }
          })
        }
        // that.setData({
        //   taoclist: res.data
        // })
      },
    })
  },
  //提交充值
  chongzhisub: function () {
    var that = this;
    if (that.data.chongval) {
      var type = "1";
      var choose = "";
      var cost = that.data.chongval;
    } else {
      var type = "-1";
      var choose = that.data.chongid;
      var cost = "";
    }
    wx.request({
      url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Api/ShopApi/rechargeAffirm&mpid=' + app.data.mpid,
      method: 'POST',
      data: {
        type: type,
        choose: choose,
        cost: cost,
        tel: that.data.chongtel
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res.data);
        var obj = JSON.stringify(res.data.data);
        wx.redirectTo({
          url: '../rechargeAffirm/rechargeAffirm?data=' + obj
        })
        // that.setData({
        //   taoclist: res.data
        // })
      },
    })
  },
})