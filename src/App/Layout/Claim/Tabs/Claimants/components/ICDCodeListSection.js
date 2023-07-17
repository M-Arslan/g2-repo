


import { AgGridReact } from 'ag-grid-react';
import React, { Component } from 'react';
import styled from 'styled-components';
import { formatDate } from '../../../../../Core/Forms/Common';

const GridContainer = styled.div`
    height: 400px;
    width: 64%;
    margin:10px

`;

export default class DeleteButton extends Component {
    render() {
        return (
            <span><button>X</button></span>
        );
    }
}

export const ICDCodeListSection = ({ request, dispatch }) => {
    const columnDefs = [
        {
            headerName: 'ICD Code',
            field: 'iCDCodeID',
            flex: 1,
        },
        {
            headerName: 'Description',
            field: 'description',
            flex: 1,
            cellRenderer: function (params) {
                return (params.data.icdCode || {}).description || '';
            },
            width:500,
        },
        {
            headerName: 'Created Date',
            field: 'createdDate',
            flex: 1,
            valueGetter: function (params) {
                return formatDate(params?.data?.createdDate) || '';
            }
        }
    ];


    const defaultColDef = {
        cellClass: 'cell-wrap-text',
        cellStyle: { 'white-space': 'normal' },
        flex: 1,
        autoHeight: true,
        sortable: true,
        resizable: true,
        filter: true,
    };

    return (
        <GridContainer className="ag-theme-balham">
                <AgGridReact
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                rowData={((request.currentClaimant.medicare || {}).iCDCodes || [])}
                rowSelection="single"
                />
        </GridContainer>
    );
};

