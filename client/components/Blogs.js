import React from 'react'

import { connect } from 'react-redux'
import { withRouter, Redirect } from 'react-router-dom'

import Blog from './Blog'
import BlogList from './BlogList'
import NewBlogForm from './NewBlogForm'
import LoadingPage from './LoadingPage'

const renderBlogList = () => (
  <>
    <NewBlogForm />
    <BlogList />
  </>
)

let Blogs = (props) => {
  const appStateReady = props.initialized
  const userLoggedIn  = props.user !== null
  const id = props.match.params.id

  if (!appStateReady) {
    return <LoadingPage />
  }

  if (!userLoggedIn) {
    return <Redirect to="/login" />
  }

  if (!id) {
    return renderBlogList()
  }

  const blog =
    props.blogs.find((b) => b.id === id)

  return <Blog blog={blog} />
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    blogs: state.blogs
  }
}

Blogs = withRouter(Blogs)
export default connect(mapStateToProps, null)(Blogs)
