import React, { useContext } from 'react'
import _ from "lodash";
import { drawEdge, showNodes, removeShortestPathEl } from "../../../shared";
import { AppContext } from '../../../contexts';
export default function DrawRadioButton(props) {
    const { feature, setFeature, graphs, handleGraphsChange,
        isDrawedEdges, setDrawedEdge, removeRelationship,
        addVertexToGraphs
    } = useContext(AppContext);

    const deleteEgdes =  (edge, vertex1Id, vertex2Id) => {
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
         removeRelationship(vertex1Id, vertex2Id);
    };
    const drawEdgeFromGraphs =  () => {
        try {
            if (isDrawedEdges) return;
            const array = [];
            Object.keys(graphs).forEach( nodeId => {
                 Object.keys(graphs[nodeId]).forEach(  nodeNeighborId => {
                    if (_.findIndex(array, { 'node': nodeNeighborId, 'neighbor': nodeId }) === -1) {
                         array.push({ 'node': nodeId, 'neighbor': nodeNeighborId });
                    }
                });
            });
            array.forEach( item => {
                if (item.node.substring(0, 2) === item.neighbor.substring(0, 2))
                     drawEdge(item.node, item.neighbor, item.node.substring(0, 2), deleteEgdes, addVertexToGraphs);
            });
            const line = document.querySelector("[id*='node-pathline']");
            if (graphs !== {} && line && line.childNodes.length > 0)
                setDrawedEdge(true);
        } catch (error) {
            console.log("error in DrawRadioButton:", error);
        }
    }

    return (
        <AppContext.Consumer>
            {({ setFeature, vertex1, vertex2 }) => (
                <>
                    <input type="radio" id="draw" onChange={ () => {
                         removeShortestPathEl(vertex1, vertex2);
                        setFeature("draw");
                        showNodes();
                         drawEdgeFromGraphs();
                    }} name="chooseFeature" />DRAW <br />
                </>
            )}
        </AppContext.Consumer>

    )
}