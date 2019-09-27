import React from 'react'
import { If, removeShortestPathEl, showNodes, hideEdges } from "../../../shared";
import { drawShortestPath } from "../../../helpers";
import { useState, useContext } from 'react';
import { AppContext } from '../../../contexts/app.context';
import { isEmpty, size } from 'lodash';

const PathStep = ({ step, index }) => {
    return `Step ${index} : ${step[0].join("=>").toString()}`;
}
const VertextureComponent = (props) => {
    // console.log(props);
    const { vertex1, vertex2, setVertex, route, shortestPath, setShortestPath, feature } = useContext(AppContext);
    // const _drawShorestPath = () => {
    //     try {
    //         if (vertex1 !== "" && vertex2 !== "") {
    //             console.log("here");
    //             removeShortestPathEl(oldVertex1, oldVertex2);
    //         }
    //         else if (vertex1 !== "" && vertex2 !== "") {
    //             removeShortestPathEl(vertex1, vertex2);
    //             setVertex({ vertex1: "", vertex2: "" });
    //         }
    //         console.log(vertex1, vertex2, "vertẽx");
    //         if (vertex1.length === 0 && vertex2.length === 0) {
    //             console.log("can not get vertexid");
    //         }
    //         const path = drawShortestPath(vertex1, vertex2, route);
    //         if (path && size(path) > 1) {
    //             setShortestPath(path);
    //             var result = Object.keys(shortestPath).map(function (key) {
    //                 return [shortestPath[key]];
    //             });
    //             let pElement = document.getElementById("node-pathline-list")
    //             pElement.innerText = result.join("=>");
    //             setOldVertex1(vertex1);
    //             setOldVertex2(vertex2);
    //             setVertex({ vertex1: vertex1, vertex2: vertex2 });
    //         }
    //         else throw new Error("Not found shortestPath");
    //         // if (shortestPath.length < 1)
    //         //     return null;

    //         // props.changeVertex(vertex1, vertex2);
    //     } catch (error) {
    //         console.log("error in _drawShorestPath:", error);
    //     }
    // }
    const _drawShorestPath = () => {
        let shortestPath = document.getElementsByClassName("noAnimation-path");
        let isExist = shortestPath.length;
        if (isExist === 1) {
            if (vertex1 !== "" && vertex2 !== "") {
                removeShortestPathEl(vertex1, vertex2);
                setVertex({ vertex1: "", vertex2: "" });
            }
            else if (oldVertex1 !== "" && oldVertex2 !== "")
                removeShortestPathEl(oldVertex1, oldVertex2);
        }

        let vertexInput1 = document.getElementById("first-vertex").value;
        let vertexInput2 = document.getElementById("second-vertex").value;
        if (vertexInput1.length === 0 && vertexInput2.length === 0) {
            alert(`Can not find shortest path`);
            return;
        }
        let pathArr = drawShortestPath(vertexInput1, vertexInput2, route);
        console.log(pathArr)
        if (pathArr === undefined || null)
            return null;
        // props.getPathArr(pathArr);
        setShortestPath(pathArr);
        setOldVertex1(vertexInput1);
        setOldVertex2(vertexInput2);
    }
    const [oldVertex1, setOldVertex1] = useState('');
    const [oldVertex2, setOldVertex2] = useState('');
    const [v1, setInputVertex1] = useState('');
    const [v2, setInputVertex2] = useState('');

    let result;
    if (shortestPath)
        result = Object.keys(shortestPath).map(key => [shortestPath[key]]);
    // console.log("result:", result);
    return (
        <div>
            <input type="text" id="first-vertex" onBlur={e => {
                setInputVertex1(e.target.value);
                // setVertex({ vertex1: e.target.value });
            }} />
            <span>  </span>
            <input type="text" id="second-vertex" onBlur={e => {
                setInputVertex2(e.target.value);
                // setVertex({ vertex2: e.target.value });

                // console.log(vertex2, e.target.value);
            }} />
            <span>  </span>
            <button onClick={_drawShorestPath}>Find</button> <br />
            <div id="node-pathline-list" style={{ whiteSpace: "nowrap", overflow: "auto" }}>
                {
                    // props !== {} ? <p id="node-pathline-list" style={{ whiteSpace: "nowrap", overflow: "auto", }}>{result.join("=>")}</p> : null
                    result ? result.map((step, index) => {
                        return <>
                            <p>
                                <PathStep key={index} step={step} index={index + 1} />
                            </p>
                            <br />
                        </>
                    }) : null
                }
            </div>
            {/* {
                result.map((step, index) => {
                    return <><p>List of path</p>
                        <PathStep key={index} step={step} index={index + 1} /></>
                })
            } */}
        </div>)
}
class WayFindRadioButton extends React.Component {
    static contextType = AppContext;
    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.shortestPath !== nextProps.shortestPath)
            return true;
        return this.props.feature !== nextProps.feature
    }
    render() {
        // const { shortestPath, route, setVertex, vertex2, vertex1 } = this.context;
        return (
            <AppContext.Consumer>
                {({ setFeature, setDrawedEdge, feature }) => (
                    <>
                        <input type="radio" id="way-Finding" onChange={() => {
                            setDrawedEdge(false);
                            setFeature("find");
                            showNodes(true);
                            hideEdges();
                        }} name="chooseFeature" />Way Finding <br />
                        <If condition={feature === "find"} component={VertextureComponent} />
                    </>
                )}
            </AppContext.Consumer>

        )
    }
}
export default WayFindRadioButton;