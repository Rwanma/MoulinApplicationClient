import * as React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import 'react-day-picker/lib/style.css';
import 'date-fns';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'ag-grid-community/dist/styles/ag-theme-balham-dark.css';
import 'react-day-picker/lib/style.css';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import './AnzGrid.css'
import Button from "@material-ui/core/Button/Button";
import AnzConfig from '../AnzConfig/AnzConfig';

import 'jqwidgets-scripts/jqwidgets/styles/jqx.base.css';
import 'jqwidgets-scripts/jqwidgets/styles/jqx.dark.css';
import JqxGrid, { IGridProps, jqx  } from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxgrid';
import JqxDateTimeInput from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxdatetimeinput';



let config = require('../../../../../Config/config-moulin');


const styles = {
    grid: {
        width: '60%',
    },
};


class AnzGrid extends React.Component {

    constructor(props) {
        super(props);

        let todayDate= new Date();
        todayDate.setHours(0,0,0,0);
        this.state = {
            columnDefs: [],
            rowData: [],
            beginDate: todayDate,
            endDate: todayDate,
            useFilter: true,
            groupByCategory: false,
            errorMessageDates: 'Choose a date range',
            openConfig: false,
            anzJQGridSpendingColumns :[],
            anzJQGridSource :{}
        };
    }

    formatDate(datum) {
        let date = new Date(datum);
        return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    };

    getDataForSpendingGrid = async (beginDate, endDate, useFilter, groupByCategory) => {
        let queryUrlWithDates = 'http://' + config.server.server_address + ':3005/getGridSpending?beginDate=' + this.formatDate(beginDate) + '&endDate=' + this.formatDate(endDate) +
            '&useFilter=' + useFilter + '&groupByCategory=' + groupByCategory;
        console.log(queryUrlWithDates);

        const response = await fetch(queryUrlWithDates);
        const myJsonData = await response.json();
        let jqDataSource = { datatype: 'local', localdata: myJsonData.agGridData };

        if (myJsonData.agGridColumns.length !== undefined) {
            this.setState({ columnDefs: myJsonData.agGridColumns, rowData: myJsonData.agGridData,  anzJQGridSpendingColumns: myJsonData.jqGridColumns, anzJQGridSource: new jqx.dataAdapter(jqDataSource) });
        }else {
            this.setState({ columnDefs: [], rowData: [] });
        }
    };


    handleBeginDayChange(event) {
        const day = event.args.date;
        if (day !== undefined) {
            let date = new Date((day.getMonth() + 1) + '/' + day.getDate() + '/' + day.getFullYear());
            this.setState({ beginDate: date });
            if (date > this.state.endDate) {
                this.setState({ errorMessageDates: 'end date should be after begin date' });
                this.setState({ columnDefs: [], rowData: [], dataSalary: [] });
            } else {
                this.setState({ errorMessageDates: '' });
                this.getDataForSpendingGrid(date, this.state.endDate, this.state.useFilter, this.state.groupByCategory);
            }
        } else {
            this.setState({ errorMessageDates: 'wrong date format' });
        }
    }



    handleEndDayChange(event) {
        const day = event.args.date;
        if (day !== undefined) {
            let date = new Date((day.getMonth() + 1) + '/' + day.getDate() + '/' + day.getFullYear());
            this.setState({ endDate: date });
            if (this.state.beginDate > date) {
                this.setState({ errorMessageDates: 'end date should be after begin date' });
                this.setState({ columnDefs: [], rowData: [], dataSalary: [] });
            } else {
                this.setState({ errorMessageDates: '' });
                this.getDataForSpendingGrid(this.state.beginDate, date, this.state.useFilter, this.state.groupByCategory);
            }
        } else {
            this.setState({ errorMessageDates: 'wrong date format' });
        }
    }


    handleFilterSwitchChange = name => event => {
        this.getDataForSpendingGrid(this.state.beginDate, this.state.endDate, !this.state.useFilter, this.state.groupByCategory);
        this.setState({ useFilter: !this.state.useFilter, groupByCategory : false });
    };

    handleCategorySwitchChange = name => event => {
        this.getDataForSpendingGrid(this.state.beginDate, this.state.endDate, this.state.useFilter, !this.state.groupByCategory);
        this.setState({ groupByCategory: !this.state.groupByCategory });
    };


    showConfig() {
        this.setState({ openConfig: true });
    }

    handleConfigClose = () => {
        this.setState({ openConfig: false });
    };

    render() {

        return (
            <div className="anz-spending">
                <div className='button-container'>

                    {(this.props.allowConfig === true) ? (
                        <div className='toggle-button-anz'>
                            <Button style={{ justifyContent: 'center' }}
                                    variant="contained"
                                    onClick={this.showConfig.bind(this)}>
                                Toggle Config
                            </Button>
                        </div>
                    ) : (null)}

                    <div className={'begin-date-picker'}>
                        <JqxDateTimeInput width={115} height={25} onValueChanged={this.handleBeginDayChange.bind(this)}/>
                        <br/>
                    </div>
                    <div className={'end-date-picker'}>
                        <JqxDateTimeInput width={115} height={25} onValueChanged={this.handleEndDayChange.bind(this)}/>
                        <br/>

                    </div>

                    <FormControlLabel className='filter-button'
                                      control={ <Switch checked={this.state.useFilter} onChange={this.handleFilterSwitchChange()} value="useFilter" color="secondary" /> }
                                      label="Use filter" />

                    {(this.state.useFilter === true) ? (
                        <FormControlLabel className='filter-button'
                                          control={ <Switch checked={this.state.groupByCategory} onChange={this.handleCategorySwitchChange()} value="groupByCategory" color="primary" /> }
                                          label="Group by category" />
                    ) : (null)}

                    <div className='error-message'>
                        {this.state.errorMessageDates}
                    </div>
                </div>

                <div className='ag-theme-balham-dark'  style={{ height: '700px', width: '99.8%' }} >
                    <JqxGrid width='100%' height='100%' columns={this.state.anzJQGridSpendingColumns} source={this.state.anzJQGridSource}
                             sortable={true} theme={'dark'} groupable={this.state.groupByCategory} groups={['Category']}
                             showaggregates={this.state.groupByCategory} showgroupaggregates={this.state.groupByCategory} showstatusbar={this.state.groupByCategory}/>

                    <AnzConfig openConfig={this.state.openConfig} onConfigClose={this.handleConfigClose} />
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
