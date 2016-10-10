import React, { Component } from 'react'
import { getReadableDate } from '../utils'

class MsgDialog extends Component {
  constructor(props) {
    super(props)
    this.pressTimer = null
    this.tapTime = 0
    this.active = null
  }
  shouldComponentUpdate(nextProps) {
    return nextProps.isDeleteMesssageColor !== this.props.isDeleteMesssageColor
  }
  handleTouchStart() {
    let self = this
    this.tapTime = +new Date
    this.pressTimer = setTimeout(self.props.onPress.bind(null, this), 500)
  }

  handleTouchMove() {
    this.tapTime = 0
    clearTimeout(this.pressTimer)
  }

  handleTouchEnd(e) {
    if (+new Date - this.tapTime < 300) {
      this.props.onTap(e)
    }
    clearTimeout(this.pressTimer)
  }

  render() {
    const { body, localTime, folder, isDeleteMesssageColor } = this.props

    let ev = {
      onTouchStart: ::this.handleTouchStart,
      onTouchMove: ::this.handleTouchMove,
      onTouchEnd: ::this.handleTouchEnd,
    }
    let messageStyle = {
      style: {
        color: isDeleteMesssageColor ? 'red' : '#000',
        float: folder ? 'right' : 'left',
        background:folder ? '#b0e167' : '#f8f8f8'
      }
    }
    return (
      <div style={{padding: '4px'}}>
        <div {...ev} {...messageStyle} className="msg-dialog-item" ><span className="msg-dialog-item-content" dangerouslySetInnerHTML={{ __html: body ? body : "为保护您的信息安全，此消息内容延后几天显示"}}></span></div>
        <div style={{clear: 'both'}}></div> 
      </div>
    )
  }
}

export default MsgDialog

// <span style={{display:'block', textAlign:'center' color:'#b8b7bd' }}>{getReadableDate(localTime)}</span>
