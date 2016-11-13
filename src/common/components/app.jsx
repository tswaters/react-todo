
import React, {PropTypes} from 'react'
import {connect} from 'react-redux'

import {container} from './app.css'

import TodoAdd from './TodoAdd.jsx'
import TodoList from './TodoList.jsx'

const mapStateToProps = state => ({
  current: state.current,
  list: state.list
})

const App = ({current, list}) =>
  <div className={container}>
    <h1>{'Todo Application'}</h1>
    <TodoList list={list} />
    <TodoAdd todo={current} />
  </div>

App.propTypes = {
  current: PropTypes.shape({
    id: PropTypes.number,
    text: PropTypes.string.isRequired
  }),
  list: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    text: PropTypes.text
  })).isRequired
}

export default connect(mapStateToProps)(App)
