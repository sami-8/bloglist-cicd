import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { logout } from '../reducers/userReducer'
import { withRouter } from 'react-router-dom'
import { Popup, Icon, Menu, Button } from 'semantic-ui-react'

let Nav = ({ history, user, logout }) => {
  const handleLogout = (e) => {
    e.preventDefault()
    logout()
    history.push('/login')
  }

  const logOutButton = () => {
    return (
      <Popup
        trigger={
          <Button icon color="black">
            <Icon
              name='sign-out'
              onClick={handleLogout}
            />
          </Button>
        }
        content="sign out"
        size="mini"
      />
    )
  }

  return (
    <Menu inverted>
      <Link to="/">
        <Menu.Item link>
          <Icon name="home" />
          Home
        </Menu.Item>
      </Link>
      <Link to="/blogs">
        <Menu.Item link>
          <Icon name="blogger" />
          Blogs
        </Menu.Item>
      </Link>
      <Link to="/users">
        <Menu.Item link>
          <Icon name="users" />
          Users
        </Menu.Item>
      </Link>
      <Menu.Menu position="right">
        {user &&
          <Menu.Item>
            <em>{user.name} logged in </em>
            {logOutButton()}
          </Menu.Item>
        }
        {!user &&
          <Link to="/login">
            <Menu.Item link>
              Sign in
            </Menu.Item>
          </Link>
        }
        {!user &&
          <Link to="/register">
            <Menu.Item link>
              Sign up
            </Menu.Item>
          </Link>
        }
      </Menu.Menu>
    </Menu>
  )
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  }
}

const mapDispatchToProps = {
  logout
}

Nav = withRouter(Nav)
export default connect(mapStateToProps, mapDispatchToProps)(Nav)
