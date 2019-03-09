import * as React from 'react';
import { AgGridReact } from 'ag-grid-react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import { formatDate, parseDate, } from 'react-day-picker/moment';
import 'date-fns';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'ag-grid-community/dist/styles/ag-theme-balham-dark.css';
import 'react-day-picker/lib/style.css';
import './DailyInputs.css'
let config = require('../../../../Config/config-moulin');


const styles = { grid: { width: '60%' } };

class DailyInputs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columnDefs: [],
            rowData: [],
            beginDate: new Date(),
            endDate: new Date(),
            errorMessageDates: 'Choose a date range'
        };
    }

    formatDate(datum) {
        let date = new Date(datum);
        return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    };

    getDataForInputGrid = async (queryUrlWithDates) => {
        let editableTableQuery=queryUrlWithDates+'&allowTableChanges='+this.props.allowTableChanges;
        console.log(editableTableQuery);
        const response = await fetch(editableTableQuery);
        const myJsonData = await response.json();
        if (myJsonData.columns.length !== undefined) {
            this.setState({ columnDefs: myJsonData.columns, rowData: myJsonData.data });
        }
        else {
            this.setState({ columnDefs: [], rowData: [] });
        }
    };


    handleBeginDayChange(day) {
        if (day !== undefined) {
            let date = new Date((day.getMonth() + 1) + '/' + day.getDate() + '/' + day.getFullYear());
            this.setState({ beginDate: date });
            if (date > this.state.endDate) {
                this.setState({ errorMessageDates: 'end date should be after begin date' });
                this.setState({ columnDefs: [], rowData: [], dataSalary: [] });
            } else {
                this.setState({ errorMessageDates: '' });
                let queryUrlWithDates = 'http://' + config.server.server_address + ':3005/GetDailyInputs?beginDate=' + this.formatDate(date) + '&endDate=' + this.formatDate(this.state.endDate);
                this.getDataForInputGrid(queryUrlWithDates);
            }
        } else {
            this.setState({ errorMessageDates: 'wrong date format' });
        }
    }

    handleEndDayChange(day) {
        if (day !== undefined) {
            let date = new Date((day.getMonth() + 1) + '/' + day.getDate() + '/' + day.getFullYear());
            this.setState({ endDate: date });
            if (this.state.beginDate > date) {
                this.setState({ errorMessageDates: 'end date should be after begin date' });
                this.setState({ columnDefs: [], rowData: [], dataSalary: [] });
            } else {
                this.setState({ errorMessageDates: '' });
                let queryUrlWithDates = 'http://' + config.server.server_address + ':3005/GetDailyInputs?beginDate=' + this.formatDate(this.state.beginDate) + '&endDate=' + this.formatDate(date);
                this.getDataForInputGrid(queryUrlWithDates);
            }
        } else {
            this.setState({ errorMessageDates: 'wrong date format' });
        }
    }


    render() {
        return (
            <div className="anz-spending">
                <div className='button-container'>
                    <DayPickerInput
                        formatDate={formatDate}
                        parseDate={parseDate}
                        placeholder={`${formatDate(new Date(), 'll')}`}
                        onDayChange={this.handleBeginDayChange.bind(this)}
                    />
                    <DayPickerInput
                        formatDate={formatDate}
                        parseDate={parseDate}
                        placeholder={`${formatDate(new Date(), 'll')}`}
                        onDayChange={this.handleEndDayChange.bind(this)}
                    />
                    <div>
                        {this.state.errorMessageDates}
                    </div>
                </div>


                <div className='ag-theme-balham-dark' style={{ height: '800px', width: '100%' }}>
                    <AgGridReact
                        columnDefs={this.state.columnDefs}
                        rowData={this.state.rowData}
                        enableSorting={true}
                        enableFilter={true}
                        onGridReady={this.onGridReady}
                        onCellEditingStopped={this.updateGridData}
                    >
                    </AgGridReact>
                </div>
            </div>

        );
    }


    updateGridData = async params => {
        this.gridApi = params.api;
        let weirdBugStringDate = this.gridApi.getFocusedCell().column.colId;
        if (weirdBugStringDate.includes('_1')) {
            weirdBugStringDate = weirdBugStringDate.replace('_1', '');
        }

        let inputTypeChanged = this.state.rowData[this.gridApi.getFocusedCell().rowIndex]['Daily Input'];
        let valueChanged = this.state.rowData[this.gridApi.getFocusedCell().rowIndex][weirdBugStringDate];

        switch (inputTypeChanged) {
            case 'Cash Revenu':
                inputTypeChanged = 'cash_revenu';
                break;
            case 'FTPOS Revenu':
                inputTypeChanged = 'ftpos_revenu';
                break;
            case 'Coffee Bags':
                inputTypeChanged = 'coffee_bags';
                break;
            case 'Milk Cartons':
                inputTypeChanged = 'milk_cartons';
                break;
            case 'Soy Milk Cartons':
                inputTypeChanged = 'soy_cartons';
                break;
            case 'Almond Milk Cartons':
                inputTypeChanged = 'almond_cartons';
                break;
            default:
                console.log('error');
        }

        if (isNaN(valueChanged) || inputTypeChanged === undefined || inputTypeChanged === 'Total Revenu' || inputTypeChanged === 'Total Milk/Coffee Spending' || inputTypeChanged === 'Total Day Estimate') {
            alert('You cannot use this value for this cell');
            let queryUrlWithDates = 'http://' + config.server.server_address + ':3005/GetDailyInputs?beginDate=' + this.formatDate(this.state.beginDate) +
                '&endDate=' + this.formatDate(this.state.endDate);
            this.getDataForInputGrid(queryUrlWithDates);
        } else {
            let queryUrl = 'http://' + config.server.server_address + ':3005/UpdateDailyInputs?' +
                'workDate=' + weirdBugStringDate +
                '&typeChanged=' + inputTypeChanged +
                '&newValue=' + valueChanged +
                '&beginDate=' + this.formatDate(this.state.beginDate) +
                '&endDate=' + this.formatDate(this.state.endDate);

            this.getDataForInputGrid(queryUrl);
        }
    };

    onGridReady = params => {
        params.api.sizeColumnsToFit();
    }
}

DailyInputs.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(DailyInputs)

