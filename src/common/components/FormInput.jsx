
import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind'
import * as bootstrap from 'common/styles/bootstrap'

const cx = classNames.bind(bootstrap)

class FormInput extends PureComponent {

  static defaultProps = {
    type: 'text',
    value: ''
  }

  static propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    type: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired
  }

  render () {
    return (
      <div className={cx('form-group')}>
        <label
          className={cx('control-label')}
          htmlFor={this.props.id}
        >
          {this.props.label}
        </label>
        <input
          className={cx('form-control')}
          id={this.props.id}
          type={this.props.type}
          value={this.props.value}
          onChange={this.props.onChange}
        />
      </div>
    )
  }
}

export default FormInput
