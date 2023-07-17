import { Menu as MenuIcon } from '@mui/icons-material';
import { IconButton } from '@mui/material';



import {
    AgGridReact
} from 'ag-grid-react';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { APP_TYPES } from '../../../Core/Enumerations/app/app-types';
import {
    formatDate
} from '../../../Core/Forms/Common';
import {
    customGQLQuery,
    loadUsers
} from '../../../Core/Services/EntityGateway';
import { userSelectors } from '../../../Core/State/slices/user';
import { getSortedColumns } from '../../../Core/Utility/colStateUtils';
import { CaraUrls } from '../../../Settings';
import { Unauthorized } from '../../Unauthorized';
import {
    DashboardUserGridViews
} from '../UserGridViews/DashboardUserGridViews';
import { CLAIM_TYPES } from '../../../Core/Enumerations/app/claim-type';
import { LEGAL_ENTITY } from '../../../Core/Enumerations/app/legal-entity';

const ExpenseInvoiceLandingContainer = styled.div`
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
`;

const ExpenseInvoiceLandingToolbar = styled.div`
    background-color: ${props => props.theme.backgroundDark};
    height: 37px;
    width: 100%;
    padding: 0;
    border-bottom: solid 1px ${props => props.theme.onBackground};

    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    align-content: center;
`;

const Toolbuttons = styled.div`
    height: 36px;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    align-content: center;
`;

const ExpenseInvoiceLandingHeader = styled.section`
    width: 100%;
    height:100%;
    padding: .5em;
    margin: 0;
    border: none;
    margin-bottom: .5em;
    background-color: ${props => props.theme.backgroundColor};
`;
const Title = styled.div`
    display: flex;
    padding: 12px;
    font-weight: bold;
`;

const GridContainer = styled.div`
    height: 90%;
    width: 100%;
    padding:0px 10px 0px 10px;
`;


const columnDataKey = "columnData";
const filterDataKey = "filterData";
const sortDataKey = "sortData";
let gridApi;
let columnApi;
let selectedView;
export const ExpenseInvoiceDashboard = ({ match }) => {
    const landingPage = "ExpenseInvoiceLandingPage";
    const $auth = useSelector(userSelectors.selectAuthContext());
    const [isAuthorize, setIsAuthorize] = React.useState(true);
    const [accountingData, setAccountingData] = React.useState({
        statusTypes: [],
    });
    const [users, setUsers] = React.useState({
        users: [],
    });

    const [open, setOpen] = React.useState(false);
    const [CARAInvoiceClaimFileURL, setCARAInvoiceClaimFileURL] = React.useState('');

    const colDefs = [
        {
            headerName: 'Claim Number',
            field: 'claimID',
            colId: 'claimID',
            sortable: true,
            filter: "agTextColumnFilter",
            editable: false,
            resizable: false,
            sort: "desc",
            tooltipField: "Claim Number",
            cellRenderer: function (params) {
                if (params.value !== undefined) {
                    if (params.data.claimType === CLAIM_TYPES.LEGAL) {
                        return ((params.data.g2LegalEntity === LEGAL_ENTITY.GENESIS_REINSURANCE) || (!params.data.statutoryClaimID) ? <a href={`/legal/${params.data.claimMasterID}/financials#Activity/${params.data.activityID}`} target="_blank">{params.value}</a> : <a href={`/legal/${params.data.claimMasterID}/financials#Activity/${params.data.activityID}`} target="_blank">{`${params.value}/${params.data.statutoryClaimID}`}</a>)
                    }
                    else {
                        return ((params.data.g2LegalEntity === LEGAL_ENTITY.GENESIS_REINSURANCE) || (!params.data.statutoryClaimID) ? <a href={`/claim/${params.data.claimMasterID}/financials#Activity/${params.data.activityID}`} target="_blank">{params.value}</a> : <a href={`/claim/${params.data.claimMasterID}/financials#Activity/${params.data.activityID}`} target="_blank">{`${params.value}/${params.data.statutoryClaimID}`}</a>)
                    }
                }
                else {
                    return null;
                }
            },
            filterParams: {
                filterOptions: ['contains'],
                suppressAndOrCondition: true
            }

        },
        {
            headerName: 'Invoice Number',
            field: 'invoiceNumber',
            colId: 'invoiceNumber',
            sortable: true,
            filter: "agTextColumnFilter",
            tooltipField: "Invoice Number",
            filterParams: {
                filterOptions: ['contains'],
                suppressAndOrCondition: true
            }
        },
        {
            headerName: 'Transaction Status',
            field: 'statusText',
            colId: 'statusText',
            sortable: true,
            filter: "agSetColumnFilter",
            tooltipField: "Transaction Status",
            filterParams: {
                values: accountingData.statusTypes?.map(x => x.statusText),
                suppressAndOrCondition: true
            }
        },

        {
            headerName: 'Company',
            field: 'genReCompanyName',
            colId: 'genReCompanyName',
            sortable: true,
            tooltipField: "Company"

        },
        {
            headerName: 'Last Modified Date',
            field: 'modifiedDate',
            colId: 'modifiedDate',
            sortable: true,
            filter: "agDateColumnFilter",
            tooltipField: "Last Modified Date",
            cellRenderer: function (params) {
                return formatDate(params.value);
            },
            filterParams: {
                filterOptions: ['equals'],
                suppressAndOrCondition: true
            },
        },
        {
            headerName: 'Date Requested',
            field: 'createdDate',
            colId: 'createdDate',
            sortable: true,
            tooltipField: "Date Requested",
            filter: "agDateColumnFilter",
            cellRenderer: function (params) {
                return formatDate(params.value);
            },
            filterParams: {
                filterOptions: ['equals'],
                suppressAndOrCondition: true
            },
        },
        {
            headerName: 'Date Received',
            field: 'dateReceived',
            colId: 'dateReceived',
            sortable: true,
            tooltipField: "Date Received",
            filter: "agDateColumnFilter",
            cellRenderer: function (params) {
                return formatDate(params.value);
            },
            filterParams: {
                filterOptions: ['equals'],
                suppressAndOrCondition: true
            },
        },
        
        {
            headerName: 'Task Owner',
            field: 'taskOwner',
            colId: 'taskOwner',
            filter: "agSetColumnFilter",
            sortable: true,
            tooltipField: "Task Owner",
            filterParams: {
                values: users?.users?.map(x => x.fullName),
                suppressAndOrCondition: true
            }
        },
        {
            headerName: 'Requestor',
            field: 'createdBy',
            colId: 'createdBy',
            filter: "agSetColumnFilter",
            sortable: true,
            tooltipField: "Requestor",
            filterParams: {
                values: users?.users?.map(x => x.fullName),
                suppressAndOrCondition: true
            }
        },
        {
            headerName: 'Claim Examiner',
            field: 'claimExaminerFullName',
            colId: 'claimExaminerFullName',
            sortable: true,
            tooltipField: "Claim Examiner",
            filter: "agSetColumnFilter",
            filterParams: {
                values: users?.users?.map(x => x.fullName),
                suppressAndOrCondition: true
            }
        },
        {
            headerName: 'Invoice Docs',
            field: 'batchID',
            colId: 'batchID',
            sortable: false,
            filter: false,
            tooltipField: "Invoice Docs",
            cellRenderer: function (params) {
                if (params.data.claimID !== '' && params.data.batchID !== null) {
                    return <a href={`${CARAInvoiceClaimFileURL}${params.data.batchID}`} target="_blank">Invoice</a>;
                }
                return '';
            },
        }
    ];

    const defaultColDef = {
        autoHeight: true,
        autoWidth: true,
        sortable: true,
        resizable: true,
        flex: 1,
        filter: true,
        floatingFilter: true,
    };

    /* Start Grid Functions */
    const onGridReady = (params) => {
        gridApi = params.api;
        columnApi = params.columnApi;
    };

    const onColumnMoved = (params) => {
        let columnData = JSON.stringify(params.columnApi.getColumnState());
        localStorage.setItem(columnDataKey, columnData);
    };

    const onSortChanged = (params) => {
        var colState = params.columnApi.getColumnState();
        var sortState = colState
            .filter(function (s) {
                return s.sort !== null;
            })
            .map(function (s) {
                return { colId: s.colId, sort: s.sort, sortIndex: s.sortIndex };
            });
        localStorage.setItem(sortDataKey, JSON.stringify(sortState));
        localStorage.setItem(columnDataKey, JSON.stringify(colState));
    };

    const onFilterChanged = (params) => {
        let filterData = JSON.stringify(params.api.getFilterModel());
        localStorage.setItem(filterDataKey, filterData);
    };
 
    const setGridFilters = () => {
        if (selectedView !== null && selectedView !== undefined) {

            try {
                columnApi.applyColumnState(
                {
                    state: JSON.parse(selectedView.columnData),
                    defaultState: { sort: null },
                });
                gridApi.setFilterModel(JSON.parse(selectedView.filterData));
            }
            catch (ex) {
                console.log(ex);
            }
           
        }
        gridApi.sizeColumnsToFit();

    };
    /* End Grid Functions */

    const userGridViewFunction = (view) => {
        console.log("Grid Meta Data", selectedView);
        selectedView = view;
        setGridFilters();
       // loadExpenseInvoiceData();
        var datasource = ServerSideDatasource();
        gridApi.setServerSideDatasource(datasource);
    }
    function ServerSideDatasource() {
        return {
            getRows: async function (params) {
                let searchDataObj = {
                    "pageNumber": params.request.endRow / 50,
                    "pageSize": 50
                };
                let expenseInvoiceSearch = "expenseInvoiceSearch";

                if (gridApi !== undefined) {
                    let filterModel = gridApi.getFilterModel();
                    if (filterModel.claimID !== undefined) {
                        searchDataObj.claimID = filterModel.claimID.filter;
                    }
                    if (filterModel.invoiceNumber !== undefined) {
                        searchDataObj.invoiceNumber = filterModel.invoiceNumber.filter;
                    }

                        
                        searchDataObj.g2LegalEntity = "General Star"

                    if (filterModel.createdDate !== undefined) {
                        searchDataObj.dateRequested = filterModel.createdDate.dateFrom;
                    }
                    if (filterModel.modifiedDate !== undefined) {
                        searchDataObj.modifiedDate = filterModel.modifiedDate.dateFrom;
                    }
                    if (filterModel.dateReceived !== undefined) {
                        searchDataObj.dateReceived = filterModel.dateReceived.dateFrom;
                    }
                    if (filterModel.statusText !== undefined) {
                        searchDataObj.claimStatusTypeText = filterModel.statusText.values.toString();
                    }
                    if (filterModel.createdBy !== undefined) {
                        let userIds = [];
                        users?.users?.filter(x => {
                            if (filterModel.createdBy.values.includes(x.fullName)) {
                                userIds.push(x.userID);
                                return x.userID;
                            }
                        })
                        searchDataObj.requestor = userIds.toString();
                    }
                    if (filterModel.claimExaminerFullName !== undefined) {
                        let userIds = [];
                           users?.users?.filter(x => {
                            if (filterModel.claimExaminerFullName.values.includes(x.fullName)) {
                                userIds.push(x.userID);
                                return x.userID;
                            }
                        })
                        searchDataObj.claimExaminerID = userIds.toString();
                    }
                    if (filterModel.taskOwner !== undefined) {
                        let userIds = [];
                          users?.users?.filter(x => {
                            if (filterModel.taskOwner.values.includes(x.fullName)) {
                                userIds.push(x.userID);
                                return x.userID;
                            }
                        })
                        searchDataObj.taskOwner = userIds.toString();
                    }

                    const sortCols = getSortedColumns(columnApi);
                    if (sortCols.length > 0) {
                        const sortCol = sortCols[0];
                        if (sortCol.colId === 'claimExaminerFullName') {
                            searchDataObj.orderBy = "ClaimExaminerID " + sortCol.sort;
                        }
                        else {
                            searchDataObj.orderBy = sortCol.colId + " " + sortCol.sort;
                        }
                    }
                }

                let query = {
                    "query": `query($expenseInvoiceSearch:ExpenseInvoiceSearchInputhype!)
                        {
                        `+ expenseInvoiceSearch + `(expenseInvoiceSearch: $expenseInvoiceSearch)
                        {
                            expenseInvoiceSearchResult{
                                activityID
                                claimMasterID
                                claimID
                                dateReceived
                                batchID
                                claimPolicyID
                                genReCompanyName
                                invoiceNumber
                                statusText
                                claimExaminerFirstName
                                claimExaminerLastName
                                statutoryClaimID
                                createdDate
                                createdBy
                                modifiedDate
                                taskOwner
                                claimExaminerFullName
                                claimType
                            }
                        }
                    }`,
                    "variables": { "expenseInvoiceSearch": searchDataObj }
                }

                const ExpenseInvoiceGridData = await customGQLQuery(`accounting`, query);

                let expenseInvoice = {};
                if (expenseInvoiceSearch === "expenseInvoiceDefaultSearch") {
                    expenseInvoice = ExpenseInvoiceGridData.data.expenseInvoiceDefaultSearch.expenseInvoiceSearchResult;
                }
                else {
                    expenseInvoice = ExpenseInvoiceGridData.data?.expenseInvoiceSearch?.expenseInvoiceSearchResult;
                }

                var totalRows = -1;
                if (expenseInvoice.length < 50) {
                    totalRows = params.request.startRow + expenseInvoice.length;
                }
                params.successCallback(expenseInvoice, totalRows);
                if (gridApi !== undefined) {
                    //setGridFilters();
                    gridApi.hideOverlay();
                }

            }
        }
    }

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    /* End View Funtions */

    React.useEffect(() => {
        if (landingPage === "ExpenseInvoiceLandingPage") {
            if ($auth.hasPermission(APP_TYPES.Expense_Dashboard)) {
                setIsAuthorize(true);
            }
            else {
                setIsAuthorize(false);
            }
        }
        localStorage.removeItem(columnDataKey);
        localStorage.removeItem(sortDataKey);
        localStorage.removeItem(filterDataKey);
        Promise.all([
            loadUsers(),
            CaraUrls(),
            loadClaimStatusTypes()
        ])
            .then(([lu, ce, statuses]) => {
                setUsers({
                    users: lu.data.users,
                });
                setCARAInvoiceClaimFileURL(ce[4]);
                setAccountingData({ ...accountingData, statusTypes: statuses });
               // loadExpenseInvoiceData();
            });
    }, []);

    const setDataOfMetadata = (data) => {
        /*setMetadata(data);*/
    }
    const loadClaimStatusTypes = async () => {
        let query = {
            query: `
                query { 
                    claimStatusTypesForAccounting {
                        claimStatusTypeID
                        claimProcessIndicatorID
                        statusText
                    }
                }
            `,
        }

        const result = await customGQLQuery(`claims-common`, query);
        if (result.error) {
            //$notifications.notifyError(result.error);
        }

        if (typeof result.data === 'object' && result.data !== null) {
            return result.data.claimStatusTypesForAccounting;
        }
        return null;

    }
  
    return (
        <>
            {isAuthorize ? (
                <ExpenseInvoiceLandingContainer>
                    <ExpenseInvoiceLandingToolbar>
                        <Toolbuttons>

                        </Toolbuttons>
                        <Title>Expense Invoice Dashboard</Title>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                        >
                            <MenuIcon />
                        </IconButton>
                    </ExpenseInvoiceLandingToolbar>
                    <ExpenseInvoiceLandingHeader>
                        {users?.users?.length > 0 ? (
                            <GridContainer className="ag-theme-balham">
                                <AgGridReact
                                    defaultColDef={defaultColDef}
                                    columnDefs={colDefs}
                                    onGridReady={onGridReady}
                                    onFilterChanged={onFilterChanged}
                                    onSortChanged={onSortChanged}
                                    onColumnVisible={onColumnMoved}
                                    onColumnMoved={onColumnMoved}
                                    pagination={true}
                                    paginationPageSize={50}
                                    floatingFilter
                                    rowModelType={'serverSide'}
                                    serverSideStoreType={'partial'}
                                    cacheBlockSize={50}
                                    animateRows={true}
                                >
                                </AgGridReact>
                            </GridContainer>
                        ) : null
                        }
                    </ExpenseInvoiceLandingHeader>
                    { users?.users?.length > 0 ? (
                        <DashboardUserGridViews open={open} handleDrawerClose={handleDrawerClose} setData={setDataOfMetadata} userGridViewFunction={userGridViewFunction} gridApi={gridApi} landingPage={landingPage} columnApi={columnApi} />
                    ) : null
                    }
                 </ExpenseInvoiceLandingContainer>
            ) : <Unauthorized />}
        </>
    );
};