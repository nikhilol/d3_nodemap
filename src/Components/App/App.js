/* eslint-disable react-hooks/exhaustive-deps */
import './App.css';
import PlanSelector from '../Popups/PlanSelector'
import NewNodePopup from '../Popups/NewNodePopup'
import RESOURCES from '../../Resources/resources'
import RegisterModal from '../Popups/RegisterModal';

import React, { useState, useEffect } from 'react'
import { PopupManager, setMultiPopupState, setPopupState } from '../../Context/PopupManager';
import { Menu, MenuItem, Button, CircularProgress, Modal, Popper } from '@material-ui/core'
import { ExpandMore, Timeline } from '@material-ui/icons'
import 'react-markdown-editor-lite/lib/index.css';
import { UserManager } from '../../Context/userManager';
import { AppDataManager, setDataState, setMultiDataState } from '../../Context/AppDataManager';
import Nav from '../Navbar/Nav';
import Analytics from '../Popups/Analytics';
import ContextMenu from '../Popups/ContextMenu';
import GraphPane from '../Panes/Graph/GraphPane';
import EditorPane from '../Panes/Editor/EditorPane'
import AccessCode from '../Popups/AccessCode';
import AddCustomNode from '../Popups/AddCustomNode';

const axios = require('axios').default
const firebase = require("firebase").default
const amplitude = require('amplitude-js')


function App(props) {

  const [popups, setPopups] = useState({
    AddNode: false,
    PlanSelector: false,
    AddPlan: false,
    Register: false,
    Analytics: false,
    ContextMenu: false,
    MouseX: 0,
    MouseY: 0,
    AccessCode: false,
    LoginPrompt: true,
    AddCustomNode:false
  })

  const [userData, setUserData] = useState({})

  const [appData, setAppData] = useState({
    Data: {},
    Plans: [],
    MdValue: [],
    UserIDRoute: props.userID,
    CurrentPlan: props.plan,
    IsDemo: props.demo,
    ActiveNode: {}
  })

  useEffect(()=>{
    props.demo && amplitude.getInstance().logEvent('DEMO_LOADED');
  },[]) 

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      setUserData(user)
      amplitude.getInstance().setUserId(user.uid);
      amplitude.getInstance().setUserProperties({
        Username: user.displayName,
        Email: user.email
      });
      if (!props.userID) {
        window.location.assign('/plan/' + user.displayName)
      } else if(props.userID !== user.displayName ){
        //NOT OWNER
        //POPUP ACCESS CODE REQUEST
      }
    }
    //if no user
    //popup access code, if pass, let user view plan 

  })

  //save when data changes
  useEffect(() => {
    if (appData.Data) {
      if (appData.Data) {
        Save();
      }
    }
  }, [appData.Data])

  //markdown timeout
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      Save();
    }, 2000)

    return () => clearTimeout(delayDebounceFn)
  }, [appData.MdValue])

  //get nodes and links data
  useEffect(async () => {
    let _plans = []
    await axios.get(`${RESOURCES.apiURL}/plans?user=${props.userID}`).then(plans => {
      if (props.userID && !props.plan && plans.data.length) {
        window.location.assign(`/plan/${props.userID}/${plans.data[0]}`)
      }
      _plans = plans.data
      setAppData(setDataState('Plans', _plans, appData))
    })
    await axios.get(`${RESOURCES.apiURL}/privacy?user=${props.userID}&title=${props.plan}`).then(data=>{
      if(data.data){
        //it is private
        //open popup
        amplitude.getInstance().logEvent('PRIVATE_NODEMAP_VIEW');
        setPopups(setPopupState("AccessCode", true, popups))
      } else{
        //not private
        getNodeData(_plans)
      }
    })
  }, [props, props.plan])

  async function getNodeData(_plans){
    await axios.get(`${RESOURCES.apiURL}/plans/nodes?user=${props.userID}&title=${props.plan}`).then(data => {
      if (data.data) {
          amplitude.getInstance().logEvent('NODEMAP_VIEW');
          setAppData(setMultiDataState({ Data: { ...data.data.nodes }, Plans: _plans, ActiveNode: data.data.nodes.nodes[0] }, appData))
        }
      })
  }

  //update a node property helper function
  function updateNodeData(nodeId, property, newValue) {
    let temp = { ...appData.Data }
    for (let key in temp.nodes) {
      if (temp.nodes[key].id === nodeId) {
        //if new value is a bool return the opposite of this value
        //else return the newvalue to th3e property
        if (newValue === 'BOOL') {
          temp.nodes[key][property] = !temp.nodes[key][property]
          updateLinkColour(nodeId, temp.nodes[key][property])
        }
        else { temp.nodes[key][property] = newValue }
      }
    }
    setAppData(setDataState('Data', { ...temp }, appData))
  };

  function updateLinkColour(nodeId, isComplete) {
    let temp = { ...appData.Data }
    for (let key in temp.links) {
      if (temp.links[key].target === nodeId) {
        temp.links[key].color = isComplete ? '#72EFDD' : '#D2D2D2';
        amplitude.getInstance().logEvent('NODE_COMPLETED');
      }
    }
    setAppData(setDataState('Data', { ...temp }, appData))
  };

  //save plan data to firebase
  function Save() {
    console.log(`saving ${props.plan} as current: ${appData.CurrentPlan}`)
    if (appData.Data && !appData.IsDemo && userData.displayName) {
      axios({
        method: 'post',
        url: `${RESOURCES.apiURL}/plans/update?user=${userData.displayName}&title=${props.plan}`,
        data: appData.Data
      }).then(res => {
      });
    }
  }

  //Delete node to plan
  function DeleteNode() {
    //   let temp = data;
    //   deleteLogic(temp);
    //   console.log('TEMP', temp)
    //   if (activeNode) {
    //     temp.nodes.forEach(node => {
    //       if (node.id === activeNode.id) {
    //         temp.nodes.splice(temp.nodes.indexOf(node), 1)
    //       }
    //     })
    //     // setData(temp)
    //   }
    // }

    // function deleteLogic(object) {
    //   console.log(object)
    //   let sources = []
    //   let targets = []
    //   let replaceIndices = []
    //   let deleteIndices = []
    //   let c = 0;
    //   object.links.forEach(link => {
    //     if (link.source === activeNode.id) {
    //       targets.push(link.target)
    //       deleteIndices.push(c)
    //     }
    //     else if (link.target === activeNode.id) {
    //       sources.push(link.source)
    //       replaceIndices.push(c)
    //     }
    //     c++;
    //     console.log('object.links', object.links)
    //   })
    //   console.log('sources', sources)
    //   console.log('targets', targets)
    //   console.log('replaceIndices',replaceIndices)

    //   for (let t = 0; t < targets.length; t++) {
    //     object.links[replaceIndices[t] + t] = {
    //       color: '#d2d2d2',
    //       source: sources[0],
    //       target: targets[t]
    //     }
    //   }

    //   deleteIndices.forEach(index=>{
    //     object.links.splice(index,1)
    //   })

    //   console.log(object)
  }

  //context menu click handler
  function handleNodeRightClick(event) {
    event.preventDefault();
    setPopups(setMultiPopupState({
      MouseX: event.clientX + 20,
      MouseY: event.clientY,
      ContextMenu: true
    }, popups))
  }

  return (
    <UserManager.Provider value={{ userData, setUserData }}>
      <AppDataManager.Provider value={{ appData, setAppData }}>
        <PopupManager.Provider value={{ popups, setPopups }}>
          <div style={{ margin: 0, padding: 0 }} className='App'>
            <Nav plan={props.plan}/>
            <RegisterModal/>
            <Modal hideBackdrop open={!appData.Data.nodes} style={{background:'#F7F6F3', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><CircularProgress style={{ width: '5vw', height: '5vw', outline: 'none' }}></CircularProgress></Modal>
            {appData.Data && appData.Data.nodes &&
              <>
                <div style={{ display: 'flex', height: '95vh' }} className="App">
                  <div style={{ height: '100%', position: 'relative', width: '30vw', borderRight: '1px solid #e5e5e5' }} spellCheck='false'>
                    <EditorPane updateNodeData={updateNodeData}/>
                  </div>
                  <div id='ContextAnchor' onContextMenu={(e) => handleNodeRightClick(e)} style={{ width: '70vw', position: 'relative', marginLeft: '10vh', cursor: 'grab', background: '#F7F6F3', backgroundImage: 'radial-gradient(#d2d2d2 1px, transparent 0)', backgroundSize: '1vw 1vw', backgroundPosition: '-0.5vw -0.5vw' }}>
                    <Analytics/>
                    <GraphPane updateNodeData={updateNodeData} Save={Save}/>
                    <ContextMenu/>
                  </div>
                  <PlanSelector/>
                  <NewNodePopup/>
                  <AddCustomNode></AddCustomNode>
                </div>
              </>
            }
          </div>
          <AccessCode getNodes={getNodeData} plan={props.plan}></AccessCode>
        </PopupManager.Provider>
      </AppDataManager.Provider>
    </UserManager.Provider>
  );
}


export default App;
