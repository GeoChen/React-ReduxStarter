import cookie from 'tiny-cookie'
import formurlencoded from 'form-urlencoded'
import { myFetch, getUserID } from '../utils'

// 获取用户通讯录以便在短信列表中显示发信人姓名数据
export function getContent() {
  return (dispatch, getState) => {
    const { contentTags, content } = getState().toJS()
    const { syncTag = 0, syncIgnoreTag = 0, limit = 400 } = contentTags
    const uuid = getUserID()
    const options = {
      method : 'GET',
      query : {
        syncTag : syncTag,
        limit : limit,
        syncIgnoreTag : syncIgnoreTag,
        uuid : uuid,
      },
    }
    const url = `/contacts/${uuid}/initdata`
    myFetch(url, options).then((data) => {
      //只获取通讯录中用到的数据,写入store中
      let tempContent = {}
      for (let contentId in data.content){
        tempContent[contentId] = data.content[contentId].content.displayName
      }
      dispatch(updateContent({
        content: {...content, ...tempContent},
        syncTag: data.syncTag,
        syncIgnoreTag: data.syncIgnoreTag
      }))
      if (!data.lastPage) {
        dispatch(getContent())
      }
    })
  }
}

// 更新 store 中保存的通讯录
export function updateContent({ content, syncTag, syncIgnoreTag }) {
  return {
    type: 'UPDATE_CONTENT',
    content,
    syncTag,
    syncIgnoreTag
  }
}

// 获取短信列表
export function getMessage() {
  return (dispatch, getState) => {
    const { threadTags, message } = getState().toJS()
    const { syncTag = 0, limit = 21, readMode = 'older', withPhoneCall = true, syncThreadTag = 0 } = threadTags
    const uuid = getUserID()
    const options = {
      method : 'GET',
      query : {
        syncTag : syncTag,
        limit : limit,
        readMode : readMode,
        withPhoneCall : withPhoneCall,
        uuid : uuid,
        syncThreadTag : syncThreadTag,
      },
    }
    const url = `/sms/${uuid}/deleted/thread`
    myFetch(url, options)
      .then((data) => {
        dispatch(updateMessage({
          message: message.concat(data.entries),
          syncTag: data.watermark.syncTag,
          syncThreadTag: data.watermark.syncThreadTag
        }))
      })
  }
}

// 更新短信列表
export function updateMessage({ message, syncTag, syncThreadTag }) {
  return {
    type: 'UPDATE_MESSAGE',
    message,
    syncTag,
    syncThreadTag
  }
}

// 更新某一条目在短信列表中的选择状态
export function updateDeleteItem(tag, index) {
  return {
    type: 'UPDATE_DELETE_ITEM',
    tag,
    index
  }
}

// 取消选择所有条目
export function resetDeleteItem() {
  return {
    type: 'RESET_DELETE_ITEM'
  }
}

// 全选
export function selectAllItem() {
  return {
    type: 'SELECT_ALL_ITEM'
  }
}

export function handleSelectItem(usage) {
  return (dispatch, getState) => {
    const { deleteItem, message } = getState().toJS()

    for (let tag in deleteItem) {
      if (deleteItem.hasOwnProperty(tag)) {
        let { threadId } = message[deleteItem[tag]].entry
        const uuid = getUserID()
        let url = `/sms/${uuid}/deleted/thread/${threadId}/${usage}`
        let options = {
              method : 'POST',
              body : {
                tag : tag,
                uuid : uuid,
              },
            }
        myFetch(url, options)
          .then(() => dispatch(removeItem(tag)))
      }
    }
  }
}

// 将选择的条目从列表中移除，无论是彻底删除还是恢复
export function removeItem(tag) {
  return {
    type: 'REMOVE_ITEM',
    tag
  }
}

// 更新当前展示的分页
export function updateThreadId(threadId, tag=0) {
  return {
    type: 'UPDATE_THREAD_ID',
    threadId
  }
}

// 初次获取某一分页的各条短信
export function getPagination() {
  return (dispatch, getState) => {
    const { threadId, content, pagination, paginationTags } = getState().toJS()
    const uuid = getUserID()
    let url = `/sms/${uuid}/deleted/thread/${threadId}/pagination`
    let options = {
      method : 'GET',
      query : {
        readMode : 'older',
        limit : 21,
        threadId : threadId,
        cnt : 21,
        uuid : uuid,
        syncTag : paginationTags,
      },
    }
    return myFetch(url, options)
      .then( data => {
        !!data.contactId && !!content[data.contactId] ?
          data.contact = content[data.contactId] :
          null
        dispatch(updatePagination({       
          message: pagination.concat(data.entries.reverse()),          
          connect: data.contact,
          recipients: data.entries[0].recipients,
          paginationTags : data.syncTag,
        })) 
    })
  }
}

// 更新某一分页的各条短信
export function updatePagination({ message, connect, recipients, paginationTags}) {
  return {
    type: 'UPDATE_PAGINATION',
    message,
    activeContact: { connect, recipients },
    paginationTags: paginationTags
  }
}

// 清空保存的分页短信数据
export function clearPagination() {
  return {
    type: 'CLEAR_PAGINATION'
  }
}

//保存当前号码的tag和index，用于当某一页短信全删完后自动返回，并在列表中清除该条短信
export function storeTag(delTag, delIndex) {
  return {
    type: 'STORE_TAG',
    delTag,
    delIndex,
  }
}

//删除或恢复某一用户的message对话
export function handleSelectMessage(usage) {//增加异步操作
  return (dispatch, getState) => {
    const { deleteMessage, message, pagination } = getState().toJS()
    const serviceToken = encodeURIComponent(cookie.get('serviceToken'))
    const uuid = getUserID()
    //由于 message 删除API问题（如果一次删除过多，会造成部分message无法删除）。
    //解决办法：把要删除的message放入一个数组，借助promise函数和递归，逐条遍历删除
    //每条message，而不是一次全删。
    let deleteMessageArray = []
    for (let msgIndex in deleteMessage){
      if (deleteMessage.hasOwnProperty(msgIndex)) {
        deleteMessageArray.push({ [msgIndex] : deleteMessage[msgIndex] })
      }
    }
    (function processFun(deleteMessageArray) {
      let deleteOne = deleteMessageArray.pop()
      if (!deleteOne) {return 0}
      let id =Object.keys(deleteOne)[0]
      let url = `/sms/${uuid}/deleted/${usage}`
      let options = {
        method : 'POST',
        body : {
          id : id,
          tag : deleteMessage[id]['tag'],
          uuid : uuid,
        },
      }

      myFetch(url, options)
        .then(() => {
          dispatch(removeMessage(id))
          processFun(deleteMessageArray)

          const { pagination, delInfo } = getState().toJS()
          if (!pagination.length) {
            //性能需要优化的地方
            dispatch(updateDeleteItem(delInfo.delTag, delInfo.delIndex))
            dispatch(removeItem(delInfo.delTag))
            dispatch(updateThreadId(''))
            window.location.hash = ''
          }
        })
    })(deleteMessageArray)

  }
}

// state 中增加要删除的message
export function updateDeleteMessage(tag, id, index) {
  return {
    type: 'UPDATE_DELETE_MESSAGE',
    tag,
    id,
    index
  }
}

// 全选
export function selectAllMessage() {
  return {
    type: 'SELECT_ALL_MESSAGE'
  }
}
// 取消选择所有条目
export function resetDeleteMessage() {
  return {
    type: 'RESET_DELETE_MESSAGE'
  }
}

//移除处理后的message
export function removeMessage(id) {
  return {
    type: 'REMOVE_MESSAGE',
    id
  }
}