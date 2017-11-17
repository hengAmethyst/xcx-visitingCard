import * as Tool from '../../../tool.js';

Page({
    data: {
        indicatorDots: true,
        autoplay: false,
        duration: 500,
        current: 0,
        currentIdx: 0
    },
    // 绑定input的输入值
    inputValue(e) {
        let data = this.data.cardList;
        let category = e.currentTarget.dataset.category;
        let idx = e.currentTarget.dataset.idx;
        data[idx].info[category] = e.detail.value;
        this.setData({
            cardList: data
        })
    },
    // 点击上传图片事件
    uploadImg(e) {
        let idx = e.target.dataset.selectIdx;
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: (res) => {
                let tempFilePaths = res.tempFilePaths
                wx.uploadFile({
                    url: Tool.uploadUrl,
                    filePath: tempFilePaths[0],
                    name: 'file',
                    success: res => {
                        let response = JSON.parse(res.data);
                        if (response.code === 0) {
                            this.data.cardList[idx].info.logo = response.data.fullFilename;
                            this.setData({
                                cardList: this.data.cardList
                            })
                        }
                    }
                })
            }
        })
    },
    // swiper组件改变index值
    changeCurrent(e) {
        this.setData({
            currentIdx: e.detail.current
        });
    },
    // 确认提交
    submitOverWrite(e) {
        let that = this
        let index = e.currentTarget.dataset.select_submit_id
        let param = {
            "cardInfo": this.data.cardList[index].info,
            "templateName": this.data.cardList[index].type
        }
        // 给基础数据添上名片id
        param.cardInfo.id = getApp().globalData.cardList[index].info.id;
        console.log(param.cardInfo)
        if (this.data.cardList[index].name !== '' && this.data.cardList[index].position !== '' && this.data.cardList[index].company !== '' && this.data.cardList[index].phone !== '') {
            wx.showLoading({
                title: '提交中',
                mask: true
            });
            Tool.request(Tool.svcUrl.cardInfo.save, getApp().globalData.nowToken, param).then(data => {
                wx.hideLoading();
                wx.reLaunch({
                    url: '/pages/myCards/myCards',
                })
            })
        } else {
            wx.showToast({
                title: '必填字段不能为空',
            })
        }

    },
    onLoad(options) {
        let idx = parseInt(options.idx);
        let current = this.data.current;
        let currentIdx = this.data.currentIdx;
        current = idx;
        currentIdx = idx;
        this.setData({
            current: idx,
            currentIdx: idx,
            cardList: getApp().globalData.cardList
        })
    }
})