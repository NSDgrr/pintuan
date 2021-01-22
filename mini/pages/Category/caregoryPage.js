// caregoryPage.js
var app = new getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabArr: {
      curHdIndex: 0,
      curBdIndex: 0
    },
    logs: [],
    zres:[]
  },


  //加载数据
  onLoad: function (options) {
    // 点击商品到详情页
    var that = this;
      // that.listwo();

    // php接口
    wx.request({
      data: {
        listshop: [],
        logs: []
      },
      // that.listtwo();
      url: app.data.http_text+'.mobtop.com.cn/index.php?s=/Miniapp/Index/getCateOneAPI',
      method: 'GET',
      data:{
        mpid:app.data.mpid
      },
      success: function (res) {
        var data = res.data.data;
        that.setData({
          listshop: data
        })
        for (var i in that.data.listshop){
          var zid = that.data.listshop[i].sot_id;
          that.data.tabArr.curHdIndex = i;
          that.data.tabArr.curBdIndex = i;
          break;
        }
        that.setData({
          tabArr: that.data.tabArr
        })
        //载入页面默认第一个li
        wx.request({
          //请求地址  
          url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Miniapp/Index/categary_pro_new/sot_id/' + zid,
          data: {//发送给后台的数据  
            // name: "bella",
            // age: 20
            // sot_id:"225",
            mpid: app.data.mpid
          },
          header: {//请求头  
            "Content-Type": "applciation/json"
          },
          method: "GET",
          success: function (res) {
            console.log(res.data.arr);
            var data = res.data.arr;
            that.setData({
              zres: data
            })
            console.log(that.data.zres);

          },
          fail: function (err) {
            console.log("接口调用失败");
          },//请求失败  
          complete: function () { }//请求完成后执行的函数  
        })
      },
      fail: function () {
        console.log("接口调用失败");
      }
    })

    
  },


  



// 导航切换传参
  tabFun: function (e) {
    //获取触发事件组件的dataset属性  
    var that = this;
    var _datasetId = e.target.dataset.id;
    var zid = e.target.dataset.zid;
    console.log("----" + _datasetId + "----");
    // console.log("----" + zid + "----");
    console.log(e);
    var _obj = {};
    _obj.curHdIndex = _datasetId;
    this.setData({
      tabArr: _obj
    });
    // 跳转
    wx.request({
      data:{
        zres:[]
      },
      url: app.data.http_text +'.mobtop.com.cn/index.php?s=/Miniapp/Index/categary_pro_new/sot_id/'+zid,
      method:'GET',
      data:{
        mpid:app.data.mpid
      },
      success: function (res) {
        console.log(res.data.arr);
        var data = res.data.arr;
        that.setData({
          zres: data
        })
      },

    })

  },
  /**
   * 生命周期函数--监听页面加载
*/


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
  //跳转商品
  typeNav:function(e){
    console.log(e.currentTarget.dataset.sod);
    wx.navigateTo({
      url: '../TypeIndex/TypeIndex?id=' + e.currentTarget.dataset.sod,
    })
    // wx.request({
    //   data: {
    //     so_id: e.currentTarget.dataset.sod,
    //     page:1
    //   },
    //   url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Miniapp/Index/categary_pro_new/sot_id/' + zid,
    //   method: 'GET',
    //   data: {
    //     mpid: app.data.mpid
    //   },
    //   success: function (res) {
    //     console.log(res.data.arr);
    //     var data = res.data.arr;
    //     that.setData({
    //       zres: data
    //     })
    //   },

    // })
  }
})