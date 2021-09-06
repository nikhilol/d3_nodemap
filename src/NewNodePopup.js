import React, { useContext, useState } from 'react'
import { Dialog, DialogContent, DialogTitle, Divider, DialogActions, Button, TextField } from '@material-ui/core'
import NewNodeSearchSelector from './NewNodeSearchSelector'
import { PopupManager, setPopupState } from './PopupManager'
import { AppDataManager, setDataState } from './AppDataManager'

export default function NewPlanPopup(props) {

    const [platform, setPlatform] = useState(null)
    const [title, setTitle] = useState(null)
    const [platformError, setPlatformError] = useState(false)
    const [titleError, setTitleError] = useState(false)

    const { popups, setPopups } = useContext(PopupManager)
    const { appData, setAppData} = useContext(AppDataManager)

    function save() {
        setPlatformError(!platform)
        setTitleError(!title)

        if (platform && title) {
            if (props.editing) {
                props.EditNode(platform)
            } else {
                AddNode();
            }
            setPopups(setPopupState('AddNode', false, popups))
        }
    }

    //Add node to plan
    function AddNode() {
        if (appData.ActiveNode) {
            appData.Data.nodes.forEach(node => {
                console.log(node)
                if (node.id === appData.ActiveNode.id) {
                    console.log('about to run')
                    let temp = appData.Data;
                    console.log('temp', temp)
                    let key = appData.Data.nodes.indexOf(node) + 1;
                    console.log('key', key)

                    temp.nodes.splice(key, 0, {})

                    temp.nodes[key].id = generateRandomID();

                    console.log(temp.nodes[key].fy, temp.nodes[key - 1].y + 200, temp.nodes[key].fx, temp.nodes[key - 1].x)

                    if (temp.nodes[key + 1] && (temp.nodes[key + 1].y === temp.nodes[key - 1].y + 200 && temp.nodes[key + 1].x === temp.nodes[key - 1].x)) {
                        temp.nodes[key].fx = temp.nodes[key - 1].fx ? temp.nodes[key - 1].fx + 200 : temp.nodes[key - 1].x + 200;
                        temp.nodes[key].fy = temp.nodes[key - 1].fy ? temp.nodes[key - 1].fy : temp.nodes[key - 1].y;
                        temp.nodes[key].x = temp.nodes[key - 1].fx ? temp.nodes[key - 1].fx + 200 : temp.nodes[key - 1].x + 200;
                        temp.nodes[key].y = temp.nodes[key - 1].fy ? temp.nodes[key - 1].fy : temp.nodes[key - 1].y;
                    }
                    else {
                        temp.nodes[key].fx = temp.nodes[key - 1].fx ? temp.nodes[key - 1].fx : temp.nodes[key - 1].x;
                        temp.nodes[key].fy = temp.nodes[key - 1].fy ? temp.nodes[key - 1].fy + 200 : temp.nodes[key - 1].y + 200;
                        temp.nodes[key].x = temp.nodes[key - 1].fx ? temp.nodes[key - 1].fx : temp.nodes[key - 1].x;
                        temp.nodes[key].y = temp.nodes[key - 1].fy ? temp.nodes[key - 1].fy + 200 : temp.nodes[key - 1].y + 200;
                    }

                    temp.nodes[key].Platform = platform.split(0, -4)
                    temp.nodes[key].svg = `/Logos/${platform}`
                    temp.nodes[key].md = `### ${platform.replace('.png', '')} ### \n # ${title} # \n --- `

                    temp.links.push({ source: temp.nodes[key - 1].id, target: temp.nodes[key].id, color: '#D2D2D2' })
                    console.log('TEMP', temp)

                    setAppData(setDataState('Data', {...temp}, appData))
                }
            })
        }
    }

    function generateRandomID() {
        var randomString = ""
        var alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        for (let c = 0; c < 20; c++) {
            randomString += alphabet.charAt(Math.floor(Math.random() * alphabet.length))
        }
        return randomString
    }

    return (
        <Dialog open={popups.AddNode} maxWidth='md' fullWidth>
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
                        <TextField style={{ background: 'white' }} error={titleError} variant='outlined' placeholder='Node title' fullWidth size='small' onChange={(e) => { setTitle(e.target.value); setTitleError(false) }}></TextField>
                    </div>
                </div>
            </DialogContent>
            <Divider></Divider>
            <DialogActions>
                <Button onClick={() => setPopups(setPopupState('AddNode', false, popups))}>Cancel</Button>
                <Button onClick={save}>{props.editing ? 'Save' : 'Add'}</Button>
            </DialogActions>
        </Dialog>
    )
}
