
import React, {PureComponent, PropTypes} from 'react'
import {connect} from 'react-redux'
import {FormattedMessage} from 'react-intl'

import {editTodo} from 'common/todo/redux'
import Item from './Item'

const mapStateToProps = state => ({
  list: state.todo.list
})

const mapDispatchToProps = {
  onTodoClick: editTodo
}

class List extends PureComponent {

  static propTypes = {
    list: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired
    })).isRequired
  }

  render () {
    if (this.props.list.length === 0) {
      return (
        <p>
          <FormattedMessage id="todo.no-items" />
        </p>
      )
    }

    return (
      <ol>
        {this.props.list.map(todo =>
          <Item
            key={todo.id}
            todo={todo}
          />
        )}
      </ol>
    )
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(List)
