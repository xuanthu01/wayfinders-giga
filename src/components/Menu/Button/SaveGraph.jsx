import React, { useContext } from 'react'
import { handleSaveRelationship } from "../../../shared";
import { AppContext } from '../../../contexts/app.context';
export default function SaveGraphButton() {
    const { graphs } = useContext(AppContext);
    return (
        <AppContext.Consumer>
            {() => (
                <>
                    <button onClick={() => handleSaveRelationship(graphs, "graphs")}>Save Graphs</button><br />
                </>
            )}
        </AppContext.Consumer>
    )
}