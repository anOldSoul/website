<template>
  <div class="page">
    <el-table :data="tableData" class="table-layout" :row-key="rowKey">
      <el-table-column prop="no" label="参与次数"></el-table-column>
      <el-table-column prop="province" label="省份"></el-table-column>
    </el-table>
    <div class="charts-box">
      <div id="container1" class="chart-container"></div>
      <div id="container2" class="chart-container"></div>
      <div id="container3" class="chart-container"></div>
      <div id="container4" class="chart-container"></div>
      <div id="container5" class="chart-container"></div>
      <div id="container6" class="chart-container"></div>
    </div>
  </div>
</template>
<script>
import Highcharts from 'highcharts'
export default {
  name: 'Statistics',
  components: {
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
    fetchAggregateByAnswer: function (i) {
      Site.http.get(
        '/biz/questionnaire/aggregateByAnswer', {
          key: `answer${i}`
        },
        data => {
          let chartData = data.result
          let seriesData = []
          for (let key in chartData) {
            seriesData.push({
              name: key,
              y: chartData[key]
            })
          }
          this.draw(i, seriesData)
        }
      )
    },
    draw: function(i, seriesData) {
      Highcharts.chart(`container${i}`, {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie',
          width: 350,
          height: 350
        },
        title: {
          text: i === 6 ? '推荐结果' : `第${i}题答题统计`
        },
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
          name: 'Brands',
          colorByPoint: true,
          data: seriesData
        }]
      })
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
    // this.fetchProvinces()
    // for (let i = 1; i < 7; i++) {
    //    this.fetchAggregateByAnswer(i)
    // }
  }
}
</script>
<style scoped>
.page{
  display: flex;
  flex-direction: row;
}
.table-layout{
  width: 25%;
}
.charts-box{
  width: 70%;
  margin: 0 20px;
  float: right;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
</style>
