import React, { useContext } from 'react'
import { drawEdge, removeShortestPathEl, showNodes, removeEdgeElement } from '../../../shared';
import _ from 'lodash';
import { AppContext } from '../../../contexts/app.context';
import { removeVertexFromGraphs } from '../../../helpers';
export default function DeleteRadioButton(props) {
    const { feature, setFeature, graphs, isDrawedEdges, setDrawedEdge, removeRelationship } = useContext(AppContext);

    const deleteEgdes = async (edge, vertex1Id, vertex2Id) => {
        removeEdgeElement(edge);
        // removeVertexFromGraphs(vertex1Id, vertex2Id, graphs, handleGraphsChange);
        await removeRelationship(vertex1Id, vertex2Id);
    };
    const drawEdgeFromGraphs = (isDrawedEdges) => {
        if (isDrawedEdges) return;
        console.log(isDrawedEdges);

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
                await drawEdge(item.node, item.neighbor, item.node.substring(0, 2), deleteEgdes);
        });
        const line = document.querySelector("[id*='node-pathline']");
        if (graphs !== {} && line && line.childNodes.length > 0)
            setDrawedEdge(true);
    }
    return (
        <AppContext.Consumer>
            {({ isDrawedEdges, vertex1, vertex2 }) => (
                <div>
                    <input type="radio" id="delete" onChange={() => {
                        showNodes();
                        removeShortestPathEl(vertex1, vertex2);
                        setFeature("delete");
                        drawEdgeFromGraphs(isDrawedEdges);
                    }} name="chooseFeature" /> DELETE <br />
                </div>
            )}
        </AppContext.Consumer>
    )
}
