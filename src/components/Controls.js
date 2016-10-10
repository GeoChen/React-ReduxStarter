import React, { Component } from 'react'
import { FormattedMessage, injectIntl } from 'react-intl'

class Controls extends Component {
  constructor(props) {
    super(props)
  }
  shouldComponentUpdate(nextProps) {
    return this.props.controls !== nextProps.controls
  }
  deleteSelectItem() {
    if (confirm('确定彻底删除该短信？')) {
      this.props.actions.handleSelectItem.call(this, 'purge')
    }
  }
  restoreSelectItem() {
    this.props.actions.handleSelectItem.call(this, 'restore')
  }

  render() {
    const { children, controls, intl : { formatMessage }} = this.props
    const  btnRestore = formatMessage({ id : 'btn_restore'}),
      btnDeleteCompletely = formatMessage({ id : 'btn_deleteCompletely'})
    return (
      <div className="controlsBottom" style={{ display: controls ? 'block' : 'none' }}>
        <span className="controlsBottomBtn controlsBottomBtnRecovery" onTouchEnd={ ::this.restoreSelectItem }><span className="BtnRecoveryPng"></span>{ btnRestore }</span>
        <span className="controlsBottomBtn controlsBottomBtnPurge" onTouchEnd={ ::this.deleteSelectItem }><span className="BtnPurgePng"></span>{ btnDeleteCompletely }</span>
      </div>
    )
  }
}

export default injectIntl(Controls)
