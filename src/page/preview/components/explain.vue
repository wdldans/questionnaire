<template>
  <div class="explain-root">
    <div class="title">说明</div>
    <div>1、每人可提交一次结果，确认提交前可进行修改</div>
    <div>2、如退出问卷页面，重新进入不影响提交次数</div>
    <div>3、如存在疑问或错误提交，可联系负责老师</div>
  </div>
</template>

<script>
export default {
  name: 'explain'
}
</script>

<style lang="less" scoped>
.explain-root {
  width: 100%;
  padding: 8px 10px 10px;
  color: #999;
  font-size: 12px;
  background-color: #F2F2F2;
  border-radius: 6px;
  line-height: 24px;
  margin-top: 20px;

  .title {
    font-weight: 700;
  }
}
</style>