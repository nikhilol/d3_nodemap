import logo from './logo.svg';
import { Graph } from 'react-d3-graph'
import React, { useState, useEffect } from 'react'
import './App.css';
import PlanSelector from './PlanSelector'

import 'react-markdown-editor-lite/lib/index.css';
import Editor from "rich-markdown-editor"

const axios = require('axios')
const marked = require('marked')

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
    "renderLabel": true,
    "size": 600,
    "strokeColor": "black",
    "strokeWidth": 1.5,
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
    "strokeWidth": 1.5,
    "markerHeight": 6,
    "markerWidth": 6,
    "strokeDasharray": 0,
    "strokeDashoffset": 0,
    "strokeLinecap": "butt"
  }
}

const userID = 'Nodemap';

function App(props) {

  const [data, setData] = useState({})
  const [plans, setPlans] = useState([])
  const [activeNode, setActiveNode] = useState(null)
  const [mdValue, setMdValue] = useState([])

  function getData() {
    return axios.get(`http://localhost:5001/nodemap-app/us-central1/api/plans/nodes?user=${props.userID}&title=${props.plan}`).then(_d => _d.data)
  }

  function getPlans() {
    return axios.get(`http://localhost:5001/nodemap-app/us-central1/api/plans?user=${userID}`).then(_d => _d.data)
  }

  //save
  useEffect(() => {
    if(data.nodes.length){
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

  //get plans
  useEffect(() => {
    let mounted = true;
    getPlans().then(plans => {
      console.log(plans)
      setPlans(plans)
    })
    getData()
      .then(data => {
        console.log(data)
        // let links = []
        // for (var key in data) {

        //   console.log(key)

        //   data[key].id = data[key].ID;
        //   delete data[key].ID;

        //   data[key].x = data[key].x ? data[key].x : window.innerWidth * 0.3;
        //   data[key].y = data[key].y ? data[key].y : window.innerHeight * 0.1 + parseInt(key) * 150

        //   data[key].svg = `/Logos/${data[key].Platform}`
        //   if (!data[key].md) {
        //     data[key].md = `### ${data[key].Platform} ### \n # ${data[key].Title} # \n --- `
        //   } else {

        //   }
        //   if (key > 0) {
        //     links.push({ source: data[key - 1].id, target: data[key].id, color: data[key].IsComplete ? '#72EFDD' : '#D2D2D2' })
        //   }

        // }
        // console.log(data)
        if (mounted) {
          setData(data.nodes)
        }
      })
    return () => mounted = false;
  }, [props])


  function Save(){
    console.log('RUNNING SAVE FUNCTION')
    axios({
      method: 'post',
      url: `http://localhost:5001/nodemap-app/us-central1/api/plans/update?user=${props.userID}&title=${props.plan}`,
      data: data
    }).then(res=>{
      console.log(res.data);
      console.log('THAT WAS THE SAVE FUNCTION')
    });
  }

  async function configureLinks() {
    let temp = data;
    temp.links = []
    for (var key in temp.nodes) {
      if (key > 0) {
        temp.links.push({ source: temp.nodes[key - 1].id, target: temp.nodes[key].id, color: temp.nodes[key].IsComplete ? '#72EFDD' : '#D2D2D2' })
      }
    }
    await setData({ nodes: temp.nodes, links: temp.links })
  }

  const onDblClickNode = function (nodeId, node) {
    setActiveNode(node)
    setMdValue(node.md)
    console.log(node)
  };

  function handleEditorChange(getText) {
    const newValue = getText();
    setMdValue(newValue)
    if (activeNode) {
      updateNodeData(activeNode ? activeNode.id : null, 'md', newValue)
      // activeNode.md = newValue
    }
  }

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

  function onNodePositionChange(node) {
    // updateNodeData(node, 'fx', node.x)
  }

  function onClickNode(node) {
    console.log(node)
    updateNodeData(node, 'IsComplete', 'BOOL')
    configureLinks()
  }

  return (
    <>
      <nav style={{ height: '5vh', background: '#2b2b2b', display: 'flex', justifyContent: 'center', alignItems:'center' }}>
        <PlanSelector plans={plans} plan={props.plan} userID={userID}></PlanSelector>
      </nav>
      <div style={{ display: 'flex', height: 'auto', background: '#F7F6F2' }} className="App">
        {data &&
          <>
            <div style={{ height: '95vh', position: 'relative' }}>
              <Editor
                style={{ minWidth: '30vw', maxWidth: '30vw', minHeight: '100%', maxHeight: '100%', textAlign: 'left', background: '#FFF', borderRight: '1px solid #d2d3d4' }}
                value={activeNode ? activeNode.md : "t"}
                defaultValue={activeNode ? activeNode.md : ""}
                onChange={handleEditorChange}>
              </Editor>
            </div>
            <div style={{ width: '60vw', minWidth: '60vw' }}>
              <Graph
                id="graph_id"
                data={data}
                config={myConfig}
                onClickNode={onClickNode}
                onNodePositionChange={onNodePositionChange}
                onMouseOverNode={onDblClickNode}
              />
            </div>
          </>
        }
      </div >
      
    </>
  );
}

export default App;
