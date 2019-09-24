"use strict";
import React, { Component, useContext } from 'react';
import Graph from 'node-dijkstra';
import { serializeGraphsToData } from '../helpers';
export const AppContext = React.createContext();
export default class AppProvider extends Component {
    state = {
        graphs: {},
        route: null,
        vertex1: "",
        vertex2: "",
        feature: "",
        data: [],
        isDrawedEdges: false,
        shortestPath: []
    };
    handleGraphsFileUpload = e => {
        const reader = new FileReader();
        reader.onload = async e => {
            const graphsStr = await e.target.result;
            const graphsJson = JSON.parse(graphsStr);
            this.handleGraphsChange(graphsJson);
        };
        reader.readAsText(e.target.files[0]);
    };
    handleGraphsChange = graphs => {
        const data = serializeGraphsToData(graphs);
        return this.setState({ graphs: graphs, route: new Graph({ ...graphs }), data: data });
    };
    // handleVertexChange = (vertex1, vertex2) => {
    //     return this.setState({ vertex1: vertex1, vertex2: vertex2 });
    // };
    setVertex = (vertex) => {
        return this.setState({ ...vertex });
    }
    setFeature = feature => {
        return this.setState({ feature: feature });
    };
    setDrawedEdge = isDrawedEdges => {
        return this.setState({ isDrawedEdges: isDrawedEdges });
    };
    setShortestPath = (path) => {
        return this.setState({ shortestPath: path });
    }
    render() {
        return (
            <AppContext.Provider value={{
                ...this.state,
                handleGraphsFileUpload: this.handleGraphsFileUpload,
                handleGraphsChange: this.handleGraphsChange,
                // handleVertexChange: this.handleVertexChange,
                setFeature: this.setFeature,
                setDrawedEdge: this.setDrawedEdge,
                setShortestPath: this.setShortestPath,
                setVertex: this.setVertex,
            }}>
                {this.props.children}
            </AppContext.Provider>
        )
    }
}
