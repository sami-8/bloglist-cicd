import React from 'react'
import { sortBy } from 'lodash'
import { Table, Segment } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

const BlogList = (props) => {
  if (props.blogs.length === 0) {
    return (
      <Segment>
        <p>No blogs created yet.</p>
      </Segment>
    )
  }

  const blogTableRows = () => {
    const sorted =
      sortBy(props.blogs, (b) => -b.likes)
    return sorted
      .map((blog, i) => (
        <tr key={i}>
          <td>
            <Link to={`/blogs/${blog.id}`}>
              {blog.title}
            </Link>
          </td>
          <td>
            {blog.author}
          </td>
        </tr>
      ))
  }

  return (
    <Table striped celled>
      <tbody>
        <tr>
          <th>Blog name</th>
          <th>Author</th>
        </tr>
        {blogTableRows()}
      </tbody>
    </Table>
  )
}

const mapStateToProps = (state) => {
  return {
    blogs: state.blogs
  }
}

export default connect(mapStateToProps, null)(BlogList)
