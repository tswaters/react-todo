
import React, {PureComponent} from 'react'
import {intlShape} from 'react-intl'
import {connect} from 'react-redux'
import {Helmet} from 'react-helmet'
import cx from 'classnames'
import {pageHeader} from 'common/styles/bootstrap'

import initialData from 'common/initial-data'
import Form from 'common/components/Form'
import List from 'common/todo/components/List'
import {fetchTodos} from 'common/todo/redux'

@initialData({
  keys: [
    'todo.title'
  ],
  promises: [
    dispatch => ({staticContext, history, location}) =>
      dispatch(fetchTodos())
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

  render () {
    const title = this.context.intl.formatMessage({id: 'todo.title'})
    return (
      <div>
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <div className={cx(pageHeader)}>
          <h2>{title}</h2>
        </div>
        <Form>
          <List />
        </Form>
      </div>
    )
  }
}

export default TodoPage
