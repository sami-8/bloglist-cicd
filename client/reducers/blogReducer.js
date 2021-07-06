import blogService from '../services/blogs'

const initialState = []

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'INIT_BLOGS':
      return action.response

    case 'NEW_BLOG':
      return state.concat(action.blog)

    case 'UPDATE_BLOG': {
      const updatedBlog = action.response
      const updatedBlogList =
        state.map((b) => {
          if (b.id === updatedBlog.id) {
            b.likes = updatedBlog.likes
          }
          return b
        })
      return updatedBlogList
    }

    case 'REMOVE_BLOG': {
      return state.filter((b) => b.id !== action.blog.id)
    }

    default:
      return state
  }
}

export const initBlogs = () => {
  return async (dispatch) => {
    const response = await blogService.getAll()

    dispatch({
      type: 'INIT_BLOGS',
      response
    })
  }
}

export const addLike = (blog) => {
  return async (dispatch) => {
    const updatedBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user.id
    }
    const response =
      await blogService.update(blog.id, updatedBlog)

    dispatch({
      type: 'UPDATE_BLOG',
      response
    })
  }
}

export const createNewBlog = (newBlog, currentUser) => {
  return async (dispatch) => {
    const response =
      await blogService.create(newBlog)

    const blog = {
      ...response,
      user: {
        username: currentUser.username,
        name: currentUser.name,
        id: currentUser.id
      }
    }

    dispatch({
      type: 'NEW_BLOG',
      blog
    })
  }
}

export const removeBlog = (blog) => {
  return async (dispatch) => {
    await blogService.remove(blog.id)

    dispatch({
      type: 'REMOVE_BLOG',
      blog
    })
  }
}

export default reducer
