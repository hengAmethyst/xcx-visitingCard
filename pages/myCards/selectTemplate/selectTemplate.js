Page({
  gotoEdit(){
    wx.navigateTo({
      url: '/pages/myCards/editCard/editCard',
    })
  },
    addCard(e) {
        let category = e.currentTarget.dataset.category;
        wx.navigateTo({
            url: '../addCard/addCard?type=' + category
        })
    }
})