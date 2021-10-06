import React, { useState, useContext } from 'react'
import {Dialog, TextField} from '@material-ui/core'
import {Publish} from '@material-ui/icons'
import { PopupManager } from '../../Context/PopupManager'

export default function AddCustomNode(){

    const [url, setUrl] = useState(null)
    const [title, setTitle] = useState(null)
    const [urlError, setUrlError] = useState(false)
    const [titleError, setTitleError] = useState(false)

    const { popups, setPopups } = useContext(PopupManager)

    return(
        <Dialog open fullWidth maxWidth='sm'>
            <div style={{padding:'10vh'}}>
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around' }}>
                        <div style={{ position: 'absolute', width: '10px', height: '50%', background: '#d2d2d2', zIndex: '0', top: 0 }}></div>
                        {url ?
                            <img alt={'Nodemap' + title} style={{ zIndex: '3', maxHeight: '10vw', width: '10vw', height: '10vw', borderRadius: '50%', transition: '0.5s', transformOrigin: 'center', transitionDelay: '0.1s', border: '10px solid transparent' }} src={url}></img>
                            :
                            <div style={{ zIndex: '3', background: 'white', maxHeight: '10vw', width: '10vw', height: '10vw', borderRadius: '50%', transition: '0.5s', transformOrigin: 'center', transitionDelay: '0.1s', border: urlError ? '4px dashed red' : '4px dashed #D2D2D2', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontSize: '10vh', color: '#D2D2D2' }}><Publish/></div>
                        }
                    <TextField style={{ background: 'white', marginTop:'5vh' }} error={titleError} variant='outlined' placeholder='Node title' fullWidth size='small' onChange={(e) => { setTitle(e.target.value); setTitleError(false) }}></TextField>
                </div>
            </div>
        </Dialog>
    )
}