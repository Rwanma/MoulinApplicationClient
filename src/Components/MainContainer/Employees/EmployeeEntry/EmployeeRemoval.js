

import React from 'react'
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import './Employee.css'
import Button from '@material-ui/core/Button';
import Select from 'react-select';


const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
    dense: {
        marginTop: 19,
    },
    menu: {
        width: 200,
    },
    button: {
        margin: theme.spacing.unit,
    },
    input: {
        display: 'none',
    }
});


class EmployeeRemoval extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            firstName: '',
            lastName: ''
        };
    }


    render() {
        const { classes } = this.props;


        return (
            <div className='label-container'>
                <div className='multi-select'>
                    <Select className='selector' onChange={this.changeId}
                            options={this.props.employeeRowData.getEmployeeIdsForComboBox()}
                            value={this.props.deleteId} />
                </div>
                <div>
                    <TextField
                        disabled
                        id="first-name"
                        label="First Name"
                        value={this.props.deleteFirstName}
                        className={classes.textField}
                        margin="normal" />
                </div>
                <div>
                    <TextField
                        disabled
                        id="last-name"
                        label="Last Name"
                        value={this.props.deleteLastName}
                        className={classes.textField}
                        margin="normal"
                    />
                </div>
                <div className='action-button'>
                    <Button style={{ justifyContent: 'center' }} variant="contained" onClick={this.removeEmployee}>
                        Delete Employee
                    </Button>
                </div>
            </div>

        );
    }

    changeId = (selectedOption) => {
        this.props.deleteIdChanged(selectedOption);
    };


    removeEmployee = () => {
        this.props.removeEmployee();
    }

}


export default withStyles(styles)(EmployeeRemoval);