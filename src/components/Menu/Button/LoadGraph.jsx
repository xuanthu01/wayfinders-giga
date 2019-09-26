import React, { useContext } from 'react'
import { AppContext } from '../../../contexts/app.context';
export default function LoadGraphButton(props) {
    const { handleGraphsFileUpload } = useContext(AppContext);
    const handleLoadGraphsClick = async () => {
        const fileInput = await renderGraphsLoader();
        await fileInput.addEventListener("change", e => {
            if (fileInput.files[0].name.match(/\.(txt|json)$/)) {
                handleGraphsFileUpload(e);
            } else {
                alert(`File not supported, .txt or .json files only`);
            }
        });
    }
    const renderGraphsLoader = () => {
        const el = document.createElement("div");
        el.innerHTML = "<input type='file'/>";
        const fileInput = el.firstChild;
        fileInput.click();
        return fileInput;
    }
    return (
        <AppContext.Consumer>
            {() => (
                <button onClick={handleLoadGraphsClick}>Load Graphs File</button>
            )}
        </AppContext.Consumer>
    )
}