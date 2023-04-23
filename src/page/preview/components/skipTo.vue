<template>
  <div>
    <!-- 顶部 进度 学校 -->
    <div class="skip-root flex justify-between">
      <div class="flex align-center" @click="clickSkipTo">
        <span>进度：</span>
        <span>{{ currentIndex }} / {{ list.length || 0 }}</span>
        <span class="link-skip">（跳转）</span>
      </div>
      <div class="right-school flex justify-center align-center">淮阴师范学院</div>
    </div>

    <!-- 底部 弹出层 -->
    <el-drawer
      :with-header="false"
      :visible.sync="showSkip"
      direction="btt"
      :append-to-body="false"
      :modal-append-to-body="false"
      style="position:absolute"
    >
      <div style="width:100%;height:10px;"></div>
      <div
        class="skip-item flex align-center"
        v-for="(item, index) in list"
        :key="index"
        @click="clickSkipItem(index)"
      >
        <div class="title" :class="{answered: isAnswered(item)}">{{ item.propValues[0].value }}</div>
        <img v-if="isAnswered(item)" src="../../../assets/images/answered.png" />
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { isAnswered } from '../../../utils/commonFn.js'

export default {
  name: 'skipTo',
  props: ['list', 'currentIndex'],
  data() {
    return {
      showSkip: false,
      isAnswered: isAnswered
    }
  },
  methods: {
    clickSkipTo() {
      this.showSkip = !this.showSkip
    },
    clickSkipItem(index) {
      this.showSkip = false
      this.$emit('updateCurrentIndex', index)
    }
  }
}
</script>

<style lang="less" scoped>
/* 顶部 进度 学校 */
.skip-root {
  width: 100%;
  padding: 15px 10px 0px 20px;
  font-size: 14px;
  color: #999;

  .link-skip {
    color: #358AFF;
    cursor: pointer;
  }

  .right-school {
    font-size: 12px;
    padding: 6px 12px;
    background-color: #E1EBFA;
    color: #358AFF;
    border-radius: 13px;
  }
}
/deep/ .v-modal {
  position: absolute;
}
/deep/.el-drawer__open .el-drawer.btt {
  border-top-left-radius: 13px;
  border-top-right-radius: 13px;
}

/* 底部 弹出层 */
.skip-item {
  border-bottom: 1px solid #e9e9e9;
  padding: 15px 0px;
  position: relative;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  .title {
    width: 340px;
    padding-left: 20px;
    padding-right: 15px;
  }
  .answered {
    color: #358AFF;
  }
  img {
    width: 14px;
    height: 11px;
  }
}
</style>