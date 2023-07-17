


import { AgGridReact } from 'ag-grid-react';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
    ASYNC_STATES
} from '../../../../../../Core/Enumerations/redux/async-states';
import {  AlertDialogSlide, Panel, PanelContent, PanelHeader } from '../../../../../../Core/Forms/Common';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    ReimbursementCompanyDollarListSelectors,
    ReimbursementCompanyDollarActions,
    ReimbursementCompanyDollarListActions,
    ReimbursementCompanyDollarDeleteSelectors,
    ReimbursementCompanyDollarDeleteActions
} from '../../../../../../Core/State/slices/reimbursement'
import EditIcon from '@mui/icons-material/Edit';
import { ConfirmationDialog, SelectList, Spinner, UserInputDialog } from '../../../../../../Core/Forms/Common';
import { numberWithCommas } from '../../../../../../Core/Utility/common';

const GridContainer = styled.div`
    height: 200px;
    width: 100%;
`;




export const CompanyDollarListSection = ({claim, request, dispatch }) => {

    let $dispatch = useDispatch();

    const { enqueueSnackbar } = useSnackbar();
    const reimbursementCompanyDollarListState = useSelector(ReimbursementCompanyDollarListSelectors.selectLoading());
    let reimbursementCompanyDollarList = useSelector(ReimbursementCompanyDollarListSelectors.selectData());
    reimbursementCompanyDollarList = reimbursementCompanyDollarList?.filter((item) => item.wCReimbursementID === request.currentReimbursement.wCReimbursementID);
    const [showConfirmation, setShowConfirmation] = React.useState(false);
    const [companyDollar, setCompanyDollar] = React.useState(null);
    const totalGrossCompanyPaids = reimbursementCompanyDollarList?.reduce((acc, curr) => {
        acc.sumPaidToDateIndemnity = (acc.sumPaidToDateIndemnity || 0) + curr.paidToDateIndemnity;
        acc.sumPaidToDateMedical = (acc.sumPaidToDateMedical || 0) + curr.paidToDateMedical;
        acc.sumLossPaid = (acc.sumLossPaid || 0) + curr.totalLossPaid;
        acc.sumPaidToDateExpense = (acc.sumPaidToDateExpense || 0) + curr.paidToDateExpense;
        acc.sumOutstandingLossReserves = (acc.sumOutstandingLossReserves || 0) + curr.outstandingIndemnityReserves;
        acc.sumOutstandingMedicalReserves = (acc.sumOutstandingMedicalReserves || 0) + curr.outstandingMedicalReserves;
        acc.sumTotalOutstandingLossReserves = (acc.sumTotalOutstandingLossReserves || 0) + curr.totalOutstandingLossReserves;
        acc.sumTotalOutstandingExpenseReserves = (acc.sumTotalOutstandingExpenseReserves || 0) + curr.outstandingExpenseReserves;
        acc.sumTotalRecovery = (acc.sumTotalRecovery || 0) + (curr.subrogation + curr.secondInjuryFund);
        return acc;
    }, {})
    // React.useEffect(() => {
    //     if (reimbursementCompanyDollarListState === ASYNC_STATES.IDLE) {
    //         $dispatch(ReimbursementCompanyDollarListActions.list({ wCReimbursementID: request.currentReimbursement.wCReimbursementID }));
    //     }
    //     return () => {
    //         $dispatch(ReimbursementCompanyDollarActions.clearStatus());
    //     }

    // }, []);
    React.useEffect(() => {
        if (reimbursementCompanyDollarListState === ASYNC_STATES.SUCCESS) {
            let list = JSON.parse(JSON.stringify(reimbursementCompanyDollarList));

            list.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isProcessing: false, editMOdeCompanyDollar: false, CompanyDollarsList: list, originalReimbursementCompanyDollar: {}, currentReimbursementCompanyDollar: {}, helpContainerName: 'ReimbursementCompanyDollar' } });

        } else if (reimbursementCompanyDollarListState === ASYNC_STATES.ERROR) {
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isProcessing: false } });
        }

    }, [reimbursementCompanyDollarListState]);

    const columnDefs = [
        {
            headerName: 'Claimant',
            field: 'claimantName',
            flex: 1,
            cellStyle: { textAlign: 'center' },
            valueGetter: function (params) {
                return (params.data?.wCClaimant?.claimantName ? params.data?.wCClaimant?.claimantName : "");
            },
        },
        {
            headerName: 'Paid to Date Indemnity',
            field: 'paidToDateIndemnity',
            cellStyle: { textAlign: 'center' },
            flex: 1,
            valueGetter: function (params) {
                return numberWithCommas(params?.data?.paidToDateIndemnity);
            }
        },
        {
            headerName: 'Paid to Date Medical',
            field: 'paidToDateMedical',
            cellStyle: { textAlign: 'center' },
            flex: 1,
            valueGetter: function (params) {
                return numberWithCommas(params?.data?.paidToDateMedical);
            }
        },
        {
            headerName: 'Total Loss Paid',
            cellStyle: { textAlign: 'center' },
            flex: 1,
            field: 'totalLossPaid',
            valueGetter: function (params) {
                return numberWithCommas(params?.data?.totalLossPaid);
            }
        },
        {
            headerName: 'Paid to Date Expense',
            cellStyle: { textAlign: 'center' },
            flex: 1,
            field: 'paidToDateExpense',
            valueGetter: function (params) {
                return numberWithCommas(params?.data?.paidToDateExpense);
            }
        },
        {
            headerName: 'O/S Loss Reserves',
            cellStyle: { textAlign: 'center' },
            flex: 1,
            field: 'outstandingIndemnityReserves',
            valueGetter: function (params) {
                return numberWithCommas(params?.data?.outstandingIndemnityReserves);
            }
        },
        {
            headerName: 'O/S Medical Reserves',
            flex: 1,
            cellStyle: { textAlign: 'center' },
            field: 'outstandingMedicalReserves',
            valueGetter: function (params) {
                return numberWithCommas(params?.data?.outstandingMedicalReserves);
            }
        },
        {
            headerName: 'Total O/S Loss Reserves',
            cellStyle: { textAlign: 'center' },
            flex: 1,
            field: 'totalOutstandingLossReserves',
            valueGetter: function (params) {
                return numberWithCommas(params?.data?.totalOutstandingLossReserves);
            }
        },
        {
            headerName: 'Total O/S Expense Reservess',
            cellStyle: { textAlign: 'center' },
            flex: 1,
            field: 'outstandingExpenseReserves',
            valueGetter: function (params) {
                return numberWithCommas(params?.data?.outstandingExpenseReserves);
            }
        },
        {
            headerName: 'Subrogation',
            cellStyle: { textAlign: 'center' },
            flex: 1,
            field: 'subrogation',
            valueGetter: function (params) {
                return numberWithCommas(params?.data?.subrogation);
            }
        },
        {
            headerName: 'Second Injury Fund',
            cellStyle: { textAlign: 'center' },
            flex: 1,
            field: 'secondInjuryFund',
            valueGetter: function (params) {
                return numberWithCommas(params?.data?.secondInjuryFund);
            }
        },
        {
            headerName: "",
            cellStyle: { textAlign: 'center' },
            flex: 1,
            cellRenderer: function (params) {
                return (<EditIcon style={{cursor:"pointer"}} button onClick={() => onRowClicked(params.data)} />)
            }
        },
        {
            headerName: "",
            cellStyle: { textAlign: 'center' },
            flex: 1,
            cellRenderer: function (params) {
                return (<DeleteIcon style={{cursor:"pointer"}} button onClick={() => onDelete(params.data.reimbursementCompanyDollarID)} />)
            }
        },
    ];
    const loadCompanyDollarList = async () => {
        await $dispatch(ReimbursementCompanyDollarListActions.list({ wCReimbursementID: request?.currentReimbursement?.wCReimbursementID }));
    }
    const columnDefsTotal = [

        {
            headerName: 'Paid to Date Indemnity',
            field: 'sumPaidToDateIndemnity',
            cellStyle: { textAlign: 'center' },
            flex: 1,
            valueGetter: function (params) {
                return numberWithCommas(params?.data?.sumPaidToDateIndemnity);
            }
        },
        {
            headerName: 'Paid to Date Medical',
            field: 'sumPaidToDateMedical',
            cellStyle: { textAlign: 'center' },
            flex: 1,
            valueGetter: function (params) {
                return numberWithCommas(params?.data?.sumPaidToDateMedical);
            }
        },
        {
            headerName: 'Total Loss Paid',
            cellStyle: { textAlign: 'center' },
            flex: 1,
            field: 'sumLossPaid',
            valueGetter: function (params) {
                return numberWithCommas(params?.data?.sumLossPaid);
            }
        },
        {
            headerName: 'Paid to Date Expense',
            cellStyle: { textAlign: 'center' },
            flex: 1,
            field: 'sumPaidToDateExpense',
            valueGetter: function (params) {
                return numberWithCommas(params?.data?.sumPaidToDateExpense);
            }
        },
        {
            headerName: 'O/S Loss Reserves',
            cellStyle: { textAlign: 'center' },
            flex: 1,
            field: 'sumOutstandingLossReserves',
            valueGetter: function (params) {
                return numberWithCommas(params?.data?.sumOutstandingLossReserves);
            }
        },
        {
            headerName: 'O/S Medical Reserves',
            cellStyle: { textAlign: 'center' },
            flex: 1,
            field: 'sumOutstandingMedicalReserves',
            valueGetter: function (params) {
                return numberWithCommas(params?.data?.sumOutstandingMedicalReserves);
            }
        },
        {
            headerName: 'Total O/S Loss Reserves',
            cellStyle: { textAlign: 'center' },
            flex: 1,
            field: 'sumTotalOutstandingLossReserves',
            valueGetter: function (params) {
                return numberWithCommas(params?.data?.sumTotalOutstandingLossReserves);
            }
        },
        {
            headerName: 'Total O/S Expense Reservess',
            cellStyle: { textAlign: 'center' },
            flex: 1,
            field: 'sumTotalOutstandingExpenseReserves',
            valueGetter: function (params) {
                return numberWithCommas(params?.data?.sumTotalOutstandingExpenseReserves);
            }
        },
        {
            headerName: 'Total Recovery',
            cellStyle: { textAlign: 'center' },
            flex: 1,
            field: 'sumTotalRecovery',
            valueGetter: function (params) {
                return numberWithCommas(params?.data?.sumTotalRecovery);
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
    const onDelete = async (id) => {
        setShowConfirmation(true)
        setCompanyDollar(id);
    };

    const deleteCompanyDollar = async () => {
        setShowConfirmation(false);
        await $dispatch(ReimbursementCompanyDollarDeleteActions.delete({ reimbursementCompanyDollarID: companyDollar }));;
        loadCompanyDollarList();
    }
    async function onRowClicked(obj) {
        try {
            $dispatch(ReimbursementCompanyDollarActions.get({ reimbursementCompanyDollarID: obj?.reimbursementCompanyDollarID }));
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, selectedMenu: "COMPANYDOLLAR", helpContainerName: 'Company Dollar Details' } });

        } catch (e) {
            enqueueSnackbar(e.toString(), { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        }
    }
    return (
        <>
            <Panel>
                <AlertDialogSlide open={showConfirmation} onNo={() => setShowConfirmation(!showConfirmation)} dialogTitle={"Delete"} dialog={"Are you sure, Do you want to delete?"} onYes={deleteCompanyDollar} />

                        <PanelHeader><span style={{ fontWeight: 'bold', fontSize: '14px' }}>Claimant Details</span></PanelHeader>
                {reimbursementCompanyDollarListState === ASYNC_STATES.WORKING ?
                    <Spinner />
                    :
                    <>
                        <PanelContent style={{ height: "100%" }}>
                            <GridContainer className="ag-theme-balham">
                                <AgGridReact
                                    columnDefs={columnDefs}
                                    defaultColDef={defaultColDef}
                                    rowData={request ? (reimbursementCompanyDollarList ? reimbursementCompanyDollarList : []) : []}
                                    pagination={true}
                                />
                            </GridContainer>
                        </PanelContent>
                    </>
                }
                <PanelHeader><span style={{ fontWeight: 'bold', fontSize: '14px' }}>Total Gross Company Paids</span></PanelHeader>
                {reimbursementCompanyDollarListState === ASYNC_STATES.WORKING ?
                    <Spinner />
                    :
                    <>
                        <PanelContent style={{ height: 800 }}>
                            <GridContainer className="ag-theme-balham">
                                <AgGridReact
                                    columnDefs={columnDefsTotal}
                                    defaultColDef={defaultColDef}
                                    rowData={([totalGrossCompanyPaids] ? [totalGrossCompanyPaids] : [])}
                                    pagination={true}
                                />
                            </GridContainer>
                        </PanelContent>
                    </>
                }
            </Panel>
        </>
    );

};