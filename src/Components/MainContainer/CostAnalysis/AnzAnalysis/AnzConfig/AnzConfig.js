import * as React from 'react';
import { withStyles } from "@material-ui/core/styles/index";
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import { AgGridReact } from 'ag-grid-react';
import GridButtonRenderer from "../../../../HomemadeComponents/GridButtonRenderer";
import { FilePond } from 'react-filepond';
import Button from "@material-ui/core/Button/Button";
import TextField from '@material-ui/core/TextField';



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
            toggleConfig: false,
            dialogueOpen: true
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

    addConfig = () => {
        if (this.state.configLine.trim() === '' || this.state.configLine === undefined) {
            alert('you cannot add an empty configuration line ')
        } else {
            let addConfigUrl = 'http://' + config.server.server_address + ':3005/AddAnzConfiguration?&category=' + this.state.configLine;
            this.getCategories(addConfigUrl);
        }
    };

    deleteConfig = params => {
        let configToDelete = this.state.rowData[parseInt(params.split(',')[0].split(' ')[1], 10)].categories;
        let addConfigUrl = 'http://' + config.server.server_address + ':3005/DeleteAnzConfiguration?&category=' + configToDelete;
        this.getCategories(addConfigUrl);
    };




    render() {
        let serverUploadAnz = 'http://' + config.server.server_address + ':3005/uploadAnzCsv';
        let serverUploadConfig = 'http://' + config.server.server_address + ':3005/uploadConfigurationCategory';


        return (

            <Dialog onClose={this.props.onConfigClose} aria-labelledby="simple-dialog-title"
                    open={this.props.openConfig}
                    fullWidth={true}
                    maxWidth={'xl'}>
                <DialogTitle id="simple-dialog-title">Set backup account</DialogTitle>


                <div className='upload-container'>
                    <div className='anz-csv-upload-container'>
                        <p>Upload the ANZ CSV file</p>
                        <FilePond className='filepond' server={serverUploadAnz} />
                    </div>
                    <div className='config-csv-upload-container'>
                        <p>Upload the configuration file</p>
                        <FilePond className='filepond' server={serverUploadConfig}
                                  onprocessfile={() => this.getAllCategories()} />
                    </div>

                    <div className='config-add'>
                        <TextField
                            id="configLine"
                            label="Configuration line"
                            className='text-field'
                            onChange={this.handleConfigLineChange}
                            margin="normal" />
                        <div className='add-config-button'>
                            <Button style={{ justifyContent: 'center' }}
                                    variant="contained"
                                    onClick={this.addConfig}>
                                Add
                            </Button>
                        </div>
                    </div>
                </div>


                <div className='ag-theme-blue' style={{ height: '850px', width: '1000px' }}>

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

