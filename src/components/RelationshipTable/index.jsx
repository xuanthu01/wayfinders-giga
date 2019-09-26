import React from 'react';
import ReactTable from 'react-table';
import { isEmpty, remove } from 'lodash';
import { handleSaveRelationship, deserializeDataToGraphs, removeEdgeElement } from "../../shared";
import COLUMNS from './Columns';
import 'react-table/react-table.css';
import { AppContext } from '../../contexts';
function ButtonFeature({ handleEditRelationship, handleSaveRelationship }) {
    const styles = {
        backgroundColor: '#dadada',
        borderRadius: '2px'
    }
    return (
        <div style={{ textAlign: 'right' }}>
            <input type="checkbox" id="checkbox-editmode" /> Edit mode

            <button style={styles} onClick={() => handleSaveRelationship()} >Save</button>
        </div>
    )
}
class RelationshipTable extends React.Component {
    static contextType = AppContext;
    handleRemoveNeighbor = (node, neighbor) => {
        try {
            const { data, graphs, removeRelationship } = this.context;
            console.log("data", data);
            data.forEach(item => {
                //tìm node để xóa neighbor & tìm neighbor để xóa node 
                if (item.node === node || item.node.id === neighbor.id) {
                    const nodeRemoved = remove(item.neighbors, nb => nb === neighbor || nb.id === node.id);
                    if (isEmpty(item.neighbors)) {
                        remove(data, nodeNoNeighbor => nodeNoNeighbor.node.id === item.node.id);
                    }
                    if (!nodeRemoved[0]) {
                        alert("Not found neighbor of node has id : " + node.id);
                        return;
                    }
                    //remove in graphs
                    removeRelationship(node.id, nodeRemoved[0].id);
                    //remove edges element
                    removeEdgeElement(`${node.id}:${nodeRemoved[0].id}`);
                }
            });
        } catch (error) {
            console.log("failed in handleRemoveNeighbor in RelationshipTable:", error);
        }
    };
    handleAddRelationship = () => {
        alert("This feature will be available in next version");
    }
    getColumns = () => {
        const { data, handleDataChange } = this.context;
        const columns = [
            {
                ...COLUMNS.Node
            },
            {
                ...COLUMNS.Type
            },
            {
                ...COLUMNS.Neighbors(data, handleDataChange)
            },
            {
                ...COLUMNS.NeighborsType(data, handleDataChange)
            },
            {
                ...COLUMNS.Cost(data, handleDataChange)
            },
            {
                ...COLUMNS.Action(this.handleRemoveNeighbor)
            }
        ];
        return columns;
    }
    render() {
        console.log("RelationshipTable");
        return (
            <AppContext.Consumer>
                {({ data }) => (
                    <div>
                        <ButtonFeature
                            handleSaveRelationship={() => handleSaveRelationship(data, "data")}
                            handleAddRelationship={() => this.handleAddRelationship()}
                        />
                        <ReactTable
                            filterable
                            defaultFilterMethod={(filter, row) =>
                                String(row[filter.id]) === filter.value}
                            data={data}
                            columns={this.getColumns()}
                            defaultPageSize={5}
                            showPagination={true}
                            className="-striped -highlight"
                        />
                    </div>
                )}
            </AppContext.Consumer>
        )
    }
}
export default RelationshipTable