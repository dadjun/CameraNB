<template>
  <Layout>
    <Header>Header</Header>
    <Content>Content</Content>
    <Footer>Footer</Footer>
  </Layout>
<!--<div class="background-img">
  <div class="container">
    <div class="login-wrap">
     &lt;!&ndash; <div class="logo">
      &lt;!&ndash;  <img src="./images/logo.png" alt="logo">&ndash;&gt;
      </div>&ndash;&gt;
      <div class="welcome">———— 欢迎登陆客户管理系统 ————</div>
      <div class="error">{{error_text}}</div>
      <div class="input-group">
        <label for="username" class="username-icon"></label>
        <input id="username" type="text"  v-model="username" placeholder="输入账号">
      </div>
      <div class="input-group">
        <label for="password" class="password-icon"></label>
        <input id="password" type="password" v-model="password" placeholder="输入密码">
      </div>
      <div class="other">
        <label for="remberme" class="rember-label">
          <input type="checkbox" id="remberme" v-model="rememberMe">记住我</label>
        <span class="password-rest">
          &lt;!&ndash; <a>忘记密码？</a> &ndash;&gt;
        </span>
      </div>
      <div class="btn-submit">
        <button class="submit"  @click="login">登录</button>
      </div>
    </div>
  </div>
</div>-->
</template>

<style scoped>
  @import './login.css';
</style>

<script>
import api from '../../config/axios.js'
import utils from '../../utils.js'
export default {
  data () {
    return {
      access_token: '',
      error_text: '',
      username: '',
      password: '',
      id:'',
      rememberMe: false
    }
  },
  created(){
    // if (utils.getCookie('username')) {
    //   this.$router.push({path:'/'})
    // }
  },
  mounted (){
    this.id = this.myId()
    if(localStorage.getItem('history_user')){
      this.username=localStorage.getItem('history_user')
    }
  },
  methods: {
    login () {
      if(this.username === ''){
        this.error_text = '请输入用户名'
        return false
      }
      if(this.password === ''){
        this.error_text = '请输入密码'
        return false
      }
      let passwd = this.encryptData(this.password, this.id)
      var userInfo={password:passwd,userName:this.username,id:this.id};
      api.loginAxios({userInfo:JSON.stringify(userInfo)}).then(res=>{
        if(res.data === 'SUCCESS'){
          let expireDays = 30 ;
          if(this.rememberMe){
            utils.setCookie('username',this.username,expireDays)
            localStorage.setItem('history_user',this.username)
          }else{
            utils.setCookie('username',this.username,null)
            localStorage.removeItem('history_user')
          }

          if(this.$route.query.redirect){
            this.$router.push({path:this.$route.query.redirect})
          }else{
            this.$router.push({path:'/'})
          }
        }else if (res.data === 'FAILED'){
          this.error_text = '账户名或密码错误'
        } else {
          this.error_text = '账户名或密码错误'
        }
      }).catch(res=>{
        this.error_text = '网络错误，请稍后重试！'
      })
    },
    myId () {
      var s = [];
      var hexDigits = "0123456789abcdef";
      for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
      }
      s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
      s[8] = s[13] = s[18] = s[23] = "";

      var uuid = s.join("");

      return uuid.substr(0,16);
    },
    encryptData(word, id) { // 密码加密
      if (word){
        var key = CryptoJS.enc.Utf8.parse(id);
        var srcs = CryptoJS.enc.Utf8.parse(word);
        var encrypted = CryptoJS.AES.encrypt(srcs, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
        return encrypted.toString();
      }
    }
  }
}
</script>
