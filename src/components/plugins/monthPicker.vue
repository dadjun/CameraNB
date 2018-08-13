<template>
  <div class="m-switch">
    <div class="input-warp">
      <input type="text" class="input-date form-control" readonly  :value="current" @click.stop="show=!show" placeholder="请输入年份">
      <span class="glyphicon glyphicon-calendar m-position" ></span>
      <div class="calender" v-if="show" >
        <div class="year" >
          <div class="month-area" v-if="showMonth" >
            <span class="glyphicon glyphicon-triangle-left left"  @click.stop="mWrap(-1)"></span>
            <div class="month-wrap">
              <ul class="month-group" ref="monthGroup" :style="{'left':mgLftStr}">
                <li v-for="m of months"  :key="m.index" class="month-item"  :class="{'active': m == currentMonth}"  @click.stop="pickMonth(m)">{{m}}月</li>
              </ul>
            </div>
            <span class="glyphicon glyphicon-triangle-right right"  @click.stop="mWrap(1)"></span>
          </div>
          <ul class="year-group" ref="yearGroup">
            <!-- <li v-for="y of years" :class="{'active': y == select.year}"  :key="y.index">{{y}}年</li> -->
            <li v-for="y of years"  :key="y.index"  @click.stop="pickYear(y)"  :class="{'active': y == currentYear}" >{{y}}</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="switch-btn" id="clientBtn">
      <button class="btn-year" :class="activeType=='1'?'active':''" @click="switchTo(1)">年度</button>
      <button class="btn-quarter" :class="activeType=='2'?'active':''" @click="switchTo(2)">季度</button>
      <button class="btn-month" :class="activeType=='3'?'active':''" @click="switchTo(3)">月度</button>
    </div>
  </div>
</template>
<style>
  .calender{
    position: absolute;
    display: block;
    left: 0px;
    top: 32px;
  }
  .date-switch {
    position: absolute;
    left: 0;
    top: 0;
    min-height: 45px;
    width: 100%;
    line-height: 30px;
    padding: 10px 15px;
  }

  .m-switch {
    float: right;
    max-width: 430px;
    height: 45px;
  }

  input.input-date{
    width: 135px;
    height: 30px;
    padding: 0 5px;
    margin-right: 10px;
  }
  input.input-date[readonly]{
    background: #fff
  }

  .switch-btn{
    float: right;
    padding: 0;
    height: 30px;
    width: 184px;
    line-height: 26px;
    border: 2px solid #45C8DC;
    border-radius: 15px;
    font-size: 0;
    background: #e5e5e5;

  }

  .btn-year,
  .btn-quarter,
  .btn-month{
    margin: 0;
    padding: 0;
    width: 60px;
    height: 26px;
    line-height: 26px;
    border: none;
    border-radius: 15px;
    background: #e5e5e5;
    outline: none;
    font-size: 14px;
  }

  .btn-year.active,
  .btn-quarter.active,
  .btn-month.active{
    background: #45C8DC;
    color: #fff
  }

  .input-warp {
    position: relative;
    float: left;
  }

  .m-position{
    left: 114px;
    top: 6px;
    color: #DDDDDD;
    position: absolute;
  }

  .year{
    /* margin-top: 5px; */
    background: #fff;
    width: 135px;
    min-height: 90px;
    border: 1px solid #eeeeee;
  }

  .month-area{
    width: 100%;
    height: 35px;
    vertical-align: middle;
    border-bottom: 1px solid #eeeeee;
  }
  .left,
  .right,
  .month-wrap{
    float: left;
  }

  .left,
  .right{
    top: 10px;
  }

  .year .year-group{
    clear: both;
    width: 100%;
    height: 100%;
    z-index: 10000;
    max-height: 100px;
    overflow-y: scroll;
  }

  .year .year-group>li{
    text-align: center;
    width: 100%;
    line-height: 24px;
    height: 24px;
  }

  .month-wrap {
    position: relative;
    width: 102px;
    height: 34px;
    overflow: hidden;
  }

  .year .month-group{
    position: absolute;
    width: 408px;
    height: 100%;
    background: #ffffff;
  }

  .year .month-group .month-item {
    float: left;
    font-size: 12px;
    width: 30px;
    height: 30px;
    margin: 2px;
    line-height: 30px;
    text-align: center;
    -webkit-border-radius: 15px;
    -moz-border-radius: 15px;
    border-radius: 15px;
    background: #eee;
  }

  .year .year-group>li.active,
  .year .month-group .month-item.active{
    color: #fff;
    background: #80B6FE;
  }
</style>

<script>
export default {
  data () {
    return {
      // current: '',
      currentMonth: '',
      currentYear: '',
      activeType: 1, // 1=年，2=季，3=月
      show: false,
      showMonth: false,
      years: [], // 1900-2100
      months: [],
      mgLft: 0 // 月份栏位置left属性
    }
  },
  watch: {
    show (newVal) {
      if (newVal) {
        document.addEventListener('click', this.bindEvent)
        this.$nextTick(() => {
          // 选中滚动
          var year = this.$refs.yearGroup
          const y = year.getElementsByClassName('active')[0].innerHTML
          year.scrollTop = (y - 1900) * 24
        })
      } else {
        // this.saveVal() // 关闭选择器时返回日期
        document.removeEventListener('click', this.bindEvent)
      }
    },
    current (newVal, oldVal) { // 点击改变年或月时立即返回日期
      this.saveVal()
    },
    activeType (newVal, oldVal) {
      if (newVal === 3 || oldVal === 3) {
      } else {
        this.saveVal()
      }
    }
  },
  computed: {
    current () {
      if (this.activeType === 3) {
        var month = this.currentMonth
        if (month < 10) {
          month = '0' + month
        }
        return this.currentYear + '-' + month
      } else {
        return this.currentYear
      }
    },
    mgLftStr () {
      return this.mgLft + 'px'
    }
  },
  created () {
    // 获得年份列表： 2000-2100
    this.currentYear = new Date().getFullYear()
    this.currentMonth = new Date().getMonth() + 1
    for (let i = 2000; i <= 2020; i++) {
      this.years.push(i)
    }
    for (let i = 1; i <= 12; i++) {
      this.months.push(i)
    }
  },
  methods: {
    // 绑定事件：点击关闭日历面板
    bindEvent () {
      this.show = false
    },
    // 年月季切换
    switchTo (n) {
      this.activeType = n
      if (n > 2) {
        this.showMonth = true
      } else {
        this.showMonth = false
      }
    },
    pickYear (y) {
      this.currentYear = y
    },
    pickMonth (m) {
      this.currentMonth = m
    },
    // 月份滚动
    mWrap (v) {
      var mf = this.mgLft
      if (v > 0) { // 往右滑动
        mf -= 102
        if (mf < -306) {
          mf = 0
        }
        this.mgLft = mf
      } else {
        mf += 102
        if (mf > 0) {
          mf = -306
        }
        this.mgLft = mf
      }
    },
    // 回调选中的时间
    saveVal () {
      this.$emit('select', this.current, this.activeType)
    }
  }
}
</script>
