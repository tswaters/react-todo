
import React, {PureComponent, PropTypes} from 'react'
import {connect} from 'react-redux'

import {editTodo, removeTodo} from '../actions'

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleEditTodo: () => dispatch(editTodo(ownProps.todo)),
  handleRemoveTodo: () => dispatch(removeTodo(ownProps.todo.id))
})

class Item extends PureComponent {

  static propTypes = {
    handleEditTodo: PropTypes.func.isRequired,
    handleRemoveTodo: PropTypes.func.isRequired,
    todo: PropTypes.shape({
      text: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired
    }).isRequired
  }

  render () {
    return (
      <li>
        {this.props.todo.text}
        <button onClick={this.props.handleEditTodo}>{'Edit'}</button>
        <button onClick={this.props.handleRemoveTodo}>{'Delete'}</button>
      </li>
    )
  }

}

export default connect(null, mapDispatchToProps)(Item)
