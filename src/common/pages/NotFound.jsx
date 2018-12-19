
import React, {PureComponent} from 'react'
import {FormattedMessage} from 'react-intl'

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
