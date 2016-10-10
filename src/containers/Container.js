import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import throttle from 'lodash/throttle'

import { MsgContainer, MsgItem, Controls, ControlsTop } from '../components'
import * as actions from '../actions'

class Container extends Component {
  constructor(props) {
    super(props)
    props.actions.getMessage()
    // this.fetching 表示请求是否正在进行中，当请求的回调完成时 props 会更新
    // 然后在 componentWillReceiveProps 中对 this.fetching 进行修改
    // 在最后一次请求时完成的回调中， this.fetching 会被设置为 true ，来阻止请求
    this.fetching = true
  }
  componentWillReceiveProps(nextProps) {
    let oldSyncThreadTag = this.props.threadTags.syncThreadTag,
        newSyncThreadTag = nextProps.threadTags.syncThreadTag
    // 在处理这部分的时候遇到了一个 bug，对于诸如 UPDATE_DELETE_ITEM 等 Action 也会执行这部分
    // 使得仅通过判断 oldSyncThreadTag === newSyncThreadTag 不能知道请求是否结束
    // 故将 actionType 存入 store 来方便判断
    // 另外一种思路是将 fetching 存入 store ，不过目前我只有一个 reducer ，
    // 将 fetching 放入 store 感觉不太合适
    // 更合理的方式应该是将 Container 和 Pannel 各对应一个 reducer，fetching 由
    // Container 的 reducer 处理，不过感觉没时间做了
    this.fetching = nextProps.actionType === 'UPDATE_MESSAGE' && oldSyncThreadTag === newSyncThreadTag
  }
  checkUpdate(e) {
    // if (600 - e.target.scrollTop < 50 && this.fetching === false) { 
    // if (e.target.offsetHeight - e.target.scrollTop + 200 > e.target.scrollHeight && this.fetching === false) {
    if (e.target.scrollHeight - e.target.scrollTop < e.target.scrollHeight/2 && this.fetching === false) { 
      this.props.actions.getMessage()
      this.fetching = true
    }
  }
  handleScroll(e) {
    // 由于用了 throttle 使得事件处理函数变成了异步的，在 react 中可能会导致 e.target
    // 丢失，故加上下面这一行代码。
    e.persist()
    throttle(::this.checkUpdate, 1000)(e)
  }
  handleItemTap(entry, index) {
    let { actions, deleteItem } = this.props
    if (Object.keys(deleteItem).length !== 0) {
      actions.updateDeleteItem(entry.tag, index)
    } else {
      window.location.hash = entry.threadId
      actions.storeTag(entry.tag, index)
    }
  }
  // 长按事件
  handleItemPress(index, el) {
    // 此处的 el 是对应的 MsgItem 组件， this 是 Container 组件
    let { actions, deleteItem } = this.props
    let { tag } = el.props
    if (Object.keys(deleteItem).length === 0) {
      actions.updateDeleteItem(tag, index)
    }
  }
  render() {
    const { content, message, deleteItem, actions } = this.props

    //此处考虑如何将deleteItemNums和controls合并为一个，并传递到各个组件
    let deleteItemNums = Object.keys(deleteItem).length
    let controls = deleteItemNums !== 0
    if(Object.keys(content).length){//用于检查通讯录content是否为空
      return (
        <div style={{height:'100%'}}>
          <ControlsTop controls={controls} actions={actions} deleteItemNums={deleteItemNums}/>
          <MsgContainer controls={controls} onScroll={::this.handleScroll}>
            {
              message.map((el, index) => {
                if (!el) {
                  return null
                }
                let props = {
                  onTap: this.handleItemTap.bind(this, el.entry, index),
                  onPress: this.handleItemPress.bind(this, index),
                  active: deleteItem[el.entry.tag] !== undefined
                }

                !!el.entry.contactId && !!content[el.entry.contactId] ?
                  el.entry.contact = content[el.entry.contactId] :
                  null
                return <MsgItem key={el.entry.id} {...el.entry} {...props}/>
              })
            }
          </MsgContainer>
          <Controls controls={controls} actions={actions} />
        </div>
      )
    }
    return null
  }
}

function mapState(state) {
  let { content, message, threadTags, deleteItem  } = state.toJS()
  return { content, message, threadTags, deleteItem }
}

function mapDispatch(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapState, mapDispatch)(Container)
