// pages/cardClip/cardClip.js
import * as Tool from '../../tool.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 展示筛选list
    ifShowList:false,
    // 标签title的颜色控制,1表示我的标签active，2表示编辑标签active
    labelTitleColor:1,
    // 全部、未标签
    commonList:[{labelName:"全部",isClass:false},{labelName:"未标签",isClass:false}],
    // 标签list
    labelList: [],
    // 是否展示删除按钮
    showDelBtn:false,
    // 将编辑标签变成完成
    editLabelTiel:'编辑标签',
    // 添加标签
    addLabel:false,
    // input中输入的标签名字
    newLabelName:null,
    cardInfo:{},
    // 名片list
    cardList:[],
    // 每页加载数据条数
    pageSize:4,
    // 加载更多提示
    loadMoreTip:'加载更多',
    showLoadMoreTip:false,
    pageNum:1,
    // 当前页的data
    nowPageData:[],
    // 新建标签隐藏
    showNewLabel:true
  },
  /**
   * 自定义事件
   */
  showList(){
    this.data.ifShowList = !this.data.ifShowList
    this.setData({
      ifShowList:this.data.ifShowList
    })
    this.getLabelList()
  },
  // 获取标签list
  getLabelList(){
    Tool.request(Tool.svcUrl.cardLabel.list, getApp().globalData.nowToken, {}).then(data => {
      let temp = true
      if(data.length>14){
          temp = false
      }
      this.setData({
        labelList: data,
        showNewLabel:temp
      })
    })
  },
  // 点击公用标签
  tapCommonLabel(e){
    // 点击全部标签
    if (e.currentTarget.dataset.labelcommonindex == 0) {
      if (e.currentTarget.dataset.labelcommon) {
        this.data.labelList.forEach(item => {
          item.isClass = false
        })
        this.data.commonList[0].isClass = false
      }
      else{
        this.data.labelList.forEach(item => {
          item.isClass = true
        })
        this.data.commonList[0].isClass = true
      }
      this.data.commonList[1].isClass = false
    }
    // 点击未标签
    else{
      this.data.commonList[0].isClass = false
      this.data.commonList[1].isClass = !this.data.commonList[1].isClass
      this.data.labelList.forEach(item => {
        item.isClass = false
      })
    }
    this.setData({
      commonList: this.data.commonList,
      labelList: this.data.labelList
    })
  }
  ,
  // 点击标签
  tapLabel(e){
    for(let i=0;i<this.data.labelList.length;i++){
      if (e.currentTarget.dataset.labelindex == i){
        if (e.currentTarget.dataset.labelclass){
          this.data.labelList[i].isClass = false
        }
        else{
          this.data.labelList[i].isClass = true
        }
      }
    }
    this.data.commonList.forEach(item => {
      item.isClass = false
    })
    this.setData({
      labelList: this.data.labelList,
      commonList: this.data.commonList
    })
  }
  ,
  // 点击显示和隐藏标签删除按钮
  showDelBtn(){
    let tempShow = true
    this.data.showDelBtn = !this.data.showDelBtn
    if (this.data.editLabelTiel=="完成"){
      if(this.data.labelList.length == 15){
          tempShow = false
      }
      this.setData({
        editLabelTiel:'编辑标签',
        labelTitleColor: 1,
        showNewLabel: tempShow
      })
    }
    else{
      this.setData({
        editLabelTiel:'完成',
        labelTitleColor: 2,
        showNewLabel: tempShow
      })
    }
    if (this.data.labelList.length == 15) {
      tempShow = false
      this.setData({
        showNewLabel:tempShow
      })
    }
    this.setData({
      showDelBtn:this.data.showDelBtn
    })
  }
  ,
  // 删除标签
  delLabel(e){
    let that = this
    let id = e.currentTarget.dataset.id
    for(let i=0;i<this.data.labelList.length;i++){
      if(e.currentTarget.dataset.labelindex == i){
        wx.showModal({
          title: '确认删除标签',
          success: function (res) {
            if (res.confirm) {
              that.data.labelList.splice(i, 1)
              that.setData({
                labelList: that.data.labelList,
                showNewLabel:true
              })
              Tool.request(Tool.svcUrl.cardLabel.delete, getApp().globalData.nowToken, {
                  id: id
              })
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    }
  },
  // reset
  reset(){
    this.data.commonList.forEach(item => {
      item.isClass = false
    })
    for(let i=0;i<this.data.labelList.length;i++){
      this.data.labelList[i].isClass = false
    }
    this.setData({
      labelList: this.data.labelList,
      commonList: this.data.commonList
    })
  } ,
  //finish
  finish(){
    // 判断选中标签
    let tempId = ''
    this.data.labelList.forEach(item => {
      if(item.isClass){
        tempId += item.id + ','
      }
    })
    if(tempId.length == ''){
      tempId = '-1,'
    }

    tempId = tempId.substr(0,tempId.length-1)
    // 根据选中标签获取名片
    let param = {
      "page": {
        "pageSize": this.data.pageSize,
        "currentPage": 1
      },
      "lables": tempId
    }
    Tool.request(Tool.svcUrl.collection.list, getApp().globalData.nowToken, param).then(data => {
      this.setData({
        cardList: data,
        nowPageData: data
      })
    })
    this.setData({
      ifShowList:false
    })
  },
  // 增加新标签
  showDetailBox(){
    this.setData({
      addLabel:true
    })
  },
  // 获取input中的字段
  getInput(e){
    this.setData({
      newLabelName:e.detail.value
    })
  },
  // 取消新建标签行为
  cancel(){
    this.setData({
      addLabel:false
    })
  },
  // 确定新建标签行为
  sure() {
    let param = {labelName: this.data.newLabelName}
    Tool.request(Tool.svcUrl.cardLabel.save, getApp().globalData.nowToken, param).then(data => {
      this.data.labelList.push({ labelName:this.data.newLabelName,isClass:false,id:data.id})
      this.setData({
        addLabel: false,
        labelList:this.data.labelList
      })
      // 当标签数量达到15个的时候,隐藏新建分组标签
      if(this.data.labelList.length>=15){
        this.setData({
          showNewLabel:false
        })
      }
    }, (err) => {
      wx.showToast({
        title: '标签已存在',
        icon: 'success',
        duration: 2000
      })
      this.setData({
        addLabel: false
      })
    })
  },
  gotoDetail(e){
    let id = e.target.dataset.id
    wx.navigateTo({
      url: '/pages/cardClip/cardDetail/cardDetial?id=' + id,
    })
  },
  // 到底加载
  reload(){
    // 如果还有数据可以加载
    if (this.data.nowPageData.length>0){
        if (!this.data.showLoadMoreTip) {
          console.log('123')
          this.setData({
            showLoadMoreTip: true,
            loadMoreTip: '加载中...'
          })
          // 获取全部名片
          let param = {
            "page": {
              "pageSize": this.data.pageSize,
              "currentPage": ++this.data.pageNum
            }
          }
          let timer = setTimeout( () => {
            Tool.request(Tool.svcUrl.collection.list, getApp().globalData.nowToken, param).then(data => {
              clearTimeout(timer)
              data.forEach(item => { getApp().globalData.clipCardList.push(item) })
              this.setData({
                cardList: getApp().globalData.clipCardList,
                showLoadMoreTip: false,
                loadMoreTip: "",
                nowPageData: data
              })
            })
          },1000)
        }
    }
    else{
      this.setData({
        showLoadMoreTip: true,
        loadMoreTip: "没有更多数据",
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取全部名片
    let param = {
      "page": {
        "pageSize": this.data.pageSize,
        "currentPage": 1
      }
    }
    Tool.request(Tool.svcUrl.collection.list, getApp().globalData.nowToken, param).then(data => {
      getApp().globalData.clipCardList = data
      this.setData({
        cardList: data,
        nowPageData: data
      })
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
    // 根据选中标签获取名片
    let param = {
      "page": {
        "pageSize": this.data.pageSize,
        "currentPage": 1
      }
    }
    Tool.request(Tool.svcUrl.collection.list, getApp().globalData.nowToken, param).then(data => {
      getApp().globalData.clipCardList = data
      this.setData({
        cardList: data,
        nowPageData: data
      })
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