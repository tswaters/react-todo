
import React, {PureComponent} from 'react'
import {FormattedMessage} from 'react-intl'

import initialData from 'common/initial-data'

import {footer} from 'common/styles/footer'
import {container} from 'common/styles/bootstrap'

/**
 * @returns {string} Footer of the application
 */

@initialData({keys: ['footer-name']})
class Footer extends PureComponent {
  render () {
    return (
      <footer className={footer}>
        <div className={container}>
          <p>
            <FormattedMessage id="footer-name" />
          </p>
        </div>
      </footer>
    )
  }
}

export default Footer
