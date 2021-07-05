import React from 'react'
import { Segment, Header } from 'semantic-ui-react'

const Component404 = ({ header, text }) => {
    return (
        <Segment>
            <Header as="h2">{ header }</Header>
            <p>
                { text }
            </p>
        </Segment>

    )
}

export default Component404
