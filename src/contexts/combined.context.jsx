import React from 'react';
import { AppContext } from './app.context';
import { SVGContext } from './svg.context';
import { css } from '@emotion/core';
import SweetAlert from "react-bootstrap-sweetalert";
// import CircularProgress from '@material-ui/core/CircularProgress';
import RingLoader from 'react-spinners/RingLoader';
export const CombinedContext = React.createContext({});
const CombinedCtxProvider = props => {
    const override = css`
    left : 32%
`;
    
    return (
        <AppContext.Consumer>
            {appCtx => (
                <SVGContext.Consumer>
                    {SVGCtx => (
                        <>
                        <CombinedContext.Provider value={{ ...appCtx, ...SVGCtx }}>
                            {props.children}
                        </CombinedContext.Provider> 
                        {SVGCtx.waitForLoading === true ?   <SweetAlert
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
                    )}
                </SVGContext.Consumer>
            )}
        </AppContext.Consumer>
    )
}
export default CombinedCtxProvider;