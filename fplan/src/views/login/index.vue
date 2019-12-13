<template>
  <div class="home">
    <div class="top outer_box">
      <div :style="{'background-image': `url(${imgurlL})`}" class="saas_left_img"/>
      <div :style="{'background-image': `url(${imgurlR})`}" class="saas_right_img"/>
      <div class="section max-width-1440">
        <div class="saas_content">
          <div class="saas_left">
            <div class="saas_title">与万千企业共同开启智能时代</div>
            <div class="saas_sub_title">噢蹦智能锁管理云平台</div>
            <div class="saas_contact">
              <div class="saas_contact_item"><img class="saas_icon_ke" src="../../assets/ic_service.png">客服专线：800-8208820</div>
              <div class="saas_contact_item"><img class="saas_icon_you" src="../../assets/ic_mail.png">邮箱：bd@whoareyou.live</div>
            </div>
            <div class="saas_company">©2014-2019 上海互啊佑智能科技有限公司 版权所有</div>
          </div>
          <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="saas_box">
            <div class="saas_right">
              <div class="login_top">
                <div class="login_by_account">账号登录</div>
              </div>
              <el-form-item class="account_input" prop="username">
                <el-input v-model="loginForm.username" placeholder="您的账号"/>
              </el-form-item>
              <el-form-item class="password_input" prop="password">
                <el-input v-model="loginForm.password" type="password" placeholder="您的密码"/>
              </el-form-item>
              <div class="saas_login_btn" @click="handleLogin('loginForm')">登录</div>
              <div class="saas_login_forget">忘记密码 <i class="el-icon-question"/></div>
              <div class="saas_login_apply">还没有开通帐号？ 点此申请开通 >></div>
            </div>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import imgurlR from '../../assets/bg_saas_right.png'
import imgurlL from '../../assets/bg_saas_left.png'
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (validateUsername == null) {
        callback(new Error('请输入正确的管理员用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('管理员密码长度应大于6'))
      } else {
        callback()
      }
    }
    return {
      imgurlL: imgurlL,
      imgurlR: imgurlR,
      loginForm: {
        username: 'admin123',
        password: 'admin123'
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      loading: false
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }

  },
  created() {
    // window.addEventListener('hashchange', this.afterQRScan)
  },
  destroyed() {
    // window.removeEventListener('hashchange', this.afterQRScan)
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        // this.$router.push({ path: this.redirect || '/' })
        if (valid && !this.loading) {
          this.loading = true
          this.$store.dispatch('LoginByUsername', this.loginForm).then(() => {
            this.loading = false
            this.$router.push({ path: this.redirect || '/' })
          }).catch(response => {
            this.$notify.error({
              title: '失败',
              message: response.errmsg
            })
            this.loading = false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style>
.login-main {
  height: 100%;
  overflow: hidden;
}

.login-from {
  position: absolute;
  top: 20%;
  left: 50%;
  margin-left: -150px;
  width: 350px;
  background-color: rgba(255, 255, 255, 0.3);
  padding: 20px 30px 10px;
  box-shadow: 0 0 2px 3px #e8e8e8;
}

.login-btn {
  text-align: center;
}

.login-btn button {
  width: 120px;
}
.home {
  background: #fff;
}
.saas_left_img{
  position: absolute;
  left: 0;
  bottom: 0;
  width: 349px;
  height: 585px;
  background-size: 100% auto;
  z-index: 1;
}
.saas_content{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 132px 0;
}
.saas_title{
  width: 298px;
  font-size: 36px;
  line-height: 2;
}
.saas_sub_title{
  font-size: 24px;
  margin-top: 40px;
}
.saas_contact{
  font-size: 14px;
  margin-top: 80px;
  line-height: 3;
}
.saas_company{
  font-size: 12px;
  color: #676C75;
  padding-top: 60px;
}
.saas_right{
  padding: 35px 70px;
  position: relative;
  z-index: 88;
}
.saas_box{
  width: 570px;
  height: 570px;
  box-shadow: 0px 1px 10px 0px rgba(32,33,39,0.1);
  border-radius:6px;
  margin-right: 5px;
  background-color: #fff;
}
.outer_box {
  max-width: 1110px;
  margin: 0 auto;
}
.saas_right_img{
  position: absolute;
  right: 0;
  top: 204px;
  width: 349px;
  height: 585px;
  background-size: 100% auto;
  z-index: 1;
}
.saas_right{
  padding: 35px 70px;
}
.saas_box{
  width: 570px;
  height: 570px;
  box-shadow: 0px 1px 10px 0px rgba(32,33,39,0.1);
  border-radius:6px;
  margin-right: 5px;
  background-color: #fff;
}
.login_top{
  display: flex;
  flex-direction: row;
  font-size: 20px;
  margin-bottom: 36px;
}
.login_by_password{
  color: #999EA8;
  margin-left: 56px;
}
.account_input , .password_input{
  margin-bottom: 30px;
}
.account_input input, .password_input input{
  width:410px;
  height:50px;
  background:rgba(248,249,250,1);
  border:1px solid rgba(231, 232, 234, 1);
  border-radius:6px;
  outline: none;
  padding-left: 20px;
}
.saas_login_btn{
  width:430px;
  height:50px;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  background:rgba(9,25,40,1);
  font-size:17px;
  box-shadow:0px 6px 12px 0px rgba(40,43,49,0.08);
  border-radius:6px;
  cursor: pointer;
}
.saas_login_forget{
  text-align: right;
  font-size: 14px;
  margin-top: 20px;
  margin-bottom: 56px;
}
.saas_login_apply{
  text-align: center;
  font-size: 14px;
}
.saas_icon_ke{
  width: 20px;
  height: 22px;
  margin-right: 9px;
}
</style>
