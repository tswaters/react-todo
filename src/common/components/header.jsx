
import React from 'react'

import * as bootstrap from 'common/styles/bootstrap'

/**
 * @returns {HTML} header of the application
 */
export default function Header () {
  return (
    <header className={bootstrap['page-header']}>
      <h1>{'Todo Application'}</h1>
    </header>
  )
}
