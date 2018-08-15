<template>
  <div class="login">
    <div class="bg">
    </div>
    <Modal class="login-modal" v-model="loginModal" width="360" :closable="false" :mask-closable="false">
      <div>
        <h2 style="margin:10px;color:#abcdef;text-align:center">
          <img :src="require('@/assets/img/logo.png')" alt="" height="50"></h2>
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate">
          <Form-item prop="name">
            <Input v-model="formValidate.name" placeholder="请输入姓名"></Input>
          </Form-item>
          <Form-item prop="password">
            <Input v-model="formValidate.password" @keyup.native.enter="handleSubmit('formValidate')" type="password" placeholder="请输入密码"></Input>
          </Form-item>

          <Row>
            <Col span="12">
            <Checkbox-group v-model="formValidate.remember">
              <Checkbox label="记住我"></Checkbox>
            </Checkbox-group>
            </Col>
            <Col span="12">
            <a style="float:right" @click="toRegister">新用户注册</a>
            </Col>
          </Row>

        </Form>
      </div>
      <div slot="footer">
        <Button type="primary" size="large" long :loading="modal_loading" @click="handleSubmit('formValidate')">登录
        </Button>
        <small style="text-align: center;display:block" class="subText">©copyright by Melinda</small>
      </div>
    </Modal>
  </div>
</template>
<script>
  import api from '../../config/axios.js'
  import Cookies from 'js-cookie'
  export default {
    name: 'login',
    data () {
      return {
        error_text:"",
        loginModal: true,
        modal_loading: false,
        formValidate: {
          name: '',
          password: ''
        },
        ruleValidate: {
          name: [
            {required: true, message: '姓名不能为空', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '密码错误', trigger: 'blur'}
          ]

        }
      }
    },
    methods: {
      handleSubmit (name) { // login
        var userInfo={
          password:this.formValidate.password,
          user:this.formValidate.name
          };

        this.$refs[name].validate((valid) => {
          this.modal_loading = true
            api.loginAxios({jsonData:JSON.stringify(userInfo)}).then(res=>{
              if (res == 1) {
                Cookies.set('token', this.formValidate.password)
                //this.$Message.error('表单验证失败!')
                this.$router.push('/summary')
               }else{
                this.error_text = '登录错误，请稍后重试！'
                this.$Message.error(this.error_text)
              }
              this.modal_loading = false
            }).catch(res=>{
              this.error_text = '网络错误，请稍后重试！'
              this.modal_loading = false
            })

        })
      },
      toRegister () {
        this.$router.push('/register')
      }
    }
  }
</script>


