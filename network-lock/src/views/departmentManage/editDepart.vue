<template>
  <div>公寓</div>
</template>
<script>
export default {
  name: 'Department',
  components: {
  },
  props: {
  },
  activated () {
  },
  data () {
    return {
      input5: '',
      select: '',
      activeName: 0,
      activeTab: 'first'
    }
  },
  computed: {},
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    }
  },
  mounted: function () {
  }
}
</script>
<style scoped>
.fullH {
  height: 100%;
}
.box-card{
  width: 200px;
  margin: 10px;
}
.text.item{
  height: 50px;
  display: flex;
  flex-direction: flex;
  justify-content: space-between;
  align-items: center;
}
.page >>> .el-collapse-item__header{
  padding: 0 10px;
}
.page >>> .el-collapse-item__content{
  /*width: 100%;*/
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
</style>
