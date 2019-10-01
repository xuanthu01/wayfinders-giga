import React, { useContext } from 'react'
import { handleSaveRelationship } from "../../../shared";
import { AppContext } from '../../../contexts/app.context';
// import SaveIcon from '@material-ui/icons/Save';
// import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
// import clsx from 'clsx';
export default function SaveGraphButton() {
    // console.log("SaveGraphButton");
    const { graphs } = useContext(AppContext);
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
    return (
        <AppContext.Consumer>
            {() => (
                <>
                    <button onClick={() => handleSaveRelationship(graphs, "graphs")}>Save Graphs</button><br />
                    {/* <Button variant="contained" size="small" color="primary" className={classes.button} onClick={() => handleSaveRelationship(graphs, "graphs")}>
                        <SaveIcon className={clsx(classes.leftIcon, classes.iconSmall)} />
                        Save Graphs
                    </Button> */}
                    {/* <br /> */}
                </>
            )}
        </AppContext.Consumer>
    )
}