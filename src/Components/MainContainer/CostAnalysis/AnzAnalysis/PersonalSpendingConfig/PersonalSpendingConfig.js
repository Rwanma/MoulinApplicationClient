import * as React from 'react';
import { withStyles } from "@material-ui/core/styles/index";
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import { AgGridReact } from 'ag-grid-react';
import PersonalSpendingGridButtonRenderer from "../../../../HomemadeComponents/GridButtonRenderer/PersonalSpendingGridButtonRenderer";

import { FilePond } from 'react-filepond';
import Button from "@material-ui/core/Button/Button";
import TextField from '@material-ui/core/TextField';

import JqxComboBox from 'jqwidgets-framework/jqwidgets-react-tsx/jqxcombobox';

import './PersonalSpendingConfig.css'





let config = require('../../../../../Config/config-moulin');


const styles = {
    grid: {
        width: '30%',
    },
};

class PersonalSpendingConfig extends React.Component {
    constructor(props) {
        super(props);

        this.spenderNames = ['MARWAN', 'SAMER', 'BOTH'];
        this.personalSpending = '';
        this.spenderName = 'MARWAN';

        this.state = {
            columnDefsPersonalSpending: [
                { headerName: "Personal Spending", field: "personal_spending" },
                { headerName: "Person name", field: "person_name" },
                { headerName: "Delete Personal Spending", field: "deleteButton", cellRenderer: "personalSpendingButtonRenderer" }
            ],

            context: {componentParent: this},
            deletePersonalSpendingButton: { personalSpendingButtonRenderer: PersonalSpendingGridButtonRenderer },
            rowDataPersonalSpending: [],
        };
        this.loadConfigData();
    }




    //***************** Load filter grid ***********************************
    loadConfigData() {
        let queryUrl = 'http://' + config.server.server_address + ':' + config.server.server_port + '/GetAllPersonalSpendingConfig';
        this.queryServerForConfigData(queryUrl);
    }

    queryServerForConfigData = async (queryUrl) => {
        const response = await fetch(queryUrl);
        const myJsonData = await response.json();
        this.setState({ rowDataPersonalSpending: myJsonData});
    };

    updatePersonalSpendingChange = event => {
        this.personalSpending = event.target.value;
    };


    onSpenderSelect = event => {
        this.spenderName = this.spenderNames[event.args.index];
    };

    addPersonalSpending = () => {
        let queryUrl = 'http://' + config.server.server_address + ':' + config.server.server_port + '/AddPersonalSpending?&personal_spending=' + this.personalSpending + '&spender_name=' + this.spenderName;
        this.queryServerForConfigData(queryUrl);
    };


    deletePersonalSpending = params => {
        let filterToDelete = this.state.rowDataPersonalSpending[parseInt(params.split(',')[0].split(' ')[1], 10)].personal_spending;
        let deleteFilterUrl = 'http://' + config.server.server_address + ':' + config.server.server_port + '/DeletePersonalSpending?&personal_spending=' + filterToDelete;
        this.queryServerForConfigData(deleteFilterUrl);

    };




    render() {
        let serverUploadPersonalSpending = 'http://' + config.server.server_address + ':' + config.server.server_port + '/uploadPersonalSpendingCsv';

        return (
            <Dialog onClose={this.props.onPersonalSpendingConfigClose} aria-labelledby="simple-dialog-title"
                    open={this.props.openPersonalSpendingConfig} fullWidth={true} maxWidth={'md'}>
                <DialogTitle id="simple-dialog-title">Personal Spending Configuration</DialogTitle>

                <div className='upload-container'>
                    <div className='anz-csv-upload-container'>
                        <p>Upload the Personal Spending file</p>
                        <FilePond className='filepond' server={serverUploadPersonalSpending} onprocessfile={() => this.loadConfigData()} />
                    </div>

                    <div className='config-add'>
                        <div className='add-config-button-personal-spending'>
                            <Button style={{ justifyContent: 'center' }}
                                    variant="contained"
                                    onClick={this.addPersonalSpending}>
                                Add
                            </Button>
                        </div>
                        <TextField
                            id="personalSpending"
                            label="Personal Spending Line"
                            className='spending-text-field'
                            onChange={this.updatePersonalSpendingChange}
                            margin="normal" />
                        <div className='combo-box-spender-config'>
                            <JqxComboBox
                                width={250} height={25}
                                source={this.spenderNames} selectedIndex={0} onSelect={this.onSpenderSelect}/>
                        </div>
                    </div>
                </div>

                <div className='ag-theme-balham-dark' style={{ height: '850px', width: '100%' }}>
                    <AgGridReact columnDefs={this.state.columnDefsPersonalSpending}
                                 rowData={this.state.rowDataPersonalSpending}
                                 enableSorting={true}
                                 enableFilter={true}
                                 context={this.state.context}
                                 frameworkComponents={this.state.deletePersonalSpendingButton}
                                 onGridReady={this.onGridReady}
                    >
                    </AgGridReact>
                </div>
            </Dialog>
        );
    }


}


export default withStyles(styles)(PersonalSpendingConfig)

