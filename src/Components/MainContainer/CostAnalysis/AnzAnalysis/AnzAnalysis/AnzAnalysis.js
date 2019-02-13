
import * as React from 'react';
import { AgGridReact } from 'ag-grid-react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import GridButtonRenderer from '../../../../../Components/HomemadeComponents/GridButtonRenderer.js';
import Button from "@material-ui/core/Button/Button";
import TextField from '@material-ui/core/TextField';
import { FilePond } from 'react-filepond';
import 'react-day-picker/lib/style.css';
import 'ag-grid-community/dist/styles/ag-theme-balham-dark.css';
import 'react-day-picker/lib/style.css';
import AnzGrid from '../AnzGrid/AnzGrid';

import './AnzAnalysis.css'

const styles = {
    grid: {
        width: '30%',
    },
};


class AnzAnalysis extends React.Component {

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


    getAllCategories() {
        let queryUrl = 'http://localhost:3005/GetAnzConfiguration';
        this.getCategories(queryUrl);
    }


    addConfig = () => {
        if (this.state.configLine.trim() === '' || this.state.configLine === undefined) {
            alert('you cannot add an empty configuration line ')
        } else {
            let addConfigUrl = 'http://localhost:3005/AddAnzConfiguration?&category=' + this.state.configLine;
            this.getCategories(addConfigUrl);
        }
    };

    deleteConfig = params => {
        let configToDelete = this.state.rowData[parseInt(params.split(',')[0].split(' ')[1], 10)].categories;
        let addConfigUrl = 'http://localhost:3005/DeleteAnzConfiguration?&category=' + configToDelete;
        this.getCategories(addConfigUrl);
    };

    getCategories = async (queryUrl) => {
        const response = await fetch(queryUrl);
        const myJsonData = await response.json();
        this.setState({ rowData: myJsonData });
    };


    handleConfigLineChange = event => {
        this.setState({ configLine: event.target.value });
    };

    toggleConfigFunc() {
        this.setState({ toggleConfig: !this.state.toggleConfig });
    };


    render() {
        return (
            <div className="anz-spending">
                {(this.state.toggleConfig === true) ? (
                    <div className='upload-container'>
                        <div className='anz-csv-upload-container'>
                            <p>Upload the ANZ CSV file</p>
                            <FilePond className='filepond' server='http://localhost:3005/uploadAnzCsv' />
                        </div>
                        <div className='config-csv-upload-container'>
                            <p>Upload the configuration file</p>
                            <FilePond className='filepond' server='http://localhost:3005/uploadConfigurationCategory'
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
                ) : (null)
                }

                <div className='active-div-container'>
                    <div className='grid-divs'>
                        {(this.state.toggleConfig === true) ? (
                            <div className='ag-theme-blue' style={{ height: '850px', width: '30%' }}>
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
                        ) : (null)
                        }
                        <div className='spending-container' style={{ height: '600px', width: '100%' }}>
                            <AnzGrid toggleConfigFunc={this.toggleConfigFunc.bind(this)} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    onGridReady = params => {
        params.api.sizeColumnsToFit();
    }
}

AnzAnalysis.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(AnzAnalysis)
