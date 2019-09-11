import React from 'react'
import RightSideDrawer from "../../RightSideDrawer/RightSideDrawer";

import DailyData from "../../../Components/MainContainer/CostAnalysis/DailyData/DailyData";
import Employee from "../../../Components/MainContainer/Employees/EmployeeEntry/Employee";
import DailyInputs from "../../../Components/MainContainer/CostAnalysis/DailyInputs/DailyInputs";
import EmployeeHours from "../../../Components/MainContainer/Employees/EmployeeHours/EmployeeHours";
import AnzGrid from "../../../Components/MainContainer/CostAnalysis/AnzAnalysis/AnzGrid/AnzGrid";

class MainContainer extends React.Component {
    constructor(props) {
        super(props);
        this.screenMap = new Map();
    }


    ScreenToDisplay(screenToDisplay) {
        this.screenMap.clear();
        this.screenMap['Cost Analysis'] = <AnzGrid allowConfig={this.props.allowTableChanges} handleBeginDayChange={this.props.handleBeginDayChange.bind(this)} handleEndDayChange={this.props.handleEndDayChange.bind(this)}
                                                   dateInputMessage={this.props.dateInputMessage} jsonServerData={this.props.jsonServerData} />;
        this.screenMap['ANZ Analysis'] = <AnzGrid allowConfig={this.props.allowTableChanges} handleBeginDayChange={this.props.handleBeginDayChange.bind(this)} handleEndDayChange={this.props.handleEndDayChange.bind(this)}
                                                  dateInputMessage={this.props.dateInputMessage} jsonServerData={this.props.jsonServerData} />;

        this.screenMap['Daily Inputs'] = <DailyInputs allowTableChanges={this.props.allowTableChanges} handleBeginDayChange={this.props.handleBeginDayChange.bind(this)} handleEndDayChange={this.props.handleEndDayChange.bind(this)}
                                                      dateInputMessage={this.props.dateInputMessage} beginDate={this.props.beginDate} endDate={this.props.endDate}
                                                      jsonServerData={this.props.jsonServerData} getJsonObjDataFromServer={this.props.getJsonObjDataFromServer.bind(this)}/>;

        this.screenMap['Daily financial data'] = <DailyData handleBeginDayChange={this.props.handleBeginDayChange.bind(this)} handleEndDayChange={this.props.handleEndDayChange.bind(this)}
                                                            dateInputMessage={this.props.dateInputMessage} beginDate={this.props.beginDate} endDate={this.props.endDate} jsonServerData={this.props.jsonServerData} />;

        this.screenMap['Employee Hours'] = <EmployeeHours allowTableChanges={this.props.allowTableChanges} handleBeginDayChange={this.props.handleBeginDayChange.bind(this)} handleEndDayChange={this.props.handleEndDayChange.bind(this)}
                                                          dateInputMessage={this.props.dateInputMessage} beginDate={this.props.beginDate} endDate={this.props.endDate}
                                                          jsonServerData={this.props.jsonServerData} getJsonObjDataFromServer={this.props.getJsonObjDataFromServer.bind(this)}/>;

        // Employees
        if (this.props.allowTableChanges === true) {
            this.screenMap['Employee Entry'] = <Employee/>;
            this.screenMap['Employees'] = <Employee/>;
        }

        return this.screenMap[screenToDisplay];
    }



    render() {
        return (
            <div className="main-container">
                <div className="main-content">
                    <div className="grid-container" >
                        {this.ScreenToDisplay(this.props.screenDisplayType)}
                    </div>
                </div>
                <RightSideDrawer openRightDrawer={this.props.openRightDrawer} screenDisplayType={this.props.screenDisplayType} listForDrawer={this.props.listForDrawer}
                                 closeRightSideDrawer={this.props.closeRightSideDrawer} changeScreenDisplay={this.props.changeScreenDisplay} />
            </div>
        );
    }

}


export default MainContainer

