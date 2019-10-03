import React from 'react';
import { AppContext } from './app.context';
import { SVGContext } from './svg.context';
import { css } from '@emotion/core';
import SweetAlert from "react-bootstrap-sweetalert";
import { pick } from 'lodash';
// import CircularProgress from '@material-ui/core/CircularProgress';
import RingLoader from 'react-spinners/RingLoader';
export const CombinedContext = React.createContext({});
const areEqual = (prevProps, nextProps) => {
    if (nextProps.listSVGArray.length !== prevProps.listSVGArray.length ||
        nextProps.vertex1 !== prevProps.vertex1 ||
        nextProps.vertex2 !== prevProps.vertex) {
        return false; //will re-render
    }
    else return true;//not re-render
}
const Child = React.memo((props) => {
    const override = css`left : 32%`;
    return (
        <>
            <CombinedContext.Provider value={{ ...props }}>
                {props.children}
            </CombinedContext.Provider>
            {props.waitForLoading === true ? <SweetAlert
                style={{ display: "block", marginTop: "-100px" }}
                title="Loading ... "
                // onConfirm={() => this.hideAlert()}
                showConfirm={false}
            >
                <RingLoader
                    css={override}
                    sizeUnit={"px"}
                    size={150}
                    color={'#123abc'}
                    loading={true}
                />
            </SweetAlert> : null
            }
        </>
    )
})
const CombinedCTXProvider = React.memo((props) => {
    return <Child {...props} />
}, areEqual);
const WrappedCombinedCTXProvider = props => {
    return (
        <AppContext.Consumer>
            {appCtx => (
                <SVGContext.Consumer>
                    {SVGCtx => (
                        <CombinedCTXProvider
                            {...pick(appCtx,
                                ['setDrawedEdge',
                                    'addVertexToGraphs',
                                    'feature',
                                    'vertex1',
                                    'vertex2',
                                    'route',
                                    'setShortestPath',
                                    'setVertex',
                                    'removeRelationship',
                                    'graphs'])}
                            {...pick(SVGCtx,
                                ['startIndex',
                                    'isLoading',
                                    'listSVGArray',
                                    'setWaiting',
                                    'waitForLoading',
                                    'AdjustNumberOfMap'])}
                            {...props} />
                    )}
                </SVGContext.Consumer>
            )}
        </AppContext.Consumer>
    )
}
export default WrappedCombinedCTXProvider;