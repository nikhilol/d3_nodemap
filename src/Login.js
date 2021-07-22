import React, { useState, useEffect } from 'react';
import Logo from './Images/LogoVertical.svg'
import { TextField, Button } from '@material-ui/core'

const firebase = require('firebase');
// const mixpanel = require('mixpanel-browser')

function Login(props) {
    useEffect(() => {
        firebase.default.auth().onAuthStateChanged((user) => {
            if (user) {
              window.location.assign(`/plan/${user.displayName}`)
            }
          })
    }, [])

    async function loginHandler() {
        try {
            await firebase.default.auth().setPersistence(firebase.default.auth.Auth.Persistence.LOCAL)
            let user = await firebase.default.auth().signInWithEmailAndPassword(document.getElementById('Email').value, document.getElementById('Password').value)
            window.location.assign(`/plan/${user.user.displayName}`)
        } catch(e) {
            alert(e.message)
        }


        // return firebase.default.auth().signInWithEmailAndPassword(document.getElementById('Email').value, document.getElementById('Password').value).catch((err) => {
        //     errors.push(err.message)
        // }).then(() => {
        //     // mixpanel.identify(firebase.default.auth().currentUser.displayName)
        //     // mixpanel.track('Login')
        // }).then(() => {
        //     if (errors.length > 0) {
        //         alert(errors[0])
        //     } else {
        //         return firebase.default.auth().setPersistence(firebase.default.auth.Auth.Persistence.LOCAL).then(() => {
        //             window.location.assign('/')
        //         })
        //     }
        // })
    }

    // async function fbSignIn() {
    //     var provider = new firebase.default.auth.FacebookAuthProvider();
    //     await firebase.default.auth().signInWithPopup(provider).catch(function (error) {
    //         alert(error.message)
    //     });
    //     if (firebase.default.auth().currentUser) {
    //         console.log(firebase.default.auth().currentUser)
    //         await writeAccountData(firebase.default.auth().currentUser)
    //         window.location.assign(`/profile/${firebase.default.auth().currentUser.displayName}`)
    //     }
    // }
    // async function tSignIn() {
    //     var provider = new firebase.default.auth.TwitterAuthProvider();
    //     await firebase.default.auth().signInWithPopup(provider).catch(function (error) {
    //         alert(error.message)
    //     });
    //     if (firebase.default.auth().currentUser) {
    //         console.log(firebase.default.auth().currentUser)
    //         await writeAccountData(firebase.default.auth().currentUser)
    //         window.location.assign(`/profile/${firebase.default.auth().currentUser.displayName}`)
    //     }

    // }
    // async function gSignIn() {
    //     var provider = new firebase.default.auth.GoogleAuthProvider();
    //     await firebase.default.auth().signInWithPopup(provider).catch(function (error) {
    //         alert(error.message)
    //     });
    //     if (firebase.default.auth().currentUser) {
    //         await writeAccountData(firebase.default.auth().currentUser)
    //         window.location.assign(`/profile/${firebase.default.auth().currentUser.displayName}`)
    //     }
    // }

    return (
        <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', background: '#FCFCFC' }} className='Login'>
            <div style={{ width: '300px', height: 'auto', padding: '50px', border: '1px solid #E1E1E1', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'white' }}>
                <img src={Logo} style={{ width: '50%', margin: '20px' }} alt="" />
                <div style={{ borderBottom: '1px solid #EEE', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
                    <TextField id='Email' label='Email' variant='outlined' size='small' style={{ width: '100%', margin: '20px 0px' }}></TextField>
                    <div style={{ width: '100%' }}>
                        <TextField id='Password' label='Password' type="password" variant='outlined' size='small' style={{ width: '100%' }} ></TextField>
                        <div style={{ width: '100%', marginTop: '5px' }}>
                            <a href='/password-reset' style={{ float: 'right', fontSize: '10pt', textDecoration: 'none', color: '#6090ff' }}>Forgot your password?</a>
                        </div>
                    </div>
                    <Button onClick={loginHandler} style={{ marginTop: '20px', width: '100%', marginBottom: '50px', background: 'linear-gradient(135deg, #6930C3 30%, #5E60CE 90%)', color: 'white', fontWeight: '600', fontSize: '12pt' }}>Sign In</Button>
                </div>
                {/* <div style={{ marginTop: '50px', width: '100%', display: 'flex', justifyContent: 'space-around' }}>
                    <TwitterLoginButton text='' iconSize='100%' size='40px' style={{ width: '40px', margin: 0, marginBottom: '10px', borderRadius: '100px', outline: 'none' }} onClick={tSignIn}></TwitterLoginButton>
                    <FacebookLoginButton text='' iconSize='100%' size='40px' style={{ width: '40px', margin: 0, marginBottom: '10px', borderRadius: '100px', outline: 'none' }} onClick={fbSignIn}></FacebookLoginButton>
                    <GoogleLoginButton text='' iconSize='100%' size='40px' style={{ width: '40px', margin: 0, marginBottom: '10px', borderRadius: '100px', outline: 'none' }} onClick={gSignIn}></GoogleLoginButton>
                </div> */}
                <p>Don't have an account?</p>
                <a href='/signup' style={{ textDecoration: 'none', color: '#6090ff' }}>Sign Up</a>
            </div>
        </div>
    );
}

export default Login;