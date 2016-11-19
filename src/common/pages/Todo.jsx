
import React, {PropTypes} from 'react'
import {connect} from 'react-redux'

import {components, styles} from '../todo'

const {container} = styles
const {Add, List} = components

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

TodoPage.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number,
    text: PropTypes.string.isRequired
  }),
  list: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    text: PropTypes.text
  })).isRequired
}

export default connect(mapStateToProps)(TodoPage)
