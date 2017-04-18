
import React, {PureComponent} from 'react'
import {FormattedMessage} from 'react-intl'

import initialData from 'common/initial-data'

/**
 * @returns {string} Home page
 */
@initialData({keys: ['welcome.title']})
class Home extends PureComponent {
  render () {
    return (
      <h2>
        <FormattedMessage id="welcome.title" />
      </h2>
    )
  }
}

export default Home
