// pages/getAddress/getAddress.js
var unionId = wx.getStorageSync('unionId');
var getAddress = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    carts: [],
    carIdStr:"",//购物车商品id
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log(options,options.carIdStr,'---carIdStr:"",//购物车商品id-----')
    that.setData({
      carIdStr: options.carIdStr ? options.carIdStr : "",
    })
    
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    wx.request({
      url: getAddress.data.http_text+'.mobtop.com.cn/index.php?s=/Miniapp/Index/getDeliveryAddress',
      method: 'GET',
      data: {
        token: wx.getStorageSync('unionId'),
        mpid: getAddress.data.mpid
      },
      success: function (res) {
        console.log(res.data.data);
        var data = res.data.data
        that.setData({
          carts: data
        });
      },
    })
    // carts[0].
    // this.onLoad();
  },
  selectList:function(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    var that = this;
    wx.request({
      url: getAddress.data.http_text + '.mobtop.com.cn/index.php?s=/Miniapp/Index/setDefaultAddress&token=' + wx.getStorageSync('unionId'),
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      data: {
        token: unionId,
        sa_id: carts[index].sa_id,
        sa_addr_true: carts[index].sa_addr_true,
        mpid: getAddress.data.mpid
      },
      success: function (res) {
        if (res.data.code == 200) {

        }
        for (var i in carts) {
          carts[i].sa_addr_true = 0;
        }
        carts[index].sa_addr_true = 1;

        that.setData({
          carts: carts
        });
        getAddress.nowAddress = carts[index];
        console.log(getAddress.data.address_url);
        if (getAddress.data.address_url.indexOf("UserCenter") > -1){
          wx.switchTab({
            url: "../../" + getAddress.data.address_url
          })
        }else{
          wx.redirectTo({
            url: "../../" + getAddress.data.address_url
          })
        }
        
       
      },
    })

    console.log(carts[index].sa_id);
    
  },
  deleteList:function(e) {
    let that = this;
    var id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认删除此条地址吗？',
      confirmColor: '#b2282e',
      success: (res) => {
        if (res.confirm) {
          wx.request({
            url: getAddress.data.http_text+'.mobtop.com.cn/index.php?s=/Miniapp/Index/delDeliveryAddress',
            method: 'GET',
            data: {
              token: wx.getStorageSync('unionId'),
              mpid: getAddress.data.mpid,
              sa_id: id
            },
            header: {
              "content-type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
              if (res.data.code == '200'){
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 2000,
                  success:function(){
                    that.addlist();
                  }
                })
                
              }else{
                wx.showToast({
                  title: '删除失败',
                  icon: 'success',
                  duration: 2000
                })
              }
            },
          })
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  },
  addlist:function(){
    var that = this;
    wx.request({
      url: getAddress.data.http_text + '.mobtop.com.cn/index.php?s=/Miniapp/Index/getDeliveryAddress',
      method: 'GET',
      data: {
        token: wx.getStorageSync('unionId'),
        mpid: getAddress.data.mpid
      },
      success: function (res) {
        console.log(res.data.data);
        var data = res.data.data
        that.setData({
          carts: data
        });
      },
    })
  },
  addressDetailsM:function(e) {
    console.log(e.currentTarget.dataset.addressdetails);
    getAddress.addressdetails = e.currentTarget.dataset.addressdetails;
    getAddress.editType = e.currentTarget.dataset.edittype;
  },
  addAddress:function(e) {
    getAddress.editType = e.currentTarget.dataset.edittype;
    wx.navigateTo({
      url: "../editAddress/editAddress?editType=1&carIdStr="+this.data.carIdStr
    })
    // url="../editAddress/editAddress?editType=1" 
  },
  


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
})