/**
 * 文件保存相关
 */
import { Message } from 'element-ui'
const fs = nw.require("fs")
// const path = nw.require('path')

export const basePath = (global || window).defaultStoragePath || ".";
console.log('basePath---', basePath)


// 创建
const mkdirSync = (obj, fileUrl) => {
  const content = JSON.stringify(obj, null, 2);
  const fd = fs.openSync(fileUrl, "w");
  fs.writeSync(fd, content)
  fs.closeSync(fd)
}


// 保存本地文件
export const saveJSON = (obj) => {
  console.log('obj===', obj)
  let catalogUrl = basePath+"/template"
  let newName = `${basePath}/template/${obj.filename}.json`
  let oldName = `${basePath}/template/${obj.localFileName}.json`
  if (fs.existsSync(catalogUrl)) {
    console.log('存在目录-------')

    if (fs.existsSync(oldName)) {
      console.log('文件存在---------')
      fs.renameSync(oldName, newName) // 修改本地文件名称
      mkdirSync(obj, newName)

    } else {
      console.log('文件不存在-----')
      mkdirSync(obj, newName)
    }

  } else {
    console.log('不存在目录-------')
    fs.mkdirSync(catalogUrl)
    mkdirSync(obj, newName)
  }
  Message.success('保存成功')
}


// 读取本地文件
export const readJSON = ({filename}) => {
  const fileName = `${basePath}/template/${filename}.json`
  if (fs.existsSync(fileName)) {
      const data = fs.readFileSync(fileName)
      try {
        return JSON.parse(data)
      } catch (e) {
        console.log(e.message)
        return {}
      }
  }
  return {}
}

