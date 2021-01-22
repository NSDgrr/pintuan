// pages/confirmPay/confirmPay.js
// const app = import();
var app = getApp();
var unionId = wx.getStorageSync('unionId')
var openId = wx.getStorageSync('openId')

Page({
  /**
  * 页面的初始数据
  */
  data: {
    shop_value: '',
    order_num: '',
    orderid:"",
    flg_obj:"",
    zhifu_type:"1",
    yue_num:"0",
  },
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    console.log(options)
    var that = this;
    var options2 = Number(options.data)
    var order_no = Number(options.order_no)
    var orderid = Number(options.orderid)
    that.setData({
      shop_value: options2,
      order_num: order_no,
      orderid: orderid
    })
    console.log(this.data.shop_value);
    console.log(this.data.order_num);
    console.log(unionId);
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
      url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Api/ShopApi/pay_field_select',
      method: 'GET',
      data: {
        mpid: app.data.mpid,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          flg_obj:res.data
        })
      }
    })
    wx.request({
      url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Api/ShopApi/getMoney&mpid=' + app.data.mpid,
      method: 'POST',
      data: {
        openid: openId,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          yue_num: res.data
        })
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

  },
  //支付方式
  radioval:function(e){
    var val = e.detail.value;
    this.setData({
      zhifu_type: val
    })
  },
  //余额支付
  yue_pay:function(){
    var that = this;
    wx.request({
      url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Api/ShopApi/balance_pay&mpid=' + app.data.mpid,
      method: 'POST',
      data: {
        oid: that.data.orderid,
        openid: openId,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data);
        if(res.data.status == '1'){
          wx.navigateTo({
            url: '../pay_ok/pay_ok',
          })
        } else if (res.data.status == '2'){
          wx.showToast({
            title: '余额不足',
            icon: 'none',
            duration: 2000,
            success: function () {
            }
          })
        }else{
          wx.showToast({
            title: '系统繁忙',
            icon: 'none',
            duration: 2000,
            success: function () {
            }
          })
        }
      }
    })
  },
  // 调用微信支付接口
  pay: function (e) {
    var that = this;
    if (that.data.zhifu_type == '2'){
      that.yue_pay();
    }else{
      //数据传值
      //app.js先获取用户openid 
      wx.request({
        url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Miniapp/Index/getJSapiParams&mpid=' + app.data.mpid,
        method: 'POST',
        data: {
          // bookingNo: bookingNo, /*订单号由服务端随机生成*/
          // total_fee: total_fee, /*订单金额 参数在page.data.shop_value中 [0]是是商品id 
          // [1]是商品数量 [2]是商品单价*/
          openid: wx.getStorageSync('unionId'), /*用户openid*/
          orderNo: that.data.order_num,
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          console.log(res.data.data.timeStamp);
          wx.requestPayment({
            'timeStamp': res.data.data.timeStamp,
            'nonceStr': res.data.data.nonceStr,
            'package': res.data.data.package,
            'signType': res.data.data.signType,
            'paySign': res.data.data.paySign,
            'success': function (res) {
              console.log(res);
              wx.request({
                url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Miniapp/Index/js_pay_notify',
                method: 'POST',
                data: {
                  out_trade_no: that.data.order_num,
                },
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                success: function (res) {
                  wx.navigateTo({
                    url: '../pay_ok/pay_ok',
                  })
                }
              })
            },
            'fail': function (res) {
              console.log('fail:' + JSON.stringify(res));
            }
          })
        },
        fail: function (err) {
          console.log(err)
        }
      })
    }
  },




})