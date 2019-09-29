import * as React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import 'date-fns';
import JqxDateTimeInput from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxdatetimeinput';
import 'react-day-picker/lib/style.css';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'ag-grid-community/dist/styles/ag-theme-balham-dark.css';
import 'ag-grid-community/dist/styles/ag-theme-blue.css';
import 'react-day-picker/lib/style.css';
import './EmployeeHours.css'
import JqxGrid, { jqx } from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxgrid';
import 'jqwidgets-scripts/jqwidgets/styles/jqx.energyblue.css';


const styles = {
    grid: {
        width: '60%',
    },
};


class EmployeeHours extends React.Component{
    constructor(props) {
        super(props);
        this.myGrid =  React.createRef();

    }
    cellEndEditEvent(event){
        let rowIndex = event.args.rowindex;
        let employeeID = this.props.jsonServerData.data[rowIndex]['Employee Id'];
        let hoursChanged = event.args.value;
        let paymentType = this.props.jsonServerData.data[rowIndex]['Payment Type'];
        let dateOfChange = event.args.datafield;

        if (hoursChanged === '' || hoursChanged === undefined) {
            hoursChanged = 0;
        }

        if (isNaN(hoursChanged) || employeeID === 'Total Hours' || employeeID === 'Total Payment') {
            alert('You cannot use this value for this cell');
            this.props.getJsonObjDataFromServer('GetEmployeeHoursTable', this.props.beginDate, this.props.endDate, '');

        } else {
            let extraOptions = '&employeeID=' + employeeID + '&dateSelected=' + dateOfChange + '&paymentType=' + paymentType + '&hoursChanged=' + hoursChanged;
            this.props.getJsonObjDataFromServer('UpdateEmployeeHourTable', this.props.beginDate, this.props.endDate, extraOptions);
        }
    }



    render() {
        return (
            <div className="anz-spending">
                <div className='button-container'>
                    <div className={'jq-date-picker'}>
                        <JqxDateTimeInput width={115} height={25} onValueChanged={this.props.handleBeginDayChange.bind(this, 'GetEmployeeHoursTable', '')} />
                        <br/>
                    </div>
                    <div className={'jq-date-picker'}>
                        <JqxDateTimeInput width={115} height={25} onValueChanged={this.props.handleEndDayChange.bind(this, 'GetEmployeeHoursTable', '')} />
                        <br/>
                    </div>
                    <div className='date-message'> {this.props.dateInputMessage} </div>
                </div>

                <div className='divider-hours'>Hours Per Employee</div>

                <div className='ag-theme-balham-dark'  style={{ height: '350px', width: '99.9%' }} >
                    <JqxGrid width='100%' height='100%'  ref={this.myGrid} columns={this.props.jsonServerData.jqGridColumns}
                             source={new jqx.dataAdapter({ datatype: 'local', localdata: this.props.jsonServerData.data})} altrows={true}
                             theme={'dark'} editable={this.props.allowTableChanges} enabletooltips={true} selectionmode={'singlecell'}
                             onCellendedit={this.cellEndEditEvent.bind(this)} />
                </div>
                <div className='divider-salary'>Salary Per Employee</div>
                <div className='ag-theme-blue' style={{ height: '400px', width: '100%' }}>
                    <JqxGrid width='100%' height='100%'  ref={this.myGrid} columns={this.props.jsonServerData.jqGridColumns}
                             source={new jqx.dataAdapter({ datatype: 'local', localdata: this.props.jsonServerData.dataSalary })}
                             theme={'energyblue'} editable={false} />
                </div>
            </div>
        );
    }
}

EmployeeHours.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(EmployeeHours)

