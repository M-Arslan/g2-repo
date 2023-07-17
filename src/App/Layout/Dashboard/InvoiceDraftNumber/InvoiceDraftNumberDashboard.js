import { Menu as MenuIcon } from '@mui/icons-material';
import { IconButton } from '@mui/material';



import {
    AgGridReact
} from 'ag-grid-react';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { APP_TYPES } from '../../../Core/Enumerations/app/app-types';
import {
    formatDate
} from '../../../Core/Forms/Common';
import { customGQLQuery, loadUsers } from '../../../Core/Services/EntityGateway';
import { userSelectors } from '../../../Core/State/slices/user';
import { getSortedColumns } from '../../../Core/Utility/colStateUtils';
import { CaraUrls } from '../../../Settings';
import { loadAccountingTransType } from '../../Claim/Tabs/Accounting/Queries';
import { Unauthorized } from '../../Unauthorized';
import { DashboardUserGridViews } from '../UserGridViews/DashboardUserGridViews';
import { CLAIM_TYPES } from '../../../Core/Enumerations/app/claim-type';


const InvoiceDraftNumberLandingContainer = styled.div`
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
`;

const InvoiceDraftNumberLandingToolbar = styled.div`
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

const InvoiceDraftNumberLandingHeader = styled.section`
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
export const InvoiceDraftNumberDashboard = ({ match }) => {
    const landingPage = "InvoiceDraftNumberLandingPage";
    const { enqueueSnackbar } = useSnackbar();
    const $auth = useSelector(userSelectors.selectAuthContext());
    const [isAuthorize, setIsAuthorize] = React.useState(true);
    const [accountingData, setAccountingData] = React.useState({
        transTypes: [],
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
                        return <a href={`/legal/${params.data.claimMasterID}/financials#Activity/${params.data.activityID}`} target="_blank">{params.value}</a>;
                    }
                    else {
                        return <a href={`/Claim/${params.data.claimMasterID}/financials#Activity/${params.data.activityID}`} target="_blank">{params.value}</a>;
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
            headerName: 'Draft Number',
            field: 'draftNumber',
            colId: 'draftNumber',
            sortable: true,
            editable: true,
            filter: false,
            tooltipField: "Draft Number",
        },
        {
            headerName: 'Payee Name',
            field: 'payeeName',
            colId: 'payeeName',
            sortable: true,
            filter: "agTextColumnFilter",
            filterParams: {
                filterOptions: ['contains'],
                suppressAndOrCondition: true
            },
            tooltipField: "Payee Name",
        },
        {
            headerName: 'Payment Amount',
            field: 'paymentAmount',
            colId: 'paymentAmount',
            sortable: true,
            filter: false,
            tooltipField: "Payment Amount",
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
            filter: "agTextColumnFilter",
            tooltipField: "Company",
            filterParams: {
                filterOptions: ['contains'],
                suppressAndOrCondition: true
            }
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
            headerName: 'Claim Type',
            field: 'claimType',
            colId: 'claimType',
            sortable: true,
            filter: "agSetColumnFilter",
            tooltipField: "Claim Type",
            valueFormatter: claimTypeValueFormatter,
            filterParams: {
                values: ["Casualty", "Property"],
                suppressAndOrCondition: true
            },
        },
        {
            headerName: 'Activity Type',
            field: 'accountingTransTypeText',
            colId: 'accountingTransTypeText',
            sortable: true,
            filter: "agSetColumnFilter",
            tooltipField: "Activity Type",
            filterParams: {
                values: accountingData.transTypes.map(x => x.accountingTransTypeText),
                suppressAndOrCondition: true
            }
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
            sortable: true,
            filter: false,
            tooltipField: "Invoice Docs",
            cellRenderer: function (params) {
                if (params.data.claimID !== '' && params.data.batchID !== null) {
                    return <a href={`${CARAInvoiceClaimFileURL}${params.data.batchID}`} target="_blank">Claims</a>;
                }
                return '';
            }
        }
    ];

    function claimTypeValueFormatter(params) {
        var value = params.value;
        if (value === "C") {
            return "Casualty";
        }
        else if (value === "P") {
            return "Property";
        }
        else if (value === "L") {
            return "Legal";
        }
    }

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
        sizeToFit();
        setGridFilters();
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
    const sizeToFit = () => {
        gridApi.sizeColumnsToFit();
    };
    const setGridFilters = () => {
        if (selectedView !== null && selectedView !== undefined) {

            try {
                columnApi.applyColumnState(
                {
                    state: JSON.parse(selectedView.columnData),
                    defaultState: { sort: null },
                });
            }
            catch (ex) {

            }
            gridApi.setFilterModel(JSON.parse(selectedView.filterData));
        }
        gridApi.sizeColumnsToFit();

    };
    /* End Grid Functions */
    const userGridViewFunction = (view) => {
        selectedView = view;
        setGridFilters();
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
                let draftNumberSearch = "draftNumberSearch";

                if (gridApi !== undefined) {
                    let filterModel = gridApi.getFilterModel();
                    if (filterModel.claimID !== undefined) {
                        searchDataObj.claimID = filterModel.claimID.filter;
                    }
                    if (filterModel.invoiceNumber !== undefined) {
                        searchDataObj.invoiceNumber = filterModel.invoiceNumber.filter;
                    }
                    if (filterModel.payeeName !== undefined) {
                        searchDataObj.payeeName = filterModel.payeeName.filter;
                    }
                    
                    if (filterModel.statusText !== undefined) {
                        searchDataObj.claimStatusTypeText = filterModel.statusText.values.toString();
                    }

                    if (filterModel.genReCompanyName !== undefined) {
                        searchDataObj.g2LegalEntity = filterModel.genReCompanyName.filter;
                    }
                    if (filterModel.createdDate !== undefined) {
                        searchDataObj.createdDate = filterModel.createdDate.dateFrom;
                    }
                    if (filterModel.modifiedDate !== undefined) {
                        searchDataObj.modifiedDate = filterModel.modifiedDate.dateFrom;
                    }
                    if (filterModel.claimType !== undefined) {
                        //searchDataObj.claimType = filterModel.claimType.values.toString();
                        searchDataObj.claimType = filterModel.claimType.values.toString();
                        searchDataObj.claimType = searchDataObj.claimType.replace("Property", "P").replace("Casualty", "C");
                    }
                    
                    if (filterModel.accountingTransTypeText !== undefined) {
                        searchDataObj.accountingTransTypeText = filterModel.accountingTransTypeText.values.toString();
                    }
                    if (filterModel.createdBy !== undefined) {
                        var userIds = [];
                       users?.users?.filter(x => {
                            if (filterModel.createdBy.values.includes(x.fullName)) {
                                userIds.push(x.userID);
                                return x.userID;
                            }
                        })
                        searchDataObj.requestor = userIds.toString();
                    }
                    if (filterModel.taskOwner !== undefined) {
                        var userIds = [];
                        users?.users?.filter(x => {
                            if (filterModel.taskOwner.values.includes(x.fullName)) {
                                userIds.push(x.userID);
                                return x.userID;
                            }
                        })
                        searchDataObj.taskOwner = userIds.toString();
                    }
                    if (filterModel.claimExaminerFullName !== undefined) {
                        var userIds = [];
                        users?.users?.filter(x => {
                            if (filterModel.claimExaminerFullName.values.includes(x.fullName)) {
                                userIds.push(x.userID);
                                return x.userID;
                            }
                        });
                        searchDataObj.claimExaminerID = userIds.toString();
                    }

                    const sortedCols = getSortedColumns(columnApi);
                    if (sortedCols.length > 0) {
                        const sortedCol = sortedCols[0];
                        if (sortedCol.colId === 'claimExaminerFullName') {
                            searchDataObj.orderBy = "ClaimExaminerID " + sortedCol.sort;
                        }
                        else {
                            searchDataObj.orderBy = sortedCol.colId + " " + sortedCol.sort;
                        }
                    }
                }
                let query = {
                    "query": `query($draftNumberSearch:DraftNumberSearchInputhype!)
                    {
                    `+ draftNumberSearch + `(draftNumberSearch: $draftNumberSearch)
                    {
                        claimInvoiceDraftNumberSearchResult{
                            activityID
                            claimMasterID
                            claimID
                            batchID
                            genReCompanyName
                            invoiceNumber
                            payeeName
                            paymentAmount
                            statusText
                            claimExaminerFirstName
                            claimExaminerLastName
                            createdDate
                            createdBy
                            modifiedDate
                            taskOwner
                            claimExaminerFullName
                            draftNumber
                            paymentVendorID
                            claimType
                            accountingTransTypeText
                        }
                    }
                }`,
                    "variables": { "draftNumberSearch": searchDataObj }
                }

                const InvoiceDraftNumberGridData = await customGQLQuery(`accounting`, query);

                let invoiceDraftNumber = {};
                invoiceDraftNumber = InvoiceDraftNumberGridData.data.draftNumberSearch.claimInvoiceDraftNumberSearchResult;

                var totalRows = -1;
                if (invoiceDraftNumber.length < 50) {
                    totalRows = params.request.startRow + invoiceDraftNumber.length;
                }
                params.successCallback(invoiceDraftNumber, totalRows);
            }
        }
    }

    const saveDraftNumber = async (paymentVendorID, draftNumber) => {
        const query = {
            "query": 'mutation { updateDraftNumber(paymentVendorID:"' + paymentVendorID + '", draftNumber:"' + draftNumber + '")}'
        }
        let result = await customGQLQuery(`accounting`, query);
        if (result.data.updateDraftNumber) {
            enqueueSnackbar('Draft Number Updated.', { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } });
        }
        return result;
    }

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };
    const onCellValueChanged = (params) => {
        const colId = params.column.getId();
        if (colId === 'draftNumber') {
            saveDraftNumber(params.data.paymentVendorID, params.data.draftNumber);

        }
    };

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
            CaraUrls(),
            loadAccountingTransType(),
            loadClaimStatusTypes()
        ])
            .then(([lu, ce, types, statuses]) => {
                setUsers({
                    users: lu.data.users
                });
                setCARAInvoiceClaimFileURL(ce[4]);
                setAccountingData({ ...accountingData, transTypes: types.data.accountingTranstypeList, statusTypes: statuses });
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
                <InvoiceDraftNumberLandingContainer>
                    <InvoiceDraftNumberLandingToolbar>
                        <Toolbuttons>

                        </Toolbuttons>
                        <Title>Draft Number Dashboard</Title>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                        >
                            <MenuIcon />
                        </IconButton>
                    </InvoiceDraftNumberLandingToolbar>
                    <InvoiceDraftNumberLandingHeader>
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
                                onCellValueChanged={onCellValueChanged}
                                rowModelType={'serverSide'}
                                serverSideStoreType={'partial'}
                                cacheBlockSize={50}
                                animateRows={true}
                            >
                            </AgGridReact>
                        </GridContainer>
                    </InvoiceDraftNumberLandingHeader>
                    { users?.users?.length > 0 ? (

                        <DashboardUserGridViews open={open} handleDrawerClose={handleDrawerClose} setData={setDataOfMetadata} userGridViewFunction={userGridViewFunction} gridApi={gridApi} landingPage={landingPage} columnApi={columnApi} />
                    ) : null
                    }
                </InvoiceDraftNumberLandingContainer>
            ) : <Unauthorized />}
        </>
    );
};