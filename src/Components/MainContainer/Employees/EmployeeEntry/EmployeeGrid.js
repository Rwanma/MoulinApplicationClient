

import * as React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { withStyles } from '@material-ui/core/styles';
import 'date-fns';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'ag-grid-community/dist/styles/ag-theme-balham-dark.css';
import 'react-day-picker/lib/style.css';


const styles = {
    grid: {
        width: '60%',
    },
};


class EmployeeGrid extends React.Component {
    constructor(props) {
        super(props);
        this.columnDefs =
            [{ "headerName": "id", "field": "employee_id", "pinned": "left", "filter": "agNumberColumnFilter" },
                { "headerName": "First name", "field": "first_name", "filter": "agTextColumnFilter" },
                { "headerName": "Last name", "field": "last_name", "filter": "agTextColumnFilter" },
                { "headerName": "Salary Transfer", "field": "salary_transfer", "filter": "agNumberColumnFilter" },
                { "headerName": "Salary Cash", "field": "salary_cash", "filter": "agNumberColumnFilter" }];
    }

    render() {
        return (
            <div className="anz-spending">
                <div
                    className='ag-theme-balham-dark'
                    style={{
                        height: '500px',
                        width: '100%'
                    }}
                >
                    <AgGridReact
                        columnDefs={this.columnDefs}
                        rowData={this.props.employeeRowData}
                        enableSorting={true}
                        enableFilter={true}>
                    </AgGridReact>
                </div>
            </div>

        );
    }

}


export default withStyles(styles)(EmployeeGrid)