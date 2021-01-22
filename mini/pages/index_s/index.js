//index.js
//获取应用实例

// 当前页数  
var pageNum = 1;
var app = getApp();
Page({
  data: {
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    list: [],
    lists: [],
    toView: 'red',
    scrollTop: 1000,
    hidden: true,
    load: '加载中...',
    list_length:"1",
  },
  upper: function (e) {
    //console.log(3)
  },
  lower: function (e) {
    //console.log(2)
    var that = this;
    if (that.data.list_length == '1') {
      // that.setData({
      //   hidden: false
      // });
    }
    pageNum++;
    wx.request({
      url: app.data.http_text+'.mobtop.com.cn/index.php?s=/Miniapp/Index/getScrollShopData',
      method: 'GET',
      data: {
        page:pageNum,
        mpid:app.data.mpid
      },
      success: function (res) {
        //console.log(res)
        var data = res.data.data.data;
        var aaa = that.data.lists;
        if (data.length) {
          for (var i = 0; i < data.length; i++) {
            aaa.push(data[i])
          }
          that.setData({
            lists: aaa,
            list_length:"1",
          })
          console.log(that.data.lists);
        } else {
          if (that.data.list_length == '1'){
            that.setData({
              list_length: "0",
              load: '没有内容了',
            })
          }
        }
        // setTimeout(function () {
        //   that.setData({
        //     hidden: true
        //   });
        // }, 1000)
      },
      fail: function () {
        console.log("接口调用失败");
      }
    });
  },
  onLoad: function () {
    this.getData();
    this.getAllGoods();
    var that = this;
    wx.request({
      url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Miniapp/Index/get_web_title',
      method: 'GET',
      data: {
        mpid: app.data.mpid
      },
      success: function (res) {
        wx.setNavigationBarTitle({
          title: res.data.data.newtitle,
        })
      },
      fail: function () {
        console.log("接口调用失败");
      }
    });
  },
  getData: function () {
    var that = this;
    wx.request({
      url: app.data.http_text+'.mobtop.com.cn/index.php?s=/Miniapp/Index/getIndexData',
      method: 'GET',
      data:{
        mpid:app.data.mpid
      },
      success: function (res) {
        var data = res.data.data;
        //console.log(data);
        that.setData({
          list: data,
        })
      },
      fail: function () {
        console.log("接口调用失败");
      }
    });
  },
  getAllGoods: function () {
    var that = this;
    wx.request({
      url: app.data.http_text+'.mobtop.com.cn/index.php?s=/Miniapp/Index/getScrollShopData',
      method: 'GET',
      data: {
        page:1,
        mpid:app.data.mpid
      },
      success: function (res) {
        var aaa = [];
        var data = res.data.data.data;
        if(data.length){
          for (var i = 0; i < data.length; i++) {
            aaa.push(data[i])
          }
        }
        //console.log(data)
        that.setData({
          lists: aaa
        })
      },
      fail: function () {
        console.log("接口调用失败");
      }
    });
  },
  // 动态接受数据


  onReady: function () {
  },
  onShow: function () {

    // 生命周期函数--监听页面显示
  },
  details(e) {
    wx.navigateTo({
      url: '../goodsInfo/GoodsInfo?id=' + e.currentTarget.dataset.id,
    })
  }
})
