//index.js
//获取应用实例

// 当前页数  
var pageNum = 1;
var app = getApp();

Page({
  data: {
    height:'',
    mpid:app.data.mpid,
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
    //优惠券
    youhui_list:[],
    //推荐码显示
    tuijian_show:true,
    //推荐码num
    tuijian_val:"",
    //分类左侧
    fenlei_left_list:[],
    //分类左侧选中
    fenlei_left_active:"0",
    //分类右侧
    fenlei_right_list:[],
    //购物车总数
    gouwu:"",
    //电话
    get_title:"",
    autoplay: true,
    notice: '',
    change_max_height:'',
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
          console.log(that.lists);
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
  
  onLoad: function (options) {
    if (options.scene){
      wx.request({
        url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Api/ShopApi/bind_qrcode_id',
        method: 'GET',
        data: {
          openid: wx.getStorageSync('unionId'),
          tj_code: options.scene,
          mpid: app.data.mpid
        },
        success: function (res) {
          // console.log(res);
        },
        fail: function () {
          //
        }
      });
    }
    //动态获取高度
    var _this = this;
    //创建节点选择器
    var query = wx.createSelectorQuery();
    //选择id
    query.select('#box').boundingClientRect()
    query.exec(function (res) {
      //res就是 该元素的信息 数组
      // console.log(res);
      //取高度
      _this.setData({
        realWidth: res[0].width,
        realHeight: res[0].height
      })
      // console.log('取高度', _this.data.realHeight);
    })

    var that = this;
    wx.request({
      url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Miniapp/Index/get_web_title',
      method: 'GET',
      data: {
        mpid: app.data.mpid
      },
      success: function (res) {
        wx.setNavigationBarTitle({
          title: res.data.data.newtitle
        })
        that.setData({
          notice: res.data.data.newmess
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
  

  //轮播图点击判断是否登陆
  goBannerList(e){
    if (!wx.getStorageSync('unionId')){
      wx.showToast({
        icon: 'none',
        title: '请在我的中登陆后操作',
        duration: 2000
      });
    }else{
      let listUrl = e.currentTarget.dataset.url
      console.log(listUrl)
      if(listUrl){
        wx.navigateTo({
          url: '/pages' +listUrl+ '?title='+this.data.get_title.newtitle,
        })
      }else{
        return
      }
      
    }
  },

  onReady: function () {
    //获取分类动态得高度
    // let query = wx.createSelectorQuery();
    // query.select('#box').boundingClientRect(rect=>{
    //   let clientHeight = rect.height;
    //   // let clientWidth = rect.width;
    //   // let ratio = 750/clientWidth;
    //   // let height = clientHeight*ratio;
    //   console.log(clientHeight);
    //   this.setData({
    //     height:height
    //   })

    // }).exec();

  },
  onShow: function () {
    // console.log(wx.getStorageSync('unionId')+"|"+6666666666666666666666666666);
    if (!wx.getStorageSync('unionId')){
      // wx.showModal({
      //   title: '登陆授权',
      //   content: '检测到未登录，请前往登录',
      //   showCancel:true,
      //   confirmText:"前往",
      //   success(res) {
      //     if (res.confirm) {
      //       wx.switchTab({
      //         url: '../UserCenter/userCenter'
      //       })
      //     } else if (res.cancel) {
      //       console.log('用户点击取消')
      //     }
      //   }
      // })
    }
    this.getData();
    this.getAllGoods();
    var that = this;
    //优惠券
    wx.request({
      url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Api/Visa/get_coupon_list',
      method: 'GET',
      data: {
        mpid: app.data.mpid,
        user_openid:wx.getStorageSync('unionId'),
        store_type:1,
      },
      success: function (res) {
        if(res.data.length > 0){
          var arr = [];
          for (var i in res.data){
            if(i < 2){
              arr.push(res.data[i]);
            }
          }
          that.setData({
            youhui_list: arr
          })
        }
      },
      fail: function () {
        console.log("接口调用失败");
      }
    });
    //推荐码
    wx.request({
      url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Api/VisaApi/bind_fcode',
      method: 'GET',
      data: {
        mpid: app.data.mpid,
        my_openid:wx.getStorageSync('unionId'),
        type:1,
      },
      success: function (res) {
        if (res.data.state == 0){
          if(app.data.mpid == "609" || app.data.mpid == "338"){
            that.setData({
              tuijian_show: true
            })
          }else{
            that.setData({
              tuijian_show: false
            })
          }
        }else{
          that.setData({
            tuijian_show: false
          })
        }
      },
      fail: function () {
        console.log("接口调用失败");
      }
    });
    //分类——left
    this.fenlei_leftlist();
    this.gouwu_num();
    //获取电话
    wx.request({
      url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Miniapp/Index/get_web_title',
      method: 'GET',
      data: {
        mpid: app.data.mpid,
      },
      success: function (res) {
        // console.log(res);
        that.setData({
          get_title:res.data.data
        })
        wx.setStorage({
          key:"title",
          data:res.data.data.newtitle
        })
      },
      fail: function () {
        console.log("接口调用失败");
      }
    });
  },
  details(e) {
    wx.navigateTo({
      url: '../goodsInfo/GoodsInfo?id=' + e.currentTarget.dataset.id,
    })
  },
  //领取优惠券
  linqu_click:function(e){
    var id = e.currentTarget.dataset.code;
    wx.request({
      url: app.data.http_text + '.mobtop.com.cn/index.php?s=/addon/IdouStore/mobile/couponnumbers',
      method: 'POST',
      data: {
        mpid: app.data.mpid,
        id:id,
        openid: wx.getStorageSync('unionId')
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if(res.data == 1){
          wx.showToast({
            title: '领取成功',
            icon: 'none',
            duration: 2000,
            success: function () {
            }
          })
        }else{
          wx.showToast({
            title: '领取失败',
            icon: 'none',
            duration: 2000,
            success: function () {
            }
          })
        }
      },
      fail: function () {
        console.log("接口调用失败");
      }
    });
  },
  //推荐码
  tuijiu_click:function(){
    var that = this;
    wx.request({
      url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Api/VisaApi/bind_fcode',
      method: 'GET',
      data: {
        mpid: app.data.mpid,
        type:"2",
        tj_code:that.data.tuijian_val,
        my_openid:wx.getStorageSync('unionId'),
        store_type:1
      },
      success: function (res) {
        if (res.data.state == 1){
          wx.showToast({
            title: '绑定成功',
            icon: 'none',
            duration: 2000,
            success: function () {
            }
          })
          that.setData({
            tuijian_show:false
          })
        }else{
          wx.showToast({
            title: '无效码',
            icon: 'none',
            duration: 2000,
            success: function () {
            }
          })
        }
      },
      fail: function () {
        console.log("接口调用失败");
      }
    });
  },
  //推荐码val
  tuijian_change:function(e){
    var val = e.detail.value;
    this.setData({
      tuijian_val:val
    })
  },
  //分类左侧信息 fenlei_left_list
  fenlei_leftlist:function(){
    var that = this;
    wx.request({
      url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Miniapp/Index/get_index_category',
      method: 'GET',
      data: {
        mpid: app.data.mpid,
      },
      success: function (res) {
        that.setData({
          fenlei_left_list:res.data.data
        })
        var listright = { currentTarget: { setData: { id: that.data.fenlei_left_list[that.data.fenlei_left_active].so_id}}};
        that.fenlei_rlist(listright);
        var len = res.data.data.length;
        var pxx = len * 168;
        that.setData({
            change_max_height: pxx+'rpx'
        })
      },
      fail: function () {
        console.log("接口调用失败");
      }
    });
  },
  //分类左侧点击
  fenlei_leftclick:function(e){
    // console.log(e);
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    this.setData({
      fenlei_left_active:index
    })
    var listright = {currentTarget:{setData:{id:id}}};
    this.fenlei_rlist(listright);
  },
  //分类右侧 fenlei_right_list
  fenlei_rlist:function(e){
    var that = this;
    var id = e.currentTarget.setData.id;
    wx.request({
      url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Miniapp/Index/shop_type_list_all&token='+wx.getStorageSync('unionId'),
      method: 'GET',
      data: {
        mpid: app.data.mpid,
        so_id:id,
        is_ajax:"1"
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          fenlei_right_list:res.data
        })
      },
      fail: function () {
        console.log("接口调用失败");
      }
    });
  },
  //获取购物车数量
  gouwu_num:function(){
    var that = this;
    wx.request({
      url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Miniapp/Index/getCarNum&token='+wx.getStorageSync('unionId'),
      method: 'GET',
      data: {
        mpid: app.data.mpid,
      },
      success: function (res) {
        // console.log(res);
        that.setData({
          gouwu:res.data
        })
      },
      fail: function () {
        console.log("接口调用失败");
      }
    });
  },
  //添加购物
  addcar:function(e){
    var that = this;
    let obj = {};
    // console.log(e)
    var index = e.currentTarget.dataset.index;
    var num = that.data.fenlei_right_list[index].in_car_num ? that.data.fenlei_right_list[index].in_car_num : 0;
    num++;
    that.data.fenlei_right_list[index].in_car_num = num;
    obj.id = that.data.fenlei_right_list[index].sg_id;
    obj.price = that.data.fenlei_right_list[index].price.price;
    obj.name = that.data.fenlei_right_list[index].sg_name;
    obj.url = that.data.fenlei_right_list[index].sg_img_url;
    obj.spec = that.data.fenlei_right_list[index].sg_img_url;
    if (that.data.fenlei_right_list[index].specData.length > 0){
      let arr = [];
      for (let i in that.data.fenlei_right_list[index].specData){
        arr.push(that.data.fenlei_right_list[index].specData[i].minData[0].sms_id);
      }
      obj.spec = arr.join();
    }else{
      obj.spec = "";
    }
    if (obj.spec){
      wx.request({
        data: {
          id: obj.id,
          spec: obj.spec,
          mpid: app.data.mpid
        },
        url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Miniapp/Index/getShopCombo',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        success: function (res) {
          obj.price = res.data.data.price;
          that.addcarajax(obj); 
        }
      })
    }else{
      that.addcarajax(obj);
    }
  },
  //添加购物车提交ajax
  addcarajax:function(obj){
    var that = this;
    wx.request({
      url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Miniapp/Index/addShopCar&token=' + wx.getStorageSync('unionId'),
      method: 'POST',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data: {
        mpid: app.data.mpid,
        num: 1,
        id: obj.id,
        countPrice: obj.price,
        sg_price: obj.price,
        sg_name: obj.name,
        sg_img_url: obj.url,
        spec: obj.spec,
      },
      success: function (res) {
        // console.log(res);
        if (res.data.code == '200') {
          var listright = { currentTarget: { setData: { id: that.data.fenlei_left_list[that.data.fenlei_left_active].so_id } } };
          that.fenlei_rlist(listright);
          that.gouwu_num();
        } else {
          wx.showToast({
            title: '请在我的中登陆后操作',
            icon: 'none',
            duration: 2000,
            success: function () {
            }
          })
        }

        // console.log(that.data.fenlei_right_list);
      },
      fail: function () {
        console.log("接口调用失败");
      }
    });
  },
  //删除购物车
  delcar:function(e){
    var that = this;
    var index = e.currentTarget.dataset.index;
    var id = that.data.fenlei_right_list[index].car_id;
    wx.request({
      url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Miniapp/Index/shopCarDel&token='+wx.getStorageSync('unionId'),
      method: 'POST',
      header:{"Content-Type": "application/x-www-form-urlencoded"},
      data: {
        mpid: app.data.mpid,
        s_num:1,
        id:id,
      },
      success: function (res) {
        // console.log(res);
        if(res.data.code == '200'){
          var listright = {currentTarget:{setData:{id:that.data.fenlei_left_list[that.data.fenlei_left_active].so_id}}};
          that.fenlei_rlist(listright);
          that.gouwu_num();
        }
        
        // console.log(that.data.fenlei_right_list);
      },
      fail: function () {
        console.log("接口调用失败");
      }
    });
  },
  //打电话
  tel_click:function(e){
    var tel = e.currentTarget.dataset.tel
    wx.makePhoneCall({
      phoneNumber:tel
    })
  },
  switchNotice: function () {
    this.setData({
      hideNotice: true
    })
  },
   /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '',
      path: '/pages/index/index'
    }
  },
  onShareTimeline: function(){
    return {
      title: '',
      query: '/pages/index/index',
      imageUrl:'',
    }
  },
  // 视频播放
  videoPlay:function(){
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  // 视频暂停
  videoPause:function(){
    this.setData({
      autoplay: !this.data.autoplay
    })
  }
})
