const app = getApp()

Page({
  data: {
    receiveStoreId: '',
    isDefault: false,
    inputTextArea: '',
    inputDetailInput: '',
    address: '',
    storeList: [],
    orderItemList: [],
    inputAreaInput: '',
    inputTel: '',
    inputName: '',
    ifBySelf: true,
    items: [],
    array: [],
    index: 0,
    ifHome: false,
    addressId: '',
    storeId: '',
    userId: '',
    deliveryMode: 'PICKUP_STORE'
  },
  onLoad: function (option) {
    let storeId = wx.getStorageSync('YJF_STORE_ID')
    let userId = wx.getStorageSync('YJF_UERID')
    new app.ToastPannel()
    if (option.item) {
      let item = JSON.parse(option.item)
      this.data.addressId = item.id
      this.setData({
        inputName: item.receiverName,
        inputTel: item.receiverPhone,
        deliveryMode: item.deliveryMode,
        inputAreaInput: item.placeLocation,
        inputDetailInput: item.detailAddress,
        receiveStoreId: item.receiveStoreId,
        isDefault: item.isDefaultAddress === 1,
        ifHome: item.deliveryMode === 'DELIVER_TO_HOME',
        ifBySelf: item.deliveryMode === 'PICKUP_STORE'
      })
    }
    this.setData({
      storeId,
      userId
    })
    this.getStores()
  },
  switchChange: function (e) {
    // console.log(e.detail.value)
    this.data.isDefault = e.detail.value
  },
  getDelivery: function () {
    let data = {
      storeId: this.data.storeId
    }
    app.post(app.Apis.GET_DELIVERY, data, result => {
      if (result.success) {
        let tempItems = []
        result.dataList.forEach((item, index) => {
          if (item == 'deliverToHome') {
            tempItems.push({
              value: 'DELIVER_TO_HOME',
              name: '送货到家'
            })
          } else if (item == 'pickUpStore') {
            tempItems.push({
              value: 'PICKUP_STORE',
              name: '门店自提'
            })
            this.getStores()
          }
        })
        this.setData({
          items: tempItems
        })
      }
    })
  },
  bindPickerChange: function (e) {
    // console.log(e)
    this.setData({
      index: e.detail.value,
      address: this.data.storeList[e.detail.value].address
    })
  },
  getStores: function (resolve) {
    let data = {
      mainStoreId: this.data.storeId
    }
    app.post(app.Apis.GET_STORES, data, result => {
      if (result.success) {
        if (resolve) {
          resolve()
        }
        let storeList = result.dataList
        let tempArr = []
        let activeAddressIndex = 0
        let address = storeList[0].address
        storeList.forEach((item, index) => {
          tempArr.push(item.branchStoreName)
          if (this.data.receiveStoreId && this.data.receiveStoreId == item.branchStoreId) {
            address = item.address
            activeAddressIndex = index
          }
        })
        this.setData({
          storeList,
          array: tempArr,
          address,
          index: activeAddressIndex
        })
      }
    })
  },
  radioChange: function (e) {
    // console.log(e)
    this.setData({
      deliveryMode: e.detail.value
    })
    if (e.detail.value == 'PICKUP_STORE') {
      this.setData({
        ifBySelf: true,
        ifHome: false
      })
      // console.log(this.data.ifBySelf)
    } else {
      this.setData({
        ifHome: true,
        ifBySelf: false
      })
    }
    if (this.data.ifBySelf) {
      new Promise((resolve, reject) => {
        this.getStores(resolve)
      }).then(() => {
        this.setData({
          address: this.data.storeList[0].address
        })
      })
    }
  },
  bindNameInput: function (e) {
    this.setData({
      inputName: e.detail.value
    })
  },
  bindTelInput: function (e) {
    this.setData({
      inputTel: e.detail.value
    })
  },
  bindAreaInput: function (e) {
    this.setData({
      inputAreaInput: e.detail.value
    })
  },
  bindKeyInput: function (e) {
    this.setData({
      inputDetailInput: e.detail.value
    })
  },
  handleMakeSure: function () {
    if (!this.data.inputName) {
      this.show('请输入收货人！')
      return
    } else if (!this.data.inputTel) {
      this.show('请输入联系电话！')
      return
    } else {
      if (!this.data.deliveryMode) {
        this.show('请选择配送方式！')
      } else {
        let data = {
          storeId: this.data.storeId,
          userId: this.data.userId,
          receiverName: this.data.inputName,
          receiverPhone: this.data.inputTel,
          isDefaultAddress: this.data.isDefault ? 1 : 0,
        }
        if (!this.data.ifBySelf) {
          if (!this.data.inputAreaInput) {
            this.show('请输入所在地区！')
            return
          } else if (this.data.inputDetailInput.length < 4) {
            this.show('请输入详细地址,不少于5个字！')
            return
          } else {
            data.placeLocation = this.data.inputAreaInput
            data.detailAddress = this.data.inputDetailInput
            data.deliveryModeEnum = 'DELIVER_TO_HOME'
          }
        } else {
          data.deliveryModeEnum = 'PICKUP_STORE'
          data.receiveStoreId = this.data.storeList[this.data.index].branchStoreId
        }
        if (this.data.addressId) {
          data.addressId = this.data.addressId
        }
        app.post(app.Apis.POST_ADDRESS, data, result => {
          if (result.success && result.id) {
            this.show('添加成功')
            wx.navigateBack({
              delta: 1
            })
          } else if (result.success && !result.id) {
            this.show('添加失败')
          }
        })
      }
    }
  }
})
