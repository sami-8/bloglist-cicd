import React, { useState, useImperativeHandle } from 'react'
import { Confirm } from 'semantic-ui-react'

const SemanticConfirm = React.forwardRef((props, ref) => {
  const [open,   setOpen  ] = useState(false)
  const [result, setResult] = useState(false)

  useImperativeHandle(ref, () => {
    return {
      result,
      setOpen
    }
  })

  const onCancel = () => {
    setOpen(false)
    setResult(false)
  }

  const onConfirm = () => {
    setOpen(false)
    setResult(true)
    props.actionOnConfirm()
  }

  return (
    <>
      <Confirm
        open={open}
        onCancel={onCancel}
        onConfirm={onConfirm}
      />
    </>
  )
})

SemanticConfirm.displayName = 'SemanticConfirm'
export default SemanticConfirm
