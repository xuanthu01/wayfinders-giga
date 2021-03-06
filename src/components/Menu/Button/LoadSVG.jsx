import React, { Component } from 'react';
// import _ from "lodash";
import Files from 'react-files';
import { AppContext } from '../../../contexts/app.context';
import { SVGContext } from '../../../contexts/svg.context';
class LoadSVGButton extends Component {
    static contextType = SVGContext;
    constructor(props) {
        super(props);
        this.state = {
            numberOfMap: 0,
        }
    }
    componentDidMount() {

    }
    setStateAsync(state) {
        return new Promise((resolve) => {
            this.setState(state, resolve)
        });
    }
    onFilesChange = async (files) => {
        // let {numberOfMap,startIndex} = this.state;
        const { startIndex, setStartIndex, getSVGContent } = this.context;
        console.log(this.context);

        const { numberOfMap } = this.state;
        const arrUrlSvg = [];
        for (let i = this.state.numberOfMap; i < files.length; i++) {
            arrUrlSvg.push(files[i].preview.url);
        }
        setStartIndex(numberOfMap);
        await getSVGContent(arrUrlSvg);
        await this.setStateAsync({ numberOfMap: files.length });
        // this.props.onLoadFinish(arrUrlSvg, this.state.startIndex);
    }

    onFilesError = () => {

    }
    shouldComponentUpdate(nextState) {

        return false;
    }
    render() {
        console.log("LoadSvgButton");
        return (
            <AppContext.Consumer>
                {() => (
                    <SVGContext.Consumer>
                        {() => (
                            <Files
                                className='files-dropzone'
                                onChange={this.onFilesChange}
                                onError={this.onFilesError}
                                accepts={[".svg"]}
                                multiple
                                // maxFiles={3}
                                maxFileSize={10000000}
                                minFileSize={0}
                                clickable
                            >
                                Drop files here or click to upload
                        </Files>
                        )}
                    </SVGContext.Consumer>
                )}
            </AppContext.Consumer>
        )
    }


    //  return <button onClick={handleLoadSvgClick}>Load Map</button>   
}
export default LoadSVGButton
