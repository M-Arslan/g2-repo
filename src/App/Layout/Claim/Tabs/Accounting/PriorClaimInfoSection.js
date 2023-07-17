


import { AgGridReact } from 'ag-grid-react';
import { useSnackbar } from 'notistack';
import React from 'react';
import styled from 'styled-components';
import { formatDate, Panel, PanelContent, PanelHeader, Spinner } from '../../../../Core/Forms/Common';
import { loadActionLogList } from '../../../ActionLog/Queries';
import { findAcitivityTypeUIByAcitivityType, findMenusToDisplay, loadCloseActivity, loadMLASuppressionsActivity, loadGenesisMLAActivity, loadOpenActivity, loadPaymentActivity, loadReopenActivity, loadReserveChangeActivity, loadSpecialInstructionsActivity } from './Queries';
import { loadPriorClaimActivity } from './Queries/loadPriorClaimActivity';
import { loadWCTabularUpdateActivity } from './Queries/loadActivity';


const GridContainer = styled.div`
    height: 90%;
    width: 100%;
`;

let gridApi = null;
let columnApi;

export const PriorClaimInfoSection = (({ request, dispatch }) => {
    const { enqueueSnackbar } = useSnackbar();
  

    const [state, setState] = React.useState({
        loaded: false,
        data: [],
    });
    const colDefs = [
        {
            headerName: 'Activity Type',
            field: 'accountingTransTypeText',
            filter: "agTextColumnFilter",
            sortable: true,
            tooltipField: "Activity Type",
            cellRenderer: 'agGroupCellRenderer',
        }, {
            headerName: 'Requested Date',
            field: 'activityCreatedDate',
            tooltipField: "Requested Date",            
            sort: 'desc',
            cellRenderer: function (params) {
                return formatDate(params.value);
            },
            filter: "agDateColumnFilter",
            filterParams: {
                comparator: function (filterLocalDateAtMidnight, cellValue) {
                    let dateAsString = cellValue;
                    if (dateAsString === null) return -1;
                    let dateParts = dateAsString.split("T")[0];
                    dateParts = dateParts.split("-");
                    let cellDate = new Date(Number(dateParts[0]), Number(dateParts[1]) - 1, Number(dateParts[2]));
                    if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
                        return 0;
                    }
                    if (cellDate < filterLocalDateAtMidnight) {
                        return -1;
                    }
                    if (cellDate > filterLocalDateAtMidnight) {
                        return 1;
                    }
                },
            },
        }, {
            headerName: 'Requested By',
            field: 'activityCreatedByFullName',
            tooltipField: "Requested By",
            filter: "agTextColumnFilter",
            sortable: true,
        }, {
            headerName: 'Status',
            field: 'statusText',
            filter: "agTextColumnFilter",
            sortable: true,
            tooltipField: "Status",
        }, {
            headerName: 'Status Date',
            field:'statusDate',
            tooltipField: "Status Date",
            cellRenderer: function (params) {
                return formatDate(params.value);
            },
            filter: "agDateColumnFilter",
            filterParams: {
                comparator: function (filterLocalDateAtMidnight, cellValue) {
                    let dateAsString = cellValue;
                    if (dateAsString === null) return -1;
                    let dateParts = dateAsString.split("T")[0];
                    dateParts = dateParts.split("-");
                    let cellDate = new Date(Number(dateParts[0]), Number(dateParts[1]) - 1, Number(dateParts[2]));
                    if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
                        return 0;
                    }
                    if (cellDate < filterLocalDateAtMidnight) {
                        return -1;
                    }
                    if (cellDate > filterLocalDateAtMidnight) {
                        return 1;
                    }
                },
            },
        },
    ]
    const loadActionLogListData = async (params) => {
        try {
            let actionLogList = await loadActionLogList(params.data.claimMasterID, params.data.activityID);
            actionLogList.data.actionLogList.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
            return actionLogList.data.actionLogList;
        } catch (e) {
            console.log('[ERROR] PriorClaimInfoSection line 111', e);
            console.log(toString(e));
        }
    }
    const detailCellRendererParams = {
        detailGridOptions: {
            pagination: true,
            paginationPageSize:10,
            columnDefs: [
                {
                    field: 'firstName',
                    headerName: 'Action User',
                    cellRenderer: function (params) {
                        return params.data.firstName + " " + params.data.lastName;
                    }
                },
                {
                    field: 'actionTypeText',
                    headerName: 'Action',
                },
                {
                    field: 'createdDate',
                    headerName: 'Action Date',
                    cellRenderer: function (params) {
                        return formatDate(params.value);
                    },
                }
            ],
            defaultColDef: { flex: 1, resizable: true },
        },
        getDetailRowData: function (params) {
            Promise.all([
                loadActionLogListData(params),
            ]).then(([pc]) => {
                params.successCallback(pc);
            });
        },
    };

    const onGridReady = (params) => {
        gridApi = params.api;
        columnApi = params.columnApi;
    };

    const defaultColDef = {
        cellClass: 'cell-wrap-text',
        cellStyle: { 'white-space': 'normal' },
        sortable: false,
        resizable: true,
    };

    React.useEffect(() => {
        Promise.all([
            loadPriorClaimActivity(request.claim.claimMasterID),
        ]).then(([pc]) => {
            setState({
                loaded: true,
                data: (pc.data.accountingList || []).filter(X=> X.accountingTransTypeID != 31)
            });
        })

    },[]);
    async function onRowSelected(e) {
        try {
            let result = {}; 
            dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: true, isProcessing: true } });
            if (findAcitivityTypeUIByAcitivityType(e.data.accountingTransTypeID) === "OPENCLAIMACTIVTY") {
                result = await loadOpenActivity(e.data.activityID);
            }
            else if (findAcitivityTypeUIByAcitivityType(e.data.accountingTransTypeID) === "MLASUPPRESSIONCLAIMACTIVTY") {
                result = await loadMLASuppressionsActivity(e.data.activityID);
            }
            else if (findAcitivityTypeUIByAcitivityType(e.data.accountingTransTypeID) === "GENESISMLA") {
                result = await loadGenesisMLAActivity(e.data.activityID);
            }
            else if (findAcitivityTypeUIByAcitivityType(e.data.accountingTransTypeID) === "REOPENACTIVTY") {
                result = await loadReopenActivity(e.data.activityID);
            }
            else if (findAcitivityTypeUIByAcitivityType(e.data.accountingTransTypeID) === "RESERVECHANGEACTIVTY") {
                result = await loadReserveChangeActivity(e.data.activityID);
            }
            else if (findAcitivityTypeUIByAcitivityType(e.data.accountingTransTypeID) === "SPECIALINSTRUCTIONSACTIVTY") {
                result = await loadSpecialInstructionsActivity(e.data.activityID);
            }
            else if (findAcitivityTypeUIByAcitivityType(e.data.accountingTransTypeID) === "EXPENSEPAYMENTCLAIMACTIVITY") {
                result = await loadPaymentActivity(e.data.activityID);
            }
            else if (findAcitivityTypeUIByAcitivityType(e.data.accountingTransTypeID) === "CLOSECLAIMACTIVITY") {
                result = await loadCloseActivity(e.data.activityID);
            }
            else if (findAcitivityTypeUIByAcitivityType(e.data.accountingTransTypeID) === "INITIALRINOTICE" || findAcitivityTypeUIByAcitivityType(e.data.accountingTransTypeID) === "DEDUCTIBLECOLLECTION") {
                result = await loadCloseActivity(e.data.activityID);
            }
            else if (findAcitivityTypeUIByAcitivityType(e.data.accountingTransTypeID) === "WCTABULARUPDATECLAIMACTIVITY") {
                result = await loadWCTabularUpdateActivity(e.data.activityID);
            }
            ParseGQErrors(result.errors, result.error);
            if (result.data.activity) {
                result.data.activity.accountingTransTypeText = (result.data.activity.accountingTransType || {}).accountingTransTypeText;
                let actionLogList = await loadActionLogList(request.claim.claimMasterID, result.data.activity.activityID);
                actionLogList = actionLogList.data.actionLogList;
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, actionLogList: actionLogList||[], currentClaimActivity: result.data.activity, isSaving: false, isProcessing: false, selectedMenu: findAcitivityTypeUIByAcitivityType(result.data.activity.accountingTransTypeID), menusToDisplay: findMenusToDisplay(result.data.activity.accountingTransTypeID)} });
            }
            else {
                dispatch({ type: "UPDATE_UNIVERSAL_REQUEST", request: { ...request, isSaving: false, isProcessing: false } });
            }
        }
        catch (e) {
            enqueueSnackbar(toString(e), { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        }

    }
    function ParseGQErrors(errors, error) {
        if (error || errors) {
            enqueueSnackbar("An error occured.", { variant: 'error',  anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        }
    }

    return (
        !state.loaded ? <Spinner /> :
        <Panel>
            <PanelHeader><span style={{ fontWeight: 'bold', fontSize: '14px' }}>Prior Claim Activity</span></PanelHeader>
            <PanelContent style={{ height: 800 }}>
                    <GridContainer className="ag-theme-balham">
                        <AgGridReact
                        columnDefs={colDefs}
                        rowData={state.data ? (state.data ? state.data : []) : []}
                        onRowClicked={onRowSelected}
                        defaultColDef={defaultColDef}
                        pagination={true}
                        onGridReady={onGridReady}
                        floatingFilter
                        paginationPageSize={20}
                        masterDetail={true}
                        detailCellRendererParams={detailCellRendererParams}


                        >
                        </AgGridReact>
                    </GridContainer>
                
               </PanelContent>   
        </Panel>
        );

})