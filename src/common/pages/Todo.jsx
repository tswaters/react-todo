
import React, {PureComponent} from 'react'
import {FormattedMessage} from 'react-intl'
import {asyncConnect} from 'redux-connect'
import {Add, List} from 'common/todo/components'
import {updateTodoList} from 'common/todo/redux'

const preloadDataActions = [{
  key: 'list', promise: ({store: {dispatch}}) => dispatch(updateTodoList())
}]

class TodoPage extends PureComponent {
  render () {
    return (
      <div>
        <h2>
          <FormattedMessage id="todo.title" />
        </h2>
        <List />
        <Add />
      </div>
    )
  }
}

export default asyncConnect(preloadDataActions)(TodoPage)
