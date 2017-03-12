
import React from 'react'

import {FormattedMessage} from 'react-intl'
import * as bootstrap from 'common/styles/bootstrap'

/**
 * @returns {HTML} header of the application
 */
export default function Header () {
  return (
    <header className={bootstrap['page-header']}>
      <h1>
        <FormattedMessage id="application-name" />
      </h1>
    </header>
  )
}
