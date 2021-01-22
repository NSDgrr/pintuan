//app.js
App({
  data:{
    mpid:"16",  // 609
    http_text:"https://visa", // vsp
  },
  // 将获取到的unionId.openId设置为全局变量
  globalData: {
    userInfo: {},
    unionId: '',
    openId: ''
  },
  
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
  },

  // 支付方式封装
  pay: function (_payInfo, success, fail) {
    var payInfo = {
      body: '',
      total_fee: 0,
      order_sn: ''
    }
    Object.assign(payInfo, _payInfo);
    if (payInfo.body.length == 0) {
      wx.showToast({
        title: '支付信息描述错误'
      })
      return false;
    }
    if (payInfo.total_fee == 0) {
      wx.showToast({
        title: '支付金额不能为0'
      })
      return false;
    }
    if (payInfo.order_sn.length == 0) {
      wx.showToast({
        title: '订单号不能为空'
      })
      return false;
    }
      var This = this;
    
    // 传入参数
    This.getOpenid(function (openid) {
      payInfo.openid = openid;
      This.request({
        url: 'api/pay/prepay',
        data: payInfo,
        success: function (res) {
          var data = res.data;
          console.log(data);
          if (!data.status) {
            wx.showToast({
              title: data['errmsg']
            })
            return false;
          }
          This.request({
            url: 'api/pay/pay',
            data: { prepay_id: data.data.data.prepay_id },
            success: function (_payResult) {
              var payResult = _payResult.data;
              console.log(payResult);
              wx.requestPayment({
                'timeStamp': payResult.timeStamp.toString(),
                'nonceStr': payResult.nonceStr,
                'package': payResult.package,
                'signType': payResult.signType,
                'paySign': payResult.paySign,
                'success': function (succ) {
                  success && success(succ);
                },
                'fail': function (err) {
                  fail && fail(err);
                },
                'complete': function (comp) {

                }
              })
            }
          })
        }
      })
    })
  },

  // 获取appunionId  unionId
  getUserInfo: function (cb) {
    var that = this;
    //
    var unionId = wx.getStorageSync('unionId');
    var openId = wx.getStorageSync('openId');
    var avatarUrl = wx.getStorageSync('avatarUrl');
    var nickName = wx.getStorageSync('nickName')


    console.log('unionId:' + unionId);

    if (unionId) {
      wx.getUserInfo({
        success: function (res) {
          console.log(res.userInfo.nickName);
          wx.setStorageSync('nickName', res.userInfo.nickName);
          wx.setStorageSync('avatarUrl', res.userInfo.avatarUrl);
          
          // that.globalData.userInfo = res.userInfo
          //全局
          // that.globalData.unionId = wx.getStorageSync('unionId')
          // that.globalData.openId = wx.getStorageSync('openId')

          // that.globalData.avatarUrl = wx.getStorageSync('avatarUrl')
          // that.globalData.nickName = wx.getStorageSync('nickName')
        },
        fail: function () {
          console.log("获取失败！")
        },
        complete: function () {
          console.log("获取用户信息完成！")
        }
      })
    } else {
      wx.login({
        success: function (r) {
          console.log(r);
          var code = r.code;//登录凭证
          if (code) {
            //2、调用获取用户信息接口
            wx.request({
              url: that.data.http_text + '.mobtop.com.cn/index.php?s=/Api/VisaApi/getOpenid',
              data: {
                code: code,
                mpid: that.data.mpid
              },
              method: 'GET',
              success: function (res) {
                // console.log({ encryptedData: res.encryptedData, iv: res.iv, code: code })
                //3.解密用户信息 获取unionId
                wx.request({
                  url: 'https://visa.mobtop.com.cn/index.php?s=/Miniapp/Index/authorizationUnionid',
                  //自己的服务接口地址
                  method: 'post',
                  header: {
                    'content-type': 'application/x-www-form-urlencoded'
                  },
                  data: { encryptedData: res.encryptedData, iv: res.iv, code: code },
                  success: function (res) {
                    //4.解密成功后 获取自己服务器返回的结果
                    if (res.data.code == 200) {
                      console.log(res)
                      var userInfo_ = res.data.data;
                      console.log(res.c);
                    //保存用户名跟头像信息
                      //   that.setData({
                      // 	nickName: userInfo_.nickName,
                      // 	avatarUrl: userInfo_.avatarUrl,
                      // })                      
                      wx.setStorageSync('openId',
                        // "oJIv50Ad423cJlwICLJDLA2rtvhk"
                       userInfo_.openId
                       );
                      wx.setStorageSync('unionId', 
                        // "oJ0O50eTjDg9ThF67EepBSC-yKgE"
                      userInfo_.unionId
                      );
                   
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
              }, fail: function () {
                wx.showModal({
                  title: '警告通知',
                  content: '您点击了拒绝授权,将无法正常显示个人信息,点击确定重新获取授权。',
                  success: function (res) {
                    if (res.confirm) {
                      wx.openSetting({
                        success: (res) => {
                          if (res.authSetting["scope.userInfo"]) {//如果用户重新同意了授权登录
                            wx.login({
                              success: function (res_login) {
                                if (res_login.code) {
                                  wx.getUserInfo({
                                    withCredentials: true,
                                    success: function (res_user) {
                                      wx.request({
                                        url: 'https://visa.mobtop.com.cn/index.php?s=/Miniapp/Index/authorizationUnionid',
                                        //自己的服务接口地址
                                        method: 'post',
                                        header: {
                                          'content-type': 'application/x-www-form-urlencoded'
                                        },
                                        data: { encryptedData: res_user.encryptedData, iv: res_user.iv, code: res_login.code },
                                        success: function (res) {
                                          //4.解密成功后 获取自己服务器返回的结果
                                          if (res.data.code == 200) {
                                            var userInfo_ = res.data.data;
                                            // that.setData({
                                            //nickName: userInfo_.nickName,
                                            //avatarUrl: userInfo_.avatarUrl,
                                            //})
                                            wx.setStorageSync('openId', userInfo_.openId);
                                            wx.setStorageSync('unionId', userInfo_.unionId);
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
                                    }
                                  })
                                }
                              }
                            });
                          }
                        }, fail: function (res) {

                        }
                      })
                    }
                  }
                })
              }
            })
          } else {
            console.log('获取用户登录态失败！' + r.errMsg)
          }
        },
        fail: function () {
          callback(false)
        }
      })
    }
  },

  //获取当前页面路径
  getCurrentPageUrlWithArgs:function(){
    var pages = getCurrentPages() //获取加载的页面
    var currentPage = pages[pages.length - 1] //获取当前页面的对象
    var url = currentPage.route //当前页面url
    var options = currentPage.options //如果要获取url中所带的参数可以查看options

    //拼接url的参数
    var urlWithArgs = url + '?'
    for(var key in options){
      var value = options[key]
      urlWithArgs += key + '=' + value + '&'
    }
    urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)

    return urlWithArgs
  }

})