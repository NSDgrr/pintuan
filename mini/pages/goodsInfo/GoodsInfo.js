var app = getApp();

// GoodsInfo.js
var WxParse = require('../wxParse/wxParse.js');
Page({

  /**
  * 页面的初始数据
  */

  data: {
    shop_id:"",
    link_mobile:"",
    listData: [],
    imgUrls: [
      'http://yanxuan.nosdn.127.net/eab1197866f0b435a1b069abd93c636a.jpg',
      'http://yanxuan.nosdn.127.net/ea28639eb948b70b4a3fd487144900f4.jpg',
      'http://yanxuan.nosdn.127.net/93c1cc67b99e32ca80abaf78be81789b.jpg'
    ],
    sg_img_video:'',
    carts: [],
    godcarts: [],
    midcarts: [],
    badcarts: [],
    allcarts: [],
    goshopnum:[],//购物车数量
    hasList: false,
    flag: false,
    showView: false,
    tabIndex: [0],
    num: 1,
    minusStatus: 'disabled',
    minindex: 0,
    tabArr: {
      curHdIndex: 0,
      curBdIndex: 0
    },
    tabArr2: {
      curBfIndex: 0,
      curAfIndex: 0
    },
    starRating: {
      ling: '../../static/imgs/star-off.png',
      zheng: '../../static/imgs/star-on.png',
    },
    shop_price: [],
    shop_price_y: [],
    showType: "",
    getSpe: '',
    listx: [],
    //收藏功能

    //优惠券
    youhui_showhide:false,
    youhui_list:[]
  },
  /**
     * 生命周期函数--监听页面加载
     */
  onLoad: function (options) {
    var that = this;
    console.log(options.id)
    this.setData({
      shop_id: options.id
    });
  },

  onShow: function () {
    var that = this;
    // php接口
    wx.request({
      url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Miniapp/Index/getShopInfo/id/' + this.data.shop_id,
      method: 'GET',
      data: {
        mpid: app.data.mpid
      },
      success: function (res) {
        console.log(res);
        var data = res.data.data;
        let showView;
        if (data.isCollected == 0) {
          showView = false;
        } else {
          showView = true
        };
        that.setData({
          sg_img_video: data.sg_img_video
        })
        that.setData({
          shop_price_y: data.sg_y_price
        })
        if (data.dan_status == '1') {
          that.setData({
            listx: data,
            showView,
            shop_price: data.sg_price,
            shop_stock: data.sgs_total_stock,
          })
        } else {
          if (data.specData) {
            let tabIndex = data.specData.map(function (item) {
              item = 0;
              return item
            })
            that.setData({
              listx: data,
              showView,
              tabIndex
            })
          } else {
            that.setData({
              listx: data,
              showView
            })
          }
        }

        //转译的文本进行赋值
        if (app.data.mpid == 16) {
          var wxhtml = res.data.data.sg_detail;
        } else {
          if (res.data.data.sg_detail.indexOf("http:\/\/visa\.mobtop\.com\.cn") > -1) {
            if (res.data.data.sg_detail.indexOf("http:\/\/vsp\.mobtop\.com\.cn") > -1) {
              var wxhtml = res.data.data.sg_detail.replace(/http:\/\/visa\.mobtop\.com\.cn/g, "");
            } else {
              var wxhtml = res.data.data.sg_detail.replace(/http:\/\/visa\.mobtop\.com\.cn/g, "http://vsp.mobtop.com.cn");
            }
          }
        }
        // 转译wx.Parse
        WxParse.wxParse('wxhtml', 'html', wxhtml, that, 5);
        if (data.dan_status != '1') {
          var ruleList = that.data.listx.specData;
          var arrId = [];
          for (var i = 0; i < ruleList; i++) {
            arrId.push(ruleList[i].ssm_id)
          }
          wx.request({
            data: {
              id: that.data.listx.sg_id,
              spec: arrId.join(','),
              mpid: app.data.mpid
            },
            url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Miniapp/Index/getShopCombo',
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            method: 'POST',
            success: function (res) {
              // console.log(res);

              that.setData({
                shop_price: res.data.data.price,
                shop_stock: res.data.data.ssc_stock
              })
            }
          })
        }

      },

      fail: function () {
        console.log("接口调用失败");
      },

    });
    this.shopNum();
    var unionId = wx.getStorageSync('unionId');
    console.log(unionId);
    if (!unionId){
      wx.showToast({
        title: '请先在我的中登陆再下单',
        icon: 'none',
        duration: 3000,
        success: function () {
        }
      })
    }

    wx.request({
      url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Miniapp/Index/get_web_title',
      method: 'GET',
      data: {
        mpid: app.data.mpid
      },
      success: function (res) {
        that.setData({
          link_mobile: res.data.data.link_mobile,
        })
      },
      fail: function () {
        console.log("接口调用失败");
      }
    });

    //获取优惠券
    wx.request({
      url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Api/ShopApi/couponinfo&mpid=' + app.data.mpid,
      method: 'POST',
      data: {
        sg_id: that.data.shop_id,
        comform:'2',
        openid: wx.getStorageSync('unionId'),
        unionid:""
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res.data);
        if(res.data.length > 0){
          that.setData({
            youhui_list:res.data
          })
        }
      },
      fail: function () {
        console.log("接口调用失败");
      }
    });
  },
  shopNum:function(){
    var that = this;
    wx.request({
      url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Miniapp/Index/getShopCarList',
      method: 'GET',
      data: {
        token: wx.getStorageSync('unionId'),
        mpid: app.data.mpid
      },
      success: function (res) {
        console.log(res.data.data);
        if (res.data.data.length > 0) {
          that.setData({
            goshopnum: res.data.data.length
          });
        } else {
          that.setData({
            goshopnum: 0
          });
        }
      }
    })
  },
  // 过个参数
  onChangeFlagState: function (e) {
    var index = e.target.dataset.index;
    var carts = this.data.carts;
    var zannum = carts[index].sgc_click ? Number(carts[index].sgc_click) : 0;
    var select = carts[index].is_click;
    if (select == 0) {
      zannum++;
      carts[index].sgc_click = zannum;
      carts[index].is_click = 1;
      this.setData({
        carts: carts
      })
    } else {
      zannum--;
      carts[index].sgc_click = zannum;
      carts[index].is_click = 0;
      this.setData({
        carts: carts
      })
      console.log(carts)
    }
    wx.request({
      url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Miniapp/Index/ajax_click_addss&mpid=' + app.data.mpid + "&openid=" + wx.getStorageSync('unionId'),
      method: 'POST',
      data: {
        id: carts[index].sgc_id,
        openid: wx.getStorageSync('unionId')
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data.data);
      }
    })
  },



  // 收藏
  onChangeShowState: function () {
    var that = this;
    that.setData({
      showView: !that.data.showView
    })
    if (this.data.showView) {
      wx.showToast({
        title: '收藏成功',
        icon: '../../static/imgs/tixingtishi.png',
        duration: 2000,
        success: function () {
          wx.request({
            url: app.data.http_text+'.mobtop.com.cn/index.php?s=/Miniapp/Index/addCollectGoods&token=' + wx.getStorageSync('unionId'),
            method: 'post',
            data: {
              'sg_id': Number(that.data.listx.sg_id),
              mpid:app.data.mpid
            },
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
              //收藏成功无需操作
              console.log(res)
            }
          })
        }
      })
    } else {
      wx.showToast({
        title: '收藏取消',
        icon: 'none',
        duration: 2000,
        success: function () {
          wx.request({
            url: app.data.http_text+'.mobtop.com.cn/index.php?s=/Miniapp/Index/cancelCollectGoods&token=' + wx.getStorageSync('unionId'),
            method: 'post',
            data: {
              'id': Number(that.data.listx.sg_id),
              mpid:app.data.mpid
            },
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
              //收藏取消无需操作
              console.log(res)
            }
          })
        }
      })
    }
  },

  //加入购物车方法
  onShowToast: function () {
    var that = this;
    var countPrice = parseFloat(this.data.shop_price * this.data.num)
    var unionId = wx.getStorageSync('unionId');
    if (this.data.listx.dan_status == "1"){
      var arr = [""];
    }else{
      console.log(this.data.listx.specData);
      var arr = [];
      for (let i = 0; i < this.data.tabIndex.length; i++) {
        arr.push(this.data.listx.specData[i].minData[this.data.tabIndex[i]].sms_id)
      }
      console.log(arr);
    }

    var sendData = {
      'id': Number(this.data.listx.sg_id),
      'sg_name': this.data.listx.sg_name,
      'sg_img_url': this.data.listx.sg_lun.join(','),
      'sg_price': parseFloat(this.data.shop_price),
      'num': this.data.num,
      'spec': arr.join(','),
      'countPrice': countPrice,
      mpid:app.data.mpid
    };
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      duration: 2000,
      success: function () {
        //加入购物车
        wx.request({
          url: app.data.http_text+'.mobtop.com.cn/index.php?s=/Miniapp/Index/addShopCar&token=' + wx.getStorageSync('unionId'),
          method: 'post',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          data: sendData,
          success: function (res) {
            console.log(res);
            that.shopNum();
            // wx.setStorageSync('num',sendData.num)
          }
        })
      }
    });

    console.log(sendData);

  },



  //  tab选项卡
  tab: function (e) {
    //获取触发事件组件的dataset属性  
    var _datasetId = e.target.dataset.id;
    var _datasetBox = e.target.dataset.box;
    // console.log("----" + _datasetId + "----");
    var data = 'tabIndex[' + _datasetBox + ']';
    this.setData({
      [data]: _datasetId
    });
    
    var that = this
    var id = this.data.listx.sg_id
    let arr = [];
    for (let i = 0; i < this.data.tabIndex.length; i++) {
      arr.push(this.data.listx.specData[i].minData[this.data.tabIndex[i]].sms_id)
    }
    // console.log(spec)
    wx.request({
      data: {
        id: id,
        spec: arr.join(','),
        mpid:app.data.mpid
      },
      url: app.data.http_text+'.mobtop.com.cn/index.php?s=/Miniapp/Index/getShopCombo',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        console.log()
        that.setData({
          shop_price: Number(res.data.data.price),
          shop_stock: Number(res.data.data.ssc_stock)
        })
      
      }
    })
  },





  // 商品详情数量
  bindMinus: function () {
    var num = this.data.num;
    // 如果大于1时，才可以减  
    if (num > 1) {
      num--;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },

  /* 点击加号 */
  bindPlus: function () {
    var num = this.data.num;
    // 不作过多考虑自增1  
    num++;
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num < 1 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },




  /* 输入框事件  数量 */
  bindManual: function (e) {
    var num = e.detail.value;
    // 将数值与状态写回  
    this.setData({
      num: num
    });
  },



  // 选项卡事件
  tabFun: function (e) {
    //获取触发事件组件的dataset属性  
    var _datasetId = e.target.dataset.id;
    // console.log("----" + _datasetId + "----");
    var _obj = {};
    _obj.curHdIndex = _datasetId;
    _obj.curBdIndex = _datasetId;
    this.setData({
      tabArr: _obj,
      type: _datasetId
    });
    var that = this;
    if (_datasetId == 1) {
      // 规格参数
      wx.request({
        url: app.data.http_text+'.mobtop.com.cn/index.php?s=/Miniapp/Index/getPropertyApi/id/' + this.data.listx.sg_id,
        method: 'GET',
        success: function (res) {
          var data = res.data;
          that.setData({
            getSpe: data,
            showType: data.type,
            mpid:app.data.mpid
          });
          if (that.data.showType == 2) {
            //转译的文本进行赋值
            var spexhtml = data.data.replace(/src=\"/g, 'src="' + app.data.http_text+".mobtop.com.cn");
            
            // 转译wx.Parse
            WxParse.wxParse('spexhtml', 'html', spexhtml, that, 5);
          }
        },
        fail: function () {
          console.log('接口调用失败');
        }
      })
    }
  },
  tabFun2: function (e) {
    var dataId = e.target.dataset.id;
    console.log(dataId);
    var obj = {};
    let actCarts, hasList;
    obj.curBfIndex = dataId;
    obj.curAfIndex = dataId;
    switch (dataId) {
      case "0":
        actCarts = this.data.allcarts;
        break;
      case "1":
        actCarts = this.data.godcarts;
        break;
      case "2":
        actCarts = this.data.midcarts;
        break;
      case "3":
        actCarts = this.data.badcarts;
        break;
    }
    if (actCarts.length == 0) {
      hasList = false
    } else {
      hasList = true
    }
    console.log(actCarts)
    this.setData({
      tabArr2: obj,
      carts: actCarts,
      hasList
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

  // 本地储存

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getInfo: function () {
    if (this.data.listx.dan_status == "1") {
      var arr = [""];
    } else {
      var arr = [];
      for (let i = 0; i < this.data.tabIndex.length; i++) {
        arr.push(this.data.listx.specData[i].minData[this.data.tabIndex[i]].sms_id)
      }
      console.log(arr);
    }
    if (this.data.listx.dan_status == "1"){
      var orderarr = [{
        sg_id: this.data.listx.sg_id,
        spec_str:"",
        num: this.data.num
      }];
    }else{
      var orderarr = [{
        sg_id: this.data.listx.sg_id,
        spec_str: arr.join(),
        num: this.data.num
      }];
    }
    wx.request({
      data: { data: JSON.stringify(orderarr)},
      url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Miniapp/Index/go_buy_info&token=' + wx.getStorageSync('unionId')+"&mpid="+app.data.mpid,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        console.log(res);
        if(res.data.code == 200){
          wx.navigateTo({
            url: '../confirmOrder/confirmOrder?data=' + JSON.stringify(res.data.data) + "&type=1"
          })
        }else{
          wx.showToast({
            title: res.data.msg[0].msg,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })



    // var buy_price = this.data.shop_price
    // if (buy_price.length == 0) {
    //   wx.showToast({
    //     title: '请选择规格',
    //     icon: 'fall',
    //     duration: 1000
    //   })
    // } else {
    //   var mycars = new Array(3)
    //   mycars[0] = this.data.listx.sg_id
    //   mycars[1] = this.data.num
    //   mycars[2] = this.data.shop_price
    //   mycars[3] = JSON.stringify(this.data.tabIndex)
    //   wx.navigateTo({
    //     url: '../confirmOrder/confirmOrder?data=' + mycars
    //   })
    // }


  },



  //点击商品评价
  evaluation: function () {
    var that = this;
    // console.log(1);
    wx.request({
      url: app.data.http_text+'.mobtop.com.cn/index.php?s=/Miniapp/Index/getShopComment/sg_id/' + this.data.listx.sg_id,
      method: 'GET',
      data:{
        mpid:app.data.mpid,
        openid: wx.getStorageSync('unionId')
      },
      success: function (res) {
        // console.log(2);
        console.log(res);
        // 设置字段
        var star = that.data.starRating;
        var carts = res.data.data.data;
        let godcarts = [];
        let midcarts = [];
        let badcarts = [];
        let hasList;
        for (var i = 0; i < carts.length; i++) {
          let pushStar = [];
          if (carts[i].sgc_status == 1) {
            godcarts.push(carts[i])
          } else if (carts[i].sgc_status == 2) {
            midcarts.push(carts[i])
          } else {
            badcarts.push(carts[i])
          }
          var str = "carts[" + i + "].nums"
          var starNum = carts[i].sgc_star;
          for (var j = 0; j < 5; j++) {
            if (j < starNum) {
              pushStar.push({ 'src': star.zheng });
            } else {
              pushStar.push({ 'src': star.ling });
            }
          }
          that.setData({
            [str]: pushStar
          })
        console.log(pushStar);
        }
        // console.log(godcarts, midcarts, badcarts)
        if (carts.length != 0) {
          hasList = true
        }
        that.setData({
          carts,
          godcarts,
          midcarts,
          badcarts,
          hasList,
          allcarts: carts
        })

      },

      fail: function () {
        console.log("接口调用失败");
      }

    })

  },
  //电话
  tels:function(){
    var that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.link_mobile,
    })
  },

  //点击显示领取优惠券
  lingquan_click:function(){
    this.setData({
      youhui_showhide:true
    })
  },
  //关闭优惠券领取
  lingquan_hide:function(){
    this.setData({
      youhui_showhide: false
    })
  },
  //领取优惠券
  lin_youhui:function(e){
    console.log(e);
    var id = e.currentTarget.dataset.id;
    wx.request({
      url: app.data.http_text + '.mobtop.com.cn/index.php?s=/addon/IdouStore/mobile/couponnumbers',
      method: 'POST',
      data: {
        mpid: app.data.mpid,
        id: id,
        openid: wx.getStorageSync('unionId')
      },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        if (res.data == 1) {
          wx.showToast({
            title: '领取成功',
            icon: 'none',
            duration: 2000,
            success: function () {
            }
          })
        } else {
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
  imgYu: function (event) {
    var src = event.currentTarget.dataset.src;
    var imgList = event.currentTarget.dataset.list;
    wx.previewImage({
      current: src, 
      urls: imgList
    })
  },
})