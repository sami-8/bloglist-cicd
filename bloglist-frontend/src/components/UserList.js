import React from 'react'
import { Table, Segment, Header } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

const UserList = (props) => {
    if (props.users.length === 0) {
        return (
            <Segment>
                <p>There are no users at the moment.</p>
            </Segment>
        )
    }

    const userTableRows = () => {
        return props.users.map((user, i) => {
            return (
                <tr key={i}>
                    <td>
                        <Link to={`users/${user.id}`}>{ user.username }</Link>
                    </td>
                    <td>{ user.name }</td>
                    <td>{ user.blogs.length }</td>
                </tr>
            )
        })
    }

    return (
        <>
            <Table striped celled>
                <thead className="full-width">
                    <tr>
                        <th>
                            <Header as="h2">Users</Header>
                        </th>
                    </tr>
                </thead>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Real name</th>
                        <th>Blogs added</th>
                    </tr>
                </thead>
                <tbody>
                    { userTableRows() }
                </tbody>
            </Table>
        </>
    )
}

const mapStateToProps = (state) => {
    return {
        users: state.users
    }
}

export default connect(mapStateToProps, null)(UserList)
