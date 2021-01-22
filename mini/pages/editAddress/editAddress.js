// pages/editAddress/editAddress.js
var editAddress = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: ['请选择', '请选择', '请选择'],
    addressDetails: {
      sa_name: '',
      sa_tel: '',
      sa_province: '',
      sa_city: '',
      sa_area: '',
      area: '',
      address: '',
      sa_postcode: '',
      sa_addr_true: '0',
      sa_detail_addr: '',
      sa_id: '',

      carIdStr:"",//购物车商品id
    },
  },
   /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    console.log(options,'---carIdStr---')
    //
    if(options.carIdStr){
      this.setData({
        carIdStr: options.carIdStr ? options.carIdStr : "",
      })
    }
    //新增地址重置数据
    if (options.editType == 1) {
      region = ['请选择', '请选择', '请选择'];
      editAddress.addressdetails = {}
      // editAddress.addressdetails.sa_name = "";
      // editAddress.addressdetails.sa_postcode = "";
      // editAddress.addressdetails.sa_tel = "";
      // editAddress.addressdetails.sa_addr_true = "1";
      // editAddress.addressdetails.sa_area = "";
      // editAddress.addressdetails.sa_detail_addr = "";
    }else{
      var region = [];
      region.push(editAddress.addressdetails.sa_province)
      region.push(editAddress.addressdetails.sa_city)
      region.push(editAddress.addressdetails.sa_area)
    }
    
    this.setData({
      region: region,
      addressDetails: editAddress.addressdetails
    })

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },
  bindRegionChange:function(e) {
    this.setData({
      region: e.detail.value,
      'addressDetails.sa_province': e.detail.value[0],
      'addressDetails.sa_city': e.detail.value[1],
      'addressDetails.sa_area': e.detail.value[2]
    })

  },
  inputDataChenge:function(e) {
    let value = e.detail.value;
    let item = 'addressDetails.' + e.target.dataset.item;
    if (e.target.dataset.item == 'sa_tel'){
      var telze = /^1[3456789]\d{9}$/;
      if (!telze.test(value)){
        wx.showToast({
          title: '请输入正确手机号格式',
          icon: 'none',
          duration: 1500,
        })
        this.setData({
          [item]: ""
        })
        return ;
      }
    }
    if (e.target.dataset.item == 'sa_postcode') {
      var emailze = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if (!emailze.test(value)) {
        wx.showToast({
          title: '请输入正确电子邮箱格式',
          icon: 'none',
          duration: 1500,
        })
        this.setData({
          [item]: ""
        })
        return ;
      }
    }
    this.setData({
      [item]: value
    })
  },
  saveAddress:function() {
    if (this.data.addressDetails.sa_tel){
      var telze = /^1[3456789]\d{9}$/;
      if (!telze.test(this.data.addressDetails.sa_tel)) {
        wx.showToast({
          title: '请输入正确手机号格式',
          icon: 'none',
          duration: 1500,
        })
        return;
      }
    }
    // if (this.data.addressDetails.sa_postcode) {
    //   var emailze = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    //   if (!emailze.test(this.data.addressDetails.sa_postcode)) {
    //     wx.showToast({
    //       title: '请输入正确电子邮箱格式',
    //       icon: 'none',
    //       duration: 1500,
    //     })
    //     return;
    //   }
    // }
    let datas = {
      sa_id: this.data.addressDetails.sa_id,
      sa_name: this.data.addressDetails.sa_name,
      sa_tel: this.data.addressDetails.sa_tel,
      sa_province: this.data.addressDetails.sa_province,
      sa_city: this.data.addressDetails.sa_city,
      sa_area: this.data.addressDetails.sa_area,
      area: this.data.addressDetails.area ? this.data.addressDetails.area : this.data.addressDetails.sa_detail_addr,
      address: this.data.addressDetails.sa_province + "-" + this.data.addressDetails.sa_city + "-" + this.data.addressDetails.sa_area + "-" + (this.data.addressDetails.area ? this.data.addressDetails.area : this.data.addressDetails.sa_detail_addr),
      postcode: this.data.addressDetails.sa_postcode,
      sa_addr_true: this.data.addressDetails.sa_addr_true,
      mpid: editAddress.data.mpid,
    };
    wx.showLoading({
      title: '加载中',
    })
    if (editAddress.editType == 1) {
      this.saveAdd(datas);
    } else {
      this.saveEidt(datas)
    }

  },
  saveEidt:function(datas) {
    wx.request({
      url: editAddress.data.http_text + '.mobtop.com.cn/index.php?s=/Miniapp/Index/editDeliveryAddress&token=' + wx.getStorageSync('unionId'),
      method: 'post',
      data: datas,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res.data)
        wx.hideLoading()
        if(res.data.code == "200"){
          // wx.navigateTo({
          //   url:"../getAddress/getAddress"
          // })
          wx.navigateBack({
            delta: 1
          })
        }
      }
    })
  },
  saveAdd:function(datas) {
    let that= this;
    wx.request({
      url: editAddress.data.http_text + '.mobtop.com.cn/index.php?s=/Miniapp/Index/addDeliveryAddress&token=' + wx.getStorageSync('unionId'),
      method: 'post',
      data: datas,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res.data);
        wx.hideLoading();
        var pages = getCurrentPages();
        if (pages[pages.length - 3].route.indexOf("confirmOrder") > -1){
          console.log();
          var url = '../confirmOrder/confirmOrder?data=' + pages[pages.length - 3].options.data + "&type=" + pages[pages.length - 3].options.type+'&carIdStr='+that.data.carIdStr;
        }else{
          var url = "../getAddress/getAddress?carIdStr="+that.data.carIdStr;
        }
        if (res.data.code == "200") {
          wx.navigateTo({
            url: url
          })
        }else{
          wx.showToast({
            title: res.data.data,
            icon: 'none',
            duration: 1500,
          })
        }
      }
    })
  },
  checkboxChange:function(e) {
    console.log(e.detail.value)
    var that = this;
    if (e.detail.value) {
      that.data.addressDetails.sa_addr_true = 1;
      this.setData({
        addressDetails: that.data.addressDetails
      })
    } else {
      that.data.addressDetails.sa_addr_true = 0;
      this.setData({
        addressDetails: that.data.addressDetails
      })
    }


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

  }
})
