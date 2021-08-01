import React, {useState} from 'react'
import { Dialog, TextField, Button } from '@material-ui/core'

const firebase  = require('firebase').default

export default function RegisterModal(props) {

    const [value, setValue] = useState()

    async function register(){
        console.log(value)
        if(value){
            await firebase.firestore().collection('Sign Ups').doc(value).set({
                Time: new Date().toLocaleString(),
                Email:value,
            })
            props.close()
        }
    }

    return (
        <Dialog open={props.open} onClose={props.close} maxWidth='md' >
            <div style={{ padding: '10vh', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <h1>Nodemap is still in the works right now...</h1>
                <p>If you liked the demo, register with your email and we will add you to our early adopters list!</p>
                <div style={{ width: '50%', marginTop:'2vh', display:'flex' }}>
                    <TextField onChange={(e)=>{setValue(e.target.value)}} fullWidth placeholder='Email' size="small" variant='outlined' style={{outline:'none'}}></TextField>
                    <Button onClick={register} style={{right:"2vh", background: '#6930C3', color: 'white', width: '5vw'}}>Submit</Button>
                </div>
            </div>
        </Dialog>
    )
}
