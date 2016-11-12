
import {join} from 'path'
import express from 'express'

import React from 'react'
import {renderToString} from 'react-dom/server'
import App from '../assets/app.jsx'

const app = express()

app.set('views', join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.static(join(__dirname, '../public')))
app.get('/:name?', (req, res) => {
  const state = {name: req.params.name}
  const body = renderToString(React.createElement(App, state, null))

  res.render('index', {state, body})
})

export default app
