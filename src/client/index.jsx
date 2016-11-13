
import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import App from '../common/components/app.jsx'
import store from '../common/store'

render(
  <Provider store={store(window.LOCALS)}>
    <App />
  </Provider>,
  document.getElementById('root')
)
