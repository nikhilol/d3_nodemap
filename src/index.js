import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Switch, Route, useParams, withRouter } from 'react-router-dom';
const firebase = require('firebase')

const app = firebase.default.initializeApp({
  apiKey: "AIzaSyCUzsoeXiMaMNekQnH-nK8pZkvcmfttVSI",
  authDomain: "nodemap-app.firebaseapp.com",
  projectId: "nodemap-app",
  storageBucket: "nodemap-app.appspot.com",
  messagingSenderId: "1066002610989",
  appId: "1:1066002610989:web:6136fbcaf16554fb4031a4",
  measurementId: "G-6NN3D93WVH",
})


ReactDOM.render(
    <Router>
      <Switch>
        <Route exact path='/plan/:user/:plan' component={withRouter(PlanRoute)}/>
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
  return (<App userID={user} plan={plan}></App>)
}
