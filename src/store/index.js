import { nanoid } from 'nanoid'
import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router/index'
import { Message } from 'element-ui'
import { saveJSON } from '../utils/save.js'
import { currentTime } from '../utils/commonFn.js'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    // 拖动到界面的组件数据
    list: [],
    // 当前选中的对象（浅拷贝）
    currentItem: {},
    // 是否展示 选项下拉框
    showOptionsDropDown: false,
    // 是否展示 编辑模板
    showEditTemplate: false,
    // 模板名称（本地）
    localFileName: '',
    // 模板名称（内存）
    filename: '',
    // 最近保存时间
    lastSaveTime: '',
    // 是否为创建item
    isCreateItem: false
  },

  getters: {
    // 当前item序号
    currentIndex: state => {
      const list = state.list
      for(let i=0; i<list.length; i++) {
        if (list[i].id === state.currentItem.id) {
          return i+1
        }
      }
    }
  },
  
  mutations: {
    // 初始化模板
    initTemplate(state, data) {
      state.filename = data.filename
      state.list = data.list
    },
    // 点击item
    clickCurrentItem(state, item) {
      state.currentItem = item
    },
    // 创建item（在最后）
    createNewItemEnd(state, data) {
      state.list = [...state.list, data] // 放入界面
      state.currentItem = data // 选中
      state.isCreateItem = true
      console.log(state.list)
    },
    // 创建item（在后面）
    createNewItemBehind(state, obj) {
      let { index, data } = obj
      state.list.splice(index+1, 0, data)
      state.currentItem = data // 选中
      state.isCreateItem = true
      console.log(state.list)
    },
    // 是否为创建item
    setCreateItemState(state, type) {
      state.isCreateItem = type
    },
    // 删除选中item
    delCurrentItem(state) {
      state.list.forEach((item, index) => {
        if (item.id == state.currentItem.id) {
          state.list.splice(index, 1)
        }
      })
      state.currentItem = {}
    },
    // 复制选中item
    copyCurrentItem(state) {
      const list = state.list
      for(let i=0; i<list.length; i++) {
        if (list[i].id == state.currentItem.id) {
          let newItem = JSON.parse(JSON.stringify(state.currentItem))
          newItem.id = nanoid()
          state.list.splice(i+1, 0, newItem)
          state.currentItem = newItem
          break
        }
      }
    },
    // 移动选中item
    moveCurrentItem(state, type) {
      if (state.list.length === 1) {
        Message.warning('当前只有一个标题/题目，无法移动~')
        return
      }
      const list = state.list
      for (let i=0; i<list.length; i++) {
        if (list[i].id == state.currentItem.id) {
          if (type === 'forward') { // 向前
            if (i == 0) { // 第一个
              Message.warning('当前选中已经是第一个了~')
              break
            }
            state.list.splice(i, 1)
            state.list.splice(i-1, 0, state.currentItem)

          } else if (type === 'headmost') { // 最前
            if (i == 0) { // 第一个
              Message.warning('当前选中已经是第一个了~')
              break
            }
            state.list.splice(i, 1)
            state.list.unshift(state.currentItem)
            
          } else if (type === 'backwards') { // 向后
            if (i === (state.list.length-1)) {
              Message.warning('当前选中已经是最后一个了~')
              break
            }
            state.list.splice(i, 1)
            state.list.splice(i+1, 0, state.currentItem)

          } else if (type === 'backmost') { // 最后
            if (i == (state.list.length-1)) {
              Message.warning('当前选中已经是最后一个了~')
              break
            }
            state.list.splice(i, 1)
            state.list.push(state.currentItem)
          }
          break
        }
      }
    },
    // 创建option
    createNewOption(state, option) {
      if (option.optionType === 'dropdownOptions') { // 下拉选项(只能单选)
        state.currentItem.propValues[1].value = 'radio'
      }
      state.currentItem.propValues[2].value.push(option)
    },
    // 删除option
    delOption(state, option) {
      let currentOptions = state.currentItem.propValues[2].value
      for (let i=0; i<currentOptions.length; i++) {
        if (currentOptions[i].id === option.id) {
          currentOptions.splice(i,1)
          break
        }
      }
    },
    // 设置 是否显示 选项下拉框
    setOptionsDropDown(state, type) {
      state.showOptionsDropDown = type
    },
    // 设置 是否显示 编辑模板
    setEditTemplate(state, type) {
      state.showEditTemplate = type
    },
    // 取消选中item
    cancelCurrentItem(state) {
      console.log('取消选中')
      state.currentItem = {}
    },
    // 更新保存时间
    updateSaveTime(state) {
      state.lastSaveTime = currentTime()
    },
    // 更新本地文件名称
    updateLocalFileName(state) {
      state.localFileName = state.filename
    },
    // 设置模板名称
    setTemplateName(state, newName) {
      state.filename = newName
    }
  },

  actions: {
    // 保存模板
    checkList({ state, commit }, type) {

      // 循环遍历state.list是否存在没有填写的情况 存在 滚动并选中
      const list = state.list

      for(let i=0; i<list.length; i++) {
        // 标题 or 题目 没有填写
        let  value = list[i].propValues[0].value.trim()
        if ( value === '新建标题' || value === '新建题目' || value == '') {
          state.isCreateItem = true
          state.currentItem = list[i]
          Message.warning('存在没有填写的标题！')
          return
        }

        // 题目选项
        if (list[i].componentName === 'Title') { // 题目
          let titleValArr = list[i].propValues[2].value
          if (!titleValArr.length) { // 没有选项
            state.isCreateItem = true
            state.currentItem = list[i]
            Message.warning('存在题目没有选项！')
            return

          } else { // 选项没有填写 且 不是inputBox
            for (let j=0; j<titleValArr.length; j++) {
              let titleVal = titleValArr[j].value.trim()
              let optionType = titleValArr[j].optionType
              if (titleVal == '' && optionType != 'inputBox') {
                state.isCreateItem = true
                state.currentItem = list[i]
                Message.warning('存在题目选项没有填写！')
                return
              }
            }
          }
        }
      }

      if (type === 'preview') {
        // 预览
        router.push('/preview')

      } else if (type === 'save') {
        // 保存
        
        if (!state.filename) {
          Message.warning('请填写模板名称！')
         return
        }

        commit('updateSaveTime') // 更新保存时间

        // 保存到服务器
        let serverList = JSON.parse(JSON.stringify(state.list))
        let tmpKey = ''
        serverList.forEach((item) => {
          if (item.componentName == 'Headline') {
            tmpKey = item.propValues[0].value

          } else if (item.componentName == 'Title') {
            item.propValues[3].value = tmpKey
          }
        })
        console.log('serverList----', serverList)
        const obj = {
          filename: state.filename,
          localFileName: state.localFileName,
          currentIndex: 0,
          list: serverList
        }
        // 保存到本地
        saveJSON(obj)

        // 更新本地文件名称
        commit('updateLocalFileName')

      }
    }
  }
})

export default store