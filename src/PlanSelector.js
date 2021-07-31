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
        <div>
            {props.plans &&
                <Menu
                    id="simple-menu"
                    anchorEl={document.getElementById('planTitle')}
                    open={props.open}
                    onClose={props.close}
                >
                    {

                        props.plans.map(_plan => {
                            console.log(_plan)
                            return (
                                <Link style={{ width: '100%', height: '100%', colour: 'black' }} to={`/plan/${props.userID}/${encodeURI(_plan)}`}>
                                    <MenuItem value={props.plans.indexOf(_plan)} onClick={props.close}>
                                        {_plan}
                                    </MenuItem>
                                </Link>
                            )
                        })
                    }
                    <Divider  style={{margin:'1vh'}}></Divider>
                    <Button style={{color:'white', backgroundColor:'#6930C3', margin:'0vh 1vh'}} onClick={() => { setAddNewPlanPopupOpen(true); props.close() }}>+ Add new plan</Button>
                </Menu>

            }
            <AddNewPlanPopup open={addNewPlanPopupOpen} close={() => setAddNewPlanPopupOpen(false)}></AddNewPlanPopup>
        </div>
    )
}

export default PlanSelector
