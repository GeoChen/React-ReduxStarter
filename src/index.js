import React, { Component } from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import './assets/styles/normalize.css'
import './assets/styles/style.css'

import configureStore from './store/configureStore'
import App from './app'

//用于插件Perf调试
import Perf from 'react-addons-perf'
window.Perf = Perf

const store = configureStore()
render(
	<Provider store={store}>
  	<App/>
	</Provider>, 
  document.getElementById('app')
)


