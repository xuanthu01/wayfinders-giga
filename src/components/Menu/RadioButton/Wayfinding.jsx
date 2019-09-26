import React from 'react'
import { If, removeShortestPathEl, showNodes, hideEdges } from "../../../shared";
import { drawShortestPath } from "../../../helpers";
import { useState, useContext } from 'react';
import { AppContext } from '../../../contexts/app.context';


const PathStep = ({ step, index }) => {
    return `Step ${index} : ${step[0].join("=>").toString()}`;
}
const VertextureComponent = (props) => {
    // console.log(props);
    const { vertex1, vertex2, setVertex, route, shortestPath, setShortestPath } = useContext(AppContext);
    const _drawShorestPath = () => {
        let shortestPath = document.getElementsByClassName("noAnimation-path");
        let isExist = shortestPath.length;
        if(isExist === 1)
        {
            if(props.vertex1 !== "" && props.vertex2 !== "")
            {
                removeShortestPathEl(props.vertex1,props.vertex2);
                props.resetVertex();
            }  
            else if(oldVertex1 !== "" && oldVertex2 !== "")
                removeShortestPathEl(oldVertex1,oldVertex2);
        }
       
        let vertexInput1 = document.getElementById("first-vertex").value;
        let vertexInput2 = document.getElementById("second-vertex").value;
        if(vertexInput1.length === 0 && vertexInput2.length === 0)
        {
           alert(`Can not find shortest path`);
           return;
        }
        let pathArr = drawShortestPath(vertexInput1, vertexInput2, props.route);       
        if (pathArr === undefined || null)
            return;
        props.getPathArr(pathArr);
        setOldVertex1(vertexInput1);
        setOldVertex2(vertexInput2);

    }
    const [oldVertex1,setOldVertex1] = useState('');
    const [oldVertex2,setOldVertex2] = useState('');
    let result = [];
    if (props.pathArr !== undefined || null)
        result = Object.keys(props.pathArr).map(function (key) {
            return [props.pathArr[key]];
        });
    

    return (
        <div>
            <input type="text" id="first-vertex" />
            <span>  </span>
            <input type="text" id="second-vertex" />
            <span>  </span>
            <button onClick={_drawShorestPath}>Find</button> <br />
            <div id="node-pathline-list" style={{ whiteSpace: "nowrap", overflow: "auto" }}>
                {
                    // props !== {} ? <p id="node-pathline-list" style={{ whiteSpace: "nowrap", overflow: "auto", }}>{result.join("=>")}</p> : null
                    props.pathArr !== {} ? result.map((step, index) => {
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
        const condition = this.context.feature === 'find';
        const { shortestPath, route, vertex2, vertex1,resetVertex ,setShortestPath} = this.context;
        return (
            <AppContext.Consumer>
                {({ setFeature }) => (
                    <>
                        <input type="radio" id="way-Finding" onChange={() => {
                            setFeature("find");
                            showNodes(true);
                            hideEdges();
                        }} name="chooseFeature" />Way Finding <br />
                        <If 
                            condition={condition} 
                            component={VertextureComponent} 
                            props={{ 
                                pathArr: shortestPath, 
                                route: route, 
                                // changeVertex: changeVertex, 
                                vertex1: vertex1, 
                                vertex2: vertex2,
                                getPathArr:setShortestPath,
                                resetVertex:resetVertex
                        }} />
                    </>
                )}
            </AppContext.Consumer>

        )
    }
}
export default WayFindRadioButton;