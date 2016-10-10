import React, { Component } from 'react'
import { getReadableDate } from '../utils'
// import dateFormat from 'dateformat'

var dateFormat = require('dateformat')


class MsgItem extends Component {
  constructor(props) {
    super(props)
    this.pressTimer = null
    this.tapTime = null
    // this.onTap = (e) => {
    //   this.props.onTap(e)
    //   this.item ? this.item.removeEventListener('touchend', this.onTap) : null
    // }
  }
  shouldComponentUpdate(nextProps) {
    return this.props.active !== nextProps.active
  }

  handleTouchStart() {
    let self = this
    this.tapTime = +new Date
    // this.item ? this.item.addEventListener('touchend', this.onTap) : null
    // setTimeout(function() {
    //   self.item ? self.item.removeEventListener('touchend', self.onTap) : null
    // }, 300)
    this.pressTimer = setTimeout(self.props.onPress.bind(null, this), 600)
  }
  handleTouchMove() {
    this.tapTime = 0
    // this.item ? this.item.removeEventListener('touchend', this.onTap) : null
    clearTimeout(this.pressTimer)
  }
  handleTouchEnd(e) {
    if (+new Date - this.tapTime < 400) {
      this.props.onTap(e)
    }
    clearTimeout(this.pressTimer)
  }
  render() {
    const { recipients, contact, snippet, localTime, total, event, threadId, active } = this.props

    let ev = {
      onTouchStart: ::this.handleTouchStart,
      onTouchMove: ::this.handleTouchMove,
      onTouchEnd: ::this.handleTouchEnd,
      style: {
        color: active ? 'red' : '#000'
      }
    }

    var datetimeStr = dateFormat(localTime, 'yyyy-mm-dd HH:MM')

    return (
      /* ref={ref => this.item = ref} */
        <li {...ev} className="msg-item">
          <div className="msg-recipients">
            {contact ? contact : recipients} <span>{total > 1 ? `(${total})` : null}</span>
          </div>
          <div className="msg-snippet" dangerouslySetInnerHTML={{ __html: snippet ? snippet : "有新短信" }}></div>
          <div className="msg-time">{datetimeStr}</div>
          {/*<div className="msg-time">{getReadableDate(localTime)}</div>*/}
        </li>
    )
  }
}

export default MsgItem
