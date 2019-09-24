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
                        <SVGProvider>
                            <LoadSVGButton />
                            <div className="svg-container">
                                <SVGContainer />
                            </div>
                        </SVGProvider>
                        <LoadGraphButton />
                        <SaveGraphButton />
                        <DrawRadioButton />
                        <DeleteRadioButton />
                        <WayFindRadioButton />
                    </div>
                    <div className="relationship-table">
                        {/* <If
                            condition={true}
                            component={RelationshipTable}
                        /> */}
                    </div>
                </div>
            </AppProvider>
        )
    }
}
export default Wayfinders;