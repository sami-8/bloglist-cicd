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
      <Menu.Item link>
        <Link to="/">
          <Icon name="home" />
            home
        </Link>
      </Menu.Item>
      <Menu.Item link>
        <Link to="/blogs">
          <Icon name="blogger" />
          blogs
        </Link>
      </Menu.Item>
      <Menu.Item link>
        <Link to="/users">
          <Icon name="users" />
          users
        </Link>
      </Menu.Item>
      <Menu.Item position="right">
        {user
          ? <div>
            <em>{user.name} logged in </em>
            {logOutButton()}
          </div>
          : <Link to="/login">login</Link>
        }
      </Menu.Item>
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
