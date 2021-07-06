import React from 'react'
import { Segment, Dimmer, Loader, Image } from 'semantic-ui-react'

const LoadingPage = () => {
  return (
    <div data-cy="loading">
      <Segment>
        <Dimmer active>
          <Loader indeterminate>Fetching user and blog data</Loader>
        </Dimmer>
        <Image
          src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png' />
      </Segment>
    </div>
  )
}

export default LoadingPage
