import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
require('es6-promise').polyfill()
import 'isomorphic-fetch'

import { Container, Pannel } from './containers'
import * as actions from './actions'


class App extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <h1>React & Redux Starter Here!</h1>
    )
  }
}

function mapState(state) {
  return {}
}

function mapDispatch(dispatch) {
  return {}
}

export default connect(mapState, mapDispatch)(App)
