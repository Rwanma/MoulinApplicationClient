import * as React from 'react';
import { AgGridReact } from 'ag-grid-react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import 'date-fns';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import { formatDate, parseDate, } from 'react-day-picker/moment';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'ag-grid-community/dist/styles/ag-theme-balham-dark.css';
import 'ag-grid-community/dist/styles/ag-theme-blue.css';
import 'react-day-picker/lib/style.css';
import './EmployeeHours.css'
let config = require('../../../../Config/config-moulin');

const styles = {
    grid: {
        width: '60%',
    },
};


class EmployeeHours extends React.Component {
    constructor(props) {
        let todayDate= new Date();
        todayDate.setHours(0,0,0,0);
        super(props);
        this.state = {
            columnDefs: [],
            rowData: [],
            beginDate: todayDate,
            endDate: todayDate,
            errorMessageDates: 'Choose a date range',
            sortable: false
        };

        this.defaultColDef = {
            editable: true,
            filter: true,
            sortable: false
        };
    }

    formatDate(datum) {
        let date = new Date(datum);
        return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    };

    getDataForEmployeeGrid = async (queryUrlWithDates) => {
        console.log(queryUrlWithDates);
        const response = await fetch(queryUrlWithDates);
        const myJsonData = await response.json();

        if (myJsonData.columns.length !== undefined) {
            this.setState({
                columnDefs: myJsonData.columns,
                rowData: myJsonData.data,
                dataSalary: myJsonData.dataSalary
            });
        }
        else {
            this.setState({ columnDefs: [], rowData: [], dataSalary: [] });
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
                let queryUrlWithDates = 'http://' + config.server.server_address + ':3005/GetEmployeeHoursTable?beginDate=' + this.formatDate(date) + '&endDate=' + this.formatDate(this.state.endDate);
                this.getDataForEmployeeGrid(queryUrlWithDates);
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
                let queryUrlWithDates = 'http://' + config.server.server_address + ':3005/GetEmployeeHoursTable?beginDate=' + this.formatDate(this.state.beginDate) + '&endDate=' + this.formatDate(date);
                this.getDataForEmployeeGrid(queryUrlWithDates);
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


                <div className='divider-hours'>Hours Per Employee</div>
                <div className='ag-theme-balham-dark' style={{ height: '400px', width: '100%' }}>
                    {(this.props.allowTableChanges === true) ? (
                        <AgGridReact
                            columnDefs={this.state.columnDefs}
                            rowData={this.state.rowData}
                            enableSorting={true}
                            enableFilter={true}
                            defaultColDef={this.defaultColDef}
                            getRowNodeId={this.state.getRowNodeId}
                            tabToNextCell={this.tabToNextCell}
                            onCellEditingStopped={this.updateGridData.bind(this)}
                            onGridReady={this.onGridReady}>
                        </AgGridReact>) : (
                        <AgGridReact
                            columnDefs={this.state.columnDefs}
                            rowData={this.state.rowData}
                            enableSorting={true}
                            enableFilter={true}>
                        </AgGridReact>)}
                </div>
                <div className='divider-salary'>Salary Per Employee</div>
                <div className='ag-theme-blue' style={{ height: '400px', width: '100%' }}>
                    <AgGridReact
                        columnDefs={this.state.columnDefs}
                        rowData={this.state.dataSalary}
                        enableSorting={true}
                        enableFilter={true}>
                    </AgGridReact>
                </div>
            </div>

        );
    }

    tabToNextCell(params) {
        return null;
    }

    onGridReady = params => {
        params.api.sizeColumnsToFit();
    };

    updateGridData = params => {
        this.gridApi = params.api;
        let weirdBugStringDate = this.gridApi.getFocusedCell().column.colId;
        if (weirdBugStringDate.includes('_1')) {
            weirdBugStringDate = weirdBugStringDate.replace('_1', '');
        }

        let rowIndex = this.gridApi.getFocusedCell().rowIndex;
        let employeeID = this.state.rowData[rowIndex]['Employee Id'];
        let hoursChanged = this.state.rowData[rowIndex][weirdBugStringDate];
        let employeeIdValue = this.state.rowData[rowIndex]['Employee Id'];
        let paymentType = this.state.rowData[rowIndex]['Payment Type'];

        console.log('updateGridData rowIndex : ' + rowIndex + ' employeeID : ' +
            employeeID + ' hoursChanged : ' + hoursChanged + ' employeeIdValue : '
            + employeeIdValue + ' paymentType : ' + paymentType + ' this.currentCellValue : ' + this.currentCellValue);

        if (hoursChanged === '' || hoursChanged === undefined) {
            hoursChanged = 0;
        }

        if (isNaN(hoursChanged) || employeeIdValue === 'Total Hours' || employeeIdValue === 'Total Payment') {
            alert('You cannot use this value for this cell');
            let queryUrlWithDates = 'http://' + config.server.server_address + ':3005/GetEmployeeHoursTable?beginDate=' + this.formatDate(this.state.beginDate) +
                '&endDate=' + this.formatDate(this.state.endDate);
            this.getDataForEmployeeGrid(queryUrlWithDates);
        } else {
            let queryUrlWithDates = 'http://' + config.server.server_address + ':3005/UpdateEmployeeHourTable?' +
                'beginDate=' + this.formatDate(this.state.beginDate) +
                '&endDate=' + this.formatDate(this.state.endDate) +
                '&employeeID=' + employeeID +
                '&dateSelected=' + weirdBugStringDate +
                '&paymentType=' + paymentType +
                '&hoursChanged=' + hoursChanged;
            this.getDataForEmployeeGrid(queryUrlWithDates);
        }
    };
}

EmployeeHours.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(EmployeeHours)

