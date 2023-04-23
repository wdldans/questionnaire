<template>
  <div class="preview" :style="{ height: selfWindow.cWindow.height + 'px' }">
    <div class="header flex align-center justify-between">

      <!-- 退出预览 -->
      <div class="back-button flex justify-center align-center" @click="goBack">
        <img src="../../assets/images/back.png" />
        <span>退出预览</span>
      </div>

      <!-- 自适应视图 -->
      <div class="silder flex align-center">
        <span class="title">自适应视图</span>
        <span class="rate">{{ currentScale }}%</span>
        <el-slider style="width:300px;" :max="120" v-model="currentScale"></el-slider>
      </div>
    </div>

    <div class="main w-100 flex justify-center" :style="{ height: (currentScale/100)*866 + 'px' }">

      <!-- 手机模型 -->
      <div class="phone flex justify-center align-center" :style="{transform: `scale(${currentScale/100})`}">

        <!-- 模型内容 -->
        <div class="content">

          <!-- 跳转 -->
          <skip-to :list="myList" :currentIndex="currentIndex" @updateCurrentIndex="updateCurrentIndex" />

          <!-- 调查问卷内容 -->
          <div class="questionnaire-root flex flex-column">

            <div class="question-content flex flex-column justify-between">
              <div v-if="myList.length">
                <div class="title">{{ myList[currentIndex].propValues[3].value }}</div>
                <div class="title-small">{{ myList[currentIndex].propValues[0].value }}</div>
                <div>
                  <!-- 下拉选项 -->
                  <el-select
                    class="w-100 input-select"
                    v-model="myList[currentIndex].propValues[4].value"
                    v-if="myList[currentIndex].propValues[2].value[0].optionType=='dropdownOptions'"
                  >
                    <el-option
                      v-for="item in myList[currentIndex].propValues[2].value[0].select"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>

                  <!-- 固定选项 单选 -->
                  <el-radio-group
                    v-model="myList[currentIndex].propValues[4].value"
                    v-if="myList[currentIndex].propValues[2].value[0].optionType=='fixedOptions' && myList[currentIndex].propValues[1].value=='radio'"
                  >
                    <div
                      v-for="(item, index) in myList[currentIndex].propValues[2].value"
                      :key="index"
                    >
                      <el-radio :label="item.value" style="padding-bottom:15px;">
                        <span class="option-text">{{ indexArr[index] }}. </span>
                        <span class="option-text" v-if="item.optionType=='fixedOptions'">{{ item.value }}</span>
                        <span class="option-text" v-else>其他</span>
                      </el-radio>
                      <el-input
                        v-if="item.optionType=='inputBox'"
                        class="inputBox"
                        :disabled="myList[currentIndex].propValues[4].value!=item.value"
                        v-model="item.value"
                        placeholder="请填写其他内容"
                        @input="inputBoxCheckboxValueChange"
                      />
                    </div>
                  </el-radio-group>

                  <!-- 固定选项 多选 -->
                  <el-checkbox-group
                    v-model="myList[currentIndex].propValues[4].value"
                    v-if="myList[currentIndex].propValues[2].value[0].optionType=='fixedOptions' && myList[currentIndex].propValues[1].value=='checkbox'"
                  >
                    
                    <div v-for="(item, index) in myList[currentIndex].propValues[2].value" :key="index">
                      <el-checkbox :label="item.value" style="padding-bottom:15px;">
                        <span class="option-text">{{ indexArr[index]}}. </span>
                        <span class="option-text" v-if="item.optionType=='fixedOptions'">{{ item.value }}</span>
                        <span v-if="item.optionType=='inputBox'">
                          <span class="option-text">其他</span>
                        </span>
                      </el-checkbox>
                      <el-input
                        v-if="item.optionType=='inputBox'"
                        class="inputBox"
                        v-model="item.value"
                        :disabled="checkboxDisabled()"
                        @update:model-value="inputBoxCheckboxValueChange"
                        placeholder="请填写其他内容"
                      />
                    </div>
                  </el-checkbox-group>
                </div>
              </div>
              
              <!-- 上下题 -->
              <div class="switch-root flex justify-between">
                <div class="last-btn flex justify-center align-center" @click="clickLastQus">上一题</div>
                <div class="next-btn flex justify-center align-center" @click="clickNextQus">下一题</div>
              </div>
            </div>

            <!-- 说明 -->
            <explain />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Explain from './components/explain.vue'
import SkipTo from './components/skipTo.vue'

export default {
  name: "preview",
  components: {
    Explain,
    SkipTo
  },
  data() {
    return {
      selfWindow: null,
      currentScale: 100,
      indexArr: ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q'],
      currentIndex: 0,
      myList: []
    };
  },
  computed: {
    ...mapState(['list'])
  },
  created() {
    this.selfWindow = nw.Window.get()
    this.formatList()
  },
  methods: {
    goBack() {
      this.$router.back()
    },
    formatList() {
      let serverList = JSON.parse(JSON.stringify(this.list))
      let tmpArr = []
      let tmpKey = ''
      serverList.forEach((item) => {
        if (item.componentName == 'Headline') {
          tmpKey = item.propValues[0].value

        } else if (item.componentName == 'Title') {
          item.propValues[3].value = tmpKey
          if (item.propValues[2].value.length !=0) {
            tmpArr.push(item)
          }
        }
      })
      this.myList = tmpArr
      console.log('myList----', tmpArr)
    },
    // 点击 上一题
    clickLastQus() {
      if (this.currentIndex == 0) {
        this.$message.warning('已经是第一题')
      } else {
        this.currentIndex -= 1
      }
    },
    // 点击 下一题
    clickNextQus() {
      if (this.currentIndex === this.myList.length-1) {
        this.$message.warning('已经是最后一题')
      } else {
        this.currentIndex += 1
      }
    },
    updateCurrentIndex(currentIndex) {
      this.currentIndex = currentIndex
    },
    // 单选 input框改变
    inputBoxCheckboxValueChange(value) {
      this.myList[this.currentIndex].propValues[4].value = value
    },
    checkboxDisabled() {
      let sourceList = this.myList[this.currentIndex].propValues[2].value
      let sourceValue
      sourceList.forEach(item => {
        if (item.optionType == 'inputBox') { // 其他
          sourceValue = item.value
        }
      })
      let finalList = this.myList[this.currentIndex].propValues[4].value
      let len = finalList.length

      if (sourceValue == finalList[len-1]) {
        return false
      } else {
        return true
      }
    }
  },
};
</script>

<style lang="less" scoped>
.preview {
  overflow-y: scroll;
  background-color: #F4F4F4;
  .header {
    width: 100%;
    height: 65px;
    padding: 0px 30px 0px 20px;
    -webkit-app-region: drag; // 拖动应用
    background-color: #ffffff;
    /deep/ .el-slider__bar{
      background-color: #039392;
    }
    .back-button {
      width: 108px;
      height: 34px;
      border-radius: 4px;
      background-color: #039392;
      color: #ffffff;
      cursor: pointer;
      box-shadow: 0px 1px 8px 0px rgba(0,164,163,0.36);
      -webkit-app-region: no-drag;
      img {
        width: 32px;
        height: 32px;
      }
      span {
        font-size: 14px;
      }
    }
    .silder {
      -webkit-app-region: no-drag;
      .title {
        color: #00A4A3;
        font-size: 14px;
      }
      .rate {
        color: #333;
        font-size: 14px;
        margin-left: 20px;
        margin-right: 10px;
      }
    }
  }
  .main {
    padding-top: 50px;
  }
  .phone {
    width: 432px;
    height: 866px;
    background-image: url(../../assets/images/phone-bg.png);
    background-size: 100%;
    background-repeat: no-repeat;
    padding: 60px 28px 27px 29px;
    background-color: #ffffff;
    border-radius: 74px;
    .content {
      width: 100%;
      height: 100%;
      font-size: 14px;
      border-bottom-left-radius: 40px;
      border-bottom-right-radius: 40px;
      position: relative;
      overflow: hidden;
      // border: 1px solid red;
      .questionnaire-root {
        width: 100%;
        padding: 50px 37.5px 0px 37.5px;
        /deep/ .input-select .el-input__inner {
          height: 50px !important;
          border-color: rgba(242, 242, 242, 1);
          border-radius: 10px;
        }
        /deep/ .inputBox .el-input__inner {
          height: 46px !important;
          border-radius: 20px;
          color: #333;
          border: none !important;
          border: 1px solid #d5d0d0;
          background-color: transparent !important;
        }
        .question-content {
          min-height: 350px;
          .title {
            font-size: 21px;
            color: #333;
            font-weight: 700;
          }
          .title-small {
            font-size: 14px;
            color: #333;
            padding-top: 30px;
            padding-bottom: 20px;
            line-height: 1.5;
          }
          .option-text {
            font-size: 14px;
            color: #333;
          }
          .inputBox {
            // background-color: #d5d0d0;
            border: 1px solid #d5d0d0;
            color: #333;
            border-radius: 20px;
          }
          .switch-root {
            margin-top: 40px;
            .last-btn {
              width: 100px;
              height: 50px;
              border: 1px solid #358AFF;
              color: #358AFF;
              border-radius: 25px;
              cursor: pointer;
            }
            .next-btn {
              width: 180px;
              height: 50px;
              background-color: #358AFF;
              color: #fff;
              border-radius: 25px;
              cursor: pointer;
            }
          }
        }
      }
    }
  }
}
</style>