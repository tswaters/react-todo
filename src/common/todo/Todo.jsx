
import React, {PropTypes, PureComponent} from 'react'
import {intlShape} from 'react-intl'
import {fetchState} from 'react-router-server'
import {connect} from 'react-redux'
import {withRouter} from 'react-router'
import {Helmet} from 'react-helmet'

import Add from 'common/todo/components/Add'
import List from 'common/todo/components/List'
import {updateTodoList} from 'common/todo/redux'

@fetchState(
  state => state,
  actions => ({done: actions.done})
)
@connect()
class TodoPage extends PureComponent {

  static contextTypes = {
    intl: intlShape.isRequired
  }

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
    const title = this.context.intl.formatMessage({id: 'todo.title'})
    return (
      <div>
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <h2>{title}</h2>
        <List />
        <Add />
      </div>
    )
  }
}

export default withRouter(TodoPage)
