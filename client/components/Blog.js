import React from 'react'
import Component404 from './Component404'
import { default as Confirm } from './SemanticConfirm'
import { withRouter } from 'react-router-dom'
import { List, Header, Button } from 'semantic-ui-react'

import { connect } from 'react-redux'
import { addLike, removeBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'
import { removeBlogFromUser } from '../reducers/userlistReducer'

let Blog = ({ blog, removeBlogFromUser, setNotification, addLike, removeBlog, user, history }) => {
  if (!blog) {
    return (
      <Component404
        header={'Blog not found'}
        text={'no blog exists with the specified id'}
      />
    )
  }

  const confirmRef = React.createRef()

  const deleteBlog = async () => {
    try {
      await removeBlog(blog)
      removeBlogFromUser(blog.id, blog.user.id)
      setNotification(`removed blog: '${blog.title}'`, 5)
      history.push('/blogs')
    } catch (except) {
      console.log(except)
    }
  }

  const blogInfo = () => {
    return (
      <>
        <List>
          <List.Item>
            <List.Header as="h3">Blog</List.Header>
            { blog.title }
          </List.Item>
          <List.Item>
            <List.Header as="h3">Blog Author</List.Header>
            { blog.author }
          </List.Item>
          <List.Item>
            <List.Header as="h3">Visit blog</List.Header>
            <a href={blog.url}>click to visit</a>
          </List.Item>
        </List>
        <Button
          content='Like'
          icon='heart'
          label={{ as: 'a', basic: true, pointing: 'right', content: `${blog.likes}` }}
          labelPosition='right'
          onClick={async () => addLike(blog)}
        />
      </>
    )
  }

  const userInfo = () => {
    return (
      user.username === blog.user.username ?
        <>
          <Header as="h3">{'added by you'}</Header><br />
          <Button onClick={() => confirmRef.current.setOpen(true)}>Remove</Button>
        </>
        :
        <Header as="h3">{`added by ${blog.user.name}`}</Header>
    )
  }

  return (
    <>
      <Confirm ref={confirmRef} actionOnConfirm={deleteBlog} />
      {blogInfo()}
      {userInfo()}
    </>
  )
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  }
}

const mapDispatchToProps = {
  removeBlog,
  setNotification,
  addLike,
  removeBlogFromUser
}

Blog = withRouter(Blog)
export default connect(mapStateToProps, mapDispatchToProps)(Blog)
