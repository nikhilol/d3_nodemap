import React, {useEffect} from 'react';
import Logo from './Images/LogoVertical.svg'
import { TextField, Button } from '@material-ui/core'
import RESOURCES from './Resources/resources'

const axios = require('axios')
const firebase = require('firebase')
// const mixpanel = require('mixpanel-browser')

export function Signup() {
    useEffect(() => {
        firebase.default.auth().onAuthStateChanged((user) => {
            if (user) {
              window.location.assign(`/plan/${user.displayName}`)
            }
          })
    }, [])

    async function signupHandler() {
        if (document.getElementById('Password').value === document.getElementById('RepeatPassword').value) {
            try {
                const res = await axios.post(`${RESOURCES.apiURL}/signup?Email=${document.getElementById('Email').value}&Username=${document.getElementById('Username').value}&Password=${document.getElementById('Password').value}`)
                await firebase.default.auth().signInWithEmailAndPassword(document.getElementById('Email').value, document.getElementById('Password').value);
                await firebase.default.auth().setPersistence(firebase.default.auth.Auth.Persistence.LOCAL)
                window.location.assign(`/plan/${firebase.default.auth().currentUser.displayName}`)
            } catch (e) {
                console.log(e)
                alert(e.message)
            }
        } else { alert('Passwords must match!') }
    }

    return (
        <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', background: '#303030' }} className='Login'>
            <div style={{ width: '300px', height: 'auto', padding: '50px', border: '1px solid #E1E1E1', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#fcfcfc' }}>
                <img src={Logo} style={{ width: '50%', margin: '20px' }} alt="" />
                <div style={{ borderBottom: '1px solid #EEE', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
                    <TextField id='Email' label='Email' variant='outlined' size='small' style={{ width: '100%' }}></TextField>
                    <TextField id='Username' label='Username' variant='outlined' size='small' style={{ width: '100%', margin: '10px 0px' }}></TextField>
                    <TextField id='Password' type="password" label='Password' variant='outlined' size='small' style={{ width: '100%' }}></TextField>
                    <TextField id='RepeatPassword' type="password" label='Repeat Password' variant='outlined' size='small' style={{ width: '100%', margin: '10px 0px' }}></TextField>
                    <Button style={{ marginTop: '10px', width: '100%', marginBottom: '50px', background: 'linear-gradient(135deg, #6930C3 30%, #5E60CE 90%)', color: 'white', fontWeight: '600', fontSize: '12pt' }} onClick={signupHandler}>Sign Up</Button>
                </div>
                <p>Already have an account?</p>
                <a href='/login' style={{ textDecoration: 'none', color: '#6090ff' }}>Sign In</a>
            </div>
        </div>
    );
}

export default Signup;