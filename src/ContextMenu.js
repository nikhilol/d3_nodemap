import React, { useContext } from 'react'
import { MenuItem, Popover } from '@material-ui/core'
import { PopupManager, setMultiPopupState, setPopupState } from './PopupManager'

export default function ContextMenu() {

    const { popups, setPopups } = useContext(PopupManager)

    //context menu close handler
    function handleContextMenuClose(Action) {
        setPopups(setMultiPopupState({
            MouseX: 0,
            MouseY: 0,
            ContextMenu: false,
            AddNode: true,
            Editing: Action ===  'Editing'
        }, popups))
    }

    return (
        <Popover
            elevation={3}
            id='ContextMenu'
            keepMounted
            open={popups.ContextMenu}
            onClose={handleContextMenuClose}
            anchorReference="anchorPosition"
            anchorPosition={{ top: popups.MouseY, left: popups.MouseX }}
        >
            <MenuItem onClick={() => { handleContextMenuClose('AddNode') }}>Add node after active node</MenuItem>
            <MenuItem onClick={() => { handleContextMenuClose('Editing') }}>Edit active node</MenuItem>
            {/* <MenuItem onClick={() => { DeleteNode(); handleContextMenuClose() }}>Delete active node</MenuItem> */}
        </Popover>
    )
}