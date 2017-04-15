
import React from 'react'
import {FormattedMessage} from 'react-intl'

/**
 * @returns {string} Home page
 */
export default function Home () {
  return (
    <h2>
      <FormattedMessage id="welcome.title" />
    </h2>
  )
}
