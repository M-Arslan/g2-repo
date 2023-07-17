
import { AgGridReact } from 'ag-grid-react';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
    ASYNC_STATES
} from '../../../../../Core/Enumerations/redux/async-states';
import { Panel, PanelContent, PanelHeader, Spinner, formatDate } from '../../../../../Core/Forms/Common';
import {
    WCReimbursementPriorTPAPaidSingleActions
} from '../../../../../Core/State/slices/prior-tpa-paids';
import { ReimbursementCompanyDollarListActions, WCReimbursementActions, WCReimbursementListSelectors } from '../../../../../Core/State/slices/reimbursement';
import { WCReimbursementAdjustmentsListActions } from '../../../../../Core/State/slices/reimbursement-adjustments';


const GridContainer = styled.div`
    height: 400px;
    width: 100%;
`;

export const ReimbursementListSection = ({ request, dispatch }) => {
    const { enqueueSnackbar } = useSnackbar();
    let $dispatch = useDispatch();
    const reimbursementListState = useSelector(WCReimbursementListSelectors.selectLoading());
    const columnDefs = [
        {
            headerName: 'Created Date',
            field: 'createdDate',
            flex: 1,
            cellRenderer: function (params) {
                return (   <a
                rel="noopener noreferrer"
                href="#"
              >
                {formatDate(params.data.createdDate)}
              </a>)
           },
            onCellClicked : onRowClicked
        },
        {
            headerName: 'Created by',
            field: 'createdBy',
            flex: 1,
            valueGetter: function (params) {
                return params.data.createdBy;
            },
            onCellClicked: onRowClicked
        },
        {
            headerName: 'Status',
            field: 'statusText',
            flex: 1,
            field: 'status',
            valueGetter: function (params) {
                return params.data.claimStatusTypeID === 33 ? "In Progress" : params.data.claimStatusTypeID === 37 ? "Completed - Reimbursement Payment requested" : params.data.claimStatusTypeID === 38 ? "Completed - No Reimbursement Payment requested" : "";
            },
            onCellClicked: onRowClicked
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
    async function onRowClicked(obj) {
        //dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isProcessing: true } });
        try {
            //$dispatch(WCReimbursementCalculationActions.list({ wCReimbursementID: obj.data.wCReimbursementID }));
            $dispatch(WCReimbursementActions.get({ wCReimbursementID: obj.data.wCReimbursementID }));
            $dispatch(WCReimbursementPriorTPAPaidSingleActions.list({ wCReimbursementID: obj.data.wCReimbursementID }));
            $dispatch(ReimbursementCompanyDollarListActions.list({ wCReimbursementID: obj.data.wCReimbursementID }));
            $dispatch(WCReimbursementAdjustmentsListActions.list({ wCReimbursementID: obj.data.wCReimbursementID }));
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isProcessing: true, selectedMenu: "REIMBURSEMENT", helpContainerName: 'Reimbursement Details' } })
         


        } catch (e) {
            enqueueSnackbar(e.toString(), { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        }
    }
    return (
        <>
            <Panel>
                <PanelHeader><span style={{ fontWeight: 'bold', fontSize: '14px' }}>Workers Compensation Reimbursement Prior Requests</span></PanelHeader>
                <PanelContent style={{ height: "100%" }}>
                    {reimbursementListState !== ASYNC_STATES.WORKING ?
                        <GridContainer className="ag-theme-balham">
                            <AgGridReact
                                columnDefs={columnDefs}
                                defaultColDef={defaultColDef}
                                rowData={request ? (request.Reimbursements ? request.Reimbursements : []) : []}
                                pagination={true}
                                paginationPageSize={10}
                            />
                        </GridContainer>
                        : <Spinner />}
               </PanelContent>
        </Panel>
            </>
    );

};