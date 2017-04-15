
import React, {PropTypes, PureComponent} from 'react'
import {FormattedMessage} from 'react-intl'
import {fetchState} from 'react-router-server'
import {connect} from 'react-redux'
import {withRouter} from 'react-router'

import Add from 'common/todo/components/Add'
import List from 'common/todo/components/List'
import {updateTodoList} from 'common/todo/redux'

@fetchState(
  state => state,
  actions => ({done: actions.done})
)
@connect()
class TodoPage extends PureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    done: PropTypes.func.isRequired,
    staticContext: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  }

  componentWillMount () {
    this.props.dispatch(updateTodoList())
      .catch(err => {
        this.props.staticContext.status = err.status
        this.props.staticContext.error = err
        this.props.history.replace(`/auth/login?from=${this.props.location.pathname}`)
      })
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

export default withRouter(TodoPage)
