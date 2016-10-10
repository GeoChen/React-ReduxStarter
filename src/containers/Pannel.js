import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { MsgPannel, MsgDialog, Controls } from '../components'
import * as actions from '../actions'


class Pannel extends Component {
  constructor(props) {
    super(props)
    props.actions.getPagination()
  }
  componentWillUnmount() {
    this.props.actions.clearPagination()
    this.props.actions.resetDeleteMessage()
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
  
  render() {
    const { pagination, activeContact, deleteMessage, actions, paginationTags } = this.props
    let deleteMessageNums = Object.keys(deleteMessage).length
    let isMesssageControlShow = deleteMessageNums !== 0
    //项目初期为保留message的index，故将删除的message置为undefined，因此此处需要把undefined过滤
    let paginationInfo = []
    pagination.map((el,index) => {
      if (!el) {
        return 
      } else {
        paginationInfo.push(el)
      }
    })

    let MsgPannelProps = {
      isMesssageControlShow: isMesssageControlShow,
      deleteMessageNums: deleteMessageNums,
      actions: actions,
      paginationTags: paginationTags,
      // paginationInfo: paginationInfo,
      paginationCount: paginationInfo.length,
      deleteMessage: deleteMessage,
      pagination: pagination,
    }
    return (
      <MsgPannel {...activeContact} {...MsgPannelProps} >
      {/*
        pagination.map((el,index) => {
          if (!el) {
            return 
          } else {
            let props = {
              body: el.body,
              localTime: el.localTime,
              folder: el.folder,
              onTap: this.handleMessageDialogTap.bind(this, el.id, el.tag, index),
              onPress : this.handleMessageDialogPress.bind(this, el.id, el.tag, index),
              isDeleteMesssageColor: deleteMessage[el.id] !== undefined
            }
            return <MsgDialog key={el.tag} {...el} {...props} />
          }
        })
      */}
      </MsgPannel>
    )
  }
}

function mapState(state) {
  let { pagination, activeContact, deleteMessage, paginationTags } = state.toJS()
  return { pagination, activeContact, deleteMessage, paginationTags }
}

function mapDispatch(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapState, mapDispatch)(Pannel)
