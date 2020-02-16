import * as React from 'react';
import './PersonalSpending.css'

import 'jqwidgets-scripts/jqwidgets/styles/jqx.base.css';
import 'jqwidgets-scripts/jqwidgets/styles/jqx.dark.css';
import JqxGrid, {jqx} from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxgrid';
import JqxDateTimeInput from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxdatetimeinput';
import JqxComboBox from 'jqwidgets-framework/jqwidgets-react-tsx/jqxcombobox';


class PersonalSpending extends React.Component {

    constructor(props) {
        super(props);

        this.state = {

        };

        this.spenderNames = ['MARWAN', 'SAMER', 'BOTH', 'TOTAL'];
        this.selectedItem = 0;
        this.spenderName = 'MARWAN';
        this.extraOptions = '&spenderName=' + this.spenderName;

    }



    onSpenderSelect = event => {
        this.spenderName = this.spenderNames[event.args.index];

        this.extraOptions = '&spenderName=' + this.spenderName;
        this.props.getJsonObjDataFromServer('getPersonalSpending', this.props.beginDate, this.props.endDate, this.extraOptions);
        this.selectedItem = this.spenderNames.indexOf(this.spenderName);
    };




    render() {

        return (
            <div>
                <div className='button-container'>
                    <div className={'begin-date-picker'}>
                        <JqxDateTimeInput width={115} height={25} onValueChanged={this.props.handleBeginDayChange.bind(this, 'getPersonalSpending', this.extraOptions)}/>
                        <br/>
                    </div>
                    <div className={'end-date-picker'}>
                        <JqxDateTimeInput width={115} height={25} onValueChanged={this.props.handleEndDayChange.bind(this, 'getPersonalSpending', this.extraOptions)}/>
                        <br/>
                    </div>
                    <div className='combo-box-spender'>
                        <JqxComboBox
                            width={250} height={25}
                            source={this.spenderNames} selectedIndex={this.selectedItem} onSelect={this.onSpenderSelect}/>
                    </div>
                    <div className='date-message-personal-spending'> {this.props.dateInputMessage}</div>
                </div>

                <div className='divider-recap-personal-spending'>Recap Personal Spending</div>
                <div className='personal-spending-table-div' >
                    <JqxGrid width='100%' height='100%'
                             columns={this.props.jsonServerData.personalSpendingColumnsTotals} source={new jqx.dataAdapter({datatype: 'local', localdata: this.props.jsonServerData.personalSpendingDataTotals })}
                             theme={'blue'} />
                </div>

                <div className='divider-details-personal-spending'>Personal Spending Details</div>
                <div className='personal-spending-table-details-div'>
                    <JqxGrid width='100%' height='100%'
                             columns={this.props.jsonServerData.jqGridColumnsPersonalSpending} source={new jqx.dataAdapter({datatype: 'local', localdata: this.props.jsonServerData.jqGridSourcePersonalSpending })}
                             theme={'dark'} />
                </div>
            </div>

        );
    }
}


export default PersonalSpending
