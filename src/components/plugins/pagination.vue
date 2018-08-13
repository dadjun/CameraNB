<template>
    <div class="sim-pagination">
        <a class="paginate_button"  @click="firstPage">首页</a>
        <a class="paginate_button"  @click="prevPage">&lt;</a>
        <a class="paginate_button" :class="currentPage === p?'current':''" v-for="p in pageList" :key="p.index" @click="gotoPage(p)">{{p}}</a>
        <a class="paginate_button"   @click="nextPage">&gt;</a>
        <a class="paginate_button"  @click="lastPage">尾页</a>
        <span class="totalPages"> 共<span>{{totalPage}}</span>页 </span>
        <span class="totalSize" v-if="totalNum>0"> 共<span>{{totalNum}}</span>条记录 </span>
    </div>
</template>

<style>
.sim-pagination{
    margin:0;padding: 0;
    font-family: 'SimHei Regular','SimHei', sans-serif;
    font-weight: bold;font-size: 14px;
}
.sim-pagination a{
    color:#666;
    cursor: pointer;
    text-decoration: none
}
.sim-pagination a:hover{
    color:#45c8dc;
}
.sim-pagination a.disabled {
    color:#ccc
}
.sim-pagination a.disabled:hover{
    color:#ccc
}
.sim-pagination a.current {
    color:#45c8dc
}
.sim-pagination .paginate_button{
    display: inline-block;
    padding:0 5px;
}

</style>

<script>
export default {
  // data () {
  //   return {
  //   }
  // },
  props: {
    totalPage: {
      type: Number,
      default: 5
    },
    currentPage:{
      type: Number,
      default: 1
    },
    maxLength: { // 最多显示页码数
      type: Number,
      default: 10
    },
    totalNum: { // 记录数量
      type: Number,
      default: 0
    }
  },
  computed: {
    pageList () { // 计算显示的页面
      var pagelist = []
      if (this.maxLength >= this.totalPage) { // 页数不超出显示范围
        for (let i = 1; i <= this.totalPage; i++) {
          pagelist.push(i)
        }
      } else { // 超出显示范围
        if (this.currentPage <= Math.floor(this.maxLength / 2)) { // 前面不够
          for (let i = 0; i < this.maxLength; i++) {
            pagelist.push(1 + i)
          }
        } else if (this.currentPage >= this.totalPage - Math.floor(this.maxLength / 2)) { // 后面不够
          for (let i = 1; i <= this.maxLength; i++) {
            pagelist.push(this.totalPage - this.maxLength + i)
          }
        } else {
          for (let i = 0; i < this.maxLength; i++) {
            pagelist.push(this.currentPage - Math.floor(this.maxLength / 2) + i)
          }
        }
      }
      return pagelist
    }
  },
  methods: {
    firstPage () {
      this.gotoPage(1)
    },
    lastPage () {
      this.gotoPage(this.totalPage)
    },
    prevPage () {
      if (this.currentPage === 1) {
        return false
      } else {
        this.gotoPage(this.currentPage - 1)
      }
    },
    nextPage () {
      if (this.currentPage === this.totalPage) {
        return false
      } else {
        this.gotoPage(this.currentPage + 1)
      }
    },
    gotoPage (p) {
      this.$emit('gotoPage', p)
    }
  }
}
</script>
