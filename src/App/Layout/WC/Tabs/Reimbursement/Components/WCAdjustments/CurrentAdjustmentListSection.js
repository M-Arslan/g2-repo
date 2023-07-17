
import { AgGridReact } from 'ag-grid-react';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import {
    ASYNC_STATES
} from '../../../../../../Core/Enumerations/redux/async-states';
import { Panel, PanelContent, PanelHeader, Spinner } from '../../../../../../Core/Forms/Common';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    WCReimbursementAdjustmentsListSelectors,
    WCReimbursementAdjustmentsActions,
    WCReimbursementAdjustmentsListActions,
    WCReimbursementAdjustmentsDeleteSelectors,
    WCReimbursementAdjustmentsDeleteActions
} from '../../../../../../Core/State/slices/reimbursement-adjustments'
import EditIcon from '@mui/icons-material/Edit';
import { numberWithCommas } from '../../../../../../Core/Utility/common';
import { formatDate } from '../../../../../../Core/Utility/formatDate';

const GridContainer = styled.div`
    height: 200px;
    width: 100%;
`;




export const CurrentAdjustmentListSection = ({ claim, request, dispatch }) => {

    let $dispatch = useDispatch();

    const { enqueueSnackbar } = useSnackbar();
    const reimbursementAdjustmentListState = useSelector(WCReimbursementAdjustmentsListSelectors.selectLoading());
    const reimbursementAdjustmentList = useSelector(WCReimbursementAdjustmentsListSelectors.selectData());

    React.useEffect(() => {
            $dispatch(WCReimbursementAdjustmentsListActions.list({ wCReimbursementID: request?.currentReimbursement.wCReimbursementID }));
        
        return () => {
            $dispatch(WCReimbursementAdjustmentsActions.clearStatus());
        }
    }, []);
    React.useEffect(() => {
        if (reimbursementAdjustmentListState === ASYNC_STATES.SUCCESS) {
            let list = JSON.parse(JSON.stringify(reimbursementAdjustmentList));

            list.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
            list = list.filter(x => x.claimStatusTypeID == 33);
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isProcessing: false, editModeAdjustments: false, Adjustments: list, originalReimbursementAdjustment: {}, currentReimbursementAdjustment: {}, helpContainerName: 'Adjustment Details' } });
        } else if (reimbursementAdjustmentListState === ASYNC_STATES.ERROR) {
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isProcessing: false } });
        }

    }, [reimbursementAdjustmentListState]);
   

    const defaultColDef = {
        cellClass: 'cell-wrap-text',
        cellStyle: { 'white-space': 'normal' },
        flex: 1,
        autoHeight: true,
        sortable: true,
        resizable: true,
        filter: true,
    };
    const loadAdjustmentList = async () => {
        await $dispatch(WCReimbursementAdjustmentsListActions.list({ wCReimbursementID: request?.currentReimbursement?.wCReimbursementID }));
    }
    const onDelete = async (id) => {
        $dispatch(WCReimbursementAdjustmentsDeleteActions.delete({ reimbursementAdjustmentID: id }));;
        loadAdjustmentList()
    };
    const columnDefs = [
        {
            headerName: 'Adjustment Type',
            flex: 1,
            cellStyle: { textAlign: 'center' },
            field: 'adjustmentTypeID',
            valueGetter: function (params) {
                return ((params.data?.adjustmentTypeID === 1 && "Adjusted from Medical Loss to Expense") ||
                    (params.data?.adjustmentTypeID === 2 && "Adjusted from Indemnity Loss") ||
                    (params.data?.adjustmentTypeID === 3 && "Adjusted from Medical Loss") ||
                        (params.data?.adjustmentTypeID === 4 && "Adjusted from Expense")) ;
            },
        },
        {
            headerName: 'Amount',
            field: 'amountAdjusted',
            cellStyle: { textAlign: 'center' },
            flex: 1,
            valueGetter: function (params) {
                return numberWithCommas(params?.data?.amountAdjusted);
            }
        },
        {
            headerName: 'Billing Date',
            field: 'paidToDateMedical',
            cellStyle: { textAlign: 'center' },
            flex: 1,
            valueGetter: function (params) {
                return formatDate(params?.data?.billingDate);
            }
        },
        {
            headerName: 'Explanation',
            cellStyle: { textAlign: 'center' },
            flex: 1,
            field: 'adjustmentExplanation',
            valueGetter: function (params) {
                return params?.data?.adjustmentExplanation;
            }
        },
        {
            headerName: "",
            cellStyle: { textAlign: 'center' },
            flex: 1,
            cellRenderer: function (params) {
                return (<EditIcon button onClick={() => onRowClicked(params.data)} />)
            }
        },
        {
            headerName: "",
            cellStyle: { textAlign: 'center' },
            flex: 1,
            cellRenderer: function (params) {
                return (<DeleteIcon button onClick={() => onDelete(params.data.reimbursementAdjustmentID)} />)
            }
        },
    ]; 
    async function onRowClicked(obj) {
        try {
            $dispatch(WCReimbursementAdjustmentsActions.get({ reimbursementAdjustmentID: obj?.reimbursementAdjustmentID }));
           dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, selectedMenu: "ADJUSTMENTS", helpContainerName: 'Adjustments Details' } });

        } catch (e) {
            enqueueSnackbar(e.toString(), { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        }
    }
    return (
        <>
            <Panel>
                <PanelHeader><span style={{ fontWeight: 'bold', fontSize: '14px' }}>Current Adjustments</span></PanelHeader>
                {reimbursementAdjustmentListState === ASYNC_STATES.WORKING ?
                    <Spinner />
                    :
                    <>
                        <PanelContent style={{ height: "100%" }}>
                            <GridContainer className="ag-theme-balham">
                                <AgGridReact
                                    columnDefs={columnDefs}
                                    defaultColDef={defaultColDef}
                                    rowData={request ? (request.Adjustments ? request.Adjustments : []) : []}
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