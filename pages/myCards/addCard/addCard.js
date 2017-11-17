import * as Tool from '../../../tool.js';
Page({
    data: {
        tempImg: "",
        type: 'white',
        info: {
            logo: '',
            name: '',
            position: '',
            company: '',
            phone: '',
            otherOne: '',
            otherTwo: '',
            otherThree: ''
        },
        submitLoading: false
    },
    createNewCard() {
        this.setData({
            submitLoading: true
        })
        wx.showLoading({
            title: '提交中',
            mask: true
        });
        let that = this;
        let param = {
            cardInfo: this.data.info,
            templateName: this.data.type,
            path: 'pages/backPage/backPage'
        }
        if (this.data.info.name && this.data.info.position && this.data.info.company && this.data.info.phone) {
            Tool.request(Tool.svcUrl.cardInfo.save, getApp().globalData.nowToken, param).then(data => {
                wx.hideLoading();
                this.setData({
                    submitLoading:false
                });
                wx.reLaunch({
                    url: '/pages/myCards/myCards',
                })
            }, err => {
                wx.hideLoading();
                this.setData({
                    submitLoading: false
                });
                wx.showToast({
                    title: '提交失败',
                })
            })

        } else {
            wx.showToast({
                title: '必填字段不能为空',
            })
            wx.hideLoading();
            this.setData({
                submitLoading: false
            });
        }
    },
    inputValue(e) {
        let data = this.data.info;
        let category = e.currentTarget.dataset.category;
        data[category] = e.detail.value;
        this.setData({
            info: data
        })
    },
    uploadImg() {
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: res => {
                let tempFilePaths = res.tempFilePaths
                wx.uploadFile({
                    url: Tool.uploadUrl,
                    filePath: tempFilePaths[0],
                    name: 'file',
                    success: res => {
                        console.log(res);
                        let response = JSON.parse(res.data);
                        if (response.code === 0) {
                            this.data.info.logo = response.data.fullFilename;
                            this.setData({
                                info: this.data.info
                            })
                        }
                    }
                })
            }
        })
    },
    onLoad(options) {
        let type = options.type
        this.setData({
            type: type
        })
    }
})