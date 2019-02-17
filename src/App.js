import React, { Component } from 'react';
import './App.css';
import MainContainer from "./Components/MainContainer/MainContainer/MainContainer";
import TopBar from "./Components/TopBar/TopBar";
import ScreenStates from "./ScreenStates/ScreenStates";
import LogonScreen from './Components/LogonScreen/LogonScreen';


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openRightDrawer: false,
            screenDisplay: ScreenStates.getCostAnalysisTabName(),
            listForDrawer: ScreenStates.getListFromTabName(ScreenStates.getCostAnalysisTabName(), false),
            screenTitle: 'ANZ Analysis',
            displayApp: false,
            allowTableChanges: false
        };

    }

    screenDisplayType = '';

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
                                       changeScreenDisplay={this.changeScreenDisplay.bind(this)} />
                    </div>
                }
            </div>
        );
    }

    verifyLogon = async (username, password) => {
        let queryUrl = 'http://localhost:3005/GetLoginRole?login=' + username + '&password=' + password;
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
            screenTitle: newScreenTitle
        });

    }
}

export default App;
