import React from 'react'
import { If, removeShortestPathEl, showNodes, hideEdges } from "../../../shared";
import { drawShortestPath } from "../../../helpers";
import { useState, useContext } from 'react';
import { AppContext } from '../../../contexts/app.context';


const PathStep = ({ step, index }) => {
    return (
        <p id="node-pathline-list" style={{ whiteSpace: "nowrap", overflow: "auto", }}>
            {`Step ${index} : ${step.join("=>").toString()}`}
        </p>
    )
}
const VertextureComponent = (props) => {
    const { vertex1, vertex2, setVertex, route, shortestPath, setShortestPath } = useContext(AppContext);
    const _drawShorestPath = () => {
        try {
            console.log("vertex1:", vertex1);
            console.log("vertex2:", vertex2);


            // console.log(oldVertex1, oldVertex2);
            // console.log(props.vertex1, props.vertex2);
            if (vertex1 !== "" && vertex2 !== "") {
                console.log("here");
                removeShortestPathEl(oldVertex1, oldVertex2);
            }
            else if (vertex1 !== "" && vertex2 !== "") {
                removeShortestPathEl(vertex1, vertex2);
                setVertex({ vertex1: "", vertex2: "" });
            }
            console.log(vertex1, vertex2, "vertẽx");
            if (vertex1.length === 0 && vertex2.length === 0) {
                console.log("can not get vertexid");
            }
            setShortestPath(drawShortestPath(vertex1, vertex2, route));
            if (shortestPath === undefined || null)
                return;
            var result = Object.keys(shortestPath).map(function (key) {
                return [shortestPath[key]];
            });
            let pElement = document.getElementById("node-pathline-list")
            pElement.innerText = result.join("=>");
            // setOldVertex1(vertex1);
            // setOldVertex2(vertex2);
            setVertex({ vertex1: vertex1, vertex2: vertex2 })
            // props.changeVertex(vertex1, vertex2);
        } catch (error) {
            console.log("error in _drawShorestPath:", error);
        }

    }
    const [oldVertex1] = useState('');
    const [oldVertex2] = useState('');

    if (shortestPath === undefined || null)
        return;
    var result = Object.keys(shortestPath).map(function (key) {
        return [shortestPath[key]];
    });
    // console.log("result:", result);

    return (
        <div>
            <input type="text" id="first-vertex" onBlur={e => {
                // setInputVertex1(e.target.value);
                setVertex({ vertex1: e.target.value });
            }} />
            <span>  </span>
            <input type="text" id="second-vertex" onBlur={e => {
                // setInputVertex2(e.target.value);
                setVertex({ vertex2: e.target.value });

                // console.log(vertex2, e.target.value);
            }} />
            <span>  </span>
            <button onClick={_drawShorestPath}>Find</button> <br />
            {
                result.map((step, index) => {
                    return <><p>List of path</p>
                        <PathStep key={index} step={step} index={index + 1} /></>
                })
            }
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
        // const { shortestPath, route, setVertex, vertex2, vertex1 } = this.context;
        return (
            <AppContext.Consumer>
                {({ setFeature }) => (
                    <>
                        <input type="radio" id="way-Finding" onChange={() => {
                            setFeature("find");
                            showNodes(true);
                            hideEdges();
                        }} name="chooseFeature" />Way Finding <br />
                        <If condition={condition} component={VertextureComponent} />
                    </>
                )}
            </AppContext.Consumer>

        )
    }
}
export default WayFindRadioButton;