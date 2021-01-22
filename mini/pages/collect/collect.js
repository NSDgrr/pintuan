// page/component/new-pages/collect/collect.js

var app = getApp();
var unionId = wx.getStorageSync('unionId')

Page({

  /**
   * 页面的初始数据
   */
  data: {

    //收藏列表
    col : [],
    // 列表是否有数据
    hasList: false,  
    //  
    flag:false,

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
  onShow() {
    var that = this;

    // 发送请求
    wx.request({
      url: app.data.http_text+'.mobtop.com.cn/index.php?s=/Miniapp/Index/myCollectShops',
      method: 'GET',
      data:{
        token: unionId,
        mpid:app.data.mpid
      },
      success: function (res) {
        let newCollect = res.data.data.map(function (item) {
          item.selected = true;
          item.sg_img_url = item.sg_img_url.split(',');
          return item
        });
        console.log(newCollect);
        that.setData({
          hasList: true,
          col:newCollect

        });
      }
    })
  },

//改变选中状态值
  onChangeFlagState: function () {
    this.setData({
      flag: !this.data.flag
    })
  },

//当前商品选中事件
  selectList(e) {
    const index = e.currentTarget.dataset.index;
    console.log(index);
    let col = this.data.col;
    const selected = col[index].selected;
    col[index].selected = !selected;
    this.setData({
      col: col
    });
    console.log(selected);
  },


// 移除商品
  deleteList(e) {
    wx.showModal({
      title: '确认删除本条收藏？',
      confirmColor: '#b2282e',
      success: (res) => {
        if (res.confirm) {
          const index = e.currentTarget.dataset.index;
          console.log(index)
          let col = this.data.col;
          col.splice(index,1);
          this.setData({
            col: col
          });
          console.log(col.length);
          console.log(col);
          if (!col.length) {
            this.setData({
              hasList: false
            });
          } 
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
    
  }
})