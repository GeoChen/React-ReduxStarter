import React, { Component } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'

class ControlsTop extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const { controls, actions, deleteItemNums, intl : { formatMessage }} = this.props
    const  TopDesc = formatMessage({ id : 'thread.top_desc'}) ,
    btnCancel = formatMessage({ id : 'btn_cancel'}),
    btnSelectAll = formatMessage({ id : 'btn_selectAll'})
    let threadSelectedCount = <FormattedMessage 
      id='thread_selectedCount' 
      values={{
        DeleteItemCount: deleteItemNums
    }} />

    return (
      <div className="controlsTop">
        <div className="controlsTopBanner" style={{ display: controls ? 'none' : 'block' }}>
          <div>{ TopDesc }</div>
        </div>
        <div className="controlsTopTool" style={{ display: controls ? 'block' : 'none' }}>
          <span className="controlsTopBtn" onTouchEnd={ actions.resetDeleteItem } style={{float:'left'}}>{ btnCancel }</span>
          <h3 style = {{ display: "inline" }}>{ threadSelectedCount }</h3>
          <span className="controlsTopBtn" onTouchEnd={ actions.selectAllItem } style={{float:'right'}}>{ btnSelectAll }</span>
        </div>
      </div>
    )
  }
}

export default injectIntl(ControlsTop)//injectIntl 用于在组件中注入 intl 中的 formatMessage 方法
