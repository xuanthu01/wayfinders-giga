import React from 'react';
import { AppContext } from './app.context';
import { SVGContext } from './svg.context';
export const CombinedContext = React.createContext({});
const CombinedCtxProvider = props => {
    return (
        <AppContext.Consumer>
            {appCtx => (
                <SVGContext.Consumer>
                    {SVGCtx => (
                        <CombinedContext.Provider value={{ ...appCtx, ...SVGCtx }}>
                            {props.children}
                        </CombinedContext.Provider>
                    )}
                </SVGContext.Consumer>
            )}
        </AppContext.Consumer>
    )
}
export default CombinedCtxProvider;