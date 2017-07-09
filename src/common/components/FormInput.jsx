
import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import {
  formGroup,
  formControl,
  controlLabel,
  hasError,
  helpBlock,
  srOnly
} from 'common/styles/bootstrap'

class FormInput extends PureComponent {

  static defaultProps = {
    type: 'text',
    value: '',
    label: '',
    placeholder: '',
    required: false
  }

  static propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.string,
    placeholder: PropTypes.string,
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

  getLabel () {
    const classes = [controlLabel]
    const label = this.props.label || this.props.placeholder

    if (this.props.placeholder) {
      classes.push(srOnly)
    }

    return (
      <label className={cx(classes)} htmlFor={this.props.id}>
        {label}
      </label>
    )
  }

  render () {
    const {error} = this.state
    return (
      <div className={cx(formGroup, error ? hasError : '')}>
        {this.getLabel()}
        <input
          className={cx(formControl)}
          placeholder={this.props.placeholder}
          id={this.props.id}
          required={this.props.required}
          type={this.props.type}
          value={this.props.value}
          onChange={this.handleChange}
          ref={this.setRef}
        />
        {error && <span className={cx(helpBlock)}>
          {error.message}
        </span>}
      </div>
    )
  }
}

export default FormInput
