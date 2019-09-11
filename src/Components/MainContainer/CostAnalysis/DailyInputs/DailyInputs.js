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

const styles = { grid: { width: '60%' } };

class DailyInputs extends React.Component {

    updateGridData = async params => {
        this.gridApi = params.api;
        let weirdBugStringDate = this.gridApi.getFocusedCell().column.colId;
        if (weirdBugStringDate.includes('_1')) {
            weirdBugStringDate = weirdBugStringDate.replace('_1', '');
        }

        let inputTypeChanged = this.props.jsonServerData.data[this.gridApi.getFocusedCell().rowIndex]['Daily Input'];
        let valueChanged = this.props.jsonServerData.data[this.gridApi.getFocusedCell().rowIndex][weirdBugStringDate];

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

        if (valueChanged === '' || valueChanged === undefined || valueChanged === null) {
            valueChanged = 0;
        }

        if (isNaN(valueChanged) ||
            inputTypeChanged === undefined || inputTypeChanged === 'Total Revenu' ||
            inputTypeChanged === 'Total Milk/Coffee Spending' || inputTypeChanged === 'Total Day Estimate') {
            alert('You cannot use this value for this cell');
            this.props.getJsonObjDataFromServer('GetDailyInputs', this.props.beginDate, this.props.endDate, '');

        } else {
            let extraOptions = '&workDate=' + weirdBugStringDate + '&typeChanged=' + inputTypeChanged + '&newValue=' + valueChanged;
            this.props.getJsonObjDataFromServer('UpdateDailyInputs', this.props.beginDate, this.props.endDate, extraOptions);
        }
    };



    render() {
        return (
            <div className="anz-spending">
                <div className='button-container'>
                    <DayPickerInput
                        formatDate={formatDate}
                        parseDate={parseDate}
                        placeholder={`${formatDate(new Date(), 'll')}`}
                        onDayChange={this.props.handleBeginDayChange.bind(this, 'GetDailyInputs')}
                    />
                    <DayPickerInput
                        formatDate={formatDate}
                        parseDate={parseDate}
                        placeholder={`${formatDate(new Date(), 'll')}`}
                        onDayChange={this.props.handleEndDayChange.bind(this, 'GetDailyInputs')}
                    />
                    <div>
                        {this.props.dateInputMessage}
                    </div>
                </div>


                <div className='ag-theme-balham-dark' style={{ height: '800px', width: '100%' }}>
                    <AgGridReact
                        columnDefs={this.props.jsonServerData.columns}
                        rowData={this.props.jsonServerData.data}
                        enableSorting={true}
                        enableFilter={true}
                        onGridReady={this.onGridReady}
                        onCellEditingStopped={this.updateGridData}
                        tabToNextCell={this.tabToNextCell}
                    >
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
    }
}

DailyInputs.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(DailyInputs)

