
import React, {PureComponent} from 'react'
import {FormattedMessage} from 'react-intl'

import initialData from 'common/initial-data'

/**
 * @returns {string} Not found page
 */

@initialData({keys: ['404']})
class NotFound extends PureComponent {
  render () {
    return (
      <h2>
        <FormattedMessage id="404" />
      </h2>
    )
  }
}

export default NotFound
