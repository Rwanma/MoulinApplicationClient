

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';


const styles = {
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
};

class RightSideDrawer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayList: []
        };
    }

    listClicked(text, index) {
        this.props.closeRightSideDrawer();
        this.props.changeScreenDisplay(text, index);
    }

    render() {
        const { classes } = this.props;

        const sideList = (
            <div className={classes.list}>
                <List>
                    {this.props.listForDrawer.map((text, index) => (
                        <ListItem button key={text} onClick={this.listClicked.bind(this, text, index)}>
                            <ListItemText primary={text} />
                        </ListItem>
                    ))}
                </List>
            </div>
        );

        return (
            <div >
                <Drawer anchor="right" open={this.props.openRightDrawer} onClose={this.props.closeRightSideDrawer}>
                    <div >
                        {sideList}
                    </div>
                </Drawer>
            </div>
        );
    }
}

RightSideDrawer.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RightSideDrawer);

