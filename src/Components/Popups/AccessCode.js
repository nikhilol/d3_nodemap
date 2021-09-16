import { Dialog,  Button, TextField } from '@material-ui/core'
import React, { useContext, useState } from 'react'
import {PopupManager, setPopupState} from '../../Context/PopupManager'
import { AppDataManager } from '../../Context/AppDataManager'
import RESOURCES from '../../Resources/resources'
import axios from 'axios'

export default function AccessCode(props){

    const {popups, setPopups} = useContext(PopupManager)
    const {appData} = useContext(AppDataManager)

    const [text, setText] =  useState('')
    const [error, setError] =  useState(false)

    async function Submit(){
        var result = await axios.post(`${RESOURCES.apiURL}/privacy?user=${appData.UserIDRoute}&title=${appData.CurrentPlan}&password=${text}`)
        if(result.data === true){
            setPopups(setPopupState('AccessCode', false, popups))
            props.getNodes(appData.Plans)
        } else {
            setError(true)
        }
    } 

    return(
        <Dialog open={popups.AccessCode}>
            PLEASE ENTER ACCESS CODE
            <TextField error={error} helperText={error && 'Password incorrect, try again!'} type='password' onChange={(e)=>setText(e.target.value)}></TextField>
            <Button onClick={Submit}>submit</Button>
        </Dialog>
    )
}