/* eslint-disable react-hooks/exhaustive-deps */
import './App.css';
import PlanSelector from './PlanSelector'
import logo from './logo.svg';
import NewNodePopup from './NewNodePopup'
import RESOURCES from './Resources/resources'

import React, { useState, useEffect } from 'react'
import { Graph } from 'react-d3-graph'
import { Menu, MenuItem, Button } from '@material-ui/core'
import { EmojiObjects, ExpandMore } from '@material-ui/icons'
import 'react-markdown-editor-lite/lib/index.css';
import Editor from "rich-markdown-editor"
const axios = require('axios')
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

  const [data, setData] = useState({})
  const [plans, setPlans] = useState([])
  const [activeNode, setActiveNode] = useState(null)
  const [mdValue, setMdValue] = useState([])
  const [mouseX, setMouseX] = useState(null)
  const [mouseY, setMouseY] = useState(null)
  const [openAddNodeWindow, setOpenAddNodeWindow] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [openPlanSelector, setOpenPlanSelector] = useState(false)
  const [user, setUser] = useState(null)

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      setUser(user)
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
  function getData() {
    if (reset) {
      return axios.get(`https://us-central1-nodemap-app.cloudfunctions.net/api/plan/nodes/?username=${props.userID}&plan_id=${props.plan}`).then(_d => _d.data)
    } else {
      return axios.get(`${RESOURCES.apiURL}/plans/nodes?user=${props.userID}&title=${props.plan}`).then(_d => _d.data)
    }
  }

  //helper to get plan IDs
  function getPlans() {
    return axios.get(`${RESOURCES.apiURL}/plans?user=${props.userID}`).then(_d => _d.data)
  }

  //save when data changes
  useEffect(() => {
    console.log('NODES', data.nodes)
    if (data.nodes.length) {
      Save();
    }
  }, [data])

  //markdown timeout
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      console.log(mdValue)
      Save();
    }, 2000)

    return () => clearTimeout(delayDebounceFn)
  }, [mdValue])

  //get nodes and links data
  useEffect(() => {
    let mounted = true;
    getPlans().then(plans => {
      console.log(plans)
      if (props.userID && !props.plan && plans.length) {
        window.location.assign(`/plan/${props.userID}/${plans[0]}`)
      }
      setPlans(plans)
    })
    getData()
      .then(data => {
        if (reset) {
          console.log(data)
          var links = []
          for (var key in data) {

            data[key].id = data[key].ID;
            delete data[key].ID;

            data[key].x = data[key].x ? data[key].x : window.innerWidth * 0.3;
            data[key].y = data[key].y ? data[key].y : window.innerHeight * 0.1 + parseInt(key) * 200

            data[key].svg = `/Logos/${data[key].Platform}`
            if (!data[key].md) {
              data[key].md = `### ${data[key].Platform} ### \n # ${data[key].Title} # \n --- `
            } else {

            }
            if (key > 0) {
              links.push({ source: data[key - 1].id, target: data[key].id, color: data[key].IsComplete ? '#72EFDD' : '#D2D2D2' })
            }

          }
          console.log(data)
        }
        if (mounted) {
          if (reset) {
            setData({ nodes: data, links: links })
          } else {
            setData(data.nodes)
            setActiveNode(data.nodes.nodes[0])
          }
        }
      })
    return () => mounted = false;
  }, [props])

  //set up links between nodes (NOT NEEDED UNLESS RESET IS REQUIRED)
  async function configureLinks() {
    let temp = data;
    for (var key in temp.nodes) {
      if (key > 0) {
        // temp.links.push({ source: temp.nodes[key - 1].id, target: temp.nodes[key].id, color: temp.nodes[key].IsComplete ? '#72EFDD' : '#D2D2D2' })
        updateLinkData(null, temp.nodes[key].id, 'color', temp.nodes[key].IsComplete ? '#72EFDD' : '#D2D2D2')
      }
    }
    await setData({ nodes: temp.nodes, links: temp.links })
  }

  //update a node property helper function
  function updateNodeData(nodeId, property, newValue) {
    let temp = data
    for (let key in temp.nodes) {
      if (temp.nodes[key].id === nodeId) {
        temp.nodes[key][property] = newValue === 'BOOL' ? !temp.nodes[key][property] : newValue
        console.log(`Updating ${nodeId}'s property ${property} to ${newValue}`)
      }
    }
    setData(temp)
    console.log(temp)
  };

  //update a link property helper function
  function updateLinkData(source, target, property, newValue) {
    let temp = data
    if (source && target) {
      for (let index in temp.links) {
        if (temp.links[index].source === source && temp.links[index].target === target) {
          temp.links[index][property] = newValue;
        }
      }
    } else if (!source && target) {
      for (let index in temp.links) {
        if (temp.links[index].target === target) {
          temp.links[index][property] = newValue;
        }
      }
    }
    setData(temp)
  };

  //save plan data to firebase
  function Save() {
    if (data && !props.demo) {
      axios({
        method: 'post',
        url: `${RESOURCES.apiURL}/plans/update?user=${props.userID}&title=${props.plan}`,
        data: data
      }).then(res => {
        console.log(res.data);
      });
    }
  }

  //Add node to plan
  function AddNode(platform, title) {
    console.log(title)
    if (activeNode) {
      data.nodes.forEach(node => {
        if (node.id === activeNode.id) {
          console.log('about to run')
          let temp = data;
          let key = data.nodes.indexOf(node) + 1;
          console.log(key)

          temp.nodes.splice(key, 0, {})

          temp.nodes[key].id = generateRandomID();

          console.log(temp.nodes[key].fy, temp.nodes[key - 1].y + 200, temp.nodes[key].fx, temp.nodes[key - 1].x)

          if (temp.nodes[key + 1] && (temp.nodes[key + 1].y === temp.nodes[key - 1].y + 200 && temp.nodes[key + 1].x === temp.nodes[key - 1].x)) {
            temp.nodes[key].fx = temp.nodes[key - 1].fx ? temp.nodes[key - 1].fx + 200 : temp.nodes[key - 1].x + 200;
            temp.nodes[key].fy = temp.nodes[key - 1].fy ? temp.nodes[key - 1].fy : temp.nodes[key - 1].y;
            temp.nodes[key].x = temp.nodes[key - 1].fx ? temp.nodes[key - 1].fx + 200 : temp.nodes[key - 1].x + 200;
            temp.nodes[key].y = temp.nodes[key - 1].fy ? temp.nodes[key - 1].fy : temp.nodes[key - 1].y;
          }
          else {
            temp.nodes[key].fx = temp.nodes[key - 1].fx ? temp.nodes[key - 1].fx : temp.nodes[key - 1].x;
            temp.nodes[key].fy = temp.nodes[key - 1].fy ? temp.nodes[key - 1].fy + 200 : temp.nodes[key - 1].y + 200;
            temp.nodes[key].x = temp.nodes[key - 1].fx ? temp.nodes[key - 1].fx : temp.nodes[key - 1].x;
            temp.nodes[key].y = temp.nodes[key - 1].fy ? temp.nodes[key - 1].fy + 200 : temp.nodes[key - 1].y + 200;
          }

          temp.nodes[key].Platform = platform.split(0, -4)
          temp.nodes[key].svg = `/Logos/${platform}`
          temp.nodes[key].md = `### ${platform.replace('.png', '')} ### \n # ${title} # \n --- `

          temp.links.push({ source: temp.nodes[key - 1].id, target: temp.nodes[key].id, color: '#D2D2D2' })

          setData({ nodes: temp.nodes, links: temp.links })
        }
      })
    }
  }

  function generateRandomID() {
    var randomString = ""
    var alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for (let c = 0; c < 20; c++) {
      randomString += alphabet.charAt(Math.floor(Math.random() * alphabet.length))
    }
    return randomString
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
    updateNodeData(activeNode.id, 'Platform', platform)
    updateNodeData(activeNode.id, 'svg', '/Logos/' + platform)
  }

  //node completion handler
  function onClickNode(node) {
    console.log(node)
    updateNodeData(node, 'IsComplete', 'BOOL')
    configureLinks()
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
    setActiveNode(node)
    console.log(node)
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
      let ref = firebase.storage().ref().child(user ? user.displayName : 'Nodemap' + '/' + file.name)
      let snap = await ref.put(file)
      if(snap)
      return await ref.getDownloadURL()
    }
    catch (e) {
      alert(e.message)
      return
    }
  }

  return (
    <div style={{ margin: 0, padding: 0 }} className='App'>
      <nav style={{ height: '5vh', background: '#2b2b2b', display: 'flex', justifyContent: 'center', alignItems: 'center' }} className="App">
        <h2 style={{ cursor: 'pointer', position: 'relative', color: 'white', display: 'flex', alignItems: 'center', fontWeight: 'lighter' }} onClick={() => setOpenPlanSelector(true)}>{props.plan}<ExpandMore id='planTitle'></ExpandMore></h2>
        <Button style={{ background: '#ff6666', color: 'white', position: 'absolute', right: '1vh' }} onClick={logoutHandler}>Log out</Button>
      </nav>
      {data &&
        <>
          <div style={{ display: 'flex', height: '95vh' }} className="App">
            <div style={{ height: '100%', position: 'relative', width: '30vw' }} spellCheck='false'>
              <Editor
                style={{ width: '100%', height: '100%', textAlign: 'left', background: '#FFF', borderRight: '1px solid #d2d3d4' }}
                value={activeNode ? activeNode.md : 'test'}
                defaultValue={activeNode ? activeNode.md : "# Hover over the start node for help with creating your plan #"}
                onChange={handleEditorChange}
                uploadImage={uploadImage}
              >
              </Editor>
            </div>
            <div onContextMenu={(e) => handleNodeRightClick(e)} style={{ width: '70vw', position: 'relative', marginLeft: '10vh', cursor: 'grab', background: '#F7F6F2', backgroundImage: 'radial-gradient(#d2d2d2 1px, transparent 0)', backgroundSize: '1vw 1vw', backgroundPosition: '-0.5vw -0.5vw' }}>
              <Graph
                id="graph_id"
                data={data}
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
                <MenuItem onClick={() => { setOpenAddNodeWindow(true); handleContextMenuClose() }}>Add node after active node</MenuItem>
                <MenuItem onClick={() => { setIsEditing(true); setOpenAddNodeWindow(true); handleContextMenuClose() }}>Edit active node</MenuItem>
                <MenuItem onClick={() => { DeleteNode(); handleContextMenuClose() }}>Delete active node</MenuItem>
              </Menu>
            </div>
            <PlanSelector plans={plans} plan={props.plan} userID={props.userID} open={openPlanSelector} close={() => setOpenPlanSelector(false)}></PlanSelector>
            <NewNodePopup open={openAddNodeWindow} close={() => { setOpenAddNodeWindow(false); setIsEditing(false) }} addNode={AddNode} editing={isEditing} EditNode={EditNode}></NewNodePopup>
          </div >
        </>
      }
    </div>
  );
}

export default App;
