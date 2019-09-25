import React, { useContext, useState } from 'react'
import ReactSVG from 'react-inlinesvg';
import { drawShortestPath, } from "../../helpers";
import { drawEdge, highLightNodeEl, removeShortestPathEl } from "../../shared"
import { SVGContext } from '../../contexts/svg.context';
import { AppContext } from '../../contexts/app.context';
const showNodeInfo = (node) => {
    let tooltip = document.createElementNS("http://www.w3.org/2000/svg", "text");
    tooltip.setAttributeNS(null, "x", node.attributes.cx.value - 40);
    tooltip.setAttributeNS(null, "y", node.attributes.cy.value - 15);
    tooltip.setAttributeNS(null, "fill", "black");
    tooltip.innerHTML = node.id
    node.parentElement.appendChild(tooltip);
}
const hideNodeInfo = (node) => {
    let nodeEl = document.getElementById(node.id);
    nodeEl.parentElement.removeChild(nodeEl.parentElement.lastChild);
}
function setAsync(state, action) {
    return new Promise((resolve) => {
        action(state);
    });
}
function setStateAsync(state) {
    return new Promise((resolve) => {
        this.setState(state, resolve)
    });
}
function SVGContainer(props) {
    const [numDeleted, setNumDeleted] = useState(0);
    const [listIDMap, setListIDMap] = useState("");

    const AppCtx = useContext(AppContext);
    const SVGCtx = useContext(SVGContext);
    const { feature, vertex1, vertex2, setVertex, route, setShortestPath, addVertexToGraphs, removeRelationship } = AppCtx;
    const { isLoading, listSVGArray, startIndex, AdjustNumberOfMap } = SVGCtx;
    // setFeatureState(feature);
    console.log("feature global", feature);
    let isDrawingEdge = false;
    let isFindingPath = false;


    const addClickEventForCirclesYAH = (YAHNode, floorId) => {
        YAHNode.addEventListener("click", async e => {
            await handleMouseClick(e, floorId);
        });
        YAHNode.setAttribute("style", "cursor: pointer;");
    };
    const addClickEventForCircle = (floorId) => {
        let svg = document.getElementById(`node-${floorId}`);
        const vertices = svg.getElementsByTagName("circle");
        for (let i = 0; i < vertices.length; i++) {
            vertices[i].addEventListener("click", async e => {
                await handleMouseClick(e, floorId);
            });
        }
    };
    const addMenuForMap = (floorId) => {
        let divMenuOfMap = document.createElement("div");
        divMenuOfMap.setAttribute("class", "menuOfMap");
        document.getElementsByClassName("menu-button")[0].appendChild(divMenuOfMap);
        let radio = document.createElement("input");
        radio.setAttribute("type", "radio");
        radio.setAttribute("name", "radioGroup");
        radio.setAttribute("id", `radio-${floorId}`);
        radio.addEventListener("change", () => { scrollMap(floorId) });
        let nameOfMap = document.createElement("span");
        nameOfMap.innerHTML = `${floorId}`;
        let button = document.createElement("button");
        button.addEventListener("click", () => { DeleteMap(floorId) });
        button.textContent = "Delete";
        let space = document.createElement("span");
        space.innerText = `     `;
        divMenuOfMap.appendChild(radio);
        divMenuOfMap.appendChild(nameOfMap);
        divMenuOfMap.appendChild(button);
        divMenuOfMap.appendChild(space);
    }
    const createNode_Pathline = (svgElement, floorId) => {

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
    };
    const deleteEgdes = async (edge, vertex1Id, vertex2Id) => {
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
    const handleMouseClick = async (e, floorId) => {
        const clickTarget = e.target;
        console.log(AppCtx);
        
        console.log("feature:", feature);
        if (feature === "draw") {
            console.log("clickTarget in draw feature", clickTarget);

            if (clickTarget.nodeName === "circle") {
                if (!isDrawingEdge) {
                    setVertex({ vertex1: clickTarget });
                    isDrawingEdge = true;
                } else if (clickTarget !== vertex1) {
                    setVertex({ vertex2: clickTarget });
                    await drawEdge(vertex1, vertex2, floorId, deleteEgdes, addVertexToGraphs);
                    setVertex({ vertex1: null, vertex2: null });
                    isDrawingEdge = false;
                }
            }
        } else if (feature === "find") {
            if (document.getElementsByClassName("animation-path").length !== 0) {
                if (vertex1 === "" || vertex2 === "") {
                    // console.log("find");
                    removeShortestPathEl(vertex1, vertex2);
                }
                else if (vertex1 !== "" && vertex2 !== "") {
                    // console.log("click");
                    removeShortestPathEl(vertex1, vertex2);
                }
            }
            if (!isFindingPath) {
                document.getElementById("first-vertex").value = e.target.id;
                // this.setState({ vertex1: e.target.id });
                // setVertex1(e.target.id);
                setVertex({ vertex1: e.target.id });
                isFindingPath = true;
            } else {
                if (e.target.id === vertex1) {
                    alert("Vertex cannot connect it self or loaded this map more than one time");
                    // this.setState({ vertex1: "", vertex2: "" });
                    setVertex({ vertex1: "", vertex2: "" });
                    isFindingPath = false;
                    return;
                }
                document.getElementById("second-vertex").value = e.target.id;
                // this.setState({ vertex2: e.target.id });
                setVertex({ vertex2: e.target.id });
                let pathArrData = drawShortestPath(vertex1, vertex2, route);

                // console.log("pathArrData");
                // this.props.getPathArr(pathArrData);
                setShortestPath(pathArrData);
                isFindingPath = false;
            }
        }
    }
    /*MENU CHO MAP KHI LOAD MAP LÊN */
    const DeleteMap = async (floorId) => {
        //remove HTMLElement
        // document.getElementById("list-svg").removeChild(document.getElementById(`svg-${floorId}`));
        let radioElement = document.getElementById(`radio-${floorId}`);
        document.getElementsByClassName("menu-button")[0].removeChild(radioElement.parentElement);
        let deleteFileIndex;
        for (let i = 0; i < listIDMap.length; i++) {
            if (listIDMap[i] === floorId) {
                deleteFileIndex = i;
                break;
            }
        }
        // console.log(deleteFileIndex);
        var cloneState = [...listIDMap];
        cloneState.splice(deleteFileIndex, 1);
        setListIDMap(cloneState);
        setNumDeleted(numDeleted + 1);
        await AdjustNumberOfMap(deleteFileIndex);
    }
    const scrollMap = (floorId) => {
        let svg = document.getElementById(`svg-${floorId}`);
        svg.scrollIntoView();
    };
    const addEventMouse = () => {
        const nodes = document.querySelectorAll("circle");
        nodes.forEach(node => {
            node.addEventListener("mouseover", e => {
                if (!e.target.id.includes("PATH")) {
                    showNodeInfo(e.target);
                    highLightNodeEl(e.target.id, 500, false);
                }
            });
            node.addEventListener("mouseout", e => {
                if (!e.target.id.includes("PATH"))
                    hideNodeInfo(e.target);
            });
        });
    }
    const handleSVG = async (src, hasCache) => {
       console.log(listSVGArray.length)
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
                    createNode_Pathline(listsvg[i], floorId);
                    addClickEventForCircle(floorId);
                }
            }
            return;
        }
        for (let i = index - numDeleted; i < listSVGArray.length; i++) {
            console.log(i)
            let floorId = listsvg[i].getElementById("background").parentElement.attributes.id.value;
            listsvg[i].setAttribute("id", `svg-${floorId}`);
            // this.addClickEventForCirclesYAH(floorId);
            createNode_Pathline(listsvg[i], floorId);
            addClickEventForCircle(floorId);
            addEventMouse();
            addMenuForMap(floorId);
            setListIDMap([...listIDMap,floorId]);
            // await setListIDMapAsync([...listIDMap, floorId]);
            // await setStateAsync([...listIDMap, floorId], setListIDMap);
        };
        //add event listener for YAH nodes 
        const circlesYAH = document.querySelectorAll("circle[id*='YAH']");
        circlesYAH.forEach(circleNode => {
            const floorId = circleNode.id.substring(0, 2);
            addClickEventForCirclesYAH(circleNode, floorId);
        });
        // console.log("circlesYAH", circlesYAH);
    }

    return (
        <AppContext.Consumer>
            {() => (
                <SVGContext.Consumer>
                    {() =>
                         (
                        <div id="list-svg">
                            {listSVGArray.length > 0 ? listSVGArray.map((value, i) => (
                                <ReactSVG
                                    key={`svg-${i}`}
                                    src={value}
                                    onLoad={async (src, hasCache) => await handleSVG(src, hasCache)}
                                    preProcessor={code => code}
                                    cacheRequests={false}
                                />
                            )) : null}
                        </div>
                    )}
                </SVGContext.Consumer>
            )}
        </AppContext.Consumer>
    )
}
export default SVGContainer;