// pages/Recharge/recharge.js
var app = new getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    yue:"",
    taoclist:[],
    listindex:0,
    listid:"",
    prval:"",
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
      url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Api/ShopApi/getMoney&mpid='+app.data.mpid,
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
          listid: res.data[0].id
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
  //选中套餐
  listclick:function(e){
    var that = this;
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    that.setData({
      listindex: index,
      listid: id
    })
  },
  //输入金额
  inputprval:function(e){
    var val = e.detail.value
    this.setData({
      prval: val
    })
  },
  //提交充值
  chongzhisub:function(){
    var that = this;
    if (that.data.prval){
      var type = "1";
      var choose = "";
      var cost = that.data.prval;
    }else{
      var type = "-1";
      var choose = that.data.listid;
      var cost = "";
    }
    wx.request({
      url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Api/ShopApi/rechargeAffirm&mpid='+app.data.mpid,
      method: 'POST',
      data: {
        type: type,
        choose: choose,
        cost: cost,
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