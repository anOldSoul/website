<template>
  <div class="page">
    <div class="top-box">
      <div class="charts-bar">
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
      <div class="charts-bar">
        <div class="chart-title">入住率</div>
        <div id="container0" class="chart-container"></div>
      </div>
    </div>
    <div class="charts-box">
      <div class="chart-title">住户趋势</div>
      <div id="container1" class="chart-container"></div>
    </div>
  </div>
</template>
<script>
import Highcharts from 'highcharts'
import countTo from 'vue-count-to';
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
    fetchBarChart () {
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
.charts-bar {
  width: 50%;
}
.charts-box {
  width: 100%;
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
