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
            <Dropdown  class="userBox"  slot='right'>
              <a href="javascript:void(0)">
              {{username}}
                <Icon type="ios-arrow-down"></Icon>
              </a>
              <DropdownMenu slot="list">
                <DropdownItem>编辑信息</DropdownItem>
                <DropdownItem>退出</DropdownItem>
                <DropdownItem divided>毛毛鱼</DropdownItem>
              </DropdownMenu>
            </Dropdown>
        </div>
      </Header>


      <Content :style="{margin: '5px 2px 0', background: '#fff', minHeight: '50px'}">
        <Row>
          <h1 :style="{ textAlign:'center',fontSize:'20px'}" v-text="asb"></h1>
        </Row>

        <div>

          <div>
            <small>发送邮箱:</small>
            <Input v-model="mailSender" placeholder="Enter something..." style="width: 300px" />

           <Button type="primary" @click="sendEmail">批量发送</Button>
          </div>
          <br>
          <div>
            <small>发送主题:</small>
            <Input v-model="mailSubject" placeholder="Enter something..." style="width: 300px" />
            <Button @click="clearUploadedFiles">重新上传</Button>

          </div>
          <br>
          <Upload   ref="upload"
                      :action="fileUploadUrl"
                      :data="postData"
                      :on-success="uploadSuccess">
            <Button icon="ios-cloud-upload-outline">Upload files</Button>
          </Upload>

          <Button :style="{ float:'right'}" type="primary" @click="addCustomer">添加客户</Button>
        </div>
        <br>
        <br>
      <Table border :columns="columns1" :data="data1" @on-selection-change="selectChange"></Table>

        <Page :total="totalPage" :current="currentPage"  :page-size="pageSize"  @on-change="pageChange" @on-page-size-change="pageSizeChange" show-sizer />


      </Content>
      <Footer class="layout-footer-center">2018-2020 &copy; Melinda</Footer>
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
//import autoUserInput from '@/components/tokens/autoUserInput'
import Cookies from 'js-cookie'
export default {
  data () {
    return {
      fileUploadUrl:"http://localhost:8082/email/uploadFile",
      mailSubject:'',
      mailSender:Cookies.get('email'),
      username: util.getCookie('csName'),
      postData:{a:"i am good guy",csName :util.getCookie('csName')},
      timePoint: '',
      currentPage: 1,
      totalPage: 10,

      pageSize: 10,
      totalNum: 0,
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
          key: 'id'
        },
        {
          title: 'Name',
          key: 'name'
        },
        {
          title: 'Email',
          key: 'email'
        },
        {
          title: 'Country',
          key: 'country'
        },
        {
          title:'CustomerType',
          key:'customerType'
        },
        {
          title: 'lastSendDate',
          key: 'lastSendDate'
        }
      ],
      data1: [
        {
          name: 'John Brown',
          email: '59436259@qq.com',
          address: 'New York No. 1 Lake Park',
          date: '2016-10-03'
        },
        {
          name: 'Jim Green',
          email: 'junjie316go@gmail.com',
          address: 'London No. 1 Lake Park',
          date: '2016-10-01'
        }

      ]
    }
  },
  mounted () {
    this.searchLog()
  },
  methods: {
    clearUploadedFiles () {
      this.$refs.upload.clearFiles();
    },
    uploadSuccess (res, file) { //上传成功
      this.$Message.info(res.msg);
      if(res.code == 200){
        this.excel_name = res.info.originalName;
      }
    }     ,
    selectChange:function(selection){
      this.customers = selection;
      console.log(this.customers)
    },
    sendEmail:function( ) {
      var jsonData = {
        sender:this.username,
        list: this.customers
      };
      api.sendCustomersEmailAxios({jsonData: JSON.stringify(jsonData)}).then(res => {
       if(res.resultCode =='NO_ERROR') {
         this.$Message.info("发送成功")
       }else{
         this.$Message.error("发送成功")
       }

      }).catch(error => {
        console.log(error)
      })
    },
    pageChange:function(value) {
      this.currentPage = value
      this.getCustomers()
    },
    pageSizeChange:function(value){
      this.pageSize = value
      this.getCustomers()
      this.$Message.error(this.pageSize.toString())
    },
    show: function () {
      this.visible = true;
    },
    searchLog(){
      this.currentPage = 1
      this.getCustomers()
    },
    getCustomers () {
      var jsonData = {
        pageNum: '' + this.currentPage,
        pageSize: '' + this.pageSize
      }

      api.selectCustomersAxios({jsonData: JSON.stringify(jsonData)}).then(res => {
        this.data1 = res.list
        this.totalNum = res.total
        this.totalPage = res.pages;
        this.currentPage = res.pageNum;
      }).catch(error => {
        console.log(error)
      })
    },
    addCustomer(){

    }
  },
  components: {
   // clientLoginChart,
    pagination,
    //autoUserInput
  }
}
</script>
