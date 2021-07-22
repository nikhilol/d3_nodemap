import React, { useState } from 'react'
import { Button, Dialog, DialogActions, TextField } from '@material-ui/core'

export default function AddNewPlanPopup(props) {
    return (
        <Dialog open={props.open} fullWidth maxWidth="md">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin:'10vh' }}>
                <h3>Create a new custom plan by giving it a title:</h3>
                <TextField variant='outlined' fullWidth placeholder={'New plan Title'}></TextField>
                <h3 style={{marginTop:'5vh'}}>Or import a plan that you've found by pasting the plan link:</h3>
                <TextField variant='outlined' fullWidth placeholder={'Plan URL'}></TextField>
            </div>
            <DialogActions>
                <Button onClick={()=>props.close()}>Cancel</Button>
                <Button>Save</Button>
            </DialogActions>
        </Dialog>
    )
}
