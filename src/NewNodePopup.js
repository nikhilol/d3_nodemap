import React, { useState } from 'react'
import { Dialog, DialogContent, DialogTitle, Divider, DialogActions, Button, TextField } from '@material-ui/core'
import NewNodeSearchSelector from './NewNodeSearchSelector'

export default function NewPlanPopup(props) {

    const [open, setOpen] = useState(props.open)
    const [platform, setPlatform] = useState(null)
    const [title, setTitle] = useState(null)
    const [platformError, setPlatformError] = useState(false)
    const [titleError, setTitleError] = useState(false)

    function save() {
        setPlatformError(!platform)
        setTitleError(!title)

        if (platform && title) {
            if (props.editing) {
                props.EditNode(platform)
            } else {
                props.addNode(platform, title);
            }
            props.close()
        }
    }

    return (
        <Dialog open={props.open | open} maxWidth='md' fullWidth>
            <DialogTitle style={{ background: '#2b2b2b', color: 'white' }}>Select your new node</DialogTitle>
            <Divider />
            <DialogContent style={{ minHeight: '60vh', maxHeight: '60vh' }}>
                <div style={{ display: 'flex', height: '60vh' }}>
                    <NewNodeSearchSelector onSelect={(platform, type) => setPlatform(type === 'Custom' ? platform + '.png' : platform)}></NewNodeSearchSelector>
                    <div style={{ margin: '1vh' }}>
                        <Divider orientation='vertical'></Divider>
                    </div>
                    <div style={{ width: '70%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around', padding: '5vh' }}>
                        <div style={{ position: 'absolute', width: '10px', height: '50%', background: '#d2d2d2', zIndex: '0', top: 0 }}></div>
                        {platform ?
                            <img alt={platform} style={{ zIndex: '3', maxHeight: '10vw', width: '10vw', height: '10vw', borderRadius: '50%', transition: '0.5s', transformOrigin: 'center', transitionDelay: '0.1s', border: '10px solid transparent' }} src={'/Logos/' + platform}></img>
                            :
                            <div style={{ zIndex: '3', background: 'white', maxHeight: '10vw', width: '10vw', height: '10vw', borderRadius: '50%', transition: '0.5s', transformOrigin: 'center', transitionDelay: '0.1s', border: platformError ? '4px dashed red' : '4px dashed #D2D2D2', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontSize: '10vh', color: '#D2D2D2' }}>?</div>
                        }
                        <TextField style={{ background: 'white' }} error={titleError} variant='outlined' placeholder='Node title' fullWidth size='small' onChange={(e) => {setTitle(e.target.value); setTitleError(false)}}></TextField>
                    </div>
                </div>
            </DialogContent>
            <Divider></Divider>
            <DialogActions>
                <Button onClick={() => props.close()}>Cancel</Button>
                <Button onClick={save}>{props.editing ? 'Save' : 'Add'}</Button>
            </DialogActions>
        </Dialog>
    )
}
