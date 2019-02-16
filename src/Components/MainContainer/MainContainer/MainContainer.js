
import React from 'react'
import RightSideDrawer from "../../RightSideDrawer/RightSideDrawer";
import ScreenStates from "../../../ScreenStates/ScreenStates";


class MainContainer extends React.Component {
    render() {
        return (
            <div className="main-container">
                <div className="main-content">
                    <div className="grid-container" >
                        {ScreenStates.ScreenToDisplay(this.props.screenDisplayType,this.props.allowTableChanges)}
                    </div>
                </div>
                <RightSideDrawer openRightDrawer={this.props.openRightDrawer}
                                 screenDisplayType={this.props.screenDisplayType}
                                 listForDrawer={this.props.listForDrawer}
                                 closeRightSideDrawer={this.props.closeRightSideDrawer}
                                 changeScreenDisplay={this.props.changeScreenDisplay} />
            </div>
        );
    }
}


export default MainContainer
