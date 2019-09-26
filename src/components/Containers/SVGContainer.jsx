import React, { Component } from 'react'
import ReactSVG from 'react-inlinesvg';

// import _ from 'lodash';
import { drawShortestPath, } from "../../helpers";
import { drawEdge, highLightNodeEl, removeShortestPathEl } from "../../shared"
import CombinedCtxProvider, { CombinedContext } from '../../contexts/combined.context';

// import { isFulfilled } from 'q';
class SVGContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listIdOfMap: [],
            listSvgArrState: [],
            vertex1State: "",
            vertex2State: "",
            numDeleted: 0
        }
    }
    static contextType = CombinedContext;

    handleSVG = async (src, hasCache) => {
        try {
            const { startIndex, isLoading, listSVGArray } = this.context;
            let index = startIndex;
            let listsvg = document.getElementsByTagName("svg");
            let notFinishLoad = listsvg.length < listSVGArray.length;
            if (notFinishLoad === true) {
                return;
            }
            if (isLoading === false) {
                for (let i = 0; i < listSVGArray.length; i++) {
                    let floorId = listsvg[i].getElementById("background").parentElement.attributes.id.value;
                    let nodes = listsvg[i].getElementById("node");
                    if (nodes) {
                        listsvg[i].setAttribute("id", `svg-${floorId}`);
                        this.createNode_Pathline(listsvg[i], floorId);
                        this.addClickEventForCircle(floorId);
                    }
                }
                return;
            }
            for (let i = index - this.state.numDeleted; i < listSVGArray.length; i++) {
                let floorId = listsvg[i].getElementById("background").parentElement.attributes.id.value;
                listsvg[i].setAttribute("id", `svg-${floorId}`);
                this.createNode_Pathline(listsvg[i], floorId);
                this.addClickEventForCircle(floorId);
                this.addEventMouse();
                this.addMenuForMap(floorId);
                await this.setStateAsync({ listIdOfMap: [...this.state.listIdOfMap, floorId] });
            }
            const circlesYAH = document.querySelectorAll("circle[id*='YAH']");
            circlesYAH.forEach(circleNode => {
                const floorId = circleNode.id.substring(0, 2);
                this.addClickEventForCirclesYAH(circleNode, floorId);
            });
        } catch (error) {
            console.log("handleSVG failed:", error);
        }
    }
    addClickEventForCirclesYAH = (YAHNode, floorId) => {
        YAHNode.addEventListener("click", e => {
            this.handleMouseClick(e, floorId);
        });
        YAHNode.setAttribute("style", "cursor: pointer;");
    }
    addClickEventForCircle = (floorId) => {
        let svg = document.getElementById(`node-${floorId}`);
        const vertices = svg.getElementsByTagName("circle");
        for (let i = 0; i < vertices.length; i++) {
            vertices[i].addEventListener("click", e => {
                this.handleMouseClick(e, floorId);
            });
        }
    };
    addEventMouse = () => {
        const nodes = document.querySelectorAll("circle");
        nodes.forEach(node => {
            node.addEventListener("mouseover", e => {
                if (!e.target.id.includes("PATH")) {
                    this.showNodeInfo(e.target);
                    // highLightNodeEl(e.target.id, 500, false);
                }
            });
            node.addEventListener("mouseout", e => {
                if (!e.target.id.includes("PATH"))
                    this.hideNodeInfo(e.target);
            });
        });
    }
    showNodeInfo = (node) => {
        try {
            let tooltip = document.createElementNS("http://www.w3.org/2000/svg", "text");
            tooltip.setAttributeNS(null, "x", node.attributes.cx.value - 40);
            tooltip.setAttributeNS(null, "y", node.attributes.cy.value - 15);
            tooltip.setAttributeNS(null, "fill", "black");
            // console.log(tooltip);
            tooltip.innerHTML = node.id
            node.parentElement.appendChild(tooltip);
        } catch (error) {
            console.log("showNodeInfo failed:", error);
        }
    }
    hideNodeInfo = (node) => {
        try {
            let nodeEl = document.getElementById(node.id);
            nodeEl.parentElement.removeChild(nodeEl.parentElement.lastChild);
        } catch (error) {
            console.log("hideNodeInfo failed:", error);
        }
    }
    addMenuForMap = (floorId) => {
        let divMenuOfMap = document.createElement("div");
        divMenuOfMap.setAttribute("class", "menuOfMap");
        document.getElementsByClassName("svg-container")[0].appendChild(divMenuOfMap);
        let radio = document.createElement("input");
        radio.setAttribute("type", "radio");
        radio.setAttribute("name", "radioGroup");
        radio.setAttribute("id", `radio-${floorId}`);
        radio.addEventListener("change", () => { this.scrollMap(floorId) });
        let nameOfMap = document.createElement("span");
        nameOfMap.innerHTML = `${floorId}`;
        let button = document.createElement("button");
        button.addEventListener("click", () => { this.DeleteMap(floorId) });
        button.textContent = "Delete";
        let space = document.createElement("span");
        space.innerText = `     `;
        divMenuOfMap.appendChild(radio);
        divMenuOfMap.appendChild(nameOfMap);
        divMenuOfMap.appendChild(button);
        divMenuOfMap.appendChild(space);
    }
    createNode_Pathline = (svgElement, floorId) => {
        let node_pathline = document.createElementNS("http://www.w3.org/2000/svg", "g");
        node_pathline.setAttributeNS(null, "id", `node-pathline-${floorId}`);
        let nodes = svgElement.getElementById("node");
        if (!nodes) {
            alert("No nodes found");
            return;
        }
        nodes.setAttribute("id", `node-${floorId}`);
        nodes.parentElement.appendChild(node_pathline);
        let node_pathline_clone = node_pathline.cloneNode(true);
        let nodes_clone = nodes.cloneNode(true);
        nodes.replaceWith(node_pathline_clone);
        node_pathline.replaceWith(nodes_clone);
    }
    deleteEgdes = async (edge, vertex1Id, vertex2Id) => {
        const { feature, removeRelationship } = this.context;
        if (feature === "delete" && typeof edge !== "string") {
            edge.parentElement.removeChild(edge);
        }
        else if (typeof edge === "string") {
            const edgeId = edge;
            let edgeEl = document.getElementById(edgeId);
            if (!edgeEl) {
                const tryEdgeId = edgeId.split(':').reverse().join(':');
                edgeEl = document.getElementById(tryEdgeId);
            }
            edgeEl.parentElement.removeChild(edgeEl);
        }
        await removeRelationship(vertex1Id, vertex2Id);
    };
    /*XỬ LÍ SỰ KIÊN KHI CLICK TRÊN SVG, DRAW EGDE- DRAW SHORTEST PATH */
    handleMouseClick(e, floorId) {
        const {
            addVertexToGraphs, feature,
            vertex1, vertex2,
            route, setShortestPath,
            setVertex
        } = this.context;
        const clickTarget = e.target;
        if (feature === "draw") {
            if (clickTarget.nodeName === "circle") {
                if (!this.isDrawingEdge) {
                    this.setState({ edgeVertex1: clickTarget });
                    this.isDrawingEdge = true;
                } else if (clickTarget !== this.state.edgeVertex1) {
                    this.setState({ edgeVertex2: clickTarget });
                    drawEdge(this.state.edgeVertex1, this.state.edgeVertex2, floorId, this.deleteEgdes, addVertexToGraphs);
                    this.setState({ edgeVertex1: null, edgeVertex2: null });
                    this.isDrawingEdge = false;
                }
            }
        } else if (feature === "find") {
            if (document.getElementsByClassName("animation-path").length !== 0) {
                if (this.state.vertex1State === "" || this.state.vertex2State === "") {
                    removeShortestPathEl(vertex1, vertex2);
                }
                else if (this.state.vertex1State !== "" && this.state.vertex2State !== "") {
                    removeShortestPathEl(this.state.vertex1State, this.state.vertex2State);
                }
            }
            if (!this.isFindingPath) {
                document.getElementById("first-vertex").value = e.target.id;
                this.setState({ vertex1State: e.target.id });
                this.isFindingPath = true;
            } else {

                if (e.target.id === this.state.vertex1State) {
                    alert("Vertex cannot connect it self or loaded this map more than one time");
                    this.setState({ vertex1State: "", vertex2State: "" });
                    this.isFindingPath = false;
                    return;
                }
                document.getElementById("second-vertex").value = e.target.id;
                this.setState({ vertex2State: e.target.id });
                setVertex({ vertex1: this.state.vertex1State, vertex2: this.state.vertex2State });
                let pathArrData = drawShortestPath(this.state.vertex1State, this.state.vertex2State, route);
                setShortestPath(pathArrData);
                this.isFindingPath = false;
            }
        }
    }
    /*MENU CHO MAP KHI LOAD MAP LÊN */
    DeleteMap = (floorId) => {
        const { AdjustNumberOfMap } = this.context;
        let radioElement = document.getElementById(`radio-${floorId}`);
        document.getElementsByClassName("svg-container")[0].removeChild(radioElement.parentElement);
        let deleteFileIndex;
        const { listIdOfMap } = this.state;
        for (let i = 0; i < listIdOfMap.length; i++) {
            if (listIdOfMap[i] === floorId) {
                deleteFileIndex = i;
                break;
            }
        }
        var cloneState = [...listIdOfMap];
        cloneState.splice(deleteFileIndex, 1);
        this.setState({ listIdOfMap: cloneState });
        this.setState({ numDeleted: this.state.numDeleted + 1 })
        AdjustNumberOfMap(deleteFileIndex);

    }
    scrollMap = (floorId) => {
        let svg = document.getElementById(`svg-${floorId}`);
        svg.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }
    setStateAsync(state) {
        return new Promise((resolve) => {
            this.setState(state, resolve)
        });
    }
    shouldComponentUpdate(nextProps, nextState) {
        return this.state.listSvgArrState !== nextState.listSvgArrState;
    }
    render() {
        console.log("SVGContainer");
        const { listSVGArray } = this.context;
        return (
            <div id="list-svg">
                {listSVGArray ? listSVGArray.map((value, i) => (
                    <ReactSVG
                        key={`svg-${i}`}
                        src={value}
                        onLoad={(src, hasCache) => this.handleSVG(src, hasCache)}
                        preProcessor={code => code}
                        cacheRequests={false}
                    />
                )) : null}
            </div>
        )
    }
}
const WrappedSVGContainer = props => {
    return (
        <CombinedCtxProvider>
            <SVGContainer {...props} />
        </CombinedCtxProvider>
    )
}
export default WrappedSVGContainer