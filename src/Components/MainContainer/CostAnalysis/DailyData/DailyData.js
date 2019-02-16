
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
import './DailyData.css'

const styles = {
    grid: {
        width: '60%',
    },
};


class DailyData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columnDefs: [],
            rowDataReal: [],
            rowDataEstimate: [],
            beginDate: new Date(),
            endDate: new Date(),
            errorMessageDates: 'Choose a date range'
        };
    }

    formatDate(datum) {
        let date = new Date(datum);
        return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    };

    getDataForSpendingGrid = async (beginDate, endDate) => {
        let queryUrlWithDates = 'http://localhost:3005/getFinancialDailyData?beginDate=' + this.formatDate(beginDate) + '&endDate=' + this.formatDate(endDate);
        console.log(queryUrlWithDates);
        const response = await fetch(queryUrlWithDates);
        const myJsonData = await response.json();
        console.log(myJsonData);

        if (myJsonData.columns.length !== undefined) {
            this.setState({
                columnDefs: myJsonData.columns,
                rowDataReal: myJsonData.dataReal,
                rowDataEstimate: myJsonData.dataEstimate
            });
        }
        else {
            this.setState({ columnDefs: [], rowData: [], rowDataEstimate: [] });
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
                this.getDataForSpendingGrid(date, this.state.endDate, this.state.useFilter);
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
                this.getDataForSpendingGrid(this.state.beginDate, date, this.state.useFilter);
            }
        } else {
            this.setState({ errorMessageDates: 'wrong date format' });
        }
    }


    render() {
        return (
            <div className="anz-spending">
                <div className='button-container'>
                    <div className='begin-date-picker-real'>
                        <DayPickerInput
                            formatDate={formatDate}
                            parseDate={parseDate}
                            placeholder={`${formatDate(new Date(), 'll')}`}
                            onDayChange={this.handleBeginDayChange.bind(this)}
                        />
                    </div>

                    <div className='end-date-picker-real'>
                        <DayPickerInput
                            formatDate={formatDate}
                            parseDate={parseDate}
                            placeholder={`${formatDate(new Date(), 'll')}`}
                            onDayChange={this.handleEndDayChange.bind(this)}
                        />
                    </div>
                    <div className='error-message'>
                        {this.state.errorMessageDates}
                    </div>
                </div>
                <div className='divider-hours'>Daily Real Revenue</div>
                <div className='ag-theme-balham-dark' style={{ height: '300px', width: '100%' }}>
                    <AgGridReact
                        columnDefs={this.state.columnDefs}
                        rowData={this.state.rowDataReal}
                        enableSorting={true}
                        enableFilter={true}
                        onGridReady={this.onGridReady}>
                    </AgGridReact>
                </div>
                <div className='divider-salary'>Daily Estimate Revenue</div>
                <div className='ag-theme-blue' style={{ height: '300px', width: '100%' }}>
                    <AgGridReact
                        columnDefs={this.state.columnDefs}
                        rowData={this.state.rowDataEstimate}
                        enableSorting={true}
                        enableFilter={true}>
                    </AgGridReact>
                </div>
            </div>
        );
    }

    onGridReady = params => {
        params.api.sizeColumnsToFit();
    }
}

DailyData
    .propTypes = {
    classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(DailyData)
