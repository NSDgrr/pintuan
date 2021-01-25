var app = getApp();

// GoodsInfo.js
var WxParse = require('../wxParse/wxParse.js');
var time = require('../../utils/util.js');

let goodsList = [
  {actEndTime: ''},
]
Page({

  /**
  * 页面的初始数据
  */

  data: {
    listx: [],
    tuan_id:'',
    xieyi_check:false,
    sg_id:"",
    link_mobile:"",
    listData: [],
    countDownList: [],
    actEndTimeList: [],
    height:0,
    cardCur: 0,
    swiperList: [],
    goodName:'',
    goodSpecs1:'',
    goodSpecs2:'',
    goodSpecs3:'',
    goodBrand:'',
    goodDesc:'',
    goodOldprice:'',
    ypdNum:'',
    goodPtprice:'',
    Distribution:'',
    Notice:'',
    streetName:'',
    ztdAddress:'',
    ztdFzr:'',
    ztdPhone:'',
    startTime:'',
    endTime:'',
    count_down:[],
    // actEndTime:[]
    goodsChoiceHidden: true,

    state:'',//拼团状态(1，未开始。2，预热中。3，活动中，4，已结束)

    goodsNum: 1,//数量
    deliver_check:false,
    is_take_own:'',//配送选择提示：1不展示,2展示
    is_delivery:0,//1配送0自提
    tabIndex: [0],//规格

    startTimes:'1',//开始时间戳
    endTimes:'2',//结束时间戳
    pindan: true,//可以拼单
  },
  /**
     * 生命周期函数--监听页面加载
     */
  onLoad: function (options) {
    var that = this;
    this.setData({
      tuan_id: options.id,
      sg_id:options.key
    });
    //title设置
    wx.getStorage({
      key: 'title',
      success (res) {
        wx.setNavigationBarTitle({
          title: res.data
        })
      }
    })
    
  
   
    let endTimeList = [];
    // 将活动的结束时间参数提成一个单独的数组，方便操作
    goodsList.forEach(o => {endTimeList.push(o.actEndTime)})
    console.log("结束时间",endTimeList)
    this.setData({ actEndTimeList: endTimeList});
    // 执行倒计时函数
    // this.countDown();
    console.log(endTimeList);
  },
 
  onShow: function () {
    var that = this;
    this.goodDetail();
    
    // php接口
    console.log(this.data.count_down);
  },
 
  // 商品详情接口
  goodDetail(){
  // console.log(this.data.swiperList);
    var that = this;
    wx.request({
      url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Miniapp/Index/tuan_detail&sg_id='+this.data.sg_id+'&tuan_id='+this.data.tuan_id,
      method: 'POST',
      data: {
       
      },
      success: function (res) {
        console.log(res.data.data);
        // var start_time = time.formatTimeTwo(res.data.data.tuan_data.start_time,'Y年/M月/D日');
        var start_times = time.formatTimeTwo(res.data.data.tuan_data.start_time,'Y年M月D日h时m分');
        var start_time = time.savTimes(start_times);
        var end_times = time.formatTimeTwo(res.data.data.tuan_data.hour,'Y年M月D日h时m分');
        var end_time = time.savTimes(end_times);
        let ent_time_day = time.formatTimeTwo(res.data.data.tuan_data.hour,'Y/M/D h:m:s');    
        // let timeArr = [];
        // timeArr.push(countDown);
        //活动规则富文本显示
        var detail_notice = res.data.data.tuan_data.notice;
        WxParse.wxParse('detail_notice', 'html', detail_notice, that, 5);
        //商品详情富文本显示
        if (app.data.mpid == 16) {//判断企业ID
          var sg_detail = res.data.data.tuan_data.sg_detail;
        } else {
          if (res.data.data.tuan_data.sg_detail.indexOf("http:\/\/visa\.mobtop\.com\.cn") > -1) {
            if (res.data.data.tuan_data.sg_detail.indexOf("http:\/\/vsp\.mobtop\.com\.cn") > -1) {
              var sg_detail = res.data.data.tuan_data.sg_detail.replace(/http:\/\/visa\.mobtop\.com\.cn/g, "");
            } else {
              var sg_detail = res.data.data.tuan_data.sg_detail.replace(/http:\/\/visa\.mobtop\.com\.cn/g, "http://vsp.mobtop.com.cn");
            }
          }
        }
        WxParse.wxParse('sg_detail', 'html', sg_detail, that, 5);
        // var sg_detail = res.data.data.tuan_data.sg_detail;
        // WxParse.wxParse('sg_detail', 'html', sg_detail, that, 5);
        that.setData({
          listx : res.data.data,
          goodName : res.data.data.tuan_data.sg_name,
          goodBrand : res.data.data.tuan_data.sg_tag,
          goodDesc : res.data.data.tuan_data.sg_describe,
          goodOldprice : res.data.data.tuan_data.price,
          ypdNum : res.data.data.tuan_data.tuan_num,
          goodPtprice : res.data.data.tuan_data.tuan_price,
          Distribution : res.data.data.tuan_data.t_price,
          streetName:res.data.data.tuan_data.sq_name,
          ztdAddress:res.data.data.tuan_data.t_address,
          ztdFzr:res.data.data.tuan_data.t_uname,
          ztdPhone:res.data.data.tuan_data.t_tel,
          startTime: start_time,
          endTime:end_time,
          actEndTimeList:[ent_time_day],
          state:res.data.data.tuan_data.state,
          is_take_own:res.data.data.tuan_data.is_take_own,
          startTimes:res.data.data.tuan_data.start_time,
          endTimes:res.data.data.tuan_data.hour,
          // count_down:countDown,
        })
        let arr = [];
        arr.push(res.data.data.tuan_data.spec_res);
       
        if(arr == 0){
            return
        }else{
            that.setData({
              goodSpecs1:res.data.data.tuan_data['spec_res'][0]['min'][0]['sms_name'],
              goodSpecs2:res.data.data.tuan_data['spec_res'][1]['min'][0]['sms_name'],
              goodSpecs3:res.data.data.tuan_data['spec_res'][2]['min'][0]['sms_name']
            })
        }
        
        if (res.data.data.tuan_data.spec_res) {
          let tabIndex = res.data.data.tuan_data.spec_res.map(function (item) {
            item = 0;
            return item
          })
          that.setData({
            tabIndex
          })
        }
        that.countDown();
      },
      fail: function () {
        console.log("接口调用失败");
      }
    })
 },

 //拨打电话
 makePhone(e){
   wx.makePhoneCall({
     phoneNumber: this.data.ztdPhone,
   })
 },


  timeFormat(param){//小于10的格式化函数
    return param < 10 ? '0' + param : param; 
  },
  countDown(){//倒计时函数
    // let interval = setTimeout(this.countDown,1000);
    // 获取当前时间，同时得到活动结束时间数组
    let newTime = new Date().getTime();
    let endTimeList = this.data.actEndTimeList;
    
    let countDownArr = [];

    // 对结束时间进行处理渲染到页面
    endTimeList.forEach(o => {
      let endTime = new Date(o).getTime();
      let obj = null;
      // 如果活动未结束，对时间进行处理
      if (endTime - newTime > 0){
        let time = (endTime - newTime) / 1000;
        // 获取天、时、分、秒
        let day = parseInt(time / (60 * 60 * 24));
        let hou = parseInt(time % (60 * 60 * 24) / 3600);
        let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
        let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
        let dayN = 0;
        if(day > 0){
          dayN =day * 24; 
        }
        obj = {
          // day: this.timeFormat(day),
          hou: this.timeFormat(Number(dayN) + hou),
          min: this.timeFormat(min),
          sec: this.timeFormat(sec)
        }
        this.setData({
          pindan: true
        })
        setTimeout(this.countDown,1000);
      }else{//活动已结束，全部设置为'00'
        obj = {
          // day: '00',
          hou: '00',
          min: '00',
          sec: '00'
        }
        this.setData({
          pindan: false
        })
        // clearTimeout(interval);
      }
      countDownArr.push(obj);
    })
    // 渲染，然后每隔一秒执行一次倒计时函数
    this.setData({ countDownList: countDownArr})
  },

  /* 输入框事件  数量 */
  bindManual: function (e) {
    var num = e.detail.value;
    // 将数值与状态写回  
    this.setData({
      num: num
    });
  },

  // 查看完整活动规则
  showRolesdetail:function(){
    let that = this;
    if(that.data.height == 0){
      this.setData({
        height:'auto'
      })
    }else if(that.data.height == 'auto'){
      this.setData({
        height: 0
      })
    }
  },


  //快递选择
  deliverChange(){
    this.setData({
      deliver_check: !this.data.deliver_check
    })
    if(this.data.deliver_check){
      this.setData({
        is_delivery: 1
      })
    }else{
      this.setData({
        is_delivery: 0
      })
    }
  },
  // 立即拼单
  goodsChoiceChange:function(){
    if (this.data.xieyi_check) {
      this.setData({
        goodsChoiceHidden: !this.data.goodsChoiceHidden
      })
    }else{
      wx.showToast({
        icon: 'none',
        title: '请阅读勾选活动规则',
        duration: 2000
      });
    }
   },
   checkboxChange(){
    this.setData({
      xieyi_check: !this.data.xieyi_check
    })
   },
  //  数量操作
  // 点击减少
  handleReduce(e) {
    let goodsNumber = parseInt(e.target.dataset.goodsnum);
    if (goodsNumber > 1) {
      goodsNumber--;
      this.setData({
        goodsNum:goodsNumber
      })
    } else {
      wx.showToast({
        icon: 'none',
        title: '所选商品数量不能低于1件！',
        duration: 2000
      });
    }
  },
  // 在规格中点击增加
  handleIncrease(e) {
    let goodsNumber = parseInt(e.target.dataset.goodsnum);
    if(goodsNumber<this.data.listx.tuan_data.stock){
      if (goodsNumber < this.data.listx.tuan_data.buy_limit_num) {
        goodsNumber++;
        this.setData({
          goodsNum:goodsNumber
        })
      }else {
        wx.showToast({
          icon: 'none',
          title: '每人仅限购'+this.data.listx.tuan_data.buy_limit_num+'件哦！',
          duration: 2000
        })      
      }
    }else{
      wx.showToast({
        icon: 'none',
        title: '库存不足',
        duration: 2000
      })   
    }
  },
  // 直接输入商品数量
  handleGoodsNum(e) {
    this.setData({
      goodsNum:e.detail.value
    })
    if (this.data.goodsNum < 1) {
      wx.showToast({
        icon: 'none',
        title: '所选商品数量不能低于1件！',
        duration: 2000
      });
    } else if (this.data.goodsNum > this.data.listx.tuan_data.buy_limit_num) {
      wx.showToast({
        icon: 'none',
        title: '每人仅限购'+this.data.listx.tuan_data.buy_limit_num+'件哦！',
      })
      this.setData({
        goodsNum:this.data.listx.tuan_data.buy_limit_num
      })
    }
  },
  //点击立即拼单获取商品详情
  getInfo(e){
    if (this.data.listx.tuan_data.dan_status == "1") {
      var arr = [""];
    } else {
      var arr = [];
      for (let i = 0; i < this.data.tabIndex.length; i++) {
        arr.push(this.data.listx.tuan_data.spec_res[i].min[this.data.tabIndex[i]].sms_id)
      }
    }
    if (this.data.listx.tuan_data.dan_status == "1"){
      var orderarr = [{
        sg_id: this.data.sg_id,
        spec_str:"",
        num: this.data.goodsNum,
      }];
    }else{
      var orderarr = [{
        sg_id: this.data.sg_id,
        spec_str: arr.join(),
        num: this.data.goodsNum,
      }];
    }
    let that = this;
    wx.request({
      data: { data: JSON.stringify(orderarr)},
      url: app.data.http_text + '.mobtop.com.cn/index.php?s=/Miniapp/Index/go_buy_info&token=' + wx.getStorageSync('unionId')+"&mpid="+app.data.mpid+'&tuan_id='+this.data.listx.tuan_data.id+'&flag=1&is_delivery='+this.data.is_delivery,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        console.log(res);
        if(res.data.code == 200){
          wx.navigateTo({
            url: '../confirmOrder/confirmOrder?data=' + JSON.stringify(res.data.data) + "&type=1&flag=1&is_delivery=" + e.currentTarget.dataset.deliver + "&tuan_id=" + e.currentTarget.dataset.tid
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





  imgYu: function (event) {
    var src = event.currentTarget.dataset.src;
    var imgList = event.currentTarget.dataset.list;
    wx.previewImage({
      current: src, 
      urls: imgList
    })
  },
})