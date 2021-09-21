import React, { useContext } from 'react'
import {Dialog, Button, Divider, Paper} from '@material-ui/core'
import { PopupManager, setPopupState } from '../../Context/PopupManager'
import LoginPrompt1 from '../../Images/LoginPrompt1.svg'
import LoginPrompt2 from '../../Images/LoginPrompt2.svg'
import LoginPrompt3 from '../../Images/LoginPrompt3.svg'

export default function LoginPrompt(){

    const {popups, setPopups} = useContext(PopupManager)

    return(
        <Dialog maxWidth='lg' fullWidth hideBackdrop style={{background:'rgba(247, 246, 243, 0.5)', backdropFilter: 'blur(4px)', border:'1px solid #e5e5e5'}} open={popups.LoginPrompt} PaperProps={{elevation:'1'}} onClose={()=>setPopups(setPopupState('LoginPrompt', false, popups))}>
            <div style={{display:'flex', padding:'5vh', paddingBottom:'3vh', flexDirection:'column', alignItems:'center', justifyContent:'space-between', height:'auto', textAlign:'center'}}>
                <h2 style={{fontWeight:'lighter', color:'#555555', marginBottom:'4vh'}}>Log in to get the most out of this resource!</h2>
                <div style={{display:'flex', justifyContent:'space-evenly', width:'100%', color:'#444444', fontWeight:'lighter', marginBottom:'5vh', height:'auto'}}>
                    <Paper style={{border:'1px solid #e5e5e5', borderRadius:'10px', padding:'1vw 2vw', margin:'1vh', height:'auto'}}>
                        <img style={{maxHeight:'20vh'}} src={LoginPrompt1}></img>
                        <h3 style={{fontWeight:'lighter', fontFamily:'Permanent Marker'}}>Track your progress</h3>
                        <Divider></Divider>
                        <div className='Login'>
                            <p style={{fontWeight:'normal'}}>Some content Some content Some content Some content Some content Some content Some content Some content</p>
                        </div>
                    </Paper>
                    <Paper style={{border:'1px solid #e5e5e5', borderRadius:'10px', padding:'1vw 2vw', margin:'1vh'}}>
                        <img style={{maxHeight:'20vh'}} src={LoginPrompt2}></img>
                        <h3 style={{fontWeight:'lighter'}}>Make extra notes</h3>
                        <Divider></Divider>
                        <div className='Login'>
                            <p style={{fontWeight:'normal'}}>Some content Some content Some content Some content Some content Some content Some content Some content</p>
                        </div>
                    </Paper>
                    <Paper style={{border:'1px solid #e5e5e5', borderRadius:'10px', padding:'1vw 2vw', margin:'1vh'}}>
                        <img style={{maxHeight:'20vh'}} src={LoginPrompt3}></img>
                        <h3 style={{fontWeight:'lighter'}}>Tweak it</h3>
                        <Divider></Divider>
                        <div className='Login'>
                            <p style={{fontWeight:'normal'}}>Some content Some content Some content Some content Some content Some content Some content Some content</p>
                        </div>
                    </Paper>
                </div>
                <div style={{display:'flex', width:'60%', marginBottom:'2vh', justifySelf:'flex-end'}}>
                    <Button style={{margin:'0vh 0vh', width:'50%', background:'#6930c3', color:'white'}} onClick={()=>window.location.assign('/signup')}>Sign up</Button>
                    <Divider orientation='vertical' flexItem style={{margin:'0 5vh'}}></Divider>
                    <Button style={{margin:'0vh 0vh', width:'50%', background:'#6930c3', color:'white'}} onClick={()=>window.location.assign('/login')}>Log in</Button>
                </div>
            </div>
        </Dialog>
    )
}