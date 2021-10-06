import React, { useState, useContext, useRef } from 'react'
import { Dialog, TextField, Button, DialogActions, Divider } from '@material-ui/core'
import { Publish, SentimentSatisfiedOutlined } from '@material-ui/icons'
import { PopupManager, setPopupState } from '../../Context/PopupManager'
import { AppDataManager } from '../../Context/AppDataManager'
import { UserManager } from '../../Context/userManager'
import RESOURCES from '../../Resources/resources'


const firebase = require('firebase')
const axios = require('axios')

export default function AddCustomNode() {

    const [file, setFile] = useState(null)
    const [preview, setPreview] = useState(null)
    const [title, setTitle] = useState(null)
    const [urlError, setUrlError] = useState(false)
    const [titleError, setTitleError] = useState(false)

    const { popups, setPopups } = useContext(PopupManager)
    const { userData } = useContext(UserManager)

    const fileInput = React.useRef();

    function Submit() {
        var uploadTask = firebase.default.storage().ref().child(userData.displayName + '/' + title).put(file)
        uploadTask.on('state_changed',
            (snapshot) => {
            },
            (error) => {
            },
            () => {
                uploadTask.snapshot.ref.getDownloadURL().then(async (downloadURL) => {
                    if(downloadURL){
                        let res = await axios.post(`${RESOURCES.apiURL}/nodes/custom?user=${userData.displayName}&title=${title}&imgUrl=${ encodeURI(downloadURL + '?alt=media')}`)
                    }
                });
            }
        )
    }

    return (
        <Dialog fullWidth maxWidth='sm' open={popups.AddCustomNode} onClose={()=>setPopups(setPopupState('AddCustomNode', false, popups))}>
            <div style={{ padding: '10vh' }}>
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around' }}>
                    <div style={{ position: 'absolute', width: '10px', height: '30%', background: '#d2d2d2', zIndex: '0', top: 0 }}></div>
                    {preview ?
                        <img alt={'Nodemap' + title} style={{ zIndex: '3', maxHeight: '10vw', width: '10vw', height: '10vw', borderRadius: '50%', transition: '0.5s', transformOrigin: 'center', transitionDelay: '0.1s', border: '10px solid transparent' }} src={preview}></img>
                        :
                        <div style={{ zIndex: '3', background: 'white', maxHeight: '10vw', width: '10vw', height: '10vw', borderRadius: '50%', transition: '0.5s', transformOrigin: 'center', transitionDelay: '0.1s', border: urlError ? '4px dashed red' : '4px dashed #D2D2D2', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontSize: '10vh', color: '#D2D2D2' }}><Publish /></div>
                    }
                    <div style={{ marginTop: '5vh' }}>
                        <input
                            ref={fileInput}
                            type="file"
                            style={{ display: 'none' }}
                            onChange={(e) => { setFile(e.target.files[0]); setPreview(URL.createObjectURL(e.target.files[0])) }}
                        />
                        <Button style={{ width: '100%', background: '#6930C3', color: 'white' }} onClick={() => fileInput.current.click()}>Choose node image</Button>
                        <TextField style={{ background: 'white', marginTop: '3vh' }} error={titleError} variant='outlined' placeholder='Node title' fullWidth size='small' onChange={(e) => { setTitle(e.target.value); setTitleError(false) }}></TextField>
                    </div>
                </div>
            </div>
            <Divider />
            <DialogActions>
                <div style={{ display: 'flex' }}>
                    <Button onClick={()=>setPopups(setPopupState('AddCustomNode', false, popups))}>Cancel</Button>
                    <Button onClick={Submit}>Save</Button>
                </div>
            </DialogActions>
        </Dialog>
    )
}