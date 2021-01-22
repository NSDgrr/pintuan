// pages/userInfo/userInfo.js
var app = getApp()
var nickName = wx.getStorageSync('nickName')
var avatarUrl = wx.getStorageSync('avatarUrl')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //表单初始数据
    name:'',
    names:'',
    tel:'',
    bir:'',
    flag:true,
    nickName: nickName,
    avatarUrl: avatarUrl
  },
  onshowActionSheet:function(){
    wx.showActionSheet({
      itemList: ['读取相册', '使用照相机'],
      success: function (res) {
        // console.log(res.tapIndex)
        if(res.tapIndex==0){
          wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
              // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
              var tempFilePaths = res.tempFilePaths
              console.log(tempFilePaths);
              var tempFilePaths = res.tempFilePaths
              // wx.uploadFile({
              //   url: 'http://example.weixin.qq.com/upload', //仅为示例，非真实的接口地址  
              //   filePath: tempFilePaths[0],
              //   name: 'file',
              //   formData: {
              //     'user': 'test'
              //   },
              //   success: function (res) {
              //     var data = res.data
              //     //do something  
              //   }
              // })  
            }
          })
        }else if(res.tapIndex==1){
          wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
              // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
              var tempFilePaths = res.tempFilePaths
            }
          })
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
        
      }
    })
  },


// 表单验证事件
  formSubmit:function(e){
    var that = this;
    // 判断信息是否完整的标识
    var flag = true;
    if (e.detail.value.name == ""){
      console.log(e.detail.value.name)
      wx.showModal({
        title: '请输入昵称！',

      })
    } 
    else if (e.detail.value.names == "") {
      console.log(e.detail.value.names)
      wx.showModal({
        title: '请输入您的姓名!',
      })
      
    } 
    else if (e.detail.value.tel == "") {
      console.log(e.detail.value.tel)
      wx.showModal({
        title: '请填写您的手机号！',
      })
      
    }
     else if (!(/^1(3|4|5|7|8)\d{9}$/.test(e.detail.value.tel))) {
      console.log(e.detail.value.tel)
      wx.showModal({
        title: '手机号格式不正确!',
      })
      
    } else if (e.detail.value.birth == "") {
      console.log(e.detail.value.birth)

      wx.showModal({
        title: '生日不能为空！',
      })

    } else if (!(/^(19|20)\d{2}-(1[0-2]|0?[1-9])-(0?[1-9]|[1-2][0-9]|3[0-1])$/.test                   (e.detail.value.birth))) {
        wx.showModal({
        title: '生日不规范!',
      })
        //提示
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000
        })

      


    }else{
      //将表单提交的数据保存到本地存储里
  
        
        
    }
    

    

  },
  userInfo:function(e){
      consoel.log(e);
  },




  //点击保存bendi
  cons:function(){
        //关闭当前页面  跳转到用户登录时的页面
        wx.redirectTo({
          url: '../UserCenter/userCenter',
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
    nickName: nickName
    avatarUrl: avatarUrl
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