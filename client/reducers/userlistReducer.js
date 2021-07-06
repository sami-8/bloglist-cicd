import userService from '../services/users'

const initialState = []

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'INIT_USERS':
      return action.data

    case 'UPDATE_USER': {
      const updatedList =
        state.map((u) => {
          if (u.id === action.user.id) {
            return action.user
          }
          return u
        })
      return updatedList
    }

    case 'ADD_BLOG_FOR_USER': {
      return state.map((u) => {
        if (u.id === action.userid) {
          return {
            ...u,
            blogs: u.blogs.concat(action.blog)
          }
        } else {
          return u
        }
      })
    }

    case 'REMOVE_BLOG_FROM_USER': {
      return state.map((u) => {
        if (u.id === action.userid) {
          return {
            ...u,
            blogs: u.blogs.filter((b) => {
              return b.id !== action.blogid
            })
          }
        } else {
          return u
        }
      })
    }

    default:
      return state
  }
}

export const initUsers = () => {
  return async (dispatch) => {
    const response = await userService.getAll()

    dispatch({
      type: 'INIT_USERS',
      data: response
    })
  }
}

export const addBlogForUser = (blog, userid) => {
  return {
    type: 'ADD_BLOG_FOR_USER',
    blog,
    userid
  }
}

export const removeBlogFromUser = (blogid, userid) => {
  return {
    type: 'REMOVE_BLOG_FROM_USER',
    blogid,
    userid,
  }
}

export const updateUserInList = (user) => {
  return async (dispatch) => {
    const response =
      await userService.getUser(user.id)

    dispatch({
      type: 'UPDATE_USER',
      user: response,
    })
  }
}

export default reducer
