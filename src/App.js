/* eslint-disable react-hooks/exhaustive-deps */
import './App.css';
import PlanSelector from './PlanSelector'
import NewNodePopup from './NewNodePopup'
import RESOURCES from './Resources/resources'
import RegisterModal from './RegisterModal';

import React, { useState, useEffect } from 'react'
import { PopupManager, setPopupState } from './PopupManager';
import { Graph } from 'react-d3-graph'
import { Menu, MenuItem, Button, CircularProgress, Modal, Popper } from '@material-ui/core'
import { ExpandMore, Timeline } from '@material-ui/icons'
import 'react-markdown-editor-lite/lib/index.css';
import Editor from "rich-markdown-editor"
import { UserManager } from './userManager';
import { AppDataManager, setDataState, setMultiDataState } from './AppDataManager';

const axios = require('axios').default
const firebase = require("firebase").default
//Config
const reset = false;
const myConfig = {
  "automaticRearrangeAfterDropNode": false,
  "collapsible": false,
  "directed": false,
  "focusAnimationDuration": 0.75,
  "focusZoom": 1,
  "freezeAllDragEvents": false,
  "height": window.innerHeight * 0.94,
  "highlightDegree": 0,
  "highlightOpacity": 1,
  "linkHighlightBehavior": false,
  "maxZoom": 8,
  "minZoom": 0.1,
  "nodeHighlightBehavior": false,
  "panAndZoom": false,
  "staticGraph": false,
  "staticGraphWithDragAndDrop": true,
  "width": window.innerWidth * 0.7,
  "d3": {
    "alphaTarget": 0.05,
    "gravity": -100,
    "linkLength": 100,
    "linkStrength": 1,
    "disableLinkForce": true
  },
  "node": {
    "color": "#d3d3d3",
    "fontColor": "black",
    "fontSize": 24,
    "fontWeight": "bold",
    "highlightColor": "green",
    "highlightFontSize": 36,
    "highlightFontWeight": "normal",
    "highlightStrokeColor": "green",
    "highlightStrokeWidth": "20",
    "labelProperty": "Title",
    "mouseCursor": "pointer",
    "opacity": 1,
    "renderLabel": false,
    "size": 1000,
    "strokeColor": "#000000",
    "strokeWidth": 500,
    "symbolType": "circle",
  },
  "link": {
    "fontColor": "black",
    "fontSize": 24,
    "fontWeight": "normal",
    "highlightColor": "SAME",
    "highlightFontSize": 36,
    "highlightFontWeight": "normal",
    "labelProperty": "label",
    "mouseCursor": "auto",
    "opacity": 1,
    "renderLabel": false,
    "semanticStrokeWidth": false,
    "strokeWidth": 10,
    "markerHeight": 6,
    "markerWidth": 6,
    "strokeDasharray": 0,
    "strokeDashoffset": 0,
    "strokeLinecap": "butt"
  }
}

function App(props) {

  // const [data, setData] = useState({})
  const [plans, setPlans] = useState([])
  const [activeNode, setActiveNode] = useState(null)
  const [mdValue, setMdValue] = useState([])

  const [mouseX, setMouseX] = useState(null)
  const [mouseY, setMouseY] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [downloads, setDownloads] = useState(0)

  const [popups, setPopups] = useState({
    AddNode: false,
    PlanSelector: false,
    AddPlan: false,
    Register: false,
    Analytics: false
  })

  const [userData, setUserData] = useState({})

  const [appData, setAppData] = useState({
    Data: {},
    Plans: [],
    MdValue: [],
    UserIDRoute: props.userID,
    CurrentPlan: props.plan,
    ActiveNode: null
  })

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      setUserData(user)
      if (!props.userID) {
        window.location.assign('/plan/' + user.displayName)
      }
    }
    else if (props.userID === 'Demo1' && props.plan) { return }
    else { window.location.assign('/login') }
  })

  async function logoutHandler() {
    await firebase.auth().signOut()
    window.location.assign('/login')
  }

  //helpers top get nodes in a plan
  // async function getData() {
  //   // let response = await axios.get(`${RESOURCES.apiURL}/plans/nodes?user=${props.userID}&title=${props.plan}`)
  //   let response = await 

  //   console.log('RES:', response.data)
  //   return response
  // }

  //helper to get plan IDs
  // async function getPlans() {
  //   return await axios.get(`${RESOURCES.apiURL}/plans?user=${props.userID}`)
  // }

  //save when data changes
  useEffect(() => {
    if (appData.Data) {
      console.log('NODES', appData.Data)
      if (appData.Data.length) {
        Save();
      }
    }
  }, [appData.Data])

  //markdown timeout
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      console.log(mdValue)
      Save();
    }, 2000)

    return () => clearTimeout(delayDebounceFn)
  }, [mdValue])

  //get nodes and links data
  useEffect(async () => {
    let mounted = true;
    let _plans = []
    await axios.get(`${RESOURCES.apiURL}/plans?user=${props.userID}`).then(plans => {
      console.log(plans.data)
      if (props.userID && !props.plan && plans.data.length) {
        window.location.assign(`/plan/${props.userID}/${plans.data[0]}`)
      }
      _plans = plans.data
    })
    await axios.get(`${RESOURCES.apiURL}/plans/nodes?user=${props.userID}&title=${props.plan}`).then(data => {
      console.log('REQUEST:', data)
      if (data.data) {
        if (mounted) {
          console.log('DATA:', data.data.nodes.nodes)
          setAppData(setMultiDataState({ Data: { ...data.data.nodes }, Plans: _plans, ActiveNode: data.data.nodes.nodes[0].id }, appData))
        }
      }
    })
    return () => mounted = false;
  }, [props])

  //update a node property helper function
  function updateNodeData(nodeId, property, newValue) {
    let temp = { ...appData.Data }
    console.log('test', temp.nodes)
    for (let key in temp.nodes) {
      if (temp.nodes[key].id === nodeId) {
        //if new value is a bool return the opposite of this value
        //else return the newvalue to th3e property
        if (newValue === 'BOOL') {
          temp.nodes[key][property] = !temp.nodes[key][property]
          updateLinkColour(nodeId, temp.nodes[key][property])
        }
        else { temp.nodes[key][property] = newValue }
        console.log(`Updating ${nodeId}'s property ${property} to ${newValue}`)
      }
    }
    setAppData(setDataState('Data', { ...temp }, appData))
    console.log(temp)
  };

  function updateLinkColour(nodeId, isComplete) {
    let temp = { ...appData.Data }
    for (let key in temp.links) {
      if (temp.links[key].target === nodeId) {
        temp.links[key].color = isComplete ? '#72EFDD' : '#D2D2D2';
      }
    }
    setAppData(setDataState('Data', { ...temp }, appData))
    console.log(temp)
  };

  //save plan data to firebase
  function Save() {
    // if (data && !props.demo) {
    //   axios({
    //     method: 'post',
    //     url: `${RESOURCES.apiURL}/plans/update?user=${userData.displayName}&title=${props.plan}`,
    //     data: data
    //   }).then(res => {
    //     console.log(res.data);
    //   });
    // }
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

  function EditNode(platform) {
    updateNodeData(appData.ActiveNode, 'Platform', platform)
    updateNodeData(appData.ActiveNode, 'svg', '/Logos/' + platform)
  }

  //node completion handler
  function onClickNode(node) {
    console.log(node)
    updateNodeData(node, 'IsComplete', 'BOOL')
  }

  //update node coords when position changed
  function onNodePositionChange(nodeId, x, y) {
    console.log(x, y)
    updateNodeData(nodeId, 'fx', x)
    updateNodeData(nodeId, 'fy', y)
    Save()
  }

  //set active node on hover
  function onHoverNode(nodeId, node) {
    const previous = appData.ActiveNode
    setAppData(setDataState('ActiveNode', node.id, appData))
    const el = document.getElementById(node.id).firstChild
    el.style.transition = '0.25s'
    el.style.transform = 'translate(-33.3333px, -33.3333px) scale(1.5)'
    if (previous !== node.id) {
      const prev = document.getElementById(previous).firstChild
      prev.style.transform = 'translate(0px, 0px) scale(1)'
    }
  };

  //markdown content change handler
  function handleEditorChange(getText) {
    const newValue = getText();
    setMdValue(newValue)
    if (activeNode) {
      updateNodeData(activeNode.id, 'md', newValue)
    }
  }

  //context menu click handler
  function handleNodeRightClick(event) {
    event.preventDefault();
    setMouseX(event.clientX + 20)
    setMouseY(event.clientY)
  }

  //context menu close handler
  function handleContextMenuClose() {
    setMouseX(null)
    setMouseY(null)
  }

  async function uploadImage(file) {
    try {
      let ref = firebase.storage().ref().child(userData[0] ? userData.displayName : 'Nodemap' + '/' + file.name)
      let snap = await ref.put(file)
      if (snap)
        return await ref.getDownloadURL()
    }
    catch (e) {
      alert(e.message)
      return
    }
  }



  return (
    <UserManager.Provider value={{ userData, setUserData }}>
      <AppDataManager.Provider value={{ appData, setAppData }}>
        <div style={{ margin: 0, padding: 0 }} className='App'>
          <nav style={{ height: '5vh', background: '#F5F5F5', borderBottom: '1px solid #e5e5e5', display: 'flex', justifyContent: 'center', alignItems: 'center' }} className="App">
            <h2 style={{ cursor: 'pointer', position: 'relative', color: '#2b2b2b', display: 'flex', alignItems: 'center', fontWeight: 'lighter' }} onClick={() => setPopups(setPopupState('PlanSelector', true, popups))}>{props.plan}<ExpandMore id='planTitle'></ExpandMore></h2>
            {userData.displayName ?
              <Button style={{ background: '#ff6666', color: 'white', position: 'absolute', right: '1vh' }} onClick={logoutHandler}>Log out</Button>
              :
              props.demo ?
                <Button style={{ background: '#6930C3', color: 'white', position: 'absolute', right: '1vh' }} onClick={() => setPopups(setPopupState('Register', true, popups))}>Sign up</Button>
                :
                <Button style={{ background: '#6930C3', color: 'white', position: 'absolute', right: '1vh' }} onClick={() => setPopups(setPopupState('Register', true, popups))}>Log in</Button>
            }
          </nav>

          <PopupManager.Provider value={{ popups, setPopups }}>
            <RegisterModal></RegisterModal>
            {/* <Modal open={!appData.Data.nodes} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><CircularProgress style={{ width: '5vw', height: '5vw', outline: 'none' }}></CircularProgress></Modal> */}
            {appData.Data && appData.Data.nodes &&
              <>
                <div style={{ display: 'flex', height: '95vh' }} className="App">
                  <div style={{ height: '100%', position: 'relative', width: '30vw', borderRight: '1px solid #e5e5e5' }} spellCheck='false'>
                    <Editor
                      style={{ width: '100%', height: '100%', textAlign: 'left', background: '#FFF', borderRight: '1px solid #d2d3d4' }}
                      value={activeNode ? activeNode.md : 'test'}
                      defaultValue={activeNode ? activeNode.md : "# Hover over the start node for help with creating your plan #"}
                      onChange={handleEditorChange}
                      uploadImage={uploadImage}
                      embeds={[
                        {
                          title: "Google Doc",
                          keywords: "google docs gdocs",
                          defaultHidden: false,
                          matcher: href => href.match(/www.youtube.com\/embed\//i),
                          href: href => href,
                          component: Video
                        }
                      ]}
                    >
                    </Editor>
                  </div>
                  <div onContextMenu={(e) => handleNodeRightClick(e)} style={{ width: '70vw', position: 'relative', marginLeft: '10vh', cursor: 'grab', background: '#F7F6F3', backgroundImage: 'radial-gradient(#d2d2d2 1px, transparent 0)', backgroundSize: '1vw 1vw', backgroundPosition: '-0.5vw -0.5vw' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', position: 'absolute', top: '2vh', left: '2vh', }}>
                      <Button className='Analytics' id='Analytics' onMouseLeave={() => setPopups(setPopupState('Analytics', false, popups))} onClick={() => setPopups(setPopupState('Analytics', true, popups))}><Timeline fontSize='large' style={{}} ></Timeline><div className='inner' style={{ width: '0', overflow: 'hidden', opacity: 0 }}>Analytics</div></Button>
                      <Popper open={popups.Analytics} anchorEl={document.getElementById('Analytics')} placement='right-start' style={{ marginLeft: '1vh', width: 'auto', minWidth: '10vw', height: '10vw', background: 'white', borderRadius: '10px', border: '1px solid #e5e5e5' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <div>Imports</div>
                            <h1 style={{ fontWeight: 'lighter' }}>{downloads}</h1>
                          </div>
                        </div>
                      </Popper>
                    </div>
                    <Graph
                      id="graph_id"
                      data={appData.Data}
                      config={myConfig}
                      onClickNode={onClickNode}
                      onNodePositionChange={onNodePositionChange}
                      onMouseOverNode={onHoverNode}
                      onRightClickNode={(e) => { handleNodeRightClick(e) }}
                      style={{}}
                    ></Graph>
                    <Menu
                      keepMounted
                      open={mouseY !== null}
                      onClose={handleContextMenuClose}
                      anchorReference="anchorPosition"
                      anchorPosition={mouseY !== null && mouseX !== null ? { top: mouseY, left: mouseX } : undefined}>
                      <MenuItem onClick={() => { setPopups(setPopupState('AddNode', true, popups)); handleContextMenuClose() }}>Add node after active node</MenuItem>
                      <MenuItem onClick={() => { setIsEditing(true); setPopups(setPopupState('AddNode', true, popups)); handleContextMenuClose() }}>Edit active node</MenuItem>
                      {/* <MenuItem onClick={() => { DeleteNode(); handleContextMenuClose() }}>Delete active node</MenuItem> */}
                    </Menu>
                  </div>
                  <PlanSelector plans={plans} plan={props.plan} userID={props.userID}></PlanSelector>
                  <NewNodePopup editing={isEditing} EditNode={EditNode}></NewNodePopup>
                </div >
              </>
            }
          </PopupManager.Provider>
        </div>
      </AppDataManager.Provider>
    </UserManager.Provider>
  );
}

const Video = (props) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <iframe style={{ height: '32vh', padding: '0', margin: 0 }} title='video'
        src={props.attrs.href}
        allowfullscreen="allowfullscreen"
        mozallowfullscreen="mozallowfullscreen"
        msallowfullscreen="msallowfullscreen"
        oallowfullscreen="oallowfullscreen"
        webkitallowfullscreen="webkitallowfullscreen">
      </iframe>
    </div>
  )
}


export default App;
