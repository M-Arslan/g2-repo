


import { AgGridReact } from 'ag-grid-react';
import React, { Component } from 'react';
import styled from 'styled-components';
import { formatDate } from '../../../../../Core/Forms/Common';

const GridContainer = styled.div`
    height: 400px;
    width: 64%;
    margin:10px

`;

//const ContentRow = styled.div`
//    display: flex;
//    flex-flow: row nowrap;
//    justify-content: flex-start;
//    align-items: center;
//    align-content: center;
//`;
//const ContentCell = styled.div`
//    width: 50%;
//    display: flex;
//    flex-flow: row nowrap;
//    justify-content: flex-start;
//    align-items: center;
//    align-content: center;
//    padding: .5em;
//`;
export default class DeleteButton extends Component {
    render() {
        return (
            <span><button>X</button></span>
        );
    }
}

export const TPOCPaymentListSection = ({ request, dispatch }) => {
    const columnDefs = [
        {
            headerName: 'TPOC Payment Amount',
            field: 'amount',
            flex: 1,
            valueFormatter: currencyFormatter,
        },
        {
            headerName: 'TPOC Payment Date',
            field: 'payDate',
            flex: 1,
            valueGetter: function (params) {
                return formatDate(params.data.payDate);
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
   
    function currencyFormatter(params) {
        if (params.value)
            return formatNumber(params.value);

    }
    function formatNumber(number) {

        return "$ " + number.toFixed(2)
            .toString()
            .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    }
    function onRowClicked(row) {
        request.selectedPaymentIndex = row.rowIndex;
        dispatch({ type: 'UPDATE_UNIVERSAL_REQUEST', request: { ...request } });
    }
    return (
        <GridContainer className="ag-theme-balham">
                <AgGridReact
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                rowData={((request.currentClaimant.medicare || {}).payments || [])}
                onRowClicked={onRowClicked}
                rowSelection="single"
                />
        </GridContainer>
    );
};

