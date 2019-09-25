import React, { Component } from 'react';
import { AppProvider, AppContext } from '../contexts';
import { WayFindRadioButton, DrawRadioButton, DeleteRadioButton } from './Menu/RadioButton';
import { LoadSVGButton, LoadGraphButton, SaveGraphButton } from './Menu/Button';
import RelationshipTable from './RelationshipTable';
import SVGContainer from './Containers/SVGContainer';
import { GraphProvider } from '../contexts/graph.context';
import { SVGProvider } from '../contexts/svg.context';
import { If } from '../shared';
class Wayfinders extends Component {
    static contextType = AppContext;
    render() {
        return (
            <AppProvider>
                <div className="wayfinders-app">
                    <div className="menu-button" style={{ textAlign: "center" }}>
<<<<<<< HEAD
=======
                        <SVGProvider>                    
                            <SVGContainer /> 
                            <LoadSVGButton />
                        </SVGProvider>
>>>>>>> origin/master
                        <LoadGraphButton />
                        <SaveGraphButton />
                        <DrawRadioButton />
                        <DeleteRadioButton />
                        <WayFindRadioButton />
                    </div>
<<<<<<< HEAD
                    <div className="svg-zone" style={{ textAlign: "center" }}>
                        <SVGProvider>
                            <LoadSVGButton />
                            <div className="svg-container" style={{ textAlign: "center" }}>
                                <SVGContainer />
                            </div>
                        </SVGProvider>
                    </div>
                    <div className="relationship-table">
                        <RelationshipTable />
                    </div>
=======
                    {/* <div className="relationship-table">
                        <If
                            condition={true}
                            component={RelationshipTable}
                        />
                    </div> */}
>>>>>>> origin/master
                </div>
            </AppProvider>
        )
    }
}
export default Wayfinders;