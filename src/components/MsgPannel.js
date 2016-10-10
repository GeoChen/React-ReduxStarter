import React, { Component } from 'react'
import { MessageControlsTop, MessageControlsBottom, MsgDialog } from '../components'
import throttle from 'lodash/throttle'

// import Infinite from 'react-infinite'
import ReactList from 'react-list'


class MsgPannel extends Component {
  constructor(props) {
    super(props)
    this.fetching = true
  }
  componentWillReceiveProps(nextProps) {
    let oldPaginationTags = this.props.paginationTags,
        newPaginationTags = nextProps.paginationTags
    this.fetching = nextProps.actionType === 'UPDATE_PAGINATION' && oldPaginationTags === newPaginationTags
  }

  checkUpdate(e) {
    // if (600 - e.target.scrollTop < 50 && this.fetching === false) { 
    // if (e.target.offsetHeight - e.target.scrollTop + 200 > e.target.scrollHeight && this.fetching === false) {
    if (e.target.scrollHeight - e.target.scrollTop < e.target.scrollHeight/2 && this.fetching === false) { 
      this.props.actions.getPagination()
      this.fetching = true
    }
  }

  handleScroll(e) {
    // 由于用了 throttle 使得事件处理函数变成了异步的，在 react 中可能会导致 e.target
    // 丢失，故加上下面这一行代码。
    e.persist()
    throttle(::this.checkUpdate, 1000)(e)
  }

  //message 中的点击事件
  handleMessageDialogTap(id, tag, index) {
    let { actions, deleteMessage } = this.props
    if (Object.keys(deleteMessage).length !== 0) {
      actions.updateDeleteMessage(tag, id, index)
    }
  }

  //message 中的长按选择事件
  handleMessageDialogPress(id, tag, index) {
    let { actions, deleteMessage } = this.props
    if (Object.keys(deleteMessage).length === 0) {
      actions.updateDeleteMessage(tag, id, index)
    }
  }

  renderItem(index, key) {
    if (!this.props.pagination[index]) {
      return
    }else{
      const el = this.props.pagination[index]
      let props = {
        body: el.body,
        localTime: el.localTime,
        folder: el.folder,
        onTap: this.handleMessageDialogTap.bind(this, el.id, el.tag, index),
        onPress : this.handleMessageDialogPress.bind(this, el.id, el.tag, index),
        isDeleteMesssageColor: this.props.deleteMessage[el.id] !== undefined
      }
      return <MsgDialog key={el.tag} {...el} {...props} />
    }
  }
  render() {
    const { children, isMesssageControlShow, actions, pagination } = this.props
    this.renderItem.toJSON = () => this.renderItem.toString()
    // const { recipients, connect, children, isMesssageControlShow, deleteMessageNums, actions } = this.props
    // let MsgControlsTopProp = {
    //   recipients : recipients,
    //   connect : connect,
    //   actions : actions,
    //   isMesssageControlShow : isMesssageControlShow,
    //   deleteMessageNums : deleteMessageNums
    // }
    // console.log(children.length)
    return (
      <div className="msg-pannel">
        <MessageControlsTop {...this.props} />
        <div className="msg-pannel-body" onScroll={::this.handleScroll} style={{ bottom: isMesssageControlShow ? '60px' : '0' }} >
          {<ReactList 
            itemRenderer={::this.renderItem}
            // length= {this.props.paginationInfo.length}
            length= {this.props.paginationCount}
            type='variable'
            threshold= { 900 }
          /> } 

          {/*<Infinite className="msg-pannel-body-Infinite" containerHeight={700} elementHeight={50}>}
          {
            children
          }
          {</Infinite>*/}
        </div>
        <MessageControlsBottom isMesssageControlShow={ isMesssageControlShow } actions={ actions } />
      </div>
    )
  }
}

export default MsgPannel


