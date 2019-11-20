import * as React from 'react';
import './ChartAnalysis.css'
import JqxChart, { IChartProps } from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxchart';
import JqxDateTimeInput from 'jqwidgets-scripts/jqwidgets-react-tsx/jqxdatetimeinput';

class ChartAnalysis extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            description: 'Moulin cafe data chart',
            padding: { left: 10, top: 10, right: 15, bottom: 10 },
            seriesGroups: [
                {
                    series: [
                        {
                            dataField: 'AnzSpending',
                            labels: { backgroundColor: 'RED', backgroundOpacity: 0.2, borderColor: 'GREY', borderOpacity: 0.7,
                                padding: { left: 5, right: 5, top: 0, bottom: 0 }, visible: true, },
                            symbolType: 'square'
                        },
                        {
                            dataField: 'Salaries',
                            labels: {backgroundColor: '#FEFEFE', backgroundOpacity: 0.2, borderColor: '#7FC4EF', borderOpacity: 0.7,
                                padding: { left: 5, right: 5, top: 0, bottom: 0 }, visible: true, },
                            symbolType: 'square'
                        },
                        {
                            dataField: 'Revenues',
                            labels: {backgroundColor: '#FEFEFE', backgroundOpacity: 0.2, borderColor: '#7FC4EF', borderOpacity: 0.7,
                                padding: { left: 5, right: 5, top: 0, bottom: 0 }, visible: true, },
                            symbolType: 'square'
                        },
                        {
                            dataField: 'Profits',
                            labels: {backgroundColor: '#FEFEFE', backgroundOpacity: 0.2, borderColor: '#7FC4EF', borderOpacity: 0.7,
                                padding: { left: 5, right: 5, top: 0, bottom: 0 }, visible: true, },
                            symbolType: 'square'
                        }
                    ],
                    type: 'line'
                }
            ],
            source: this.props.jsonServerData.chartData,
            title: 'Chart Report',
            titlePadding: { left: 90, top: 0, right: 0, bottom: 10 },
            valueAxis: {
                labels: { horizontalAlignment: 'right' },
                maxValue: 3500,
                minValue: -4000,
                title: { text: 'Dollars<br><br>' },
                unitInterval: 1000
            },
            xAxis: {
                dataField: 'Day',
                gridLines: { visible: false, interval: 1000 },
                padding: { bottom: 10 },
                tickMarks: { visible: true, interval: 1000 },
                unitInterval: 1,
                valuesOnTicks: false
            }
        };
    }

    render() {

        return (
            <div>
                <div className='button-container'>
                    <div className={'jq-date-picker'}>
                        <JqxDateTimeInput width={115} height={25} onValueChanged={this.props.handleBeginDayChange.bind(this, 'GetChartData', '')} />
                        <br/>
                    </div>
                    <div className={'jq-date-picker'}>
                        <JqxDateTimeInput width={115} height={25} onValueChanged={this.props.handleEndDayChange.bind(this, 'GetChartData', '')} />
                        <br/>
                    </div>

                    <div className='date-message'> {this.props.dateInputMessage} </div>
                </div>

                <div className='chart-container'  style={{ height: '950px', width: '99.9%' }} >
                    <JqxChart style={{ width: '100%', height: '100%' }}
                              title={this.state.title} description={this.state.description}
                              showLegend={true} enableAnimations={true} padding={this.state.padding}
                              titlePadding={this.state.titlePadding} source={this.props.jsonServerData.chartData} xAxis={this.state.xAxis}
                              valueAxis={this.state.valueAxis} seriesGroups={this.state.seriesGroups} colorScheme={'scheme05'} />
                </div>

            </div>
        );
    }


}



export default ChartAnalysis
