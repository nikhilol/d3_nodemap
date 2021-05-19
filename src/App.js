import logo from './logo.svg';
import { Graph } from 'react-d3-graph'
import React, { useState, useEffect } from 'react'
import './App.css';

import MarkdownIt from 'markdown-it'
import marked from 'marked'
import MdEditor from 'react-markdown-editor-lite'
import 'react-markdown-editor-lite/lib/index.css';
import Editor from "rich-markdown-editor"

const axios = require('axios')
const d3 = require("d3");


const myConfig = {
  "automaticRearrangeAfterDropNode": false,
  "collapsible": false,
  "directed": false,
  "focusAnimationDuration": 0.75,
  "focusZoom": 1,
  "freezeAllDragEvents": false,
  "height": window.innerHeight - 10,
  "highlightDegree": 1,
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

function App() {

  const [data, setData] = useState(null)
  const [activeNode, setActiveNode] = useState(null)
  const [mdValue, setMdValue] = useState('')

  function getData() {
    return axios.get('https://us-central1-nodemap-app.cloudfunctions.net/api/plan/nodes?username=Demo&plan_id=Test').then(_d => _d.data)
  }

  useEffect(() => {
    let mounted = true;
    getData()
      .then(data => {
        console.log(data)
        let links = []
        for (var key in data) {

          console.log(key)

          data[key].id = data[key].ID;
          delete data[key].ID;

          data[key].x = data[key].x ? data[key].x :  100;
          data[key].y = data[key].y ? data[key].y : parseInt(key) * 150

          data[key].svg = `/Logos/${data[key].Platform}`
          if (!data[key].md) {
            data[key].md = `## ${data[key].Title} ${data[key].Platform} ##`
          }
          if (key > 0) {
            links.push({ source: data[key - 1].id, target: data[key].id, color: data[key].IsComplete ? '#72EFDD' : '#D2D2D2' })
          }

        }
        console.log(data)
        if (mounted) {
          console.log({ nodes: data })
          setData({ nodes: data, links: links })
        }
      })
    return () => mounted = false;
  }, [])

  const onClickNode = function (nodeId, node) {
    setActiveNode(node)
    setMdValue(node.md)
    console.log(node)
  };

  const handleEditorChange = ({ html, text }) => {
    const newValue = text.replace(/\d/g, "");
    console.log(newValue);
    setMdValue(newValue);
    updateNodeData(activeNode.id, 'md', newValue)
    activeNode.md = newValue
  }

  function updateNodeData(nodeId, property, newValue) {
    let temp = data
    for (let key in temp.nodes) {
      if (temp.nodes[key].id === nodeId) {
        temp.nodes[key][property] = newValue
      }
    }
    setData(temp)
  };

  function onNodePositionChange(node){
    updateNodeData(node.id, 'fx', node.x)
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background:'#F7F6F2' }} className="App">
      {data &&
        <>
          <div style={{height:'100vh'}}>
            <MdEditor
              style={{ height: "100%", width: '100%' }}
              renderHTML={(text) => marked(text)}
              onChange={handleEditorChange}
              value={mdValue}
            />

          </div>
          <div style={{ width: '60%' }}>
            <Graph
              id="graph_id"
              data={data}
              config={myConfig}
              onClickNode = {onClickNode}
              onNodePositionChange = {onNodePositionChange}
            />
          </div>
        </>
      }
    </div >
  );
}

export default App;
