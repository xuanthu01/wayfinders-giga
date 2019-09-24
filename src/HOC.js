import { AppContext } from "./contexts/app.context";
import React from "react";
export const withAppContext = Component => (
    props => (
        <AppContext.Consumer>
            {context => <Component appContext={context} {...props} />}
        </AppContext.Consumer>
    )
);
export default withAppContext;

// const YourComponent = ({ themeContext, ...props }) => {
//     themeContext.someFunction()
//     return (<div>Hi Mom!</div>)
// }

// export default withThemeContext(YourComponent)