"use strict";
import React, { Component } from 'react';
import Graph from 'node-dijkstra';
export const GraphContext = React.createContext();
export class GraphProvider extends Component {
    state = {
        graphs: {},
        route: null
    }
    handleGraphsFileUpload = e => {
        const reader = new FileReader();
        reader.onload = async e => {
            const graphsStr = await e.target.result;
            const graphsJson = JSON.parse(graphsStr);
            this.setState({ graphs: graphsJson, route: new Graph({ ...graphsJson }) });
        };
        reader.readAsText(e.target.files[0]);
    };
    render() {
        return (
            <GraphContext.Provider value={{
                ...this.state,
                handleGraphsFileUpload: this.handleGraphsFileUpload
            }}>
                {this.props.children}
            </GraphContext.Provider>
        )
    }
}