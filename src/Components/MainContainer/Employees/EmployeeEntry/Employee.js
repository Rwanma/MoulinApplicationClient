

import React from 'react'
import { withStyles } from '@material-ui/core/styles';
import './Employee.css'
import EmployeeEntry from './EmployeeEntry';
import EmployeeModification from './EmployeeModification';
import EmployeeRemoval from "./EmployeeRemoval";
import EmployeeGrid from "./EmployeeGrid";


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
    },
});


class EmployeeStruct {
    constructor(id, firstName, lastName, salaryTransfer, salaryCash) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.salaryTransfer = salaryTransfer;
        this.salaryCash = salaryCash;
    }
}

class EmployeesDataStructure {
    constructor(jsonData) {
        this.employeeData = [];
        jsonData.map((jsonData) => (this.addEmployee(jsonData)));
    }


    addEmployee(jsonDataEmployee) {
        const employeeToAdd = new EmployeeStruct(jsonDataEmployee.employee_id, jsonDataEmployee.first_name, jsonDataEmployee.last_name, jsonDataEmployee.salary_transfer, jsonDataEmployee.salary_cash);
        this.employeeData.push(employeeToAdd);
    }

    getEmployeeIdsForComboBox() {
        const employeeIdList = this.employeeData.map(function (employee) {
            return { value: employee.id, label: employee.id }
        });
        return employeeIdList;
    }

    getEmployeeFromId(id) {
        let employeeFound = this.employeeData.find(function (employee) {
            if (employee.id === id) {
                return employee;
            }
            return null;
        });
        return employeeFound;
    }
}

class Employee extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rowData: [],

            // EMPLOYEE ENTRY
            addFirstName: '',
            addLastName: '',
            addSalaryTransfer: '',
            addSalaryCash: '',

            // EMPLOYEE MODIFICATION
            modifyId: null,
            modifyFirstName: '',
            modifyLastName: '',
            modifySalaryTransfer: '',
            modifySalaryCash: '',

            // EMPLOYEE DELETE
            deleteId: null,
            deleteFirstName: '',
            deleteLastName: ''
        };
        this.getEmployeeData('http://localhost:3005/Employees');
    }

    getEmployeeData = async (employeeQuery) => {
        const response = await fetch(employeeQuery);
        const emloyeeJsonData = await response.json();
        if (emloyeeJsonData !== undefined) {
            this.setState({
                rowData: emloyeeJsonData
            });
        }
        else {
            this.setState({ rowData: [] });
        }
    };


    render() {
        const employeeData = new EmployeesDataStructure(this.state.rowData);
        return (
            <div>
                <EmployeeEntry addFirstName={this.state.addFirstName}
                               addLastName={this.state.addLastName}
                               addSalaryTransfer={this.state.addSalaryTransfer}
                               addSalaryCash={this.state.addSalaryCash}
                               addEmployee={this.addEmployee.bind(this)}
                               updateAddFirstName={this.updateAddFirstName.bind(this)}
                               updateAddLastName={this.updateAddLastName.bind(this)}
                               updateAddSalaryTransfer={this.updateAddSalaryTransfer.bind(this)}
                               updateAddSalaryCash={this.updateAddSalaryCash.bind(this)} />

                <EmployeeModification employeeRowData={employeeData}
                                      modifyEmployee={this.modifyEmployee.bind(this)}
                                      modifyId={this.state.modifyId}
                                      modifyFirstName={this.state.modifyFirstName}
                                      modifyLastName={this.state.modifyLastName}
                                      modifySalaryTransfer={this.state.modifySalaryTransfer}
                                      modifySalaryCash={this.state.modifySalaryCash}
                                      modifyIdChanged={this.modifyIdChanged.bind(this)}
                                      updateModifyFirstName={this.updateModifyFirstName.bind(this)}
                                      updateModifyLastName={this.updateModifyLastName.bind(this)}
                                      updateModifySalaryTransfer={this.updateModifySalaryTransfer.bind(this)}
                                      updateModifySalaryCash={this.updateModifySalaryCash.bind(this)} />

                <EmployeeRemoval employeeRowData={employeeData}
                                 removeEmployee={this.removeEmployee.bind(this)}
                                 deleteId={this.state.deleteId}
                                 deleteFirstName={this.state.deleteFirstName}
                                 deleteLastName={this.state.deleteLastName}
                                 deleteIdChanged={this.deleteIdChanged.bind(this)}
                                 updateModifyFirstName={this.updateModifyFirstName.bind(this)}
                                 updateModifyLastName={this.updateModifyLastName.bind(this)} />

                <EmployeeGrid employeeRowData={this.state.rowData} />
            </div>
        );
    }


    isVerificationOk(id, firstName, lastName, salaryTransfer, salaryCash) {
        if (firstName === '' ||
            lastName === '' ||
            salaryTransfer === '' ||
            salaryCash === '') {
            alert('you need to fill every field to modify the employee')
        } else if (window.confirm('Do you want to modify: ' +
            firstName + ' ' +
            lastName + ' ' +
            salaryTransfer + '$ (transfer) ' +
            salaryCash + '$ (cash) ?')) {
            return true;
        }
    }


    addEmployee() {
        if (this.isVerificationOk(0, this.state.addFirstName, this.state.addLastName,
            this.state.addSalaryTransfer, this.state.addSalaryCash)) {
            let addEmployeeUrl = 'http://localhost:3005/addEmployee?' +
                '&firstName=' + this.state.addFirstName +
                '&lastName=' + this.state.addLastName +
                '&salaryTransfer=' + this.state.addSalaryTransfer +
                '&salaryCash=' + this.state.addSalaryCash;
            this.getEmployeeData(addEmployeeUrl);

            this.setState({
                addFirstName: '',
                addLastName: '',
                addSalaryTransfer: '',
                addSalaryCash: ''
            });
        }
    }


    modifyEmployee() {
        if (this.state.modifyId === null) {
            alert('you need to select an employee to modify')
        } else if (this.isVerificationOk(this.state.modifyId.value, this.state.modifyFirstName, this.state.modifyLastName,
            this.state.modifySalaryTransfer, this.state.modifySalaryCash)) {
            let modifyEmployeeUrl = 'http://localhost:3005/modifyEmployee?' +
                'id=' + this.state.modifyId.value +
                '&firstName=' + this.state.modifyFirstName +
                '&lastName=' + this.state.modifyLastName +
                '&salaryTransfer=' + this.state.modifySalaryTransfer +
                '&salaryCash=' + this.state.modifySalaryCash;
            this.getEmployeeData(modifyEmployeeUrl);

            this.setState({
                modifyId: null,
                modifyFirstName: '',
                modifyLastName: '',
                modifySalaryTransfer: '',
                modifySalaryCash: ''
            });
        }
    }


    removeEmployee() {
        if (this.state.deleteId === null) {
            alert('you need to select an employee to delete')
        } else if (window.confirm('Do you want to delete: ' +
            this.state.deleteId.value + ' ' +
            this.state.deleteFirstName + ' ' +
            this.state.deleteLastName)) {

            let removeEmployeeUrl = 'http://localhost:3005/deleteEmployee?' +
                'id=' + this.state.deleteId.value;

            this.getEmployeeData(removeEmployeeUrl);

            this.setState({
                deleteId: null,
                deleteFirstName: '',
                deleteLastName: ''
            });
        }

    }


    //****************** EMPLOYEE MODIFICATION ********************************
    updateAddFirstName(addFirstNameModified) {
        this.setState({ addFirstName: addFirstNameModified });
    }

    updateAddLastName(addLastNameModified) {
        this.setState({ addLastName: addLastNameModified });
    }

    updateAddSalaryTransfer(addSalaryTransferModified) {
        this.setState({ addSalaryTransfer: addSalaryTransferModified });
    }

    updateAddSalaryCash(addSalaryCashModified) {
        this.setState({ addSalaryCash: addSalaryCashModified });
    }


    //****************** EMPLOYEE MODIFICATION ********************************
    updateModifyFirstName(modifyFirstNameModified) {
        this.setState({ modifyFirstName: modifyFirstNameModified });
    }

    updateModifyLastName(modifyLastNameModified) {
        this.setState({ modifyLastName: modifyLastNameModified });
    }

    updateModifySalaryTransfer(modifySalaryTransferModified) {
        this.setState({ modifySalaryTransfer: modifySalaryTransferModified });
    }

    updateModifySalaryCash(modifySalaryCashModified) {
        this.setState({ modifySalaryCash: modifySalaryCashModified });
    }

    modifyIdChanged(modifyIdModified) {
        let employeeData = new EmployeesDataStructure(this.state.rowData);
        let employee = employeeData.getEmployeeFromId(modifyIdModified.value);
        this.setState({
            modifyId: modifyIdModified,
            modifyFirstName: employee.firstName,
            modifyLastName: employee.lastName,
            modifySalaryTransfer: employee.salaryTransfer,
            modifySalaryCash: employee.salaryCash
        });
    }


    //****************** EMPLOYEE DELETE ********************************
    deleteIdChanged(deleteIdModified) {
        let employeeData = new EmployeesDataStructure(this.state.rowData);
        let employee = employeeData.getEmployeeFromId(deleteIdModified.value);
        this.setState({
            deleteId: deleteIdModified,
            deleteFirstName: employee.firstName,
            deleteLastName: employee.lastName
        });
    }
}

export default withStyles(styles)(Employee);
