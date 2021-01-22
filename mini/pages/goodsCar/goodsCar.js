// page/component/new-pages/cart/cart.js

var app = getApp();
var unionId = wx.getStorageSync('unionId')

Page({

  data: {
    // 购物车列表
    carts: [],
    hasList: false,          // 列表是否有数据
    totalPrice: 0,           // 总价，初始为0
    selectAllStatus: true,    // 全选状态，默认全选
    obj: {
      name: ""
    },
  },
  onShow() {
    var that = this;
    wx.request({
      url: app.data.http_text+'.mobtop.com.cn/index.php?s=/Miniapp/Index/getShopCarList',
      method: 'GET',
      data: {
        token: wx.getStorageSync('unionId'),
        mpid:app.data.mpid
      },
      success: function (res) {
        console.log(res);
        let newCarts = res.data.data.map(function (item) {
          //先默认设置每个商品数量均为1
          item.num = 1;
          item.selected = true;
          item.sg_img_url = item.sg_img_url.split(',');
          return item
        });
        console.log(typeof (newCarts))

        that.setData({
          hasList: true,
          carts: newCarts
        });
        that.getTotalPrice();
      }
    })
    // 
    

  },
  onLoad: function () {
    var that = this;
    that.getShopCar();
  },
  getShopCar: function () {
    var that = this;
    wx.request({
      url: app.data.http_text+'.mobtop.com.cn/index.php?s=/Miniapp/Index/test',
      method: 'GET',
      data:{
        mpid:app.data.mpid
      },
      success: function (res) {
        var data = res.data.data;
        that.setData({
          list: data
        })
      },
      fail: function () {
        console.log("接口调用失败");
      }
    });
  },
  /**
   * 当前商品选中事件
   */

  selectList(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    const selected = carts[index].selected;
    carts[index].selected = !selected;
    this.setData({
      carts: carts
    });
    console.log(selected);
    this.getTotalPrice();
  },

  /**
   * 删除购物车当前商品
   */
  deleteList(e) {
    var that = this;
    const index = e.currentTarget.dataset.index;
    let carts = that.data.carts;
    console.log(that.data.carts)
    wx.showModal({
      title: '确认移除此商品？',
      confirmColor: '#b2282e',
      success: (res) => {
        if (res.confirm) {
          wx.request({
            url: app.data.http_text+'.mobtop.com.cn/index.php?s=/Miniapp/Index/shopCarDel&token=' + wx.getStorageSync('unionId'),
            method: 'post',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
              "id": parseInt(that.data.carts[index].car_id),
              mpid:app.data.mpid
            },
            success: function (res) {
              console.log(res);
              carts.splice(index, 1);
              that.setData({
                carts: carts
              });
              if (!carts.length) {
                that.setData({
                  hasList: false
                });
              } else {
                console.log("重新计算总价");
                that.getTotalPrice();
              }
            }
          })
        } else if (res.cancel) {

        }
      }
    })

  },

  /**
   * 购物车全选事件
   */
  selectAll(e) {
    let selectAllStatus = this.data.selectAllStatus;
    selectAllStatus = !selectAllStatus;
    let carts = this.data.carts;

    for (let i = 0; i < carts.length; i++) {
      carts[i].selected = selectAllStatus;
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      carts: carts
    });
    this.getTotalPrice();
  },


  /**
   * 绑定加数量事件
   */
  addCount(e) {
    let that = this;
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    let num = carts[index].car_num;
    num = Number(num) + 1;
    carts[index].car_num = num;
    wx.request({
      url: app.data.http_text+'.mobtop.com.cn/index.php?s=/Miniapp/Index/shopChangeCarnum&token=' + wx.getStorageSync('unionId'),
      method: 'get',
      data: {
        cid: carts[index].car_id,
        s_num: num,
        mpid:app.data.mpid
      },
      success: function (res) {

        console.log(res)
        that.setData({
          carts: carts
        });
      }
    })
    this.getTotalPrice();
  },

  /**
   * 绑定减数量事件
   */
  minusCount(e) {
    let that = this;
    const index = e.currentTarget.dataset.index;
    const obj = e.currentTarget.dataset.obj;
    let carts = this.data.carts;
    console.log(carts)
    let num = carts[index].car_num;
    if (num <= 1) {
      return false;
    }
    num = num - 1;
    carts[index].car_num = num;
    console.log(carts[index].car_id)
    this.getTotalPrice();
    wx.request({
      url: app.data.http_text+'.mobtop.com.cn/index.php?s=/Miniapp/Index/shopChangeCarnum&token=' + wx.getStorageSync('unionId'),
      method: 'get',
      data: {
        cid: carts[index].car_id,
        s_num: num,
        mpid:app.data.mpid
      },
      success: function (res) {

        console.log(res)
        that.setData({
          carts: carts
        });
      }
    })
  },

  /**
   * 计算总价
   */
  getTotalPrice() {
    // 获取购物车列表
    let total = 0;
    let carts = this.data.carts;
    console.log(carts)
    // 循环列表得到每个数据
    for (let i = 0; i < carts.length; i++) {
      // 判断选中才会计算价格
      if (carts[i].selected) {
        // 所有价格加起来
        total += carts[i].car_num * carts[i].car_price;
      }
    }
    // 最后赋值到data中渲染到页面
    this.setData({
      carts: carts,
      totalPrice: total.toFixed(2)
    });
  },
  onLoad: function () {
    console.log()
  },
  getInfo: function () {
    console.log(this.data.carts);
    var orderarr = [];
    var carIdStr = [];
    for (var i = 0; i < this.data.carts.length;i++){
      if (this.data.carts[i].selected){
        orderarr.push({
          sg_id: this.data.carts[i].car_sg_id,
          spec_str: this.data.carts[i].car_spec_id ? this.data.carts[i].car_spec_id:"",
          num: this.data.carts[i].car_num
        })
        carIdStr.push(this.data.carts[i].car_id);
      }
    }
    if (orderarr.length == 0){
      wx.showToast({
        title: "无可支付商品",
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    wx.request({
      data: { data: JSON.stringify(orderarr) },
      url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Miniapp/Index/go_buy_info&token=' + wx.getStorageSync('unionId'),
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        console.log(res);
        if (res.data.code == 200) {
          wx.navigateTo({
            url: '../confirmOrder/confirmOrder?data=' + JSON.stringify(res.data.data) + "&type=2" + "&carIdStr=" + carIdStr.join()
          })
        } else {
          for (var i in res.data.msg){
            wx.showToast({
              title: res.data.msg[i].mes,
              icon: 'none',
              duration: 2000
            })
            break;
          }
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
  

})