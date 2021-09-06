import React, { useContext, useState } from 'react'
import { Menu, MenuItem } from '@material-ui/core'
import { PopupManager, setMultiPopupState, setPopupState } from './PopupManager'

export default function ContextMenu(props) {

    const { popups, setPopups } = useContext(PopupManager)

    //context menu close handler
    function handleContextMenuClose() {
        setPopups(setMultiPopupState({
            MousePosition: [null, null],
            ContextMenu: false
        }, popups))
    }

    return (
        <Menu
            id='ContextMenu'
            keepMounted
            open={popups.ContextMenu == true ? true: false}
            onClose={handleContextMenuClose}
            anchorReference="anchorPosition"
            anchorPosition={{ top: popups.MousePosition[1] + 'px', left: popups.MousePosition[0] + 'px' }}>
            <MenuItem onClick={() => { setPopups(setPopupState('AddNode', true, popups)); handleContextMenuClose() }}>Add node after active node</MenuItem>
            {/* <MenuItem onClick={() => { setIsEditing(true); setPopups(setPopupState('AddNode', true, popups)); handleContextMenuClose() }}>Edit active node</MenuItem> */}
            {/* <MenuItem onClick={() => { DeleteNode(); handleContextMenuClose() }}>Delete active node</MenuItem> */}
        </Menu>
    )
}