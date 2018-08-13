<!--/*模态框：开发中-->
  <!--仅支持传入模态框内容-->
  <!--确认及取消按钮功能待开发-->
  <!--框内容文本中传入事件我不会做-->
  <!--建议不要用，直接在对应组件中复制样式自行控制内容-->
  <!--*/-->

<template>
<transition name="modaltran">
<div class="modalM"  v-if="showTag">
  <div class="modal-window" >
    <div class="modal-window-dialog" role="document">
      <div class="modal-window-content">
        <div class="modal-window-header">
          <button type="button" class="close" @click="closeModal"><span aria-hidden="true">×</span></button>
          <h4 class="modal-window-title">{{title}}</h4>
        </div>
        <div class="modal-window-body" v-html="content">
        </div>
       </div>
    </div>
  </div>
  <div class="modal-mask in"></div>
</div>
</transition>
</template>

<style>
.modalM {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1100;
}
/* .modaltran-enter-active, .modaltran-leave-active{
  transition: all 0.5s ease;
} */

.modalM .modal-window {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1050;
  display: block;
  overflow: hidden;
  -webkit-overflow-scrolling: touch;
  outline: 0;
}
.modalM .modal-mask{
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background: #000;
  opacity: 0.5;
  z-index: 1040;
}

.modaltran-enter-active .modal-window, .modaltran-enter-active .modal-mask{
  transition: all 0.5s ease;
}
.modaltran-leave-active .modal-mask{
  transition: all  0.5s ease;
}
.modaltran-enter .modal-window{
  transform: translate(0, -25%);
}
.modaltran-leave-to .modal-window{
  transform: translate(0, -25%);
  opacity: 0
}
.modaltran-enter .modal-mask, .modaltran-leave-to .modal-mask{
  opacity: 0;
}
.modaltran-enter-active, .modaltran-leave-active {
  transition: all .5s ease;
}
.modal-window .modal-window-dialog {
  margin-top: 200px
}
.modal-window-open .modal-window {
  overflow-x: hidden;
  overflow-y: auto;
}
.modal-window-dialog {
  position: relative;
  width: auto;
  margin: 10px;
}
.modal-window-content {
  position: relative;
  background-color: #fff;
  -webkit-background-clip: padding-box;
  background-clip: padding-box;
  border: 1px solid #999;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  outline: 0;
  -webkit-box-shadow: 0 3px 9px rgba(0, 0, 0, 0.5);
  box-shadow: 0 3px 9px rgba(0, 0, 0, 0.5);
}
.modal-window-backdrop {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1040;
  background-color: #000;
}
.modal-window-backdrop.fade {
  filter: alpha(opacity=0);
  opacity: 0;
}
.modal-window-backdrop.in {
  filter: alpha(opacity=50);
  opacity: 0.5;
}
.modal-window-header {
  min-height: 16.43px;
  padding: 10px;
  border-bottom: 1px solid #e5e5e5;
}
.modal-window-header .close {
  margin-top: -2px;
}
.modal-window-title {
  margin: 0;
  line-height: 1.42857143;
}
.modal-window-body {
  position: relative;
  padding: 15px;
}
.modal-window-footer {
  padding: 15px;
  text-align: right;
  border-top: 1px solid #e5e5e5;
}
.modal-window-footer .btn + .btn {
  margin-bottom: 0;
  margin-left: 5px;
}
.modal-window-footer .btn-group .btn + .btn {
  margin-left: -1px;
}
.modal-window-footer .btn-block + .btn-block {
  margin-left: 0;
}
.modal-window-scrollbar-measure {
  position: absolute;
  top: -9999px;
  width: 50px;
  height: 50px;
  overflow: scroll;
}
.modal-window-header .close {
    margin-top: 6px;
}
@media (min-width: 768px) {
  .modal-window-dialog {
    width: 800px;
    margin: 30px auto;
  }
  .modal-window-content {
    -webkit-box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  }
  .modal-window-sm {
    width: 300px;
  }
}
@media (min-width: 992px) {
  .modal-window-lg {
    width: 900px;
  }
}
</style>

<script>
export default {
  data () {
    return {
      showTag: false,
      showWindow: false,
      showMask: false
    }
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    }
  },
  methods: {
    closeModal () {
      this.showTag = false
    },
    showModal () {
      this.showTag = true
      this.$nextTick(() => {
        this.showWindow = true
      })
    }
  }
}
</script>
