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
        super(props);
        this.defaultColDef = {editable: true, filter: true, sortable: false };
    }

    updateGridData = params => {
        this.gridApi = params.api;
        let weirdBugStringDate = this.gridApi.getFocusedCell().column.colId;
        if (weirdBugStringDate.includes('_1')) {
            weirdBugStringDate = weirdBugStringDate.replace('_1', '');
        }

        let rowIndex = this.gridApi.getFocusedCell().rowIndex;
        let employeeID = this.props.jsonServerData.data[rowIndex]['Employee Id'];
        let hoursChanged = this.props.jsonServerData.data[rowIndex][weirdBugStringDate];
        let employeeIdValue = this.props.jsonServerData.data[rowIndex]['Employee Id'];
        let paymentType = this.props.jsonServerData.data[rowIndex]['Payment Type'];

        console.log('updateGridData rowIndex : ' + rowIndex + ' employeeID : ' +
            employeeID + ' hoursChanged : ' + hoursChanged + ' employeeIdValue : '
            + employeeIdValue + ' paymentType : ' + paymentType + ' this.currentCellValue : ' + this.currentCellValue);

        if (hoursChanged === '' || hoursChanged === undefined) {
            hoursChanged = 0;
        }

        if (isNaN(hoursChanged) || employeeIdValue === 'Total Hours' || employeeIdValue === 'Total Payment') {
            alert('You cannot use this value for this cell');
            this.props.getJsonObjDataFromServer('GetEmployeeHoursTable', this.props.beginDate, this.props.endDate, '');

        } else {
            let extraOptions = '&employeeID=' + employeeID + '&dateSelected=' + weirdBugStringDate + '&paymentType=' + paymentType + '&hoursChanged=' + hoursChanged;
            this.props.getJsonObjDataFromServer('UpdateEmployeeHourTable', this.props.beginDate, this.props.endDate, extraOptions);
        }
    };

    render() {
        console.log('allow table change : ' + this.props.allowTableChanges);

        return (
            <div className="anz-spending">
                <div className='button-container'>

                    <DayPickerInput
                        formatDate={formatDate}
                        parseDate={parseDate}
                        placeholder={`${formatDate(new Date(), 'll')}`}
                        onDayChange={this.props.handleBeginDayChange.bind(this, 'GetEmployeeHoursTable')}
                    />
                    <DayPickerInput
                        formatDate={formatDate}
                        parseDate={parseDate}
                        placeholder={`${formatDate(new Date(), 'll')}`}
                        onDayChange={this.props.handleEndDayChange.bind(this, 'GetEmployeeHoursTable')}

                    />
                    <div>
                        {this.props.dateInputMessage}
                    </div>
                </div>


                <div className='divider-hours'>Hours Per Employee</div>
                <div className='ag-theme-balham-dark' style={{ height: '400px', width: '100%' }}>
                    {(this.props.allowTableChanges === true) ? (
                        <AgGridReact
                            columnDefs={this.props.jsonServerData.columns}
                            rowData={this.props.jsonServerData.data}
                            enableSorting={false}
                            enableFilter={false}
                            defaultColDef={this.defaultColDef}
                            tabToNextCell={this.tabToNextCell}
                            onCellEditingStopped={this.updateGridData.bind(this)}
                            onGridReady={this.onGridReady}>
                        </AgGridReact>) : (
                        <AgGridReact
                            columnDefs={this.props.jsonServerData.columns}
                            rowData={this.props.jsonServerData.data}
                            enableSorting={true}
                            enableFilter={true}>
                        </AgGridReact>)}
                </div>
                <div className='divider-salary'>Salary Per Employee</div>
                <div className='ag-theme-blue' style={{ height: '400px', width: '100%' }}>
                    <AgGridReact
                        columnDefs={this.props.jsonServerData.columns}
                        rowData={this.props.jsonServerData.dataSalary}
                        enableSorting={true}
                        enableFilter={true}
                        onGridReady={this.onGridReady}>
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
        params.api.hideOverlay();
    };
}

EmployeeHours.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(EmployeeHours)

