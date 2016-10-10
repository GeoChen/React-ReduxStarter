import React, { Component } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'

class MessageControlsBottom extends Component {
  constructor(props) {
    super(props)
  }
  shouldComponentUpdate(nextProps) {
    return this.props.isMesssageControlShow !== nextProps.isMesssageControlShow
  }
  deleteSelectMessage() {
    if (confirm('确定彻底删除该短信？')) {
      this.props.actions.handleSelectMessage.call(this, 'purge')
    }
  }
  restoreSelectMessage() {
    this.props.actions.handleSelectMessage.call(this, 'restore')
  }
  render() {
    const { isMesssageControlShow, intl : { formatMessage }} = this.props
    const btnRestore = formatMessage({ id : 'btn_restore'}),
      btnDeleteCompletely = formatMessage({ id : 'btn_deleteCompletely'})

    return (
      <div className="controlsBottom" style={{ display: isMesssageControlShow ? 'block' : 'none' }}>
        <span className="controlsBottomBtn controlsBottomBtnRecovery" onTouchStart={ ::this.restoreSelectMessage } ><span className="BtnRecoveryPng"></span>{btnRestore}</span>
        <span className="controlsBottomBtn controlsBottomBtnPurge" onTouchStart={ ::this.deleteSelectMessage } ><span className="BtnPurgePng"></span>{btnDeleteCompletely}</span>
      </div>
    )
  }
}

export default injectIntl(MessageControlsBottom)




