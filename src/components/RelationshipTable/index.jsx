import React, { useContext } from 'react';
import ReactTable from 'react-table';
import { isEmpty, remove } from 'lodash';
import { handleSaveRelationship, removeEdgeElement } from "../../shared";
import COLUMNS from './Columns';
import 'react-table/react-table.css';
import { AppContext } from '../../contexts';
function ButtonFeature() {
    return (
        <div style={{ textAlign: 'right' }}>
            <input type="checkbox" id="checkbox-editmode" /> Edit mode
        </div>
    )
}
const Table = React.memo(props => {
    console.log("RelationshipTable");
    return (
        <div>
            <ButtonFeature />
            <ReactTable
                filterable
                defaultFilterMethod={(filter, row) =>
                    String(row[filter.id]) === filter.value}
                data={props.data}
                columns={props.getColumns()}
                defaultPageSize={5}
                showPagination={true}
                className="-striped -highlight"
            />
        </div>
    )
})
const RelationshipTable = React.memo(({ data, removeNeighborOfNode, handleDataChange }) => {
    const handleRemoveNeighbor = async (node, neighbor) => {
        try {
            data.forEach(async item => {
                //tìm node để xóa neighbor & tìm neighbor để xóa node 
                if (item.node === node) {
                    const nodeRemoved = remove(item.neighbors, nb => nb === neighbor || nb.id === node.id);
                    if (isEmpty(item.neighbors)) {
                        remove(data, nodeNoNeighbor => nodeNoNeighbor.node.id === item.node.id);
                    }
                    if (nodeRemoved.length > 0) {
                        //remove in graphs
                        nodeRemoved.forEach(async removed => {
                            await removeNeighborOfNode(node.id, removed.id);
                        });
                        //remove edges element
                        try {
                            data.forEach(async item => {
                                if (item.node.id === neighbor.id) {
                                    let check = 0;
                                    for (let i = 0; i < item.neighbors.length; i++)
                                        if (item.neighbors[i].id !== node.id) {
                                            // console.log(item.neighbors[i],node.id);
                                            check++;
                                        }
                                    console.log(check, "check");
                                    if (check === item.neighbors.length)
                                        await removeEdgeElement(`${node.id}:${nodeRemoved[0].id}`);
                                }
                            })
                        } catch (error) {
                            throw error;
                        }
                    }
                }
                //trash neighbor
                const isExisting = item.node === node && item.neighbors.some(neighborTrash => {
                    return neighborTrash.id === neighbor.id;
                });
                if (isExisting) {
                    remove(item.neighbors, nb => nb.id === neighbor.id);
                }
            });
        } catch (error) {
            console.log("failed in handleRemoveNeighbor in RelationshipTable:", error);
        }
    };
    const handleAddRelationship = (node) => {
        // console.log("handleAddRelationship: ", node);
        try {
            data.forEach(item => {
                if (item.node === node) {
                    const newNeighbor = {
                        id: 'new-neighbor-',
                        name: 'new Neighbor ',
                        type: 'path',
                        cost: 1
                    }
                    item.neighbors.push(newNeighbor);;
                }
            });
            handleDataChange(data);
        }
        catch (error) {
            console.log("failed in handleAddRelationship in RelationshipTable:", error);
        }
    };
    const getColumns = () => {
        const columns = [
            {
                ...COLUMNS.Node
            },
            {
                ...COLUMNS.Type
            },
            {
                ...COLUMNS.Neighbors(data, handleAddRelationship, handleDataChange)
            },
            {
                ...COLUMNS.NeighborsType(data, handleDataChange)
            },
            {
                ...COLUMNS.Cost(data, handleDataChange)
            },
            {
                ...COLUMNS.Action(handleRemoveNeighbor)
            }
        ];
        return columns;
    }
    return <Table data={data} getColumns={getColumns} />
});
const WrappedTable = (props) => {
    return (
        <AppContext.Consumer>
            {({ data, removeNeighborOfNode, handleDataChange }) => (
                <RelationshipTable
                    data={data}
                    removeNeighborOfNode={removeNeighborOfNode}
                    handleDataChange={handleDataChange}
                />
            )}
        </AppContext.Consumer>
    )
}
export default WrappedTable;