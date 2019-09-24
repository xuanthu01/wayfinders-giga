"use strict";
import React, { Component } from 'react';
export const SVGContext = React.createContext();
export class SVGProvider extends Component {
    state = {
        startIndex: 0,
        isLoading: false,
        listSVGArray: []
    }
    setStartIndex = index => {
        return this.setState({ startIndex: index });
    }
    setIsLoading = isLoading => {
        return this.setState({ isLoading: isLoading });
    }
    getSVGContent = async (arrUrlSvg, startIndex) => {
        console.log("getSvgContent");
        this.setStartIndex(startIndex);
        arrUrlSvg.forEach(async url => {
            await this.setStateAsync({ listSVGArray: [...this.state.listSVGArray, url] });
        });
        this.setIsLoading(true);
    }
    AdjustNumberOfMap = async (index) => {
        const cloneState = [...this.state.listSvgArr];
        cloneState.splice(index, 1);
        this.setIsLoading(false);
        await this.setStateAsync({ listSVGArray: cloneState });
    }
    setStateAsync(state) {
        return new Promise((resolve) => {
            this.setState(state, resolve)
        });
    }
    render() {
        return (
            <SVGContext.Provider value={{
                ...this.state,
                setIsLoading: this.setIsLoading,
                setStartIndex: this.setStartIndex,
                getSVGContent: this.getSVGContent,
                AdjustNumberOfMap: this.AdjustNumberOfMap
            }}>
                {this.props.children}
            </SVGContext.Provider>
        )
    }
}