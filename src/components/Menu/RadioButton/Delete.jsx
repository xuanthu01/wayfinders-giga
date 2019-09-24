import React, { useContext } from 'react'
import { drawEdge } from '../../../shared';
import _ from 'lodash';
import { AppContext } from '../../../contexts/app.context';
import { removeVertexFromGraphs } from '../../../helpers';
export default function DeleteRadioButton(props) {
    const { feature, setFeature, graphs, handleGraphsChange, isDrawedEdges, setDrawedEdge } = useContext(AppContext);
    const deleteEgdes = (edge, vertex1Id, vertex2Id) => {
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
        removeVertexFromGraphs(vertex1Id, vertex2Id, graphs, handleGraphsChange);
    };
    const drawEdgeFromGraphs = () => {
        if (isDrawedEdges) return;
        const array = [];
        Object.keys(graphs).forEach(nodeId => {
            Object.keys(graphs[nodeId]).forEach(nodeNeighborId => {
                if (_.findIndex(array, { 'node': nodeNeighborId, 'neighbor': nodeId }) === -1) {
                    array.push({ 'node': nodeId, 'neighbor': nodeNeighborId });
                }
            });
        });
        array.forEach(item => {
            if (item.node.substring(0, 2) === item.neighbor.substring(0, 2))
                drawEdge(item.node, item.neighbor, item.node.substring(0, 2), deleteEgdes);
        });
        const line = document.querySelector("[id*='node-pathline']");
        if (graphs !== {} && line && line.childNodes.length > 0)
            setDrawedEdge(true);
    }
    return (
        <AppContext.Consumer>
            {() => (
                <div>
                    <input type="radio" id="delete" onChange={() => { setFeature("delete"); drawEdgeFromGraphs(); }} name="chooseFeature" /> DELETE <br />
                </div>
            )}
        </AppContext.Consumer>
    )
}
