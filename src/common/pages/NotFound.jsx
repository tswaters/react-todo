
import React from 'react'
import {FormattedMessage} from 'react-intl'

/**
 * @returns {string} Not found page
 */
export default function NotFound () {
  return (
    <h2>
      <FormattedMessage id="404" />
    </h2>
  )
}
