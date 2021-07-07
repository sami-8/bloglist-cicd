import React from 'react'
import { useField } from '../hooks'
import { withRouter } from 'react-router-dom'
import { Form, Button, Icon } from 'semantic-ui-react'
import authService from '../services/auth'

import { connect } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'

let RegisterForm = ({ history, setNotification }) => {
  const [username, resetUsername] = useField('text')
  const [name,     resetName    ] = useField('text')
  const [password, resetPassword] = useField('password')

  const handleRegister = async (e) => {
    e.preventDefault()

    const newUsername = username.value.trim()
    const newName = name.value.trim()
    const newPassword = password.value.trim()

    if (!newUsername || !newName || !newPassword) {
      setNotification('Please fill every field.', 5)
      return
    }

    try {
      await authService.register({
        username: newUsername,
        name: newName,
        password: newPassword,
      })

      resetUsername()
      resetName()
      resetPassword()
      setNotification('Registration successful. You can now log in.', 5)
      history.push('/login')
    } catch (error) {
      setNotification(error.response.data.error, 5)
    }
  }

  const registerButton = () => {
    return (
      <Button type="submit">
        <div data-cy="signup">
          <Icon name='pencil alternate' />
          Sign up
        </div>
      </Button>
    )
  }

  return (
    <>
      <Form onSubmit={handleRegister}>
        <Form.Field>
          <label>username</label>
          <input data-cy="username" {...username} />
        </Form.Field>
        <Form.Field>
          <label>name</label>
          <input data-cy="name" {...name} />
        </Form.Field>
        <Form.Field>
          <label>password</label>
          <input data-cy="password" {...password} />
        </Form.Field>
        {registerButton()}
      </Form>
    </>
  )
}

RegisterForm = withRouter(RegisterForm)
export default connect(null, { setNotification })(RegisterForm)

