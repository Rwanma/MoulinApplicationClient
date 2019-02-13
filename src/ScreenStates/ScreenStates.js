
import Employee from "../Components/MainContainer/Employees/EmployeeEntry/Employee";
import DailyInputs from "../Components/MainContainer/CostAnalysis/DailyInputs/DailyInputs";
import EmployeeHours from "../Components/MainContainer/Employees/EmployeeHours/EmployeeHours";
import AnzAnalysis from "../Components/MainContainer/CostAnalysis/AnzAnalysis/AnzAnalysis/AnzAnalysis";
import DailyData from "../Components/MainContainer/CostAnalysis/DailyData/DailyData";



import React from "react";

class ScreenStates {
    static ScreenToDisplay(screenToDisplay) {
        let map = new Map();

        // Spendings
        map['Cost Analysis'] = <AnzAnalysis />;
        map['ANZ Analysis'] = <AnzAnalysis />;
        map['Daily Inputs'] = <DailyInputs />;
        map['Daily financial data'] = <DailyData />;


        // Employees
        map['Employee Entry'] = <Employee />;
        map['Employees'] = <Employee />;
        map['Employee Hours'] = <EmployeeHours />;

        return map[screenToDisplay];
    }


    static getCostAnalysisTabName() {
        return 'Cost Analysis';
    }

    static getEmployeeTabName() {
        return 'Employees';
    }

    static getListFromTabName(clickedTab) {
        let spendingDrawerList = ['ANZ Analysis', 'Daily Inputs', 'Daily financial data'];
        let employeeDrawerList = ['Employee Entry', 'Employee Hours'];

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

