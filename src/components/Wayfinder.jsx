import React, { Component,Suspense } from 'react';
import { AppProvider, AppContext } from '../contexts';
import { WayFindRadioButton, DrawRadioButton } from './Menu/RadioButton';
import { LoadGraphButton,SaveGraphButton ,LoadSVGButton} from './Menu/Button';
import SVGContainer from './Containers/SVGContainer';
import { SVGProvider } from '../contexts/svg.context';
// import RelationshipTable from './RelationshipTable';
const RelationshipTable = React.lazy(() => import('./RelationshipTable'));
// const SVGContainer = React.lazy(() => import('./Containers/SVGContainer'));
// const LoadSVGButton = React.lazy(() => import('./Menu/Button/LoadSVG'));
class Wayfinders extends Component {
    // static contextType = AppContext;
    render() {
        return (
            <AppProvider>
                <div className="wayfinders-app">
                    <div className="menu-button" style={{ textAlign: "center" }}>
                        <LoadGraphButton />
                        <SaveGraphButton />
                        <DrawRadioButton />
                        <WayFindRadioButton />
                    </div>
                    <div className="svg-zone" style={{ textAlign: "center" }}>
                        <SVGProvider>
                            
                            <LoadSVGButton />
                            <div className="svg-container" style={{ textAlign: "center" }}>
                                <SVGContainer />
                            </div>
                              
                        </SVGProvider>

                    </div>
                    <div className="relationship-table">
                        <Suspense fallback={<p>Loading ...</p>}>
                            <RelationshipTable />
                        </Suspense>
                        
                    </div>
                </div>
            </AppProvider>
        )
    }
}
export default Wayfinders;