// pages/banerList/banerList.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mpid:app.data.mpid,
    tuanList: [],
    bannerSrc:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options,'======')
    if(options){
      // 动态获取title名字
      wx.setNavigationBarTitle({
        title: options.title
      })
    }
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
    var that = this.groupShop();
  },

    // 拼单列表
  groupShop:function(){
    let that = this;
    wx.request({
      url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Miniapp/Index/tuan_list&token='+wx.getStorageSync('unionId')+'&mpid='+app.data.mpid,
      method:'GET',
      data: {
        // mpid: app.data.mpid,
        // so_id:id,
        // is_ajax:"1"
      },
      success: function (res) {
        console.log(res);
        if(res.data.code == 200){
          that.setData({
            tuanList:res.data.data.page.lists,
            bannerSrc:res.data.data.img_url
          })
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
        
      },
      fail: function () {
        console.log("接口调用失败");
      }
    })
  },

  goDetail(event){
    let currentid = event.currentTarget.dataset.id;
    let currentkey = event.currentTarget.dataset.key;
   
    wx.navigateTo({
      url: '/pages/banerDetail/banerDetail?id=' + currentid + '&key='+currentkey,
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