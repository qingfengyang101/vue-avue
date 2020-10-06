<template>
  <div class="login-container">
    <div class="login-content">
      <h1>U家社区管理平台</h1>
      <h1>SHENGCHUANGZN</h1>
      <el-card class="box-card-login">
        <p class="login-box-title">用户登录</p>
        <el-form :model="loginForm"
                 ref="loginForm"
                 :rules="rules"
                 label-width="0">
          <el-form-item prop="username">
            <el-input v-model="loginForm.username"
                      @keyup.enter.native='handleLogin("loginForm")'
                      placeholder="请输入用户名">
              <i slot="prefix"
                 class="icon-yonghu"></i>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginForm.password"
                      @keyup.enter.native='handleLogin("loginForm")'
                      :type='passwordType'
                      placeholder="请输入密码">
              <i slot="suffix"
                 class="el-input__icon el-icon-view c-hover"
                 @click="showPassword"></i>
              <i slot="prefix"
                 class="icon-mima"></i>
            </el-input>
          </el-form-item>
          <el-form-item prop="code">
            <el-row :span="24">
              <el-col :span="14">
                <el-input size="small"
                          @keyup.enter.native='handleLogin("loginForm")'
                          :maxlength="code.len"
                          v-model="loginForm.code"
                          auto-complete="off"
                          placeholder="请输入验证码">
                  <i slot="prefix"
                     class="icon-yanzhengma"></i>
                </el-input>
              </el-col>
              <el-col :span="10">
                <div class="login-code">
                  <span class="login-code-img"
                        @click="refreshCode"
                        v-if="code.type == 'text'">{{code.value}}</span>
                  <img :src="code.src"
                       alt="验证码"
                       class="login-code-img"
                       @click="refreshCode"
                       v-else />
                  <!-- <i class="icon-shuaxin login-code-icon" @click="refreshCode"></i> -->
                </div>
              </el-col>
            </el-row>
          </el-form-item>
          <el-button type="primary"
                     :loading="loading"
                     class="login-btn"
                     @click="handleLogin('loginForm')">登录</el-button>
        </el-form>
      </el-card>
    </div>
  </div>
</template>
<script>
// import { randomLenNum } from '@/util/util'
import { imgObj } from '@/api/user'
import { mapGetters } from 'vuex'
export default {
  name: 'userlogin',
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
        code: ''
        // randomStr: ''
      },
      code: {
        src: '',
        value: '',
        len: 4,
        type: 'image'
      },
      loading: false,
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度最少为6位', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { min: 4, max: 4, message: '验证码长度为4位', trigger: 'blur' }
        ]
      },
      passwordType: 'password'
    }
  },
  created() {
    this.refreshCode()
  },
  mounted() { },
  computed: {
    ...mapGetters(['tagWel'])
  },
  props: [],
  methods: {
    refreshCode() {
      this.loginForm.code = ''
      // this.loginForm.randomStr = randomLenNum(this.code.len, true)
      imgObj().then(res => {
        this.code.src = res.data
      })
      // this.code.type === 'text'
      //   ? (this.code.value = randomLenNum(this.code.len))
      //   : (this.code.src = `${this.codeUrl}`)
    },
    showPassword() {
      this.passwordType === ''
        ? (this.passwordType = 'password')
        : (this.passwordType = '')
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.$store.dispatch('LoginByUsername', this.loginForm).then(
            res => {
              // this.$store.commit('ADD_TAG', this.tagWel)
              this.$router.push({ path: '/wel/index' })
            },
            error => {
              this.$message.error(error)
              this.refreshCode()
            }
          )
        }
      })
    }
  }
}
</script>

<style >
.login-container {
  height: 100%;
  overflow: hidden;
}
.login-container:before {
  z-index: -999;
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-image: url("../../assets/img/loginBg.jpg");
  background-size: cover;
}
.login-content {
  margin: 50px auto 0 auto;
  width: 415px;
}
.login-code img {
  vertical-align: middle;
  height: 28px;
  display: inline-block;
  margin: auto;
  padding-left: 10px;
}
.login-content h1 {
  text-align: center;
  color: #2e94ca;
  font-weight: 500;
  letter-spacing: 8px;
}
.login-content .box-card-login {
  background-color: rgba(144, 147, 153, 0.1);
  border: 2px solid #046fb3;
  color: #ffffff;
}

.login-content .el-input__inner {
  background-color: #005ea9;
}
.login-content .c-hover {
  cursor: pointer;
}
.login-content .login-btn {
  width: 100%;
}
</style>
<style  >
.box-card-login .el-input__inner {
  background-color: rgba(0, 94, 169, 0.2);
  border: 2px solid rgba(0, 94, 169, 1);
  color: #ffffff;
  font-size: 16px;
}
.login-box-title {
  text-align: center;
  letter-spacing: 6px;
  color: rgba(102, 177, 255, 0.8);
  font-size: 22px;
  font-weight: 500;
  margin-top: 13px;
}
</style>
