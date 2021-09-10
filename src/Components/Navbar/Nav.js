import { render } from "@testing-library/react";
import React, { useContext } from "react";
import { AppDataManager } from "../../Context/AppDataManager";
import { PopupManager, setPopupState } from "../../Context/PopupManager";
import { Button } from '@material-ui/core'
import { ExpandMore } from "@material-ui/icons";
import { UserManager } from "../../Context/userManager";

const firebase = require('firebase')

export default function Nav(props) {

    const { popups, setPopups } = useContext(PopupManager)
    const { appData } = useContext(AppDataManager)
    const {userData, setUserData} = useContext(UserManager)

    async function logoutHandler() {
        await firebase.auth().signOut()
        window.location.assign('/login')
    }

    return (
        <nav style={{ height: '5vh', background: '#F5F5F5', borderBottom: '1px solid #e5e5e5', display: 'flex', justifyContent: 'center', alignItems: 'center' }} className="App">
            <h2 style={{ cursor: 'pointer', position: 'relative', color: '#2b2b2b', display: 'flex', alignItems: 'center', fontWeight: 'lighter' }} onClick={() => setPopups(setPopupState('PlanSelector', true, popups))}>{appData.CurrentPlan}<ExpandMore id='planTitle'></ExpandMore></h2>
            {userData.displayName ?
                <Button style={{ background: '#ff6666', color: 'white', position: 'absolute', right: '1vh' }} onClick={logoutHandler}>Log out</Button>
                :
                appData.IsDemo ?
                    <Button style={{ background: '#6930C3', color: 'white', position: 'absolute', right: '1vh' }} onClick={() => setPopups(setPopupState('Register', true, popups))}>Sign up</Button>
                    :
                    <Button style={{ background: '#6930C3', color: 'white', position: 'absolute', right: '1vh' }} onClick={() => setPopups(setPopupState('Register', true, popups))}>Log in</Button>
            }
        </nav>
    )
}
