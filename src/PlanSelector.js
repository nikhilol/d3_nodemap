import React, { useContext, useState } from 'react'
import { Menu, MenuItem, ClickAwayListener, Button, Dialog, Divider } from '@material-ui/core'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import AddNewPlanPopup from './AddNewPlanPopup'
import { PopupManager, setPopupState } from './PopupManager';
const firebase = require('firebase').default

function PlanSelector(props) {

    const { popups, setPopups } = useContext(PopupManager)

    return (
        <div>
            {props.plans &&
                <Menu
                    id="simple-menu"
                    anchorEl={document.getElementById('planTitle')}
                    open={popups.PlanSelector}
                    onClose={() => setPopups(setPopupState('PlanSelector', false, popups))}
                    elevation={3}
                >
                    {
                        props.plans.map(_plan => {
                            return (
                                <Link style={{ width: '100%', height: '100%', colour: 'black' }} to={`/plan/${props.userID}/${encodeURI(_plan)}`}>
                                    <MenuItem value={props.plans.indexOf(_plan)} onClick={()=>setPopups(setPopupState('PlanSelector', false, popups))}>
                                        {_plan}
                                    </MenuItem>
                                </Link>
                            )
                        })
                    }
                    <Divider style={{ margin: '1vh' }}></Divider>
                    <Button style={{ color: 'white', backgroundColor: '#6930C3', margin: '0vh 1vh' }} onClick={() => { setPopups(setPopupState('AddPlan', true, popups)) }}>+ Add new plan</Button>
                </Menu>
            }
            <AddNewPlanPopup></AddNewPlanPopup>
        </div>
    )
}

export default PlanSelector
