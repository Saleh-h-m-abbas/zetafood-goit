import React from 'react'
import "./pop.scss";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from "react";
import DialogTitle from '@mui/material/DialogTitle';


export const PopupMessage = () => {

    const [open, setOpen] = useState(false);

    const handleClose = () => {
        setOpen(false)
    }
    const handleOpen = () => {
        setOpen(true)
    }

    return (
        <>
            <div
                className="deleteButton"
                onClick={() => handleOpen()}
            >
                Update
            </div>

            <body>
                <Dialog
                    className='dialogbody'
                    open={open}
                    onClose={handleClose}
                >
                     <DialogTitle>Update Tap</DialogTitle>
                    <DialogContent className="pop" >
                        <DialogContentText >

                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="SMS Title"
                                fullWidth
                                variant="standard"
                            />
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="SMS Message"
                                fullWidth
                                variant="standard"
                            />

                        </DialogContentText>
                    </DialogContent>
                    <DialogActions className="popfooter">
                        
                        <Button
                         onClick={handleClose}
                         variant="outlined" color="error"
                         >Close</Button>
                         
                        <Button 
                        onClick={handleClose}
                        variant="contained" color="success"
                        autoFocus
                         >Submit</Button>

                    </DialogActions>
                </Dialog>
            </body>
        </>
    )
}
