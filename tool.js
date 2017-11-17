const ENV = 'dev'
const debug = (function() {
  if (ENV !== 'dev') {
    return function() {};
  }
  return function() {
    console.log.apply(console, arguments);
  };
})();
exports.debug = debug;

export const uploadUrl = 'http://192.168.2.9:9080/jinghan-fastdfs/fdfs/upload.shtml';
const svcHostUrl = 'http://cardtest.jinghanit.com/jinghan-card';
export const svcUrl = {
  cardLabel: {
    delete: svcHostUrl + '/card/v2/card-label/delete',
    list: svcHostUrl + '/card/v2/card-label/list',
    save: svcHostUrl + '/card/v2/card-label/save'
  },
  cardInfo: {
    delete: svcHostUrl + '/card/v2/card-info/delete',
    list: svcHostUrl + '/card/v2/card-info/list',
    save: svcHostUrl + '/card/v2/card-info/save',
    detail: svcHostUrl +'/card/v2/card-info/cardInfo'
  },
  user: {
    list: svcHostUrl + '/card/v2/user/list',
    login: svcHostUrl + '/card/v2/user/login',
    accessToken: svcHostUrl+'/card/v2/user/accessToken',
  },
  collection: {
    delete: svcHostUrl + '/card/v2/collection/delete',
    list: svcHostUrl + '/card/v2/collection/list',
    save: svcHostUrl + '/card/v2/collection/save'
  }
};

/**
 * 自定义 Error 类
 */
export function VCError(message, code, extra) {
  if (!Error.captureStackTrace) {
    this.stack = (new Error()).stack;
  } else {
    Error.captureStackTrace(this, this.constructor);
  }
  this.message = message;
  this.code = code;
  this.extra = extra;
}

VCError.prototype = new Error();
VCError.prototype.name = 'VCError';
VCError.prototype.constructor = VCError;

// 可以把 wx 对象里的方法(传入参数中包含 success 和 fail)转换为返回 promise 的方法
function promisifyWx(name) {
  return function (param) {
    debug('wx.' + name + ' [executing] ->', param);
    return new Promise((resolve, reject) => {
      let base = {
        success: (res) => {
          debug('wx.' + name + ' [success]:', res);
          resolve(res);
        },
        fail: (err) => {
          debug('wx.' + name + ' [fail]:', err);
          reject(new VCError(err.errMsg, -2));
        }
      };
      wx[name](Object.assign({}, param, base));
    });
  };
}

exports.wx = {};
[
  // 网络
  'request',
  'uploadFile',
  'downloadFile',

  // 媒体
  'chooseImage',
  'previewImage',
  'getImageInfo',
  'saveImageToPhotosAlbum',

  // 界面
  'showModal',

  // 开放接口
  'login',
  'authorize',
  'getUserInfo',
  'openSetting',
  'getSetting'
].forEach(name => exports.wx[name] = promisifyWx(name));


export function genReqBody(token, param) {
  let body = {
    reqId: 0,
    channel: 10,
    os: '',
    ver: '',
    appVer: '',
    model: '',
    lng: '',
    lat: '',
    signType: '',
    sign: '',
    token,
    param
  };

  return body;
}

/**
 * 对 Tool.wx.request 进一步处理
 */
export function request(url, token, param) {

  return exports.wx.request({
    url,
    method: 'POST',
    data: genReqBody(token, param)
  })
  .then(res => {
    let resBody = res.data;
    if (resBody && typeof resBody === 'object') {
      if (resBody.code === 0) {
        return resBody.data;
      } else if (resBody.showMsg) {
        throw new VCError(resBody.showMsg, resBody.code);
      } else {
        throw new VCError('Not expected response data', resBody.code || -1, resBody);
      }
    } else {
      throw new VCError('Not expected response data', -1, resBody);
    }
  });
}

export const qs = {
  stringify: function(obj) {
    if (!obj) {
      return '';
    }
    return Object.keys(obj).map(key => key + '=' + encodeURIComponent(obj[key])).join('&');
  },
  parse: function(str) {
    return str.split('&').reduce((obj, it) => {
      let arr = it.split('=');
      obj[arr[0]] = decodeURIComponent(arr[1]);
      return obj;
    }, {});
  }
};
