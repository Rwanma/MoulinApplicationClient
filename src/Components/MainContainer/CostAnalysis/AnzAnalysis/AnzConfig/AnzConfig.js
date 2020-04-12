import * as React from 'react';
import { withStyles } from "@material-ui/core/styles/index";
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import { AgGridReact } from 'ag-grid-react';
import GridButtonRenderer from "../../../../HomemadeComponents/GridButtonRenderer/GridButtonRenderer";
import CategoryGridButtonRenderer from "../../../../HomemadeComponents/GridButtonRenderer/CategoryGridButtonRenderer";
import FilterGridButtonRenderer from "../../../../HomemadeComponents/GridButtonRenderer/FilterGridButtonRenderer";
import { FilePond } from 'react-filepond';
import Button from "@material-ui/core/Button/Button";
import TextField from '@material-ui/core/TextField';
import './AnzConfig.css'


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

            // FILTERS TABLE
            columnDefsFilters: [],
            rowDataFilters: [],

            // CATEGORY TABLE
            columnDefsCategory: [
                { headerName: "Category", field: "category" },
                {headerName: "Delete category", field: "deleteButton", cellRenderer: "categoryGridButtonRenderer"}

            ],
            rowDataCategory: [],

            // Text fields
            filterLine: '', categoryLine: '',
            context: { componentParent: this },
            frameworkButtonComponents: { gridButtonRenderer: GridButtonRenderer },
            deleteCategoryButton: {categoryGridButtonRenderer: CategoryGridButtonRenderer},
            deleteFilterButton: {filterGridButtonRenderer: FilterGridButtonRenderer},
        };

        this.loadConfigData();
    }

    onGridReady = params => {
        params.api.sizeColumnsToFit();
    };


    //***************** Load filter grid ***********************************
    loadConfigData() {
        let queryUrl = 'http://' + config.server.server_address + ':' + config.server.server_port + '/GetAllConfigData';
        this.queryServerForConfigData(queryUrl);
    }

    queryServerForConfigData = async (queryUrl) => {
        const response = await fetch(queryUrl);
        const myJsonData = await response.json();

        this.setState({
            columnDefsFilters: [
                { headerName: "Filter", field: "filter" },
                {
                    headerName: "Category",
                    field: "category",
                    width: 200,
                    cellEditor: "agSelectCellEditor",
                    editable: true,
                    cellEditorParams: {values: myJsonData.combo_box_categories}
                },
                {headerName: "Delete filter", field: "deleteButton", cellRenderer: "filterGridButtonRenderer"}
            ],
            rowDataFilters: myJsonData.spendingFilters,
            rowDataCategory: myJsonData.categories
        });
    };


    //***************** Filter change ***********************************
    addFilter = () => {
        if (this.state.filterLine.trim() === '' || this.state.filterLine === undefined) {
            alert('you cannot add an empty configuration line ')
        } else {
            let addFilterUrl = 'http://' + config.server.server_address + ':' + config.server.server_port + '/AddFilter?&filter=' + this.state.filterLine;
            this.queryServerForConfigData(addFilterUrl);
        }
    };

    deleteFilter = params => {
        let filterToDelete = this.state.rowDataFilters[parseInt(params.split(',')[0].split(' ')[1], 10)].filter;
        let deleteFilterUrl = 'http://' + config.server.server_address + ':' + config.server.server_port + '/DeleteFilter?&filter=' + filterToDelete;
        this.queryServerForConfigData(deleteFilterUrl);

    };

    handleFilterLineChange = event => {
        this.setState({ filterLine: event.target.value });
    };
    // **************************************************


    //***************** Category change ***********************************
    addCategory = () => {
        if (this.state.categoryLine.trim() === '' || this.state.categoryLine === undefined) {
            alert('you cannot add an empty category line ')
        } else {
            let addCategoryUrl = 'http://' + config.server.server_address + ':' + config.server.server_port + '/AddCategory?&category=' + this.state.categoryLine;
            this.queryServerForConfigData(addCategoryUrl);
        }
    };

    deleteCategory = params => {
        let configToDelete = this.state.rowDataCategory[parseInt(params.split(',')[0].split(' ')[1], 10)].category;
        let deleteConfigUrl = 'http://' + config.server.server_address + ':' + config.server.server_port + '/deletecategory?&category=' + configToDelete;
        this.queryServerForConfigData(deleteConfigUrl);
    };


    handleCategoryLineChange = event => {
        this.setState({ categoryLine: event.target.value });
    };
    // **************************************************


    render() {
        let serverUploadAnzLink = 'http://' + config.server.server_address + ':' + config.server.server_port + '/uploadAnzCsv';
        let serverUploadFiltersLink = 'http://' + config.server.server_address + ':' + config.server.server_port + '/uploadFilters';


        return (

            <Dialog onClose={this.props.onAnzConfigClose} aria-labelledby="simple-dialog-title"
                    open={this.props.openAnzConfig}
                    fullWidth={true}
                    maxWidth={'md'}>
                <DialogTitle id="simple-dialog-title">Spending Configuration</DialogTitle>


                <div className='upload-container'>
                    <div className='anz-csv-upload-container'>
                        <p>Upload the ANZ CSV file</p>
                        <FilePond className='filepond' server={serverUploadAnzLink} />
                    </div>
                    <div className='config-csv-upload-container'>
                        <p>Upload the config file</p>
                        <FilePond className='filepond' server={serverUploadFiltersLink}
                                  onprocessfile={() => this.loadConfigData()} />
                    </div>

                    <div className='config-add'>
                        <div className='add-config-button'>
                            <Button style={{ justifyContent: 'center' }}
                                    variant="contained"
                                    onClick={this.addFilter}>
                                Add
                            </Button>
                        </div>
                        <div className='text-field'>
                            <TextField
                                id="filterLine"
                                label="Spending filter"
                                onChange={this.handleFilterLineChange}
                                margin="normal" />
                        </div>
                    </div>

                    <div className='category-add'>
                        <div className='add-config-button'>
                            <Button style={{ justifyContent: 'center' }}
                                    variant="contained"
                                    onClick={this.addCategory}>
                                Add
                            </Button>
                        </div>
                        <div className='text-field'>
                            <TextField
                                id="filterLine"
                                label="Add category"
                                onChange={this.handleCategoryLineChange}
                                margin="normal" />
                        </div>
                    </div>
                </div>

                <div className='grids-container'>
                    <div className='ag-theme-balham-dark' style={{ height: '850px', width: '700px' }}>
                        <AgGridReact columnDefs={this.state.columnDefsFilters}
                                     rowData={this.state.rowDataFilters}
                                     enableSorting={true}
                                     enableFilter={true}
                                     context={this.state.context}
                                     frameworkComponents={this.state.deleteFilterButton}
                                     onGridReady={this.onGridReady}


                        >
                        </AgGridReact>
                    </div>


                    <div className='ag-theme-blue' style={{ height: '850px', width: '300px' }}>
                        <AgGridReact columnDefs={this.state.columnDefsCategory}
                                     rowData={this.state.rowDataCategory}
                                     enableSorting={true}
                                     enableFilter={true}
                                     context={this.state.context}
                                     frameworkComponents={this.state.deleteCategoryButton}
                                     onGridReady={this.onGridReady}
                        >
                        </AgGridReact>
                    </div>
                </div>

            </Dialog>

        );
    }


}


export default withStyles(styles)(AnzConfig)

