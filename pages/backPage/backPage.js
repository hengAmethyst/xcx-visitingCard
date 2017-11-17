import * as Tool from '../../tool';

Page({
    data: {
        showDetail: false,
        shareCode: '',
        id: '',
        info: {},
        type: 'white'
    },
    onLoad: function (options) {
        console.log(options)
        wx.showLoading({
            title: '加载中',
        })

        let justDoIt = () => {
            if (options.id) {
                this.setData({
                    shareCode: options.shareCode,
                    id: options.id
                })
            } else {
                this.setData({
                    shareCode: getApp().globalData.shareCode,
                    id: options.scene
                })
            }
            this.getCardDetail();
        };

        if (getApp().globalData.nowToken) {
            justDoIt();
        } else {
            getApp().loginReadyCallback = () => justDoIt();
        }
    },
    collectCard(e) {
        let type = e.target.dataset.type;
        Tool.request(Tool.svcUrl.collection.save, getApp().globalData.nowToken, {
            shareCode: this.data.shareCode,
            cardId: this.data.id
        })
            .then(res => {
                wx.showToast({
                    title: '收藏成功',
                    duration:500
                })
                if (type === '1') {
                    setTimeout(() => {
                        wx.reLaunch({
                            url: '/pages/myCards/selectTemplate/selectTemplate',
                        })
                    },500)
                }else{
                    setTimeout(() => {
                        wx.reLaunch({
                            url: '/pages/cardClip/cardClip',
                        })
                    }, 500)
                }
            }, err => {
                wx.showToast({
                    title: err.message
                })
            })
    },
    getCardDetail() {
        Tool.request(Tool.svcUrl.cardInfo.detail, getApp().globalData.nowToken, {
            cardInfo: { id: this.data.id }
        })
            .then(res => {
                wx.hideLoading();
                console.log(res)
                this.setData({
                    showDetail: true,
                    info: res,
                    type: res.templateName
                })
            }, err => {
                wx.showToast({
                    title: err.message,
                })
            });
    }
})