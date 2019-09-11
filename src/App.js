import React, { Component } from 'react';
import './App.css';
import MainContainer from "./Components/MainContainer/MainContainer/MainContainer";
import TopBar from "./Components/TopBar/TopBar";
import ScreenStates from "./ScreenStates/ScreenStates";
import LogonScreen from './Components/LogonScreen/LogonScreen';
let config = require('./Config/config-moulin');



class App extends Component {
    constructor(props) {
        super(props);
        this.todayDate = new Date();
        this.todayDate.setHours(0, 0, 0, 0);
        this.emptyJsonServerData = {};

        this.state = {
            openRightDrawer: false,
            screenDisplay: ScreenStates.getCostAnalysisTabName(),
            listForDrawer: ScreenStates.getListFromTabName(ScreenStates.getCostAnalysisTabName(), false),
            screenTitle: 'ANZ Analysis',
            displayApp: false,
            allowTableChanges: false,
            beginDate: this.todayDate,
            endDate: this.todayDate,
            dateInputMessage: 'Choose a date range',
            jsonServerData : this.emptyJsonServerData
        };
    }

    verifyLogon = async (username, password) => {
        let queryUrl = 'http://' + config.server.server_address + ':3005/GetLoginRole?login=' + username + '&password=' + password;
        const response = await fetch(queryUrl);
        const myJsonData = await response.json();

        if (myJsonData.role === 'manager') {
            this.setState({ displayApp: true, allowTableChanges: true, listForDrawer: ScreenStates.getListFromTabName(ScreenStates.getCostAnalysisTabName(), true) });
        } else if (myJsonData.role === 'viewer') {
            this.setState({ displayApp: true, allowTableChanges: false, listForDrawer: ScreenStates.getListFromTabName(ScreenStates.getCostAnalysisTabName(), false) });
        }
        else {
            alert('Wrong username / password')
        }
    };


    openRightSideDrawer() {
        this.setState({ openRightDrawer: true });
    }

    closeRightSideDrawer() {
        this.setState({ openRightDrawer: false });
    }

    changeScreenDisplay(screenToDisplay, index) {
        let newScreenTitle = screenToDisplay;
        if (screenToDisplay === 'Cost Analysis') {
            newScreenTitle = 'ANZ Analysis';
        } else if (screenToDisplay === 'Employees') {
            newScreenTitle = 'Employee Entry';
        }

        this.setState({
            screenDisplay: screenToDisplay,
            listForDrawer: ScreenStates.getListFromTabName(screenToDisplay, this.state.allowTableChanges),
            screenTitle: newScreenTitle,
            beginDate: this.todayDate,
            endDate: this.todayDate,
            dateInputMessage: 'Choose a date range',
            jsonServerData : this.emptyJsonServerData
        });

    }

    getJsonObjDataFromServer = async (serverUrl, beginDate, endDate, extraOptions) => {
        if (beginDate > endDate) {
            this.setState({ dateInputMessage: 'end date should be after begin date' , jsonServerData : this.emptyJsonServerData});
        } else {
            let queryUrlWithDates = 'http://' + config.server.server_address + ':3005/' + serverUrl + '?beginDate=' +
                ScreenStates.formatDate(beginDate) + '&endDate=' + ScreenStates.formatDate(endDate) +
                '&allowTableChanges=' + this.state.allowTableChanges + extraOptions;
            console.log(queryUrlWithDates);
            const response = await fetch(queryUrlWithDates);
            const myJsonDataResponse = await response.json();
            this.setState({ jsonServerData : myJsonDataResponse});
        }
    };


    handleBeginDayChange(serverUrl, day) {
        if (day !== undefined) {
            let date = new Date((day.getMonth() + 1) + '/' + day.getDate() + '/' + day.getFullYear());
            this.setState({ beginDate: date, dateInputMessage: 'Choose a date range' });
            this.getJsonObjDataFromServer(serverUrl, date, this.state.endDate, '');
        }else{
            this.setState({ dateInputMessage: 'wrong date format', jsonServerData : this.emptyJsonServerData });
        }
    }

    handleEndDayChange(serverUrl, day) {
        if (day !== undefined) {
            let date = new Date((day.getMonth() + 1) + '/' + day.getDate() + '/' + day.getFullYear());
            this.setState({ endDate: date, dateInputMessage: 'Choose a date range' });
            this.getJsonObjDataFromServer(serverUrl, this.state.beginDate, date, '');
        }else{
            this.setState({ dateInputMessage: 'wrong date format', jsonServerData : this.emptyJsonServerData });
        }
    }

    render() {
        return (
            <div className="App">
                {(this.state.displayApp === false) ? (
                        <LogonScreen verifyLogon={this.verifyLogon.bind(this)} />
                    ) :
                    <div>
                        <TopBar openRightSideDrawer={this.openRightSideDrawer.bind(this)}
                                changeScreenDisplay={this.changeScreenDisplay.bind(this)}
                                screenTitle={this.state.screenTitle} />
                        <MainContainer openRightDrawer={this.state.openRightDrawer}
                                       listForDrawer={this.state.listForDrawer}
                                       screenDisplayType={this.state.screenDisplay}
                                       allowTableChanges={this.state.allowTableChanges}
                                       closeRightSideDrawer={this.closeRightSideDrawer.bind(this)}
                                       changeScreenDisplay={this.changeScreenDisplay.bind(this)}
                                       handleBeginDayChange={this.handleBeginDayChange.bind(this)}
                                       handleEndDayChange={this.handleEndDayChange.bind(this)}
                                       dateInputMessage={this.state.dateInputMessage}
                                       beginDate={this.state.beginDate}
                                       endDate={this.state.endDate}
                                       jsonServerData={this.state.jsonServerData}
                                       getJsonObjDataFromServer={this.getJsonObjDataFromServer.bind(this)}
                        />
                    </div>
                }
            </div>
        );
    }
}

export default App;
