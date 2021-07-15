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
    const [plan, setPlan] = useState(props.plan)

    return (
        <>
            {props.plans &&
                <Select style={{ color: 'white' }} value={plan}>
                    {
                        props.plans.map(plan => {
                            return (
                                <Link style={{ width: '100%', height: '100%' }} to={`/plan/${props.userID}/${encodeURI(plan)}`}>
                                    <MenuItem value={plan}>
                                        {plan}
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
