import * as Tool from '../../../tool';
import cardStyleMap from './cardStyleMap.js'
import adapter from './adapter.js'
Page({
    /**
     * 页面的初始数据
     */
    data: {
        click: true,
        info: {
            logo: '/imgs/create.jpg',
            name: '马化腾',
            position: 'CEO',
            company: '上与腾讯信息科技有限公司',
            phone: '137 8659 8726',
            otherOne: 'www.QQ.com',
            otherTwo: 'tenxun12847@sina.com',
            otherThree: '上海市金沙江西路1555弄11号8F',
            tip1: "长按识别小程序码",
            tip2: "创建自己的名片",
            madeCompany: "-由新乐汇小程序生成-",
            qrCode: ''
        },
        // 当前模板种类
        nowType:null,
        needDel_x: 0,
        needDel_y: 0,
        textDel_x: 0,
        textDel_y: 0,
        currentIdx: 0
    },
    /**
     * 自定义方法
     */
    drawQrCode(canvasId, info, styleMap) {
        let ctx = wx.createCanvasContext(canvasId);

        ctx.setFillStyle(styleMap.backgroundColr)
        ctx.fillRect(0, 0, 680, 680);
        // 生成小程序码
        ctx.drawImage(info.qrCode, 0, 0, styleMap.qrCode.size.w, styleMap.qrCode.size.h)
        // 渲染
        ctx.draw()
    },
    drawCard(canvasId, info, styleMap, b) {
        let ctx = wx.createCanvasContext(canvasId)
        if (b) {
            ctx.scale(1, 1);
        } else {
            ctx.scale(0.5, 0.5);
        }

        // 添加背景色
        ctx.setFillStyle(styleMap.backgroundColr)
        ctx.fillRect(0, 0, 680, 412)
        let needDel_x = this.data.needDel_x
        let needDel_y = this.data.needDel_y
        let textDel_y = this.data.textDel_y
        let textDel_x = this.data.textDel_x
        // 渲染的顺序最好按此顺序最好不要修改，因为textAlign的原因
        // name
        ctx.setFillStyle(styleMap.name.color)
        ctx.setFontSize(styleMap.name.size)
        ctx.fillText(info.name, styleMap.name.pos.x, styleMap.name.pos.y - textDel_y)
        // 职位
        ctx.setFillStyle(styleMap.position.color)
        ctx.setFontSize(styleMap.position.size)
        ctx.fillText(info.position, styleMap.position.pos.x, styleMap.position.pos.y - textDel_y)
        // tip1
        ctx.setFillStyle(styleMap.tip1.color)
        ctx.setFontSize(styleMap.tip1.size)
        ctx.fillText(info.tip1, styleMap.tip1.pos.x - needDel_x, styleMap.tip1.pos.y - needDel_y)
        // tip2
        ctx.setFillStyle(styleMap.tip2.color)
        ctx.setFontSize(styleMap.tip2.size)
        ctx.fillText(info.tip2, styleMap.tip2.pos.x - needDel_x, styleMap.tip2.pos.y - needDel_y)
        // 生成公司
        ctx.setFillStyle(styleMap.madeCompany.color)
        ctx.setFontSize(styleMap.madeCompany.size)
        ctx.fillText(info.madeCompany, styleMap.madeCompany.pos.x - needDel_x, styleMap.madeCompany.pos.y - needDel_y)
        // 公司名字
        // 如果是red模板，就使用这个属性
        if (styleMap.type == 'red'){
          ctx.setTextAlign('right')
        }
        ctx.setFillStyle(styleMap.company.color)
        ctx.setFontSize(styleMap.company.size)
        ctx.fillText(info.company, styleMap.company.pos.x - textDel_x, styleMap.company.pos.y - textDel_y)
        // 电话号码
        ctx.setFillStyle(styleMap.phone.color)
        ctx.setFontSize(styleMap.phone.size)
        ctx.fillText(info.phone, styleMap.phone.pos.x - textDel_x, styleMap.phone.pos.y - textDel_y)
        // otherOne
        ctx.setFillStyle(styleMap.otherOne.color)
        ctx.setFontSize(styleMap.otherOne.size)
        ctx.fillText(info.otherOne, styleMap.otherOne.pos.x - textDel_x, styleMap.otherOne.pos.y - textDel_y)
        // otherTwo
        ctx.setFillStyle(styleMap.otherTwo.color)
        ctx.setFontSize(styleMap.otherTwo.size)
        ctx.fillText(info.otherTwo, styleMap.otherTwo.pos.x - textDel_x, styleMap.otherTwo.pos.y - textDel_y)
        // otherThree
        ctx.setFillStyle(styleMap.otherThree.color)
        ctx.setFontSize(styleMap.otherThree.size)
        ctx.fillText(info.otherThree, styleMap.otherThree.pos.x - textDel_x, styleMap.otherThree.pos.y - textDel_y)
        if (styleMap.type == 'red') {
          ctx.setTextAlign('left')
        }
        // 公司logo
        ctx.drawImage(info.logo, styleMap.logo.pos.x - needDel_x, styleMap.logo.pos.y - needDel_y, styleMap.logo.size.w, styleMap.logo.size.h)
        // 小程序码
        ctx.drawImage(info.qrCode, styleMap.qrCode.pos.x - needDel_x, styleMap.qrCode.pos.y - needDel_y, styleMap.qrCode.size.w, styleMap.qrCode.size.h)
        // 渲染
        ctx.draw()
    },
    // 预览card
    previewCard() {
        wx.showLoading({
            title: "加载中...",
            mask: true,
            success: function () {
                wx.canvasToTempFilePath({
                    x: 0,
                    y: 0,
                    width: 680,
                    height: 412,
                    // destWidth: 680,
                    // destHeight: 412,
                    canvasId: 'myCanvas2',
                    success: (res) => {
                        console.log(res.tempFilePath)
                        wx.hideLoading()
                        wx.previewImage({
                            urls: [res.tempFilePath]
                        })
                    }
                })
            }
        })
    },
    // 预览小程序码
    previewQrCode() {
        wx.showLoading({
            title: "加载中...",
            mask: true,
            success: function () {
                wx.canvasToTempFilePath({
                    x: 0,
                    y: 0,
                    width: 340,
                    height: 340,
                    // destWidth: 680,
                    // destHeight: 412,
                    canvasId: 'myCanvas3',
                    success: (res) => {
                        console.log(res.tempFilePath)
                        wx.hideLoading()
                        wx.previewImage({
                            urls: [res.tempFilePath]
                        })
                    }
                })
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        
        let cardId = options.id;
        let cardInfo = {};
        Tool.request(Tool.svcUrl.cardInfo.detail, getApp().globalData.nowToken, {
            cardInfo: {
                id: cardId
            }
        })
            .then(res => {
              // 把当前的模板类型赋值给nowType
                this.data.type = cardInfo.templateName
                this.setData({
                  nowType: res.templateName
                })
                console.log(this.data.nowType)
                // 适配不同屏幕宽度机型
                let that = this
                wx.getSystemInfo({
                  success: function (res) {
                    // 适配屏幕宽度
                    adapter(that,res)
                  }
                })

                cardInfo = res;
                cardInfo.tip1 = "长按识别小程序码";
                cardInfo.tip2 = "创建自己的名片";
                cardInfo.madeCompany = "-由新乐汇小程序生成-";
                if (cardInfo.logo) {
                    Promise.all([
                        Tool.wx.downloadFile({
                            url: cardInfo.qrCode
                        }),
                        Tool.wx.downloadFile({
                            url: cardInfo.logo
                        })
                    ])
                      .then(res => {
                          cardInfo.qrCode = res[0].tempFilePath;
                          cardInfo.logo = res[1].tempFilePath;
                          // cavans加载
                          this.drawCard("myCanvas", cardInfo, cardStyleMap[cardInfo.templateName])
                          this.drawCard("myCanvas2", cardInfo, cardStyleMap[cardInfo.templateName], true)
                          this.drawQrCode("myCanvas3", cardInfo, cardStyleMap["qrCode"])
                      })
                } else {
                    Tool.wx.downloadFile({
                        url: cardInfo.qrCode
                    })
                        .then(res => {
                            cardInfo.qrCode = res.tempFilePath;
                            // cavans加载
                            this.drawCard("myCanvas", cardInfo, cardStyleMap[cardInfo.templateName])
                            this.drawCard("myCanvas2", cardInfo, cardStyleMap[cardInfo.templateName], true)
                            this.drawQrCode("myCanvas3", cardInfo, cardStyleMap["qrCode"],true)
                        })
                }
            })
    },
    onShow: function () {
      
    },
    // 获取当前swiper的index
    changeCurrentIdx(e) {
        this.setData({
            currentIdx: e.detail.current
        })
    }
})