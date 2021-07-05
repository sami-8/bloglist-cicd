import React, { useState, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'semantic-ui-react'

const Togglable = React.forwardRef(({ children, label }, ref) => {
    Togglable.propTypes = {
        label: PropTypes.string.isRequired
    }

    const [ visible, setVisible ] = useState(false)

    const hideWhenVisible = { display: visible ? 'none' : '' }
    const showWhenVisible = { display: visible ? '' : 'none' }

    const toggleVisibility = () => {
        setVisible(!visible)
    }

    useImperativeHandle(ref, () => {
        return {
            toggleVisibility
        }
    })

    return (
        <div>
            <div style={hideWhenVisible}>
                <Button onClick={toggleVisibility}>{label}</Button>
            </div>
            <div className="togglableContent" style={showWhenVisible}>
                {children}
                <Button onClick={toggleVisibility}>cancel</Button>
            </div>
        </div>
    )
})

Togglable.displayName = 'Togglable'
export default Togglable
