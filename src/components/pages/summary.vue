<style scoped>
  .layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
  }
  .layout-logo{
    width: 100px;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    float: left;
    position: relative;
    top: 15px;
    left: 20px;
  }
  .layout-nav{
    width: 420px;
    margin: 0 auto;
    margin-right: 20px;
  }
  .layout-footer-center{
    text-align: center;
  }
</style>
<template>
  <div class="layout">
    <Layout>
      <Header :style="{position: 'fixed', width: '100%'}">
      <p>cs system</p>
      </Header>
      <Content :style="{margin: '88px 20px 0', background: '#fff', minHeight: '50px'}">
        Content
      </Content>
      <Button type="primary" @click="sendEmail">发送</Button>
      <Table border :columns="columns1" :data="data1" @on-selection-change="selectChange"></Table>

        <Page :total="totalPage" :current="currentPage"   @on-change="pageChange" show-sizer />

      <Button @click="handleSelectAll(true)">Set all selected</Button>
      <Button @click="handleSelectAll(false)">Cancel all selected</Button>

      <div >
        <input type="button" value="clickme" v-on:click="item+=1"/>
        <Input v-model="value" placeholder="Enter something..." style="width: 300px" />
        <div>{{item}}</div>
          <a :href="url">点击我</a>
      </div>

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
</style>

<script>

import api from '../../config/axios.js'
import pagination from '@/components/plugins/pagination'
//import autoUserInput from '@/components/tokens/autoUserInput'

export default {
  data () {
    return {
      value:1,
      userInfo: '',
      timePoint: '',
      currentPage: 1,
      totalPage: 10,
      pageNum: 10,
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
          title: 'Send',
          key: 'send'
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
    selectChange:function(selection){
      this.customers = selection;
      console.log(this.customers)
    },
    sendEmail:function( ) {
      var jsonData = {
        sender: "595436259@qq.com",
        list: this.customers
      };

      api.sendCustomersEmailAxios({jsonData: JSON.stringify(jsonData)}).then(res => {
       if(res == true) {
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
        //pageNum:'' + this.pageNum,
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
    gotoPage (page) {
      this.currentPage = page
      this.getCustomers(page)
    }
  },
  components: {
   // clientLoginChart,
    pagination,
    //autoUserInput
  }
}
</script>
