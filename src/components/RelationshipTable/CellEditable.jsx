import React, { Component } from 'react';
// import { If } from  "../../shared";
import { Cell } from './Cell';

const CellEdit = ({ data, neighbor, property, onChangeData }) => {
    const onBlur = (e) => {
        if (neighbor[`${property}`] !== e.target.innerHTML) {
            if (property === 'cost')
                neighbor[`${property}`] = Number(e.target.innerHTML);
            else neighbor[`${property}`] = e.target.innerHTML;
            onChangeData(data);
        }
    }
    return <Cell
        neighbor={neighbor}
        property={property}
        canEdit={true}
        onBlur={onBlur}
    />
}
const CellEditable = props => {
    const { data, node, neighbor, property, onChangeData } = props;
    return (
        <div>
            <CellEdit key={`cell-edit-${node}-${neighbor}`} data={data} node={node} neighbor={neighbor} property={property} onChangeData={onChangeData} />
        </div>
    )
}

export default CellEditable;