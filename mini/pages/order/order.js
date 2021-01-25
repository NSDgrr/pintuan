// pages/order/order.js
var app = getApp();
// 调用pay方法
var pay = require("../../pages/goodsInfo/GoodsInfo.js");
console.log(pay);
var unionId = wx.getStorageSync('unionId');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabArr: {
      curHdIndex: 0,
      curBdIndex: 0
    },
    //订单列表是否有数据
    ordList:false,
    // 订单列表
    ords:[],
    //物流显示
    wuliuflg:true,
    wuliulist:[],
    //物流方式
    wuliu_hide:true,
    wuliutype:["顺丰","邮寄"],
    wuliutype_index:0,
    wuliu_numval:"",
    wuliu_orid:"",
  },
  tabFun: function (e) {
    //获取触发事件组件的dataset属性  
    var _datasetId = e.target.dataset.id;
    // console.log("----" + _datasetId + "----");
    var _obj = {};
    _obj.curHdIndex = _datasetId;
    _obj.curBdIndex = _datasetId;
    this.setData({
      tabArr: _obj
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    if (options.index_item){
      this.data.tabArr.curHdIndex = options.index_item;
      this.data.tabArr.curBdIndex = options.index_item;
    }
    var that = this;
    //发货方式
    wx.request({
      url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Api/ShopApi/get_shop_logistics&mpid='+app.data.mpid,
      data: {
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data);
        // wuliutype
        var arr = [];
        for (var i in res.data){
          arr.push(res.data[i].gongsi_name);
        }
        that.setData({
          wuliutype: arr
        })
      }
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
  onShow(){
    console.log(unionId);
      var that = this;
      wx.request({
        url: app.data.http_text+'.mobtop.com.cn/index.php?s=/Miniapp/Index/getOrderList',
        method: 'GET',
        data: {
          token: wx.getStorageSync('unionId'),
          mpid:app.data.mpid
        },
        success: function (res) {
          console.log(res);
          let ordList = res.data.data.map(function (item) {
            //订单状态
            if (item.so_service == "1"){
              switch (item.so_status){
                case "1":
                  item.so_status = '待付款';
                  item.btn = "1";
                  break;
                case "2": item.so_isneedlogis == "1" ? (item.so_logis_num ? item.so_status = '部分发货' : item.so_status = '待发货') : item.so_status = '待发货'; item.btn = "2"; break;
                case "3": item.so_status = '待收货'; item.btn = "3"; break;
                case "4": item.so_status = '待评价'; item.btn = "4"; break;
                case "5": item.so_status = '已完成'; item.btn = "5"; break;
                case "6": item.so_status = '已取消'; item.btn = "6";
              }
            } else if (item.so_service == "2"){
              switch (item.so_service_status){
                case "1": 
                  switch (item.s_deal_status){
                    case null: item.so_status = '申请售后中'; item.btn = "7"; break;
                    case "": item.so_status = '申请售后中'; item.btn = "7"; break;
                    case "1": item.so_status = '同意维修/退货'; item.btn = "10"; break;
                    case "2": item.so_status = '已寄回商品'; item.btn = "11"; break;
                    case "3": item.so_status = '卖家已收到'; item.btn = "12"; break;
                    case "4": item.so_status = '已退款'; item.btn = "13"; break;
                    case "5": item.so_status = '维修后已寄回'; item.btn = "14"; break;
                    case "6": item.so_status = '客户确认收到'; item.btn = "15"; break;
                  };break;
                case "3": item.so_status = '退款成功'; item.btn = "8";break;
                case "4": item.so_status = '退款失败'; item.btn = "9"; break;
                case "5":
                  switch (item.s_deal_status) {
                    case null: item.so_status = '申请售后中'; item.btn = "7"; break;
                    case "": item.so_status = '申请售后中'; item.btn = "7"; break;
                    case "1": item.so_status = '同意维修/退货'; item.btn = "10"; break;
                    case "2": item.so_status = '已寄回商品'; item.btn = "11"; break;
                    case "3": item.so_status = '卖家已收到'; item.btn = "12"; break;
                    case "4": item.so_status = '已退款'; item.btn = "13"; break;
                    case "5": item.so_status = '维修后已寄回'; item.btn = "14"; break;
                    case "6": item.so_status = '客户确认收到'; item.btn = "15"; break;
                  }; break;
                case "6":
                  switch (item.s_deal_status) {
                    case null: item.so_status = '申请售后中'; item.btn = "7"; break;
                    case "": item.so_status = '申请售后中'; item.btn = "7"; break;
                    case "1": item.so_status = '同意维修/退货'; item.btn = "10"; break;
                    case "2": item.so_status = '已寄回商品'; item.btn = "11"; break;
                    case "3": item.so_status = '卖家已收到'; item.btn = "12"; break;
                    case "4": item.so_status = '已退款'; item.btn = "13"; break;
                    case "5": item.so_status = '维修后已寄回'; item.btn = "14"; break;
                    case "6": item.so_status = '客户确认收到'; item.btn = "15"; break;
                  };
              }
            }
            
            return item;
          });
          that.setData({
            orsList: true,
            ords: ordList
          });
        }
        
      })


    if (app.data.order_index) {
      this.data.tabArr.curHdIndex = app.data.order_index;
      this.data.tabArr.curBdIndex = app.data.order_index;
      this.setData({
        tabArr: that.data.tabArr
      })
    }


  },

// 取消订单操作
  cacList(e){
    //orderId获取
    var that = this;
    console.log(e.currentTarget.dataset.ord);
    var ord = e.currentTarget.dataset.ord
    
      wx.showModal({
        title: '提示',
        content: '确定要取消该订单吗',
        success: function (res) {
          if (res.confirm) {
            wx.request({
              url: app.data.http_text+'.mobtop.com.cn/index.php?s=/Miniapp/Index/orderCancel',
              data: {
                token: wx.getStorageSync('unionId'),
                orderId: Number(ord),
                mpid:app.data.mpid
              },
              method: 'GET',
              success: function (res) {
                console.log(res);
                if(res.data.code == 200){
                  that.onShow();
                }
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
   
  },
  //支付
  pay:function(e){
    console.log(e);
    wx.navigateTo({
      url: '../confirmPay/confirmPay?data=' + e.target.dataset.price + "&order_no=" + e.target.dataset.order,
    })
  },
  //确认收获
  queren_shou:function(e){
    //orderId获取
    var that = this;
    console.log(e.currentTarget.dataset.ord);
    var ord = e.currentTarget.dataset.ord;
    wx.showModal({
      title: '提示',
      content: '确认已收货吗',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Miniapp/Index/confirmReceipt',
            data: {
              token: wx.getStorageSync('unionId'),
              orderId: Number(ord),
              mpid: app.data.mpid
            },
            method: 'GET',
            success: function (res) {
              console.log(res);
              if (res.data.code == 200) {
                that.onShow();
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //查看物流
  chakan_liu: function (e) {
    //orderId获取
    var that = this;
    console.log(e.currentTarget.dataset.ord);
    var ord = e.currentTarget.dataset.ord;
    var num = e.currentTarget.dataset.num;
    wx.request({
      url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Miniapp/Index/getLogisInfo',
      data: {
        token: wx.getStorageSync('unionId'),
        orderId: Number(ord),
        mpid: app.data.mpid
      },
      method: 'GET',
      success: function (res) {
        console.log(res);
        if (res.data[num].wuliu.data.length > 0){
          that.setData({
            wuliulist: res.data[num].wuliu.data,
            wuliuflg:false
          })
        }else{
          that.setData({
            wuliulist: [
              {
                context:"暂无物流信息",
                time:"",
              }
              ],
            wuliuflg: false
          })
        }
      }
    })
  },
  //关闭物流
  guan_wuliu:function(){
    this.setData({
      wuliuflg: true
    })
  },
  //评价
  pingjia: function (e) {
    var ord = e.currentTarget.dataset.ord;
    var sogid = e.currentTarget.dataset.sogid;
    console.log(sogid);
    wx.navigateTo({
      url: '../evaluate/evaluate?id=' + ord + "&sogid=" + sogid,
    })
  },
  //删除订单
  del_order: function (e) {
    //orderId获取
    var that = this;
    console.log(e.currentTarget.dataset.ord);
    var ord = e.currentTarget.dataset.ord;
    wx.showModal({
      title: '提示',
      content: '确认删除该订单吗',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Miniapp/Index/orderDel',
            data: {
              token: wx.getStorageSync('unionId'),
              orderId: Number(ord),
              mpid: app.data.mpid
            },
            method: 'GET',
            success: function (res) {
              console.log(res);
              if (res.data.code == 200) {
                that.onShow();
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //申请退款
  tuikuan:function(e){
    console.log(e,'====')
    var ord = e.currentTarget.dataset.ord
    var back = e.currentTarget.dataset.back//是否可退款：1是 2不能
    console.log(back,'----back----')
    var that = this;
    if(back == 1){//能点击操作
      wx.showModal({
        title: '提示',
        content: '确认申请退款吗',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.request({
              url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Miniapp/Index/order_apply',
              data: {
                token: wx.getStorageSync('unionId'),
                orderId: Number(ord),
                mpid: app.data.mpid,
                state:1
              },
              method: 'GET',
              success: function (res) {
                console.log(res);
                if(res.data.code == 200){
                  wx.showToast({
                    title: '已提交申请退款',
                    icon: 'none',
                    duration: 2000,
                    success: function () {
                      that.onShow();
                    }
                  })
                }else{
                  wx.showToast({
                    title: '申请退款失败',
                    icon: 'none',
                    duration: 2000,
                    success: function () {
    
                    }
                  })
                }
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }else{
      wx.showToast({
        title: '该活动暂不支持退款,具体请联系平台',
        icon: 'none',
        duration: 2000,
        success: function () {

        }
      })
    }
    
    
  },
  //取消退款
  quxiao_tuikuan: function (e) {
    var ord = e.currentTarget.dataset.ord
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确认取消申请退款吗',
      success: function (res) {
        wx.request({
          url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Miniapp/Index/order_apply',
          data: {
            token: wx.getStorageSync('unionId'),
            orderId: Number(ord),
            mpid: app.data.mpid,
            state: 2
          },
          method: 'GET',
          success: function (res) {
            console.log(res);
            if (res.data.code == 200) {
              wx.showToast({
                title: '已取消退款',
                icon: 'none',
                duration: 2000,
                success: function () {
                  that.onShow();
                }
              })
            } else {
              wx.showToast({
                title: '取消退款失败',
                icon: 'none',
                duration: 2000,
                success: function () {

                }
              })
            }
          }
        })
      }
    })
  },
  //申请售后
  shouhou:function(e){
    var ord = e.currentTarget.dataset.ord;
    wx.navigateTo({
      url: '../afterSales/afterSales?id=' + ord,
    })
  },
  //跳转详情
  orderinfo:function(e){
    wx.navigateTo({
      url: '../orderinfo/orderinfo?orderid=' + e.currentTarget.dataset.orderid,
    })
  },
  //退货物流号
  wuliu_val:function(e){
    console.log(e);
    this.setData({
      wuliu_numval: e.detail.value
    })
  },
  bindPickerChange:function(e){
    this.setData({
      wuliutype_index: e.detail.value
    })
    console.log(this.data.wuliutype_index)
  },
  tui_queding:function(e){
    var that = this; 
    wx.showModal({
      title: '提示',
      content: '确认填写完成吗',
      success: function (res) {
        wx.request({
          url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Miniapp/Index/send_back_goods&token=' + wx.getStorageSync('unionId') + "&mpid=" + app.data.mpid,
          data: {
            s_oid: that.data.wuliu_orid,
            type: that.data.wuliutype[that.data.wuliutype_index],
            code: that.data.wuliu_numval
          },
          method: 'post',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function (res) {
            console.log(res);
            if (res.data.code == 200) {
              wx.showToast({
                title: '提交完成',
                icon: 'none',
                duration: 2000,
                success: function () {
                  that.onShow();
                  that.setData({
                    wuliu_hide: true
                  })
                }
              })
            } else {
              wx.showToast({
                title: '提交失败',
                icon: 'none',
                duration: 2000,
                success: function () {

                }
              })
            }
          }
        })
      }
    })
  },
  tiantuihuo:function(e){
    var ord = e.currentTarget.dataset.ord
    this.setData({
      wuliu_orid: ord,
      wuliu_hide: false
    })
  },
  tui_quxiao:function(){
    this.setData({
      wuliu_hide: true
    })
  },
  ok_weixiu:function(){
    var ord = e.currentTarget.dataset.ord
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确认收到维修商品吗',
      success: function (res) {
        wx.request({
          url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Miniapp/Index/get_back_goods?token=' + wx.getStorageSync('unionId'),
          data: {
            s_oid: ord,
            mpid: app.data.mpid,
          },
          method: 'post',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function (res) {
            console.log(res);
            if (res.data.code == 200) {
              wx.showToast({
                title: '确认成功',
                icon: 'none',
                duration: 2000,
                success: function () {
                  that.onShow();
                }
              })
            } else {
              wx.showToast({
                title: '确认失败',
                icon: 'none',
                duration: 2000,
                success: function () {

                }
              })
            }
          }
        })
      }
    })
  }
})