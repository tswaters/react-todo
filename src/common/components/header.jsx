
import React, {PureComponent} from 'react'

import {FormattedMessage} from 'react-intl'
import * as bootstrap from 'common/styles/bootstrap'
import initialData from 'common/initial-data'

@initialData({keys: ['application-name']})
class Header extends PureComponent {
  render () {
    return (
      <header className={bootstrap['page-header']}>
        <h1>
          <FormattedMessage id="application-name" />
        </h1>
      </header>
    )
  }
}

export default Header
