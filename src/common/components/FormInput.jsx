
import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import {fa} from 'common/styles/font-awesome'
import {
  inputGroup,
  inputGroupAddon,
  inputGroupBtn,
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
    required: false,
    icon: null,
    className: cx(formGroup),
    inputClassName: cx(formControl),
    onBlur: () => {},
    buttons: [],
    validate: 'submit',
    sameAs: null
  }

  static propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.string,
    placeholder: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func,
    required: PropTypes.bool,
    icon: PropTypes.string,
    className: PropTypes.string,
    inputClassName: PropTypes.string,
    buttons: PropTypes.arrayOf(PropTypes.node),
    validate: PropTypes.oneOf(['blur', 'change', 'submit']).isRequired,
    sameAs: PropTypes.string
  }

  static contextTypes = {
    validator: PropTypes.object
  }

  constructor (props, context) {
    super(props, context)
    this.handleChange = this.handleChange.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
    this.setRef = this.setRef.bind(this)
  }

  state = {
    error: null,
    validating: false
  }

  componentDidMount () {
    if (this.context.validator) { this.context.validator.register(this) }
  }

  componentDidUpdate (prevProps) {
    if (this.props.value !== prevProps.value && this.context.validator && this.state.validating) {
      if (this.props.sameAs) {
        this.context.validator.validate()
      } else {
        this.context.validator.validateField(this)
      }
    }
  }

  componentWillUnmount () {
    if (this.context.validator) { this.context.validator.unregister(this) }
  }

  input = null

  setRef (ref) {
    this.input = ref
  }

  handleChange (event) {
    this.props.onChange(event)
    if (this.props.validate === 'change' && this.context.validator) {
      this.context.validator.validateField(this)
    }
  }

  handleBlur (event) {
    this.props.onBlur(event)
    if (this.props.validate === 'blur' && this.context.validator) {
      this.context.validator.validateField(this)
    }
  }

  getInput () {
    const input = (
      <input
        className={cx(this.props.inputClassName)}
        placeholder={this.props.placeholder}
        id={this.props.id}
        required={this.props.required}
        type={this.props.type}
        value={this.props.value}
        onChange={this.handleChange}
        onBlur={this.handleBlur}
        ref={this.setRef}
      />
    )

    if (!(this.props.icon || this.props.buttons.length > 0)) {
      return input
    }

    return (
      <div className={inputGroup}>
        {this.props.icon && (
          <label htmlFor={this.props.id} className={inputGroupAddon}>
            <span className={cx(fa, this.props.icon)} />
          </label>
        )}
        {input}
        {this.props.buttons.length > 0 && (
          React.Children.map(this.props.buttons, button => (
            <span className={cx(inputGroupBtn)}>
              {button}
            </span>
          ))
        )}
      </div>
    )
  }

  getLabel () {
    if (this.props.icon) {
      return null
    }

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
      <div className={cx(this.props.className, error ? hasError : '')}>
        {this.getLabel()}
        {this.getInput()}
        {error && <span className={cx(helpBlock)}>
          {error.message}
        </span>}
      </div>
    )
  }
}

export default FormInput
