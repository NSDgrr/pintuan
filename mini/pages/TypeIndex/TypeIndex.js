//index.js
//获取应用实例
var app = getApp()
var pageNum = 1;
Page({
  data: {
    list: [],
    lists: [],
    
    tabArr: {
      curHdIndex: 0,
      curBdIndex: 0
    },
    // search 初始化
    goodsearch: '搜索界面',
    cancelValue: '取消',
    searchName: '',
    list2: [],  //历史搜索
    hotsearch: '',
    qiehuan_css:"0",//0  1
    toView: 'red',
    scrollTop: 1000,
    hidden: true,
    load: '加载中...',
    list_length:"",
    height:"",
    id:"",//分类id
  },
  // 确认取消按钮  有值确认   无值取消
  bindKeyInput: function (e) {
    var value = e.detail.value;
    if (value > 0 || value.length > 0) {
      this.setData({
        searchName: value,
        cancelValue: '确认',
      })
    } else {
      this.setData({
        cancelValue: '取消',
      })
    }

  },
  // 点击清空浏览记录清楚搜索框的缓存数据
  clearSearchStorage: function () {
    wx.setStorageSync('searchData', [])
    this.setData({
      list2: []
    })
  },
  // 确认   取消   点击事件  
  Historyclick: function () {
    var that = this;
    if (this.data.cancelValue == '确认') {
      wx.request({
        url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Miniapp/Index/searchShops',
        method: 'GET',
        data: {
          mpid: app.data.mpid,
          search: that.data.searchName
        },
        success: function (res) {
          var data = res.data.data;
          that.setData({
            lists: data
          })
        },
        fail: function () {
          console.log("接口调用失败");
        }
      });

      // if (this.data.searchName != '') {
      //   //调用API从本地缓存中获取数据  
      //   var searchData = wx.getStorageSync('searchData') || []
      //   if (searchData.indexOf(this.data.searchName) == -1) {
      //     searchData.push(this.data.searchName)
      //     wx.setStorageSync('searchData', searchData)
      //   }
      // }
      // console.log(searchData);
      // wx.redirectTo({
      //   //搜索框内携带的值  id 
      //   url: '../goodInfo/GoodInfo?id=' + that.data.searchName,
      // })


    } else {
      // wx.navigateBack({
      //   delta: 1,
      // })

    }
  },

  //点击button
  clickName: function (e) {
    //获取button内容 赋值
    this.setData({
      hotsearch: e.currentTarget.dataset.name,
      cancelValue: '确认',
      searchName: e.currentTarget.dataset.name,
    })
  },



  onLoad: function (options) {
    console.log(options);
    this.setData({
      id:options.id
    })
    var that = this;
    wx.getSystemInfo({
      success: function(res){
        that.setData({
          height: res.windowHeight
        })
      }
    })
    //调用应用实例的方法获取全局数据
    wx.getStorage({
      key: 'searchData',
      success: function (res) {
        that.setData({
          list2: res.data
        })
      },
    })
    // app.getUserInfo(function (userInfo) {
    //   //console.log(userInfo);
    //   //更新数据
    //   that.setData({
    //     userInfo: userInfo
    //   })
    // });
    // that.getData();
    // that.getAllGoods();
    that.getAllGoods_s();
    wx.setNavigationBarTitle({
      title: '商品列表'
    })
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
          list: data
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
      url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Miniapp/Index/getScrollShopData',
      method: 'GET',
      data: {
        page: 1,
        mpid: app.data.mpid
      },
      success: function (res) {
        // console.log(res)
        var data = res.data.data.data;
        console.log(data)
        that.setData({
          'lists': data
        })
      },
      fail: function () {
        console.log("接口调用失败");
      }
    });
  },
  getAllGoods_s: function () {
    var that = this;
    wx.request({
      url: app.data.http_text +'.mobtop.com.cn/index.php?s=/Miniapp/Index/getClassifyGoods',
      method: 'GET',
      data: {
        page: 1,
        so_id:that.data.id,
        mpid:app.data.mpid,
        order: "asc",
        by:""
      },
      success: function (res) {
        console.log(res)
        var data = res.data.data;
        console.log(data)
        that.setData({
          'lists': data
        })
      },
      fail: function () {
        console.log("接口调用失败");
      }
    });
  },
  lower: function (e) {
    //console.log(2)
    var that = this;
    if (that.data.list_length == '1') {
      that.setData({
        hidden: false
      });
    }
    pageNum++;
    wx.request({
      url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Miniapp/Index/getClassifyGoods',
      method: 'GET',
      data: {
        page: pageNum,
        so_id: that.data.id,
        mpid: app.data.mpid,
        order: "asc",
        by: ""
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
            list_length:"1"
          })
          console.log(that.data.lists);
        } else {
          if (that.data.list_length == '1'){
            that.setData({
              load: '没有内容了',
              list_length: "0"
            })
          }
        }
        setTimeout(function () {
          that.setData({
            hidden: true
          });
        }, 1000)
      },
      fail: function () {
        console.log("接口调用失败");
      }
    });
  },
  tab: function (e) {
    //获取触发事件组件的dataset属性  
    var _datasetId = e.target.dataset.id;
    // console.log("----" + _datasetId + "----");
    this.setData({
      tabIndex: _datasetId
    });
  },
  tabFun: function (e) {
    console.log('事件触发');
    // //获取触发事件组件的dataset属性  
    var _datasetId = e.target.dataset.id;
    console.log("----" + _datasetId + "----");
    var _obj = {};
    _obj.curHdIndex = _datasetId;
    _obj.curBdIndex = _datasetId;
    this.setData({
      tabArr: _obj
    });
    
  },
  tabFun2: function (e) {
    var dataId = e.target.dataset.id;
    var obj = {};
    obj.curBfIndex = dataId;
    obj.curAfIndex = dataId;
    this.setData({
      tabArr2: obj
    })
  },
  // 动态接受数据


  onReady: function () {
  },
  onShow: function () {
    // 生命周期函数--监听页面显示 将搜索框内容放在本地存储
    var getSearch = wx.getStorageSync('searchData');
    this.setData({
      listsearch: getSearch,
      inputValue: '',

    })
  },
  details(e) {
    wx.navigateTo({
      url: '../goodsInfo/GoodsInfo?id=' + e.currentTarget.dataset.id,
    })
  },
  tiaozhuan(){
    console.log(2);
    wx.navigateTo({
      url: '../index/index'
    })
    console.log(3)
  },
  yangshi_qie:function(){
    if (this.data.qiehuan_css == "0"){
      this.setData({
        qiehuan_css:"1",
      })
    }else{
      this.setData({
        qiehuan_css: "0",
      })
    }
  }
})
