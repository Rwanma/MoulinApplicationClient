import * as React from 'react';
import {AgGridReact} from 'ag-grid-react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import 'react-day-picker/lib/style.css';
import 'date-fns';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-fresh.css';
import 'ag-grid-community/dist/styles/ag-theme-balham-dark.css';
import 'react-day-picker/lib/style.css';
import './DailyData.css'
import 'jqwidgets-scripts/jqwidgets/styles/jqx.base.css';
import 'jqwidgets-scripts/jqwidgets/styles/jqx.darkblue.css';
import 'jqwidgets-scripts/jqwidgets/styles/jqx.energyblue.css';
import JqxGrid, {jqx} from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxgrid';
import JqxDateTimeInput from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxdatetimeinput';

const styles = {
    grid: {
        width: '60%',
    },
};

class DailyData extends React.Component {

    render() {
        return (
            <div className="anz-spending">
                <div className='button-container'>
                    <div className={'jq-date-picker'}>
                        <JqxDateTimeInput width={115} height={25} onValueChanged={this.props.handleBeginDayChange.bind(this, 'getFinancialDailyData', '')} />
                        <br/>
                    </div>
                    <div className={'jq-date-picker'}>
                        <JqxDateTimeInput width={115} height={25} onValueChanged={this.props.handleEndDayChange.bind(this, 'getFinancialDailyData', '')} />
                        <br/>
                    </div>

                    <div className='date-message'> {this.props.dateInputMessage} </div>
                </div>

                <div className='divider-hours'>Daily Real Revenue</div>
                <div className='ag-theme-balham-dark' style={{height: '200px', width: '100%'}}>
                    <AgGridReact columnDefs={this.props.jsonServerData.columns} rowData={this.props.jsonServerData.dataReal} enableSorting={true}
                                 enableFilter={true} onGridReady={this.onGridReady}>
                    </AgGridReact>
                </div>

                <div className='divider-recap'>Recap Data For The Chosen Date</div>
                <div className='recap-div' style={{height: '200px', width: '100%'}}>
                    <JqxGrid width='100%' height='100%' columns={this.props.jsonServerData.jQGridRecapColumns} altrows={true}
                             source={new jqx.dataAdapter({ datatype: 'local', localdata: this.props.jsonServerData.jQGridRecapSource })}
                             theme={'energyblue'} showaggregates={true} showstatusbar={true}  />
                </div>

                <div className='divider-average'>Average and Total Values</div>
                <div className='ag-theme-fresh' style={{height: '190px', width: '500px'}}>
                    <AgGridReact columnDefs={this.props.jsonServerData.averageDailyColumns} rowData={this.props.jsonServerData.dataAverageReal}
                                 enableSorting={true} enableFilter={true} onGridReady={this.onGridReady}>
                    </AgGridReact>
                </div>


                {/*<div className='divider-hours'>Daily Estimate Revenue</div>
                <div className='ag-theme-balham-dark' style={{ height: '200px', width: '100%' }}>
                    <AgGridReact
                        columnDefs={this.state.columnDefs}
                        rowData={this.state.rowDataEstimate}
                        enableSorting={true}
                        enableFilter={true}>
                    </AgGridReact>
                </div>*/}
            </div>
        );
    }

    onGridReady = params => {
        params.api.sizeColumnsToFit();
        params.api.hideOverlay();
    }
}

DailyData
    .propTypes = {
    classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(DailyData)
