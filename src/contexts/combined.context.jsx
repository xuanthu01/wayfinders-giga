import React from 'react';
import { AppContext } from './app.context';
import { SVGContext } from './svg.context';
import SweetAlert from "react-bootstrap-sweetalert";
import CircularProgress from '@material-ui/core/CircularProgress';
export const CombinedContext = React.createContext({});
const CombinedCtxProvider = props => {
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
                                <div className="lds-dual-ring"></div>
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