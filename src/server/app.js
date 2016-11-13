
import {join} from 'path'
import express from 'express'

import React from 'react'
import {renderToString} from 'react-dom/server'
import {Provider} from 'react-redux'

import App from '../common/components/app.jsx'
import createStore from '../common/store'

const app = express()

app.set('views', join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.static(join(__dirname, '../public')))

app.use((req, res) => {
  const state = {}

  const store = createStore(state)

  const body = renderToString(
    React.createElement(Provider, {store},
      React.createElement(App, null, null)
    )
  )

  res.render('index', {body, state: store.getState()})
})

export default app
