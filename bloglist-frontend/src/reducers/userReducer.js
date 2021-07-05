import blogService from '../services/blogs'

const initialState = null

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_USER':
            return action.data
        case 'LOG_OUT':
            return initialState
        default:
            return state
    }
}

export const setUser = (user) => {
    return async (dispatch) => {
        blogService.setToken(user.token)

        dispatch({
            type: 'SET_USER',
            data: user
        })
    }
}

export const logout = () => {
    return async (dispatch) => {
        blogService.setToken(null)
        window.localStorage.removeItem('loggedUser')

        dispatch({
            type: 'LOG_OUT'
        })
    }
}

export default reducer
