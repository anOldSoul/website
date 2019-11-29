<template>
  <div class="page">
    <div class="top-box">
      <div class="charts-box-left">
        <div class="chart-title">概览</div>
        <div class="today-box">          
          <div class="today-data">
            <div>今日住户 <i class="el-icon-info"></i></div>
            <div class="num"><countTo :startVal='0' :endVal='200' :duration='2000'></countTo></div>
          </div>
          <div>
            <div>住户总量 <i class="el-icon-info"></i></div>
            <div class="num"><countTo :startVal='0' :endVal='3278' :duration='2000'></countTo></div>
          </div>
        </div>
      </div>
      <div class="charts-box-right">
        <div class="charts-bar">         
          <div class="chart-title">入住率</div>
          <div id="container0" class="chart-container"></div>
        </div>
        <div class="charts-bar">         
          <div class="chart-title">告警数</div>
          <div id="container4" class="chart-container"></div>
        </div>
      </div>
    </div>
    <div class="charts-box">
      <div class="charts-bar">
        <div class="chart-title">住户趋势</div>
        <div id="container1" class="chart-container"></div>
      </div>
      <div class="charts-bar">
        <div class="chart-title">故障申报统计</div>
        <div id="container3" class="chart-container"></div>
      </div>
    </div>
  </div>
</template>
<script>
import Highcharts from 'highcharts'
import countTo from 'vue-count-to'
import HighchartsMore from 'highcharts/highcharts-more'
import SolidGauge from 'highcharts/modules/solid-gauge.js'
HighchartsMore(Highcharts)
SolidGauge(Highcharts)
export default {
  name: 'Statistics',
  components: {
    countTo
  },
  props: {
  },
  activated () {
  },
  data () {
    return {
      tableData: [] // 必须
    }
  },
  computed: {},

  methods: {
    fetchWarning () {
      let config = {
        chart: {
          type: 'solidgauge',
          plotBackgroundColor: null,
          plotBackgroundImage: null,
          plotBorderWidth: 0,
          plotShadow: false
        },
        title: {
          text: '',
        },
        pane: {
          startAngle: -150,
          endAngle: 150,
          background: [{
            backgroundColor: {
              linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
              stops: [
                [0, '#FFF'],
                [1, '#333']
              ]
            },
            borderWidth: 0,
            outerRadius: '109%'
          }, {
            backgroundColor: {
              linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
              stops: [
                [0, '#333'],
                [1, '#FFF']
              ]
            },
            borderWidth: 1,
            outerRadius: '107%'
          }, {
            // default background
          }, {
            backgroundColor: '#DDD',
            borderWidth: 0,
            outerRadius: '105%',
            innerRadius: '103%'
          }]
        },
        // the value axis
        yAxis: {
          min: 0,
          max: 200,
          minorTickInterval: 'auto',
          minorTickWidth: 1,
          minorTickLength: 10,
          minorTickPosition: 'inside',
          minorTickColor: '#666',
          tickPixelInterval: 30,
          tickWidth: 2,
          tickPosition: 'inside',
          tickLength: 10,
          tickColor: '#666',
          labels: {
            step: 2,
            rotation: 'auto'
          },
          title: {
            text: '告警',
            style: {
              color: 'red'
            }
          },
          plotBands: [{
            from: 0,
            to: 120,
            color: '#55BF3B' // green
          }, {
            from: 120,
            to: 160,
            color: '#DDDF0D' // yellow
          }, {
            from: 160,
            to: 200,
            color: '#DF5353' // red
          }]
        },
        series: [{
          name: '告警',
          data: [80],
          tooltip: {
            valueSuffix: ' '
          }
        }]
      }
      Highcharts.chart(`container4`, config)
    },
    fetchPieChart () {
      let config = {
        chart: {
          spacing : [40, 0 , 40, 0]
        },
        title: {
          floating:true,
          text: ''
        },
        colors: ['#2ec3c3', '#3299f7'],
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer'
          }
        },
        series: [{
          type: 'pie',
          innerSize: '60%',
          name: '市场份额',
          data: [
            ['待租',     6.2],
            ['已租',   5.7]
          ]
        }]
      }
      Highcharts.chart(`container0`, config)
    },
    fetchLineChart: function () {
      let config = {
        chart: {
          type: 'line'
        },
        title: {
          text: ''
        },
        xAxis: {
          categories: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
        },
        yAxis: {
          title: {
            text: '入住人数'
          }
        },
        colors: ['#1989fa', '#2fc25b'],
        plotOptions: {
          line: {
            dataLabels: {
              // 开启数据标签
              enabled: false          
            },
            // 关闭鼠标跟踪，对应的提示框、点击事件会失效
            enableMouseTracking: true
          }
        },
        series: [{
          name: '全部',
          data: [7.0, 6.9, 9.5, 14.5, 18.4, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
        }, {
          name: '新增',
          data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
        }]
      }
      Highcharts.chart(`container1`, config)
    },
    fetchBarChart () {
      let config = {
        chart: {
          type: 'column'
        },
        title: {
          text: '',
          style: {
            color: '#1ee5e2'
          }
        },
        xAxis: {
          categories: [
            '一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'
          ],
          crosshair: true
        },
        yAxis: {
          min: 0,
          title: {
            text: '告警数'
          }
        },
        tooltip: {
          // head + 每个 point + footer 拼接成完整的 table
          headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
          pointFormat: '<tr><td style="color:{series.color};padding:0"></td>' +
          '<td style="padding:0"><b>{point.y}次 </b></td></tr>',
          footerFormat: '</table>',
          shared: true,
          useHTML: true
        },
        plotOptions: {
          column: {
            borderWidth: 0,
            color: '#f54c30'
          }
        },
        series: [{
          name: '',
          data: [49, 71, 106, 129, 144, 176, 135, 148, 216, 194, 95, 54]
        }]
      }
      Highcharts.chart(`container3`, config)
    },
    fetchProvinces: function () {
      Site.http.get(
        '/biz/questionnaire/aggregateByProvince', {
        },
        data => {
          let resultData = data.result
          for (let province in resultData) {
            this.tableData.push({
              no: resultData[province],
              province: province
            })
          }
        }
      )
    },
    rowKey (row) {
      return row._id
    }
  },
  mounted: function () {
    this.fetchLineChart()
    this.fetchPieChart()
    this.fetchWarning()
    this.fetchBarChart()
  }
}
</script>
<style scoped>
.page{
  width: 95%;
  margin-left: 2%;
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  background: #fff;
}
.num {
  font-size: 40px;
  font-weight: bold;
  color: #1989fa;
  margin-top: 70px;
}
.top-box {
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;
}
.today-box {
  display: flex;
  flex-direction: row;
  margin-top: 40px;
  margin-left: 20px;  
}
.today-data {
  width: 50%;
}
.charts-box-left {
  width: 40%;
}
.charts-box-right {
  width: 60%;
  display: flex;
  flex-direction: row;
}
.charts-bar {
  width: 48%;
  margin-right: 2%;
}
.charts-box {
  width: 100%;
  display: flex;
  flex-direction: row;
}
.chart-container {
  width: 100%;
  height: 300px;
}
.page >>> .highcharts-credits {
  color: #fff !important;
  fill: #fff !important;
}
.chart-title {
  font-weight: 900;
  margin-bottom: 15px;
}
.el-icon-info{
  color: green;
}
</style>
