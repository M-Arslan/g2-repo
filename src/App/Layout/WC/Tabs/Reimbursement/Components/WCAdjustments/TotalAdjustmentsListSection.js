
import { AgGridReact } from 'ag-grid-react';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
    ASYNC_STATES
} from '../../../../../../Core/Enumerations/redux/async-states';
import { Panel, PanelContent, PanelHeader, Spinner } from '../../../../../../Core/Forms/Common';

import {
    WCReimbursementAdjustmentsListSelectors,

} from '../../../../../../Core/State/slices/reimbursement-adjustments'
import { numberWithCommas } from '../../../../../../Core/Utility/common';
const GridContainer = styled.div`
    height: 200px;
    width: 100%;
`;




export const TotalAdjustmentsListSection = ({ claim, request, dispatch }) => {
    const reimbursementAdjustmentListState = useSelector(WCReimbursementAdjustmentsListSelectors.selectLoading());
    const reimbursementAdjustmentList = useSelector(WCReimbursementAdjustmentsListSelectors.selectData());
    let totalAdjustmentList = reimbursementAdjustmentList?.reduce((a, c) => {
        let e = (a[c.adjustmentTypeID] = a[c.adjustmentTypeID] || { ids: [], adjustmentTypeID: c.adjustmentTypeID, total: 0 });
        e.total += (c.amountAdjusted ?? 0);
        e.ids.push(c.adjustmentTypeID);
        return a;
    }, {})
    const columnDefs = [
        {
            headerName: 'Adjusted from Medical Loss to Exp',
            field: 'total1',
            flex: 1,
            cellStyle: { textAlign: 'center' },
            valueGetter: function (params) {
                return (params?.data && params.data[1] ? params.data[1]?.total : "");
            },
        },
        {
            headerName: 'Adjusted from Indemnity Loss',
            field: 'total2',
            cellStyle: { textAlign: 'center' },
            flex: 1,
            valueGetter: function (params) {
                return ((params?.data || null) && params.data[2] ? numberWithCommas(params.data[2]?.total) : "");
            }
        },
        {
            headerName: 'Adjusted from Medical Losse',
            field: 'total3',
            cellStyle: { textAlign: 'center' },
            flex: 1,
            valueGetter: function (params) {
                return (params?.data && params.data[3] ? numberWithCommas(params.data[3]?.total) : "");
            }
        },
        {
            headerName: 'Adjusted from Expense', 
            cellStyle: { textAlign: 'center' },
            flex: 1,
            field: 'total4',
            valueGetter: function (params) {
                return (params?.data && params.data[4] ? numberWithCommas(params.data[4]?.total) : "");
            }
        },
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
        <>

            <Panel>
                <PanelHeader><span style={{ fontWeight: 'bold', fontSize: '14px' }}>Total Adjustments</span></PanelHeader>
                {reimbursementAdjustmentListState === ASYNC_STATES.WORKING ?
                    <Spinner />
                    :
                    <PanelContent style={{ height: "100%" }}>
                        <GridContainer className="ag-theme-balham">
                            <AgGridReact
                                columnDefs={columnDefs}
                                rowData={([totalAdjustmentList] ? [totalAdjustmentList] : [])}
                                defaultColDef={defaultColDef}
                                pagination={true}
                            />
                        </GridContainer>
                    </PanelContent>}
            </Panel>
        </>
    );

};