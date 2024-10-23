import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import React from 'react'

const Dialogs = ({ fullScreen, handleClose, errorMessage}) => {
  return (
    <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
       <DialogTitle
      id="responsive-dialog-title"
      style={{ textAlign: 'center' }}
    >
      Fill the information below
    </DialogTitle>
        <DialogTitle>
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
     </DialogTitle>
    <DialogContent>

    </DialogContent>
 </Dialog>
  )
}

export default Dialogs