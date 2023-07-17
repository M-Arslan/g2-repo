import React from 'react';
import {
    AgGridReact
} from 'ag-grid-react';
import {
    AllModules
} from '@ag-grid-enterprise/all-modules';



export class EntityGrid extends React.Component {
    constructor(props) {
        super(props);

        const { view } = props.config;

        const colDefs = Object.keys(view.columns).map(key => {
            const col = view.columns[key];
            return {
                headerName: col.header,
                field: col.field,
            };
        });

        this.state = {
            columnDefs: colDefs,
            rowData: props.records,
        };
    }

    render() {
        return (
            <AgGridReact
                modules={AllModules}
                columnDefs={this.state.columnDefs}
                rowData={this.state.rowData}
                domLayout="autoHeight">
            </AgGridReact>
        );
    }
}
