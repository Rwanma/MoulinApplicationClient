

import React from 'react'
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import transparentLogo from '../../Images/transparentLogo.png'
import hamburgerImage from '../../Images/hamburger6.svg'
import ScreenStates from '../../ScreenStates/ScreenStates.js'
import './TopBar.css';

const styles = theme => ({ root: { flexGrow: 1, backgroundColor: theme.palette.background.paper, }, });

class TopBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: 0
        };
    }


    handleChange(event, valueChanged) {
        this.setState({ value: valueChanged });
    }


    render() {

        return (
            <AppBar position="static" className="app-bar" style={{ backgroundColor: "black" }}>
                <div className="flex-container">
                    <img src={transparentLogo} className="moulin-logo" alt="moulin logo" />

                    <div className="app-bar-container">
                        <AppBar position="static">
                            <Tabs value={this.state.value} onChange={this.handleChange.bind(this)} style={{ backgroundColor: "black" }}>
                                <Tab label={ScreenStates.getCostAnalysisTabName()} onClick={() => { this.props.changeScreenDisplay(ScreenStates.getCostAnalysisTabName()) }} />
                                <Tab label={ScreenStates.getEmployeeTabName()} onClick={() => { this.props.changeScreenDisplay(ScreenStates.getEmployeeTabName()) }} />
                            </Tabs>
                        </AppBar>
                    </div>
                    <div className='title'> {this.props.screenTitle} </div>
                    <img src={hamburgerImage} className="hamburger-button" alt="burger logo" onClick={() => { this.props.openRightSideDrawer() }} />
                </div>
            </AppBar>
        );
    }
}

export default withStyles(styles)(TopBar)
