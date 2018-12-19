
import React, {PureComponent} from 'react'
import {FormattedMessage} from 'react-intl'

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
