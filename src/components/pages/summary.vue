<style scoped>
  .layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
  }

  .layout-footer-center{
    text-align: center;
  }
</style>
<template>
  <div class="layout">
    <Layout>
      <Header :style="{ float: 'center', background:'#f2f2f2',/*position: 'fixed', */width: '100%' ,height:'40px'}" >
        <div>
         <!--<p :style="{color:'#000000',  float: 'center', fontFamily:'sans-serif',fontSize:'26px',textAlign:'center'}">cs system</p>-->
            <Dropdown  class="userBox"  slot='right' @on-click="handleDropClick">
              <a href="javascript:void(0)">
              {{username}}
                <Icon type="ios-arrow-down"></Icon>
              </a>
              <DropdownMenu slot="list">
                <DropdownItem name="1" >编辑信息</DropdownItem>
                <DropdownItem name="2" >退出</DropdownItem>
                <!--<DropdownItem name="3" >毛毛鱼</DropdownItem>-->
              </DropdownMenu>
            </Dropdown>
        </div>

        <Modal
          title="修改用户信息"
          v-model="modalUserInfo"
          @on-ok="modifyUserInfo"
          :styles="{top: '20px'}">
          <div>
          <Form ref="formCustom" :model="formUser" :rules="ruleCustom" :label-width="110">
            <!--<Form-item label="密码" prop="password" >
              <Input type="password" v-model="formUser.password" placeholder="请输入"></Input>
            </Form-item>-->
            <FormItem label="E-mail" prop="email">
              <Input v-model="formUser.email" placeholder="请输入"/>
            </FormItem>
            <Form-item label="E-mail password"  prop="password">
              <Input  type="password" v-model="formUser.mailPsw" placeholder="请输入邮箱密码"/>
            </Form-item>
          </Form>
          </div>
        </Modal>
      </Header>

      <Content :style="{margin: '5px 2px 0', background: '#fff', minHeight: '50px'}">
        <Row>
          <h1 :style="{ textAlign:'center',fontSize:'20px'}"  ></h1>
        </Row>

        <div >
          <div >
            <small>发送邮箱:</small>
            <Input v-model="mailSender" placeholder="Enter something..." style="width: 300px" />

           <Button type="primary" @click="sendEmail">批量发送</Button>
          </div>
          <br>
          <div>
            <small>发送主题:</small>
            <Input v-model="mailSubject" placeholder="Enter something..." style="width: 300px" />
            <Button @click="clearUploadedFiles">清除上传</Button>
          </div>
          <br>
        </div>

        <div  :style="{ display:'inline-block'}"   >
          <small>发送内容: </small>
          <a  @click="downloadFile">{{contentPath}}</a>
          <br/>
            <Upload   ref="upload"
                      :action="fileUploadUrl"
                      :data="postData"
                      :on-success="uploadSuccess">
              <Button   icon="ios-cloud-upload-outline">Upload files</Button>
           </Upload>
        </div>
        <br>
        <div :style="{ float:'right'}" >
         <small>选择邮箱:</small>
          <AutoComplete
            v-model="valueEmail"
            :data="arrayEmail"
            @on-search="handleSearchEmail"
            placeholder="input here"
            style="width:300px; ">
          </AutoComplete>

        <small>选择国家:</small>
          <AutoComplete
            v-model="valueCountry"
            :data="dataCountry"
            :filter-method="filterMethod"
            @on-select="handleSearchCountry"
            placeholder="input here"
            style="width:300px; ">
          </AutoComplete>
          <Button type="primary" >添加客户</Button>
        </div>
        <br>
        <br>
      <Table border :columns="columns1" :data="data1" @on-selection-change="selectChange"></Table>

        <Page :total="totalNum" :current="currentPage"  :page-size-opts="pageSizeOpts" :page-size="pageSize"  @on-change="pageChange" @on-page-size-change="pageSizeChange" show-sizer />
      </Content>
      <Footer class="layout-footer-center">2018-2020 &copy; Melinda</Footer>
      <Modal
        v-model="modalDel"
        title="删除提示"
        @on-ok="deleteOk"  >
        <p>确认是否删除该项</p>
      </Modal>

    </Layout>
  </div>
</template>

<style>
.user-logs-table th,td{
    height: 30px;
    line-height: 30px;
    text-align: center;
    border-bottom: 1px solid #eeeeee;
}
.page-row:before{
  content: '';
  clear: both;
  display: block
}
.pagination{
    margin: 0 40px 0 0;
    float: right;

}
.noDataLabel{
  position: absolute;
  z-index: 999;
  color: #ccc;
  left: 50%;
  top: 50%;
  font-size: 32px;
  padding: 5px 15px;
  margin: -30px 0 0 -80px;
}

.userBox {
  height: 50px;
  line-height: 50px;
  float: right;
  padding: 0 10px;
}
</style>
<script>

import api from '../../config/axios.js'
import util from '../../common/utils/index.js'
import pagination from '@/components/plugins/pagination'
import { fetchDownloadFile } from  '../../config/axios.js'
import Cookies from 'js-cookie'
export default {
  data () {
    return {
      formUser: {
        user: '',
        password: '',
        email: '',
        mailPsw:''

      },
      ruleCustom: {
        user: [
          {required: true, message: '账号名不能为空', trigger: 'blur'}
        ],

        email: [
          { required: true, message: 'Mailbox cannot be empty', trigger: 'blur' },
          { type: 'email', message: 'Incorrect email format', trigger: 'blur' }
        ],
        mailPsw: [
          {required: true, message: '标示不能为空', trigger: 'blur'},
          {message: '标示只支持字母', trigger: 'blur'}
        ]
      },
      modalUserInfo:false,
      modalDel:false,
      //fileUploadUrl:"http://localhost:8082/email/uploadFile",
      fileUploadUrl:api.baseURL + '/user/uploadFile',
      mailSubject:'',
      mailSender:Cookies.get('email'),
      username: Cookies.get('userName'),
      postData:{a:"i am good guy",csName :util.getCookie('userName')},
      timePoint: '',
      currentPage: 1,
      totalPage: 10,
      contentPath:Cookies.get('contentPath'),
      pageSize: 20,
      pageSizeOpts:[10,20,50,100],
      totalNum: 10,
      customers:[],
      visible:false,
      item:1,
      url:"http://www.baidu.com",
      columns1: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
       {
          title: 'Id',
         width: 100,
          key:  'id'
        },
        {
          title: 'Name',
          key: 'name'
        },
        {
          title: 'Email',
          key: 'email',
          width: 350
        },
        {
          title: 'Country',
          key: 'country',
          width: 350
        },
        {
          title:'CustomerType',
          key:'customerType',
          width: 200
        },
        {
          title: 'lastSendDate',
          key: 'lastSendDate',
          width: 200
        },

        {
          title: 'Operation',
          key: 'operation',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
               props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                  //display:(params.row.status=='true')?"inline-block":"none"
                },
                on: {
                  click: () => {
                    this.show(params.index)
                  }
                }
              }, 'view') ,
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.remove(params.index)
                  }
                }
              }, 'Delete')
            ]);
          }
        },
        {
          title: 'Success',
          key: 'success',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Icon', {
                props: {
                  type: 'md-checkmark',
                  size:28
                },
                style: {
                  marginRight: '5px',
                   display:(params.row.status==='true')?"inline-block":"none"
                }
              })
            ]);
          }
        }
      ],
      data1: [
        {
          name: ' ',
          email: ' ',
          address: ' ',
          date: ' '
        }
      ],
      dataCountry: ['Steve Jobs', 'Stephen Gary Wozniak', 'Jonathan Paul Ive'],
      valueCountry:'',
      valueEmail:'',
      arrayEmail:[],
      deleteIdx:-1,
    }
  },
  mounted () {
    this.getCustomersAndCountry()
  },
  methods: {
    handleSearchEmail(value) {
      console.log(value);
      console.log(this.valueCountry);
      this.searchCustomers(this.valueCountry,this.valueEmail);
    },
    handleSearchCountry (value) {
      //return option.toUpperCase().indexOf(value.toUpperCase()) !== -1;
      if (value !== "") {
        console.log(value);
        console.log(this.valueEmail);
        this.searchCustomers(value,this.valueEmail)
      }
    },
    filterMethod (value,option) {
      if(value !== null && value !== "") {
          return option.toUpperCase().indexOf(value.toUpperCase()) !== -1;
      }else{
        return false;
      }
    },
    clearUploadedFiles () {
      this.$refs.upload.clearFiles();
    },
    uploadSuccess (res, file) { //上传成功
      this.$Message.info(res.data);
      if(res.resultCode === 'NO_ERROR'){
        Cookies.set('contentPath', res.data.contentPath);
        this.contentPath =  res.data.contentPath
      }
    }     ,
    selectChange:function(selection){
      this.customers = selection;
      //console.log(this.customers)
    },
    sendEmail:function( ) {
      this.data1.forEach(function (v, k, theArray) {
          theArray[k].status = 'false';
      })

      for( let dat of this.customers) {
        let jsonData = {
          sender: this.username,
          subject: this.mailSubject,
          list: dat
         };
         api.sendEmailAxios({jsonData: JSON.stringify(jsonData)}).then(res => {
          this.data1.forEach(function (v, k, theArray) {
            if (v.id === res.data.id && res.data.status === true) {
              theArray[k].status = 'true';
            }
          });
          if (res.resultCode === 'NO_ERROR') {
            this.$Message.info("发送成功");
          } else {
            this.$Message.error("发送成功");
          }
        }).catch(error => {
          console.log(error)
        })
      }
    },
    pageChange:function(value) {
      this.currentPage = value;
      this.searchCustomers(this.valueCountry,this.valueEmail);
    },
    pageSizeChange:function(value){
      this.pageSize = value;
      console.log(this.pageSize);
      this.searchCustomers(this.valueCountry,this.valueEmail);
     // this.$Message.error(this.pageSize.toString())
    },
    show: function () {
      this.visible = true;
    },
    getCustomersAndCountry(){
      this.currentPage = 1;
      this.searchCustomers("","");
      this.getCustomerCountry();
    },
    getCustomerCountry () {
      let jsonData = {
      };
      api.selectCustomerCountry({jsonData: JSON.stringify(jsonData)}).then(res => {
        this.dataCountry = res;
      }).catch(error => {
        console.log(error);
      })
    },
    searchCustomers (country,email) {
      let jsonData = {
        pageNum: '' + this.currentPage,
        pageSize: '' + this.pageSize
      };
      if(country !== "") {
        jsonData.country=country;
      }
      if(email !== ""){
        jsonData.email=email;
      }

      api.selectCustomers({jsonData: JSON.stringify(jsonData)}).then(res => {
        this.data1 = res.list;
        this.totalNum = res.total;
        this.totalPage = res.pages;
        console.log(this.totalPage)
        //this.currentPage = res.pageNum
      }).catch(error => {
        console.log(error)
      })
    },
    downloadFile: function () {
      var jsonData = {
        userName: '' + this.username
      }
      api.downloadUserFile({jsonData: JSON.stringify(jsonData)}).then(res => {
        let url = window.URL.createObjectURL(new Blob([res]));
        let link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;
        this.contentPath = Cookies.get('contentPath');
        link.setAttribute('download', this.contentPath);
        document.body.appendChild(link);
        link.click()
      }).catch(error => {
        console.log(error)
      })
    },
    handleDropClick(val ){
      if (val === '2') {
        this.$router.push('/')
      }else if(val=== '1') {
        var jsonData = {
          user: '' + this.username
        };
        api.getUserInfoAxios({jsonData: JSON.stringify(jsonData)}).then(res => {
          this.formUser.user = res.data.name;
          this.formUser.email = res.data.email;
          this.formUser.mailPsw = res.data.mailPsw
        }).catch(error => {
          console.log(error)
        });
        this.modalUserInfo = true
      }
      console.log(val)
    },
    addCustomer(){
    },
    modifyUserInfo(){
      api.loginAxios({jsonData:JSON.stringify(userInfo)}).then(res=>{
        if (res.resultCode === 'NO_ERROR') {
          Cookies.set('userName',this.formValidate.name);
          Cookies.set('email', res.data.email);
          this.$Message.success(res.resultMsg)
          this.$router.push('/summary')
        }else{
          this.error_text = '修改错误，请稍后重试！';
          this.$Message.success(res.resultMsg)
        }
        this.modal_loading = false
      }).catch(res=>{
        this.error_text = '网络错误，请稍后重试！';
        this.modal_loading = false
      })
    },
    remove(index){

      this.deleteIdx = index;
      this.modalDel = true
    },
    deleteOk() {
      if(this.deleteIdx != -1) {
        let jsonData = this.data1[this.deleteIdx];
        this.data1.splice(this.deleteIdx, 1);
        api.deleteCustomer({jsonData: JSON.stringify(jsonData)}).then(res => {
          if (res.resultCode === 'NO_ERROR') {
            this.$Message.success("删除成功")
          }else{
            this.$Message.success("删除失败")
          }
        }).catch(error => {
          console.log(error)
        })
        this.deleteIdx = -1;
      }
    }
  },
  components: {
   // clientLoginChart,
    pagination,
    //autoUserInput
  }
}
</script>
