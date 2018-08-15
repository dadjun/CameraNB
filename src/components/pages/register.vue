<template>
  <div id="app" class="type" :style="{background:'url('+bgUrl+')'}">
    <Row class="bg" :style="{background:'url('+bgUrl+')'}">
      <Col :xs="16" offset="4">
      <Card style="margin: 100px auto;max-width: 600px;padding-top: 20px;text-align: left">
        <div v-if="token">
          <Steps :current="2" size="small" style="padding-left: 70px;padding-bottom: 10px;text-align: left">
            <Step title="基本信息"></Step>
            <Step title="邮箱激活"></Step>
            <Step title="信息登记"></Step>
          </Steps>
          <Form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="110">

             <Form-item label="账号名" prop="user">
              <Input v-model="formCustom.user" placeholder="请输入"></Input>
            </Form-item>
            <Form-item label="密码" prop="mark" >
              <Input type="password" v-model="formCustom.password" placeholder="请输入"></Input>
            </Form-item>

          <!--  <Form-item label="管理员身份证号" prop="idCard">
              <Input v-model="formCustom.idCard" placeholder="请输入"></Input>
            </Form-item>-->
            <FormItem label="E-mail" prop="mail">
              <Input v-model="formCustom.email" placeholder="请输入"></Input>
            </FormItem>

            <Form-item>
              <Button type="primary" @click="handleSubmit('formCustom')" long :loading="loading">提交
              </Button>
            </Form-item>
          </Form>
        </div>
        <div v-if="!token">
          <Steps :current="1" status="error" size="small" style="padding-left: 70px;padding-bottom: 10px">
            <Step title="基本信息"></Step>
            <Step title="邮箱激活"></Step>
            <Step title="信息登记"></Step>
          </Steps>
          <h3 style="color:#ed3f14;text-align: center"><p>链接过期或失效<a href="register.html"> 重新发送邮件</a></p></h3>

        </div>
        <small style="display: block;text-align: center;line-height: 30px;"><img :src="require('@/assets/img/logo.png')" height="30" alt="" style="vertical-align: top"><span>Copyright by Melinda ,All rights reserved</span>
        </small>
      </Card>
      </Col>
    </Row>
  </div>
</template>
<script>
  import api from '../../config/axios.js'
  import { GetQueryString } from '@/common/utils'
  import bgUrl from '@/assets/img/bg_login.jpg'
  export default {
    name: 'type',
    data () {

      return {
        token: true,
        loading: false,
        bgUrl: bgUrl,
        formCustom: {
          typeId: 2,
          user: '',
          password: '',
          email: '',
          userName: '',
          idCard: '',
          sex: '1',
          phone: ''
        },
        ruleCustom: {
          user: [
            {required: true, message: '账号名不能为空', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '标示不能为空', trigger: 'blur'},
            {message: '标示只支持字母', trigger: 'blur'}
          ],

          email: [
            { required: true, message: 'Mailbox cannot be empty', trigger: 'blur' },
            { type: 'email', message: 'Incorrect email format', trigger: 'blur' }
          ]

        }
      }
    },
    methods: {
      handleSubmit (name) {
        this.loading = true
        this.$refs[name].validate((valid) => {
          if (valid) {
            let jsonData = {
              password: this.formCustom.password,
              user: this.formCustom.user,
              //personSex: this.formCustom.idCard.substring(16, 1) % 2 ? '1' : '0',
              email: this.formCustom.email

            }
            api.registerUserAxios({jsonData: JSON.stringify(jsonData)}).then(res => {

              this.$Message.success('提交成功!')

              let url = window.location.href
              console.log(url)
              if (window.location.search === '') {
                url = window.location.href
              } else {
                url = url.split(window.location.search)[0]
              }
              url = url.replace('register', 'summary')
              window.location.href = url
              console.log(url);
            }).catch(error => {
              this.loading = false
              console.log(error)
            })
    /*       this.$api.postUserInfo(data).then(res => {
              this.loading = false
              if (res.code === 0) {
                this.$Message.success('提交成功!')
                let url = window.location.href
                if (window.location.search === '') {
                  url = window.location.href
                } else {
                  url = url.split(window.location.search)[0]
                }
                url = url.replace('type.html', 'login.html')
                window.location.href = url
              } else {
                alert(JSON.stringify(res) )
              }
            }).catch(err => {
              this.loading = false
              console.error('哎哟~！', err)
            })*/
          } else {
            this.loading = false
            this.$Message.error('表单验证失败!')
          }
        })
      },
      checkToken () {
        let data = {
          token: GetQueryString('token') || '',
          e: GetQueryString('e') || '',
          p: GetQueryString('p') || ''
        }
        this.$api.checkToken(data).then(res => {
          if (res.code === 0) {
            if (res.state === '1') {
              this.token = true
            } else {
              this.token = false
            }
          }
        })
      },
      save () {

      }
    },
    created () {
     // this.checkToken()
    }
  }
</script>

<style lang="less" scoped>
  html, body {
    position: absolute;
    height: 100%;
    width: 100%;
  }
.bg{

}
  #app {
    width: 100%;
    height: 100%;
    overflow: scroll;
  }

  .help {
    display: block;
    text-align: left;
    font-size: 12px;
    color: #9ea7b4;
  }
</style>
