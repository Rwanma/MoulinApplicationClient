import React from "react";


class ScreenStates  extends React.Component {

    static formatDate(datum) {
        let date = new Date(datum);
        return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    };

    static getCostAnalysisTabName() {
        return 'Cost Analysis';
    }

    static getEmployeeTabName() {
        return 'Employees';
    }

    static getListFromTabName(clickedTab, allowTableChange) {
        let spendingDrawerList = [];
        let employeeDrawerList = [];
        if (allowTableChange) {
            spendingDrawerList = ['ANZ Analysis', 'Daily Inputs', 'Daily financial data', 'Daily Chart Analysis', 'Personal Spending'];
            employeeDrawerList = ['Employee Entry', 'Employee Hours'];
        } else {
            spendingDrawerList = ['ANZ Analysis', 'Daily Inputs', 'Daily financial data', 'Daily Chart Analysis', 'Personal Spending'];
            employeeDrawerList = ['Employee Hours'];
        }

        if (clickedTab.toUpperCase() === 'COST ANALYSIS' ||
            clickedTab.toUpperCase() === 'DAILY INPUTS' ||
            clickedTab.toUpperCase() === 'ANZ ANALYSIS' ||
            clickedTab.toUpperCase() === 'DAILY FINANCIAL DATA' ||
            clickedTab.toUpperCase() === 'DAILY CHART ANALYSIS' ||
            clickedTab.toUpperCase() === 'PERSONAL SPENDING' )
        {
            return spendingDrawerList;
        } else if (clickedTab.toUpperCase() === 'EMPLOYEES' || clickedTab.toUpperCase() === 'EMPLOYEE ENTRY' || clickedTab.toUpperCase() === 'EMPLOYEE HOURS') {
            return employeeDrawerList;
        }
        else return [];
    }
}


export default ScreenStates;
