//app.js
import * as Tool from './tool';

App({
    login: function (shareCode, reAuthorize) {
        this.globalData.loading = true;
        let code = null;
        let userInfo = null;

        let getUserInfo = () => {
          if (reAuthorize) {
            return Tool.wx.openSetting()
                .then(() => Tool.wx.getUserInfo());
          } else {
              return Tool.wx.getUserInfo();
          }
        };

        return Promise
            .all([
                Tool.wx.login(),
                getUserInfo()
            ])
            .then(res => {
                code = res[0].code;
                userInfo = res[1].userInfo;
                this.globalData.userInfo = userInfo;

                let param = {
                    code,
                    nickName: userInfo.nickName,
                    sex: userInfo.gender,
                    province: userInfo.province,
                    headImgurl: userInfo.avatarUrl,
                    city: userInfo.city,
                    country: userInfo.country,
                    otherShareCode: shareCode
                };
                return Tool.wx.request({
                    url: Tool.svcUrl.user.login,
                    method: 'POST',
                    data: Tool.genReqBody('', param)
                });
            })
            .then(res => {
                this.globalData.nowToken = res.data.token;
                this.globalData.shareCode = res.data.data.shareCode;

                if (this.loginReadyCallback) {
                    this.loginReadyCallback()
                    this.loginReadyCallback = null;
                }

                this.globalData.loading = false;
            });
    },
    ensureLogin: function (shareCode) {
        let ensureUserLogined = null;
        let authorize = () => {
            return Tool.wx.showModal({
                showCancel: false,
                title: '微信授权',
                content: '新乐汇微名片需要获得你的公开信息（昵称、头像等）'
            }).then(res => {
                if (res.confirm) {
                    return this.login(shareCode, true)
                        .catch(ensureUserLogined);
                } else {
                    return authorize();
                }
            });

        };
        ensureUserLogined = (err) => {
            if (/^getUserInfo:fail auth deny$/i.test(err.message)) {
                return authorize();
            }
        };

        return this.login(shareCode)
            .catch(ensureUserLogined);
    },
    onLaunch: function (options) {
        let shareCode;
        if (options.path === 'pages/backPage/backPage' && options.query.shareCode) {
            shareCode = options.query.shareCode;
        }
        this.ensureLogin(shareCode);
    },
    onShow: function (options) {
        let shareCode;
        if (options.path === 'pages/backPage/backPage' && options.query.shareCode) {
            shareCode = options.query.shareCode;
        }
        
        if ((!this.globalData.nowToken || shareCode) && options.reLaunch === 1) {
            this.ensureLogin(shareCode);
        }
    },
    globalData: {
        userInfo: null,
        nowToken: '',
        shareCode: '',
        cardList: [],
        clipCardList: [],
        loading: true
    }
})