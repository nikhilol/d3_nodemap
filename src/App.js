/* eslint-disable react-hooks/exhaustive-deps */
import './App.css';
import PlanSelector from './PlanSelector'
import logo from './logo.svg';
import NewPlanPopup from './NewPlanPopup'

import React, { useState, useEffect } from 'react'
import { Graph } from 'react-d3-graph'
import { Menu, MenuItem } from '@material-ui/core'
import 'react-markdown-editor-lite/lib/index.css';
import Editor from "rich-markdown-editor"
const axios = require('axios')

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
  "highlightDegree": 1,
  "highlightOpacity": 1,
  "linkHighlightBehavior": false,
  "maxZoom": 8,
  "minZoom": 0.1,
  "nodeHighlightBehavior": false,
  "panAndZoom": false,
  "staticGraph": false,
  "staticGraphWithDragAndDrop": true,
  "width": window.innerWidth * 0.6,
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
    "highlightColor": "SAME",
    "highlightFontSize": 36,
    "highlightFontWeight": "normal",
    "highlightStrokeColor": "SAME",
    "highlightStrokeWidth": "SAME",
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
    "mouseCursor": "pointer",
    "opacity": 1,
    "renderLabel": false,
    "semanticStrokeWidth": false,
    "strokeWidth": 6,
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

  //helpers top get nodes in a plan
  function getData() {
    if (reset) {
      return axios.get(`https://us-central1-nodemap-app.cloudfunctions.net/api/plan/nodes/?username=${props.userID}&plan_id=${props.plan}`).then(_d => _d.data)
    } else {
      return axios.get(`http://localhost:5001/nodemap-app/us-central1/api/plans/nodes?user=${props.userID}&title=${props.plan}`).then(_d => _d.data)
    }
  }

  //helper to get plan IDs
  function getPlans() {
    return axios.get(`http://localhost:5001/nodemap-app/us-central1/api/plans?user=${props.userID}`).then(_d => _d.data)
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
    if (data) {
      console.log('RUNNING SAVE FUNCTION')
      axios({
        method: 'post',
        url: `http://localhost:5001/nodemap-app/us-central1/api/plans/update?user=${props.userID}&title=${props.plan}`,
        data: data
      }).then(res => {
        console.log(res.data);
        console.log('THAT WAS THE SAVE FUNCTION')
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

          console.log(temp.nodes[key].fy, temp.nodes[key-1].y + 200, temp.nodes[key].fx, temp.nodes[key-1].x)

          if (temp.nodes[key+1] && (temp.nodes[key + 1].y === temp.nodes[key-1].y + 200 && temp.nodes[key + 1].x === temp.nodes[key-1].x)) {
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

          temp.nodes[key].Platform = platform.replace('.png', '')
          temp.nodes[key].svg = `/Logos/${platform}`
          temp.nodes[key].md = `### ${platform.replace('.png', '')} ### \n # ${title} # \n --- `

          temp.links.push({ source: temp.nodes[key - 1].id, target: temp.nodes[key].id, color: '#D2D2D2' })
        }
      })
    }
    Save();
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

  return (
    <>
      <nav style={{ height: '5vh', background: '#2b2b2b', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <PlanSelector plans={plans} plan={props.plan} userID={props.userID}></PlanSelector>
      </nav>
      <div style={{ display: 'flex', height: 'auto', background: '#F7F6F2' }} className="App">
        {data &&
          <>
            <div style={{ height: '95vh', position: 'relative' }}>
              <Editor
                style={{ minWidth: '30vw', maxWidth: '30vw', minHeight: '100%', maxHeight: '100%', textAlign: 'left', background: '#FFF', borderRight: '1px solid #d2d3d4' }}
                value={activeNode ? activeNode.md : ""}
                defaultValue={activeNode ? activeNode.md : ""}
                onChange={handleEditorChange}>
              </Editor>
            </div>
            <div onContextMenu={(e) => handleNodeRightClick(e)} style={{ width: '60vw', minWidth: '60vw' }}>
              <Graph
                id="graph_id"
                data={data}
                config={myConfig}
                onClickNode={onClickNode}
                onNodePositionChange={onNodePositionChange}
                onMouseOverNode={onHoverNode}
                onRightClickNode={(e) => { handleNodeRightClick(e) }}
              ></Graph>
              <Menu
                keepMounted
                open={mouseY !== null}
                onClose={handleContextMenuClose}
                anchorReference="anchorPosition"
                anchorPosition={mouseY !== null && mouseX !== null ? { top: mouseY, left: mouseX } : undefined}>
                <MenuItem onClick={() => { setOpenAddNodeWindow(true); handleContextMenuClose() }}>Add node after active node</MenuItem>
                <MenuItem onClick={() => { handleContextMenuClose()}}>Edit active node</MenuItem>
                <MenuItem onClick={() => { DeleteNode(); handleContextMenuClose() }}>Delete active node</MenuItem>
              </Menu>
            </div>
          </>
        }
        <NewPlanPopup open={openAddNodeWindow} close={()=>setOpenAddNodeWindow(false)} addNode={AddNode}></NewPlanPopup>
      </div >

    </>
  );
}

export default App;
