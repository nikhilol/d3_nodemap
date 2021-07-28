import React, { useState } from 'react'
import { Button, Dialog, DialogActions, TextField } from '@material-ui/core'
import RESOURCES from './Resources/resources'

const axios = require('axios')
const firebase = require('firebase').default

export default function AddNewPlanPopup(props) {

    const [addValue, setAddvalue] = useState("")
    const [importValue, setImportvalue] = useState("")

    async function Add() {
        let res = await axios.post(`${RESOURCES.apiURL}/plans?user=${firebase.auth().currentUser.displayName}&title=${addValue}`)
        if(res.status === 200){
            window.location.assign(`/plan/${firebase.auth().currentUser.displayName}/${addValue}`)
        } else alert('There was a problem adding this plan!')
    }

    async function Import() {
        let split = importValue.split('/')
        let plan = split[split.length - 1];
        let creator = split[split.length - 2];
        let res = await axios.post(`${RESOURCES.apiURL}/plans?user=${firebase.auth().currentUser.displayName}&creator=${creator}&title=${plan}`)
        if(res.status === 200){
            window.location.assign(`/plan/${firebase.auth().currentUser.displayName}/${plan}`)
        } else alert('There was a problem adding this plan!')
    }

    return (
        <Dialog open={props.open} fullWidth maxWidth="md">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '10vh' }}>
                <h3>Create a new custom plan by giving it a title:</h3>
                <div style={{ display: 'flex', width: '100%' }}>
                    <TextField size='small' variant='outlined' fullWidth placeholder={'New plan Title'} onChange={(e)=>{setAddvalue(e.target.value)}}></TextField>
                    <Button id='addText' onClick={Add} style={{ marginLeft: '-1vh', background: '#6930C3', color: 'white', width: '5vw' }}>Add</Button>
                </div>
                <h3 style={{ marginTop: '10vh' }}>Or import a plan that you've found by pasting the plan link:</h3>
                <div style={{ display: 'flex', width: '100%' }}>
                    <TextField size='small' variant='outlined' fullWidth placeholder={'Plan URL'} onChange={(e)=>{setImportvalue(e.target.value)}}></TextField>
                    <Button id='importText' onClick={Import} style={{ marginLeft: '-1vh', background: '#6930C3', color: 'white', width: '5vw' }}>Import</Button>
                </div>
            </div>
            <DialogActions>
                <Button onClick={() => props.close()}>Cancel</Button>
            </DialogActions>
        </Dialog>
    )
}
