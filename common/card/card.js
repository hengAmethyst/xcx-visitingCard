Component({
  properties: {
    /**
     * 卡片类型：white, black, red
     */
    type: {
      type: String,
      value: 'black'
    },
    /**
     * info.name
     * info.position
     * info.logo
     * info.company
     * info.field1
     * info.field2
     * info.field3
     */
    info: {
      type: Object,
      value: {
        logo: '',
        name: '新乐汇小程序',
        position: '',
        company: '上海金沙江西路568号B栋9楼',
        phone: '400-6858-188',
        otherOne: 'www.newjoys.cn',
        otherTwo: '',
        otherThree: ''
      }
    }
  }
})