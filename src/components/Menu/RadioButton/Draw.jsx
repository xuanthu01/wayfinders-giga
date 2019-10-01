import React, { useContext } from 'react'
import _ from "lodash";
import { drawEdge, showNodes, removeShortestPathEl, removeEdgeElement } from "../../../shared";
import { AppContext } from '../../../contexts';
import Radio from '@material-ui/core/Radio';
export default function DrawRadioButton(props) {
    
    const { graphs, isDrawedEdges, setDrawedEdge,
        removeRelationship, addVertexToGraphs
    } = useContext(AppContext);

    const deleteEgdes = async (edge, vertex1Id, vertex2Id) => {
        removeEdgeElement(edge);
        await removeRelationship(vertex1Id, vertex2Id);
    };
    const drawEdgeFromGraphs = (isDrawedEdges) => {
        try {
            if (isDrawedEdges) return;
            const array = [];
            Object.keys(graphs).forEach(nodeId => {
                Object.keys(graphs[nodeId]).forEach(nodeNeighborId => {
                    if (_.findIndex(array, { 'node': nodeNeighborId, 'neighbor': nodeId }) === -1) {
                        array.push({ 'node': nodeId, 'neighbor': nodeNeighborId });
                    }
                });
            });
            array.forEach(async item => {
                if (item.node.substring(0, 2) === item.neighbor.substring(0, 2))
                    await drawEdge(item.node, item.neighbor, item.node.substring(0, 2), deleteEgdes, addVertexToGraphs);
            });
            const line = document.querySelector("[id*='node-pathline']");
            if (graphs !== {} && line && line.childNodes.length > 0)
                setDrawedEdge(true);
        } catch (error) {
            console.log("error in DrawRadioButton:", error);
        }
    }
    // console.log("DrawRadioButton");
    return (
        <AppContext.Consumer>
            {({ setFeature, vertex1, vertex2 }) => (
                <>
                    <input type="radio" id="draw" onChange={() => {
                        removeShortestPathEl(vertex1, vertex2);
                        setFeature("draw");
                        showNodes();
                        drawEdgeFromGraphs(isDrawedEdges);
                    }} name="chooseFeature" />DRAW <br />
                    {/* <Radio    
                        onChange={() => {
                            removeShortestPathEl(vertex1, vertex2);
                            setFeature("draw");
                            showNodes();
                            drawEdgeFromGraphs(isDrawedEdges);
                        }}           
                        name="chooseFeature"
                        
                    />DRAW <br /> */}
                </>
            )}
        </AppContext.Consumer>

    )
}