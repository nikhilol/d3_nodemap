import { Dialog,  Button, TextField } from '@material-ui/core'
import React, { useContext, useState } from 'react'
import {PopupManager, setPopupState} from '../../Context/PopupManager'
import { AppDataManager } from '../../Context/AppDataManager'
import RESOURCES from '../../Resources/resources'
import axios from 'axios'
import AccessCodeImg from '../../Images/AccessCode.svg'

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
        <Dialog hideBackdrop style={{background:'#F7F6F3', border:'1px solid #e5e5e5'}} open={popups.AccessCode} PaperProps={{elevation:'1'}}>
            <div style={{display:'flex', flexDirection:'column', padding:'10vh'}}>
                <img style={{maxHeight:'30vh'}} src={AccessCodeImg} alt=""></img>
                <p style={{textAlign:'center', margin:'5vh 0'}}>This content has been restricted by the creator. Enter the password to gain access!</p>
                <TextField className='Login' style={{marginBottom:'1vh'}} variant='outlined' size='small' label='Password' error={error} helperText={error && 'Password incorrect, try again!'} type='password' onChange={(e)=>setText(e.target.value)}></TextField>
                <Button disabled={!text.length} style={{background: text.length ? '#6930C3' : '#F7F6F3', color: text.length ? 'white' : 'black'}} onClick={Submit}>submit</Button>
            </div>
        </Dialog>
    )
}