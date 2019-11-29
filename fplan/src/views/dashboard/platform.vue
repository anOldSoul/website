<template>
  <div class="page">
    <div class="platform-title">图正噢蹦运营管理平台</div>
    <div class="content">      
      <div class="left-box">
        <div class="charts-line">
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
        <div class="charts-pie">
          <div id="container0" class="chart-container" style="height: 250px;"></div>
        </div>
        <div id="container1" class="chart-container" style="height: 400px;"></div>
      </div>
      <div class="map-box">
        <div id="container2" class="chart-container" style="height: 450px;"></div>
        <div class="marquee">
          <div class="chart-title">
            <div class="marquee_column1">开锁房间</div>
            <div class="marquee_column2">开锁时间</div>
            <div class="marquee_column3">开锁类型</div>
          </div>
          <div class="marquee_box">
            <div class="marquee_list" :class="{'marquee_top':animate}">
              <div v-for="(item, index) in marqueeList" class="marquee_item">
                <div class="marquee_row">
                  <div class="marquee_column1">上海市浦东大道101号万科花园1001室</div>
                  <div class="marquee_column2">2019-9-28 20：05：22</div>
                  <div class="marquee_column3">指纹开锁</div>
                </div>
                <div class="marquee_row">
                  <div class="marquee_column1">上海市浦东大道101号万科花园1002室</div>
                  <div class="marquee_column2">2019-9-28 20：05：22</div>
                  <div class="marquee_column3">指纹开锁</div>
                </div>
                <div class="marquee_row">
                  <div class="marquee_column1">上海市浦东大道101号万科花园1003室</div>
                  <div class="marquee_column2">2019-9-28 20：05：22</div>
                  <div class="marquee_column3">指纹开锁</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="charts-box">
        <div class="charts-pie">
          <div id="container4" class="chart-container" style="height: 250px;"></div>
        </div>
        <div class="marquee1">
          <div class="chart-title" style="color: red;">
           <div class="marquee_column1">报警房间</div>
           <div class="marquee_column2">报警时间</div>
          </div>
          <div class="marquee_box1">
            <div class="marquee_list" :class="{'marquee_top':animate}">
             <div v-for="(item, index) in marqueeList" class="marquee_item">
               <div class="marquee_row">
                 <div class="marquee_column1">上海市浦东大道101号万科花园1001室</div>
                 <div class="marquee_column2">2019-9-28 20：05：22</div>
               </div>
               <div class="marquee_row">
                 <div class="marquee_column1">上海市浦东大道101号万科花园1002室</div>
                 <div class="marquee_column2">2019-9-28 20：05：22</div>
               </div>
               <div class="marquee_row">
                 <div class="marquee_column1">上海市浦东大道101号万科花园1003室</div>
                 <div class="marquee_column2">2019-9-28 20：05：22</div>
               </div>
             </div>
            </div>
          </div>
        </div>
        <div class="charts-bar">
          <div id="container3" class="chart-container"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Highcharts from 'highcharts'
import Highmaps from 'highcharts/modules/map'
import HighchartsMore from 'highcharts/highcharts-more'
import SolidGauge from 'highcharts/modules/solid-gauge.js'
import china from './china'
Highmaps(Highcharts);
HighchartsMore(Highcharts)
SolidGauge(Highcharts);
import countTo from 'vue-count-to'
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
      animate: false,
      marqueeList: [
        {
          name: '1军',
          city: '北京',
          amount: '10'
        },
        {
          name: '2军',
          city: '上海',
          amount: '20'
        },
        {
          name: '3军',
          city: '广州',
          amount: '30'
        },
        {
          name: '4军',
          city: '重庆',
          amount: '40'
        }
      ],
      tableData: [] // 必须
    }
  },
  computed: {},

  methods: {
    fetchMapChart () {
      let data = [{
        city: '北京',
        value: 5000
      },{
        city: '上海',
        value: 2000
      },{
        city: '广东',
        value: 2200
      },{
        city: '浙江',
        value: 1800
      },{
        city: '福建',
        value: 1000
      }]
      let config = {
        chart: {
          backgroundColor: '#0f1e3f'
        },
        title: {
          text: '平台数据分布',
          style: {
            color: '#1ee5e2'
          }
        },
        mapNavigation: {
          enabled: true,
          buttonOptions: {
            verticalAlign: 'bottom'
          }
        },
        series: [{
          data: data,
          mapData: china,
          joinBy: ['name', 'city'],
          name: '中国地图'
        }]
      }
      Highcharts.Map('container2', config)
    },
    fetchBarChart () {
      let config = {
        chart: {
          type: 'column',
          backgroundColor: '#0f1e3f'
        },
        title: {
          text: '故障申报统计',
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
            borderWidth: 0
          }
        },
        series: [{
          name: '',
          data: [49, 71, 106, 129, 144, 176, 135, 148, 216, 194, 95, 54]
        }]
      }
      Highcharts.chart(`container3`, config)
    },
    fetchPieChart () {
      let config = {
        chart: {
          backgroundColor: '#0f1e3f',
          spacing : [40, 0 , 40, 0]
        },
        title: {
          floating:false,
          text: '入住率',
          style: {
            color: '#1ee5e2'
          }
        },
        colors: ['#2ec3c3', '#fffc00'],
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %',
              style: {
                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
              }
            }
          }
        },
        series: [{
          type: 'pie',
          innerSize: '60%',
          name: '占比',
          data: [
            ['待租', 6.2],
            ['已租', 5.7]
          ]
        }]
      }
      Highcharts.chart(`container0`, config)
    },
    fetchWarning () {
      let config = {
        chart: {
          backgroundColor: '#0f1e3f',
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
    fetchLineChart: function () {
      let config = {
        chart: {
          backgroundColor: '#0f1e3f',
          type: 'line'
        },
        title: {
          text: '入户趋势',
          style: {
            color: '#1ee5e2'
          }         
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
    },
    showMarquee: function () {
      this.animate = true
      setTimeout (() => {
          this.marqueeList.push (this.marqueeList[ 0 ])
          this.marqueeList.shift ()
          this.animate = false
      }, 500)
    }
  },
  mounted: function () {
    this.fetchLineChart()
    this.fetchBarChart()
    this.fetchPieChart()
    this.fetchMapChart()
    this.fetchWarning()
    setInterval (this.showMarquee, 2000)
  }
}
</script>
<style scoped>
.page{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #0b122e;
  color: #1ee5e2;
}
.num {
  font-size: 40px;
  font-weight: bold;
  color: #1989fa;
  margin-top: 30px;
}
.content {
  display: flex;
  flex-direction: row;
}
.left-box {
  width: 24%;
  display: flex;
  flex-direction: column;
  margin-right: 1%;
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
.charts-pie {
  margin-bottom: 20px;
}
.map-box {
  width: 50%;
  margin-right: 1%;
}
.charts-box {
  width: 24%;
}
.chart-container {
  width: 100%;
  height: 300px;
}
.page >>> .highcharts-credits {
  display: none !important;
}
.chart-title {
  width: 100%;
  font-weight: 900;
  color: #1ee5e2;
  padding: 15px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.el-icon-info{
  color: green;
}
.platform-title {
  text-align: center;
  font-size: 30px;
  margin-bottom: 30px;
}
.charts-line {
  height: 300px;
}
.marquee {
  width: 100%;
  height: 330px;
  align-items: center;
  background-color: #0f1e3f;
  display: flex;
  color: #fff;
  flex-direction: column;
  box-sizing: border-box;
  margin-top: 20px;
  font-size: 15px;
}
.marquee1 {
  width: 100%;
  height: 225px;
  align-items: center;
  background-color: #0f1e3f;
  display: flex;
  color: #fff;
  flex-direction: column;
  box-sizing: border-box;
  margin-bottom: 20px;
  font-size: 13px;
}
.marquee_box1 {
  display: block;
  position: relative;
  padding: 15px;
  width: 100%;
  height: 200px;
  overflow: hidden;
}
.marquee_box {
  display: block;
  position: relative;
  padding: 15px;
  width: 100%;
  height: 260px;
  overflow: hidden;
}

.marquee_list {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}

.marquee_top {
  transition: all 0.5s;
  margin-top: -60px;
}

.marquee_list marquee_item {
  height: 100px;
  padding-left: 20px;
}
.marquee_row {
  padding: 2px 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.marquee_column1 {
  display: flex;
  flex: 2.4;
}
.marquee_column2 {
  display: flex;
  flex: 1.5;
}
.marquee_column3 {
  display: flex;
  flex: 1;
}
</style>
