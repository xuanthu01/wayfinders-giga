import React, { Component } from 'react';
export const SVGContext = React.createContext();
export class SVGProvider extends Component {
    state = {
        startIndex: 0,
        isLoading: false,
        listSVGArray: []
    }
    setStartIndex = async index => {
        console.log(index, "setStartIndex");
        return await this.setStateAsync({ startIndex: index });
    }
    setIsLoading = isLoading => {
        return this.setState({ isLoading: isLoading });
    }
    /**
     * @param {Array} SVGUrl
     */
    getSVGContent = async (SVGUrl) => {
        for (let i = 0; i < SVGUrl.length; i++)
            await this.setStateAsync({ listSVGArray: [...this.state.listSVGArray, SVGUrl[i]] });
        this.setIsLoading(true);
    }
    AdjustNumberOfMap = async (index) => {
        const cloneState = [...this.state.listSVGArray];
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