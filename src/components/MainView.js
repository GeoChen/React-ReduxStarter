import React, { Component } from 'react'

class MainView extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div className="mainview" {...this.props}>
        { this.props.children }
      </div>
    )
  }
}

export default MainView
