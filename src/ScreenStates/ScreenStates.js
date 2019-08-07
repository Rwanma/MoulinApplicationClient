import Employee from "../Components/MainContainer/Employees/EmployeeEntry/Employee";
import DailyInputs from "../Components/MainContainer/CostAnalysis/DailyInputs/DailyInputs";
import EmployeeHours from "../Components/MainContainer/Employees/EmployeeHours/EmployeeHours";
import AnzAnalysis from "../Components/MainContainer/CostAnalysis/AnzAnalysis/AnzAnalysis/AnzAnalysis";
import AnzGrid from "../Components/MainContainer/CostAnalysis/AnzAnalysis/AnzGrid/AnzGrid";

import DailyData from "../Components/MainContainer/CostAnalysis/DailyData/DailyData";



import React from "react";

class ScreenStates {
    static screenMap = new Map();

    static ScreenToDisplay(screenToDisplay, allowTableChange) {
        this.screenMap.clear();


        if (allowTableChange === true) {
            // Spendings
            this.screenMap['Cost Analysis'] = <AnzGrid allowConfig={allowTableChange}/>;
            this.screenMap['ANZ Analysis'] = <AnzGrid allowConfig={allowTableChange}/>;
            this.screenMap['Daily Inputs'] = <DailyInputs allowTableChanges={allowTableChange} />;
            this.screenMap['Daily financial data'] = <DailyData />;
            this.screenMap['RECAP'] = <DailyData/>;


            // Employees
            this.screenMap['Employee Entry'] = <Employee />;
            this.screenMap['Employees'] = <Employee />;
            this.screenMap['Employee Hours'] = <EmployeeHours allowTableChanges={allowTableChange}/>;
        }else {
            // Spendings
            this.screenMap['Cost Analysis'] = <AnzGrid allowConfig={allowTableChange}/>;
            this.screenMap['ANZ Analysis'] = <AnzGrid allowConfig={allowTableChange}/>;
            this.screenMap['Daily Inputs'] = <DailyInputs allowTableChanges={allowTableChange} />;
            this.screenMap['Daily financial data'] = <DailyData />;

            // Employees
            this.screenMap['Employees'] = <EmployeeHours allowTableChanges={allowTableChange} />;
            this.screenMap['Employee Hours'] = <EmployeeHours allowTableChanges={allowTableChange} />;
        }

        return this.screenMap[screenToDisplay];
    }


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
            spendingDrawerList = ['ANZ Analysis', 'Daily Inputs', 'Daily financial data', 'RECAP'];
            employeeDrawerList = ['Employee Entry', 'Employee Hours'];
        } else {
            spendingDrawerList = ['ANZ Analysis', 'Daily Inputs', 'Daily financial data'];
            employeeDrawerList = ['Employee Hours'];
        }

        if (clickedTab.toUpperCase() === 'COST ANALYSIS' ||
            clickedTab.toUpperCase() === 'DAILY INPUTS' ||
            clickedTab.toUpperCase() === 'ANZ ANALYSIS' ||
            clickedTab.toUpperCase() === 'DAILY FINANCIAL DATA') {
            return spendingDrawerList;
        } else if (clickedTab.toUpperCase() === 'EMPLOYEES' || clickedTab.toUpperCase() === 'EMPLOYEE ENTRY' || clickedTab.toUpperCase() === 'EMPLOYEE HOURS') {
            return employeeDrawerList;
        }
        else return [];
    }
}


export default ScreenStates;