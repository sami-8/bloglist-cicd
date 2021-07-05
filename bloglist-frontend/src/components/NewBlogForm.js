import React from 'react'

import Togglable from './Togglable'
import { Form, Button } from 'semantic-ui-react'
import { useField } from '../hooks'
import { connect } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'
import { updateUserInList } from '../reducers/userlistReducer'
import { createNewBlog } from '../reducers/blogReducer'

const NewBlogForm = (props) => {
    const [ title,  resetTitle  ] = useField('text')
    const [ author, resetAuthor ] = useField('text')
    const [ url,    resetUrl    ] = useField('text')

    const toggableRef = React.createRef()

    const submitNewBlog = async (e) => {
        e.preventDefault()

        const newTitle  = title.value.trim()
        const newAuthor = author.value.trim()
        const newUrl    = url.value.trim()

        if (!newTitle || !newAuthor || !newUrl) {
            props.setNotification('Please fill every field', 5)
            return
        }

        try {
            const newBlog = {
                title: newTitle,
                author: newAuthor,
                url: newUrl
            }
            await props.createNewBlog(newBlog, props.user)
            await props.updateUserInList(props.user)

            props.setNotification(`a new blog created: ${newBlog.title}`, 5)
            toggableRef.current.toggleVisibility()
            resetTitle()
            resetAuthor()
            resetUrl()

        } catch (except) {
            console.log(except)
        }
    }

    return (
        <Togglable ref={toggableRef} label="new blog">
            <h3>Add new blog</h3>
            <Form onSubmit={submitNewBlog}>
                <Form.Field>
                    <label>title</label>
                    <input data-cy="blogtitle" {...title} />
                </Form.Field>
                <Form.Field>
                    <label>author</label>
                    <input data-cy="blogauthor" {...author} />
                </Form.Field>
                <Form.Field>
                    <label>url</label>
                    <input data-cy="blogurl" {...url} />
                </Form.Field>
                <Button type='submit'>send</Button>
            </Form>
        </Togglable>
    )
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

const mapDispatchToProps = {
    createNewBlog,
    setNotification,
    updateUserInList,
}

export default connect(mapStateToProps, mapDispatchToProps)(NewBlogForm)
