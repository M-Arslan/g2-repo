import React from 'react';
import styled from 'styled-components';
import {
    formatDate
} from '../../../Core/Forms/Common';
import { DashboardUserGridViews } from '../UserGridViews/DashboardUserGridViews';
import {
    Menu as MenuIcon
} from '@mui/icons-material';
import {
    IconButton
} from '@mui/material';
import { Unauthorized } from '../../Unauthorized';
import {
    AgGridReact
} from 'ag-grid-react';



import { useSelector } from 'react-redux';
import { APP_TYPES } from '../../../Core/Enumerations/app/app-types';
import { userSelectors } from '../../../Core/State/slices/user';
import { loadAccountingTransType } from '../../Claim/Tabs/Accounting/Queries';
import { customGQLQuery, loadUsers } from '../../../Core/Services/EntityGateway';
import { getSortedColumns } from '../../../Core/Utility/colStateUtils';
import { ACCOUNTING_TRANS_TYPES } from '../../../Core/Enumerations/app/accounting-trans-type';
import { LEGAL_ENTITY } from '../../../Core/Enumerations/app/legal-entity';
import { CLAIM_TYPES } from '../../../Core/Enumerations/app/claim-type';


const AccountingLandingContainer = styled.div`
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
`;

const AccountingLandingToolbar = styled.div`
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

const AccountingLandingHeader = styled.section`
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
export const AccountingDashboard = () => {
    const landingPage = "AccountingLandingPage";
    const $auth = useSelector(userSelectors.selectAuthContext())
    const [isAuthorize, setIsAuthorize] = React.useState(true);
    const [accountingData, setAccountingData] = React.useState({
        loaded: false,
        accounting: [],
        transTypes: [],
        transCodes: [],
        statusTypes : [],
    });
    const [users, setUsers] = React.useState({
        users: [],
    });
    //const [metadata, setMetadata] = React.useState({
    //    viewName: "",
    //    setDefaultView: false,
    //    ddlSelectedView: "de4fce1a-9382-40d1-5fc2-08d89a8e89bc",
    //});
    
    const [open, setOpen] = React.useState(false);

    const colDefs = [
        {
            headerName: 'Claim Number',
            field: 'claimID',
            colId: 'claimID',
            sortable: true,
            filter: "agTextColumnFilter",
            editable: false,
            resizable: false,
            tooltipField: "Claim Number",
            cellRenderer: function (params) {
                var claimOrLegal = 'Claim';
                if (params.data.claimType === CLAIM_TYPES.LEGAL) {
                    claimOrLegal = 'Legal'
                }
                if (params.data.activityTransactionType === 'File CIB') {
                    return ((params.data.g2LegalEntity === LEGAL_ENTITY.GENESIS_REINSURANCE) || (!params.data.statutoryClaimID) ? <a href={`/${claimOrLegal}/${params.data.claimMasterID}/claimants#Activity/${params.data.activityID}`} target="_blank">{params.value}</a> : <a href={`/${claimOrLegal}/${params.data.claimMasterID}`} target="_blank">{`${params.data.claimID}/${params.data.statutoryClaimID}`}</a>)
                }
                else if (params.data.activityTransactionType === 'PILR') {
                    return ((params.data.g2LegalEntity === LEGAL_ENTITY.GENESIS_REINSURANCE) || (!params.data.statutoryClaimID) ? <a href={`/${claimOrLegal}/${params.data.claimMasterID}/pilr#Activity/${params.data.activityID}`} target="_blank">{params.value}</a> : <a href={`/${claimOrLegal}/${params.data.claimMasterID}/pilr#Activity/${params.data.activityID}`} target="_blank">{`${params.data.claimID}/${params.data.statutoryClaimID}`}</a>)

                }
                else if (params.data.activityTransactionType === 'W/C Reimbursement Payment') {
                    return (!params.data.statutoryClaimID ? <a href={`/${claimOrLegal}/${params.data.claimMasterID}/reimbursement#Activity/${params.data.activityID}`} target="_blank">{params.value}</a> : <a href={`/${claimOrLegal}/${params.data.claimMasterID}/reimbursement#Activity/${params.data.activityID}`} target="_blank">{`${params.data.claimID}/${params.data.statutoryClaimID}`}</a>)

                }
                else if (params.value !== undefined) {
                    return ((params.data.g2LegalEntity === LEGAL_ENTITY.GENESIS_REINSURANCE) || (!params.data.statutoryClaimID) ? <a href={`/${claimOrLegal}/${params.data.claimMasterID}/financials#Activity/${params.data.activityID}`} target="_blank">{params.value}</a> : <a href={`/${claimOrLegal}/${params.data.claimMasterID}/financials#Activity/${params.data.activityID}`} target="_blank">{`${params.data.claimID}/${params.data.statutoryClaimID}`}</a>)

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
            headerName: 'Insured Name',
            field: 'insuredName',
            colId: 'insuredName',
            sortable: true,
            filter: "agTextColumnFilter",
            tooltipField: "Insured Name",
            filterParams: {
                filterOptions: ['contains'],
                suppressAndOrCondition: true
            }
        },
        {
            headerName: 'Activity Transaction Type',
            field: 'activityTransactionType',
            colId: 'activityTransactionType',
            sortable: true,
            filter: "agSetColumnFilter",
            tooltipField: "Activity Transaction Type",
            filterParams: {
                values: accountingData.transTypes.filter(x => x.accountingTransTypeID !== ACCOUNTING_TRANS_TYPES.GENESIS_MLA).map(x => x.accountingTransTypeText),
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
            filter: "agSetColumnFilter",
            tooltipField: "Company",
            filterParams: {
                values:["General Star","Genesis"],
                suppressAndOrCondition: true
            },
        },
        {
            headerName: 'UW Department',
            field: 'uWDept',
            colId: 'uWDept',
            sortable: true,
            filter: "agTextColumnFilter",
            tooltipField: "UW Department",
            filterParams: {
                filterOptions: ['contains'],
                suppressAndOrCondition: true
            }
        },        
        {
            headerName: 'Task Owner',
            sortable: true,
            filter: "agSetColumnFilter",
            field: 'taskOwner',
            colId: 'taskOwner',
            tooltipField: "Task Owner",
            filterParams: {
                values: users?.users?.map(x => x.fullName),
                suppressAndOrCondition: true
             }
        },
        {
            headerName: 'Last Modified Date',
            field: 'modifiedDate',
            colId: 'modifiedDate',
            sortable: true,
            tooltipField: "Last Modified Date",
            cellRenderer: function (params) {
                return formatDate(params.value);
            },
            filter: "agDateColumnFilter",
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
            filter: "agDateColumnFilter",
            tooltipField: "Date Requested",
            cellRenderer: function (params) {
                return formatDate(params.value);
            },
            filterParams: {
                filterOptions: ['equals'],
                suppressAndOrCondition: true
            },
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
            headerName: 'QA Status',
            field: 'grade',
            colId: 'grade',
            sortable: true,
            tooltipField: "QA Status",
            filter: "agSetColumnFilter",
            cellRenderer: function (params) {
                if (params.value === 'P') {
                    return "Pass";
                }
                else if (params.value === 'F') {
                    return "Fail"
                }
                else {
                    return ' ';
                }
            },
            filterParams: {
                values: ["Pass", "Fail"],
                suppressAndOrCondition: true
            }
        },
        {
            headerName: 'Urgent',
            field: 'urgent',
            colId: 'urgent',
            sortable:true,
            tooltipField: "Urgent",
            filter: "agSetColumnFilter",
            cellRenderer: function (params) {
                console.log("what is inside params.", params)
                if (params.value) {
                    return "Yes";
                }
                else {
                    return ' ';
                }
            },
            
        }

    ];

    const defaultColDef = {
        autoHeight: true,
        autoWidth: true,
        sortable: true,
        resizable: true,
        filter: true,
        floatingFilter: true,
    };

    /* Start Grid Functions */
    const onGridReady = (params) => {
        gridApi = params.api;
        columnApi = params.columnApi;
        //sizeToFit();
        //setGridFilters();
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
        let filterData = params.api.getFilterModel();
        if (selectedView.isSystem === true && selectedView.isDefault === true) {
            filterData.taskOwner = { "values": [$auth.currentUser.fullName], "filterType": "set" };
        }
        filterData = JSON.stringify(filterData);
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

    /* View Fucntions */

    const userGridViewFunction = (view) => {
        selectedView = view;
        setGridFilters();
        var datasource = ServerSideDatasource();
        gridApi.setServerSideDatasource(datasource);
    }


    function ServerSideDatasource() {
        return {
            getRows: async function (params) {
                let filterModel = gridApi.getFilterModel();
                let filterCount = Object.keys(gridApi.getFilterModel()).length;
                let sortCount = getSortedColumns(columnApi).length;

                let searchDataObj = {
                    "pageNumber": params.request.endRow / 50,
                    "pageSize": 50
                };
                
                let accountingSearch = "accountingSearch";
                if (sortCount === 0 && filterCount === 0 && (selectedView === undefined || (selectedView !== undefined && selectedView.isDefault && selectedView.isSystem))) {
                    accountingSearch = "accountingDefaultSearch";
                    searchDataObj = {
                        "taskOwner": $auth.currentUser.id,
                        "pageNumber": params.request.endRow / 50,
                        "pageSize": 50
                    };
                }
                if ((sortCount > 0 || filterCount > 0) && (selectedView === undefined || (selectedView !== undefined && selectedView.isDefault && selectedView.isSystem))) {
                    filterModel.taskOwner = { "values": [$auth.currentUser.fullName], "filterType": "set" };
                }

                if (filterCount > 0 || sortCount > 0 ) {
                    if (filterModel.claimID !== undefined) {
                        searchDataObj.claimID = filterModel.claimID.filter;
                    }
                    if (filterModel.insuredName !== undefined) {
                        searchDataObj.insuredName = filterModel.insuredName.filter;
                    }
                    if (filterModel.activityTransactionType !== undefined) {
                        searchDataObj.accountingTransTypeText = filterModel.activityTransactionType.values.toString();
                    }
                    if (filterModel.genReCompanyName !== undefined) {
                        searchDataObj.g2LegalEntity = filterModel.genReCompanyName.values.toString();
                    }
                    if (filterModel.uWDept !== undefined) {
                        searchDataObj.uWDept = filterModel.uWDept.filter;
                    }
                    if (filterModel.createdDate !== undefined) {
                        searchDataObj.dateRequested = filterModel.createdDate.dateFrom;
                    }
                    if (filterModel.modifiedDate !== undefined) {
                        searchDataObj.modifiedDate = filterModel.modifiedDate.dateFrom;
                    }
                    if (filterModel.statusText !== undefined) {
                        /*searchDataObj.claimStatusTypeText = filterModel.statusText.filter; */
                        searchDataObj.claimStatusTypeText = filterModel.statusText.values.toString();
                    }
                    if (filterModel.createdBy !== undefined) {
                        var userIds = [];
                        var filters = users?.users?.filter(x => {
                            if (filterModel.createdBy.values.includes(x.fullName)) {
                                userIds.push(x.userID);
                                return x.userID;
                            }
                        })
                        searchDataObj.createdBy = userIds.toString();
                    }
                    if (filterModel.grade !== undefined) {
                        if (filterModel.grade.values.toString() === 'Pass') {
                            searchDataObj.qAStatus = 'P';
                        }
                        else if (filterModel.grade.values.toString() === 'Fail') {
                            searchDataObj.qAStatus = 'F'
                        }
                        else {
                            searchDataObj.qAStatus = null;
                        }
                    }
                    if (filterModel.taskOwner !== undefined) {
                        /*searchDataObj.taskOwner = filterModel.taskOwner.filter;*/
                        var userIds = [];
                        users?.users?.filter(x => {
                            if (filterModel.taskOwner.values.includes(x.fullName)) {
                                userIds.push(x.userID);
                                return x.userID;
                            }
                        })
                        searchDataObj.taskOwner = userIds.toString();
                    }

                }
                if (sortCount > 0) {
                    const sortCol = getSortedColumns(columnApi)[0];
                    searchDataObj.orderBy = sortCol.colId + " " + sortCol.sort;
                }
                let query = {
                    "query": `query($accountingSearch:AccountingSearchInputhype!)
                        {
                        `+ accountingSearch + `(accountingSearch: $accountingSearch)
                        {
                            accountingSearchResult{
                                activityID
                                claimMasterID
                                claimID
                                insuredName
                                activityTransactionType
                                genReCompanyName
                                uWDept
                                statutoryClaimID
                                g2LegalEntityID
                                createdDate
                                actionTypeID
                                actionTypeText
                                statusText
                                createdBy
                                grade
                                taskOwner
                                modifiedDate
                                claimType
                                urgent
                            }
                        }
                    }`,
                    "variables": { "accountingSearch": searchDataObj }
                }

                const AccountingGridData = await customGQLQuery(`accounting`, query);
                let accounting = {};
                if (accountingSearch === "accountingDefaultSearch") {
                    accounting = AccountingGridData.data.accountingDefaultSearch.accountingSearchResult;
                }
                else {
                    accounting = AccountingGridData.data.accountingSearch.accountingSearchResult;
                }

                var totalRows = -1;
                if (accounting.length < 50) {
                    totalRows = params.request.startRow + accounting.length;
                }
                params.successCallback(accounting, totalRows);
            }
        }
    }

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

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

    /* End View Funtions */

    React.useEffect(() => {
      
        if ($auth.hasPermission(APP_TYPES.Accounting_Dashboard)) {
            setIsAuthorize(true);
        }
        else {
            setIsAuthorize(false);
        }
        localStorage.removeItem(columnDataKey);
        localStorage.removeItem(sortDataKey);
        localStorage.removeItem(filterDataKey);
        Promise.all([
            loadUsers(),
            loadAccountingTransType(),
            loadClaimStatusTypes()
        ])
            .then(([lu, types , statuses]) => {
                setUsers({
                    users: lu.data.users,
                });
                setAccountingData({ ...accountingData, transTypes: types.data.accountingTranstypeList, statusTypes: statuses });
            });
    }, []);



    return (
        <>
            {isAuthorize ? (
                <AccountingLandingContainer>
                    <AccountingLandingToolbar>
                        <Toolbuttons>

                        </Toolbuttons>
                        <Title>Accounting Dashboard</Title>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                        >
                            <MenuIcon />
                        </IconButton>
                    </AccountingLandingToolbar>
                    <AccountingLandingHeader>
                        { users?.users?.length >  0 ? (
                        <GridContainer className="ag-theme-balham">
                            <AgGridReact
                                defaultColDef={defaultColDef}
                                columnDefs={colDefs}
                                onGridReady={onGridReady}
                                onFilterChanged={onFilterChanged}
                                onSortChanged={onSortChanged}
                                onColumnMoved={onColumnMoved}
                                onColumnVisible={onColumnMoved}
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
                    </AccountingLandingHeader>
                    { users?.users?.length > 0 ? (

                        <DashboardUserGridViews open={open} handleDrawerClose={handleDrawerClose}  userGridViewFunction={userGridViewFunction} gridApi={gridApi} landingPage={landingPage} columnApi={columnApi} />
                    ) : null
                    }
                </AccountingLandingContainer>
            ) : <Unauthorized />}
        </>
    );
};