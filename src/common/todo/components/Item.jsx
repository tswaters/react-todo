
import React, {PureComponent, PropTypes} from 'react'
import {connect} from 'react-redux'
import {FormattedMessage} from 'react-intl'
import classNames from 'classnames/bind'
import * as bootstrap from 'common/styles/bootstrap'

import {editTodo, removeTodo} from 'common/todo/redux'

const cx = classNames.bind(bootstrap)

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
        <button className={cx('btn', 'btn-default')} onClick={this.props.handleEditTodo}>
          <FormattedMessage id="todo.edit" />
        </button>
        <button className={cx('btn', 'btn-danger')} onClick={this.props.handleRemoveTodo}>
          <FormattedMessage id="todo.delete" />
        </button>
      </li>
    )
  }

}

export default connect(null, mapDispatchToProps)(Item)
