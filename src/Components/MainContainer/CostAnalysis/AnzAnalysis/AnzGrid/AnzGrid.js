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
import JqxGrid, { jqx  } from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxgrid';
import JqxDateTimeInput from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxdatetimeinput';


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
            openConfig: false,
            extraOptions : '&useFilter=' + this.props.useFilter + '&groupByCategory=' + this.props.groupByCategory
        };
    }

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
                        <JqxDateTimeInput width={115} height={25} onValueChanged={this.props.handleBeginDayChange.bind(this, 'getGridSpending', this.state.extraOptions)} />
                        <br/>
                    </div>
                    <div className={'end-date-picker'}>
                        <JqxDateTimeInput width={115} height={25} onValueChanged={this.props.handleEndDayChange.bind(this, 'getGridSpending', this.state.extraOptions)} />
                        <br/>
                    </div>

                    <FormControlLabel className='filter-button' control={ <Switch checked={this.props.useFilter} onChange={this.props.handleFilterSwitchChange()}
                                                                                  value="useFilter" color="secondary" /> } label="Use filter" />

                    {(this.props.useFilter === true) ? (
                        <FormControlLabel className='filter-button' control={ <Switch checked={this.props.groupByCategory} onChange={this.props.handleCategorySwitchChange()}
                                                                                      value="groupByCategory" color="primary" /> } label="Group by category" />
                    ) : (null)}

                    <div className='error-message'>
                        {this.props.dateInputMessage}
                    </div>
                </div>

                <div className='ag-theme-balham-dark'  style={{ height: '870px', width: '99.9%' }} >
                    <JqxGrid width='100%' height='100%'
                             columns={this.props.jsonServerData.jqGridColumns}
                             source={new jqx.dataAdapter({ datatype: 'local', localdata: this.props.jsonServerData.agGridData })}
                             sortable={true} theme={'dark'} groupable={this.props.groupByCategory} groups={['Category']}
                             showaggregates={this.props.groupByCategory} showgroupaggregates={this.props.groupByCategory} showstatusbar={this.props.groupByCategory}/>
                    <AnzConfig openConfig={this.state.openConfig} onConfigClose={this.handleConfigClose} />
                </div>
            </div>

        );
    }
}

AnzGrid.propTypes = {
    classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(AnzGrid)
