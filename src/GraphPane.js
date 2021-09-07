import React, { useContext } from "react";
import { Graph } from "react-d3-graph";
import { AppDataManager, setMultiDataState } from "./AppDataManager";

export default function GraphPane(props) {
	const { appData, setAppData } = useContext(AppDataManager);

	//node completion handler
	function onClickNode(node) {
		console.log(node);
		props.updateNodeData(node, "IsComplete", "BOOL");
	}

	//update node coords when position changed
	function onNodePositionChange(nodeId, x, y) {
		props.updateNodeData(nodeId, "fx", x);
		props.updateNodeData(nodeId, "fy", y);
		props.Save();
	}

	//set active node on hover
	function onHoverNode(nodeId, node) {
		const previous = appData.ActiveNode;
		setAppData(setMultiDataState({ ActiveNode: node, MdValue: node.md }, appData));
		const el = document.getElementById(node.id).firstChild;
		el.style.transition = "0.25s";
		el.style.transform = "translate(-33.3333px, -33.3333px) scale(1.5)";
		if (previous.id !== node.id) {
			const prev = document.getElementById(previous.id).firstChild;
			prev.style.transform = "translate(0px, 0px) scale(1)";
		}
		console.log(appData.Data);
	}

	return (
		<Graph
			id="graph_id"
			data={appData.Data}
			config={myConfig}
			onClickNode={onClickNode}
			onNodePositionChange={onNodePositionChange}
			onMouseOverNode={onHoverNode}
			style={{}}
		></Graph>
	);
}

//Config
const myConfig = {
	automaticRearrangeAfterDropNode: false,
	collapsible: false,
	directed: false,
	focusAnimationDuration: 0.75,
	focusZoom: 1,
	freezeAllDragEvents: false,
	height: window.innerHeight * 0.94,
	highlightDegree: 0,
	highlightOpacity: 1,
	linkHighlightBehavior: false,
	maxZoom: 8,
	minZoom: 0.1,
	nodeHighlightBehavior: false,
	panAndZoom: false,
	staticGraph: false,
	staticGraphWithDragAndDrop: true,
	width: window.innerWidth * 0.7,
	d3: {
		alphaTarget: 0.05,
		gravity: -100,
		linkLength: 100,
		linkStrength: 1,
		disableLinkForce: true,
	},
	node: {
		color: "#d3d3d3",
		fontColor: "black",
		fontSize: 24,
		fontWeight: "bold",
		highlightColor: "green",
		highlightFontSize: 36,
		highlightFontWeight: "normal",
		highlightStrokeColor: "green",
		highlightStrokeWidth: "20",
		labelProperty: "Title",
		mouseCursor: "pointer",
		opacity: 1,
		renderLabel: false,
		size: 1000,
		strokeColor: "#000000",
		strokeWidth: 500,
		symbolType: "circle",
	},
	link: {
		fontColor: "black",
		fontSize: 24,
		fontWeight: "normal",
		highlightColor: "SAME",
		highlightFontSize: 36,
		highlightFontWeight: "normal",
		labelProperty: "label",
		mouseCursor: "auto",
		opacity: 1,
		renderLabel: false,
		semanticStrokeWidth: false,
		strokeWidth: 10,
		markerHeight: 6,
		markerWidth: 6,
		strokeDasharray: 0,
		strokeDashoffset: 0,
		strokeLinecap: "butt",
	},
};
