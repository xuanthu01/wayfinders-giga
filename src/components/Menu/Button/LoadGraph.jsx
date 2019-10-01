import React, { useContext } from 'react'
import { AppContext } from '../../../contexts/app.context';
// import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
// import CloudUploadIcon from '@material-ui/icons/CloudUpload';
export default function LoadGraphButton(props) {
    // console.log("LoadGraphButton");
    const useStyles = makeStyles(theme => ({
        button: {
          margin: theme.spacing(1),
        },
        leftIcon: {
          marginRight: theme.spacing(1),
        },
        rightIcon: {
          marginLeft: theme.spacing(1),
        },
        iconSmall: {
          fontSize: 20,
        },
      }));
    const classes = useStyles();
    const { handleGraphsFileUpload } = useContext(AppContext);
    const handleLoadGraphsClick = async () => {
        // console.log(document.getElementsByClassName("menuOfMap").length !== );
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
                <>
                {/* <Button id="loadGraph" variant="contained" color="primary" className={classes.button} onClick={handleLoadGraphsClick}>
                    Load Graphs File
                    <CloudUploadIcon className={classes.rightIcon} />
                </Button> */}
                <button variant="outlined" id="loadGraph" onClick={handleLoadGraphsClick} >Load Graphs File</button> 
               
                </>
            )}
        </AppContext.Consumer>
    )
}