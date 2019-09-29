import * as React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import 'react-day-picker/lib/style.css';
import 'date-fns';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'ag-grid-community/dist/styles/ag-theme-balham-dark.css';
import 'react-day-picker/lib/style.css';
import './DailyInputs.css'
import JqxGrid, { jqx } from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxgrid';
import 'jqwidgets-scripts/jqwidgets/styles/jqx.dark.css';
import JqxDateTimeInput from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxdatetimeinput';

const styles = { grid: { width: '60%' } };

class DailyInputs extends React.Component {


    cellEndEditEvent(event){
        let rowIndex = event.args.rowindex;
        let inputTypeChanged = this.props.jsonServerData.data[rowIndex]['Daily Input'];
        let dateOfChange = event.args.datafield;
        let valueChanged = event.args.value;

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
                console.log('error in Daily Inputs');
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
            let extraOptions = '&workDate=' + dateOfChange + '&typeChanged=' + inputTypeChanged + '&newValue=' + valueChanged;
            this.props.getJsonObjDataFromServer('UpdateDailyInputs', this.props.beginDate, this.props.endDate, extraOptions);
        }

    }




    render() {
        return (
            <div className="anz-spending">
                <div className='button-container'>

                    <div className={'jq-date-picker'}>
                        <JqxDateTimeInput width={115} height={25} onValueChanged={this.props.handleBeginDayChange.bind(this, 'GetDailyInputs', '')} />
                        <br/>
                    </div>
                    <div className={'jq-date-picker'}>
                        <JqxDateTimeInput width={115} height={25} onValueChanged={this.props.handleEndDayChange.bind(this, 'GetDailyInputs', '')} />
                        <br/>
                    </div>

                    <div className='date-message'> {this.props.dateInputMessage}</div>
                </div>


                <div className='ag-theme-balham-dark' style={{ height: '870px', width: '99.9%' }}>
                    <JqxGrid width='100%' height='100%'  columns={this.props.jsonServerData.jqGridColumns}
                             source={new jqx.dataAdapter({ datatype: 'local', localdata: this.props.jsonServerData.data })}
                             theme={'dark'} editable={this.props.allowTableChanges} altrows={true} enabletooltips={true} selectionmode={'singlecell'}
                             onCellendedit={this.cellEndEditEvent.bind(this)} />
                </div>
            </div>

        );
    }

}

DailyInputs.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(DailyInputs)

