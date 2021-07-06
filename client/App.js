import React, { useEffect, useState } from 'react'
import { Route, Redirect, withRouter, Switch } from 'react-router-dom'
import { Segment, Message, Container } from 'semantic-ui-react'

import { connect } from 'react-redux'
import { initBlogs } from './reducers/blogReducer'
import { initUsers } from './reducers/userlistReducer'
import { setUser } from './reducers/userReducer'

import Blogs from './components/Blogs'
import Home from './components/Home'
import Nav from './components/Nav'
import LoginForm from './components/LoginForm'
import Users from './components/Users'

let App = ({ user, setUser, initBlogs, initUsers, notification }) => {
  const [appStateInitialized, setInitialized] = useState(false)

  useEffect(() => {
    const initState = async () => {
      try {
        await initBlogs()
        await initUsers()

        const loggedUserJSON =
          window.localStorage.getItem('loggedUser')

        if (loggedUserJSON) {
          const loggedUser = JSON.parse(loggedUserJSON)
          await setUser(loggedUser)
        }
        setInitialized(true)

      } catch (except) {
        console.log(except)
      }
    }
    initState()
  }, [initBlogs, setUser, initUsers])

  return (
    <Container>
      <Nav />
      {notification &&
        <Segment>
          <Message size="tiny">{ notification }</Message>
        </Segment>
      }
      <Segment>
        <Switch>
          <Route
            exact path="/"
            render={() => <Home />}
          />
          <Route
            path={['/blogs/:id', '/blogs']}
            render={() => <Blogs initialized={appStateInitialized} />}
          />
          <Route
            path={['/users/:id', '/users']}
            render={() => <Users initialized={appStateInitialized} />}
          />
          <Route
            exact path="/login"
            render={() => (
              user ? <Redirect to="/" /> : <LoginForm />
            )}
          />
        </Switch>
      </Segment>
    </Container>
  )
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    notification: state.notification,
  }
}

const mapDispatchToProps = {
  initBlogs,
  setUser,
  initUsers
}

App = withRouter(App)
export default connect(mapStateToProps, mapDispatchToProps)(App)
