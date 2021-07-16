import React, { useState } from 'react'
import { Select, MenuItem, ClickAwayListener } from '@material-ui/core'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
const firebase = require('firebase').default

function PlanSelector(props) {

    const [open, setOpen] = useState(false);

    console.log(props.plan)

    return (
        <>
            {props.plans &&
                <Select style={{ color: 'white' }} defaultValue={props.plan}>
                    {
                        props.plans.map(_plan => {
                            console.log(_plan)
                            return (
                                <Link style={{ width: '100%', height: '100%' }} to={`/plan/${props.userID}/${encodeURI(_plan)}`}>
                                    <MenuItem value={_plan}>
                                        {_plan}
                                    </MenuItem>
                                </Link>

                            )
                        })
                    }
                </Select>
            }
        </>
    )
}

export default PlanSelector
