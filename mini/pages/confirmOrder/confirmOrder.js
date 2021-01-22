 // pages/comfirmOrder/confirmOrder.js
var comfirmOrder=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nowAddress:{},
    ly_str:"",
    info:"",
    type:"",//1正常下单 2购物车下单
    carIdStr:"",//购物车商品id
    //优惠券显示隐藏
    youhui_showhide:false,
    youhui_list:[],
    youhui_length:0,
    //选中的优惠券
    youhui_id:"",
    youhui_code: "",
    youhui_type:"",
    youhui_pr:0,
    youhui_name:"",
    //协议
    xieyi_check:false,

    btn_flg:true,
    //发票
    fapiaoarr: ["不需要", "需要"],
    fapiaoindex: 0,
    fapiaoleiarr: ["个人", "企业"],
    fapiaoleiindex: 0,
    fa_taitou: "",
    fa_number: "",
    fa_tel: "",
    fa_email:"",

    //拼团
    tuanId:"",
    flag:"",
    delivery:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options,'‘=======options========');
    var options_val = JSON.parse(options.data);
    console.log(options_val);
    var that = this;
    that.setData({
      info: options_val,
      type: options.type,
      carIdStr: options.carIdStr ? options.carIdStr : "",
      tuanId: options.tuan_id,
      flag: options.flag,
      delivery:options.is_delivery,
    })
    console.log(this.data.carIdStr,'‘=======carIdStr========');

    // var options2 = JSON.parse('[' + options.data + ']')
    // var a = parseInt(options2[1])
    // var b = parseInt(options2[2])

    // that.setData({
     
    //   id: options2[0],
    //   price: options2[2],
    //   num: options2[1],
    //   num1: options2[3][0],
    //   num2: options2[3][1],
    //   last_price: a * b
    // })
    // console.log(options2[3][0]);

    wx.request({
      url: comfirmOrder.data.http_text + '.mobtop.com.cn/index.php?s=/Miniapp/Index/getDeliveryAddress',
      method: 'GET',
      data: {
        token: wx.getStorageSync('unionId'),
        mpid: comfirmOrder.data.mpid
      },
      success: function (res) {
        console.log(res.data.data);
        if (res.data.data.length > 0){
          for (var i = 0; i < res.data.data.length;i++) {
            if (res.data.data[i].sa_addr_true == '1'){
              comfirmOrder.nowAddress = res.data.data[i]
              that.setData({
                nowAddress: comfirmOrder.nowAddress,
                fa_tel: comfirmOrder.nowAddress.sa_tel
              })
              console.log(comfirmOrder.nowAddress);
            }
          }
        }
      },
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
    if (comfirmOrder.nowAddress){
      this.setData({
        nowAddress: comfirmOrder.nowAddress,
        fa_tel: comfirmOrder.nowAddress.sa_tel
      })
      console.log(comfirmOrder.nowAddress);
    }else{
      this.setData({
        nowAddress: ""
      })
    }
    var that = this;
    //查询优惠券
    that.chaxunyouhui();

    wx.request({
      url: comfirmOrder.data.http_text + '.mobtop.com.cn/index.php?s=/Api/ShopApi/get_default_agreement',
      method: 'GET',
      data: {
        comform:'store',
        mpid: comfirmOrder.data.mpid
      },
      success: function (res) {
        console.log(res.data.data);
        if(res.data.data == "1"){
          that.setData({
            xieyi_check:true
          })
        }else{
          that.setData({
            xieyi_check: false
          })
        }
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
  inputchange:function(e){
    // var val = e.
    console.log(e);
    // this.setData({
    //   ly_str:
    // })
  },
  payval:function(){
    var that = this;
    
    if (!that.data.nowAddress.sa_id){
      wx.showToast({
        title: '请选择地址',
        icon: 'none',
        duration: 2000,
        success: function () {
        }
      }) 
      return false;
    }
    if (that.data.nowAddress.sa_city.indexOf("北京") == -1) {
      wx.showToast({
        title: '仅限北京地区下单！',
        icon: 'none',
        duration: 2000,
        success: function () {
        }
      })
      return false;
    }
    if (!that.data.xieyi_check){
      wx.showToast({
        title: '请阅读勾选购买协议',
        icon: 'none',
        duration: 2000,
        success: function () {
        }
      })
      return false;
    }
    that.setData({
      btn_flg: false
    })
    var orderarr = [];
    for (var i = 0; i < this.data.info.goods_info.length; i++) {
      orderarr.push({
        sg_id: this.data.info.goods_info[i].sg_id,
        spec_str: this.data.info.goods_info[i].sg_spec,
        num: this.data.info.goods_info[i].num
      })
    }
    // var listInfo = JSON.stringify([{
    //   "sg_id": that.data.info.sg_id,
    //   "sg_img_url": that.data.info.sg_lun[0],
    //   "sg_price": that.data.info.sg_price,
    //   "sg_name": that.data.info.sg_name,
    //   "sg_num": that.data.num,
    //   "sg_spec":"", 
    //   "spec_name":"",
    // }]);
    if (that.data.youhui_name){
      var copon_info = {
        coupon_type: "2",
        coupon_number: that.data.youhui_code,
        sys_coupon: that.data.youhui_type,
        coupon_id: that.data.youhui_id,
      }
    }else{
      var copon_info = "";
    }
    let datas = {
      listType: that.data.type,
      listInfo: JSON.stringify(orderarr),
      userId: that.data.nowAddress.sa_id,
      comment:that.data.ly_str, 
      // allCount: that.data.num,
      userName: that.data.nowAddress.sa_name,
      userPhone: that.data.nowAddress.sa_tel,
      mpid: comfirmOrder.data.mpid,
      carIdStr: that.data.carIdStr,
      copon_info: JSON.stringify(copon_info),
      so_invoice_type: that.data.fapiaoindex == '0' ? '0' : (that.data.fapiaoleiindex == '0'?'1':'2'),
      so_invoice_text: that.data.fa_taitou,
      so_invoice_email: that.data.fa_email,
      so_invoice_tel: that.data.fa_tel,
      so_invoice_numb: that.data.fa_number,
    }
    // if(that.data.flag == 1){//拼团
    //   datas.tuan_id = that.data.tuanId
    //   datas.flag = that.data.flag
    //   datas.is_delivery = that.data.delivery
    // }
    console.log(datas)
    wx.request({
      url: that.data.flag==1 ? comfirmOrder.data.http_text + '.mobtop.com.cn/index.php?s=/Miniapp/Index/createShopOrder&token=' + wx.getStorageSync('unionId') + "&mpid=" + comfirmOrder.data.mpid+'&tuan_id='+that.data.tuanId+'&flag=1&is_delivery='+that.data.delivery : comfirmOrder.data.http_text + '.mobtop.com.cn/index.php?s=/Miniapp/Index/createShopOrder&token=' + wx.getStorageSync('unionId') + "&mpid=" + comfirmOrder.data.mpid,
      method: 'POST',
      data: datas,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          btn_flg: true
        })
        console.log(res.data);
        if (res.data.code == 200){
          wx.navigateTo({
            url: '../confirmPay/confirmPay?data=' + that.data.info.last_money + "&order_no=" + res.data.order_no + "&type=" + that.data.type + "&orderid=" + res.data.orderid,
          })
        }else{
          console.log('[res]',res)
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000,
            success: function () {
            }
          })
        }
      },
      fail:function(err){
        console.log(err,"[error]")
        wx.showToast({
          title: "订单异常",
          icon: 'none',
          duration: 2000,
          success: function () {
          }
        })
      }
    })
  },
  getAddress:function(){
    var url = comfirmOrder.getCurrentPageUrlWithArgs();
    comfirmOrder.data.address_url = url;
    console.log(comfirmOrder.data);
    wx.navigateTo({
      url: '../getAddress/getAddress?carIdStr='+this.data.carIdStr
  })
  },
  //点击显示优惠券
  lingquan_click:function(){
    this.setData({
      youhui_showhide:true
    })
  },
  //关闭优惠券
  lingqu_hide:function(){
    this.setData({
      youhui_showhide: false
    })
  },
  //查询优惠券
  chaxunyouhui:function(){
    var that = this;
    var shopArr = [];
    for (var i in that.data.info.goods_info) {
      if (that.data.info.goods_info[i].ssc_id) {
        shopArr.push({
          sg_id: that.data.info.goods_info[i].sg_id,
          num: that.data.info.goods_info[i].num,
          ssc_id: that.data.info.goods_info[i].ssc_id,
        })
      } else {
        shopArr.push({
          sg_id: that.data.info.goods_info[i].sg_id,
          num: that.data.info.goods_info[i].num,
          ssc_id: that.data.info.goods_info[i].sg_spec,
        })
      }
    }
    wx.request({
      url: comfirmOrder.data.http_text + '.mobtop.com.cn/index.php?s=/Api/ShopApi/couponinfo&mpid=' + comfirmOrder.data.mpid,
      method: 'POST',
      data: {
        sg_id: JSON.stringify(shopArr),
        comform: '1',
        openid: wx.getStorageSync('unionId'),
        unionid: ""
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.length > 0) {
          var num = 0;
          for (var i in res.data){
            if (res.data[i].codename || res.data[i].coupon_type != "1"){
              num++
            }
          }
          that.setData({
            youhui_list: res.data,
            youhui_length: num
          })
        }
      },
      fail: function () {
        console.log("接口调用失败");
      }
    });
  },
  //领取优惠券
  lin_youhui: function (e) {
    console.log(e);
    var that = this;
    var id = e.currentTarget.dataset.id;
    wx.request({
      url: comfirmOrder.data.http_text + '.mobtop.com.cn/index.php?s=/addon/IdouStore/mobile/couponnumbers',
      method: 'POST',
      data: {
        mpid: comfirmOrder.data.mpid,
        openid: wx.getStorageSync('unionId'),
        id: id
      }, 
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data == 1) {
          wx.showToast({
            title: '领取成功',
            icon: 'none',
            duration: 2000,
            success: function () {
              
            }
          })
          that.chaxunyouhui();
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
  //点击使用
  clickshiyong:function(e){
    var that = this;
    var id = e.currentTarget.dataset.id;
    var code = e.currentTarget.dataset.code;
    var type = e.currentTarget.dataset.type;
    for (var i in that.data.youhui_list){
      if (that.data.youhui_list[i].id == id){
        if (that.data.youhui_list[i].flg){
          that.data.youhui_list[i].flg = false;
          id = "";
          code = "";
          type = "";
          that.data.youhui_name = "";
        }else{
          that.data.youhui_list[i].flg = true;
          that.data.youhui_name = that.data.youhui_list[i].name
        }
      }else{
        that.data.youhui_list[i].flg = false;
      }
    }
    that.setData({
      youhui_id: id,
      youhui_code: code,
      youhui_list: that.data.youhui_list,
      youhui_showhide:false,
      youhui_name: that.data.youhui_name,
      youhui_type: type,
    })

    var shopdata=[];
    for (var i in that.data.info.goods_info){
      shopdata.push({
        sg_id: that.data.info.goods_info[i].sg_id,
        spec_str: that.data.info.goods_info[i].sg_spec,
        num: that.data.info.goods_info[i].sg_num,
      })
    }
    var copon_info = {
      coupon_type:"2",
      coupon_number: code,
      sys_coupon: type,
      coupon_id: id,
    }
    
    wx.request({
      url: comfirmOrder.data.http_text + '.mobtop.com.cn/index.php?s=/Miniapp/Index/go_buy_info&token=' + wx.getStorageSync('unionId') + '&mpid=' + comfirmOrder.data.mpid,
      method: 'POST',
      data: {
        data: JSON.stringify(shopdata),
        copon_info: JSON.stringify(copon_info)
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
       console.log(res);
       that.setData({
         youhui_pr: res.data.data.coupon_money,
         info: res.data.data,
       })
      },
      fail: function () {
        console.log("接口调用失败");
      }
    });
  },
  //协议、
  checkboxChange:function(e){
    if (e.detail.value.length > 0){
      this.setData({
        xieyi_check: true
      })
    }else{
      this.setData({
        xieyi_check:false
      })
    }
  },
  //发票信息
  bindfapiao:function(e){
    this.setData({
      fapiaoindex:e.detail.value
    })
  },
  bindfapiaotype: function (e) {
    this.setData({
      fapiaoleiindex: e.detail.value
    })
  },
  taitouchange: function (e) {
    if (e.currentTarget.dataset.flg == 'taitou'){
      this.setData({
        fa_taitou: e.detail.value
      })
    }
    if (e.currentTarget.dataset.flg == 'shibie') {
      this.setData({
        fa_number: e.detail.value
      })
      
    }
    if (e.currentTarget.dataset.flg == 'tel') {
      this.setData({
        fa_tel: e.detail.value
      })
    }
    if (e.currentTarget.dataset.flg == 'email') {
      this.setData({
        fa_email: e.detail.value
      })
    }
  },
})