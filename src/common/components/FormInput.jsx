
import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind'
import * as bootstrap from 'common/styles/bootstrap'

const cx = classNames.bind(bootstrap)

class FormInput extends PureComponent {

  static defaultProps = {
    type: 'text',
    value: '',
    required: false
  }

  static propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    type: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    required: PropTypes.bool
  }

  static contextTypes = {
    validator: PropTypes.object
  }

  constructor (props, context) {
    super(props, context)
    this.handleChange = this.handleChange.bind(this)
    this.setRef = this.setRef.bind(this)
  }

  input = null

  state = {
    error: null,
    validating: false
  }

  componentDidMount () {
    if (this.context.validator) { this.context.validator.register(this) }
  }

  componentDidUpdate (prevProps) {
    if (this.props.value !== prevProps.value && this.context.validator && this.state.validating) {
      this.context.validator.validate()
    }
  }

  componentWillUnmount () {
    if (this.context.validator) { this.context.validator.unregister(this) }
  }

  setRef (ref) {
    this.input = ref
  }

  handleChange (event) {
    this.props.onChange(event)
  }

  render () {
    const {error} = this.state
    return (
      <div className={cx('form-group', error ? 'has-error' : '')}>
        <label
          className={cx('control-label')}
          htmlFor={this.props.id}
        >
          {this.props.label}
        </label>
        <input
          className={cx('form-control')}
          id={this.props.id}
          required={this.props.required}
          type={this.props.type}
          value={this.props.value}
          onChange={this.handleChange}
          ref={this.setRef}
        />
        {error && <span className={cx('help-block')}>
          {error.message}
        </span>}
      </div>
    )
  }
}

export default FormInput
