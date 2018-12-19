
import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {FormattedMessage} from 'react-intl'

import {getRequestStats} from 'common/redux/api'

@connect(state => getRequestStats(state))
class ErrorPage extends PureComponent {

  static defaultProps = {
    requestError: null
  }

  static propTypes = {
    requestError: PropTypes.object
  }

  render () {
    const err = this.props.requestError
      ? (
        <pre>
          {this.props.requestError.message}
          {this.props.requestError.stack}
        </pre>
      ) : null
    return (
      <h2>
        <FormattedMessage id="500" />
        {err}
      </h2>
    )
  }
}

export default ErrorPage
