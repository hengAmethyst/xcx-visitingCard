import * as Tool from '../../tool.js';
let app = getApp();

Page({
    data: {
        hasCard: false,
        indicatorDots: true,
        autoplay: false,
        duration: 500,
        cardList: [],
        currentIdx: 0,
        selectIndex: '',
        loading: true
    },
    onLoad: function (options) {
        let justDoIt = () => {
            wx.showLoading({
                title: '加载中',
            });

            this.getData();
        };

        if (getApp().globalData.nowToken) {
            justDoIt();
        } else {
            getApp().loginReadyCallback = () => justDoIt();
        }
    },
    /**
     * 自定义事件
     */
    // 获取数据方法
    getData() {
        var that = this;

        Tool.request(Tool.svcUrl.cardInfo.list, getApp().globalData.nowToken, {}).then(data => {
            if (data.length > 0) {
                // 先把数据置空
                that.data.cardList = []
                for (let i = 0; i < data.length; i++) {
                    that.data.cardList.push({
                        info: data[i],
                        type: data[i].templateName
                    })
                }
                that.setData({
                    cardList: that.data.cardList,
                    hasCard: true,
                    loading: false
                })
                // 如果名片被删除完了
                if (that.data.cardList.length <= 0) {
                    that.setData({
                        hasCard: false
                    })
                }
                // 把查询的mingpianlist赋值给全局变量
                getApp().globalData.cardList = that.data.cardList
            } else {
                that.setData({
                    loading: false,
                    hasCard: false
                })
            }
            wx.hideLoading()
        });
    },
    // 创建我的第一张名片
    addFirstCard() {
        wx.navigateTo({
            url: "/pages/myCards/selectTemplate/selectTemplate"
        })
    },
    gotoBackPage() {
        wx.navigateTo({
            url: '/pages/backPage/backPage',
        })
    },
    // swiper点击
    onSwiperTap(e) {
        let idx = e.currentTarget.dataset.index;
        if (this.data.selectIndex === idx) {
            this.setData({
                selectIndex: ''
            });
        } else {
            this.setData({
                selectIndex: idx
            });
        }
    },
    // 获取当前swiper的index
    changeCurrentIdx(e) {
        this.setData({
            currentIdx: e.detail.current
        })
    },
    // 点击添加名片跳转模板选择页面
    selectTemplate() {
        if (this.data.cardList.length < 5) {
            wx.navigateTo({
                url: 'selectTemplate/selectTemplate'
            })
        } else {
            wx.showModal({
                title: '友情提示',
                content: '一个人只能创建5张哦~',
                confirmColor: '#20b6be'
            })
        }

    },
    // 点击编辑跳转编辑页面
    editCard(e) {
        let idx = e.currentTarget.dataset.index;
        wx.navigateTo({
            url: 'editCard/editCard?idx=' + idx
        })
    },
    delCard(e) {
        let that = this;
        let idx = e.currentTarget.dataset.index;
        wx.showModal({
            title: '删除',
            content: '是否删除该名片',
            confirmColor: '#20b6be',
            success: function (res) {
                if (res.confirm) {
                    Tool.request(Tool.svcUrl.cardInfo.delete, getApp().globalData.nowToken, {
                        cardInfo: {
                            id: that.data.cardList[idx].info.id
                        }
                    }).then(data => {
                        that.setData({
                            selectIndex: ''
                        })
                        wx.showToast({
                            title: '删除成功',
                        })
                        if(idx === (that.data.cardList.length-1)){
                            wx.reLaunch({
                                url: '/pages/myCards/myCards',
                            })
                        }else{
                            that.getData()
                        }
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    }
    ,
    createImg() {
        wx.navigateTo({
            url: '/pages/myCards/createImg/createImg?id=' + this.data.cardList[this.data.currentIdx].info.id
        })
    },
    onShareAppMessage(res) {
        let that = this;
        if (res.from === 'button') {
            // 来自页面内转发按钮
        }
        return {
            title: '新乐汇微名片',
            path: '/pages/backPage/backPage?shareCode=' + getApp().globalData.shareCode + '&id=' + that.data.cardList[that.data.currentIdx].info.id,
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