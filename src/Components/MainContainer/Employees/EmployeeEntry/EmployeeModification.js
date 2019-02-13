
import React from 'react'
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import './Employee.css'
import Button from '@material-ui/core/Button';
import Select from 'react-select'


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


class EmployeeModification extends React.Component {
    render() {
        const { classes } = this.props;
        return (
            <div className='employee-action-container'>
                <div className='label-container'>
                    <div className='multi-select'>
                        <Select className='selector' onChange={this.changeId}
                                options={this.props.employeeRowData.getEmployeeIdsForComboBox()}
                                value={this.props.modifyId} />
                    </div>
                    <div>
                        <TextField
                            id='first-name'
                            label='First Name'
                            value={this.props.modifyFirstName}
                            className={classes.textField}
                            margin="normal"
                            onChange={this.updateFirstName}
                        />
                    </div>
                    <div>
                        <TextField
                            id='last-name'
                            label='Last Name'
                            value={this.props.modifyLastName}
                            className={classes.textField}
                            margin="normal"
                            onChange={this.updateLastName}
                        />
                    </div>
                    <div>
                        <TextField
                            id="salary-hours"
                            label="Salary per hour (transfer)"
                            value={this.props.modifySalaryTransfer}
                            className={classes.textField}
                            margin="normal"
                            type="number"
                            onChange={this.updateSalaryTransfer}
                        />
                    </div>
                    <div>
                        <TextField
                            id="salary-cash"
                            label='Salary per hour (cash)'
                            margin="normal"
                            type="number"
                            className={classes.textField}
                            value={this.props.modifySalaryCash}
                            onChange={this.updateSalaryCash}
                        />
                    </div>
                    <div className='action-button'>
                        <Button style={{ justifyContent: 'center' }} variant="contained"
                                onClick={this.modifyEmployee}>
                            Modify Employee
                        </Button>
                    </div>
                </div>
            </div>

        );
    }

    changeId = (selectedOption) => {
        this.props.modifyIdChanged(selectedOption)
    };

    updateFirstName = event => {
        this.props.updateModifyFirstName(event.target.value);
    };


    updateLastName = event => {
        this.props.updateModifyLastName(event.target.value);
    };

    updateSalaryTransfer = event => {
        this.props.updateModifySalaryTransfer(event.target.value);
    };


    updateSalaryCash = event => {
        this.props.updateModifySalaryCash(event.target.value);
    };


    modifyEmployee = () => {
        this.props.modifyEmployee()
    };

}


export default withStyles(styles)(EmployeeModification);

