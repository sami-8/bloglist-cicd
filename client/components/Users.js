import React from 'react'
import { connect } from 'react-redux'
import { Redirect, withRouter } from 'react-router-dom'

import UserList from './UserList'
import LoadingPage from './LoadingPage'
import User from './User'

let Users = (props) => {
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
    return <UserList />
  }

  const user =
        props.users.find((u) => u.id === id)

  return <User user={user} />
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    users: state.users
  }
}

Users = withRouter(Users)
export default connect(mapStateToProps, null)(Users)
