import React, { Component } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'

class MessageControlsTop extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const { isMesssageControlShow, actions, deleteMessageNums, recipients, connect, intl : { formatMessage }} = this.props
    const btnCancel = formatMessage({ id : 'btn_cancel'}),
      btnSelectAll = formatMessage({ id : 'btn_selectAll'})
    let detailDeleteMessageNums = <FormattedMessage 
      id='message_selectedCount' 
      values={{
        DeleteItemCount: deleteMessageNums
      }} />
    return (
      <div >
        <div className="msg-pannel-top" style={{ display: isMesssageControlShow ? 'none' : 'block' }} > 
          <div className="msg-pannel-connect">
            { connect ? connect: recipients }
          </div>
          <div className="msg-pannel-recipients">
            { recipients ? recipients : null }
          </div>
        </div>

        <div className="msg-pannel-controlTop" style={{ display: isMesssageControlShow ? 'flex' : 'none' }}>
          <div style={{ width : '100%' , padding : '0 15px' }} >
            <span className="controlsTopBtn" onTouchStart={actions.resetDeleteMessage} style={{float:'left'}}>{btnCancel}</span>
            <h3 style = {{ display: "inline" }}>{detailDeleteMessageNums}</h3>
            <span className="controlsTopBtn" onTouchStart={actions.selectAllMessage} style={{float:'right'}}>{btnSelectAll}</span>
          </div>
        </div>
      </div>
    )
  }
}
export default injectIntl(MessageControlsTop)
