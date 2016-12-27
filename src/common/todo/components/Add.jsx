
import React, {PureComponent, PropTypes} from 'react'
import {connect} from 'react-redux'
import {createTodo, updateTodo, updateTodoText} from '../actions'

const mapStateToProps = state => ({
  todo: state.item
})

const mapDispatchToProps = dispatch => ({
  onCreateTodo: text => dispatch(createTodo(text)),
  onUpdateTodo: text => dispatch(updateTodo(text)),
  onTextChange: text => dispatch(updateTodoText(text))
})

class Add extends PureComponent {

  static defaultProps = {
    todo: {
      id: null,
      text: ''
    }
  }

  static propTypes = {
    onCreateTodo: PropTypes.func.isRequired,
    onTextChange: PropTypes.func.isRequired,
    onUpdateTodo: PropTypes.func.isRequired,
    todo: PropTypes.shape({
      id: PropTypes.number,
      text: PropTypes.string.isRequired
    })
  }

  constructor (props) {
    super(props)
    this.input = null
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleTextChange = this.handleTextChange.bind(this)
  }

  handleTextChange (event) {
    this.props.onTextChange(event.target.value)
  }

  handleSubmit (event) {
    event.preventDefault()
    if (this.props.todo.id) {
      this.props.onUpdateTodo({id: this.props.todo.id, text: this.input.value})
    }
    else {
      this.props.onCreateTodo(this.input.value)
    }
  }

  render () {
    const label = this.props.todo && this.props.todo.id
      ? 'Update Todo'
      : 'Create Todo'

    return (
      <form onSubmit={this.handleSubmit}>
        <input
          ref={_ref => this.input = _ref}
          required
          type="text"
          onChange={this.handleTextChange}
          value={this.props.todo && this.props.todo.text || ''}
        />
        <button type="submit">{label}</button>
      </form>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Add)
