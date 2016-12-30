
import React, {PropTypes, PureComponent} from 'react'

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
      <div className="form-group">
        <label
          className="control-label"
          htmlFor={this.props.id}
        >
          {this.props.label}
        </label>
        <input
          className="form-control"
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
