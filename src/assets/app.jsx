
import React, {PureComponent, PropTypes} from 'react'

import {container} from './app.css'

export default class App extends PureComponent {

  static propTypes = {
    name: PropTypes.string
  }

  render () {
    return (
      <div className={container}>
        {`Hello ${this.props.name || 'World'}!`}
      </div>
    )
  }

}
