
import React, {PropTypes, PureComponent} from 'react'
import {intlShape} from 'react-intl'
import {connect} from 'react-redux'
import {Helmet} from 'react-helmet'

import initialData from 'common/initial-data'
import Add from 'common/todo/components/Add'
import List from 'common/todo/components/List'
import {updateTodoList} from 'common/todo/redux'

@initialData({
  keys: [
    'todo.title'
  ],
  promises: [
    dispatch => ({staticContext, history, location}) =>
      dispatch(updateTodoList())
        .catch(err => {
          staticContext.status = err.status
          staticContext.error = err
          staticContext.url = `/auth/login?from=${location.pathname}`
          history.replace(staticContext.url)
          throw err
        })
  ]
})
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

export default TodoPage
