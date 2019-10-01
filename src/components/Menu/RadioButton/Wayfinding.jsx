import React from 'react'
import { If, removeShortestPathEl } from "../../../shared";
import { drawShortestPath } from "../../../helpers";
import { useState, useContext } from 'react';
import { AppContext } from '../../../contexts/app.context';

const PathStep = ({ step, index }) => {
    return `Step ${index} : ${step[0].join("=>").toString()}`;
}
const VertextureComponent = (props) => {
    const { vertex1, vertex2, setVertex, route, shortestPath, setShortestPath } = useContext(AppContext);
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
        // console.log(pathArr)
        if (pathArr === undefined || null)
            return null;
        setShortestPath(pathArr);
        setOldVertex1(vertexInput1);
        setOldVertex2(vertexInput2);
    }
    const [oldVertex1, setOldVertex1] = useState('');
    const [oldVertex2, setOldVertex2] = useState('');
    // const [v1, setInputVertex1] = useState('');
    // const [v2, setInputVertex2] = useState('');

    let result;
    if (shortestPath)
        result = Object.keys(shortestPath).map(key => [shortestPath[key]]);
    return (
        <div>
            <input type="text" id="first-vertex"  />
            <span>  </span>
            <input type="text" id="second-vertex"  />
            <span>  </span>
            <button onClick={_drawShorestPath}>Find</button> <br />
            <div id="node-pathline-list" style={{ whiteSpace: "nowrap", overflow: "auto" }}>
                {
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
        // console.log("WayFindRadioButton");
        return (
            <AppContext.Consumer>
                {({ setFeature, setDrawedEdge, feature }) => (
                    <>
                        <input type="radio" id="way-Finding" onChange={() => {
                            // setDrawedEdge(false);
                            setFeature("find");
                            // showNodes(true);
                            // hideEdges();
                        }} name="chooseFeature" />Way Finding <br />
                        
                        <If condition={feature === "find"} component={VertextureComponent} />
                    </>
                )}
            </AppContext.Consumer>

        )
    }
}
export default WayFindRadioButton;