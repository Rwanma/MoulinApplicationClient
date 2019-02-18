import React from 'react'
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import './Employee.css'
import Button from '@material-ui/core/Button';



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
        justifyContent: 'center'
    },
    input: {
        display: 'none',
    },
});


class EmployeeEntry extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            salaryTransfer: '',
            salaryCash: ''
        };
    }


    render() {
        const { classes } = this.props;

        return (
            <div className='employee-entry-container'>

                <div className='label-container'>
                    <div>
                        <TextField
                            id="first-name"
                            label="First Name"
                            value={this.props.addFirstName}
                            className={classes.textField}
                            margin="normal"
                            onChange={this.updateFirstName}
                        />
                    </div>
                    <div>
                        <TextField
                            id="last-name"
                            label="Last Name"
                            value={this.props.addLastName}
                            className={classes.textField}
                            margin="normal"
                            onChange={this.updateLastName}
                        />
                    </div>
                    <div>
                        <TextField
                            id="salary-hours"
                            label="Salary per hour (transfer)"
                            className={classes.textField}
                            value={this.props.addSalaryTransfer}
                            margin="normal"
                            type="number"
                            onChange={this.updateSalaryTransfer}
                        />
                    </div>
                    <div>
                        <TextField
                            id="salary-cash"
                            label="Salary per hour (cash)"
                            value={this.props.addSalaryCash}
                            className={classes.textField}
                            margin="normal"
                            type="number"
                            onChange={this.updateSalaryCash}
                        />
                    </div>
                    <div className='action-button'>
                        <Button style={{ justifyContent: 'center' }} variant="contained"
                                onClick={this.addEmployee}>
                            Add Employee
                        </Button>
                    </div>
                </div>

            </div>

        );
    }


    updateFirstName = event => {
        this.props.updateAddFirstName(event.target.value);
    };


    updateLastName = event => {
        this.props.updateAddLastName(event.target.value);
    };

    updateSalaryTransfer = event => {
        this.props.updateAddSalaryTransfer(event.target.value);
    };


    updateSalaryCash = event => {
        this.props.updateAddSalaryCash(event.target.value);
    };


    addEmployee = () => {
        this.props.addEmployee(this.state.firstName,
            this.state.lastName,
            this.state.salaryTransfer,
            this.state.salaryCash)
    };
}


export default withStyles(styles)(EmployeeEntry);
