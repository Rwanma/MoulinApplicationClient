import * as React from 'react';
import {withStyles} from "@material-ui/core/styles/index";
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import { AgGridReact } from 'ag-grid-react';
import GridButtonRenderer from "../../../../HomemadeComponents/GridButtonRenderer";
let config = require('../../../../../Config/config-moulin');



const styles = {
    grid: {
        width: '30%',
    },
};

class AnzConfig extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columnDefs: [
                { headerName: "Configuration Line", field: "categories" },
                { headerName: "", field: "deleteButton", cellRenderer: "gridButtonRenderer" }
            ],
            rowData: [{ categories: '' }],
            configLine: '',

            context: { componentParent: this },
            frameworkComponents: { gridButtonRenderer: GridButtonRenderer },
            selectedFile: '',
            loaded: 0,
            toggleConfig: false
        };
        this.getAllCategories();

    }

    getCategories = async (queryUrl) => {
        const response = await fetch(queryUrl);
        const myJsonData = await response.json();
        this.setState({ rowData: myJsonData });
    };

    getAllCategories() {
        let queryUrl = 'http://' + config.server.server_address + ':3005/GetAnzConfiguration';
        this.getCategories(queryUrl);
    }

    onGridReady = params => {
        params.api.sizeColumnsToFit();
    };


    render() {
        return (

        <Dialog aria-labelledby="simple-dialog-title" open={true}>
            <DialogTitle id="simple-dialog-title">Set backup account</DialogTitle>
            <div className='ag-theme-blue' style={{ height: '850px', width: '100%' }}>

            <AgGridReact columnDefs={this.state.columnDefs}
                         rowData={this.state.rowData}
                         enableSorting={true}
                         enableFilter={true}
                         context={this.state.context}
                         frameworkComponents={this.state.frameworkComponents}
                         onGridReady={this.onGridReady}

            >
            </AgGridReact>
            </div>

        </Dialog>

        );
    }


}




export default withStyles(styles)(AnzConfig)

