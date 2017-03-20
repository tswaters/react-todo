
import React, {PropTypes, PureComponent} from 'react'
import {FormattedMessage} from 'react-intl'
import {fetchState} from 'react-router-server'
import {connect} from 'react-redux'

import Add from 'common/todo/components/Add'
import List from 'common/todo/components/List'
import {updateTodoList} from 'common/todo/redux'

export default
@fetchState(
  state => state,
  actions => ({done: actions.done})
)
@connect()
class TodoPage extends PureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    done: PropTypes.func.isRequired
  }

  componentWillMount () {
    this.props.dispatch(updateTodoList())
      .then(() => this.props.done({}))
  }

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
