import React from 'react'
import { useField } from '../hooks'
import { withRouter } from 'react-router-dom'
import { Form, Button, Icon } from 'semantic-ui-react'
import authService from '../services/auth'

import { connect } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'
import { setUser } from '../reducers/userReducer'

let LoginForm = ({ history, setUser, setNotification }) => {
  const [username, resetUsername] = useField('text')
  const [password, resetPassword] = useField('password')

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const user =
        await authService
          .login(({
            username: username.value,
            password: password.value
          }))
      window.localStorage
        .setItem('loggedUser', JSON.stringify(user))

      resetUsername()
      resetPassword()
      setUser(user)
      history.push('/')

    } catch (except) {
      setNotification('Wrong username or password', 5)
      console.log(except)
    }

  }

  const loginButton = () => {
    return (
      <Button type="submit">
        <div data-cy="signin">
          <Icon name='sign-in alternate' />
          Sign in
        </div>
      </Button>
    )
  }

  return (
    <>
      <Form onSubmit={handleLogin}>
        <Form.Field>
          <label>username</label>
          <input data-cy="username" {...username} />
        </Form.Field>
        <Form.Field>
          <label>password</label>
          <input data-cy="password" {...password} />
        </Form.Field>
        {loginButton()}
      </Form>
    </>
  )
}

LoginForm = withRouter(LoginForm)
export default connect(null, { setNotification, setUser })(LoginForm)
