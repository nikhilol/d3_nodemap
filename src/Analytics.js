import React, { useContext, useState } from 'react'
import { PopupManager } from './PopupManager'
import { Popper } from '@material-ui/core'

export default function Analytics() {

    const { popups } = useContext(PopupManager)
    const [downloads, setDownloads] = useState(0)


    return (
        <Popper open={popups.Analytics} anchorEl={document.getElementById('Analytics')} placement='right-start' style={{ marginLeft: '1vh', width: 'auto', minWidth: '10vw', height: '10vw', background: 'white', borderRadius: '10px', border: '1px solid #e5e5e5' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div>Imports</div>
                    <h1 style={{ fontWeight: 'lighter' }}>{downloads}</h1>
                </div>
            </div>
        </Popper>
    )
}