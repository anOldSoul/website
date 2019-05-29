<template>
  <div class="page">
    <div class="btn-wrap">
      <el-button size="small" @click="$router.back()">返回</el-button>
    </div>
    <el-table :data="tableData" style="width: 100%" :row-key="rowKey">
      <el-table-column prop="lockwd" label="密码"></el-table-column>
      <el-table-column label="密码类型">
        <template slot-scope="scope">{{pwStr[scope.row.downstat]}}</template>
      </el-table-column>
      <el-table-column label="申请时间" width="200">
        <template slot-scope="scope">{{(scope.row.reqtime) ? $moment(scope.row.reqtime, "YYYYMMDDHH:mm:ss").format("YYYY.MM.DD HH:mm:ss") : ''}}</template>
      </el-table-column>
      <el-table-column label="下发时间" width="200">
        <template slot-scope="scope">{{(scope.row.downtime) ? $moment(scope.row.downtime, "YYYYMMDDHH:mm:ss").format("YYYY.MM.DD HH:mm:ss") : ''}}</template>
      </el-table-column>
      <el-table-column label="下发状态" width="250">
        <template slot-scope="scope">{{statLabel[scope.row.downstat]}}</template>
      </el-table-column>
      <el-table-column label="操作" width="160" class-name="cell-cneter" fixed="right">
        <template slot-scope="scope">
          <template>
            <el-button type="text" :disabled="scope.row.downstat !== '0'" @click="handleOpen(scope.row)">编辑</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="编辑密码" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="form.lockwd" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码类型" :label-width="formLabelWidth">
          <el-select v-model="form.lockwdtype" placeholder="请选择密码类型">
            <el-option label="2分钟内有效" value="1"></el-option>
            <el-option label="5分钟内有效" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handlePatch">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'provisions-list',
  components: {
  },
  props: {
  },
  activated () {
    this.fetchData()
  },
  data () {
    return {
      currentRow: {},
      form: {
        lockwd: '',
        lockwdtype: ''
      },
      pwStr: {
        '1': '2分钟内有效',
        '2': '5分钟内有效'
      },
      statLabel: {
        '0': '锁具上送密码申请，等待密码设置',
        '1': '密码已设置，等待服务器下发密码',
        '2': '密码已通过服务器下发至锁具'
      },
      dialogFormVisible: false,
      formLabelWidth: '120px',
      tableData: [], // 必须
      query: {}
    }
  },
  computed: {},

  methods: {
    handleOpen(row) {
      this.dialogFormVisible = true
      this.form = row
    },
    handlePatch () {
      if (this.form.lockwd.length < 6) {
        this.$message({
          message: '密码至少6位',
          type: 'warning'
        })
        return
      }
      Site.http.patch(
        '/tLockPwInfo/updateLockPassWord', {
          lockid: this.form.lockid,
          lockwd: this.form.lockwd,
          lockwdtype: this.form.lockwdtype,
          reqip: this.form.reqip,
          reqprot: this.form.reqprot,
          reqtime: this.form.reqtime
        },
        data => {
          if (data.data) {
            this.$message({
              message: '保存成功',
              type: 'success'
            })
            this.dialogFormVisible = false
            this.fetchData()
          }
        }
      )
    },
    handleCurrentChange (val) {passWordType
      this.searchModel.pageNo = +val
      this.fetchData()
    },
    fetchData: function () {
      Site.http.get(
        '/tLockPwInfo/getOneLockPw', {
          lockId: this.$route.params.id
        },
        data => {
          this.tableData = data.data
        }
      )
    },
    rowKey (row) {
      return row._id
    }
  },
  mounted: function () {
  }
}
</script>
<style scoped>
.form {
  width: 80%;
}
.noticeContent{
  padding: 30px;
}
</style>
