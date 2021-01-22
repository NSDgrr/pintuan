// pages/rechargeAffirm/rechargeAffirm.js
var app = new getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fapiaolist:["无发票","有发票"],
    fapiaolistindex:0,
    obj:"",
    faval:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      obj: JSON.parse(options.data)
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
  //发票
  bindPickerChange:function(e){
    console.log(e);
    this.setData({
      fapiaolistindex: e.detail.value
    })
  },
  //票号
  inputpiaoval:function(e){    
    this.setData({
      faval: e.detail.value
    })
  },
  //提交订单
  sub:function(){
    var that = this;
    wx.request({
      url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Api/ShopApi/confirmOrderbill&mpid=' + app.data.mpid,
      method: 'POST',
      data: {
        chong: that.data.obj.chong,
        zeng_money: that.data.obj.zeng,
        zeng_product: that.data.obj.zeng_product,
        invoiceheader: Number(that.data.fapiaolistindex)+1,
        invoiceinfo: that.data.faval,
        type: that.data.obj.type,
        tel: that.data.obj.tel,
        openid: wx.getStorageSync('unionId'),
        mpid: app.data.mpid
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res.data);
        that.orderdata(res.data);
      },
    })
  },
  //查询订单
  orderdata:function(id){
    var that = this;
    wx.request({
      url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Api/ShopApi/pre_donate&mpid=' + app.data.mpid,
      method: 'POST',
      data: {
        orderid: id.orderid,
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res.data);
        that.pay(res.data);
      },
    })
  },
  //获取支付
  pay: function (res) {
    var that = this;
    wx.request({
      url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Miniapp/Index/getJSapiParamsChongzhi&mpid=' + app.data.mpid,
      method: 'POST',
      data: {
        orderid: res.orderid,
        openid: wx.getStorageSync('unionId'),
        mpid: app.data.mpid,
        notify: res.notify,
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res_s) {
        console.log(res_s.data);
        wx.requestPayment({
          'timeStamp': res_s.data.data.timeStamp,
          'nonceStr': res_s.data.data.nonceStr,
          'package': res_s.data.data.package,
          'signType': res_s.data.data.signType,
          'paySign': res_s.data.data.paySign,
          'success': function (ress) {
            that.cbpay(res.orderid);
          },
          'fail': function (res) {
            console.log('fail:' + JSON.stringify(res));
          }
        })
      },
    })
  },
  //回调callback
  cbpay:function(res){
    var that = this;
    wx.request({
      url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Api/ShopApi/pay_ok',
      method: 'GET',
      data: {
        mpid: app.data.mpid,
        orderid: res,
      },
      success: function (res) {
        wx.navigateTo({
          url: '../pay_ok/pay_ok',
        })
      },
    })
  }
})