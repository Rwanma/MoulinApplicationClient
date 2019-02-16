
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
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import './AnzGrid.css'
import Button from "@material-ui/core/Button/Button";

const styles = {
    grid: {
        width: '60%',
    },
};


class AnzGrid extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columnDefs: [],
            rowData: [],
            beginDate: new Date(),
            endDate: new Date(),
            useFilter: true,
            errorMessageDates: 'Choose a date range'
        };


    }

    formatDate(datum) {
        let date = new Date(datum);
        return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    };

    getDataForSpendingGrid = async (beginDate, endDate, useFilter) => {
        let queryUrlWithDates = 'http://localhost:3005/getAnzSpending?beginDate=' + this.formatDate(beginDate) + '&endDate=' + this.formatDate(endDate) +
            '&useFilter=' + useFilter;
        console.log(queryUrlWithDates);
        const response = await fetch(queryUrlWithDates);
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


    handleSwitchChange = name => event => {
        this.getDataForSpendingGrid(this.state.beginDate, this.state.endDate, !this.state.useFilter);
        this.setState({ useFilter: !this.state.useFilter });
    };

    render() {

        //alert('allow : ' + this.props.allowConfig);


        return (
            <div className="anz-spending">
                <div className='button-container'>

                    {(this.props.allowConfig === true) ? (
                        <div className='toggle-button-anz'>
                            <Button style={{ justifyContent: 'center' }}
                                    variant="contained"
                                    onClick={() => {
                                        this.props.toggleConfigFunc()
                                    }}>
                                Toggle Config
                            </Button>
                        </div>
                        ) : (null)}

                    <div className='begin-date-picker'>
                        <DayPickerInput
                            formatDate={formatDate}
                            parseDate={parseDate}
                            placeholder={`${formatDate(new Date(), 'll')}`}
                            onDayChange={this.handleBeginDayChange.bind(this)}
                        />
                    </div>

                    <div className='end-date-picker'>
                        <DayPickerInput
                            formatDate={formatDate}
                            parseDate={parseDate}
                            placeholder={`${formatDate(new Date(), 'll')}`}
                            onDayChange={this.handleEndDayChange.bind(this)}
                        />
                    </div>

                    <FormControlLabel className='filter-button'
                                      control={
                                          <Switch
                                              checked={this.state.useFilter}
                                              onChange={this.handleSwitchChange()}
                                              value="useFilter"
                                              color="secondary" />
                                      }
                                      label="Use filter" />

                    <div className='error-message'>
                        {this.state.errorMessageDates}
                    </div>
                </div>


                <div
                    className='ag-theme-balham-dark'
                    style={{
                        height: '850px',
                        width: '100%'
                    }}
                >
                    <AgGridReact
                        columnDefs={this.state.columnDefs}
                        rowData={this.state.rowData}
                        enableSorting={true}
                        enableFilter={true}
                        onGridReady={this.onGridReady}>
                    </AgGridReact>
                </div>
            </div>

        );
    }

    onGridReady = params => {
        params.api.sizeColumnsToFit();
    }
}

AnzGrid.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(AnzGrid)
