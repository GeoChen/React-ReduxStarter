import React, { Component } from 'react'
import Infinite from 'react-infinite'

class MsgContainer extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const { children, controls } = this.props
    return (
      <div className="msg-container" style={{ bottom: controls ? '60px' : '0' }}>
        <ul {...this.props} className="msg-container-body" id="container" >
          <Infinite className="msg-container-body" containerHeight={760} elementHeight={76}>
            {children}
          </Infinite>
        </ul>
      </div>
    )
  }
}

export default MsgContainer


