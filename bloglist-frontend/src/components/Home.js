import React from 'react'
import { connect } from 'react-redux'
import { Header } from 'semantic-ui-react'

const LoggedInComponent = (props) => {
    return (
        <>
            <Header as="h1">BlogList App</Header>
            <p>Welcome {props.user.name}</p>
        </>
    )
}

const LoggedOutComponent = () => {
    return (
        <>
            <Header as="h1">BlogList App</Header>
        </>
    )
}

const Home = (props) => {
    return (
        <>
            {props.user ?
                <LoggedInComponent user={props.user} />
                :
                <LoggedOutComponent />
            }
        </>
    )
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps, null)(Home)

