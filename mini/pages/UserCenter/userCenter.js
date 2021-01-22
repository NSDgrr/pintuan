// userCenter.js
// 获取本地存储
var app = getApp();
var sha1 = require('../../utils/sha1.js');
Page({
  /**
   * 页面的初始数据
   */
  toOrder: function () {
    wx.switchTab({
      url: '../order/order',
    })
  },
  toOrder_item: function (e) {
    console.log(e);
    var index = e.currentTarget.dataset.index;
    app.data.order_index = index;
    console.log(app.data);
    wx.switchTab({
      url: '../order/order',
    })
  },
  data: {
    nickName: "",
    avatarUrl: "",
    lingflg:false,
    carnum:"",
    flg:"",
    ling:true
    
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    this.listflg();
    var that = this;
    var nickName = wx.getStorageSync('nickName')
    var avatarUrl = wx.getStorageSync('avatarUrl')
    var unionId = wx.getStorageSync('unionId')
    that.setData({
      nickName: nickName,
      avatarUrl: avatarUrl
    })
    //查询会员
    wx.request({
      url: app.data.http_text +'.mobtop.com.cn/index.php?s=/Api/ShopApi/show_get_vipcard',
      method: 'GET',
      data: {
        openid: unionId,
        mpid:app.data.mpid
      },
      success: function (res) {
        console.log(res);
        if (res.data.state == 0){
          that.setData({
            lingflg:false
          })
        }else{
          that.setData({
            lingflg: true,
            carnum: res.data.data[0],
            // code: res.data.data[1]
          })
        }
      }
    });
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
  getPerson:function(res){
    console.log(res);
    var that = this;
    //获取或用openid和会话密钥
    wx.login({
      success: function (r) {
        console.log(r);
        var code = r.code;//登录凭证
        wx.request({
          url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Api/VisaApi/getIdoustoreOpenid',
          data: {
            code: code,
            mpid: app.data.mpid
          },
          method: 'GET',
          success: function (msg) {
            console.log(msg);
            that.unionId_fun(msg.data.session_key, res);
          }
        })
      }
    })
    
    //调用应用实例的方法获取全局数据
    // app.getUserInfo(function (userInfo) {
    //   //console.log(userInfo);
    //   //更新数据
    //   that.setData({
    //     userInfo: userInfo
    //   })
    // });
  },
  //获取用户unionId
  unionId_fun: function (session_key, getname){
    var that = this;
    wx.request({
      url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Miniapp/Index/authorizationUnionid',
      //自己的服务接口地址
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: { encryptedData: getname.detail.encryptedData, iv: getname.detail.iv, session_key: session_key },
      success: function (res) {
        //4.解密成功后 获取自己服务器返回的结果
        if (res.data.code == 200) {
          console.log(res)
          var userInfo_ = res.data.data;
          console.log(res.c);
          //保存用户名跟头像信息
          that.setData({
            nickName: userInfo_.nickName,
            avatarUrl: userInfo_.avatarUrl,
          })                      
          wx.setStorageSync('openId',
            userInfo_.openId
          );
          wx.setStorageSync('unionId',
            userInfo_.openId
          );
          wx.setStorageSync('nickName',
            userInfo_.nickName
          );
          wx.setStorageSync('avatarUrl',
            userInfo_.avatarUrl
          );
          that.usernamefun(userInfo_);
          wx.showToast({
            title: res.data.msg,
            icon: 'success',
            duration: 1500
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1500
          })
        }
      },
      fail: function () {
        console.log('系统错误')
      }
    })
  },
  getAddress: function () {
    var url = app.getCurrentPageUrlWithArgs();
    app.data.address_url = url;
  },
  //获取信息
  usernamefun:function(data){
    var that = this;
    var formdata = {
      openid: data.openId,
      unionid: '',
      nickname: data.nickName,
      head_img: data.avatarUrl,
    }
    wx.request({
      url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Api/ShopApi/save_xcx_uinfo&mpid=' + app.data.mpid,
      method: 'POST',
      data: {
        formdata: JSON.stringify(formdata),
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res.data);
      },
    })
  },
  

  //领取会员卡
  lingclick:function(){
    var that = this;
    wx.request({
      url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Api/ShopApi/member_card_wx',
      method:'GET',
      data:{
        mpid: app.data.mpid
      },
      success:function(res){
        console.log(res)
        if (res.data.member_card_wx == 2){
          var id = that.data.carnum.cardid;
          var code = that.data.carnum.code;
          that.callbackcarTwo(id, code)
          console.log(id, code)
        }else{
          // var that = this;
          wx.request({
            url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Api/ShopApi/get_ticket_info',
            method: 'GET',
            data: {
              mpid: app.data.mpid
            },
            success: function (res) {
              // console.log(res)
              var id = that.data.carnum.cardid;
              var code = that.data.carnum.code;
              var time = that.timestampStr();
              var str = that.randomString();
              var arrslgna = [time, code, str, res.data, id];
              var sortarr = that.sort(arrslgna);
              var slgna = '';
              for (var i = 0; i < sortarr.length; i++) {
                slgna += sortarr[i];
              }
              var signature = sha1(slgna);
              // console.log(arrslgna);
              // console.log(signature);
              var cardExt = {
                code: code,
                timestamp: time,
                nonce_str: str,
                signature: signature
              };
              wx.addCard({
                cardList: [{
                  cardId: id,
                  cardExt: JSON.stringify(cardExt)
                }],
                success: function (res) {
                  console.log(res.data);
                  that.callbackcar(res.data, code);
                }
              });
            }
          });
        }
      }
    })
    // var that = this;
    // wx.request({
    //   url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Api/ShopApi/get_ticket_info',
    //   method: 'GET',
    //   data: {
    //     mpid: app.data.mpid
    //   },
    //   success: function (res) {
    //     // console.log(res)
    //     var id = that.data.carnum.cardid;
    //     var code = that.data.carnum.code;
    //     var time = that.timestampStr();
    //     var str = that.randomString();
    //     var arrslgna = [time,code,str,res.data,id];
    //     var sortarr = that.sort(arrslgna);
    //     var slgna = '';
    //     for (var i = 0; i < sortarr.length; i++) {
    //       slgna += sortarr[i];
    //     }
    //     var signature = sha1(slgna);
    //     // console.log(arrslgna);
    //     // console.log(signature);
    //     var cardExt = {
    //       code: code,
    //       timestamp: time,
    //       nonce_str: str,
    //       signature: signature
    //     };
    //     wx.addCard({
    //       cardList: [{
    //         cardId: id,
    //         cardExt: JSON.stringify(cardExt)
    //       }],
    //       success: function (res) {
    //         console.log(res.data);
    //         that.callbackcar(res.data,code);
    //       }
    //     });
    //   }
    // });
  },
  //领取完成回调
  callbackcarTwo: function (cardId, code) {
    console.log(cardId, code)
    var that = this;
    wx.request({
      url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Api/ShopApi/save_get_card',
      method: 'GET',
      data: {
        openid: wx.getStorageSync('unionId'),
        cardid: cardId,
        code: code,
        mpid: app.data.mpid,
      },
      success: function (res) {
        console.log(res);
        if(res.data.state == 1){
          wx.showToast({
            title: '领取成功',
            // icon: 'success',
            // duration: 2000
          })
        }else{
          wx.showToast({
            title: '领取失败',
            // icon: 'success',
            // duration: 2000
          })
        }
        // window.location.reload();
        that.setData({
          ling:false
        })
      }
    });
    // that.setData({
    //   ling:true
    // })
  },
  
    callbackcar: function (res, code){
      // console.log(res,code)
      var that = this;
      wx.request({
        url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Api/ShopApi/save_get_card',
        method: 'GET',
        data: {
          openid: wx.getStorageSync('unionId'),
          cardid: res.cardList[0].cardId,
          code: code,
          mpid: app.data.mpid,
        },
        success: function (res) {
          // console.log(res);
          window.location.reload();
        }
      });
    },
 
  //时间戳
  timestampStr:function(){
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000 + '';
    return timestamp;
  },
  //字符串
  randomString:function(){
    let len = 32
    let $chars =
      'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
    let maxPos = $chars.length
    let pwd = ''
    for (let i = 0; i < len; i++) {
      pwd += $chars.charAt(Math.floor(Math.random() * maxPos))
    }
    return pwd
  },
  //字典排序
  sort:function(arr){
    return arr.sort();
  },
  //开关显示
  listflg:function(){
    var that = this;
    wx.request({
      url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Api/ShopApi/get_show_module',
      method: 'GET',
      data: {
        mpid: app.data.mpid,
      },
      success: function (res) {
        that.setData({
          flg:res.data.data
        })
      }
    });
  }
})