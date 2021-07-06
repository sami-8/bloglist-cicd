const initialState = ''

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'NEW_MESSAGE':
      return action.data.message
    case 'RESET':
      return initialState
    default:
      return state
  }
}

export const setNotification = (message, seconds) => {
  return async (dispatch) => {
    setTimeout(() => {
      dispatch({
        type: 'RESET'
      })
    }, seconds * 1000)

    dispatch({
      type: 'NEW_MESSAGE',
      data: {
        message
      }
    })
  }
}

export const resetNotification = () => {
  return {
    type: 'RESET'
  }
}

export default reducer
