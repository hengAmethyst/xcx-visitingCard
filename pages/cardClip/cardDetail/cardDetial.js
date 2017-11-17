// pages/cardClip/cardDetail/cardDetial.js
import * as Tool from '../../../tool';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 展示筛选list
    ifShowList: false,
    // 标签title的颜色控制,1表示我的标签active，2表示编辑标签active
    labelTitleColor: 1,
    // 标签list
    labelList: [],
    // 是否展示删除按钮
    showDelBtn: false,
    // 将编辑标签变成完成
    editLabelTiel: '编辑标签',
    // 添加标签
    addLabel: false,
    // input中输入的标签名字
    newLabelName: null,
    cardInfo: {},
    id: null,
    cardId: null,
    remark: '点击编辑备注',
    tempRemark:null,
    ifShowRemark:false,
    showTextArea:false
  },
  /**
   * 自定义事件
   */
  showList() {
    this.data.ifShowList = !this.data.ifShowList
    this.setData({
      ifShowList: this.data.ifShowList
    })
  },
  // 点击标签
  tapLabel(e) {
    for (let i = 0; i < this.data.labelList.length; i++) {
      if (e.currentTarget.dataset.labelindex == i) {
        if (e.currentTarget.dataset.labelclass) {
          console.log('1')
          this.data.labelList[i].isClass = false
          this.setData({
            labelList: this.data.labelList
          })
        }
        else {
          console.log('2')
          this.data.labelList[i].isClass = true
          this.setData({
            labelList: this.data.labelList
          })
        }
      }
    }
  }
  ,
  // 点击显示和隐藏标签删除按钮
  showDelBtn() {
    this.data.showDelBtn = !this.data.showDelBtn
    if (this.data.editLabelTiel == "完成") {
      this.setData({
        editLabelTiel: '编辑标签',
        labelTitleColor: 1
      })
    }
    else {
      this.setData({
        editLabelTiel: '完成',
        labelTitleColor: 2
      })
    }
    this.setData({
      showDelBtn: this.data.showDelBtn
    })
  }
  ,
  // 删除标签
  delLabel(e) {
    let that = this
    for (let i = 0; i < this.data.labelList.length; i++) {
      if (e.currentTarget.dataset.labelindex == i) {
        wx.showModal({
          title: '确认删除标签',
          confirmColor: '#20b6be',
          success: function (res) {
            if (res.confirm) {
              that.data.labelList.splice(i, 1)
              that.setData({
                labelList: that.data.labelList
              })
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })

      }
    }
    // 删除标签
    let id = e.currentTarget.dataset.id
    let param = { "id": id }
    Tool.request(Tool.svcUrl.cardLabel.delete, getApp().globalData.nowToken, param).then(data => {
    })
  }
  ,
  // reset
  reset() {
    for (let i = 0; i < this.data.labelList.length; i++) {
      this.data.labelList[i].isClass = false
      this.setData({
        labelList: this.data.labelList
      })
    }
  }
  ,
  //finish
  finish() {
    this.setData({
      ifShowList: false
    })
  }
  ,
  // 增加新标签
  showDetailBox() {
    this.setData({
      addLabel: true
    })
  }
  ,
  // 获取input中的字段
  getInput(e) {
    this.setData({
      newLabelName: e.detail.value
    })
  }
  ,
  // 取消新建标签行为
  cancel() {
    this.setData({
      addLabel: false,
      ifShowRemark: false
    })
  }
  ,
  // 确定新建标签行为
  sure() {
    this.setData({
      addLabel: false,
      labelList: this.data.labelList
    })
    let param = {
      "labelName": this.data.newLabelName
    }
    Tool.request(Tool.svcUrl.cardLabel.save, getApp().globalData.nowToken, param).then(data => {
      this.data.labelList.push({ labelName: this.data.newLabelName, isClass: false })
      this.setData({
        labelList:this.data.labelList
      })
    })
  }
  ,
  gotoDetail() {
    wx.navigateTo({
      url: '/pages/cardClip/cardDetail/cardDetial',
    })
  },
  // 显示备注输入框
  remarkChanged(e) {
    this.setData({
      ifShowRemark: true,
      addLabel:true
    });
  },
  inputTip(e){
    this.setData({
      tempRemark: e.detail.value
    })
  },
  submitTip(){
    this.setData({
      remark: this.data.tempRemark,
      ifShowRemark: false,
      addLabel:false
    })
  },
  deleteCard() {
    let token = getApp().globalData.nowToken;
    let param = {
      id: this.data.id
    };
    Tool.request(Tool.svcUrl.collection.delete, token, param)
      .then(data => {
        wx.navigateBack({ delta: 1 });
      });
  },
  ok() {
    // 循环判断标签被选中
    let tempId = ''
    this.data.labelList.forEach((item) => {
      if(item.isClass){
        tempId += item.id + ','
      }
    })
    tempId = tempId.substr(0,tempId.length-1)

    let token = getApp().globalData.nowToken;
    let param = {
      id: this.data.id,
      cardId: this.data.cardId,
      remark: this.data.remark,
      lables: tempId
    };
    


    Tool.request(Tool.svcUrl.collection.save, token, param)
    .then(data => {
      wx.navigateBack({ delta: 1 });
    })



  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let cardItem = getApp().globalData.clipCardList.find(it => it.cardId == options.id);
    this.setData({
      id: cardItem.id,
      cardId: cardItem.cardId,
      cardInfo: cardItem.cardInfo,
      remark: cardItem.remark
    });
    // 获取标签list
    Tool.request(Tool.svcUrl.cardLabel.list, getApp().globalData.nowToken, {}).then(data => {
      data.isClass = false
      this.setData({
        labelList: data
      })
      console.log(this.data.labelList)
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
  onShareAppMessage(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: '新乐汇微名片',
      path: '/pages/backPage/backPage?shareCode=' + getApp().globalData.shareCode + '&id=' + this.data.cardId,
      success: function (res) {
        // 转发成功
        console.log(getApp().globalData.shareCode)
        console.log('转发成功')
      },
      fail: function (res) {
        // 转发失败
        console.log('转发失败')
      }
    }
  }
})