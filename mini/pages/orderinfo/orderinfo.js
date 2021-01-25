// pages/orderinfo/orderinfo.js
var app = getApp();
var unionId = wx.getStorageSync('unionId');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderid:"",
    orderinfo:"",
    //物流显示
    wuliuflg: true,
    wuliulist: [],
    //物流方式
    wuliu_hide: true,
    wuliutype: ["顺丰", "邮寄"],
    wuliutype_index: 0,
    wuliu_numval: "",
    wuliu_orid: "",
    sog_id:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setData({
      orderid: options.orderid
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
      url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Miniapp/Index/orderDetail',
      data: {
        so_id: that.data.orderid,
      },
      method: 'GET',
      success: function (res) {
        console.log(res);
        if (res.data.code == 200) {
          //订单状态
          if (res.data.data.so_service == "1") {
            switch (res.data.data.so_status) {
              case "1":
                res.data.data.so_status = '待付款';
                res.data.data.btn = "1";
                break;
              case "2": res.data.data.so_status = '待发货'; res.data.data.btn = "2"; break;
              case "3": res.data.data.so_status = '待收货'; res.data.data.btn = "3"; break;
              case "4": res.data.data.so_status = '待评价'; res.data.data.btn = "4"; break;
              case "5": res.data.data.so_status = '已完成'; res.data.data.btn = "5"; break;
              case "6": res.data.data.so_status = '已取消'; res.data.data.btn = "6";
            }
          } else if (res.data.data.so_service == "2") {
            switch (res.data.data.so_service_status) {
              case "1": 
                switch (res.data.data.s_deal_status) {
                  case "": res.data.data.so_status = '申请售后中'; res.data.data.btn = "7"; break;
                  case null: res.data.data.so_status = '申请售后中'; res.data.data.btn = "7"; break;
                  case "1": res.data.data.so_status = '同意维修/退货'; res.data.data.btn = "10"; break;
                  case "2": res.data.data.so_status = '已寄回商品'; res.data.data.btn = "11"; break;
                  case "3": res.data.data.so_status = '卖家已收到'; res.data.data.btn = "12"; break;
                  case "4": res.data.data.so_status = '已退款'; res.data.data.btn = "13"; break;
                  case "5": res.data.data.so_status = '维修后已寄回'; res.data.data.btn = "14"; break;
                  case "6": res.data.data.so_status = '客户确认收到'; res.data.data.btn = "15"; break;
                }; break;
              case "3": res.data.data.so_status = '退款成功'; res.data.data.btn = "8"; break;
              case "4": res.data.data.so_status = '退款失败'; res.data.data.btn = "9"; break;
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
          that.setData({
            orderinfo: res.data.data
          })
        }
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
  // 取消订单操作
  cacList(e) {
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
            url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Miniapp/Index/orderCancel',
            data: {
              token: unionId,
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
  //支付
  pay: function (e) {
    console.log(e);
    wx.navigateTo({
      url: '../confirmPay/confirmPay?data=' + e.target.dataset.price + "&order_no=" + e.target.dataset.order,
    })
  },
  //确认收获
  queren_shou: function (e) {
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
              token: unionId,
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
        token: unionId,
        orderId: Number(ord),
        mpid: app.data.mpid
      },
      method: 'GET',
      success: function (res) {
        console.log(res);
        if (res.data[num].wuliu.data.length > 0) {
          that.setData({
            wuliulist: res.data[num].wuliu.data,
            wuliuflg: false
          })
        } else {
          that.setData({
            wuliulist: [
              {
                context: "暂无物流信息",
                time: "",
              }
            ],
            wuliuflg: false
          })
        }
      }
    })
  },
  //关闭物流
  guan_wuliu: function () {
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
              token: unionId,
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
  tuikuan: function (e) {
    var ord = e.currentTarget.dataset.ord
    var back = e.currentTarget.dataset.back//是否可退款：1是 2不能
    var that = this;
    if(back == 1){//能点击操作
      wx.showModal({
        title: '提示',
        content: '确认申请退款吗',
        success: function (res) {
          if (res.confirm) {
            wx.request({
              url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Miniapp/Index/order_apply',
              data: {
                token: wx.getStorageSync('unionId'),
                orderId: Number(ord),
                mpid: app.data.mpid,
                state: 1
              },
              method: 'GET',
              success: function (res) {
                console.log(res);
                if (res.data.code == 200) {
                  wx.showToast({
                    title: '已提交申请退款',
                    icon: 'none',
                    duration: 2000,
                    success: function () {
                      that.onShow();
                    }
                  })
                } else {
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
          }else{

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
    var ord = e.currentTarget.dataset.ord;
    var sog_id = e.currentTarget.dataset.id
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
            state: 2,
            sog_id: sog_id
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
  shouhou: function (e) {
    var ord = e.currentTarget.dataset.ord;
    var sog_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../afterSales/afterSales?id=' + ord + "&sog_id=" + sog_id,
    })
  },
  //退货物流号
  wuliu_val: function (e) {
    console.log(e);
    this.setData({
      wuliu_numval: e.detail.value
    })
  },
  bindPickerChange: function (e) {
    this.setData({
      wuliutype_index: e.detail.value
    })
    console.log(this.data.wuliutype_index)
  },
  tui_queding: function (e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确认填写完成吗',
      success: function (res) {
        wx.request({
          url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Miniapp/Index/send_back_goods&token=' + wx.getStorageSync('unionId'),
          data: {
            s_oid: that.data.wuliu_orid,
            mpid: app.data.mpid,
            type: that.data.wuliutype[that.data.wuliutype_index],
            code: that.data.wuliu_numval,
            sog_id: that.data.sog_id,
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
                    wuliu_hide:false
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
  tiantuihuo: function (e) {
    var ord = e.currentTarget.dataset.ord;
    var sog_id = e.currentTarget.dataset.id;
    console.log(this.data.wuliu_hide);
    this.setData({
      wuliu_orid: ord,
      wuliu_hide: false,
      sog_id: sog_id
    })
  },
  tui_quxiao: function () {
    this.setData({
      wuliu_hide: true
    })
  },
  ok_weixiu: function () {
    var ord = e.currentTarget.dataset.ord;
    var sog_id = e.currentTarget.dataset.id;
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
            sog_id: sog_id
          },
          method: 'post',
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