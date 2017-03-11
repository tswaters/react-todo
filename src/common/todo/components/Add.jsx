
import React, {PureComponent, PropTypes} from 'react'
import {connect} from 'react-redux'
import classNames from 'classNames/bind'
import * as bootstrap from 'common/styles/bootstrap'
import {createTodo, updateTodo, updateTodoText} from '../actions'

import FormInput from 'common/components/FormInput'

const cx = classNames.bind(bootstrap)

const mapStateToProps = state => ({
  id: state.item ? state.item.id : '',
  text: state.item ? state.item.text : ''
})

const mapDispatchToProps = dispatch => ({
  createTodo: text => dispatch(createTodo(text)),
  updateTodo: text => dispatch(updateTodo(text)),
  onTextChange: text => dispatch(updateTodoText(text))
})

class Add extends PureComponent {

  static propTypes = {
    createTodo: PropTypes.func.isRequired,
    onTextChange: PropTypes.func.isRequired,
    updateTodo: PropTypes.func.isRequired,
    id: PropTypes.string,
    text: PropTypes.string.isRequired
  }

  static defaultProps = {
    id: null
  }

  constructor (props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleTextChange = this.handleTextChange.bind(this)
  }

  handleTextChange (event) {
    this.props.onTextChange(event.target.value)
  }

  handleSubmit (event) {
    event.preventDefault()
    if (this.props.id) {
      this.props.updateTodo({id: this.props.id, text: this.props.text})
    }
    else {
      this.props.createTodo(this.props.text)
    }
  }

  render () {
    return (
      <form onSubmit={this.handleSubmit}>
        <FormInput
          id="todo"
          required
          label={'Todo'}
          onChange={this.handleTextChange}
          value={this.props.text}
        />
        <button type="submit" className={cx('btn', 'btn-default')}>
          {this.props.id ? 'Update Todo' : 'Create Todo'}
        </button>
      </form>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Add)
