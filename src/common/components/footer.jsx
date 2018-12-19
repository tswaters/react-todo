
import React, {PureComponent} from 'react'
import {FormattedMessage} from 'react-intl'

import {footer} from 'common/styles/footer'
import {container} from 'common/styles/bootstrap'

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
