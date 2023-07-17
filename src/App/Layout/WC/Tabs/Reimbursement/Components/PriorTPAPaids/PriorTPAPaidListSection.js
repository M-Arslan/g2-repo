


import { AgGridReact } from 'ag-grid-react';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
    ASYNC_STATES
} from '../../../../../../Core/Enumerations/redux/async-states';
import { Panel, PanelContent, PanelHeader } from '../../../../../../Core/Forms/Common';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    ReimbursementCompanyDollarActions,
    ReimbursementCompanyDollarDeleteActions
} from '../../../../../../Core/State/slices/reimbursement'
import EditIcon from '@mui/icons-material/Edit';

const GridContainer = styled.div`
    height: 200px;
    width: 100%;
`;




export const PriorTPAPaidListSection = ({ claim, request, dispatch }) => {

    const columnDefs = [

        {
            headerName: 'TPA Paid to Date Indemnity',
            field: 'sumPaidToDateIndemnity',
            cellStyle: { textAlign: 'center' },
            flex: 1,
            //valueGetter: function (params) {
            //    return params?.data?.sumPaidToDateIndemnity;
            //}
        },
        {
            headerName: 'TPA Paid to Date Medical',
            field: 'sumPaidToDateMedical',
            cellStyle: { textAlign: 'center' },
            flex: 1,
            //valueGetter: function (params) {
            //    return params?.data?.sumPaidToDateMedical;
            //}
        },
        {
            headerName: 'TPA Total Loss Paid',
            cellStyle: { textAlign: 'center' },
            flex: 1,
            field: 'sumLossPaid',
            //valueGetter: function (params) {
            //    return params?.data?.sumLossPaid;
            //}
        },
        {
            headerName: 'TPA Paid Expense',
            cellStyle: { textAlign: 'center' },
            flex: 1,
            field: 'sumPaidToDateExpense',
            //valueGetter: function (params) {
            //    return params?.data?.sumPaidToDateExpense;
            //}
        },
        {
            headerName: 'TPA Outstanding Indemnity Reserves',
            cellStyle: { textAlign: 'center' },
            flex: 1,
            field: 'sumOutstandingLossReserves',
            //valueGetter: function (params) {
            //    return params?.data?.sumOutstandingLossReserves;
            //}
        },
        {
            headerName: 'TPA Outstanding Medical Reserves',
            cellStyle: { textAlign: 'center' },
            flex: 1,
            field: 'sumOutstandingMedicalReserves',
            //valueGetter: function (params) {
            //    return params?.data?.sumOutstandingMedicalReserves;
            //}
        },
        {
            headerName: 'TPA Total Outstanding Loss Reserves',
            cellStyle: { textAlign: 'center' },
            flex: 1,
            field: 'sumTotalOutstandingLossReserves',
            //valueGetter: function (params) {
            //    return params?.data?.sumTotalOutstandingLossReserves;
            //}
        },
        {
            headerName: 'TPA Total Outstanding Expense Reservess',
            cellStyle: { textAlign: 'center' },
            flex: 1,
            field: 'sumTotalOutstandingExpenseReserves',
            //valueGetter: function (params) {
            //    return params?.data?.sumTotalOutstandingExpenseReserves;
            //}
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
   /* const onDelete = async (id) => {
        $dispatch(ReimbursementCompanyDollarDeleteActions.delete({ reimbursementCompanyDollarID: id }));;
        loadCompanyDollarList();
    };
    async function onRowClicked(obj) {
        try {
            $dispatch(ReimbursementCompanyDollarActions.get({ reimbursementCompanyDollarID: obj?.reimbursementCompanyDollarID }));
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, selectedMenu: "COMPANYDOLLAR", helpContainerName: 'Company Dollar Details' } });

        } catch (e) {
            enqueueSnackbar(e.toString(), { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        }
    }*/
    return (
        <>
            <Panel>
                <PanelContent style={{ height: 800 }}>
                    <GridContainer className="ag-theme-balham">
                        <AgGridReact
                            columnDefs={columnDefs}
                            defaultColDef={defaultColDef}
                            //rowData={request ? (reimbursementCompanyDollarList ? reimbursementCompanyDollarList : []) : []}
                            pagination={true}
                        />
                    </GridContainer>
                </PanelContent>
            </Panel>
        </>
    );

};