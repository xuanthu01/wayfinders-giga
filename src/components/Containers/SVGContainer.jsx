import React, { Component } from 'react'
import ReactSVG from 'react-inlinesvg';
import _ from "lodash";
import { drawShortestPath, } from "../../helpers";
import { drawEdge, removeShortestPathEl, showNodes, removeEdgeElement, createNode_Pathline, addEventMouse } from "../../shared"
import CombinedCTXProvider, { CombinedContext } from '../../contexts/combined.context';
const SVGElement = React.memo(({ listSVGArray, handleSVG }) => {
    console.log("SVGElement render");
    return (
        <div id="list-svg">
            {listSVGArray ? listSVGArray.map((value, i) => (
                <ReactSVG
                    key={`svg-${i}`}
                    src={value}
                    loader={() => <p>Loading</p>}
                    onLoad={(src, hasCache) => handleSVG(src, hasCache)}
                    preProcessor={code => code}
                    cacheRequests={false}
                />
            )) : null}
        </div>
    )
})
class SVGContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listIdOfMap: [],
            vertex1State: "",
            vertex2State: "",
            numDeleted: 0,
        }
    }
    static contextType = CombinedContext;

    handleSVG = async (src, hasCache) => {
        try {
            const { startIndex, isLoading, listSVGArray, setWaiting, waitForLoading } = this.context;
            let index = startIndex;
            let listsvg = document.getElementsByTagName("svg");
            let notFinishLoad = listsvg.length < listSVGArray.length;
            if (notFinishLoad === true) {
                if (waitForLoading === true)
                    return;
                setWaiting(true);
                document.getElementById("loadGraph").setAttribute("disabled", true);
                return;
            }

            if (isLoading === false) {
                for (let i = 0; i < listSVGArray.length; i++) {
                    let floorId = listsvg[i].getElementById("background").parentElement.attributes.id.value;
                    let nodes = listsvg[i].getElementById("node");
                    if (nodes) {
                        listsvg[i].setAttribute("id", `svg-${floorId}`);
                        createNode_Pathline(listsvg[i], floorId);
                        this.addClickEventForCircle(floorId);
                        showNodes();
                        // console.log(listsvg[i].getElementById(`node-pathline-${floorId}`).childNodes.length );
                        if (listsvg[i].getElementById(`node-pathline-${floorId}`).childNodes.length === 0)
                            this.drawEdgeFromGraphs(false, floorId);
                        document.getElementById("loadGraph").removeAttribute("disabled");
                        setWaiting(false);
                    }
                }
                return;
            }
            for (let i = index - this.state.numDeleted; i < listSVGArray.length; i++) {
                let floorId = listsvg[i].getElementById("background").parentElement.attributes.id.value;
                listsvg[i].setAttribute("id", `svg-${floorId}`);
                createNode_Pathline(listsvg[i], floorId);
                this.addClickEventForCircle(floorId);
                addEventMouse();
                this.addMenuForMap(floorId);
                await this.setStateAsync({ listIdOfMap: [...this.state.listIdOfMap, floorId] });
            }
            const circlesYAH = document.querySelectorAll("circle[id*='YAH']");
            circlesYAH.forEach(circleNode => {
                const floorId = circleNode.id.substring(0, 2);
                this.addClickEventForCirclesYAH(circleNode, floorId);
            });
            document.getElementById("loadGraph").removeAttribute("disabled");
            showNodes();
            this.drawEdgeFromGraphs(false, undefined);
            setWaiting(false);
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
    /*MENU CHO MAP KHI LOAD MAP LÊN */
    DeleteMap = (floorId) => {
        try {
            const { AdjustNumberOfMap, setDrawedEdge } = this.context;
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
            setDrawedEdge(false);
        }
        catch (error) {
            console.log("DeleteMap failed:", error);
        }

    }
    scrollMap = (floorId) => {
        let svg = document.getElementById(`svg-${floorId}`);
        svg.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }
    /*XỬ LÍ SỰ KIÊN KHI CLICK TRÊN SVG, DRAW EGDE- DRAW SHORTEST PATH */
    handleMouseClick(e, floorId) {
        try {
            const {
                addVertexToGraphs, feature,
                vertex1, vertex2,
                route, setShortestPath,
                setVertex
            } = this.context;
            // console.log(this.context);
            const clickTarget = e.target;
            if (feature === "draw") {
                if (clickTarget.nodeName === "circle") {
                    if (!this.isDrawingEdge) {
                        this.setState({ vertex1State: clickTarget });
                        this.isDrawingEdge = true;
                    } else if (clickTarget !== this.state.vertex1State) {
                        this.setState({ vertex2State: clickTarget });
                        drawEdge(this.state.vertex1State, this.state.vertex2State, floorId, this.deleteEgdes, addVertexToGraphs);
                        this.setState({ vertex1State: null, vertex2State: null });
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
                    // console.log("pathArrData:", pathArrData);
                    setShortestPath(pathArrData);
                    this.isFindingPath = false;
                }
            }
        } catch (error) {
            console.log("error in handleMouseClick:", error);

        }
    }
    setStateAsync(state) {
        return new Promise((resolve) => {
            this.setState(state, resolve)
        });
    }
    deleteEgdes = async (edge, vertex1Id, vertex2Id) => {
        const { removeRelationship } = this.context;
        try {
            removeEdgeElement(edge);
            await removeRelationship(vertex1Id, vertex2Id);
        }
        catch (error) {
            console.log("deleteEgdes error", error);
        }
    };
    drawEdgeFromGraphs = (isDrawedEdges, floorId) => {
        const { setDrawedEdge, addVertexToGraphs, graphs } = this.context;
        try {
            if (isDrawedEdges) return;
            const array = [];
            Object.keys(graphs).forEach(nodeId => {
                Object.keys(graphs[nodeId]).forEach(nodeNeighborId => {
                    if (floorId !== undefined) {
                        if (floorId === nodeNeighborId.substring(0, 2) || floorId === nodeId.substring(0, 2)) {
                            if (_.findIndex(array, { 'node': nodeNeighborId, 'neighbor': nodeId }) === -1) {
                                array.push({ 'node': nodeId, 'neighbor': nodeNeighborId });
                            }
                        }

                    }
                    else {
                        for (let i = 0; i < this.state.listIdOfMap.length; i++) {
                            let nodePathEl = document.getElementById(`node-pathline-${this.state.listIdOfMap[i]}`);
                            if (nodePathEl.childNodes.length === 0) {
                                if (this.state.listIdOfMap[i] === nodeNeighborId.substring(0, 2) || this.state.listIdOfMap[i] === nodeId.substring(0, 2))
                                    if (_.findIndex(array, { 'node': nodeNeighborId, 'neighbor': nodeId }) === -1) {
                                        array.push({ 'node': nodeId, 'neighbor': nodeNeighborId });
                                    }
                            }
                        }
                    }
                });
            });
            array.forEach(async item => {
                if (item.node.substring(0, 2) === item.neighbor.substring(0, 2))
                    await drawEdge(item.node, item.neighbor, item.node.substring(0, 2), this.deleteEgdes, addVertexToGraphs);

            });
            const line = document.querySelector("[id*='node-pathline']");
            if (graphs !== {} && line && line.childNodes.length > 0)
                setDrawedEdge(true);
        } catch (error) {
            console.log("error in drawEdgeFromGraphs:", error);
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return this.state.listIdOfMap !== nextState.listIdOfMap;
    }
    render() {
        return <SVGElement listSVGArray={this.context.listSVGArray} handleSVG={this.handleSVG} />
    }
}
const WrappedSVGContainer = props => {
    console.log("WrappedSVGContainer render");
    return (
        <CombinedCTXProvider>
            <SVGContainer {...props} />
        </CombinedCTXProvider>
    )
}
export default WrappedSVGContainer