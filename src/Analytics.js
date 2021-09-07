import React, { useContext, useState } from 'react'
import { PopupManager, setPopupState } from './PopupManager'
import { Popper, Button } from '@material-ui/core'
import {Timeline} from '@material-ui/icons'

export default function Analytics() {

    const { popups, setPopups } = useContext(PopupManager)
    const [downloads, setDownloads] = useState(0)


    return (
        <div style={{ display: 'flex', flexDirection: 'column', position: 'absolute', top: '2vh', left: '2vh', }}>
            <Button className='Analytics' id='Analytics'
                onMouseLeave={() => setPopups(setPopupState('Analytics', false, popups))}
                onClick={() => setPopups(setPopupState('Analytics', true, popups))}>
                <Timeline fontSize='large' style={{}} ></Timeline>
                <div className='inner' style={{ width: '0', overflow: 'hidden', opacity: 0 }}>Analytics</div>
            </Button>
            <Popper open={popups.Analytics} anchorEl={document.getElementById('Analytics')} placement='right-start' style={{ marginLeft: '1vh', width: 'auto', minWidth: '10vw', height: '10vw', background: 'white', borderRadius: '10px', border: '1px solid #e5e5e5' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <div>Imports</div>
                        <h1 style={{ fontWeight: 'lighter' }}>{downloads}</h1>
                    </div>
                </div>
            </Popper>
        </div>
    )
}