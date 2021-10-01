import React, { useContext } from 'react'
import {Dialog, Button, Divider, Paper} from '@material-ui/core'
import { PopupManager, setPopupState } from '../../Context/PopupManager'
import LoginPrompt1 from '../../Images/LoginPrompt1.svg'
import LoginPrompt2 from '../../Images/LoginPrompt2.svg'
import LoginPrompt3 from '../../Images/LoginPrompt3.svg'
import { Close } from '@material-ui/icons'

export default function LoginPrompt(){

    const {popups, setPopups} = useContext(PopupManager)

    return(
        <Dialog maxWidth='lg' fullWidth hideBackdrop style={{background:'rgba(247, 246, 243, 0.5)', backdropFilter: 'blur(4px)', border:'1px solid #e5e5e5'}} open={popups.LoginPrompt} PaperProps={{elevation:'1'}} onClose={()=>setPopups(setPopupState('LoginPrompt', false, popups))}>
            <div style={{display:'flex', padding:'5vh', paddingBottom:'3vh', flexDirection:'column', alignItems:'center', justifyContent:'space-between', height:'auto', textAlign:'center'}}>
                <h2 style={{fontWeight:'lighter', color:'#555555', marginBottom:'4vh'}}>Log in to get the most out of this resource!</h2>
                <div style={{display:'flex', justifyContent:'space-evenly', width:'100%', color:'#444444', fontWeight:'lighter', marginBottom:'5vh', height:'auto'}}>
                    <Paper style={{border:'1px solid #e5e5e5', borderRadius:'10px', padding:'1vw 2vw', margin:'1vh', height:'auto', width:'30%'}}>
                        <img style={{maxHeight:'20vh'}} src={LoginPrompt1}  alt=""></img>
                        <h3 style={{fontWeight:'lighter', fontFamily:'Permanent Marker'}}>Track your progress</h3>
                        <Divider></Divider>
                        <div className='Login'>
                            <p style={{fontWeight:'normal'}}>Visualise the journey and learn at your own pace. We’ll keep track of all your progress so you can pick up where you left off - any time, anywhere!</p>
                        </div>
                    </Paper>
                    <Paper style={{border:'1px solid #e5e5e5', borderRadius:'10px', padding:'1vw 2vw', margin:'1vh', height:'auto' , width:'30%'}}>
                        <img style={{maxHeight:'20vh'}} src={LoginPrompt2} alt=""></img>
                        <h3 style={{fontWeight:'lighter'}}>Make extra notes</h3>
                        <Divider></Divider>
                        <div className='Login'>
                            <p style={{fontWeight:'normal'}}>Write down and record any thoughts and ideas that pop into your head inside the content panel. Personalise your experience, interact with the content and make it unique to you.</p>
                        </div>
                    </Paper>
                    <Paper style={{border:'1px solid #e5e5e5', borderRadius:'10px', padding:'1vw 2vw', margin:'1vh', height:'auto' , width:'30%'}}>
                        <img style={{maxHeight:'20vh'}} src={LoginPrompt3} alt=""></img>
                        <h3 style={{fontWeight:'lighter'}}>Tweak it</h3>
                        <Divider></Divider>
                        <div className='Login'>
                            <p style={{fontWeight:'normal'}}>You can edit the Nodemap by adding or moving nodes, save your changes permanently and let your creativity flourish!</p>
                        </div>
                    </Paper>
                    <Button style={{position:'absolute', top:0, right:'0'}} onClick={()=>setPopups(setPopupState('LoginPrompt', false, popups))}><Close></Close></Button>
                </div>
                <Button style={{width:'30%', background:'#6930c3', color:'white'}} onClick={()=>window.location.assign('/login')}>Log in</Button>
            </div>
        </Dialog>
    )
}