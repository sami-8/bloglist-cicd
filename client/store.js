import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import notificationReducer from './reducers/notificationReducer'
import blogReducer from './reducers/blogReducer'
import userReducer from './reducers/userReducer'
import userlistReducer from './reducers/userlistReducer'

import { composeWithDevTools } from 'redux-devtools-extension'

const reducer = combineReducers({
  users: userlistReducer,
  notification: notificationReducer,
  blogs: blogReducer,
  user: userReducer,
})

const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(thunk))
)

export default store
