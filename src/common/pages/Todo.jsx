
import React, {PropTypes} from 'react'
import {connect} from 'react-redux'

import {Add, List} from 'common/todo/components'
import {container} from 'common/todo/styles'

const mapStateToProps = state => ({
  item: state.item,
  list: state.list
})

const TodoPage = ({item, list}) =>
  <div className={container}>
    <h1>{'Todo Application'}</h1>
    <List list={list} />
    <Add todo={item} />
  </div>

TodoPage.defaultProps = {
  item: {
    id: null,
    text: ''
  }
}

TodoPage.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string,
    text: PropTypes.string
  }),
  list: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
  })).isRequired
}

export default connect(mapStateToProps)(TodoPage)
