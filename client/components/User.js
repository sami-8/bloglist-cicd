import React from 'react'
import { Image, Grid, Icon, Card, Table } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import Placeholder from './placeholder.png'
import Component404 from './Component404'

const User = ({ user }) => {
  if (!user) {
    return (
      <Component404
        header={'User not found'}
        text={'No user exists with the specified id.'}
      />
    )
  }

  const userCard = () => {
    return (
      <Card>
        <Image src={Placeholder} wrapped ui={false} />
        <Card.Content>
          <Card.Header>{user.name}</Card.Header>
          <Card.Meta>
            <span className='date'>Joined in 2015</span>
          </Card.Meta>
          <Card.Description>
            user description
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
          <Icon name='blogger' />
          total {user.blogs.length} blog(s)
        </Card.Content>
      </Card>
    )
  }

  const blogTableRows = () =>
    user.blogs.map((blog, i) => {
      return (
        <tr key={i}>
          <td>
            <Link to={`/blogs/${blog.id}`}>
              {blog.title}
            </Link>
          </td>
        </tr>
      )
    })


  return (
    <Grid columns={2}>
      <Grid.Row stretched verticalAlign="top">
        <Grid.Column stretched>
          {userCard()}
        </Grid.Column>
        <Grid.Column stretched>
          <Table striped celled>
            <thead className="full-width">
              <tr>
                <th>Blogs by {user.name}</th>
              </tr>
            </thead>
            <tbody>
              {blogTableRows()}
            </tbody>
          </Table>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}

export default User
