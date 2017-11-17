// 适配不同屏幕宽度
export default function adapter(that,res){
  if (res.screenWidth < 330) {
    if (that.data.nowType == "red") {
      that.setData({
        needDel_x: 30,
        needDel_y: 50,
        textDel_x: 90,
        textDel_y: 0
      })
    }
    else {
      that.setData({
        needDel_x: 85,
        needDel_y: 50,
        textDel_y: 0
      })
    }

  }
  else if (res.screenWidth > 330 & res.screenWidth <= 360) {
    if (that.data.nowType == 'red') {
      that.setData({
        needDel_x: 0,
        needDel_y: 0,
        textDel_x: 0,
        textDel_y: 0
      })
    }
    else {
      that.setData({
        needDel_x: 85,
        needDel_y: 30,
        textDel_x: 30,
        textDel_y: 0
      })
    }
  }
  else {
    if (that.data.nowType == 'red') {
      that.setData({
        needDel_x: 0,
        needDel_y: 0,
        textDel_x: 0,
        textDel_y: 0
      })
    }
    else{
        that.setData({
        needDel_x: 0,
        needDel_y: 0
      })
    }
  }
}