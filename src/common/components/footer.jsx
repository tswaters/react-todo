
import React from 'react'

import {footer} from 'common/styles/footer'
import {container} from 'common/styles/bootstrap'

/**
 * @returns {string} Footer of the application
 */
export default function Footer () {
  return (
    <footer className={footer}>
      <div className={container}>
        <p>{'By Tyler'}</p>
      </div>
    </footer>
  )
}
