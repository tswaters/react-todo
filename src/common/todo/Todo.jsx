
import React, {PureComponent} from 'react'
import {intlShape} from 'react-intl'
import {connect} from 'react-redux'
import {Helmet} from 'react-helmet'
import cx from 'classnames'
import {pageHeader} from 'common/styles/bootstrap'

import Form from 'common/components/Form'
import List from 'common/todo/components/List'

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
