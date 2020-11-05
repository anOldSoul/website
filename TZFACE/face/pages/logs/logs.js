var wxCharts = require('../../utils/wxcharts.js');
var app = getApp();
var ringChart = null;
Page({
  data: {
    date: '2016-09-01',
    select: 0,
    navBar: [{
      name: '实时统计'
    }, {
      name: '周月统计'
    }, {
      name: '我的'
    }]
  },
  touchHandler: function (e) {
    console.log(ringChart.getCurrentDataIndex(e));
  },
  handleSelect(e) {
    console.log(e)
    this.setData({
      select: e.currentTarget.dataset.index
    })
  },
  updateData: function () {
    ringChart.updateData({
      title: {
        name: '80%'
      },
      subtitle: {
        color: '#ff0000'
      }
    });
  },
  onReady: function (e) {
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    ringChart = new wxCharts({
      animation: true,
      canvasId: 'ringCanvas',
      type: 'ring',
      extra: {
        ringWidth: 5,
        pie: {
          offsetAngle: -45
        }
      },
      title: {
        name: '1 / 6',
        color: '#1686fa',
        fontSize: 25
      },
      subtitle: {
        name: '打卡人数 / 应到人数',
        color: '#666666',
        fontSize: 12
      },
      series: [{
        name: '成交量1',
        data: 15,
        color: '#1686fa',
        stroke: false
      }, {
        name: '成交量2',
        data: 35,
        color: '#ececec',
        stroke: false
      }],
      disablePieStroke: true,
      width: windowWidth,
      height: 200,
      dataLabel: false,
      legend: false,
      background: '#ffffff',
      padding: 0
    });
    ringChart.addEventListener('renderComplete', () => {
      console.log('renderComplete');
    });
    setTimeout(() => {
      ringChart.stopAnimation();
    }, 500);
  }
});