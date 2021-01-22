// pages/userdata/userdata.js
var app = new getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sex:["男","女"],
    sexindex:0,
    timeindex:"",
    tel:"",
    name:"",
    dataval:"",
    zhidu:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setData({
      timeindex: that.writeCurrentDate()
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
      url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Api/ShopApi/get_my_info&mpid=' + app.data.mpid,
      method: 'POST',
      data: {
        type:1,
        openid: wx.getStorageSync('unionId'),
        unionid: "",
        formdata:""
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res.data)
        if(res.data.data){
          if (res.data.data.sex){
            that.data.sexindex = Number(res.data.data.sex) - 1;
          }
          if (res.data.data.birthday) {
            that.data.timeindex = res.data.data.birthday;
            that.data.zhidu = true
          }
          that.setData({
            dataval: res.data.data,
            sexindex: that.data.sexindex,
            timeindex: that.data.timeindex,
            zhidu: that.data.zhidu,
            tel: res.data.data.mobile,
            name: res.data.data.relname
          })
        }
        // var data = res.data.data.card_info;
        
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

  },
  //获取当前时间
  writeCurrentDate:function(){
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth();
    var date = now.getDate();
    month = month + 1;
    if(month < 10) month = "0" + month;
    if(date < 10) date = "0" + date;
    var time = "";
    time = year + "-" + month + "-" + date;
    return time;
  },
  //手机
  telchang:function(e){
    this.setData({
      tel: e.detail.value
    })
  },
  //姓名
  namechang: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  //性别
  sexPickerChange:function(e){
    this.setData({
      sexindex: e.detail.value
    })
  },
  //出生日期
  timePickerChange:function(e){
    this.setData({
      timeindex: e.detail.value
    })
  },
  //提交数据
  formsubmit:function(){
    var that = this;
    var data = {
      relname: this.data.name,
      mobile: this.data.tel,
      sex: Number(this.data.sexindex) + 1,
      birthday: this.data.timeindex,
    }
    wx.request({
      url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Api/ShopApi/get_my_info&mpid=' + app.data.mpid,
      method: 'POST',
      data: {
        type:2,
        openid: wx.getStorageSync('unionId'),
        unionid: "",
        formdata:JSON.stringify(data)
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.status == 1){
          wx.showToast({
            title: '保存成功',
            icon: 'none',
            duration: 2000,
            success: function () {
            }
          })
        }
      },
      fail: function () {
        console.log('接口调用失败');
      }
    })
  }
})