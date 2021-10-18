import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './Components/App/App';
import Login from './Components/Auth/Login'
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Switch, Route, useParams, withRouter } from 'react-router-dom';
import Signup from './Components/Auth/Signup';
const firebase = require('firebase').default
const amplitude = require('amplitude-js')

const app = firebase.initializeApp({
  apiKey: "AIzaSyCUzsoeXiMaMNekQnH-nK8pZkvcmfttVSI",
  authDomain: "nodemap-app.firebaseapp.com",
  projectId: "nodemap-app",
  storageBucket: "nodemap-app.appspot.com",
  messagingSenderId: "1066002610989",
  appId: "1:1066002610989:web:6136fbcaf16554fb4031a4",
  measurementId: "G-6NN3D93WVH",
})

amplitude.getInstance().init("318d9a5562d118d25c43febfbb677fbc");


ReactDOM.render(
    <Router>
      <Switch>
        <Route path='/demo' component={Demo}></Route>
        <Route exact path='/plan/:user/:plan' component={withRouter(PlanRoute)} />
        <Route exact path='/plan/:user' component={withRouter(UserRoute)} />
        <Route path='/login' component={Login}></Route>
        <Route path='/signup' component={Signup}></Route>
        <Route path='/' component={App}></Route>
      </Switch>
    </Router>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

function PlanRoute() {
  let { user, plan } = useParams()
  if (user) {
    return (<App userID={user} plan={plan}></App>)
  }
}

function UserRoute() {
  let { user } = useParams()
  if (user) {
    return (<App userID={user}></App>)
  }
}

function Demo() {
  return (<App userID='Demo1' plan='Your first plan!' demo></App>)
}