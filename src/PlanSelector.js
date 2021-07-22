import React, { useState } from 'react'
import { Menu, MenuItem, ClickAwayListener, Button, Dialog, Divider } from '@material-ui/core'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import AddNewPlanPopup from './AddNewPlanPopup'
const firebase = require('firebase').default

function PlanSelector(props) {

    const [addNewPlanPopupOpen, setAddNewPlanPopupOpen] = useState(false);

    return (
        <>
            {props.plans &&
                <Menu
                    id="simple-menu"
                    anchorEl={document.getElementById('planTitle')}
                    keepMounted
                    open={props.open}
                >
                    {

                        props.plans.map(_plan => {
                            console.log(_plan)
                            return (
                                <Link style={{ width: '100%', height: '100%', colour: 'black' }} to={`/plan/${props.userID}/${encodeURI(_plan)}`}>
                                    <MenuItem value={props.plans.indexOf(_plan)}>
                                        {_plan}
                                    </MenuItem>
                                </Link>
                            )
                        })
                    }
                    <Divider></Divider>
                    <Button fullWidth onClick={() => { setAddNewPlanPopupOpen(true); props.close() }}>+ Add new plan</Button>
                </Menu>

            }
            <AddNewPlanPopup open={addNewPlanPopupOpen} close={() => setAddNewPlanPopupOpen(false)}></AddNewPlanPopup>
        </>
    )
}

export default PlanSelector
